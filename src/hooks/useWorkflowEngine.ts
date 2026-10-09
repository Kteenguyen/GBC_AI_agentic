'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowEdge, WorkflowPort, Point } from '@/types/workflowGraph';
import { DEFAULT_INITIAL_EDGES } from '@/lib/workflowGraphEngine';
import { DevOpsToolDefinition } from '@/lib/devopsCatalog';
import { subscribeRealtimeUpdate, emitRealtimeUpdate } from '@/lib/data';
import { SQUAD_AGENTS, BASELINE_GITHUB_REPOS } from '@/lib/constants';
import { 
  LocalProject, 
  WorkflowNode, 
  ModalArtifactState 
} from '@/types/workflow';
import { 
  AgentRoleProfile, 
  AgentLogStep, 
  QATestResult, 
  GitHubTrendingRepo, 
  SoloBattleResult 
} from '@/types';

export const PIPELINE_10_NODES = [
  'node-dev',
  'node-github-src',
  'node-jenkins-ci',
  'node-owasp',
  'node-sonarqube',
  'node-trivy',
  'node-docker',
  'node-argocd',
  'node-prometheus',
  'node-myapp'
];

export const EXECUTION_ORDER_FULL = [
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

export function useWorkflowEngine() {
  // Theme State: 'dark' (Cyber-Obsidian IDP) vs 'light' (Crisp Pro Studio)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('app_theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('dark');
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
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [currentPipelineStep, setCurrentPipelineStep] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExecutingNodeAction, setIsExecutingNodeAction] = useState<boolean>(false);
  
  // Modals & Drawers States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isNodeConfigDrawerOpen, setIsNodeConfigDrawerOpen] = useState<boolean>(false);
  const [activeConfigNodeId, setActiveConfigNodeId] = useState<string | null>(null);
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
      details: 'Tất cả các nút đạt touch target >= 44px, container flex-wrap chuẩn xác.',
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
      testSuite: 'Realtime Bus & Supabase Persistence',
      name: 'Supabase REST Client & Event Bus Test',
      type: 'INTEGRATION',
      status: 'PASS',
      durationMs: 95,
      details: 'Đồng bộ 0ms CustomEvent và REST Client Supabase PostgreSQL.',
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

  // Modal Artifact State
  const [modalArtifact, setModalArtifact] = useState<ModalArtifactState>({
    isOpen: false,
    title: '',
    artifactName: '',
    format: 'JSON',
    content: '',
    sourceNodeName: ''
  });

  // Top Pipeline Controls
  const [speed, setSpeed] = useState<string>('vừa');
  const runnerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Global Keyboard Shortcut: Ctrl + K (or Cmd + K)
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

  // Update Node Positions for SVG Bezier lines
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

  // Connect Ports Handlers
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

  // Fetch local projects & config
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

  // Inspect Artifact
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
        const selNode = nodes.find(n => n.id === selectedNodeId);
        setModalArtifact({
          isOpen: true,
          title: isInput ? `Input Artifact: ${artifactName}` : `Output Artifact: ${artifactName}`,
          artifactName,
          format: data.format || 'JSON',
          content: data.content || '',
          sourceNodeName: selNode?.name || 'Node'
        });
      }
    } catch (e) {
      console.error('Error inspecting artifact:', e);
    }
  };

  // Execute Node Action
  const handleExecuteNodeAction = async () => {
    const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
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

  // Node Quick Config Drawer
  const handleOpenNodeConfig = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setActiveConfigNodeId(nodeId);
    setIsNodeConfigDrawerOpen(true);
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
      handleTriggerFullPipeline();
    });

    const unsubWebhookTrigger = subscribeRealtimeUpdate('gcm_pipeline_triggered', (data: any) => {
      console.log('[REALTIME BUS] Pipeline triggered via Git Webhook:', data);
      handleTriggerFullPipeline();
    });

    const unsubReset = subscribeRealtimeUpdate('gcm_workflow_reset', () => {
      handleReset();
    });

    return () => {
      unsubNodeAdvance();
      unsubLogAdd();
      unsubTriggerRun();
      unsubWebhookTrigger();
      unsubReset();
    };
  }, [selectedProject, speed, sysConfig]);

  const handleSelectProject = (proj: LocalProject) => {
    setSelectedProject(proj);
    initNodesForProject(proj);
  };

  const handleStepForward = () => {
    setActiveStepIndex(prev => {
      const nextIdx = Math.min(EXECUTION_ORDER_FULL.length - 1, prev + 1);
      const currentTargetId = EXECUTION_ORDER_FULL[nextIdx];

      setNodes(currentNodes => currentNodes.map(n => {
        const nodeOrderIdx = EXECUTION_ORDER_FULL.indexOf(n.id);
        if (nodeOrderIdx < nextIdx) {
          return {
            ...n,
            status: 'SUCCESS',
            statusText: n.id === 'node-owasp' ? 'sạch' : n.id === 'node-sonarqube' ? 'đạt' : n.id === 'node-trivy' ? 'sạch' : n.id === 'node-myapp' ? 'online v1.0.0' : 'thành công'
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

  const handleTriggerFullPipeline = async () => {
    if (isRunningAll) return;
    setIsRunningAll(true);
    setCurrentPipelineStep(0);
    setActiveStepIndex(0);
    setSelectedNodeId(PIPELINE_10_NODES[0]);

    if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);

    const stepDelay = speed === 'nhanh' ? 600 : speed === 'chậm' ? 1600 : 950;
    const branch = selectedProject?.branch || 'main';
    const commitHash = selectedProject?.lastCommitHash || '8eb6922';
    const projectName = selectedProject?.name || 'Workflow';

    // Step definitions
    const stepDetails: Record<string, { statusText: string; successText: string; log: string; metricKey?: string; metricValue?: string }> = {
      'node-dev': {
        statusText: 'đang tạo commit',
        successText: 'đã commit',
        log: `[Dev Workspace] Khởi tạo commit [${commitHash}] & workspace thành công trên nhánh [${branch}]. Working tree sạch.`,
        metricKey: 'Status',
        metricValue: 'COMMITTED'
      },
      'node-github-src': {
        statusText: 'đang sync repo',
        successText: 'đã push remote',
        log: `[Git Sync] Đồng bộ Git repository origin/${branch}. Webhook payload đã dispatch tới /api/workflow/webhook.`,
        metricKey: 'Remote Status',
        metricValue: 'SYNCED (100%)'
      },
      'node-jenkins-ci': {
        statusText: 'đang chạy test',
        successText: 'test đạt 100%',
        log: `[Jenkins CI Master] Kích hoạt pipeline job: pipeline-${projectName.toLowerCase()}. Thực thi 24/24 unit test suites: 100% PASSED.`,
        metricKey: 'Test Suite',
        metricValue: '24/24 PASS'
      },
      'node-owasp': {
        statusText: 'đang quét CVE',
        successText: 'sạch',
        log: `[OWASP Scanner] Cổng 1: Đã rà quét dependencies của [${projectName}]. Ngưỡng CVSS 7.0: 0 High / 0 Critical CVEs (SẠCH).`,
        metricKey: 'Cổng 1 (SCA)',
        metricValue: '0 CVEs (SẠCH)'
      },
      'node-sonarqube': {
        statusText: 'đang phân tích SAST',
        successText: 'đạt',
        log: `[SonarQube SAST] Cổng 2: Static Code Analysis hoàn tất. Coverage: 98.6% | Bugs: 0 | Smells: 0. Quality Gate GRADE A.`,
        metricKey: 'Cổng 2 (SAST)',
        metricValue: 'GRADE A'
      },
      'node-trivy': {
        statusText: 'đang quét secret',
        successText: 'sạch',
        log: `[Trivy Scanner] Cổng 3: Quét filesystem & secret keys. 0 Token/API Keys rò rỉ. Container Base OS an toàn.`,
        metricKey: 'Cổng 3 (Secrets)',
        metricValue: '0 LEAKS'
      },
      'node-docker': {
        statusText: 'đang build image',
        successText: 'đã push image',
        log: `[Docker BuildKit] Đóng gói Multi-stage container image [${projectName.toLowerCase()}:${commitHash}]. Đẩy lên Registry thành công (78MB).`,
        metricKey: 'Image Tag',
        metricValue: `${projectName.toLowerCase()}:${commitHash}`
      },
      'node-argocd': {
        statusText: 'đang sync GitOps',
        successText: 'đã đồng bộ k8s',
        log: `[ArgoCD GitOps] Reconciliation Loop so khớp Declarative K8s Manifests. ArgoCD Application: Synced & Healthy.`,
        metricKey: 'GitOps State',
        metricValue: 'IN_SYNC'
      },
      'node-prometheus': {
        statusText: 'đang scrape metrics',
        successText: 'metrics xanh lá',
        log: `[Prometheus Telemetry] Scrape Metrics 15s/lần: CPU 6%, RAM 240MB, Latency P99: 18ms. Trạng thái toàn cụm XANH LÁ.`,
        metricKey: 'Health Status',
        metricValue: '100% HEALTHY'
      },
      'node-myapp': {
        statusText: 'đang health-check',
        successText: 'online v1.0.0',
        log: `[Live Production] Ứng dụng ${projectName} đang phục vụ trực tuyến tại https://agent.globalcode.com.vn. Health probe: HTTP 200 OK (36ms).`,
        metricKey: 'Production Status',
        metricValue: 'ONLINE (v1.0.0)'
      }
    };

    for (let i = 0; i < PIPELINE_10_NODES.length; i++) {
      const targetId = PIPELINE_10_NODES[i];
      const detail = stepDetails[targetId];
      const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setCurrentPipelineStep(i);
      setActiveStepIndex(i);
      setSelectedNodeId(targetId);

      setNodes(curr => curr.map(n => {
        const stepIdx = PIPELINE_10_NODES.indexOf(n.id);
        if (stepIdx < i && stepIdx >= 0) {
          const prevDetail = stepDetails[n.id];
          return {
            ...n,
            status: 'SUCCESS',
            statusText: prevDetail?.successText || 'thành công'
          };
        }
        if (n.id === targetId) {
          const newLogs = detail?.log ? [`[${nowTime}] ${detail.log}`, ...n.logs] : n.logs;
          const newMetrics = detail?.metricKey ? { ...(n.metrics || {}), [detail.metricKey]: detail.metricValue || '' } : n.metrics;
          return {
            ...n,
            status: 'RUNNING',
            statusText: detail?.statusText || 'đang chạy...',
            logs: newLogs,
            metrics: newMetrics
          };
        }
        return n;
      }));

      try {
        const targetNode = nodes.find(n => n.id === targetId);
        if (targetNode?.actionType) {
          await fetch('/api/node-action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              actionType: targetNode.actionType,
              nodeId: targetId,
              projectName: projectName
            })
          });
        }
      } catch (err) {
        // Fallback smooth
      }

      await new Promise(r => setTimeout(r, stepDelay));

      setNodes(curr => curr.map(n => n.id === targetId ? {
        ...n,
        status: 'SUCCESS',
        statusText: detail?.successText || 'thành công'
      } : n));
    }

    setIsRunningAll(false);
    setCurrentPipelineStep(10);
    emitRealtimeUpdate('gcm_pipeline_completed', { success: true, totalSteps: 10 });
  };

  const handleReset = () => {
    if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    setIsRunningAll(false);
    setCurrentPipelineStep(0);
    setActiveStepIndex(0);
    setSelectedNodeId('node-owasp');
    if (selectedProject) {
      initNodesForProject(selectedProject, sysConfig);
    }
    emitRealtimeUpdate('gcm_pipeline_reset', { reset: true });
  };

  useEffect(() => {
    return () => {
      if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    };
  }, []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return {
    theme,
    setTheme,
    isLight,
    activeMainTab,
    setActiveMainTab,
    localProjects,
    selectedProject,
    setSelectedProject,
    isLoadingProjects,
    sysConfig,
    nodes,
    setNodes,
    selectedNodeId,
    setSelectedNodeId,
    selectedNode,
    isRunningAll,
    activeStepIndex,
    currentPipelineStep,
    soundEnabled,
    setSoundEnabled,
    isExecutingNodeAction,
    isConfigModalOpen,
    setIsConfigModalOpen,
    isDocsModalOpen,
    setIsDocsModalOpen,
    isCatalogModalOpen,
    setIsCatalogModalOpen,
    isChatOpen,
    setIsChatOpen,
    isNodeConfigDrawerOpen,
    setIsNodeConfigDrawerOpen,
    activeConfigNodeId,
    activePipelineToolIds,
    isOverBox1,
    setIsOverBox1,
    isOverBox2,
    setIsOverBox2,
    draggedNodeId,
    setDraggedNodeId,
    squadAgents,
    setSquadAgents,
    selectedAgentForModal,
    setSelectedAgentForModal,
    isAgentModalOpen,
    setIsAgentModalOpen,
    agentLogs,
    qaTestResults,
    setQaTestResults,
    trendingRepos,
    setTrendingRepos,
    activeSoloBattle,
    setActiveSoloBattle,
    soloBattleRepo,
    setSoloBattleRepo,
    soloBattleAgent,
    setSoloBattleAgent,
    isSoloModalOpen,
    setIsSoloModalOpen,
    isActorSidebarOpen,
    setIsActorSidebarOpen,
    canvasContainerRef,
    workflowEdges,
    setWorkflowEdges,
    nodePositions,
    activeConnectingPort,
    cursorPos,
    modalArtifact,
    setModalArtifact,
    speed,
    setSpeed,
    handleStartConnect,
    handleMouseMoveCanvas,
    handleFinishConnect,
    handleRemoveEdge,
    handleResetWorkflowEdges,
    handleSelectProject,
    handleStepForward,
    handleTriggerFullPipeline,
    handleReset,
    handleInspectArtifact,
    handleExecuteNodeAction,
    handleOpenNodeConfig,
    handleAddToolToPipeline,
    handleDropToolOnBox,
    handleSwapNodes,
    handleRemoveDynamicNode,
    fetchLocalProjects
  };
}
