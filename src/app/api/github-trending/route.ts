import { NextRequest, NextResponse } from 'next/server';
import { runtimeState } from '@/lib/state';
import { BASELINE_GITHUB_REPOS } from '@/lib/constants';
import { GitHubTrendingRepo, AgentCategory } from '@/types';

export const dynamic = 'force-dynamic';

function inferSquadFit(repo: any): {
  roleFitCategory: AgentCategory;
  matchedAgentCode: string;
  agentInTeamStatus: 'ALREADY_HAVE' | 'NEW_ROLE_GAP';
  capabilitySummary: string;
  whyUseful: string;
} {
  const topics = (repo.topics || []).map((t: string) => t.toLowerCase());
  const desc = (repo.description || '').toLowerCase();
  const name = (repo.name || '').toLowerCase();
  const lang = (repo.language || '').toLowerCase();
  const allText = `${name} ${desc} ${topics.join(' ')} ${lang}`;

  let roleFitCategory: AgentCategory = 'ARCHITECT';
  let matchedAgentCode = 'ARCH_REX';
  let agentInTeamStatus: 'ALREADY_HAVE' | 'NEW_ROLE_GAP' = 'ALREADY_HAVE';
  let capabilitySummary = 'Công cụ hỗ trợ kiến trúc và quy trình hệ thống phân tán.';
  let whyUseful = 'Nâng cấp khả năng điều phối cho kiến trúc sư trưởng Rex.';

  if (allText.includes('test') || allText.includes('qa') || allText.includes('playwright') || allText.includes('crawler') || allText.includes('browser-use') || allText.includes('automation')) {
    roleFitCategory = 'QA';
    matchedAgentCode = 'QA_AUTOMATION';
    agentInTeamStatus = allText.includes('browser-use') ? 'NEW_ROLE_GAP' : 'ALREADY_HAVE';
    capabilitySummary = 'Framework kiểm thử tự động, browser automation và visual regression validation.';
    whyUseful = 'Vũ khí nâng cao chất lượng cho QA Testing Subagent đạt chuẩn 100% test pass rate.';
  } else if (allText.includes('ui') || allText.includes('frontend') || allText.includes('tailwind') || allText.includes('component') || allText.includes('react') || allText.includes('svelte')) {
    roleFitCategory = 'FRONTEND';
    matchedAgentCode = 'UX_MOBILE_430';
    agentInTeamStatus = 'ALREADY_HAVE';
    capabilitySummary = 'Hệ thống component UI chuẩn responsive Touch-first và Dark Mode.';
    whyUseful = 'Hỗ trợ Mobile UX Architect và Alex xây dựng giao diện 430px Pixel-Perfect.';
  } else if (allText.includes('backend') || allText.includes('database') || allText.includes('supabase') || allText.includes('postgres') || allText.includes('mcp') || allText.includes('server')) {
    roleFitCategory = 'BACKEND';
    matchedAgentCode = 'BACKEND_REALTIME';
    agentInTeamStatus = 'ALREADY_HAVE';
    capabilitySummary = 'Hạ tầng kết nối Backend, Database REST và giao thức MCP Server.';
    whyUseful = 'Gia cố Backend & Supabase Realtime Guard cho luồng truyền tin 0ms.';
  } else if (allText.includes('devops') || allText.includes('cli') || allText.includes('docker') || allText.includes('deploy') || allText.includes('vercel') || allText.includes('infra')) {
    roleFitCategory = 'DEVOPS';
    matchedAgentCode = 'DEVOPS_PARITY';
    agentInTeamStatus = 'ALREADY_HAVE';
    capabilitySummary = 'Tự động hóa CI/CD, đóng gói môi trường và giám sát Parity triển khai.';
    whyUseful = 'Giúp DevOps Parity Officer kiểm soát zero-downtime release và parity gate.';
  } else if (allText.includes('memory') || allText.includes('cache') || allText.includes('token') || allText.includes('compression')) {
    roleFitCategory = 'OPTIMIZER';
    matchedAgentCode = 'OPT_MASON';
    agentInTeamStatus = 'ALREADY_HAVE';
    capabilitySummary = 'Tối ưu hóa vector memory, quản lý phiên làm việc và nén ngữ cảnh context.';
    whyUseful = 'Trợ lực cho Mason (Context Optimizer) giảm tiêu thụ token và tăng tốc xử lý.';
  } else if (allText.includes('research') || allText.includes('analyst') || allText.includes('scraping') || allText.includes('gpt-researcher')) {
    roleFitCategory = 'ANALYST';
    matchedAgentCode = 'ANALYST_ARIA';
    agentInTeamStatus = 'NEW_ROLE_GAP';
    capabilitySummary = 'Nghiên cứu thị trường tự động, tổng hợp dữ liệu chuyên sâu và xuất báo cáo.';
    whyUseful = 'Mở rộng năng lực nghiên cứu độc lập cho Workflow Analyst Aria.';
  } else if (allText.includes('autogen') || allText.includes('multi-agent') || allText.includes('leader') || allText.includes('swarm')) {
    roleFitCategory = 'LEADER';
    matchedAgentCode = 'LEADER_NLP';
    agentInTeamStatus = 'ALREADY_HAVE';
    capabilitySummary = 'Điều phối hội thoại đa tác tử, phân giải ngữ cảnh và lập kế hoạch chiến lược.';
    whyUseful = 'Trang bị chiến thuật phân rã nhiệm vụ cho Supreme NLP Leader.';
  }

  return {
    roleFitCategory,
    matchedAgentCode,
    agentInTeamStatus,
    capabilitySummary,
    whyUseful,
  };
}

/**
 * GET /api/github-trending
 * Lấy top 10 repositories trending hàng đầu và tính toán AI Squad Fit matching
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'topic:ai-agent OR topic:llm-agent OR topic:agents';
    const forceRefresh = searchParams.get('refresh') === 'true';

    let repos: GitHubTrendingRepo[] = [];
    let dataSource: 'LIVE_GITHUB' | 'BASELINE_CACHE' = 'BASELINE_CACHE';

    // Thử fetch live từ GitHub API nếu có mạng và không bị rate limit
    try {
      const ghUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
        query
      )}&sort=stars&order=desc&per_page=10`;

      const response = await fetch(ghUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Workflow-Agent-DevOps-Squad/1.0',
        },
      });

      if (response.ok) {
        const ghData = await response.json();
        if (ghData.items && Array.isArray(ghData.items) && ghData.items.length > 0) {
          repos = ghData.items.slice(0, 10).map((item: any) => {
            const fit = inferSquadFit(item);
            const isHired = runtimeState.hiredSkills.some(
              (h) => h.repoFullName.toLowerCase() === item.full_name.toLowerCase()
            );

            return {
              id: item.id,
              name: item.name,
              fullName: item.full_name,
              owner: {
                login: item.owner?.login || 'unknown',
                avatarUrl: item.owner?.avatar_url || 'https://avatars.githubusercontent.com/u/9919?v=4',
              },
              description: item.description || 'Open-source agentic repository',
              stars: item.stargazers_count || 0,
              forks: item.forks_count || 0,
              language: item.language || 'TypeScript',
              topics: item.topics || [],
              url: item.html_url,
              createdAt: item.created_at,
              updatedAt: item.updated_at,
              roleFitCategory: fit.roleFitCategory,
              matchedAgentCode: fit.matchedAgentCode,
              agentInTeamStatus: fit.agentInTeamStatus,
              capabilitySummary: fit.capabilitySummary,
              whyUseful: fit.whyUseful,
              isHired,
            };
          });
          dataSource = 'LIVE_GITHUB';
        }
      }
    } catch (fetchErr) {
      console.warn('[GitHub Trending API] Live fetch error, falling back to baseline:', fetchErr);
    }

    // Fallback sang BASELINE_GITHUB_REPOS nếu live fetch không thành công
    if (repos.length === 0) {
      repos = BASELINE_GITHUB_REPOS.map((r) => {
        const isHired = runtimeState.hiredSkills.some(
          (h) => h.repoFullName.toLowerCase() === r.fullName.toLowerCase()
        );
        return {
          ...r,
          isHired: isHired || r.isHired,
        };
      });
      dataSource = 'BASELINE_CACHE';
    }

    // Cập nhật repos vào runtime state
    runtimeState.repos = repos;

    return NextResponse.json({
      success: true,
      source: dataSource,
      total: repos.length,
      data: repos,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Lỗi xử lý GitHub Trending API',
        data: BASELINE_GITHUB_REPOS,
      },
      { status: 500 }
    );
  }
}
