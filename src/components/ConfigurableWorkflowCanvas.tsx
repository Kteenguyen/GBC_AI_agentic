'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  SkipForward, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Terminal, 
  Layers
} from 'lucide-react';

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
  GmailLogo
} from '@/components/BrandLogos';

export interface WorkflowNode {
  id: string;
  name: string;
  category: 'DEV' | 'CI' | 'SECURITY' | 'BUILD' | 'CD' | 'GITOPS' | 'DEPLOY' | 'MONITOR' | 'ALERT';
  box: 'CI_BOX' | 'CD_BOX' | 'EXTERNAL';
  badge?: string;
  status: 'STANDBY' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  statusText: string;
  stepNumber?: number;
  logs: string[];
  logoType: 'DEV' | 'GITHUB' | 'JENKINS' | 'OWASP' | 'SONARQUBE' | 'TRIVY' | 'DOCKER' | 'ARGOCD' | 'KUBERNETES' | 'MYAPP' | 'PROMETHEUS' | 'GRAFANA' | 'GMAIL';
  details: {
    title: string;
    description: string;
    gateName?: string;
    inputArtifact?: string;
    outputArtifact?: string;
  };
}

const INITIAL_NODES: WorkflowNode[] = [
  {
    id: 'node-dev',
    name: 'Developer',
    category: 'DEV',
    box: 'EXTERNAL',
    logoType: 'DEV',
    status: 'SUCCESS',
    statusText: 'Đã push commit',
    logs: [
      '[17:20:01] Developer Ktee commit code lên nhánh origin/main',
      '[17:20:02] Trigger GitHub Webhook dispatch to CI/CD pipeline'
    ],
    details: {
      title: 'Developer / Prompt Creator',
      description: 'Lập trình viên / Sếp phát hành prompt hoặc push commit lên GitHub.',
      outputArtifact: 'git commit: feat(core): update pipeline workflow'
    }
  },
  {
    id: 'node-github-src',
    name: 'GitHub',
    category: 'DEV',
    box: 'EXTERNAL',
    logoType: 'GITHUB',
    badge: 'source repo',
    status: 'SUCCESS',
    statusText: 'Pull code',
    logs: [
      '[17:20:03] GitHub repo: global-code-team/workflow-engine',
      '[17:20:04] Webhook sent payload to Jenkins CI & Antigravity Master'
    ],
    details: {
      title: 'GitHub Source Repository (Official SSOT)',
      description: 'Kho lưu trữ mã nguồn chính thức (SSOT), quản lý branches và pull requests.',
      outputArtifact: 'origin/main @ sha: 7f8a91b'
    }
  },
  {
    id: 'node-jenkins-ci',
    name: 'Jenkins CI',
    category: 'CI',
    box: 'CI_BOX',
    logoType: 'JENKINS',
    badge: 'deps tree',
    status: 'SUCCESS',
    statusText: 'Xây dựng logic',
    stepNumber: 1,
    logs: [
      '[17:20:05] Jenkins Pipeline initialized (Pipeline-as-Code)',
      '[17:20:06] Antigravity NLP Leader bóc tách DoDs và phân bổ 13 Subagents',
      '[17:20:07] Dependency Tree resolution: 128 packages verified in 1.2s'
    ],
    details: {
      title: 'Jenkins CI & Antigravity Master Orchestrator',
      description: 'Hệ thống CI tự động hóa tiếp nhận mã nguồn, phân rã task và khởi chạy chuỗi build kiểm định.',
      inputArtifact: 'source code repo',
      outputArtifact: 'build artifacts & dependency graph'
    }
  },
  {
    id: 'node-owasp',
    name: 'OWASP',
    category: 'SECURITY',
    box: 'CI_BOX',
    logoType: 'OWASP',
    badge: 'gác file XML',
    status: 'SUCCESS',
    statusText: 'Cổng 1 — Sạch',
    stepNumber: 2,
    logs: [
      '[17:20:08] OWASP Dependency-Check Scanner v9.0.8 started',
      '[17:20:09] Scanning pom.xml, package.json for CVE vulnerabilities',
      '[17:20:10] Result: 0 High/Critical CVEs found. CỔNG 1 PASSED.'
    ],
    details: {
      title: 'Cổng 1 — OWASP Dependency-Check',
      gateName: 'Cổng 1: Kiểm toán Thư viện Phụ thuộc (Dependencies)',
      description: 'Tự động rà soát toàn bộ thư viện bên thứ 3 trong package.json và pom.xml chống lỗ hổng bảo mật CVE.',
      outputArtifact: 'dependency-check-report.xml (0 Vulnerabilities)'
    }
  },
  {
    id: 'node-sonarqube',
    name: 'SonarQube',
    category: 'SECURITY',
    box: 'CI_BOX',
    logoType: 'SONARQUBE',
    badge: 'cổng 2',
    status: 'SUCCESS',
    statusText: 'Cổng 2 — Đạt',
    stepNumber: 3,
    logs: [
      '[17:20:11] SonarQube Scanner analyzing codebase...',
      '[17:20:12] Code Smells: 0 | Bugs: 0 | Vulnerabilities: 0',
      '[17:20:13] Code Coverage: 98.4% | Quality Gate: PASSED (Grade A)'
    ],
    details: {
      title: 'Cổng 2 — SonarQube Clean Code & Quality Gate',
      gateName: 'Cổng 2: Kiểm toán Độ Sạch Mã Nguồn & Static Analysis',
      description: 'Phân tích tĩnh mã nguồn TypeScript/Next.js, phát hiện anti-patterns, rò rỉ bộ nhớ và đo lường độ phủ test.',
      outputArtifact: 'Sonar Quality Gate: PASSED (Grade A)'
    }
  },
  {
    id: 'node-trivy',
    name: 'Trivy',
    category: 'SECURITY',
    box: 'CI_BOX',
    logoType: 'TRIVY',
    badge: 'cổng 3',
    status: 'SUCCESS',
    statusText: 'Cổng 3 — Sạch',
    stepNumber: 4,
    logs: [
      '[17:20:14] Trivy Filesystem & Container Image Vulnerability Scan',
      '[17:20:15] Scanning root filesystem & secret keys in .env',
      '[17:20:16] Result: 0 Secrets leaked, 0 OS CVEs. CỔNG 3 PASSED.'
    ],
    details: {
      title: 'Cổng 3 — Trivy Security Scanner',
      gateName: 'Cổng 3: Quét Toàn Diện Filesystem & Container Layer',
      description: 'Rà soát lỗ hổng lớp hệ điều hành, chống lộ Secret Keys (.env) và mã độc trong Container Image.',
      outputArtifact: 'trivy-scan-result.json (0 Secrets leaked)'
    }
  },
  {
    id: 'node-docker',
    name: 'Docker',
    category: 'BUILD',
    box: 'CI_BOX',
    logoType: 'DOCKER',
    badge: 'build & push',
    status: 'RUNNING',
    statusText: 'Đang đóng gói',
    stepNumber: 5,
    logs: [
      '[17:20:17] Docker BuildKit starting multi-stage build...',
      '[17:20:18] Generating optimized Next.js Standalone bundle',
      '[17:20:19] Pushing image to registry: docker.io/globalcode/workflow:v1.4.2'
    ],
    details: {
      title: 'Docker Image Build & Registry Push',
      description: 'Đóng gói ứng dụng thành Container Standalone siêu nhẹ và push lên Docker Registry an toàn.',
      outputArtifact: 'docker.io/globalcode/workflow:v1.4.2 (Image Size: 78MB)'
    }
  },
  {
    id: 'node-jenkins-cd',
    name: 'Jenkins CD',
    category: 'CD',
    box: 'CD_BOX',
    logoType: 'JENKINS',
    badge: 'deploy trigger',
    status: 'STANDBY',
    statusText: 'Chờ tín hiệu',
    stepNumber: 6,
    logs: [
      '[17:20:20] Jenkins CD awaiting Docker push completion...',
      '[17:20:21] Preparing GitOps commit with new image tag v1.4.2'
    ],
    details: {
      title: 'Jenkins CD (Continuous Delivery)',
      description: 'Tự động cập nhật tag phiên bản mới vào Config Repo để kích hoạt quy trình GitOps.',
      outputArtifact: 'GitOps release patch: set image.tag=v1.4.2'
    }
  },
  {
    id: 'node-github-config',
    name: 'GitHub',
    category: 'GITOPS',
    box: 'CD_BOX',
    logoType: 'GITHUB',
    badge: 'config repo',
    status: 'STANDBY',
    statusText: 'Chờ cập nhật',
    stepNumber: 7,
    logs: [
      '[17:20:22] Config repo: k8s-gitops-manifests',
      '[17:20:23] Manifest values.yaml updated with new image tag'
    ],
    details: {
      title: 'GitHub Config Repo (GitOps Manifests)',
      description: 'Kho lưu trữ cấu hình Kubernetes Helm charts / Kustomize theo triết lý GitOps 100% Declarative.',
      outputArtifact: 'deployment.yaml @ commit 9a2f1'
    }
  },
  {
    id: 'node-argocd',
    name: 'ArgoCD',
    category: 'GITOPS',
    box: 'CD_BOX',
    logoType: 'ARGOCD',
    badge: 'sync engine',
    status: 'STANDBY',
    statusText: 'Chờ sync',
    stepNumber: 8,
    logs: [
      '[17:20:24] ArgoCD Controller detecting drift in Config Repo',
      '[17:20:25] Automated Sync initiated to Kubernetes cluster'
    ],
    details: {
      title: 'ArgoCD GitOps Sync Engine',
      description: 'Bộ điều khiển GitOps tự động đồng bộ trạng thái thực tế của Kubernetes với cấu hình trong Git.',
      outputArtifact: 'ArgoCD Sync: Synced & Healthy'
    }
  },
  {
    id: 'node-k8s',
    name: 'Kubernetes',
    category: 'DEPLOY',
    box: 'CD_BOX',
    logoType: 'KUBERNETES',
    badge: 'deploy on k8s',
    status: 'STANDBY',
    statusText: 'Chờ deploy',
    stepNumber: 9,
    logs: [
      '[17:20:26] RollingUpdate deployment triggered on namespace: production',
      '[17:20:27] 3 Pods running with 0 downtime (Zero-Downtime Deployment)'
    ],
    details: {
      title: 'Kubernetes Cluster (Production Runtime)',
      description: 'Cụm máy chủ Kubernetes điều phối các container pods, cân bằng tải và tự phục hồi (Self-Healing).',
      outputArtifact: 'k8s service: workflow-prod-svc (Port 80/443)'
    }
  },
  {
    id: 'node-myapp',
    name: 'MyApp · production',
    category: 'DEPLOY',
    box: 'CD_BOX',
    logoType: 'MYAPP',
    badge: 'live app',
    status: 'STANDBY',
    statusText: 'Chưa lên',
    stepNumber: 10,
    logs: [
      '[17:20:28] Application health check endpoint /api/health -> 200 OK',
      '[17:20:29] Domain active: https://noibo.globalcode.com.vn'
    ],
    details: {
      title: 'MyApp Production Live System',
      description: 'Hệ thống thực tế chạy trên Production phục vụ người dùng cuối với 100% Uptime.',
      outputArtifact: 'https://noibo.globalcode.com.vn (Active)'
    }
  },
  {
    id: 'node-prometheus',
    name: 'Prometheus',
    category: 'MONITOR',
    box: 'CD_BOX',
    logoType: 'PROMETHEUS',
    badge: 'metrics',
    status: 'STANDBY',
    statusText: 'Thu thập số liệu',
    logs: [
      '[17:20:30] Prometheus scraping metrics from /metrics endpoint every 5s',
      '[17:20:31] CPU Usage: 12% | Memory: 310MB | Latency: 42ms'
    ],
    details: {
      title: 'Prometheus Metrics Collector',
      description: 'Hệ thống giám sát hiệu năng thời gian thực thu thập số liệu CPU, RAM, Network và Latency.',
      outputArtifact: 'Prometheus TSDB Metrics Stream'
    }
  },
  {
    id: 'node-grafana',
    name: 'Grafana',
    category: 'MONITOR',
    box: 'CD_BOX',
    logoType: 'GRAFANA',
    badge: 'dashboard',
    status: 'STANDBY',
    statusText: 'Trực quan hóa',
    logs: [
      '[17:20:32] Grafana Dashboard rendering live RPS & Error Rate',
      '[17:20:33] Realtime alerts threshold: P99 Latency < 200ms'
    ],
    details: {
      title: 'Grafana Visualization & Alert Rules',
      description: 'Bảng biểu đồ trực quan hóa dữ liệu hạ tầng và phát cảnh báo tự động khi có bất thường.',
      outputArtifact: 'Grafana Live Dashboard: Healthy'
    }
  },
  {
    id: 'node-gmail',
    name: 'Gmail / Telegram',
    category: 'ALERT',
    box: 'CD_BOX',
    logoType: 'GMAIL',
    badge: 'notify alert',
    status: 'STANDBY',
    statusText: 'Gửi thông báo',
    logs: [
      '[17:20:34] Alertmanager triggered email notification',
      '[17:20:35] Email sent to team: Deployment v1.4.2 SUCCESS'
    ],
    details: {
      title: 'Gmail & Telegram Alert Dispatcher',
      description: 'Hệ thống thông báo tức thời tới Sếp và đội ngũ kỹ thuật qua Email & Telegram khi deploy thành công.',
      outputArtifact: 'Notification: Sếp Ktee đã nhận báo cáo nghiệm thu'
    }
  }
];

export const ConfigurableWorkflowCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-owasp');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [, setActiveNodeIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [ciTool, setCiTool] = useState<string>('Jenkins CI');
  const [owaspGate, setOwaspGate] = useState<string>('Sạch (0 CVE)');
  const [sonarGate, setSonarGate] = useState<string>('Đạt (Grade A)');
  const [trivyGate, setTrivyGate] = useState<string>('Sạch (0 Leak)');
  const [speed, setSpeed] = useState<string>('Vừa (1x)');

  const runnerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleStepForward = () => {
    setActiveNodeIndex(prev => {
      const nextIdx = Math.min(nodes.length - 1, prev + 1);
      setNodes(currentNodes => currentNodes.map((n, i) => {
        if (i < nextIdx) return { ...n, status: 'SUCCESS', statusText: 'Thành công' };
        if (i === nextIdx) return { ...n, status: 'RUNNING', statusText: 'Đang chạy' };
        return { ...n, status: 'STANDBY', statusText: 'Chờ' };
      }));
      setSelectedNodeId(nodes[nextIdx].id);
      return nextIdx;
    });
  };

  const handlePushCodeRunAll = () => {
    setIsRunningAll(true);
    let current = 0;
    setActiveNodeIndex(0);
    setSelectedNodeId(nodes[0].id);

    if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    const speedMs = speed.includes('Nhanh') ? 400 : speed.includes('Chậm') ? 1400 : 800;

    runnerTimerRef.current = setInterval(() => {
      current++;
      if (current >= nodes.length) {
        if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
        setIsRunningAll(false);
        setNodes(currentNodes => currentNodes.map(n => ({
          ...n,
          status: 'SUCCESS',
          statusText: n.id === 'node-myapp' ? 'Đang chạy LIVE' : 'Thành công'
        })));
        return;
      }

      setActiveNodeIndex(current);
      setSelectedNodeId(nodes[current].id);
      setNodes(currentNodes => currentNodes.map((n, i) => {
        if (i < current) return { ...n, status: 'SUCCESS', statusText: 'Thành công' };
        if (i === current) return { ...n, status: 'RUNNING', statusText: 'Đang chạy' };
        return { ...n, status: 'STANDBY', statusText: 'Chờ' };
      }));
    }, speedMs);
  };

  const handleReset = () => {
    if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    setIsRunningAll(false);
    setActiveNodeIndex(0);
    setSelectedNodeId('node-dev');
    setNodes(INITIAL_NODES);
  };

  useEffect(() => {
    return () => {
      if (runnerTimerRef.current) clearInterval(runnerTimerRef.current);
    };
  }, []);

  const renderOfficialLogo = (logoType: WorkflowNode['logoType'], className = "w-8 h-8") => {
    switch (logoType) {
      case 'DEV':
        return <DeveloperLogo className={className} />;
      case 'GITHUB':
        return <GitHubLogo className={className} />;
      case 'JENKINS':
        return <JenkinsLogo className={className} />;
      case 'OWASP':
        return <OwaspLogo className={className} />;
      case 'SONARQUBE':
        return <SonarQubeLogo className={className} />;
      case 'TRIVY':
        return <TrivyLogo className={className} />;
      case 'DOCKER':
        return <DockerLogo className={className} />;
      case 'ARGOCD':
        return <ArgoCDLogo className={className} />;
      case 'KUBERNETES':
        return <KubernetesLogo className={className} />;
      case 'MYAPP':
        return <MyAppLogo className={className} />;
      case 'PROMETHEUS':
        return <PrometheusLogo className={className} />;
      case 'GRAFANA':
        return <GrafanaLogo className={className} />;
      case 'GMAIL':
        return <GmailLogo className={className} />;
      default:
        return <DeveloperLogo className={className} />;
    }
  };

  const getNodeStatusBadge = (status: WorkflowNode['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'RUNNING':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 ring-2 ring-cyan-400/40 animate-pulse';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'FAILED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800/80 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Configuration & Control Bar */}
      <div className="w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePushCodeRunAll}
            disabled={isRunningAll}
            className={`btn-action font-extrabold text-white shadow-lg transition-all ${
              isRunningAll
                ? 'bg-cyan-600 animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-emerald-500/20'
            }`}
            style={{ fontSize: '12px', height: '34px', padding: '6px 14px', whiteSpace: 'nowrap' }}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>► Push code (chạy hết)</span>
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={isRunningAll}
            className="btn-action bg-[#1E293B] hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold"
            style={{ fontSize: '11.5px', height: '34px', padding: '6px 12px', whiteSpace: 'nowrap' }}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Tiếp tục</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn-action bg-[#090D16] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
            style={{ fontSize: '11.5px', height: '34px', padding: '6px 12px', whiteSpace: 'nowrap' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại</span>
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#090D16] border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 text-[10px]">CI TOOL:</span>
            <select
              value={ciTool}
              onChange={(e) => setCiTool(e.target.value)}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="Jenkins CI">Jenkins CI</option>
              <option value="GitHub Actions">GitHub Actions</option>
              <option value="Antigravity Cloud">Antigravity Cloud</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#090D16] border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 text-[10px]">OWASP:</span>
            <select
              value={owaspGate}
              onChange={(e) => setOwaspGate(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="Sạch (0 CVE)">sạch</option>
              <option value="Quét sâu">quét sâu</option>
              <option value="Bỏ qua">bỏ qua</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#090D16] border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 text-[10px]">SONARQUBE:</span>
            <select
              value={sonarGate}
              onChange={(e) => setSonarGate(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="Đạt (Grade A)">đạt</option>
              <option value="Cảnh báo">cảnh báo</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#090D16] border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 text-[10px]">TRIVY:</span>
            <select
              value={trivyGate}
              onChange={(e) => setTrivyGate(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="Sạch (0 Leak)">sạch</option>
              <option value="Cảnh báo CVE">cảnh báo</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#090D16] border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-slate-400 text-[10px]">Tốc độ:</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="Chậm (0.5x)">chậm</option>
              <option value="Vừa (1x)">vừa</option>
              <option value="Nhanh (2x)">nhanh</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-[#090D16] border border-slate-800 text-slate-400 hover:text-white"
            title="Bật/Tắt Âm Thanh"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Visual Workflow Canvas */}
      <div className="w-full bg-[#070B14] border border-[#1E293B] rounded-2xl p-4 sm:p-8 shadow-2xl overflow-x-auto relative select-none">
        <div className="min-w-[1050px] space-y-8">
          
          {/* External Left: Developer Node */}
          <div className="flex items-center gap-8">
            <div
              onClick={() => setSelectedNodeId('node-dev')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                selectedNodeId === 'node-dev'
                  ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/10 scale-105'
                  : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
              }`}
              style={{ width: '120px' }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                {renderOfficialLogo('DEV', 'w-7 h-7')}
              </div>
              <span className="font-bold text-xs text-white text-center">Developer</span>
              <span className="text-[10px] text-slate-400 font-mono">Ktee (Lead)</span>
            </div>

            <div className="flex items-center text-slate-600 gap-1">
              <div className="h-[2px] w-12 bg-gradient-to-r from-cyan-500 to-blue-500 relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-400 whitespace-nowrap">push code</span>
              </div>
              <span className="text-cyan-400 text-xs">▶</span>
            </div>

            <div
              onClick={() => setSelectedNodeId('node-github-src')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                selectedNodeId === 'node-github-src'
                  ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/10 scale-105'
                  : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
              }`}
              style={{ width: '120px' }}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                {renderOfficialLogo('GITHUB', 'w-7 h-7')}
              </div>
              <span className="font-bold text-xs text-white text-center">GitHub</span>
              <span className="text-[10px] text-slate-400 font-mono">source repo</span>
            </div>
          </div>

          {/* BOX 1: JENKINS CI & 3 CỔNG BẢO MẬT */}
          <div className="rounded-2xl border-2 border-dashed border-slate-700/80 bg-[#0A101E]/60 p-5 relative">
            <div className="absolute -top-3.5 left-6 bg-[#0B0F19] px-3 py-0.5 rounded-full border border-slate-700 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              ① JENKINS CI — build & 3 cổng bảo mật
            </div>

            <div className="grid grid-cols-5 gap-6 items-center pt-2">
              
              {/* Node 1: Jenkins CI */}
              <div
                onClick={() => setSelectedNodeId('node-jenkins-ci')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNodeId === 'node-jenkins-ci'
                    ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                  {renderOfficialLogo('JENKINS', 'w-8 h-8')}
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-xs text-white text-center">Jenkins CI</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    deps tree
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-jenkins-ci')?.status || 'SUCCESS')}`}>
                  {nodes.find(n => n.id === 'node-jenkins-ci')?.statusText}
                </span>
              </div>

              {/* Node 2: OWASP (Cổng 1) */}
              <div
                onClick={() => setSelectedNodeId('node-owasp')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNodeId === 'node-owasp'
                    ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                  {renderOfficialLogo('OWASP', 'w-8 h-8')}
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-xs text-white text-center">OWASP</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    gác file XML
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-owasp')?.status || 'SUCCESS')}`}>
                  {nodes.find(n => n.id === 'node-owasp')?.statusText}
                </span>
              </div>

              {/* Node 3: SonarQube (Cổng 2) */}
              <div
                onClick={() => setSelectedNodeId('node-sonarqube')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNodeId === 'node-sonarqube'
                    ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                  {renderOfficialLogo('SONARQUBE', 'w-8 h-8')}
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-xs text-white text-center">SonarQube</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    cổng 2
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-sonarqube')?.status || 'SUCCESS')}`}>
                  {nodes.find(n => n.id === 'node-sonarqube')?.statusText}
                </span>
              </div>

              {/* Node 4: Trivy (Cổng 3) */}
              <div
                onClick={() => setSelectedNodeId('node-trivy')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNodeId === 'node-trivy'
                    ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                  {renderOfficialLogo('TRIVY', 'w-8 h-8')}
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-xs text-white text-center">Trivy</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    cổng 3
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-trivy')?.status || 'SUCCESS')}`}>
                  {nodes.find(n => n.id === 'node-trivy')?.statusText}
                </span>
              </div>

              {/* Node 5: Docker */}
              <div
                onClick={() => setSelectedNodeId('node-docker')}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                  selectedNodeId === 'node-docker'
                    ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                    : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                  {renderOfficialLogo('DOCKER', 'w-8 h-8')}
                </div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="font-bold text-xs text-white text-center">Docker</span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    build & push
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-docker')?.status || 'RUNNING')}`}>
                  {nodes.find(n => n.id === 'node-docker')?.statusText}
                </span>
              </div>

            </div>
          </div>

          {/* BOX 2: JENKINS CD & GITOPS DEPLOY & MONITOR */}
          <div className="rounded-2xl border-2 border-dashed border-slate-700/80 bg-[#0A101E]/60 p-5 relative">
            <div className="absolute -top-3.5 left-6 bg-[#0B0F19] px-3 py-0.5 rounded-full border border-slate-700 text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              ② JENKINS CD — GitOps deploy & monitor
            </div>

            <div className="space-y-6 pt-2">
              
              {/* Top Row: Jenkins CD -> GitHub config -> ArgoCD -> K8s -> MyApp */}
              <div className="grid grid-cols-5 gap-6 items-center">
                
                {/* Jenkins CD */}
                <div
                  onClick={() => setSelectedNodeId('node-jenkins-cd')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedNodeId === 'node-jenkins-cd'
                      ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                    {renderOfficialLogo('JENKINS', 'w-8 h-8')}
                  </div>
                  <span className="font-bold text-xs text-white text-center">Jenkins CD</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-jenkins-cd')?.status || 'STANDBY')}`}>
                    {nodes.find(n => n.id === 'node-jenkins-cd')?.statusText}
                  </span>
                </div>

                {/* GitHub config repo */}
                <div
                  onClick={() => setSelectedNodeId('node-github-config')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedNodeId === 'node-github-config'
                      ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                    {renderOfficialLogo('GITHUB', 'w-7 h-7')}
                  </div>
                  <span className="font-bold text-xs text-white text-center">GitHub</span>
                  <span className="text-[10px] text-slate-400 font-mono">config repo</span>
                </div>

                {/* ArgoCD */}
                <div
                  onClick={() => setSelectedNodeId('node-argocd')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedNodeId === 'node-argocd'
                      ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                    {renderOfficialLogo('ARGOCD', 'w-8 h-8')}
                  </div>
                  <span className="font-bold text-xs text-white text-center">ArgoCD</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-argocd')?.status || 'STANDBY')}`}>
                    {nodes.find(n => n.id === 'node-argocd')?.statusText}
                  </span>
                </div>

                {/* Kubernetes */}
                <div
                  onClick={() => setSelectedNodeId('node-k8s')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedNodeId === 'node-k8s'
                      ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                    {renderOfficialLogo('KUBERNETES', 'w-8 h-8')}
                  </div>
                  <span className="font-bold text-xs text-white text-center">Kubernetes</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-k8s')?.status || 'STANDBY')}`}>
                    {nodes.find(n => n.id === 'node-k8s')?.statusText}
                  </span>
                </div>

                {/* MyApp Production */}
                <div
                  onClick={() => setSelectedNodeId('node-myapp')}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                    selectedNodeId === 'node-myapp'
                      ? 'bg-[#13203C] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl scale-105'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow mb-1.5">
                    {renderOfficialLogo('MYAPP', 'w-8 h-8')}
                  </div>
                  <span className="font-bold text-xs text-cyan-300 text-center">MyApp · prod</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getNodeStatusBadge(nodes.find(n => n.id === 'node-myapp')?.status || 'STANDBY')}`}>
                    {nodes.find(n => n.id === 'node-myapp')?.statusText}
                  </span>
                </div>

              </div>

              {/* Bottom Row: Loop Monitoring */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-8">
                
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Loop Giám Sát & Cảnh Báo:
                </span>

                {/* Prometheus */}
                <div
                  onClick={() => setSelectedNodeId('node-prometheus')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedNodeId === 'node-prometheus'
                      ? 'bg-[#13203C] border-cyan-400 ring-1 ring-cyan-400/40'
                      : 'bg-[#0F172A] border-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {renderOfficialLogo('PROMETHEUS', 'w-5 h-5')}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Prometheus</span>
                    <span className="text-[9px] text-slate-400 font-mono">metrics</span>
                  </div>
                </div>

                <span className="text-slate-600 text-xs">➔</span>

                {/* Grafana */}
                <div
                  onClick={() => setSelectedNodeId('node-grafana')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedNodeId === 'node-grafana'
                      ? 'bg-[#13203C] border-cyan-400 ring-1 ring-cyan-400/40'
                      : 'bg-[#0F172A] border-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {renderOfficialLogo('GRAFANA', 'w-5 h-5')}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Grafana</span>
                    <span className="text-[9px] text-slate-400 font-mono">dashboard</span>
                  </div>
                </div>

                <span className="text-slate-600 text-xs">➔</span>

                {/* Gmail Alert */}
                <div
                  onClick={() => setSelectedNodeId('node-gmail')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    selectedNodeId === 'node-gmail'
                      ? 'bg-[#13203C] border-cyan-400 ring-1 ring-cyan-400/40'
                      : 'bg-[#0F172A] border-slate-800'
                  }`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {renderOfficialLogo('GMAIL', 'w-5 h-5')}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Gmail / Telegram</span>
                    <span className="text-[9px] text-slate-400 font-mono">notify alert</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Node Inspector Detail Panel */}
      {selectedNode && (
        <div className="w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow">
                {renderOfficialLogo(selectedNode.logoType, 'w-8 h-8')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {selectedNode.details.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getNodeStatusBadge(selectedNode.status)}`}>
                    {selectedNode.statusText}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedNode.details.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">Phân loại:</span>
              <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {selectedNode.category}
              </span>
            </div>
          </div>

          {/* Artifacts & Realtime Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Live Execution Logs:
              </span>
              <div className="space-y-1 text-slate-300 text-[11.5px] leading-relaxed">
                {selectedNode.logs.map((line, i) => (
                  <p key={i} className="text-slate-300">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Artifacts & Trạng Thái Cổng:
              </span>
              <div className="space-y-1.5 text-slate-300 text-[11.5px]">
                {selectedNode.details.gateName && (
                  <div className="p-2 rounded bg-purple-950/20 border border-purple-500/30 text-purple-300 font-bold">
                    {selectedNode.details.gateName}
                  </div>
                )}
                {selectedNode.details.inputArtifact && (
                  <p className="text-slate-400">
                    Input: <span className="text-slate-200">{selectedNode.details.inputArtifact}</span>
                  </p>
                )}
                {selectedNode.details.outputArtifact && (
                  <p className="text-emerald-400">
                    Output: <span className="text-emerald-300">{selectedNode.details.outputArtifact}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
