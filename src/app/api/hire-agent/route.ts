import { NextRequest, NextResponse } from 'next/server';
import { runtimeState } from '@/lib/state';
import { HiredSkillProposal, AgentLogStep } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/hire-agent
 * Lấy danh sách toàn bộ kỹ năng/repo đã được tuyển dụng và tích hợp vào Squad Agent
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let list = [...runtimeState.hiredSkills];

    if (category) {
      list = list.filter((item) => item.category === category);
    }
    if (status) {
      list = list.filter((item) => item.status === status);
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Lỗi lấy danh sách Hired Skills',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/hire-agent
 * Tuyển dụng & Tích hợp kho mã nguồn mở vào hệ thống kỹ năng Squad Agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoFullName, skillName, category, assignedSquad, rationale, hiredBy } = body;

    if (!repoFullName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thiếu trường repoFullName (ví dụ: "microsoft/autogen")',
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem repo đã được tuyển dụng chưa
    const existingIndex = runtimeState.hiredSkills.findIndex(
      (h) => h.repoFullName.toLowerCase() === repoFullName.toLowerCase()
    );

    if (existingIndex !== -1) {
      return NextResponse.json({
        success: true,
        message: `Kỹ năng từ repo ${repoFullName} đã được tích hợp trước đó!`,
        data: runtimeState.hiredSkills[existingIndex],
        alreadyHired: true,
      });
    }

    // Tìm repo tương ứng trong repos state để lấy thông tin gợi ý
    const repo = runtimeState.repos.find(
      (r) => r.fullName.toLowerCase() === repoFullName.toLowerCase()
    );

    const repoName = repo?.name || repoFullName.split('/')[1] || repoFullName;
    const finalCategory = category || repo?.roleFitCategory || 'ARCHITECT';
    const finalSkillName = skillName || `${repoName} Integration Module`;
    const finalAssignedSquad = assignedSquad || `Squad ${finalCategory} Specialist`;
    const finalHiredBy = hiredBy || 'ADMIN_CEO';
    const finalRationale =
      rationale ||
      repo?.whyUseful ||
      `Tích hợp thành công kho mã nguồn mở ${repoFullName} vào bộ công cụ Squad.`;

    const newProposal: HiredSkillProposal = {
      id: `hire_${Date.now()}`,
      repoFullName,
      skillName: finalSkillName,
      category: finalCategory,
      assignedSquad: finalAssignedSquad,
      status: 'INTEGRATED',
      rationale: finalRationale,
      hiredBy: finalHiredBy,
      createdAt: new Date().toISOString(),
    };

    // Thêm vào danh sách Hired Skills
    runtimeState.hiredSkills.unshift(newProposal);

    // Cập nhật trạng thái isHired = true cho repo
    if (repo) {
      repo.isHired = true;
    }

    // Ghi nhận nhật ký step log mới vào pipeline
    const logStep: AgentLogStep = {
      id: `log_hire_${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentCode: 'LEADER_NLP',
      stageId: 'stage_4',
      stepIndex: runtimeState.logs.length + 1,
      type: 'TOOL_RESULT',
      title: `Tuyển Dụng & Kích Hoạt Skill: ${finalSkillName}`,
      thinking: `Phê duyệt bởi ${finalHiredBy}. Phân bổ năng lực mới về cho ${finalAssignedSquad}.`,
      toolName: 'agent-squad-hire-engine',
      toolOutput: `Tích hợp thành công ${repoFullName} với trạng thái INTEGRATED.`,
      status: 'SUCCESS',
      durationMs: 250,
    };
    runtimeState.logs.unshift(logStep);

    return NextResponse.json({
      success: true,
      message: `Đã tuyển dụng và tích hợp thành công "${finalSkillName}" vào Squad Agent!`,
      data: newProposal,
      totalHired: runtimeState.hiredSkills.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Lỗi xử lý POST Hire Agent API',
      },
      { status: 500 }
    );
  }
}
