import { NextRequest, NextResponse } from 'next/server';
import { runtimeState } from '@/lib/state';
import { ARENA_EVALUATION_CRITERIA } from '@/lib/constants';
import { SoloBattleResult, CriteriaScore } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * POST /api/solo-battle
 * Mô phỏng trận đấu 1v1 Arena Solo giữa Squad Agent vs Trending GitHub Repo
 * Đánh giá 5 tiêu chuẩn khắt khe và đưa ra đề xuất Tuyển Dụng (Hire Skill)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoFullName, agentCode } = body;

    if (!repoFullName || !agentCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Yêu cầu truyền repoFullName (ví dụ: "microsoft/autogen") và agentCode (ví dụ: "LEADER_NLP")',
        },
        { status: 400 }
      );
    }

    // 1. Tìm thông tin Repo & Agent
    const repo =
      runtimeState.repos.find(
        (r) => r.fullName.toLowerCase() === repoFullName.toLowerCase() || r.name.toLowerCase() === repoFullName.toLowerCase()
      ) || {
        name: repoFullName.split('/')[1] || repoFullName,
        fullName: repoFullName,
        stars: 25000,
        language: 'TypeScript',
        description: 'Kho mã nguồn mở hàng đầu cộng đồng.',
        topics: ['ai', 'agent', 'workflow'],
        roleFitCategory: 'ARCHITECT',
        agentInTeamStatus: 'ALREADY_HAVE',
      };

    const agent =
      runtimeState.agents.find(
        (a) => a.code === agentCode || a.id === agentCode || a.name.toLowerCase().includes(agentCode.toLowerCase())
      ) || runtimeState.agents[0];

    // 2. Chấm điểm chi tiết trên 5 tiêu chuẩn
    const starsBonus = Math.min(Math.round((repo.stars || 10000) / 2500), 10);
    const agentSuccessBonus = Math.round((agent.metrics?.successRate || 98) / 10);

    const criteriaScores: CriteriaScore[] = [
      {
        name: 'Architecture & Scalability',
        nameVi: 'Kiến Trúc & Khả Năng Mở Rộng',
        repoScore: Math.min(85 + starsBonus, 99),
        agentScore: 92,
        weight: 0.25,
        analysis: `${repo.name} sở hữu cấu trúc module hóa phân tán đã qua kiểm chứng bởi ${repo.stars?.toLocaleString() || 'hàng chục ngàn'} nhà phát triển. Agent ${agent.name} có ưu thế thiết kế luồng dữ liệu micro-pipeline nội bộ liền mạch.`,
      },
      {
        name: 'Code Quality & Clean Code',
        nameVi: 'Chất Lượng Code & Clean Code',
        repoScore: repo.language === 'TypeScript' ? 94 : 88,
        agentScore: 96,
        weight: 0.20,
        analysis: `Squad Agent tuân thủ nghiêm ngặt chuẩn TypeScript Type-Safety và quy tắc Clean Code. Repo ${repo.name} (${repo.language}) có kiến trúc mã nguồn mở phong phú nhưng đòi hỏi adapter tương thích.`,
      },
      {
        name: 'Speed & Latency Optimization',
        nameVi: 'Tốc Độ & Độ Trễ (Latency)',
        repoScore: 86,
        agentScore: Math.min(90 + (agent.metrics?.avgResponseMs ? Math.max(100 - Math.round(agent.metrics.avgResponseMs / 10), 0) : 8), 99),
        weight: 0.20,
        analysis: `Agent ${agent.name} đạt độ trễ cực thấp với Realtime Bus 0ms. Repo ${repo.name} có thời gian khởi tạo trung bình cần tối ưu hóa caching.`,
      },
      {
        name: 'Security & Strict RBAC Guard',
        nameVi: 'Bảo Mật & Phân Quyền RBAC',
        repoScore: 82,
        agentScore: 98,
        weight: 0.20,
        analysis: `Agent áp dụng Strict Role Guard (ADMIN_CEO/HEAD vs DEV/Staff) và PostgreSQL RLS triệt để. Repo mã nguồn mở cần thêm lớp bọc bảo mật khi triển khai nội bộ.`,
      },
      {
        name: 'Mobile 430px UX & Developer Experience',
        nameVi: 'Trải Nghiệm Mobile 430px & DX',
        repoScore: repo.topics?.includes('ui') || repo.topics?.includes('tailwind') ? 95 : 80,
        agentScore: 95,
        weight: 0.15,
        analysis: `Giao diện Squad tối ưu 100% chuẩn Mobile 430px (iPhone 14 Pro Max) và Touch Targets 28-38px. Repo cung cấp hệ sinh thái tài liệu DX xuất sắc.`,
      },
    ];

    // 3. Tính điểm tổng kết có trọng số
    const scoreRepo = Math.round(
      criteriaScores.reduce((sum, c) => sum + c.repoScore * c.weight, 0)
    );
    const scoreAgent = Math.round(
      criteriaScores.reduce((sum, c) => sum + c.agentScore * c.weight, 0)
    );

    let winner: 'REPO' | 'AGENT' | 'DRAW' = 'DRAW';
    if (scoreRepo > scoreAgent + 2) winner = 'REPO';
    else if (scoreAgent > scoreRepo + 2) winner = 'AGENT';

    // 4. Sinh Nhật ký đối đầu 3 hiệp (Battle Log)
    const battleLog = [
      {
        round: 1,
        topic: 'Hiệp 1: Khảo sát Kiến trúc Phân tán & Độ mở rộng',
        commentary: `${repo.name} tung đòn tấn công với hệ thống module phân tán khổng lồ (${repo.stars?.toLocaleString()} stars). Tuy nhiên ${agent.name} phòng thủ vững chắc nhờ luồng điều phối tác tử khép kín.`,
        advantage: (scoreRepo > scoreAgent ? 'REPO' : 'AGENT') as 'REPO' | 'AGENT' | 'EQUAL',
      },
      {
        round: 2,
        topic: 'Hiệp 2: Tốc độ xử lý & Đồng bộ Realtime Bus 0ms',
        commentary: `${agent.name} bứt tốc ngoạn mục với Realtime Bus 0ms (CustomEvent + Storage sync), vượt qua độ trễ mạng của các thư viện ngoại vi.`,
        advantage: 'AGENT' as 'REPO' | 'AGENT' | 'EQUAL',
      },
      {
        round: 3,
        topic: 'Hiệp 3: Kiểm soát Bảo mật RBAC & Tích hợp Hệ sinh thái',
        commentary: `Hai bên tạo nên thế trận so kè nảy lửa. ${repo.name} mang lại kho tri thức mở khổng lồ, trong khi ${agent.name} giữ vững tường lửa bảo vệ dữ liệu nghiệp vụ.`,
        advantage: (winner === 'REPO' ? 'REPO' : 'EQUAL') as 'REPO' | 'AGENT' | 'EQUAL',
      },
    ];

    // 5. Tổng kết nhận định và Đề xuất Tuyển dụng
    const shouldHire = scoreRepo >= 80 || winner === 'REPO' || repo.agentInTeamStatus === 'NEW_ROLE_GAP';
    const suggestedAction = scoreRepo >= 92 ? 'INTEGRATE_MCP' : 'IMPORT_AS_SKILL';
    const hireTitle = `[Squad Skill] ${repo.name.toUpperCase()} AI Accelerator`;
    const rationale = `Repo ${repo.fullName} đạt ${scoreRepo}/100 điểm. Khi tích hợp vào Squad Agent (${agent.name}), sẽ gia tăng 45% năng lực xử lý tự động và bổ sung công cụ chuyên sâu.`;

    const summaryVerdict = `Trận đấu Arena 1v1 kết thúc với kết quả ${
      winner === 'AGENT'
        ? `Chiến thắng thuyết phục cho Squad Agent ${agent.name} (${scoreAgent} vs ${scoreRepo})`
        : winner === 'REPO'
        ? `Repo ${repo.name} chiếm ưu thế nhờ sức mạnh cộng đồng mã nguồn mở (${scoreRepo} vs ${scoreAgent})`
        : `Kết quả Hòa cân bằng kịch tính (${scoreAgent} - ${scoreRepo})`
    }. Đề xuất: ${shouldHire ? 'NÊN TUYỂN DỤNG VÀO SQUAD AGENT' : 'TIẾP TỤC DUY TRÌ BỘ AGENT HIỆN TẠI'}.`;

    const battleResult: SoloBattleResult = {
      id: `battle_${Date.now()}`,
      repoFullName: repo.fullName,
      repoName: repo.name,
      agentCode: agent.code,
      agentName: agent.name,
      matchDate: new Date().toISOString(),
      winner,
      scoreRepo,
      scoreAgent,
      criteriaScores,
      battleLog,
      summaryVerdict,
      hireRecommendation: {
        shouldHire,
        suggestedAction,
        hireTitle,
        rationale,
      },
    };

    // Lưu vào danh sách trận đấu gần đây
    runtimeState.recentBattles.unshift(battleResult);
    if (runtimeState.recentBattles.length > 20) {
      runtimeState.recentBattles = runtimeState.recentBattles.slice(0, 20);
    }

    return NextResponse.json({
      success: true,
      message: 'Mô phỏng trận đấu 1v1 Arena Solo hoàn tất!',
      data: battleResult,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Lỗi xử lý 1v1 Solo Battle API',
      },
      { status: 500 }
    );
  }
}
