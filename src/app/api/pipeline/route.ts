import { NextRequest, NextResponse } from 'next/server';
import { runtimeState, resetRuntimeState } from '@/lib/state';
import { AgentLogStep } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pipeline
 * Lấy danh sách 8 Stages, Agent Logs chi tiết, Squad Agents và Tóm tắt tổng thể
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stageId = searchParams.get('stageId');
    const agentCode = searchParams.get('agentCode');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let filteredLogs = [...runtimeState.logs];

    if (stageId) {
      filteredLogs = filteredLogs.filter((log) => log.stageId === stageId);
    }
    if (agentCode) {
      filteredLogs = filteredLogs.filter((log) => log.agentCode === agentCode);
    }

    filteredLogs = filteredLogs.slice(0, limit);

    const completedStages = runtimeState.stages.filter((s) => s.status === 'completed').length;
    const runningStages = runtimeState.stages.filter((s) => s.status === 'running').length;
    const activeStage = runtimeState.stages.find((s) => s.status === 'running') || null;

    const summary = {
      totalStages: runtimeState.stages.length,
      completedStages,
      runningStages,
      overallProgress: Math.round((completedStages / runtimeState.stages.length) * 100),
      activeStage,
      totalAgents: runtimeState.agents.length,
      runningAgents: runtimeState.agents.filter((a) => a.status === 'running').length,
      totalLogs: runtimeState.logs.length,
      totalQATests: runtimeState.qaTests.length,
      passedQATests: runtimeState.qaTests.filter((t) => t.status === 'PASS').length,
    };

    return NextResponse.json({
      success: true,
      data: {
        stages: runtimeState.stages,
        agents: runtimeState.agents,
        logs: filteredLogs,
        qaTests: runtimeState.qaTests,
        summary,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Internal Server Error in Pipeline API',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pipeline
 * Thực hiện chuyển Stage, thêm Log mới hoặc cập nhật Agent State
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Thiếu trường action trong request body (advance_stage | add_log | update_agent | reset)' },
        { status: 400 }
      );
    }

    // 1. ACTION: RESET PIPELINE
    if (action === 'reset') {
      const newState = resetRuntimeState();
      return NextResponse.json({
        success: true,
        message: 'Pipeline đã được reset về trạng thái khởi tạo ban đầu.',
        data: newState,
      });
    }

    // 2. ACTION: ADVANCE STAGE
    if (action === 'advance_stage') {
      const { stageId } = body;
      const stages = runtimeState.stages;

      let currentIndex = -1;
      if (stageId) {
        currentIndex = stages.findIndex((s) => s.id === stageId);
      } else {
        currentIndex = stages.findIndex((s) => s.status === 'running');
      }

      if (currentIndex === -1) {
        // Nếu không có stage nào running, chuyển stage 1 sang running
        if (stages.length > 0 && stages[0].status === 'pending') {
          stages[0].status = 'running';
          stages[0].startedAt = new Date().toISOString();
        }
      } else {
        // Hoàn thành stage hiện tại
        stages[currentIndex].status = 'completed';
        stages[currentIndex].completedAt = new Date().toISOString();
        stages[currentIndex].testPassRate = 100;

        // Kích hoạt stage kế tiếp nếu có
        const nextIndex = currentIndex + 1;
        if (nextIndex < stages.length) {
          stages[nextIndex].status = 'running';
          stages[nextIndex].startedAt = new Date().toISOString();

          // Cập nhật Agent đảm nhiệm stage tiếp theo
          const nextStage = stages[nextIndex];
          const agent = runtimeState.agents.find((a) => a.code === nextStage.primaryAgentCode);
          if (agent) {
            agent.status = 'running';
            agent.currentStageId = nextStage.id;
            agent.currentTask = `Đang thực thi ${nextStage.name}`;
            agent.lastActive = new Date().toISOString();
          }

          // Thêm log chuyển giao
          const newStep: AgentLogStep = {
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
            agentCode: nextStage.primaryAgentCode,
            stageId: nextStage.id,
            stepIndex: runtimeState.logs.length + 1,
            type: 'USER_INPUT',
            title: `Bắt đầu ${nextStage.name}`,
            thinking: `Chỉ huy Supreme NLP Leader đã phê duyệt và chuyển giao quyền thực thi sang Agent ${nextStage.primaryAgentCode}.`,
            status: 'RUNNING',
            durationMs: 150,
          };
          runtimeState.logs.unshift(newStep);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Chuyển đổi Stage thành công!',
        data: {
          stages: runtimeState.stages,
          logs: runtimeState.logs.slice(0, 30),
          agents: runtimeState.agents,
        },
      });
    }

    // 3. ACTION: ADD LOG
    if (action === 'add_log') {
      const { log } = body;
      if (!log || !log.title) {
        return NextResponse.json(
          { success: false, error: 'Thiếu thông tin log step (title, agentCode, stageId)' },
          { status: 400 }
        );
      }

      const newLog: AgentLogStep = {
        id: log.id || `log_${Date.now()}`,
        timestamp: log.timestamp || new Date().toISOString(),
        agentCode: log.agentCode || 'LEADER_NLP',
        stageId: log.stageId || 'stage_4',
        stepIndex: runtimeState.logs.length + 1,
        type: log.type || 'THINKING',
        title: log.title,
        thinking: log.thinking,
        toolName: log.toolName,
        toolArgs: log.toolArgs,
        toolOutput: log.toolOutput,
        commandLine: log.commandLine,
        exitCode: log.exitCode,
        status: log.status || 'SUCCESS',
        durationMs: log.durationMs || 120,
      };

      runtimeState.logs.unshift(newLog);

      // Cập nhật logsCount cho stage tương ứng
      const stage = runtimeState.stages.find((s) => s.id === newLog.stageId);
      if (stage) {
        stage.logsCount = (stage.logsCount || 0) + 1;
      }

      return NextResponse.json({
        success: true,
        message: 'Đã thêm Log Step mới vào pipeline!',
        data: {
          log: newLog,
          totalLogs: runtimeState.logs.length,
        },
      });
    }

    // 4. ACTION: UPDATE AGENT
    if (action === 'update_agent') {
      const { agentCode, updates } = body;
      const agentIndex = runtimeState.agents.findIndex((a) => a.code === agentCode || a.id === agentCode);
      if (agentIndex === -1) {
        return NextResponse.json(
          { success: false, error: `Không tìm thấy agent với code: ${agentCode}` },
          { status: 404 }
        );
      }

      runtimeState.agents[agentIndex] = {
        ...runtimeState.agents[agentIndex],
        ...updates,
        lastActive: new Date().toISOString(),
      };

      return NextResponse.json({
        success: true,
        message: `Đã cập nhật trạng thái agent ${agentCode}`,
        data: runtimeState.agents[agentIndex],
      });
    }

    return NextResponse.json(
      { success: false, error: `Action không hợp lệ: ${action}` },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Lỗi xử lý POST request Pipeline API',
      },
      { status: 500 }
    );
  }
}
