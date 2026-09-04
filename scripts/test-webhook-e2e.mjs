import { POST as webhookPost, GET as webhookGet } from '../src/app/api/workflow/webhook/route.ts';

async function testWebhook() {
  console.log("=== KIỂM THỬ ĐƠN VỊ ENDPOINT WEBHOOK ===");

  // 1. Test GET method
  const getRes = await webhookGet();
  const getData = await getRes.json();
  console.log("[GET /api/workflow/webhook]:", getData.status === "ACTIVE" ? "PASS" : "FAIL");

  // 2. Test POST method with simulated GitHub payload
  const mockReq = {
    headers: {
      get: (header) => {
        if (header.toLowerCase() === 'x-github-event') return 'push';
        return null;
      }
    },
    text: async () => JSON.stringify({
      ref: 'refs/heads/main',
      head_commit: {
        id: '9f8e7d6',
        message: 'feat: trigger realtime CI/CD via GitHub push',
        author: { name: 'Ktee Nguyen' }
      },
      repository: { full_name: 'Kteenguyen/GBC_AI_agentic' }
    })
  };

  const postRes = await webhookPost(mockReq);
  const postData = await postRes.json();
  console.log("[POST /api/workflow/webhook]:", postData.success === true ? "PASS" : "FAIL");
  console.log("Execution plan steps:", postData.triggerData?.executionPlan?.length);
}

testWebhook();
