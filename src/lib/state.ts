import {
  AgentRoleProfile,
  PipelineStage,
  AgentLogStep,
  QATestResult,
  GitHubTrendingRepo,
  HiredSkillProposal,
  SoloBattleResult,
} from '@/types';
import {
  SQUAD_AGENTS,
  PIPELINE_STAGES,
  INITIAL_LOG_STEPS,
  INITIAL_QA_TESTS,
  BASELINE_GITHUB_REPOS,
} from '@/lib/constants';

// In-memory runtime state for Next.js API route handlers
// Persists across requests within the active server runtime process

declare global {
  // eslint-disable-next-line no-var
  var __WORKFLOW_STATE__: {
    stages: PipelineStage[];
    agents: AgentRoleProfile[];
    logs: AgentLogStep[];
    qaTests: QATestResult[];
    repos: GitHubTrendingRepo[];
    hiredSkills: HiredSkillProposal[];
    recentBattles: SoloBattleResult[];
  } | undefined;
}

function getInitialState() {
  const initialHired: HiredSkillProposal[] = [
    {
      id: 'hire_001',
      repoFullName: 'shadcn-ui/ui',
      skillName: 'shadcn/ui Design System',
      category: 'FRONTEND',
      assignedSquad: 'Frontend 430px Team (Alex & Mobile UX Architect)',
      status: 'INTEGRATED',
      rationale: 'Chuẩn hóa thiết kế giao diện Mobile 430px và Dark Mode chuẩn quốc tế.',
      hiredBy: 'ADMIN_CEO',
      createdAt: '2026-09-01T15:30:00Z',
    },
    {
      id: 'hire_002',
      repoFullName: 'microsoft/playwright',
      skillName: 'Playwright Browser E2E Engine',
      category: 'QA',
      assignedSquad: 'QA Testing Automation (QA Testing Subagent)',
      status: 'INTEGRATED',
      rationale: 'Tự động hóa kiểm thử đa trình duyệt và đo lường độ chính xác Pixel 430px.',
      hiredBy: 'HEAD',
      createdAt: '2026-09-01T15:35:00Z',
    },
    {
      id: 'hire_003',
      repoFullName: 'modelcontextprotocol/servers',
      skillName: 'MCP Reference Tool Connectors',
      category: 'BACKEND',
      assignedSquad: 'Backend & Realtime Squad (Backend Guard & Max)',
      status: 'INTEGRATED',
      rationale: 'Kết nối ngoại vi và bảo mật giao tiếp giữa các agent squad.',
      hiredBy: 'ADMIN_CEO',
      createdAt: '2026-09-01T15:40:00Z',
    },
  ];

  return {
    stages: JSON.parse(JSON.stringify(PIPELINE_STAGES)),
    agents: JSON.parse(JSON.stringify(SQUAD_AGENTS)),
    logs: JSON.parse(JSON.stringify(INITIAL_LOG_STEPS)),
    qaTests: JSON.parse(JSON.stringify(INITIAL_QA_TESTS)),
    repos: JSON.parse(JSON.stringify(BASELINE_GITHUB_REPOS)),
    hiredSkills: initialHired,
    recentBattles: [],
  };
}

if (!global.__WORKFLOW_STATE__) {
  global.__WORKFLOW_STATE__ = getInitialState();
}

export const runtimeState = global.__WORKFLOW_STATE__;

export function resetRuntimeState() {
  global.__WORKFLOW_STATE__ = getInitialState();
  return global.__WORKFLOW_STATE__;
}
