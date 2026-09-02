export type UserRole = 'ADMIN_CEO' | 'HEAD' | 'DEV' | 'QA' | 'STAFF';

export type AgentStatus = 'idle' | 'running' | 'testing' | 'blocked' | 'success' | 'error';

export type AgentCategory = 
  | 'LEADER' 
  | 'FRONTEND' 
  | 'BACKEND' 
  | 'QA' 
  | 'DEVOPS' 
  | 'ANALYST' 
  | 'ARCHITECT' 
  | 'OPTIMIZER';

export interface AgentRoleProfile {
  id: string;
  name: string;
  code: string;
  category: AgentCategory;
  phase: string;
  roleDescription: string;
  avatar: string;
  status: AgentStatus;
  progress: number; // 0 - 100
  currentTask: string;
  currentStageId: string;
  skills: string[];
  lastActive: string;
  metrics: {
    tasksCompleted: number;
    avgResponseMs: number;
    successRate: number;
  };
}

export type PipelineStageStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface PipelineStage {
  id: string;
  order: number;
  name: string;
  description: string;
  primaryAgentCode: string;
  status: PipelineStageStatus;
  durationMs: number;
  logsCount: number;
  testPassRate?: number;
  outputArtifact?: string;
  startedAt?: string;
  completedAt?: string;
}

export type LogStepType = 
  | 'USER_INPUT' 
  | 'THINKING' 
  | 'TOOL_CALL' 
  | 'TOOL_RESULT' 
  | 'COMMAND_EXEC' 
  | 'QA_TEST' 
  | 'ERROR' 
  | 'OUTPUT';

export interface AgentLogStep {
  id: string;
  timestamp: string;
  agentCode: string;
  stageId: string;
  stepIndex: number;
  type: LogStepType;
  title: string;
  thinking?: string;
  toolName?: string;
  toolArgs?: Record<string, any>;
  toolOutput?: string;
  commandLine?: string;
  exitCode?: number;
  status: 'SUCCESS' | 'ERROR' | 'RUNNING';
  durationMs?: number;
}

export type QATestType = 
  | 'UNIT' 
  | 'INTEGRATION' 
  | 'E2E_BROWSER' 
  | 'VISUAL_PIXEL_430PX' 
  | 'RESPONSIVE_BREAKPOINTS' 
  | 'SECURITY_RBAC';

export interface QATestResult {
  id: string;
  testSuite: string;
  name: string;
  type: QATestType;
  status: 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING';
  durationMs: number;
  targetUrl?: string;
  viewport?: string;
  details: string;
  assertionsCount: number;
  screenshotUrl?: string;
  timestamp: string;
}

export interface GitHubTrendingRepo {
  id: number;
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
  };
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  url: string;
  createdAt: string;
  updatedAt: string;
  roleFitCategory: AgentCategory;
  matchedAgentCode: string; // The agent in squad that corresponds to this repo
  agentInTeamStatus: 'ALREADY_HAVE' | 'NEW_ROLE_GAP';
  capabilitySummary: string;
  whyUseful: string;
  isHired?: boolean;
}

export interface CriteriaScore {
  name: string;
  nameVi: string;
  repoScore: number; // 0 - 100
  agentScore: number; // 0 - 100
  weight: number;
  analysis: string;
}

export interface SoloBattleResult {
  id: string;
  repoFullName: string;
  repoName: string;
  agentCode: string;
  agentName: string;
  matchDate: string;
  winner: 'REPO' | 'AGENT' | 'DRAW';
  scoreRepo: number;
  scoreAgent: number;
  criteriaScores: CriteriaScore[];
  battleLog: Array<{
    round: number;
    topic: string;
    commentary: string;
    advantage: 'REPO' | 'AGENT' | 'EQUAL';
  }>;
  summaryVerdict: string;
  hireRecommendation: {
    shouldHire: boolean;
    suggestedAction: 'IMPORT_AS_SKILL' | 'INTEGRATE_MCP' | 'KEEP_CURRENT_AGENT';
    hireTitle: string;
    rationale: string;
  };
}

export interface HiredSkillProposal {
  id: string;
  repoFullName: string;
  skillName: string;
  category: AgentCategory;
  assignedSquad: string;
  status: 'PROPOSED' | 'APPROVED' | 'INTEGRATED' | 'REJECTED';
  rationale: string;
  hiredBy: string;
  createdAt: string;
}

export interface TechnicalDocGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  filename: string;
  content: string;
  order: number;
  tags?: string[];
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  targetAgent?: string;
  model?: string;
  modelUsed?: string;
  agentName?: string;
  agentAvatar?: string;
  isStreaming?: boolean;
  thinking?: string;
  toolCalls?: Array<{
    name: string;
    args: Record<string, any>;
    result?: string;
  }>;
  dispatchedAgents?: string[];
  actionLink?: {
    label: string;
    tab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA' | 'KEY_POOL';
  };
}

export interface CLIExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

