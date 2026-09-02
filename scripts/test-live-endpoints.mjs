/**
 * LIVE HTTP INTEGRATION TEST SUITE
 * Tests Next.js API Routes against live server on 127.0.0.1:3005
 * Tuan thu ZERO EMOJI POLICY
 */

const BASE_URL = 'http://127.0.0.1:3005';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

function assert(condition, name, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    results.push(`[PASS] ${name}${details ? ` - ${details}` : ''}`);
  } else {
    failedTests++;
    results.push(`[FAIL] ${name}${details ? ` - ${details}` : ''}`);
  }
}

async function runLiveTests() {
  console.log('--- STARTING LIVE HTTP INTEGRATION TESTS (127.0.0.1:3005) ---');

  // -------------------------------------------------------------
  // 1. ROUTE /api/9router (GET)
  // -------------------------------------------------------------
  try {
    const res = await fetch(`${BASE_URL}/api/9router`);
    const data = await res.json();
    assert(res.status === 200, '1.1 GET /api/9router status 200 OK');
    assert(data.status === 'ONLINE', '1.2 GET /api/9router returns ONLINE status');
    assert(Array.isArray(data.models_supported) && data.models_supported.includes('gemini-2.0-flash'), '1.3 GET /api/9router lists models');
    assert(data.openai_compatible_endpoint === '/api/9router/v1/chat/completions', '1.4 GET /api/9router points to OpenAI endpoint');
  } catch (err) {
    assert(false, '1.1 GET /api/9router error', err.message);
  }

  // -------------------------------------------------------------
  // 2. ROUTE /api/9router/v1/chat/completions (GET & POST)
  // -------------------------------------------------------------
  try {
    // 2.1 GET health check
    const getRes = await fetch(`${BASE_URL}/api/9router/v1/chat/completions`);
    const getData = await getRes.json();
    assert(getRes.status === 200, '2.1 GET /api/9router/v1/chat/completions status 200');
    assert(getData.status === 'ONLINE', '2.2 GET /api/9router/v1/chat/completions ONLINE');

    // 2.2 POST empty messages -> 400 Bad Request
    const emptyMsgRes = await fetch(`${BASE_URL}/api/9router/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [] })
    });
    assert(emptyMsgRes.status === 400, '2.3 POST 9Router empty messages returns 400');
    const emptyMsgData = await emptyMsgRes.json();
    assert(emptyMsgData.error?.type === 'invalid_request_error', '2.4 POST 9Router returns invalid_request_error');

    // 2.3 POST with NO API keys provided -> Graceful Fallback Mode with 200 OK
    const noKeyRes = await fetch(`${BASE_URL}/api/9router/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Xin chào 9Router' }]
      })
    });
    assert(noKeyRes.status === 200, '2.5 POST 9Router no keys returns 200 OK with Fallback Mode');
    const noKeyData = await noKeyRes.json();
    assert(noKeyData.object === 'chat.completion', '2.6 POST 9Router returns OpenAI chat.completion object');
    assert(Array.isArray(noKeyData.choices) && noKeyData.choices[0].message.role === 'assistant', '2.7 POST 9Router returns assistant message');
    assert(noKeyData.router_metadata?.total_keys_in_pool === 0, '2.8 POST 9Router metadata reports 0 keys in pool');

    // 2.4 POST with non-AIzaSy keys -> Filtered out -> Graceful fallback
    const nonAizaRes = await fetch(`${BASE_URL}/api/9router/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-key': 'sk-invalid-non-gemini-key-12345, AIzaSyShort'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test Non-AIzaSy Key' }]
      })
    });
    const nonAizaData = await nonAizaRes.json();
    assert(nonAizaRes.status === 200, '2.9 POST 9Router with invalid key prefix handled safely (200 OK)');
    assert(nonAizaData.router_metadata?.total_keys_in_pool === 0, '2.10 POST 9Router strictly rejected non-AIzaSy keys (pool=0)');

    // 2.5 POST with 50 keys in header (comma-separated HTTP standard)
    const mock50Keys = Array.from({ length: 50 }, (_, i) => `AIzaSyMockKeyForScaleTesting_${String(i).padStart(3, '0')}_Suffix`).join(',');
    const scaleRes = await fetch(`${BASE_URL}/api/9router/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gemini-key': mock50Keys
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test 50 Keys Pool' }]
      })
    });
    const scaleData = await scaleRes.json();
    assert(scaleRes.status === 200, '2.11 POST 9Router with 50 keys pool returns 200 OK');
    assert(scaleData.router_metadata?.total_keys_in_pool === 50, '2.12 POST 9Router parsed all 50 keys into pool', `Keys: ${scaleData.router_metadata?.total_keys_in_pool}`);
  } catch (err) {
    assert(false, '2.x 9Router live test failure', err.message);
  }

  // -------------------------------------------------------------
  // 3. ROUTE /api/chat (POST)
  // -------------------------------------------------------------
  try {
    // 3.1 Empty prompt -> 400 Bad Request
    const emptyPromptRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '' })
    });
    assert(emptyPromptRes.status === 400, '3.1 POST /api/chat empty prompt returns 400 Bad Request');

    // 3.2 Heuristic Fallback Check: Code / Function Request (Accented Vietnamese)
    const codeReqRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Viết hàm tính tổng tiền hợp đồng cho Alex' })
    });
    assert(codeReqRes.status === 200, '3.2 POST /api/chat code request returns 200 OK');
    const codeData = await codeReqRes.json();
    assert(codeData.success === true, '3.3 POST /api/chat returns success=true');
    assert(codeData.message?.content?.includes('calculateContractTotal'), '3.4 POST /api/chat generated clean TypeScript contract code');
    assert(codeData.message?.actionLink?.tab === 'QA_LAB', '3.5 POST /api/chat dispatched QA_LAB action link');

    // 3.3 Heuristic Fallback Check: Brainstorming Request
    const bsReqRes = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Brainstorming sơ đồ luồng hệ thống AI' })
    });
    const bsData = await bsReqRes.json();
    assert(bsReqRes.status === 200, '3.6 POST /api/chat brainstorming returns 200 OK');
    assert(bsData.message?.content?.includes('SƠ ĐỒ LUỒNG'), '3.7 POST /api/chat generated flow diagram');
    assert(bsData.message?.actionLink?.tab === 'WORKFLOW', '3.8 POST /api/chat linked to WORKFLOW tab');
  } catch (err) {
    assert(false, '3.x Chat live test failure', err.message);
  }

  // -------------------------------------------------------------
  // 4. ROUTE /api/pipeline (GET & POST)
  // -------------------------------------------------------------
  try {
    // 4.1 GET Pipeline state
    const pipeGetRes = await fetch(`${BASE_URL}/api/pipeline`);
    assert(pipeGetRes.status === 200, '4.1 GET /api/pipeline returns 200 OK');
    const pipeData = await pipeGetRes.json();
    assert(pipeData.success === true, '4.2 GET /api/pipeline success=true');
    assert(Array.isArray(pipeData.data.stages) && pipeData.data.stages.length === 8, '4.3 GET /api/pipeline has 8 stages');
    assert(Array.isArray(pipeData.data.agents) && pipeData.data.agents.length >= 13, '4.4 GET /api/pipeline has 13+ squad agents');

    // 4.2 POST Pipeline missing action -> 400
    const pipeNoActRes = await fetch(`${BASE_URL}/api/pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(pipeNoActRes.status === 400, '4.5 POST /api/pipeline missing action returns 400');

    // 4.3 POST Pipeline add_log
    const pipeLogRes = await fetch(`${BASE_URL}/api/pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_log',
        log: {
          title: 'Deep Testing Security Verification Step',
          agentCode: 'QA_AUTOMATION',
          stageId: 'stage_4',
          thinking: 'Verified zero emoji and failover resilience.'
        }
      })
    });
    assert(pipeLogRes.status === 200, '4.6 POST /api/pipeline add_log returns 200 OK');
    const pipeLogData = await pipeLogRes.json();
    assert(pipeLogData.success === true && pipeLogData.data.log.title === 'Deep Testing Security Verification Step', '4.7 POST /api/pipeline log inserted successfully');

    // 4.4 POST Pipeline advance_stage
    const pipeAdvRes = await fetch(`${BASE_URL}/api/pipeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'advance_stage' })
    });
    assert(pipeAdvRes.status === 200, '4.8 POST /api/pipeline advance_stage returns 200 OK');
  } catch (err) {
    assert(false, '4.x Pipeline live test failure', err.message);
  }

  // -------------------------------------------------------------
  // 5. ROUTE /api/github-trending (GET)
  // -------------------------------------------------------------
  try {
    const ghRes = await fetch(`${BASE_URL}/api/github-trending`);
    assert(ghRes.status === 200, '5.1 GET /api/github-trending returns 200 OK');
    const ghData = await ghRes.json();
    assert(ghData.success === true, '5.2 GET /api/github-trending success=true');
    assert(Array.isArray(ghData.data) && ghData.data.length > 0, '5.3 GET /api/github-trending returns repos');
    assert(['LIVE_GITHUB', 'BASELINE_CACHE'].includes(ghData.source), '5.4 GET /api/github-trending reports valid source');
    assert(ghData.data[0].roleFitCategory !== undefined, '5.5 GET /api/github-trending infers squad fit category');
  } catch (err) {
    assert(false, '5.x GitHub Trending live test failure', err.message);
  }

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n=============================================================');
  console.log(`LIVE INTEGRATION TESTS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log(`SUCCESS RATE: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  console.log('=============================================================');

  results.forEach(r => console.log(r));

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log('\nALL LIVE HTTP INTEGRATION TESTS PASSED 100%.');
  }
}

runLiveTests();
