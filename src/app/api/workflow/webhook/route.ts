import { NextRequest, NextResponse } from 'next/server';
import { topologicalSort, DEFAULT_INITIAL_EDGES } from '@/lib/workflowGraphEngine';

export const dynamic = 'force-dynamic';

interface WebhookTriggerData {
  branch: string;
  commitId: string;
  commitMessage: string;
  authorName: string;
  repoName: string;
  status: string;
  executionOrder: string[];
  pipelineNodes: Array<{
    step: number;
    nodeId: string;
    name: string;
    category: string;
    role: string;
    status: 'STANDBY' | 'QUEUED' | 'RUNNING' | 'SUCCESS';
    inputArtifact?: string;
    outputArtifact?: string;
  }>;
}

const PIPELINE_NODE_DEFINITIONS = [
  {
    nodeId: 'node-dev',
    name: 'Developer & Workspace Root',
    category: 'DEV',
    role: 'Môi Trường & Tác Vụ Lập Trình',
    inputArtifact: 'Developer Prompt / Local Workstation',
    outputArtifact: 'Git Working Tree & Commit Changes'
  },
  {
    nodeId: 'node-github-src',
    name: 'GitHub Source Repository',
    category: 'DEV',
    role: 'Kho Lưu Trữ Mã Nguồn Chính Thức (SSOT)',
    inputArtifact: 'Git Push Remote Ref',
    outputArtifact: 'Source Commit SHA & Webhook Dispatch'
  },
  {
    nodeId: 'node-jenkins-ci',
    name: 'Jenkins CI Master Server',
    category: 'CI',
    role: 'Tự Động Hóa Build & Pipeline Orchestration',
    inputArtifact: 'Webhook Event Payload',
    outputArtifact: '13 AI Subagents Task Decomposition & Build Job'
  },
  {
    nodeId: 'node-owasp',
    name: 'OWASP Dependency-Check',
    category: 'SECURITY',
    role: 'Cổng 1: Kiểm Toán Thư Viện Phụ Thuộc (Dependencies)',
    inputArtifact: 'package.json & lockfile',
    outputArtifact: 'dependency-check-report.xml (0 High/Critical CVEs)'
  },
  {
    nodeId: 'node-sonarqube',
    name: 'SonarQube Quality Gate',
    category: 'SECURITY',
    role: 'Cổng 2: Kiểm Toán Chất Lượng Mã Nguồn (SAST)',
    inputArtifact: 'TypeScript AST & Source Files',
    outputArtifact: 'Quality Gate Grade A (0 Bugs, 0 Smells)'
  },
  {
    nodeId: 'node-trivy',
    name: 'Trivy Vulnerability Scanner',
    category: 'SECURITY',
    role: 'Cổng 3: Quét Filesystem & Secret Keys & OS CVE',
    inputArtifact: 'Container Layer & Root Filesystem',
    outputArtifact: 'trivy-scan-result.json (0 Secrets Leaked)'
  },
  {
    nodeId: 'node-docker',
    name: 'Docker Build & Container Registry',
    category: 'BUILD',
    role: 'Đóng Gói & Đẩy Container Image Đa Tầng',
    inputArtifact: 'Dockerfile & Next.js Standalone Bundle',
    outputArtifact: 'docker.io/globalcode/workflow:v1.0.0 (78MB)'
  },
  {
    nodeId: 'node-argocd',
    name: 'ArgoCD GitOps Controller',
    category: 'GITOPS',
    role: 'Điều Phối Triển Khai GitOps Declarative',
    inputArtifact: 'Kubernetes YAML Manifests',
    outputArtifact: 'ArgoCD Sync: Synced & Healthy'
  },
  {
    nodeId: 'node-prom',
    name: 'Prometheus Metrics & Scrape Target',
    category: 'MONITOR',
    role: 'Giám Sát Thông Số Hệ Thống & SLA',
    inputArtifact: '/api/metrics Scrape Stream',
    outputArtifact: 'Prometheus TSDB Series (CPU 12%, RAM 310MB)'
  },
  {
    nodeId: 'node-myapp',
    name: 'MyApp Production Live System',
    category: 'DEPLOY',
    role: 'Hệ Thống Thực Tế Đang Phục Vụ Người Dùng',
    inputArtifact: 'Kubernetes Ingress & Live Service',
    outputArtifact: 'https://agent.globalcode.com.vn (200 OK)'
  }
];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: any = {};
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch (parseErr) {
        return NextResponse.json({
          success: false,
          error: 'Invalid JSON payload received in Webhook POST request'
        }, { status: 400 });
      }
    }

    const headers = req.headers;
    const githubEvent = headers.get('x-github-event');
    const gitlabEvent = headers.get('x-gitlab-event');
    const giteaEvent = headers.get('x-gitea-event');

    let provider = 'Generic';
    let eventName = 'push';

    if (githubEvent) {
      provider = 'GitHub';
      eventName = githubEvent;
    } else if (gitlabEvent) {
      provider = 'GitLab';
      eventName = gitlabEvent;
    } else if (giteaEvent) {
      provider = 'Gitea';
      eventName = giteaEvent;
    }

    // Ping / Verification handshake
    if (eventName === 'ping') {
      return NextResponse.json({
        success: true,
        provider,
        event: 'ping',
        message: '[WEBHOOK] Ping handshake verification successful. Webhook endpoint is healthy.',
        zen: body.zen || 'Responsiveness is key.',
        hookId: body.hook_id || 'unknown'
      });
    }

    // Trích xuất metadata thông tin commit & branch
    let branch = 'main';
    if (body.ref) {
      branch = body.ref.replace('refs/heads/', '').replace('refs/tags/', '');
    } else if (body.branch) {
      branch = body.branch;
    }

    let commitId = 'HEAD';
    if (body.after && body.after !== '0000000000000000000000000000000000000000') {
      commitId = body.after.substring(0, 7);
    } else if (body.head_commit && body.head_commit.id) {
      commitId = body.head_commit.id.substring(0, 7);
    } else if (body.checkout_sha) {
      commitId = body.checkout_sha.substring(0, 7);
    } else if (Array.isArray(body.commits) && body.commits.length > 0 && body.commits[0].id) {
      commitId = body.commits[0].id.substring(0, 7);
    } else if (body.commitId) {
      commitId = body.commitId.substring(0, 7);
    }

    let commitMessage = 'Auto trigger CI/CD pipeline from git push';
    if (body.head_commit && body.head_commit.message) {
      commitMessage = body.head_commit.message.split('\n')[0];
    } else if (Array.isArray(body.commits) && body.commits.length > 0 && body.commits[0].message) {
      commitMessage = body.commits[0].message.split('\n')[0];
    } else if (body.commitMessage) {
      commitMessage = body.commitMessage;
    }

    let authorName = 'DevOps Team';
    if (body.head_commit && body.head_commit.author && body.head_commit.author.name) {
      authorName = body.head_commit.author.name;
    } else if (body.pusher && body.pusher.name) {
      authorName = body.pusher.name;
    } else if (body.pusher && body.pusher.username) {
      authorName = body.pusher.username;
    } else if (body.user_name) {
      authorName = body.user_name;
    } else if (body.sender && body.sender.login) {
      authorName = body.sender.login;
    } else if (body.authorName) {
      authorName = body.authorName;
    }

    let repoName = 'Kteenguyen/GBC_AI_agentic';
    if (body.repository && body.repository.full_name) {
      repoName = body.repository.full_name;
    } else if (body.project && body.project.path_with_namespace) {
      repoName = body.project.path_with_namespace;
    } else if (body.repository && body.repository.name) {
      repoName = body.repository.name;
    } else if (body.repoName) {
      repoName = body.repoName;
    }

    // Sắp xếp thứ tự Topological của 10 nodes qua Kahn Algorithm
    const allNodeIds = PIPELINE_NODE_DEFINITIONS.map(n => n.nodeId);
    const executionOrder = topologicalSort(allNodeIds, DEFAULT_INITIAL_EDGES);

    const pipelineNodes = executionOrder.map((id, index) => {
      const def = PIPELINE_NODE_DEFINITIONS.find(n => n.nodeId === id) || {
        nodeId: id,
        name: id,
        category: 'CI',
        role: 'Tác vụ Pipeline',
        inputArtifact: 'Input Data',
        outputArtifact: 'Output Result'
      };

      return {
        step: index + 1,
        nodeId: def.nodeId,
        name: def.name,
        category: def.category,
        role: def.role,
        status: (index === 0 ? 'RUNNING' : 'QUEUED') as 'STANDBY' | 'QUEUED' | 'RUNNING' | 'SUCCESS',
        inputArtifact: def.inputArtifact,
        outputArtifact: def.outputArtifact
      };
    });

    const triggerData: WebhookTriggerData = {
      branch,
      commitId,
      commitMessage,
      authorName,
      repoName,
      status: 'QUEUED_FOR_EXECUTION',
      executionOrder,
      pipelineNodes
    };

    const timestamp = new Date().toISOString();
    console.log(`[WEBHOOK] [${timestamp}] Received ${eventName} event from ${provider} (${repoName}:${branch}) by ${authorName} [Commit: ${commitId}]`);

    return NextResponse.json({
      success: true,
      provider,
      event: eventName,
      receivedAt: timestamp,
      message: `[WEBHOOK] Đã tiếp nhận thành công push event từ ${provider}. Sẵn sàng kích hoạt 10 nodes pipeline.`,
      triggerData,
      nextAction: {
        executePipelineUrl: '/api/workflow/execute-pipeline',
        method: 'POST',
        payload: {
          action: 'START_FULL_PIPELINE',
          branch,
          commitId,
          repoName,
          executionOrder
        }
      }
    });
  } catch (err: any) {
    console.error('[WEBHOOK ERROR]', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Internal server error while processing webhook'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin || 'https://agent.globalcode.com.vn';
  const webhookUrl = `${origin}/api/workflow/webhook`;

  return NextResponse.json({
    success: true,
    title: 'Hướng Dẫn Cấu Hình Webhook CI/CD Pipeline (Global Code DevOps)',
    status: 'ACTIVE_LISTENING',
    webhookEndpoint: webhookUrl,
    supportedProviders: [
      {
        provider: 'GitHub',
        headerEvent: 'X-GitHub-Event: push',
        docUrl: 'https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks',
        settingsPath: 'Settings -> Webhooks -> Add webhook'
      },
      {
        provider: 'GitLab',
        headerEvent: 'X-GitLab-Event: Push Hook',
        docUrl: 'https://docs.gitlab.com/ee/user/project/integrations/webhooks.html',
        settingsPath: 'Settings -> Webhooks -> Add new webhook'
      },
      {
        provider: 'Gitea',
        headerEvent: 'X-Gitea-Event: push',
        docUrl: 'https://docs.gitea.com/usage/webhooks',
        settingsPath: 'Repository -> Settings -> Webhooks'
      }
    ],
    setupGuide: {
      payloadUrl: webhookUrl,
      contentType: 'application/json',
      secretToken: 'Tùy chọn đặt trong x-hub-signature-256 hoặc Bearer Token',
      triggerEvents: ['Push events', 'Branch or tag creation'],
      sslVerification: 'Enable SSL verification (Recommended)'
    },
    topological10NodesPipeline: [
      '1. node-dev: Developer Workstation & Prompt Creator',
      '2. node-github-src: GitHub Source Repository (SSOT)',
      '3. node-jenkins-ci: Jenkins CI Master Orchestrator',
      '4. node-owasp: OWASP Dependency-Check (Cổng 1)',
      '5. node-sonarqube: SonarQube Clean Code Quality Gate (Cổng 2)',
      '6. node-trivy: Trivy Filesystem & Secret Scanner (Cổng 3)',
      '7. node-docker: Docker Multi-Stage Build & Registry Push',
      '8. node-argocd: ArgoCD GitOps Sync Controller',
      '9. node-prom: Prometheus Metrics Collector & SLA Monitor',
      '10. node-myapp: MyApp Production Live System'
    ],
    testCurlExample: `curl -X POST "${webhookUrl}" -H "Content-Type: application/json" -H "X-GitHub-Event: push" -d "{\\"ref\\":\\"refs/heads/main\\",\\"repository\\":{\\"full_name\\":\\"Kteenguyen/GBC_AI_agentic\\"},\\"head_commit\\":{\\"id\\":\\"7f8a91c28\\",\\"message\\":\\"feat(pipeline): automated trigger test\\",\\"author\\":{\\"name\\":\\"Ktee\\"}}}"`
  });
}

