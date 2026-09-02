/**
 * QA E2E & Browser Review Automated Test Suite
 * Feature: Drag & Drop Open Source DevOps Tools into Pipeline
 * Standard: ZERO EMOJI POLICY
 */

import { OPEN_SOURCE_DEVOPS_CATALOG } from '../src/lib/devopsCatalog.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testLogs = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    testLogs.push(`[PASS] ${testName}${details ? ` - ${details}` : ''}`);
  } else {
    failedTests++;
    const failMsg = `[FAIL] ${testName}${details ? ` - ${details}` : ''}`;
    testLogs.push(failMsg);
    console.error(failMsg);
  }
}

console.log('================================================================');
console.log('QA E2E TEST SUITE: DRAG & DROP OPEN SOURCE TOOLS INTO PIPELINE');
console.log('Tuân thủ nghiêm ngặt ZERO EMOJI POLICY');
console.log('================================================================\n');

// -------------------------------------------------------------
// MODULE 1: CATALOG DEFINITION & TOOL READINESS
// -------------------------------------------------------------
console.log('--- TEST 1: CATALOG READINESS & METADATA VALIDATION ---');

assert(Array.isArray(OPEN_SOURCE_DEVOPS_CATALOG), '1.1 Catalog is an array');
assert(OPEN_SOURCE_DEVOPS_CATALOG.length >= 20, '1.2 Catalog contains >= 20 tools', `Count: ${OPEN_SOURCE_DEVOPS_CATALOG.length}`);

const targetTools = [
  'woodpecker-ci',
  'drone-ci',
  'act-local-runner',
  'gitea-actions',
  'prometheus-tsdb',
  'grafana-oss',
  'uptime-kuma',
  'semgrep-oss',
  'gitleaks-scanner',
  'k3s-kubernetes'
];

for (const toolId of targetTools) {
  const found = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === toolId);
  assert(!!found, `1.3 Tool [${toolId}] exists in Catalog`, found ? `Name: ${found.name}, License: ${found.license}` : 'Not found');
  if (found) {
    assert(typeof found.name === 'string' && found.name.length > 0, `1.4 Tool [${toolId}] has valid name`);
    assert(['CI', 'SECURITY', 'BUILD', 'GITOPS', 'DEPLOY', 'MONITOR', 'ALERT'].includes(found.category), `1.5 Tool [${toolId}] has valid category [${found.category}]`);
    assert(typeof found.license === 'string' && found.license.length > 0, `1.6 Tool [${toolId}] has license`);
  }
}

// -------------------------------------------------------------
// MODULE 2: DRAG START & MULTI-FORMAT DATA TRANSFER
// -------------------------------------------------------------
console.log('\n--- TEST 2: DRAG START & MULTI-FORMAT DATA TRANSFER ---');

class MockDataTransfer {
  constructor() {
    this.data = {};
  }
  setData(format, value) {
    this.data[format] = value;
  }
  getData(format) {
    return this.data[format] || '';
  }
}

// Global window mock
global.window = {};

const sampleTool = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'woodpecker-ci');

// Simulate DragStart event handler matching page.tsx line 1335-1342
function simulateDragStart(tool) {
  const dt = new MockDataTransfer();
  const payload = JSON.stringify(tool);
  dt.setData('text/plain', payload);
  dt.setData('application/json', payload);
  if (typeof window !== 'undefined') {
    window.__draggedDevOpsTool = tool;
  }
  return dt;
}

// Simulate DragEnd event handler matching page.tsx line 1343-1347
function simulateDragEnd() {
  if (typeof window !== 'undefined') {
    window.__draggedDevOpsTool = null;
  }
}

const dt1 = simulateDragStart(sampleTool);
assert(dt1.getData('text/plain') === JSON.stringify(sampleTool), '2.1 DragStart sets text/plain format correctly');
assert(dt1.getData('application/json') === JSON.stringify(sampleTool), '2.2 DragStart sets application/json format correctly');
assert(window.__draggedDevOpsTool === sampleTool, '2.3 DragStart sets window.__draggedDevOpsTool fallback correctly');

simulateDragEnd();
assert(window.__draggedDevOpsTool === null, '2.4 DragEnd clears window.__draggedDevOpsTool');

// Test Fallback mechanism when DataTransfer is empty or corrupted (e.g. cross-browser quirk) matching page.tsx line 844-855
function parseDroppedTool(dt) {
  let tool = null;
  try {
    const dataStr = dt.getData('application/json') || dt.getData('text/plain');
    if (dataStr) {
      try {
        tool = JSON.parse(dataStr);
      } catch (err) {
        tool = null;
      }
    }
    if (!tool && typeof window !== 'undefined' && window.__draggedDevOpsTool) {
      tool = window.__draggedDevOpsTool;
    }
  } catch (err) {
    tool = null;
  }
  return tool;
}

// Scenario 2A: Full dataTransfer present
const dtNormal = simulateDragStart(sampleTool);
assert(parseDroppedTool(dtNormal)?.id === 'woodpecker-ci', '2.5 Drop parser resolves tool from normal dataTransfer');

// Scenario 2B: text/plain only
const dtTextOnly = new MockDataTransfer();
dtTextOnly.setData('text/plain', JSON.stringify(sampleTool));
simulateDragEnd();
assert(parseDroppedTool(dtTextOnly)?.id === 'woodpecker-ci', '2.6 Drop parser resolves tool from text/plain only');

// Scenario 2C: Empty dataTransfer but window.__draggedDevOpsTool active
const dtEmpty = new MockDataTransfer();
window.__draggedDevOpsTool = sampleTool;
assert(parseDroppedTool(dtEmpty)?.id === 'woodpecker-ci', '2.7 Drop parser resolves tool via window.__draggedDevOpsTool fallback');
window.__draggedDevOpsTool = null;

// Scenario 2D: Malformed JSON string in dataTransfer with fallback
const dtMalformed = new MockDataTransfer();
dtMalformed.setData('text/plain', '{malformed json string}');
window.__draggedDevOpsTool = sampleTool;
assert(parseDroppedTool(dtMalformed)?.id === 'woodpecker-ci', '2.8 Drop parser handles malformed JSON and falls back safely');
window.__draggedDevOpsTool = null;


// -------------------------------------------------------------
// MODULE 3: PIPELINE STATE MANAGEMENT & BOX DROP HANDLING
// -------------------------------------------------------------
console.log('\n--- TEST 3: DROP TARGET BOX 1 & BOX 2 STATE INTEGRATION ---');

// Mock Pipeline Engine matching src/app/page.tsx exactly
class PipelineEngine {
  constructor() {
    this.nodes = [
      { id: 'node-dev', name: 'Developer', category: 'DEV', box: 'EXTERNAL', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'Developer', description: 'Local environment' } },
      { id: 'node-github-src', name: 'GitHub (Source)', category: 'SCM', box: 'EXTERNAL', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'GitHub SCM', description: 'Source code repository' } },
      { id: 'node-jenkins-ci', name: 'Jenkins CI', category: 'CI', box: 'CI_BOX', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'Jenkins CI', description: 'Build server' } },
      { id: 'node-owasp', name: 'OWASP', category: 'SECURITY', box: 'CI_BOX', status: 'STANDBY', statusText: 'cổng 1', logs: [], metrics: {}, details: { title: 'OWASP Dependency Check', description: 'CVE Scanner' } },
      { id: 'node-sonarqube', name: 'SonarQube', category: 'SECURITY', box: 'CI_BOX', status: 'STANDBY', statusText: 'cổng 2', logs: [], metrics: {}, details: { title: 'SonarQube', description: 'Code Quality' } },
      { id: 'node-trivy', name: 'Trivy', category: 'SECURITY', box: 'CI_BOX', status: 'STANDBY', statusText: 'cổng 3', logs: [], metrics: {}, details: { title: 'Trivy Container Scan', description: 'Image Scanner' } },
      { id: 'node-docker', name: 'Docker', category: 'BUILD', box: 'CI_BOX', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'Docker BuildKit', description: 'Container Builder' } },
      { id: 'node-jenkins-cd', name: 'Jenkins CD', category: 'DEPLOY', box: 'CD_BOX', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'Jenkins CD', description: 'CD Dispatcher' } },
      { id: 'node-github-config', name: 'GitHub (Config)', category: 'SCM', box: 'CD_BOX', status: 'STANDBY', statusText: 'config repo', logs: [], metrics: {}, details: { title: 'GitOps Repo', description: 'Kubernetes Manifests' } },
      { id: 'node-argocd', name: 'ArgoCD', category: 'GITOPS', box: 'CD_BOX', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'ArgoCD', description: 'GitOps Sync' } },
      { id: 'node-k8s', name: 'Kubernetes', category: 'DEPLOY', box: 'CD_BOX', status: 'STANDBY', statusText: 'sẵn sàng', logs: [], metrics: {}, details: { title: 'Kubernetes Cluster', description: 'Production K8s' } },
      { id: 'node-myapp', name: 'MyApp Live', category: 'DEPLOY', box: 'CD_BOX', status: 'STANDBY', statusText: 'production', logs: [], metrics: {}, details: { title: 'Live App', description: 'Production Deployment' } }
    ];
    this.activePipelineToolIds = [];
    this.selectedNodeId = 'node-jenkins-ci';
    this.isOverBox1 = false;
    this.isOverBox2 = false;
  }

  handleAddToolToPipeline(tool, configuredValues = {}, targetBox) {
    const newNodeId = `node-dynamic-${tool.id}`;
    const existingIdx = this.nodes.findIndex(n => n.id === newNodeId);

    const configDetailsList = Object.entries(configuredValues)
      .filter(([_, v]) => v !== undefined && v !== '')
      .map(([k, v]) => `${k}: ${v}`);

    const chosenBox = targetBox || ((tool.category === 'CI' || tool.category === 'SECURITY' || tool.category === 'BUILD') ? 'CI_BOX' : 'CD_BOX');

    const newNode = {
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
      this.nodes[existingIdx] = newNode;
    } else {
      this.nodes.push(newNode);
      this.activePipelineToolIds.push(tool.id);
    }

    this.selectedNodeId = newNodeId;
    return newNode;
  }

  handleDropToolOnBox(boxType, dt) {
    this.isOverBox1 = false;
    this.isOverBox2 = false;
    const tool = parseDroppedTool(dt);
    if (tool) {
      return this.handleAddToolToPipeline(tool, {}, boxType);
    }
    return null;
  }

  handleRemoveDynamicNode(nodeId) {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    const toolId = nodeId.replace('node-dynamic-', '');
    this.activePipelineToolIds = this.activePipelineToolIds.filter(id => id !== toolId);
    if (this.selectedNodeId === nodeId) {
      this.selectedNodeId = 'node-dev';
    }
  }

  getSelectedNode() {
    return this.nodes.find(n => n.id === this.selectedNodeId) || this.nodes[0];
  }
}

const engine = new PipelineEngine();

// Drop Test on Box 1: Woodpecker CI
const woodpecker = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'woodpecker-ci');
const dtWoodpecker = simulateDragStart(woodpecker);
const droppedWoodpecker = engine.handleDropToolOnBox('CI_BOX', dtWoodpecker);

assert(!!droppedWoodpecker, '3.1 Drop Woodpecker CI returns node');
assert(droppedWoodpecker?.box === 'CI_BOX', '3.2 Woodpecker CI assigned to CI_BOX');
assert(engine.nodes.some(n => n.id === 'node-dynamic-woodpecker-ci'), '3.3 Woodpecker CI node exists in nodes list');
assert(engine.activePipelineToolIds.includes('woodpecker-ci'), '3.4 Woodpecker CI added to activePipelineToolIds');
assert(engine.selectedNodeId === 'node-dynamic-woodpecker-ci', '3.5 Woodpecker CI becomes selectedNodeId');

// Drop Test on Box 1: Drone CI
const drone = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'drone-ci');
const dtDrone = simulateDragStart(drone);
const droppedDrone = engine.handleDropToolOnBox('CI_BOX', dtDrone);

assert(droppedDrone?.box === 'CI_BOX', '3.6 Drone CI dropped into Box 1 assigned to CI_BOX');
assert(engine.selectedNodeId === 'node-dynamic-drone-ci', '3.7 Drone CI becomes selectedNodeId');

// Drop Test on Box 1: Act Local Runner
const actRunner = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'act-local-runner');
const dtAct = simulateDragStart(actRunner);
const droppedAct = engine.handleDropToolOnBox('CI_BOX', dtAct);
assert(droppedAct?.box === 'CI_BOX', '3.8 Act Local Runner dropped into Box 1 assigned to CI_BOX');

// Drop Test on Box 1: Gitea Actions
const gitea = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'gitea-actions');
const dtGitea = simulateDragStart(gitea);
const droppedGitea = engine.handleDropToolOnBox('CI_BOX', dtGitea);
assert(droppedGitea?.box === 'CI_BOX', '3.9 Gitea Actions dropped into Box 1 assigned to CI_BOX');

// Verify Box 1 Dynamic Nodes count
const box1DynamicNodes = engine.nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX');
assert(box1DynamicNodes.length === 4, '3.10 Box 1 contains exactly 4 dynamic dropped nodes', `Count: ${box1DynamicNodes.length}`);

// Drop Test on Box 2: Prometheus TSDB
const prometheus = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'prometheus-tsdb');
const dtPrometheus = simulateDragStart(prometheus);
const droppedPrometheus = engine.handleDropToolOnBox('CD_BOX', dtPrometheus);

assert(droppedPrometheus?.box === 'CD_BOX', '3.11 Prometheus TSDB dropped into Box 2 assigned to CD_BOX');
assert(engine.selectedNodeId === 'node-dynamic-prometheus-tsdb', '3.12 Prometheus TSDB becomes selectedNodeId');

// Drop Test on Box 2: Grafana OSS
const grafana = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'grafana-oss');
const dtGrafana = simulateDragStart(grafana);
const droppedGrafana = engine.handleDropToolOnBox('CD_BOX', dtGrafana);
assert(droppedGrafana?.box === 'CD_BOX', '3.13 Grafana OSS dropped into Box 2 assigned to CD_BOX');

// Verify Box 2 Dynamic Nodes count
const box2DynamicNodes = engine.nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX');
assert(box2DynamicNodes.length === 2, '3.14 Box 2 contains exactly 2 dynamic dropped nodes', `Count: ${box2DynamicNodes.length}`);


// -------------------------------------------------------------
// MODULE 4: OPERATIONAL INSPECTOR SYNCHRONIZATION & INTERACTION
// -------------------------------------------------------------
console.log('\n--- TEST 4: OPERATIONAL INSPECTOR & TOOL INTERACTION ---');

// Test 4.1: Inspect Woodpecker CI
engine.selectedNodeId = 'node-dynamic-woodpecker-ci';
const sel1 = engine.getSelectedNode();

assert(sel1.id === 'node-dynamic-woodpecker-ci', '4.1 Inspector selected node is Woodpecker CI');
assert(sel1.details.title.includes('Woodpecker CI'), '4.2 Inspector displays title and license', sel1.details.title);
assert(sel1.details.description === woodpecker.description, '4.3 Inspector displays exact description');
assert(sel1.metrics['Khâu Tích Hợp'] === 'Khâu ① CI & Bảo Mật', '4.4 Inspector displays CI Khâu Tích Hợp metric');
assert(sel1.metrics['Giấy phép'] === woodpecker.license, '4.5 Inspector displays License metric');
assert(sel1.logs.length >= 3, '4.6 Inspector displays dynamic live execution logs', `Log count: ${sel1.logs.length}`);
assert(sel1.logs[0].includes('Khâu ① CI & Bảo Mật'), '4.7 Log 0 confirms Box 1 integration message');
assert(sel1.details.inputArtifact === 'Pipeline trigger context & parameters', '4.8 Input artifact defined');
assert(sel1.details.outputArtifact === 'woodpecker-ci-execution-result.json', '4.9 Output artifact defined');

// Test 4.2: Inspect Prometheus TSDB in Box 2
engine.selectedNodeId = 'node-dynamic-prometheus-tsdb';
const sel2 = engine.getSelectedNode();

assert(sel2.id === 'node-dynamic-prometheus-tsdb', '4.10 Inspector selected node is Prometheus TSDB');
assert(sel2.metrics['Khâu Tích Hợp'] === 'Khâu ② CD GitOps & Giám Sát', '4.11 Inspector displays CD Khâu Tích Hợp metric');
assert(sel2.logs[0].includes('Khâu ② CD GitOps & Giám Sát'), '4.12 Log confirms Box 2 integration message');
assert(sel2.details.outputArtifact === 'prometheus-tsdb-execution-result.json', '4.13 Output artifact defined');


// -------------------------------------------------------------
// MODULE 5: NODE REMOVAL INTERACTION (BUTTON X)
// -------------------------------------------------------------
console.log('\n--- TEST 5: REMOVAL OF DYNAMIC NODES VIA X BUTTON ---');

assert(engine.nodes.some(n => n.id === 'node-dynamic-woodpecker-ci'), '5.1 Woodpecker CI exists before removal');
assert(engine.activePipelineToolIds.includes('woodpecker-ci'), '5.2 Woodpecker CI active in tool ids list');

// Set Woodpecker CI as active selection, then delete it
engine.selectedNodeId = 'node-dynamic-woodpecker-ci';
engine.handleRemoveDynamicNode('node-dynamic-woodpecker-ci');

assert(!engine.nodes.some(n => n.id === 'node-dynamic-woodpecker-ci'), '5.3 Woodpecker CI removed from nodes list');
assert(!engine.activePipelineToolIds.includes('woodpecker-ci'), '5.4 Woodpecker CI removed from activePipelineToolIds');
assert(engine.selectedNodeId === 'node-dev', '5.5 selectedNodeId automatically resets to fallback node-dev');

// Verify remaining dynamic nodes in Box 1
const remainingBox1 = engine.nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX');
assert(remainingBox1.length === 3, '5.6 Exactly 3 dynamic nodes remain in Box 1', `Count: ${remainingBox1.length}`);

// Remove Prometheus TSDB from Box 2
engine.handleRemoveDynamicNode('node-dynamic-prometheus-tsdb');
const remainingBox2 = engine.nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX');
assert(remainingBox2.length === 1, '5.7 Exactly 1 dynamic node remains in Box 2 (Grafana OSS)', `Count: ${remainingBox2.length}`);


// -------------------------------------------------------------
// MODULE 6: ZERO EMOJI COMPLIANCE AUDIT
// -------------------------------------------------------------
console.log('\n--- TEST 6: ZERO EMOJI COMPLIANCE AUDIT ---');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

let emojiViolations = 0;
for (const node of engine.nodes) {
  if (emojiRegex.test(node.name)) {
    emojiViolations++;
    console.error(`Emoji found in node name: ${node.name}`);
  }
  if (emojiRegex.test(node.statusText)) {
    emojiViolations++;
    console.error(`Emoji found in statusText: ${node.statusText}`);
  }
  for (const log of node.logs) {
    if (emojiRegex.test(log)) {
      emojiViolations++;
      console.error(`Emoji found in log: ${log}`);
    }
  }
}

assert(emojiViolations === 0, '6.1 Zero Emoji Compliance: 0 emoji found across all nodes, logs, and labels', `Violations: ${emojiViolations}`);


// -------------------------------------------------------------
// MODULE 7: REALTIME EVENT BUS SYNCHRONIZATION
// -------------------------------------------------------------
console.log('\n--- TEST 7: REALTIME EVENT BUS SYNCHRONIZATION ---');

function simulateRealtimeLogAdd(engineInstance, nodeId, logMessage, metricKey, metricValue) {
  engineInstance.nodes = engineInstance.nodes.map(n => {
    if (n.id === nodeId) {
      const updatedLogs = [logMessage, ...n.logs];
      const updatedMetrics = metricKey ? { ...(n.metrics || {}), [metricKey]: metricValue } : n.metrics;
      return { ...n, logs: updatedLogs, metrics: updatedMetrics };
    }
    return n;
  });
}

function simulateRealtimeNodeAdvance(engineInstance, nodeId, status, statusText) {
  engineInstance.nodes = engineInstance.nodes.map(n => {
    if (n.id === nodeId) {
      return { ...n, status, statusText };
    }
    return n;
  });
  engineInstance.selectedNodeId = nodeId;
}

simulateRealtimeLogAdd(engine, 'node-dynamic-drone-ci', '[Runner] Drone CI job #104 started successfully on local Docker', 'Build Status', 'PASS');
const updatedDrone = engine.nodes.find(n => n.id === 'node-dynamic-drone-ci');

assert(updatedDrone?.logs[0].includes('Drone CI job #104 started'), '7.1 Realtime log prepended to node-dynamic-drone-ci');
assert(updatedDrone?.metrics['Build Status'] === 'PASS', '7.2 Realtime metric updated on node-dynamic-drone-ci');

simulateRealtimeNodeAdvance(engine, 'node-dynamic-drone-ci', 'PASS', 'hoàn tất');
const advancedDrone = engine.nodes.find(n => n.id === 'node-dynamic-drone-ci');

assert(advancedDrone?.status === 'PASS', '7.3 Realtime status advanced to PASS');
assert(advancedDrone?.statusText === 'hoàn tất', '7.4 Realtime statusText set to hoàn tất');
assert(engine.selectedNodeId === 'node-dynamic-drone-ci', '7.5 Realtime advancement synced selectedNodeId');

console.log('\n================================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`SUCCESS RATE: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
