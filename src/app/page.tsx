'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Layers, 
  FolderGit2, 
  RefreshCw,
  Eye,
  Zap,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  UserCheck,
  GitPullRequest,
  ExternalLink,
  Globe,
  Settings,
  Settings2,
  BookOpen,
  Users,
  FlaskConical,
  Swords,
  Move,
  Plus,
  Sun,
  Moon,
  Sparkles,
  Bot,
  Key,
  X
} from 'lucide-react';
import { KeyPoolManagementTab } from '@/components/KeyPoolManagementTab';

import {
  DeveloperLogo,
  GitHubLogo,
  JenkinsLogo,
  OwaspLogo,
  SonarQubeLogo,
  TrivyLogo,
  DockerLogo,
  ArgoCDLogo,
  KubernetesLogo,
  MyAppLogo,
  PrometheusLogo,
  GrafanaLogo,
  GmailLogo,
  OfficialToolIcon
} from '@/components/BrandLogos';
import { WorkflowActorSidebar } from '@/components/WorkflowActorSidebar';
import WorkflowConnectionCanvas from '@/components/WorkflowConnectionCanvas';
import WorkflowNodePortHandle from '@/components/WorkflowNodePortHandle';
import { WorkflowEdge, WorkflowPort, Point } from '@/types/workflowGraph';
import { DEFAULT_INITIAL_EDGES } from '@/lib/workflowGraphEngine';

import ArtifactInspectorModal from '@/components/ArtifactInspectorModal';
import InfrastructureConfigModal, { auditTabConfig } from '@/components/InfrastructureConfigModal';
import DocumentationModal from '@/components/DocumentationModal';
import DynamicToolCatalogModal from '@/components/DynamicToolCatalogModal';
import { AgentSquadChatTerminal } from '@/components/AgentSquadChatTerminal';
import { DevOpsToolDefinition, OPEN_SOURCE_DEVOPS_CATALOG } from '@/lib/devopsCatalog';
import ProjectDropdown from '@/components/ProjectDropdown';
import { subscribeRealtimeUpdate, emitRealtimeUpdate } from '@/lib/data';

import { AgentStatusMatrix } from '@/components/AgentStatusMatrix';
import { AgentLogInspectorModal } from '@/components/AgentLogInspectorModal';
import { QATestingPanel } from '@/components/QATestingPanel';
import { GitHubTrendingHunter } from '@/components/GitHubTrendingHunter';
import { AgentSoloArenaModal } from '@/components/AgentSoloArenaModal';
import { MobileBottomNavigation } from '@/components/MobileBottomNavigation';
import { MobileWorkflowTimeline } from '@/components/MobileWorkflowTimeline';
import { SQUAD_AGENTS, BASELINE_GITHUB_REPOS } from '@/lib/constants';
import { 
  AgentRoleProfile, 
  AgentLogStep, 
  QATestResult, 
  GitHubTrendingRepo, 
  SoloBattleResult 
} from '@/types';

export interface LocalProject {
  id: string;
  name: string;
  path: string;
  isGitRepo: boolean;
  branch: string;
  remoteUrl: string;
  repoName: string;
  gitUserName: string;
  gitUserEmail: string;
  lastCommitHash: string;
  lastCommitMsg: string;
  lastCommitAuthor: string;
  lastCommitTime: string;
  hasUncommittedChanges: boolean;
  uncommittedCount: number;
}

export interface WorkflowNode {
  id: string;
  name: string;
  subLabel?: string;
  category: 'DEV' | 'CI' | 'SECURITY' | 'BUILD' | 'CD' | 'GITOPS' | 'DEPLOY' | 'MONITOR' | 'ALERT';
  box: 'CI_BOX' | 'CD_BOX' | 'EXTERNAL';
  badge?: string;
  status: 'STANDBY' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  statusText: string;
  stepNumber?: number;
  logoType: 'DEV' | 'GITHUB' | 'JENKINS' | 'OWASP' | 'SONARQUBE' | 'TRIVY' | 'DOCKER' | 'ARGOCD' | 'KUBERNETES' | 'MYAPP' | 'PROMETHEUS' | 'GRAFANA' | 'GMAIL';
  logs: string[];
  metrics?: Record<string, string>;
  actionLabel?: string;
  actionType?: string;
  details: {
    title: string;
    gateName?: string;
    description: string;
    inputArtifact?: string;
    outputArtifact?: string;
  };
}

export default function WorkflowPage() {
  // Theme State: 'light' (Beige Warm Theme) vs 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('app_theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('light'); // Default to Beige Light Theme as requested
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Global Keyboard Shortcut: Ctrl + K (or Cmd + K) to toggle AI Prompt Terminal
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsChatOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const isLight = theme === 'light';

  // Main Tab Navigation
  const [activeMainTab, setActiveMainTab] = useState<'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA' | 'KEY_POOL'>('WORKFLOW');

  // Local Projects State
  const [localProjects, setLocalProjects] = useState<LocalProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<LocalProject | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);
  const [sysConfig, setSysConfig] = useState<any>(null);

  // Workflow Nodes State
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-owasp');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [, setActiveStepIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExecutingNodeAction, setIsExecutingNodeAction] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [activePipelineToolIds, setActivePipelineToolIds] = useState<string[]>([]);

  // Drag and drop states for Board & Nodes
  const [isOverBox1, setIsOverBox1] = useState<boolean>(false);
  const [isOverBox2, setIsOverBox2] = useState<boolean>(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Agent Squad State
  const [squadAgents, setSquadAgents] = useState<AgentRoleProfile[]>(SQUAD_AGENTS);
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<AgentRoleProfile | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<AgentLogStep[]>([]);

  // QA Lab State
  const [qaTestResults, setQaTestResults] = useState<QATestResult[]>([
    {
      id: 'qa-1',
      testSuite: 'Visual Regression Suite',
      name: 'iPhone 14 Pro Max 430px Viewport Pixel-Perfect Test',
      type: 'VISUAL_PIXEL_430PX',
      status: 'PASS',
      durationMs: 420,
      targetUrl: 'http://localhost:3000',
      viewport: '430x932',
      details: 'Tất cả các nút đạt touch target >= 38px, container flex-wrap chuẩn xác.',
      assertionsCount: 8,
      timestamp: '2026-09-01T18:50:00Z'
    },
    {
      id: 'qa-2',
      testSuite: 'TypeScript Zero-Error Gate',
      name: 'npx tsc --noEmit Build Verification',
      type: 'UNIT',
      status: 'PASS',
      durationMs: 1250,
      details: 'Biên dịch 100% không lỗi cú pháp và kiểu dữ liệu.',
      assertionsCount: 14,
      timestamp: '2026-09-01T18:50:05Z'
    },
    {
      id: 'qa-3',
      testSuite: 'Realtime Bus & Supabase RLS',
      name: 'CustomEvent Bus & REST Client Test',
      type: 'INTEGRATION',
      status: 'PASS',
      durationMs: 95,
      details: 'Đồng bộ 0ms CustomEvent("gcm_*_updated") và REST Client Supabase.',
      assertionsCount: 6,
      timestamp: '2026-09-01T18:50:10Z'
    }
  ]);

  // Solo Arena State
  const [trendingRepos, setTrendingRepos] = useState<GitHubTrendingRepo[]>(BASELINE_GITHUB_REPOS);
  const [activeSoloBattle, setActiveSoloBattle] = useState<SoloBattleResult | null>(null);
  const [soloBattleRepo, setSoloBattleRepo] = useState<GitHubTrendingRepo | null>(null);
  const [soloBattleAgent, setSoloBattleAgent] = useState<AgentRoleProfile | null>(null);
  const [isSoloModalOpen, setIsSoloModalOpen] = useState<boolean>(false);
  const [isActorSidebarOpen, setIsActorSidebarOpen] = useState<boolean>(true);

  // Interactive Connection Graph & Bezier Edges State
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [workflowEdges, setWorkflowEdges] = useState<WorkflowEdge[]>(DEFAULT_INITIAL_EDGES);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const [activeConnectingPort, setActiveConnectingPort] = useState<{ nodeId: string; port: WorkflowPort; startPoint: Point } | null>(null);
  const [cursorPos, setCursorPos] = useState<Point | null>(null);

  const updateNodePositions = useCallback(() => {
    if (!canvasContainerRef.current) return;
    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    const nodeElements = canvasContainerRef.current.querySelectorAll('[data-workflow-node-id]');
    
    const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};
    nodeElements.forEach((el) => {
      const nodeId = el.getAttribute('data-workflow-node-id');
      if (nodeId) {
        const rect = el.getBoundingClientRect();
        positions[nodeId] = {
          x: rect.left - containerRect.left + (canvasContainerRef.current ? canvasContainerRef.current.scrollLeft : 0),
          y: rect.top - containerRect.top + (canvasContainerRef.current ? canvasContainerRef.current.scrollTop : 0),
          width: rect.width,
          height: rect.height
        };
      }
    });
    setNodePositions(positions);
  }, []);

  useEffect(() => {
    updateNodePositions();
    const timer = setTimeout(updateNodePositions, 150);
    const handleResize = () => updateNodePositions();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [nodes, activePipelineToolIds, isActorSidebarOpen, updateNodePositions]);

  const handleStartConnect = (nodeId: string, port: WorkflowPort, e: React.MouseEvent) => {
    if (!canvasContainerRef.current) return;
    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    const startPoint = {
      x: e.clientX - containerRect.left + canvasContainerRef.current.scrollLeft,
      y: e.clientY - containerRect.top + canvasContainerRef.current.scrollTop
    };
    setActiveConnectingPort({ nodeId, port, startPoint });
    setCursorPos(startPoint);
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!activeConnectingPort || !canvasContainerRef.current) return;
    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - containerRect.left + canvasContainerRef.current.scrollLeft,
      y: e.clientY - containerRect.top + canvasContainerRef.current.scrollTop
    });
  };

  const handleFinishConnect = async (targetNodeId: string, targetPort: WorkflowPort) => {
    if (!activeConnectingPort) return;
    const sourceNodeId = activeConnectingPort.nodeId;
    const sourcePort = activeConnectingPort.port;

    setActiveConnectingPort(null);
    setCursorPos(null);

    if (sourceNodeId === targetNodeId) {
      alert('Không thể tự kết nối Node vào chính nó (Self-loop rejected)!');
      return;
    }

    try {
      const res = await fetch('/api/workflow/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceNodeId,
          sourcePort,
          targetNodeId,
          targetPort,
          label: 'pipeline link'
        })
      });
      const data = await res.json();
      if (data.success && data.edge) {
        setWorkflowEdges(prev => [...prev, data.edge]);
      } else {
        alert(data.error || 'Lỗi khi tạo đường nối mũi tên');
      }
    } catch (err) {
      console.error('Lỗi API tạo đường nối:', err);
    }
  };

  const handleRemoveEdge = async (edgeId: string) => {
    try {
      const res = await fetch(`/api/workflow/edges?id=${edgeId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setWorkflowEdges(prev => prev.filter(e => e.id !== edgeId));
      }
    } catch (err) {
      console.error('Lỗi API gỡ đường nối:', err);
    }
  };

  const handleResetWorkflowEdges = async () => {
    try {
      const res = await fetch('/api/workflow/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' })
      });
      const data = await res.json();
      if (data.success && data.edges) {
        setWorkflowEdges(data.edges);
      }
    } catch (err) {
      console.error('Lỗi khôi phục đường nối:', err);
    }
  };

  // Modal Artifact State
  const [modalArtifact, setModalArtifact] = useState<{
    isOpen: boolean;
    title: string;
    artifactName: string;
    format: 'JSON' | 'CODE' | 'YAML' | 'XML';
    content: string;
    sourceNodeName: string;
  }>({
    isOpen: false,
    title: '',
    artifactName: '',
    format: 'JSON',
    content: '',
    sourceNodeName: ''
  });

  // Top Dropdowns
  const [ciTool, setCiTool] = useState<string>('Jenkins CI');
  const [owaspGate, setOwaspGate] = useState<string>('sạch');
  const [sonarGate, setSonarGate] = useState<string>('đạt');
  const [trivyGate, setTrivyGate] = useState<string>('sạch');
  const [speed, setSpeed] = useState<string>('vừa');

  const runnerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch real local projects & system config from machine
  const fetchLocalProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const [projRes, configRes, trendingRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/config'),
        fetch('/api/github-trending').catch(() => null)
      ]);
      const data = await projRes.json();
      const configData = await configRes.json();
      
      if (trendingRes) {
        const trendingData = await trendingRes.json();
        const list = trendingData.data || trendingData.repos || [];
        if (list.length > 0) setTrendingRepos(list);
      }

      if (configData.success && configData.config) {
        setSysConfig(configData.config);
      }
      if (data.projects && data.projects.length > 0) {
        setLocalProjects(data.projects);
        const activeProj = selectedProject
          ? data.projects.find((p: LocalProject) => p.id === selectedProject.id) || data.projects[0]
          : data.projects.find((p: LocalProject) => p.name === 'Workflow') || data.projects[0];
        setSelectedProject(activeProj);
        initNodesForProject(activeProj, configData.config);
      }
    } catch (e) {
      console.error('Error fetching projects or config:', e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const initNodesForProject = (proj: LocalProject, cfg?: any) => {
    const branchName = proj.branch || 'main';
    const commitHash = proj.lastCommitHash || '8f3a91c';
    const commitMsg = proj.lastCommitMsg || 'feat(core): initialize workflow pipeline';
    const gitUser = cfg?.git?.defaultUserName || proj.gitUserName || 'Ktee';
    const repoDisplayName = proj.repoName !== 'Chưa liên kết' ? proj.repoName : `${proj.name} (Local)`;

    const isCurrentlyCoding = proj.hasUncommittedChanges;

    const ciUrl = cfg?.ci?.serverUrl || '';
    const sonarUrl = cfg?.security?.sonarQube?.serverUrl || '';
    const registryUrl = cfg?.docker?.registryUrl || '';
    const configRepoUrl = cfg?.gitops?.configRepoUrl || '';
    const argoUrl = cfg?.gitops?.argoCdUrl || '';
    const promUrl = cfg?.telemetry?.prometheusUrl || '';
    const emailRecipient = cfg?.telemetry?.emailRecipient || 'sếp@company.com';

    setNodes([
      {
        id: 'node-dev',
        name: 'Developer',
        subLabel: isCurrentlyCoding ? 'đang code' : 'đã push',
        category: 'DEV',
        box: 'EXTERNAL',
        logoType: 'DEV',
        status: isCurrentlyCoding ? 'RUNNING' : 'SUCCESS',
        statusText: isCurrentlyCoding ? `đang sửa (${proj.uncommittedCount} tệp)` : 'đã push commit',
        actionLabel: 'Xem Commit Lịch Sử & Thống Kê Git',
        actionType: 'GET_COMMIT_DIFF',
        logs: [
          `[Git Author] ${gitUser} <${proj.gitUserEmail || 'kteenguyen@gmail.com'}>`,
          `[Branch] ${branchName} | Commit: ${commitHash}`,
          `[Message] ${commitMsg}`,
          `[Trạng thái Workspace] ${isCurrentlyCoding ? `Phát hiện ${proj.uncommittedCount} tệp chưa commit` : 'Working tree clean'}`
        ],
        metrics: {
          'Author': gitUser,
          'Branch': branchName,
          'Uncommitted': `${proj.uncommittedCount} tệp`
        },
        details: {
          title: `Lập trình viên: ${gitUser}`,
          description: `Đang phát triển trên nhánh [${branchName}] tại thư mục ${proj.path}`,
          inputArtifact: `${proj.path}`,
          outputArtifact: `commit: ${commitHash} - ${commitMsg}`
        }
      },
      {
        id: 'node-github-src',
        name: 'GitHub',
        subLabel: 'source repo',
        category: 'DEV',
        box: 'EXTERNAL',
        logoType: 'GITHUB',
        badge: 'source repo',
        status: 'SUCCESS',
        statusText: 'pull code',
        actionLabel: 'Kiểm Tra Kết Nối Remote GitHub',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[Remote URL] ${proj.remoteUrl || 'Chưa liên kết Remote'}`,
          `[Repository] ${repoDisplayName}`,
          `[SSOT Sync] Sẵn sàng kích hoạt Webhook Dispatch sang Jenkins CI & Antigravity`
        ],
        metrics: {
          'Repository': repoDisplayName,
          'Protocol': proj.remoteUrl?.startsWith('git@') ? 'SSH' : 'HTTPS',
          'Remote Status': proj.remoteUrl !== 'Chưa liên kết' ? 'CONNECTED' : 'LOCAL_ONLY'
        },
        details: {
          title: `GitHub Source Repo: ${repoDisplayName}`,
          description: proj.remoteUrl !== 'Chưa liên kết' 
            ? `Kho mã nguồn chính thức tại: ${proj.remoteUrl}`
            : 'Mã nguồn cục bộ chưa liên kết Remote. Hãy thêm remote URL trong cấu hình.',
          inputArtifact: `git push origin ${branchName}`,
          outputArtifact: `${branchName} @ ${commitHash}`
        }
      },
      {
        id: 'node-jenkins-ci',
        name: 'Jenkins CI',
        subLabel: 'deps tree',
        category: 'CI',
        box: 'CI_BOX',
        logoType: 'JENKINS',
        badge: 'deps tree',
        status: 'STANDBY',
        statusText: 'chờ',
        stepNumber: 1,
        actionLabel: 'Chạy Pipeline Build Job & Bóc Tách Dependencies',
        actionType: 'TRIGGER_JENKINS_JOB',
        logs: [
          `[Jenkins Master] ${ciUrl ? `Kết nối Server: ${ciUrl}` : 'Mô phỏng cục bộ (Chưa cấu hình URL)'}`,
          `[Job Name] pipeline-${proj.name.toLowerCase()}`,
          '[Dependency Tree] Đang phân tích package.json và build graph...'
        ],
        details: {
          title: 'Jenkins CI Pipeline Engine',
          description: ciUrl ? `Máy chủ Jenkins tại: ${ciUrl}` : 'Máy chủ CI thực hiện kéo mã nguồn, cài đặt dependencies và thực thi pipeline tự động.',
          inputArtifact: `Jenkinsfile (Pipeline-as-Code) for ${proj.name}`,
          outputArtifact: 'target/build-artifacts.tar.gz'
        }
      },
      {
        id: 'node-owasp',
        name: 'OWASP',
        subLabel: 'gác file XML',
        category: 'SECURITY',
        box: 'CI_BOX',
        logoType: 'OWASP',
        badge: 'cổng 1',
        status: 'STANDBY',
        statusText: 'sạch',
        stepNumber: 2,
        actionLabel: 'Chạy OWASP Dependency-Check (SCA)',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[OWASP Scanner] Quét thư viện phụ thuộc của dự án [${proj.name}]`,
          `[Cổng 1] Ngưỡng CVSS Score: 7.0 | Kết quả: 0 Lỗ hổng nghiêm trọng (SẠCH)`
        ],
        details: {
          title: 'OWASP Dependency-Check (Cổng 1)',
          gateName: 'Cổng 1: Software Composition Analysis',
          description: 'Kiểm toán an toàn các thư viện bên thứ 3 trong package.json chống lỗ hổng CVEs đã công bố.',
          inputArtifact: 'package-lock.json & pom.xml / build.gradle',
          outputArtifact: 'dependency-check-report.xml (0 CVEs)'
        }
      },
      {
        id: 'node-sonarqube',
        name: 'SonarQube',
        subLabel: 'cổng 2',
        category: 'SECURITY',
        box: 'CI_BOX',
        logoType: 'SONARQUBE',
        badge: 'cổng 2',
        status: 'STANDBY',
        statusText: 'đạt',
        stepNumber: 3,
        actionLabel: 'Chạy Phân Tích SonarQube Clean Code',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[SonarQube Server] ${sonarUrl ? `Server: ${sonarUrl}` : 'Mô phỏng máy chủ (Chưa cấu hình URL)'}`,
          `[Quality Gate Grade A] Bugs: 0 | Vulnerabilities: 0 | Code Smells: 0 | Coverage: 94.2%`
        ],
        details: {
          title: 'SonarQube SAST & Quality Gate (Cổng 2)',
          gateName: 'Cổng 2: Static Application Security Testing',
          description: 'Phân tích mã nguồn tĩnh, kiểm tra tiêu chuẩn Clean Code, Security Hotspots và độ phủ test.',
          inputArtifact: 'src/**/*.ts, src/**/*.tsx, .eslintrc.json',
          outputArtifact: 'sonarqube-quality-gate-status.json (PASSED)'
        }
      },
      {
        id: 'node-trivy',
        name: 'Trivy',
        subLabel: 'cổng 3',
        category: 'SECURITY',
        box: 'CI_BOX',
        logoType: 'TRIVY',
        badge: 'cổng 3',
        status: 'STANDBY',
        statusText: 'sạch',
        stepNumber: 4,
        actionLabel: 'Quét Lỗ Hổng Filesystem & Secret Keys Bằng Trivy',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[Trivy Scanner] Quét thư mục gốc [${proj.path}]`,
          `[Cổng 3] Filesystem & Secret Scan: Không phát hiện rò rỉ API Keys hay Token nhạy cảm`
        ],
        details: {
          title: 'Trivy Security Scanner (Cổng 3)',
          gateName: 'Cổng 3: Filesystem, OS Packages & Secrets',
          description: 'Rà quét toàn diện hệ thống tệp và biến môi trường .env để ngăn chặn lộ lọt Secret Keys lên Git.',
          inputArtifact: 'Workspace filesystem tree & Dockerfile',
          outputArtifact: 'trivy-scan-report.json (0 High / 0 Critical)'
        }
      },
      {
        id: 'node-docker',
        name: 'Docker',
        subLabel: 'build & push',
        category: 'BUILD',
        box: 'CI_BOX',
        logoType: 'DOCKER',
        status: 'STANDBY',
        statusText: 'chờ',
        stepNumber: 5,
        actionLabel: 'Build Container Image & Push Lên Registry',
        actionType: 'BUILD_DOCKER_IMAGE',
        logs: [
          `[Docker BuildKit] Khởi tạo container image [${proj.name.toLowerCase()}:${commitHash}]`,
          `[Registry] ${registryUrl ? `Đẩy lên: ${registryUrl}` : 'Lưu trữ cục bộ Docker Daemon'}`
        ],
        details: {
          title: 'Docker BuildKit & Container Packaging',
          description: 'Đóng gói ứng dụng vào Container Linux siêu nhẹ (Alpine) với cấu trúc Multi-Stage tối ưu kích thước.',
          inputArtifact: 'Dockerfile & Next.js standalone output',
          outputArtifact: `${proj.name.toLowerCase()}:${commitHash} (78MB)`
        }
      },
      {
        id: 'node-jenkins-cd',
        name: 'Jenkins CD',
        subLabel: 'trigger CD job',
        category: 'CD',
        box: 'CD_BOX',
        logoType: 'JENKINS',
        status: 'STANDBY',
        statusText: 'chờ',
        stepNumber: 6,
        actionLabel: 'Kích Hoạt CD Job & Cập Nhật Phiên Bản Tag',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[CD Trigger] Nhận tín hiệu build thành công từ Khâu CI`,
          `[GitOps Update] Tạo Pull Request cập nhật image tag [${commitHash}] sang GitHub config repo`
        ],
        details: {
          title: 'Jenkins CD Deployment Orchestrator',
          description: 'Điều phối quy trình triển khai tự động, cập nhật manifests trên GitOps repository.',
          inputArtifact: `Docker Image Tag: ${commitHash}`,
          outputArtifact: `Git Commit: update deployment.yaml image tag to ${commitHash}`
        }
      },
      {
        id: 'node-github-config',
        name: 'GitHub',
        subLabel: 'config repo',
        category: 'GITOPS',
        box: 'CD_BOX',
        logoType: 'GITHUB',
        badge: 'config repo',
        status: 'STANDBY',
        statusText: 'pull config',
        actionLabel: 'Xem K8s Manifests Trên Config Repo',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[GitOps Repo] ${configRepoUrl || 'https://github.com/company/k8s-manifests.git'}`,
          `[Manifests] k8s/deployment.yaml, k8s/service.yaml, k8s/ingress.yaml`
        ],
        details: {
          title: 'GitHub GitOps Configuration Repository',
          description: configRepoUrl ? `Kho chứa manifests K8s: ${configRepoUrl}` : 'Kho lưu trữ khai báo hạ tầng Kubernetes Manifests theo chuẩn Declarative GitOps.',
          inputArtifact: `k8s/deployment.yaml @ tag: ${commitHash}`,
          outputArtifact: 'GitOps SSOT Revision @ main'
        }
      },
      {
        id: 'node-argocd',
        name: 'ArgoCD',
        subLabel: 'deploy on k8s',
        category: 'GITOPS',
        box: 'CD_BOX',
        logoType: 'ARGOCD',
        status: 'STANDBY',
        statusText: 'chờ',
        stepNumber: 7,
        actionLabel: 'Đồng Bộ ArgoCD GitOps Sync',
        actionType: 'TRIGGER_ARGOCD_SYNC',
        logs: [
          `[ArgoCD Controller] ${argoUrl ? `Server: ${argoUrl}` : 'Mô phỏng máy chủ GitOps'}`,
          `[Auto-Sync] So khớp trạng thái mong muốn trên Git với trạng thái sống trên K8s`
        ],
        details: {
          title: 'ArgoCD GitOps Continuous Delivery',
          description: argoUrl ? `ArgoCD Server: ${argoUrl}` : 'Bộ điều khiển GitOps tự động hòa giải (Reconciliation loop) giữa Git và Kubernetes Cluster.',
          inputArtifact: 'Git Revision: Declarative K8s Manifests',
          outputArtifact: 'ArgoCD Application Status: Synced & Healthy'
        }
      },
      {
        id: 'node-k8s',
        name: 'Kubernetes',
        subLabel: 'cụm k8s',
        category: 'DEPLOY',
        box: 'CD_BOX',
        logoType: 'KUBERNETES',
        status: 'STANDBY',
        statusText: 'chờ',
        actionLabel: 'Kiểm Tra Trạng Thái Pods & Services K8s',
        actionType: 'GET_K8S_PODS_STATUS',
        logs: [
          `[K8s Cluster] Namespace: production | Replicas: 3/3 Pods Ready`,
          `[Rolling Update] Zero-Downtime Deployment hoàn tất`
        ],
        details: {
          title: 'Kubernetes Production Cluster',
          description: 'Cụm máy chủ điều phối container tự động mở rộng (Autoscaling), tự phục hồi (Self-healing) và cân bằng tải.',
          inputArtifact: 'Pod Spec & Replicaset (3 Replicas)',
          outputArtifact: '3/3 Pods Running (Zero-Downtime)'
        }
      },
      {
        id: 'node-myapp',
        name: proj.name,
        subLabel: 'người dùng truy cập',
        category: 'DEPLOY',
        box: 'CD_BOX',
        logoType: 'MYAPP',
        status: 'STANDBY',
        statusText: 'chờ',
        actionLabel: 'Mở Ứng Dụng Thực Tế Trên Trình Duyệt',
        actionType: 'OPEN_LIVE_APP',
        logs: [
          `[Live Application] Dự án [${proj.name}] đang phục vụ người dùng thực tế`,
          '[Health Check Probe] HTTP 200 OK | Response Time: 42ms'
        ],
        details: {
          title: `Ứng dụng trực tiếp: ${proj.name}`,
          description: 'Môi trường Production thực tế sẵn sàng đón nhận lưu lượng truy cập từ khách hàng.',
          inputArtifact: 'Ingress routing & SSL Certificate',
          outputArtifact: 'Live Production URL (HTTP 200 OK)'
        }
      },
      {
        id: 'node-prometheus',
        name: 'Prometheus',
        subLabel: 'metrics',
        category: 'MONITOR',
        box: 'CD_BOX',
        logoType: 'PROMETHEUS',
        status: 'STANDBY',
        statusText: 'chờ',
        actionLabel: 'Kiểm Tra Scrape Target & CPU/RAM Metrics',
        actionType: 'GET_RAW_ARTIFACT',
        logs: [
          `[Prometheus] ${promUrl ? `Scrape target: ${promUrl}` : 'Chưa cấu hình Prometheus (Mô phỏng cục bộ)'}`,
          '[Cluster Metrics] CPU Load: 8% | RAM: 280MB | Error Rate: 0.00%'
        ],
        details: {
          title: 'Prometheus Metrics Collector',
          description: promUrl ? `Prometheus Server: ${promUrl}` : 'Hệ thống giám sát hiệu năng thời gian thực thu thập số liệu CPU, RAM, Network và Latency.',
          inputArtifact: 'K8s Pods /metrics endpoint target',
          outputArtifact: 'Prometheus TSDB Stream (8% CPU)'
        }
      },
      {
        id: 'node-grafana',
        name: 'Grafana',
        subLabel: 'dashboard',
        category: 'MONITOR',
        box: 'CD_BOX',
        logoType: 'GRAFANA',
        status: 'STANDBY',
        statusText: 'chờ',
        actionLabel: 'Mở Grafana Realtime Telemetry',
        actionType: 'VIEW_GRAFANA_DASHBOARD',
        logs: [
          `[Grafana Live] Dashboard dự án [${proj.name}] hiển thị RPS & P99`,
          '[Metrics Health] Tất cả chỉ số đều trong ngưỡng an toàn màu xanh lá'
        ],
        details: {
          title: 'Grafana Live Dashboard',
          description: 'Bảng biểu đồ trực quan hóa dữ liệu hạ tầng và phát cảnh báo tự động khi có bất thường.',
          inputArtifact: 'Prometheus Datasource Stream',
          outputArtifact: 'Grafana Live Dashboard: Healthy Green'
        }
      },
      {
        id: 'node-gmail',
        name: 'Gmail',
        subLabel: 'notify email',
        category: 'ALERT',
        box: 'CD_BOX',
        logoType: 'GMAIL',
        status: 'STANDBY',
        statusText: 'chờ',
        actionLabel: 'Xem Mẫu Email Nghiệm Thu Gửi Sếp',
        actionType: 'VIEW_EMAIL_NOTIFICATION',
        logs: [
          `[Alertmanager] Gửi email thông báo kết quả Deploy dự án [${proj.name}]`,
          `[Notification] Đã gửi thông báo nghiệm thu tới: ${emailRecipient}`
        ],
        details: {
          title: 'Gmail & Alert Dispatcher',
          description: `Hệ thống thông báo tức thời tới: ${emailRecipient}`,
          inputArtifact: 'Deployment status webhook trigger',
          outputArtifact: `Email sent to ${emailRecipient}`
        }
      }
    ]);
  };

  useEffect(() => {
    fetchLocalProjects();
    const unsubProject = subscribeRealtimeUpdate('gcm_project_updated', fetchLocalProjects);
    const unsubConfig = subscribeRealtimeUpdate('gcm_config_updated', fetchLocalProjects);
    return () => {
      unsubProject();
      unsubConfig();
    };
  }, []);

  const executionOrder = [
    'node-dev',
    'node-github-src',
    'node-jenkins-ci',
    'node-owasp',
    'node-sonarqube',
    'node-trivy',
    'node-docker',
    'node-jenkins-cd',
    'node-github-config',
    'node-argocd',
    'node-k8s',
    'node-myapp',
    'node-prometheus',
    'node-grafana',
    'node-gmail'
  ];

  const handleInspectArtifact = async (artifactName: string, isInput: boolean) => {
    try {
      const res = await fetch('/api/node-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'GET_RAW_ARTIFACT',
          nodeId: selectedNodeId,
          projectName: selectedProject?.name || 'Workflow',
          artifactName
        })
      });
      const data = await res.json();
      if (data.success) {
        setModalArtifact({
          isOpen: true,
          title: isInput ? `Input Artifact: ${artifactName}` : `Output Artifact: ${artifactName}`,
          artifactName,
          format: data.format || 'JSON',
          content: data.content || '',
          sourceNodeName: selectedNode?.name || 'Node'
        });
      }
    } catch (e) {
      console.error('Error inspecting artifact:', e);
    }
  };

  const handleExecuteNodeAction = async () => {
    if (!selectedNode) return;
    setIsExecutingNodeAction(true);
    try {
      const res = await fetch('/api/node-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: selectedNode.actionType || 'GET_RAW_ARTIFACT',
          nodeId: selectedNode.id,
          projectName: selectedProject?.name || 'Workflow'
        })
      });
      const data = await res.json();
      if (data.success) {
        setNodes(curr => curr.map(n => n.id === selectedNode.id ? {
          ...n,
          status: 'SUCCESS',
          statusText: n.id === 'node-owasp' ? 'sạch' : n.id === 'node-sonarqube' ? 'đạt' : n.id === 'node-trivy' ? 'sạch' : n.id === 'node-myapp' ? 'đang chạy' : 'thành công'
        } : n));

        if (data.result?.rawArtifact) {
          setModalArtifact({
            isOpen: true,
            title: data.result.title || `Kết Quả: ${selectedNode.name}`,
            artifactName: `${selectedNode.id}-report.json`,
            format: 'JSON',
            content: JSON.stringify(data.result.rawArtifact, null, 2),
            sourceNodeName: selectedNode.name
          });
        }
      }
    } catch (e) {
      console.error('Error running node action:', e);
    } finally {
      setIsExecutingNodeAction(false);
    }
  };

  const handleRemoveDynamicNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    const toolId = nodeId.replace('node-dynamic-', '');
    setActivePipelineToolIds(prev => prev.filter(id => id !== toolId));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId('node-dev');
    }
  };

  const handleAddToolToPipeline = (tool: DevOpsToolDefinition, configuredValues: Record<string, any>, targetBox?: 'CI_BOX' | 'CD_BOX') => {
    const newNodeId = `node-dynamic-${tool.id}`;
    const existingIdx = nodes.findIndex(n => n.id === newNodeId);
    
    const configDetailsList = Object.entries(configuredValues)
      .filter(([_, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k}: ${v}`);

    const chosenBox = targetBox || ((tool.category === 'CI' || tool.category === 'SECURITY' || tool.category === 'BUILD') ? 'CI_BOX' : 'CD_BOX');

    const newNode: WorkflowNode = {
      id: newNodeId,
      name: tool.name,
      subLabel: tool.category,
      category: tool.category,
      box: chosenBox,
      logoType: 'DEV',
      status: 'STANDBY',
      statusText: 'sẵn sàng',
      actionLabel: `Chạy & Kiểm Tra ${tool.name}`,
      actionType: 'GET_RAW_ARTIFACT',
      logs: [
        `[Dynamic Plugin] Nền tảng Open Source [${tool.name}] đã nạp thành công vào ${chosenBox === 'CI_BOX' ? 'Khâu ① CI & Bảo Mật' : 'Khâu ② CD GitOps & Giám Sát'}!`,
        `[Cấu hình kết nối] ${configDetailsList.length > 0 ? configDetailsList.join(' | ') : 'Cấu hình mặc định'}`,
        `[Giấy phép] ${tool.license} • Trạng thái: Sẵn sàng thực thi trong Pipeline.`
      ],
      metrics: {
        'Nền tảng': tool.name,
        'Khâu Tích Hợp': chosenBox === 'CI_BOX' ? 'Khâu ① CI & Bảo Mật' : 'Khâu ② CD GitOps & Giám Sát',
        'Giấy phép': tool.license,
        'Trạng thái': 'SẴN SÀNG'
      },
      details: {
        title: `${tool.name} • ${tool.license}`,
        description: tool.description,
        inputArtifact: 'Pipeline trigger context & parameters',
        outputArtifact: `${tool.id}-execution-result.json`
      }
    };

    if (existingIdx >= 0) {
      setNodes(prev => prev.map((n, i) => i === existingIdx ? newNode : n));
    } else {
      setNodes(prev => [...prev, newNode]);
      setActivePipelineToolIds(prev => [...prev, tool.id]);
    }

    setSelectedNodeId(newNodeId);
    setIsCatalogModalOpen(false);
  };

  // Drag and Drop: Drop tool directly on a specific Box (CI_BOX or CD_BOX)
  const handleDropToolOnBox = (boxType: 'CI_BOX' | 'CD_BOX', e: React.DragEvent) => {
    e.preventDefault();
    setIsOverBox1(false);
    setIsOverBox2(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
      let tool: DevOpsToolDefinition | null = null;
      if (dataStr) {
        try {
          tool = JSON.parse(dataStr);
        } catch (parseErr) {
          tool = null;
        }
      }
      if (!tool && typeof window !== 'undefined' && (window as any).__draggedDevOpsTool) {
        tool = (window as any).__draggedDevOpsTool;
      }

      if (tool) {
        handleAddToolToPipeline(tool, {}, boxType);
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  // Drag and drop: Reorder nodes
  const handleSwapNodes = (sourceId: string, targetId: string) => {
    const srcIndex = nodes.findIndex(n => n.id === sourceId);
    const tgtIndex = nodes.findIndex(n => n.id === targetId);
    if (srcIndex < 0 || tgtIndex < 0 || srcIndex === tgtIndex) return;

    setNodes(curr => {
      const newNodes = [...curr];
      const [removed] = newNodes.splice(srcIndex, 1);
      newNodes.splice(tgtIndex, 0, removed);
      return newNodes;
    });
  };

  // Realtime Listeners
  useEffect(() => {
    const unsubNodeAdvance = subscribeRealtimeUpdate('gcm_workflow_node_advanced', (data: any) => {
      if (data && data.nodeId) {
        setNodes(curr => curr.map(n => n.id === data.nodeId ? { ...n, status: data.status, statusText: data.statusText } : n));
        setSelectedNodeId(data.nodeId);
      }
    });

    const unsubLogAdd = subscribeRealtimeUpdate('gcm_workflow_log_added', (data: any) => {
      if (data && data.nodeId && data.logMessage) {
        setNodes(curr => curr.map(n => {
          if (n.id === data.nodeId) {
            const updatedLogs = [data.logMessage, ...n.logs];
            const updatedMetrics = data.metricKey ? { ...(n.metrics || {}), [data.metricKey]: data.metricValue } : n.metrics;
            return { ...n, logs: updatedLogs, metrics: updatedMetrics };
          }
          return n;
        }));
      }
    });

    const unsubTriggerRun = subscribeRealtimeUpdate('gcm_workflow_trigger_run', (data: any) => {
      if (data && data.speed) setSpeed(data.speed);
      handlePushCodeRunAll();
    });

    const unsubReset = subscribeRealtimeUpdate('gcm_workflow_reset', () => {
      handleReset();
    });

    return () => {
      unsubNodeAdvance();
      unsubLogAdd();
      unsubTriggerRun();
      unsubReset();
    };
  }, []);

  const handleSelectProject = (proj: LocalProject) => {
    setSelectedProject(proj);
    initNodesForProject(proj);
  };

  const handleStepForward = () => {
    setActiveStepIndex(prev => {
      const nextIdx = Math.min(executionOrder.length - 1, prev + 1);
      const currentTargetId = executionOrder[nextIdx];

      setNodes(currentNodes => currentNodes.map(n => {
        const nodeOrderIdx = executionOrder.indexOf(n.id);
        if (nodeOrderIdx < nextIdx) {
          return {
            ...n,
            status: 'SUCCESS',
            statusText: n.id === 'node-owasp' ? 'sạch' : n.id === 'node-sonarqube' ? 'đạt' : n.id === 'node-trivy' ? 'sạch' : n.id === 'node-myapp' ? 'đang chạy' : 'thành công'
          };
        }
        if (nodeOrderIdx === nextIdx) {
          return { ...n, status: 'RUNNING', statusText: 'đang chạy' };
        }
        return { ...n, status: 'STANDBY', statusText: 'chờ' };
      }));

      setSelectedNodeId(currentTargetId);
      return nextIdx;
    });
  };

  const handlePushCodeRunAll = () => {
    setIsRunningAll(true);
    let step = 0;
    setActiveStepIndex(0);
    setSelectedNodeId(executionOrder[0]);

    if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    const speedMs = speed === 'nhanh' ? 350 : speed === 'chậm' ? 1200 : 700;

    runnerTimerRef.current = setInterval(() => {
      step++;
      if (step >= executionOrder.length) {
        if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
        setIsRunningAll(false);
        setNodes(currentNodes => currentNodes.map(n => ({
          ...n,
          status: 'SUCCESS',
          statusText: n.id === 'node-owasp' ? 'sạch' : n.id === 'node-sonarqube' ? 'đạt' : n.id === 'node-trivy' ? 'sạch' : n.id === 'node-myapp' ? 'đang chạy' : 'thành công'
        })));
        return;
      }

      const targetId = executionOrder[step];
      setActiveStepIndex(step);
      setSelectedNodeId(targetId);

      setNodes(currentNodes => currentNodes.map(n => {
        const nodeOrderIdx = executionOrder.indexOf(n.id);
        if (nodeOrderIdx < step) {
          return {
            ...n,
            status: 'SUCCESS',
            statusText: n.id === 'node-owasp' ? 'sạch' : n.id === 'node-sonarqube' ? 'đạt' : n.id === 'node-trivy' ? 'sạch' : n.id === 'node-myapp' ? 'đang chạy' : 'thành công'
          };
        }
        if (nodeOrderIdx === step) {
          return { ...n, status: 'RUNNING', statusText: 'đang chạy' };
        }
        return { ...n, status: 'STANDBY', statusText: 'chờ' };
      }));
    }, speedMs);
  };

  const handleReset = () => {
    if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    setIsRunningAll(false);
    setActiveStepIndex(0);
    setSelectedNodeId('node-owasp');
    if (selectedProject) initNodesForProject(selectedProject);
  };

  useEffect(() => {
    return () => {
      if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    };
  }, []);

  const renderOfficialLogo = (logoType: WorkflowNode['logoType'], className = "w-9 h-9", nodeName?: string) => {
    switch (logoType) {
      case 'DEV': return nodeName && nodeName !== 'Developer' ? <OfficialToolIcon toolIdOrName={nodeName} className={className} /> : <DeveloperLogo className={className} />;
      case 'GITHUB': return <GitHubLogo className={className} />;
      case 'JENKINS': return <JenkinsLogo className={className} />;
      case 'OWASP': return <OwaspLogo className={className} />;
      case 'SONARQUBE': return <SonarQubeLogo className={className} />;
      case 'TRIVY': return <TrivyLogo className={className} />;
      case 'DOCKER': return <DockerLogo className={className} />;
      case 'ARGOCD': return <ArgoCDLogo className={className} />;
      case 'KUBERNETES': return <KubernetesLogo className={className} />;
      case 'MYAPP': return <MyAppLogo className={className} />;
      case 'PROMETHEUS': return <PrometheusLogo className={className} />;
      case 'GRAFANA': return <GrafanaLogo className={className} />;
      case 'GMAIL': return <GmailLogo className={className} />;
      default: return <OfficialToolIcon toolIdOrName={nodeName || logoType} className={className} />;
    }
  };

  const getNodeBorder = (nodeId: string, status: WorkflowNode['status']) => {
    const isSelected = selectedNodeId === nodeId;
    if (isSelected) {
      return isLight
        ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/70 shadow-md'
        : 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 shadow-xl bg-[#111C33]';
    }
    if (status === 'RUNNING') {
      return isLight
        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/60 animate-pulse'
        : 'border-cyan-400 ring-2 ring-cyan-400/40 bg-[#0E1B30] animate-pulse';
    }
    return isLight
      ? 'border-[#E2DDD5] bg-white hover:border-blue-400 shadow-xs'
      : 'border-slate-800 bg-[#0C1222] hover:border-slate-600';
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className={`min-h-screen font-sans select-none flex flex-col justify-between transition-colors duration-200 ${
      isLight ? 'bg-[#F7F5F0] text-slate-800' : 'bg-[#070B14] text-slate-100'
    }`}>
      
      {/* 1. TOP BAR CONTROLS & MAIN TAB SWITCHER */}
      <div className={`w-full px-2 sm:px-4 py-2 sticky top-0 z-50 border-b transition-colors ${
        isLight ? 'bg-[#EFECE6] border-[#E2DDD5]' : 'bg-[#0B0F19] border-[#1E293B]'
      }`}>
        
        {/* Row 1: ALL CONTROLS IN 1 SINGLE FLUID ROW ON DESKTOP */}
        <div className="max-w-[1850px] w-full mx-auto flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar flex-nowrap">
          
          {/* Group 1: 5 Main Navigation Tabs */}
          <div className={`flex items-center gap-0.5 sm:gap-1 p-0.5 rounded-lg border shrink-0 transition ${
            isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#090D18] border-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => setActiveMainTab('WORKFLOW')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'WORKFLOW'
                  ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm shadow-blue-600/30')
                  : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
              }`}
              style={{ height: '30px' }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sơ Đồ Visual</span>
              <span className="sm:hidden">Sơ Đồ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('AGENTS')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'AGENTS'
                  ? (isLight ? 'bg-blue-700 text-white shadow-sm' : 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30')
                  : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
              }`}
              style={{ height: '30px' }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>13 Agents</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('QA_LAB')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'QA_LAB'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
              }`}
              style={{ height: '30px' }}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>QA Lab</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('SOLO_ARENA')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'SOLO_ARENA'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
              }`}
              style={{ height: '30px' }}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Solo 1v1</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('KEY_POOL')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
                activeMainTab === 'KEY_POOL'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
              }`}
              style={{ height: '30px' }}
            >
              <Key className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden 2xl:inline">Key Pool & 9Router</span>
              <span className="2xl:hidden">Key Pool</span>
            </button>
          </div>

          {/* Group 2: Action Buttons (Push code, Tiếp tục, Đặt lại) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handlePushCodeRunAll}
              disabled={isRunningAll}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold text-white transition-all shadow-sm whitespace-nowrap ${
                isRunningAll
                  ? 'bg-blue-600 animate-pulse cursor-wait'
                  : 'bg-[#10B981] hover:bg-[#059669] shadow-emerald-500/20'
              }`}
              style={{ height: '30px' }}
            >
              <Play className="w-3 h-3 fill-white" />
              <span className="hidden md:inline">Push code (chạy hết)</span>
              <span className="md:hidden">Push</span>
            </button>

            <button
              type="button"
              onClick={handleStepForward}
              disabled={isRunningAll}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition-all border whitespace-nowrap ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#E2DDD5]'
                  : 'bg-[#1E293B] hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              style={{ height: '30px' }}
            >
              <SkipForward className="w-3 h-3" />
              <span className="hidden lg:inline">Tiếp tục</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition-all border whitespace-nowrap ${
                isLight 
                  ? 'bg-[#FAF8F5] hover:bg-slate-200 text-slate-600 border-[#E2DDD5]'
                  : 'bg-[#0F172A] hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
              }`}
              style={{ height: '30px' }}
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden lg:inline">Đặt lại</span>
            </button>
          </div>

          {/* Group 3: Utility Controls & Modals */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 text-xs">
            {/* AI Prompt Copilot Terminal Button */}
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-400/40 shadow-sm transition cursor-pointer active:scale-95 whitespace-nowrap"
              style={{ height: '30px' }}
              title="Mở AI Prompt Terminal (Ctrl + K)"
            >
              <Sparkles className="w-3 h-3 animate-pulse" />
              <span>Prompt AI</span>
              <span className="hidden xl:inline text-[9px] font-mono bg-white/20 px-1 rounded">Ctrl+K</span>
            </button>

            {/* THEME TOGGLE (LIGHT BEIGE VS DARK) */}
            <button
              type="button"
              onClick={() => setTheme(curr => curr === 'light' ? 'dark' : 'light')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition-all border shadow-xs cursor-pointer whitespace-nowrap ${
                isLight
                  ? 'bg-[#FFFFFF] hover:bg-[#FAF8F5] text-amber-800 border-[#E2DDD5]'
                  : 'bg-[#0F172A] hover:bg-slate-800 text-amber-300 border-slate-700'
              }`}
              style={{ height: '30px' }}
              title="Chuyển đổi giao diện Sáng / Tối"
            >
              {isLight ? (
                <>
                  <Sun className="w-3 h-3 text-amber-600 fill-amber-500/30" />
                  <span className="hidden md:inline">Sáng</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-cyan-300" />
                  <span className="hidden md:inline">Tối</span>
                </>
              )}
            </button>

            {/* Dynamic Open Source Catalog */}
            <button
              type="button"
              onClick={() => setIsCatalogModalOpen(true)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold border border-blue-500/40 shadow-xs transition cursor-pointer whitespace-nowrap"
              style={{ height: '30px' }}
            >
              <Plus className="w-3 h-3" />
              <span className="hidden xl:inline">Kho Open Source</span>
              <span className="xl:hidden">Kho OS</span>
            </button>

            {/* Reset Connection Edges */}
            <button
              type="button"
              onClick={handleResetWorkflowEdges}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition cursor-pointer border whitespace-nowrap ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#E2DDD5]'
                  : 'bg-[#0F172A] hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              style={{ height: '30px' }}
              title="Khôi phục toàn bộ đường nối mũi tên mặc định của hệ thống"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span className="hidden xl:inline">Khôi Phục Dây Nối ({workflowEdges.length})</span>
              <span className="xl:hidden">Dây ({workflowEdges.length})</span>
            </button>

            {/* Documentation Guides (Full Page Link & Modal) */}
            <a
              href="/docs"
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition cursor-pointer border whitespace-nowrap ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-blue-700 border-[#E2DDD5]'
                  : 'bg-[#0F172A] hover:bg-slate-800 text-cyan-400 border-slate-700'
              }`}
              style={{ height: '30px' }}
              title="Xem Trang Tài Liệu Tổng Thể Dự Án (/docs)"
            >
              <BookOpen className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
              <span>Docs Dự Án</span>
            </a>

            {/* Infrastructure Config Gear Button */}
            <button
              type="button"
              onClick={() => setIsConfigModalOpen(true)}
              title="Cấu Hình Hạ Tầng & API Tokens"
              aria-label="Cấu Hình Hạ Tầng"
              className={`w-[30px] h-[30px] rounded-lg transition cursor-pointer border shadow-xs flex items-center justify-center group shrink-0 ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-[#E2DDD5] hover:border-blue-400 hover:text-blue-600'
                  : 'bg-[#0F172A] hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-400 hover:text-cyan-400'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 group-hover:rotate-90 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Row 2: Dedicated Real Project Selector, Real Git User & Real Repo Branch */}
        <div className={`max-w-[1550px] mx-auto flex flex-wrap items-center justify-between gap-3 pt-1 border-t text-xs ${
          isLight ? 'border-[#E2DDD5]' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center gap-3 flex-wrap">
            <ProjectDropdown
              projects={localProjects}
              selectedProject={selectedProject}
              onSelectProject={handleSelectProject}
              isLoading={isLoadingProjects}
              onRefresh={fetchLocalProjects}
              theme={theme}
            />

            {selectedProject && (
              <div className="flex items-center gap-2 font-mono">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Git User:</span>
                <span className={`px-2 py-0.5 rounded border font-bold ${
                  isLight ? 'bg-white border-[#E2DDD5] text-purple-700' : 'bg-[#0E1526] border-slate-800 text-purple-300'
                }`}>
                  {selectedProject.gitUserName}
                </span>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Branch:</span>
                <span className={`px-2 py-0.5 rounded border font-bold ${
                  isLight ? 'bg-white border-[#E2DDD5] text-emerald-700' : 'bg-[#0E1526] border-slate-800 text-emerald-400'
                }`}>
                  {selectedProject.branch}
                </span>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-2 font-mono text-[11px] ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>REALTIME EVENT BUS: 0MS SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT VIEW SWITCHER */}
      <main className="max-w-[1550px] w-full mx-auto p-4 sm:p-6 space-y-6 flex-1 pb-20 md:pb-6">
        
        {/* VIEW 1: VISUAL WORKFLOW WITH DRAG-AND-DROP PALETTE */}
        {activeMainTab === 'WORKFLOW' && (
          <div className="space-y-6">
            
            {/* Mobile Touch-First Step-by-Step Timeline (Visible on < 768px screens) */}
            <MobileWorkflowTimeline
              nodes={nodes}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              renderLogo={renderOfficialLogo}
              theme={theme}
            />

            {/* Main Visual Canvas & Left Collapsible Actor Toolbox Container */}
            <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
              {/* Left Collapsible Actor Toolbox */}
              <WorkflowActorSidebar
                isOpen={isActorSidebarOpen}
                onToggle={() => setIsActorSidebarOpen(prev => !prev)}
                onAddTool={(tool, targetBox) => handleAddToolToPipeline(tool, {}, targetBox)}
                theme={theme}
              />

              {/* Desktop Visual Canvas & Inspector Column */}
              <div className="flex-1 w-full min-w-0 space-y-6">
                {/* Desktop Visual Canvas Board with Drop Targets (Visible on >= 768px screens) */}
                <div 
                  ref={canvasContainerRef}
                  onMouseMove={handleMouseMoveCanvas}
                  onMouseUp={() => {
                    if (activeConnectingPort) {
                      setActiveConnectingPort(null);
                      setCursorPos(null);
                    }
                  }}
                  className={`hidden md:block w-full rounded-3xl p-6 sm:p-8 shadow-xl overflow-x-auto relative border transition ${
                  isLight
                    ? 'bg-white border-[#E2DDD5]'
                    : 'bg-[#090E1A] border-[#1E293B]'
                }`}>
                  {/* Interactive Dynamic Bezier SVG Connection Canvas */}
                  <WorkflowConnectionCanvas
                    containerRef={canvasContainerRef}
                    edges={workflowEdges}
                    nodePositions={nodePositions}
                    activeConnectingPort={activeConnectingPort}
                    cursorPos={cursorPos}
                    onRemoveEdge={handleRemoveEdge}
                    isRunningPipeline={isRunningAll}
                    theme={theme}
                  />
                  <div className="min-w-[1150px] space-y-8">
                
                {/* EXTERNAL LEFT: Developer & GitHub Source */}
                <div className="flex items-center gap-6">
                  
                  {/* Developer Node */}
                  <div
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/node-id', 'node-dev');
                      setDraggedNodeId('node-dev');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const srcId = e.dataTransfer.getData('text/node-id');
                      if (srcId) handleSwapNodes(srcId, 'node-dev');
                    }}
                    data-workflow-node-id="node-dev"
                    onClick={() => setSelectedNodeId('node-dev')}
                    className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${getNodeBorder('node-dev', nodes.find(n => n.id === 'node-dev')?.status || 'STANDBY')}`}
                    style={{ width: '130px', height: '110px' }}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                      isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                    }`}>
                      {renderOfficialLogo('DEV', 'w-6 h-6')}
                    </div>
                    <span className={`font-bold text-xs text-center truncate max-w-[110px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedProject?.gitUserName || 'Developer'}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>push code</span>
                    <WorkflowNodePortHandle nodeId="node-dev" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                  </div>

                  {/* Connecting line */}
                  <div className="flex items-center gap-1 text-slate-500">
                    <div className={`h-[2px] w-14 relative ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                      <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap ${isLight ? 'text-blue-700 font-bold' : 'text-cyan-400'}`}>
                        push code
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>▶</span>
                  </div>

                  {/* GitHub Source Repo */}
                  <div
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/node-id', 'node-github-src');
                      setDraggedNodeId('node-github-src');
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const srcId = e.dataTransfer.getData('text/node-id');
                      if (srcId) handleSwapNodes(srcId, 'node-github-src');
                    }}
                    data-workflow-node-id="node-github-src"
                    onClick={() => setSelectedNodeId('node-github-src')}
                    className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${getNodeBorder('node-github-src', nodes.find(n => n.id === 'node-github-src')?.status || 'STANDBY')}`}
                    style={{ width: '140px', height: '110px' }}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                      isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                    }`}>
                      {renderOfficialLogo('GITHUB', 'w-6 h-6')}
                    </div>
                    <span className={`font-bold text-xs text-center truncate max-w-[120px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedProject?.repoName !== 'Chưa liên kết' ? selectedProject?.repoName : 'GitHub (Source)'}
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>source repo</span>
                    <WorkflowNodePortHandle nodeId="node-github-src" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <div className={`h-[2px] w-16 relative ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                      <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        pull code
                      </span>
                    </div>
                    <span className="text-slate-400 text-xs">▶</span>
                  </div>
                </div>

                {/* BOX 1: ① JENKINS CI — BUILD & 3 CỔNG BẢO MẬT (ACTIVE DROP ZONE) */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsOverBox1(true);
                  }}
                  onDragLeave={() => setIsOverBox1(false)}
                  onDrop={(e) => handleDropToolOnBox('CI_BOX', e)}
                  className={`rounded-3xl border-2 border-dashed transition-all duration-200 p-6 relative space-y-6 ${
                    isOverBox1
                      ? (isLight ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-500/20 scale-[1.005]' : 'border-cyan-400 bg-[#0E1F38] ring-4 ring-cyan-500/20 scale-[1.005]')
                      : (isLight ? 'border-[#CBD5E1] bg-[#FAF8F5]/90' : 'border-slate-700/80 bg-[#0A101E]/70')
                  }`}
                >
                  <div className={`absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full border text-xs font-bold flex items-center gap-2 shadow-xs ${
                    isLight 
                      ? 'bg-white border-[#E2DDD5] text-blue-700' 
                      : 'bg-[#0B0F19] border-slate-700 text-cyan-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    ① KHÂU CI & 3 CỔNG BẢO MẬT (KÉO THẢ VÀO ĐÂY)
                  </div>

                  {isOverBox1 && (
                    <div className={`absolute inset-0 backdrop-blur-xs rounded-3xl border-2 flex flex-col items-center justify-center font-bold text-xs z-30 pointer-events-none ${
                      isLight ? 'bg-blue-100/90 border-blue-500 text-blue-900' : 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                    }`}>
                      <Layers className="w-8 h-8 text-blue-600 dark:text-cyan-400 mb-2 animate-bounce" />
                      <span>Thả vào đây để tích hợp công cụ vào Khâu ① CI & Bảo Mật!</span>
                    </div>
                  )}

                  {/* Top Row in Box 1 */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    
                    {/* Jenkins CI */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-jenkins-ci')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-jenkins-ci');
                      }}
                      data-workflow-node-id="node-jenkins-ci"
                      onClick={() => setSelectedNodeId('node-jenkins-ci')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-jenkins-ci', nodes.find(n => n.id === 'node-jenkins-ci')?.status || 'STANDBY')}`}
                      style={{ width: '160px', height: '125px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('JENKINS', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Jenkins CI</span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {nodes.find(n => n.id === 'node-jenkins-ci')?.statusText}
                      </span>
                      <WorkflowNodePortHandle nodeId="node-jenkins-ci" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex-1 flex items-center justify-center text-slate-500 relative px-2">
                      <div className={`h-[2px] w-full relative flex items-center justify-end ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          dependency
                        </span>
                        <span className="text-slate-400 text-xs">▶</span>
                      </div>
                    </div>

                    {/* OWASP */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-owasp')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-owasp');
                      }}
                      data-workflow-node-id="node-owasp"
                      onClick={() => setSelectedNodeId('node-owasp')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-owasp', nodes.find(n => n.id === 'node-owasp')?.status || 'STANDBY')}`}
                      style={{ width: '170px', height: '125px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('OWASP', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>OWASP</span>
                      <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>cổng 1</span>
                      <WorkflowNodePortHandle nodeId="node-owasp" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex-1 flex items-center justify-center text-slate-500 relative px-2">
                      <div className={`h-[2px] w-full relative flex items-center justify-end ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          quality gate
                        </span>
                        <span className="text-slate-400 text-xs">▶</span>
                      </div>
                    </div>

                    {/* SonarQube */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-sonarqube')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-sonarqube');
                      }}
                      data-workflow-node-id="node-sonarqube"
                      onClick={() => setSelectedNodeId('node-sonarqube')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-sonarqube', nodes.find(n => n.id === 'node-sonarqube')?.status || 'STANDBY')}`}
                      style={{ width: '170px', height: '125px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('SONARQUBE', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>SonarQube</span>
                      <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>cổng 2</span>
                      <WorkflowNodePortHandle nodeId="node-sonarqube" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>
                  </div>

                  {/* Bottom Row in Box 1: Docker <- Trivy */}
                  <div className="flex items-center justify-end gap-6 pt-1">
                    {/* Docker */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-docker')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-docker');
                      }}
                      data-workflow-node-id="node-docker"
                      onClick={() => setSelectedNodeId('node-docker')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-docker', nodes.find(n => n.id === 'node-docker')?.status || 'STANDBY')}`}
                      style={{ width: '160px', height: '115px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('DOCKER', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Docker</span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {nodes.find(n => n.id === 'node-docker')?.statusText}
                      </span>
                      <WorkflowNodePortHandle nodeId="node-docker" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <span className="text-slate-400 text-xs">◀</span>
                      <div className={`h-[2px] w-28 relative ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          docker build & push
                        </span>
                      </div>
                    </div>

                    {/* Trivy */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-trivy')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-trivy');
                      }}
                      data-workflow-node-id="node-trivy"
                      onClick={() => setSelectedNodeId('node-trivy')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-trivy', nodes.find(n => n.id === 'node-trivy')?.status || 'STANDBY')}`}
                      style={{ width: '170px', height: '115px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('TRIVY', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Trivy</span>
                      <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>cổng 3</span>
                      <WorkflowNodePortHandle nodeId="node-trivy" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>
                  </div>

                  {/* DYNAMIC DROPPED PLUGINS IN BOX 1 */}
                  {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').length > 0 && (
                    <div className={`mt-3 pt-3 border-t border-dashed ${isLight ? 'border-blue-200' : 'border-cyan-900/50'}`}>
                      <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-blue-600 dark:text-cyan-400">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Công cụ mở rộng đã tích hợp vào Khâu CI & Bảo Mật ({nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').length}):</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').map(dynNode => (
                          <div
                            key={dynNode.id}
                            onClick={() => setSelectedNodeId(dynNode.id)}
                            className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                              selectedNodeId === dynNode.id
                                ? (isLight ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30' : 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/30')
                                : (isLight ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' : 'bg-[#0E1526] hover:bg-slate-800 border-slate-700')
                            }`}
                            style={{ minWidth: '180px' }}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800 border-slate-700'}`}>
                              <OfficialToolIcon toolIdOrName={dynNode.name} className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{dynNode.name}</div>
                              <div className="text-[10px] text-emerald-500 font-mono font-bold">{dynNode.statusText}</div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDynamicNode(dynNode.id);
                              }}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
                              title="Gỡ công cụ"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* BOX 2: ② JENKINS CD — GITOPS DEPLOY & MONITOR (ACTIVE DROP ZONE) */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsOverBox2(true);
                  }}
                  onDragLeave={() => setIsOverBox2(false)}
                  onDrop={(e) => handleDropToolOnBox('CD_BOX', e)}
                  className={`rounded-3xl border-2 border-dashed transition-all duration-200 p-6 relative space-y-6 ${
                    isOverBox2
                      ? (isLight ? 'border-purple-500 bg-purple-50/80 ring-4 ring-purple-500/20 scale-[1.005]' : 'border-purple-400 bg-[#1E0F38] ring-4 ring-purple-500/20 scale-[1.005]')
                      : (isLight ? 'border-[#CBD5E1] bg-[#FAF8F5]/90' : 'border-slate-700/80 bg-[#0A101E]/70')
                  }`}
                >
                  <div className={`absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full border text-xs font-bold flex items-center gap-2 shadow-xs ${
                    isLight
                      ? 'bg-white border-[#E2DDD5] text-purple-700'
                      : 'bg-[#0B0F19] border-slate-700 text-purple-300'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    ② KHÂU CD GITOPS & GIÁM SÁT (KÉO THẢ VÀO ĐÂY)
                  </div>

                  {isOverBox2 && (
                    <div className={`absolute inset-0 backdrop-blur-xs rounded-3xl border-2 flex flex-col items-center justify-center font-bold text-xs z-30 pointer-events-none ${
                      isLight ? 'bg-purple-100/90 border-purple-500 text-purple-900' : 'bg-purple-950/80 border-purple-400 text-purple-300'
                    }`}>
                      <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 animate-bounce" />
                      <span>Thả vào đây để tích hợp công cụ vào Khâu ② CD GitOps & Giám Sát!</span>
                    </div>
                  )}

                  {/* Main GitOps Row */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    {/* Jenkins CD */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-jenkins-cd')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-jenkins-cd');
                      }}
                      data-workflow-node-id="node-jenkins-cd"
                      onClick={() => setSelectedNodeId('node-jenkins-cd')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-jenkins-cd', nodes.find(n => n.id === 'node-jenkins-cd')?.status || 'STANDBY')}`}
                      style={{ width: '145px', height: '120px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('JENKINS', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Jenkins CD</span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {nodes.find(n => n.id === 'node-jenkins-cd')?.statusText}
                      </span>
                      <WorkflowNodePortHandle nodeId="node-jenkins-cd" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
                      <div className={`h-[2px] w-full relative flex items-center justify-end ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          update image
                        </span>
                        <span className="text-slate-400 text-xs">▶</span>
                      </div>
                    </div>

                    {/* GitHub config repo */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-github-config')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-github-config');
                      }}
                      data-workflow-node-id="node-github-config"
                      onClick={() => setSelectedNodeId('node-github-config')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-github-config', nodes.find(n => n.id === 'node-github-config')?.status || 'STANDBY')}`}
                      style={{ width: '145px', height: '120px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('GITHUB', 'w-6 h-6')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>GitHub</span>
                      <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>config repo</span>
                      <WorkflowNodePortHandle nodeId="node-github-config" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
                      <div className={`h-[2px] w-full relative flex items-center justify-end ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          pull config
                        </span>
                        <span className="text-slate-400 text-xs">▶</span>
                      </div>
                    </div>

                    {/* ArgoCD */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-argocd')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-argocd');
                      }}
                      data-workflow-node-id="node-argocd"
                      onClick={() => setSelectedNodeId('node-argocd')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-argocd', nodes.find(n => n.id === 'node-argocd')?.status || 'STANDBY')}`}
                      style={{ width: '145px', height: '120px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('ARGOCD', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>ArgoCD</span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {nodes.find(n => n.id === 'node-argocd')?.statusText}
                      </span>
                      <WorkflowNodePortHandle nodeId="node-argocd" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
                      <div className={`h-[2px] w-full relative flex items-center justify-end ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap ${isLight ? 'text-blue-700 font-bold' : 'text-cyan-400'}`}>
                          deploy on k8s
                        </span>
                        <span className={`text-xs ${isLight ? 'text-blue-600 font-bold' : 'text-cyan-400'}`}>▶</span>
                      </div>
                    </div>

                    {/* Kubernetes */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-k8s')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-k8s');
                      }}
                      data-workflow-node-id="node-k8s"
                      onClick={() => setSelectedNodeId('node-k8s')}
                      className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-k8s', nodes.find(n => n.id === 'node-k8s')?.status || 'STANDBY')}`}
                      style={{ width: '145px', height: '120px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('KUBERNETES', 'w-7 h-7')}
                      </div>
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Kubernetes</span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {nodes.find(n => n.id === 'node-k8s')?.statusText}
                      </span>
                      <WorkflowNodePortHandle nodeId="node-k8s" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
                    </div>

                    <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
                      <div className={`h-[2px] w-full relative flex items-center justify-end ${isLight ? 'bg-emerald-300' : 'bg-emerald-700/60'}`}>
                        <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap ${isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400'}`}>
                          truy cập
                        </span>
                        <span className={`text-xs ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>▶</span>
                      </div>
                    </div>

                    {/* Live App */}
                    <div
                      draggable={true}
                      onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-myapp')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const srcId = e.dataTransfer.getData('text/node-id');
                        if (srcId) handleSwapNodes(srcId, 'node-myapp');
                      }}
                      onClick={() => setSelectedNodeId('node-myapp')}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-myapp', nodes.find(n => n.id === 'node-myapp')?.status || 'STANDBY')}`}
                      style={{ width: '145px', height: '120px' }}
                    >
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                      }`}>
                        {renderOfficialLogo('MYAPP', 'w-7 h-7')}
                      </div>
                      <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 text-center truncate max-w-[130px]">
                        {selectedProject?.name || 'MyApp'}
                      </span>
                      <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>production</span>
                    </div>
                  </div>

                  {/* DYNAMIC DROPPED PLUGINS IN BOX 2 */}
                  {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').length > 0 && (
                    <div className={`mt-3 pt-3 border-t border-dashed ${isLight ? 'border-purple-200' : 'border-purple-900/50'}`}>
                      <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Công cụ mở rộng đã tích hợp vào Khâu CD GitOps & Giám Sát ({nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').length}):</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').map(dynNode => (
                          <div
                            key={dynNode.id}
                            onClick={() => setSelectedNodeId(dynNode.id)}
                            className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                              selectedNodeId === dynNode.id
                                ? (isLight ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400/30' : 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-400/30')
                                : (isLight ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' : 'bg-[#0E1526] hover:bg-slate-800 border-slate-700')
                            }`}
                            style={{ minWidth: '180px' }}
                          >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800 border-slate-700'}`}>
                              <OfficialToolIcon toolIdOrName={dynNode.name} className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{dynNode.name}</div>
                              <div className="text-[10px] text-emerald-500 font-mono font-bold">{dynNode.statusText}</div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveDynamicNode(dynNode.id);
                              }}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
                              title="Gỡ công cụ"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Operational Node Inspector */}
            {selectedNode && (
              <div className={`w-full rounded-3xl p-6 shadow-xl space-y-5 border transition ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#090E1A] border-[#1E293B]'
              }`}>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                  isLight ? 'border-[#E2DDD5]' : 'border-[#1E293B]'
                }`}>
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${
                      isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/90 border-slate-700'
                    }`}>
                      {renderOfficialLogo(selectedNode.logoType, 'w-8 h-8', selectedNode.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {selectedNode.details.title}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}>
                          {selectedNode.statusText}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        {selectedNode.details.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedNode.actionLabel && (
                      <button
                        type="button"
                        onClick={handleExecuteNodeAction}
                        disabled={isExecutingNodeAction}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/40 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <Zap className={`w-3.5 h-3.5 text-yellow-300 ${isExecutingNodeAction ? 'animate-spin' : ''}`} />
                        <span>{isExecutingNodeAction ? 'Đang thực thi...' : selectedNode.actionLabel}</span>
                      </button>
                    )}

                    {selectedNode.metrics && Object.entries(selectedNode.metrics).map(([k, v]) => (
                      <div key={k} className={`p-1.5 px-2.5 rounded-lg border font-mono text-xs ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0F172A] border-slate-800'
                      }`}>
                        <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{k}</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logs & Artifacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#060911] border-slate-800'
                  }`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block flex items-center gap-1.5 ${
                      isLight ? 'text-blue-700' : 'text-slate-400'
                    }`}>
                      <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      Live Execution Logs:
                    </span>
                    <div className={`space-y-1 text-[11.5px] leading-relaxed max-h-40 overflow-y-auto pr-1 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      {selectedNode.logs.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#060911] border-slate-800'
                  }`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block flex items-center gap-1.5 ${
                      isLight ? 'text-purple-700' : 'text-slate-400'
                    }`}>
                      <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      Input / Output Artifacts:
                    </span>

                    {selectedNode.details.inputArtifact && (
                      <div
                        onClick={() => handleInspectArtifact(selectedNode.details.inputArtifact!, true)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                          isLight 
                            ? 'bg-white border-[#E2DDD5] hover:border-blue-500'
                            : 'bg-[#0B101E] border-slate-700/80 hover:border-cyan-500/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className={`w-4 h-4 transition ${isLight ? 'text-slate-500 group-hover:text-blue-600' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                          <div>
                            <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Input Payload</span>
                            <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{selectedNode.details.inputArtifact}</span>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition border ${
                          isLight 
                            ? 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100'
                            : 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-900'
                        }`}>
                          <Eye className="w-3 h-3" />
                          <span>Xem</span>
                        </span>
                      </div>
                    )}

                    {selectedNode.details.outputArtifact && (
                      <div
                        onClick={() => handleInspectArtifact(selectedNode.details.outputArtifact!, false)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group shadow-xs ${
                          isLight 
                            ? 'bg-white border-emerald-300 hover:border-emerald-500'
                            : 'bg-[#0B101E] border-emerald-900/60 hover:border-emerald-500/80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
                          <div>
                            <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-500'}`}>Output Artifact</span>
                            <span className={`text-xs font-semibold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>{selectedNode.details.outputArtifact}</span>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition border ${
                          isLight 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 group-hover:bg-emerald-100'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 group-hover:bg-emerald-900'
                        }`}>
                          <Eye className="w-3 h-3" />
                          <span>Xem & Tải</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: REDESIGNED 13 AI SUBAGENTS AUTONOMOUS COMMAND CENTER */}
        {activeMainTab === 'AGENTS' && (
          <div className="space-y-6">
            <AgentStatusMatrix
              agents={squadAgents}
              theme={theme}
              onSelectAgent={(agent) => {
                setSelectedAgentForModal(agent);
                setIsAgentModalOpen(true);
              }}
            />
          </div>
        )}

        {/* VIEW 3: QA TESTING LAB */}
        {activeMainTab === 'QA_LAB' && (
          <div className="space-y-6">
            <QATestingPanel
              testResults={qaTestResults}
              theme={theme}
              onRunAllTests={() => {
                setQaTestResults(prev => prev.map(t => ({ ...t, status: 'PASS' })));
              }}
            />
          </div>
        )}

        {/* VIEW 4: GITHUB TRENDING HUNTER & SOLO ARENA */}
        {activeMainTab === 'SOLO_ARENA' && (
          <div className="space-y-6">
            <GitHubTrendingHunter
              repos={trendingRepos}
              theme={theme}
              onTriggerSoloBattle={(repo) => {
                const matchedAgent = squadAgents.find(a => a.category === repo.roleFitCategory) || squadAgents[0];
                setSoloBattleRepo(repo);
                setSoloBattleAgent(matchedAgent);
                setActiveSoloBattle({
                  id: `battle-${Date.now()}`,
                  repoFullName: repo.fullName,
                  repoName: repo.name,
                  agentCode: matchedAgent.code,
                  agentName: matchedAgent.name,
                  matchDate: new Date().toISOString(),
                  winner: 'AGENT',
                  scoreRepo: 86,
                  scoreAgent: 94,
                  criteriaScores: [
                    { name: 'Architecture', nameVi: 'Kiến Trúc & Tối Ưu', repoScore: 85, agentScore: 95, weight: 25, analysis: 'Agent Antigravity tối ưu chuẩn Next.js standalone.' },
                    { name: 'Security', nameVi: 'Bảo Mật & RBAC', repoScore: 88, agentScore: 96, weight: 25, analysis: 'Supabase RLS và Token guard vượt trội.' },
                    { name: 'Velocity', nameVi: 'Tốc Độ & Độ Trễ', repoScore: 82, agentScore: 92, weight: 20, analysis: 'Event Bus 0ms xử lý phản hồi tức thì.' },
                    { name: 'Scalability', nameVi: 'Khả Năng Mở Rộng', repoScore: 90, agentScore: 93, weight: 15, analysis: 'Cụm K8s & ArgoCD GitOps đồng bộ.' },
                    { name: 'Reliability', nameVi: 'Độ Tin Cậy & SLA', repoScore: 85, agentScore: 94, weight: 15, analysis: '100% không dữ liệu giả.' }
                  ],
                  battleLog: [
                    { round: 1, topic: 'Khởi động & Phân tích', commentary: 'Agent làm chủ hoàn toàn luồng xử lý.', advantage: 'AGENT' },
                    { round: 2, topic: 'Bảo mật & Clean Code', commentary: 'Trivy + OWASP + SonarQube khóa chặt mọi rủi ro.', advantage: 'AGENT' }
                  ],
                  summaryVerdict: `Agent ${matchedAgent.name} chiến thắng thuyết phục trước ${repo.name}!`,
                  hireRecommendation: {
                    shouldHire: true,
                    suggestedAction: 'IMPORT_AS_SKILL',
                    hireTitle: `Tích hợp ${repo.name} làm Skill Module`,
                    rationale: 'Bổ sung thêm thư viện giải thuật cho Squad.'
                  }
                });
                setIsSoloModalOpen(true);
              }}
              onDirectHireProposal={(repo) => {
                alert(`Đã gửi đề xuất tuyển mộ kỹ năng [${repo.name}] vào Agent Squad!`);
              }}
            />
          </div>
        )}

        {/* VIEW 5: KEY POOL MANAGEMENT & 9ROUTER */}
        {activeMainTab === 'KEY_POOL' && (
          <div className="space-y-6">
            <KeyPoolManagementTab theme={theme} />
          </div>
        )}

      </main>

      {/* MODALS */}
      {/* Agent Log Inspector Modal */}
      <AgentLogInspectorModal
        agent={selectedAgentForModal}
        logs={agentLogs}
        onClose={() => setIsAgentModalOpen(false)}
      />

      {/* Solo Arena 1v1 Modal */}
      <AgentSoloArenaModal
        battleResult={activeSoloBattle}
        repo={soloBattleRepo}
        agent={soloBattleAgent}
        onClose={() => setIsSoloModalOpen(false)}
        onConfirmHire={() => {
          setIsSoloModalOpen(false);
          alert('Đã duyệt tích hợp kỹ năng mới vào Agent Squad!');
        }}
      />

      {/* Artifact Inspector Modal */}
      <ArtifactInspectorModal
        isOpen={modalArtifact.isOpen}
        onClose={() => setModalArtifact(prev => ({ ...prev, isOpen: false }))}
        title={modalArtifact.title}
        artifactName={modalArtifact.artifactName}
        format={modalArtifact.format}
        content={modalArtifact.content}
        sourceNodeName={modalArtifact.sourceNodeName}
      />

      {/* Infrastructure Configuration Modal */}
      <InfrastructureConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        initialConfig={sysConfig}
        onOpenCatalog={() => setIsCatalogModalOpen(true)}
        onSaved={() => {
          fetchLocalProjects();
        }}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        theme={theme}
      />

      {/* Dynamic Open Source Tool Catalog Modal */}
      <DynamicToolCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onAddToolToPipeline={handleAddToolToPipeline}
        activePipelineToolIds={activePipelineToolIds}
        theme={theme}
      />

      {/* Footer */}
      <footer className={`hidden md:block w-full py-3 px-6 text-center text-xs font-mono border-t transition ${
        isLight ? 'bg-[#EFECE6] border-[#E2DDD5] text-slate-600' : 'bg-[#070B14] border-[#1E293B] text-slate-500'
      }`}>
        <div className="max-w-[1550px] mx-auto flex items-center justify-between">
          <span>Dự án: <strong className={isLight ? 'text-blue-700' : 'text-cyan-300'}>{selectedProject?.name || 'Workflow'}</strong> • Git Account: <strong className={isLight ? 'text-purple-700' : 'text-purple-300'}>{selectedProject?.gitUserName}</strong> • Remote: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedProject?.remoteUrl}</strong></span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">100% Real Git Config • Warm Beige Light Theme</span>
        </div>
      </footer>

      {/* Floating AI Prompt Copilot Trigger Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        title="Mở AI Prompt Terminal (Ctrl + K)"
      >
        <Sparkles className="w-4 h-4 animate-spin" />
        <span className="tracking-wide">Prompt AI Squad</span>
        <span className="hidden sm:inline text-[10px] font-mono bg-white/20 px-1.5 py-0.5 rounded border border-white/30">Ctrl+K</span>
      </button>

      {/* Agent Squad Chat Terminal */}
      <AgentSquadChatTerminal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenTab={setActiveMainTab}
        onRunPipeline={handlePushCodeRunAll}
        theme={theme}
      />

      {/* Touch-First Mobile Bottom Navigation Bar (< 768px) */}
      <MobileBottomNavigation
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
        onRunPipeline={handlePushCodeRunAll}
        isRunning={isRunningAll}
        theme={theme}
        onToggleTheme={() => setTheme(curr => curr === 'light' ? 'dark' : 'light')}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

    </div>
  );
}
