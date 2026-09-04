import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/workflow/webhook
 * Tiếp nhận webhook sự kiện `push` từ GitHub / Gitea / GitLab
 * Tự động kích hoạt toàn bộ chu trình CI/CD Realtime
 */
export async function POST(req: NextRequest) {
  try {
    const event = req.headers.get('x-github-event') || req.headers.get('x-gitea-event') || req.headers.get('x-gitlab-event') || 'push';
    const rawBody = await req.text();

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      payload = { raw: rawBody };
    }

    const branch = payload.ref ? payload.ref.replace('refs/heads/', '') : 'main';
    const commitId = payload.head_commit?.id?.substring(0, 7) || payload.after?.substring(0, 7) || 'HEAD';
    const commitMessage = payload.head_commit?.message || payload.commits?.[0]?.message || 'Triggered via Git Webhook';
    const authorName = payload.head_commit?.author?.name || payload.pusher?.name || payload.sender?.login || 'DevOps Engineer';
    const repoName = payload.repository?.full_name || payload.repository?.name || 'Kteenguyen/GBC_AI_agentic';

    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return NextResponse.json({
      success: true,
      message: `Đã nhận sự kiện Git Webhook (${event}) thành công từ ${repoName}. Đang kích hoạt Pipeline Realtime!`,
      triggerData: {
        event,
        branch,
        commitId,
        commitMessage,
        authorName,
        repoName,
        timestamp,
        executionPlan: [
          'node-dev',
          'node-git',
          'node-jenkins',
          'node-owasp',
          'node-sonarqube',
          'node-trivy',
          'node-docker',
          'node-argocd',
          'node-prometheus',
          'node-myapp'
        ]
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: `Lỗi xử lý Webhook: ${err.message}`
    }, { status: 500 });
  }
}

/**
 * GET /api/workflow/webhook
 * Trả về thông tin hướng dẫn cấu hình Webhook cho GitHub/Gitea
 */
export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    webhookEndpoint: 'https://agent.globalcode.com.vn/api/workflow/webhook',
    supportedEvents: ['push', 'pull_request', 'workflow_dispatch'],
    guide: {
      step1: 'Truy cập GitHub Settings -> Webhooks -> Add webhook',
      step2: 'Dán Payload URL: https://agent.globalcode.com.vn/api/workflow/webhook',
      step3: 'Chọn Content Type: application/json',
      step4: 'Chọn Which events: Just the push event',
      step5: 'Bấm Add Webhook để hoàn tất.'
    }
  });
}
