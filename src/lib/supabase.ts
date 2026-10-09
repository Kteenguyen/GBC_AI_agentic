import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhfxfzxvfgdgoxvpwqac.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fFv9RG-eR_BJc45VNB983Q_IQjDixSP';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GCM_EVENTS = {
  PIPELINE_UPDATED: 'gcm_pipeline_updated',
  AGENT_UPDATED: 'gcm_agent_updated',
  QA_UPDATED: 'gcm_qa_updated',
  BATTLE_UPDATED: 'gcm_battle_updated',
  HIRED_UPDATED: 'gcm_hired_updated',
  LOG_ADDED: 'gcm_log_added',
  STAGE_CHANGED: 'gcm_stage_changed',
} as const;

/**
 * Bắn Realtime Event đa kênh:
 * 1. window.dispatchEvent (Local tab event bus)
 * 2. localStorage (Đồng bộ đa tab cùng trình duyệt)
 * 3. Supabase Realtime Broadcast Channel (Đồng bộ qua Internet giữa Mobile & Desktop)
 */
export function emitRealtimeEvent(eventName: string, detail?: any) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);

    try {
      localStorage.setItem('__gcm_last_event__', JSON.stringify({
        event: eventName,
        timestamp: Date.now(),
        detail
      }));
    } catch (e) {
      // ignore
    }

    // Gửi qua Supabase Realtime Broadcast nếu client sẵn sàng
    try {
      const channel = supabase.channel('workflow_live_bus');
      channel.send({
        type: 'broadcast',
        event: eventName,
        payload: detail
      }).catch(() => {});
    } catch (e) {
      // ignore broadcast failure
    }
  }
}

/**
 * Đăng ký lắng nghe sự kiện Realtime đa kênh
 */
export function subscribeRealtimeEvent(eventName: string, handler: (detail: any) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const listener = (event: Event) => {
    const customEvent = event as CustomEvent;
    handler(customEvent.detail);
  };

  const storageListener = (e: StorageEvent) => {
    if (e.key === '__gcm_last_event__' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed.event === eventName) {
          handler(parsed.detail);
        }
      } catch (err) {
        // ignore
      }
    }
  };

  window.addEventListener(eventName, listener);
  window.addEventListener('storage', storageListener);

  // Đăng ký nhận Broadcast từ Supabase Realtime
  let supabaseChannel: any = null;
  try {
    supabaseChannel = supabase.channel('workflow_live_bus')
      .on('broadcast', { event: eventName }, (payload) => {
        handler(payload.payload);
      })
      .subscribe();
  } catch (e) {
    // fallback gracefully
  }

  return () => {
    window.removeEventListener(eventName, listener);
    window.removeEventListener('storage', storageListener);
    if (supabaseChannel) {
      supabase.removeChannel(supabaseChannel);
    }
  };
}

// ==============================================================================
// CÁC HÀM TƯƠNG TÁC CƠ SỞ DỮ LIỆU SUPABASE POSTGRESQL THỰC TẾ
// ==============================================================================

export interface DbWorkflowPipeline {
  id?: string;
  project_id: string;
  name: string;
  description?: string;
  nodes: any[];
  edges: any[];
  is_active?: boolean;
}

/**
 * Lưu trạng thái Workflow Pipeline lên Supabase
 */
export async function saveWorkflowPipelineToDb(pipeline: DbWorkflowPipeline): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('workflow_pipelines')
      .upsert({
        project_id: pipeline.project_id,
        name: pipeline.name,
        description: pipeline.description || '',
        nodes: pipeline.nodes,
        edges: pipeline.edges,
        is_active: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'project_id' })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase DB] Không thể lưu pipeline vào database:', error.message);
      // Fallback local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`gcm_pipeline_${pipeline.project_id}`, JSON.stringify(pipeline));
      }
      return { success: false, error: error.message };
    }

    emitRealtimeEvent(GCM_EVENTS.PIPELINE_UPDATED, data);
    return { success: true, data };
  } catch (err: any) {
    console.warn('[Supabase DB Error]', err?.message);
    return { success: false, error: err?.message };
  }
}

/**
 * Tải cấu hình Pipeline mới nhất từ Supabase
 */
export async function fetchWorkflowPipelineFromDb(projectId = 'workflow-default'): Promise<DbWorkflowPipeline | null> {
  try {
    const { data, error } = await supabase
      .from('workflow_pipelines')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      // Fallback local storage
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(`gcm_pipeline_${projectId}`);
        if (cached) return JSON.parse(cached);
      }
      return null;
    }

    return data as DbWorkflowPipeline;
  } catch (err) {
    return null;
  }
}

export interface DbPipelineExecution {
  execution_id: string;
  project_name: string;
  branch: string;
  commit_hash: string;
  commit_msg?: string;
  author: string;
  environment?: string;
  status: 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  total_nodes: number;
  passed_nodes: number;
  failed_nodes: number;
  quality_gate?: string;
  cve_critical?: number;
  secrets_leaked?: number;
  total_duration_ms: number;
  summary?: any;
  nodes_result: any[];
}

/**
 * Ghi nhận lịch sử thực thi Pipeline vào database Supabase
 */
export async function recordPipelineExecutionToDb(exec: DbPipelineExecution): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('pipeline_executions')
      .insert({
        execution_id: exec.execution_id,
        project_name: exec.project_name,
        branch: exec.branch,
        commit_hash: exec.commit_hash,
        commit_msg: exec.commit_msg || '',
        author: exec.author,
        environment: exec.environment || 'LOCAL_WORKSPACE',
        status: exec.status,
        total_nodes: exec.total_nodes,
        passed_nodes: exec.passed_nodes,
        failed_nodes: exec.failed_nodes,
        quality_gate: exec.quality_gate || 'PASSED_GRADE_A',
        cve_critical: exec.cve_critical || 0,
        secrets_leaked: exec.secrets_leaked || 0,
        total_duration_ms: exec.total_duration_ms,
        summary: exec.summary || {},
        nodes_result: exec.nodes_result
      })
      .select()
      .single();

    if (error) {
      console.warn('[Supabase DB] Lỗi lưu execution history:', error.message);
      return { success: false, error: error.message };
    }

    emitRealtimeEvent('gcm_pipeline_execution_recorded', data);
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Tải danh sách lịch sử thực thi gần nhất từ Supabase
 */
export async function fetchPipelineExecutionHistory(limit = 10): Promise<DbPipelineExecution[]> {
  try {
    const { data, error } = await supabase
      .from('pipeline_executions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as DbPipelineExecution[];
  } catch (err) {
    return [];
  }
}

/**
 * Ghi nhận Audit Log hoạt động của AI Agent vào Supabase
 */
export async function recordAgentAuditLogToDb(log: {
  agent_code: string;
  agent_name: string;
  stage_id?: string;
  step_index?: number;
  log_type: string;
  title: string;
  thinking?: string;
  tool_name?: string;
  tool_args?: any;
  tool_output?: string;
  status?: string;
  duration_ms?: number;
}): Promise<void> {
  try {
    await supabase
      .from('agent_audit_logs')
      .insert({
        agent_code: log.agent_code,
        agent_name: log.agent_name,
        stage_id: log.stage_id || '',
        step_index: log.step_index || 0,
        log_type: log.log_type,
        title: log.title,
        thinking: log.thinking || '',
        tool_name: log.tool_name || '',
        tool_args: log.tool_args || null,
        tool_output: log.tool_output || '',
        status: log.status || 'SUCCESS',
        duration_ms: log.duration_ms || 0
      });
  } catch (err) {
    // ignore
  }
}
