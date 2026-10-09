-- ==============================================================================
-- GBC_AI_agentic - Supabase PostgreSQL Schema (Production 3NF & RLS Guard)
-- Nền tảng điều phối DevOps CI/CD & AI Agentic
-- ==============================================================================

-- Bật extension pgcrypto để sinh UUID ngẫu nhiên
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG QUẢN LÝ CẤU HÌNH PIPELINES (WORKFLOW_PIPELINES)
CREATE TABLE IF NOT EXISTS public.workflow_pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL DEFAULT 'workflow-default',
    name TEXT NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index tối ưu tìm kiếm theo project_id và trạng thái kích hoạt
CREATE INDEX IF NOT EXISTS idx_workflow_pipelines_project 
ON public.workflow_pipelines(project_id, is_active);

-- 2. BẢNG LỊCH SỬ THỰC THI PIPELINE (PIPELINE_EXECUTIONS)
CREATE TABLE IF NOT EXISTS public.pipeline_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id TEXT NOT NULL UNIQUE,
    pipeline_id UUID REFERENCES public.workflow_pipelines(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    branch TEXT NOT NULL DEFAULT 'main',
    commit_hash TEXT NOT NULL,
    commit_msg TEXT,
    author TEXT NOT NULL DEFAULT 'Ktee',
    environment TEXT NOT NULL DEFAULT 'LOCAL_WORKSPACE',
    status TEXT NOT NULL CHECK (status IN ('RUNNING', 'SUCCESS', 'WARNING', 'FAILED')),
    total_nodes INT NOT NULL DEFAULT 0,
    passed_nodes INT NOT NULL DEFAULT 0,
    failed_nodes INT NOT NULL DEFAULT 0,
    quality_gate TEXT DEFAULT 'PASSED_GRADE_A',
    cve_critical INT DEFAULT 0,
    secrets_leaked INT DEFAULT 0,
    total_duration_ms INT NOT NULL DEFAULT 0,
    summary JSONB DEFAULT '{}'::jsonb,
    nodes_result JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pipeline_executions_created 
ON public.pipeline_executions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pipeline_executions_status 
ON public.pipeline_executions(status);

-- 3. BẢNG LƯU TRỮ KEY POOL (API_KEY_VAULT)
CREATE TABLE IF NOT EXISTS public.api_key_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alias TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('Gemini', '9Router', 'DeepSeek', 'Claude', 'OpenAI')),
    model TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
    masked_key TEXT NOT NULL,
    encrypted_key TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COOLDOWN', 'EXHAUSTED', 'INVALID')),
    cooldown_until TIMESTAMPTZ,
    tokens_burned BIGINT NOT NULL DEFAULT 0,
    requests_count INT NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_key_vault_status 
ON public.api_key_vault(status, is_enabled);

-- 4. BẢNG AUDIT LOG HOẠT ĐỘNG CỦA 13 AGENTS (AGENT_AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS public.agent_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_code TEXT NOT NULL,
    agent_name TEXT NOT NULL,
    stage_id TEXT,
    step_index INT DEFAULT 0,
    log_type TEXT NOT NULL,
    title TEXT NOT NULL,
    thinking TEXT,
    tool_name TEXT,
    tool_args JSONB,
    tool_output TEXT,
    status TEXT NOT NULL DEFAULT 'SUCCESS',
    duration_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_audit_logs_agent 
ON public.agent_audit_logs(agent_code, created_at DESC);

-- ==============================================================================
-- CẤU HÌNH ROW LEVEL SECURITY (RLS GUARD)
-- ==============================================================================
ALTER TABLE public.workflow_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_key_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_audit_logs ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách cho phép đọc và ghi đối với authenticated & anon (có thể siết chặt theo vai trò RBAC sau)
CREATE POLICY "Allow public read workflow_pipelines" 
ON public.workflow_pipelines FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update workflow_pipelines" 
ON public.workflow_pipelines FOR ALL USING (true);

CREATE POLICY "Allow public read pipeline_executions" 
ON public.pipeline_executions FOR SELECT USING (true);

CREATE POLICY "Allow public insert pipeline_executions" 
ON public.pipeline_executions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read api_key_vault" 
ON public.api_key_vault FOR SELECT USING (true);

CREATE POLICY "Allow public manage api_key_vault" 
ON public.api_key_vault FOR ALL USING (true);

CREATE POLICY "Allow public read agent_audit_logs" 
ON public.agent_audit_logs FOR SELECT USING (true);

CREATE POLICY "Allow public insert agent_audit_logs" 
ON public.agent_audit_logs FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- KÍCH HOẠT SUPABASE REALTIME REPLICATION CHO CÁC BẢNG TRỌNG YẾU
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.workflow_pipelines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pipeline_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_key_vault;
