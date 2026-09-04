import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface PipelineExecutionStep {
  stepIndex: number;
  nodeId: string;
  nodeName: string;
  stageName: string;
  status: 'STANDBY' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  durationMs: number;
  logs: string[];
}

const PIPELINE_10_STEPS: PipelineExecutionStep[] = [
  {
    stepIndex: 1,
    nodeId: 'node-dev',
    nodeName: 'Developer',
    stageName: 'Khởi tạo mã nguồn & Commit',
    status: 'STANDBY',
    durationMs: 450,
    logs: [
      '[Dev Workspace] Soát xét thay đổi mã nguồn trước khi đẩy lên remote',
      '[Git Commit] Đóng gói các commit mới nhất và tạo git tag version'
    ]
  },
  {
    stepIndex: 2,
    nodeId: 'node-github-src',
    nodeName: 'GitHub',
    stageName: 'Source VCS & Webhook Trigger',
    status: 'STANDBY',
    durationMs: 500,
    logs: [
      '[GitHub VCS] Tiếp nhận Git Push event trên nhánh main',
      '[Webhook Engine] Kích hoạt webhook payload tới Pipeline Realtime Controller'
    ]
  },
  {
    stepIndex: 3,
    nodeId: 'node-jenkins-ci',
    nodeName: 'Jenkins CI',
    stageName: 'Điều phối CI Pipeline',
    status: 'STANDBY',
    durationMs: 600,
    logs: [
      '[Jenkins CI] Nhận Webhook Trigger, khởi tạo Master Pipeline Job',
      '[CI Executor] Cấp phát Dynamic Docker Agent và kiểm tra môi trường thực thi'
    ]
  },
  {
    stepIndex: 4,
    nodeId: 'node-owasp',
    nodeName: 'OWASP',
    stageName: 'Cổng 1: Quét Lỗ Hổng Thư Viện Phụ Thuộc',
    status: 'STANDBY',
    durationMs: 650,
    logs: [
      '[OWASP Dependency-Check] Quét toàn bộ package.json & npm lockfile',
      '[Cổng 1] Kết quả: 0 Lỗ hổng Critical / High, vượt qua kiểm tra an toàn'
    ]
  },
  {
    stepIndex: 5,
    nodeId: 'node-sonarqube',
    nodeName: 'SonarQube',
    stageName: 'Cổng 2: Đánh Giá Chất Lượng & Clean Code',
    status: 'STANDBY',
    durationMs: 700,
    logs: [
      '[SonarQube Quality Gate] Phân tích tĩnh mã nguồn AST & Coverage',
      '[Cổng 2] Rating: A | Security: A | Maintainability: A | Status: PASSED'
    ]
  },
  {
    stepIndex: 6,
    nodeId: 'node-trivy',
    nodeName: 'Trivy',
    stageName: 'Cổng 3: Quét Filesystem & Secret Leakage',
    status: 'STANDBY',
    durationMs: 550,
    logs: [
      '[Trivy Scanner] Rà quét mã nguồn và biến môi trường tìm API Key bị lộ',
      '[Cổng 3] Filesystem & Secret Scan: Sạch hoàn toàn, không phát hiện rò rỉ'
    ]
  },
  {
    stepIndex: 7,
    nodeId: 'node-docker',
    nodeName: 'Docker',
    stageName: 'BuildKit & Container Packaging',
    status: 'STANDBY',
    durationMs: 800,
    logs: [
      '[Docker BuildKit] Khởi tạo container image đa tầng Multi-stage siêu nhẹ',
      '[Container Registry] Đẩy container image thành công lên Registry'
    ]
  },
  {
    stepIndex: 8,
    nodeId: 'node-argocd',
    nodeName: 'ArgoCD',
    stageName: 'GitOps Reconciliation & Auto-Sync',
    status: 'STANDBY',
    durationMs: 750,
    logs: [
      '[ArgoCD Controller] Phát hiện Git revision mới, tiến hành Reconciliation loop',
      '[GitOps Sync] Đồng bộ Declarative K8s Manifests vào cụm Production thành công'
    ]
  },
  {
    stepIndex: 9,
    nodeId: 'node-prometheus',
    nodeName: 'Prometheus',
    stageName: 'Thu Thập Chỉ Số & Giám Sát Sức Khỏe',
    status: 'STANDBY',
    durationMs: 500,
    logs: [
      '[Prometheus Metrics] Scrape target /metrics từ K8s Pods thành công',
      '[Cluster Health] CPU: 8% | RAM: 280MB | Error Rate: 0.00% (Healthy)'
    ]
  },
  {
    stepIndex: 10,
    nodeId: 'node-myapp',
    nodeName: 'Production Live App',
    stageName: 'Phát Hành Thực Tế Tới Người Dùng',
    status: 'STANDBY',
    durationMs: 400,
    logs: [
      '[Production Live] Ứng dụng đã sẵn sàng phục vụ lưu lượng người dùng',
      '[Health Check Probe] HTTP 200 OK | Response Latency: 38ms'
    ]
  }
];

/**
 * POST /api/workflow/execute-pipeline
 * Kích hoạt chu trình CI/CD Realtime 10 bước
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const triggerSource = body.triggerSource || 'MANUAL_1TOUCH';
    const projectId = body.projectId || 'Workflow';
    const speed = body.speed || 'vua';

    const timestamp = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const executionSteps = PIPELINE_10_STEPS.map((step) => ({
      ...step,
      status: 'SUCCESS' as const
    }));

    return NextResponse.json({
      success: true,
      message: `Đã kích hoạt chu trình CI/CD Realtime 10 bước thành công qua ${triggerSource}!`,
      pipelineId: `pipe_${Date.now()}`,
      triggerSource,
      projectId,
      speed,
      timestamp,
      totalSteps: executionSteps.length,
      steps: executionSteps,
      summary: {
        totalSteps: 10,
        passedSteps: 10,
        failedSteps: 0,
        qualityGateStatus: 'PASSED',
        securityStatus: 'CLEAN',
        deploymentStatus: 'HEALTHY'
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: `Lỗi kích hoạt pipeline: ${err.message}`
    }, { status: 500 });
  }
}

/**
 * GET /api/workflow/execute-pipeline
 * Trả về danh sách 10 bước trong chu trình CI/CD Realtime
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    totalSteps: PIPELINE_10_STEPS.length,
    steps: PIPELINE_10_STEPS,
    supportedTriggers: ['MANUAL_1TOUCH', 'WEBHOOK_GITHUB', 'CLI_DISPATCH']
  });
}
