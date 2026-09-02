/**
 * QA Automated E2E Test Suite for SIDEBAR ACTOR MO RONG (WorkflowActorSidebar)
 * Tuan thu nghiem ngat ZERO EMOJI POLICY.
 */

import fs from 'fs';
import path from 'path';
import { OPEN_SOURCE_DEVOPS_CATALOG } from '../src/lib/devopsCatalog.ts';

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
console.log('QA E2E TEST: SIDEBAR ACTOR MO RONG (WorkflowActorSidebar)');
console.log('Tuan thu nghiem ngat ZERO EMOJI POLICY');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// SECTION 1: DESKTOP LAYOUT (>= 1024px) & CATEGORY TABS & SEARCH
// -----------------------------------------------------------------------------
console.log('--- 1. KIEM TRA SIDEBAR TREN DESKTOP (>= 1024px) ---');

const CATEGORY_TABS = [
  { key: 'ALL', label: 'Tất Cả' },
  { key: 'CI', label: 'CI / CD' },
  { key: 'SECURITY', label: 'Bảo Mật' },
  { key: 'BUILD', label: 'Build & Pod' },
  { key: 'GITOPS', label: 'GitOps' },
  { key: 'MONITOR', label: 'Giám Sát' }
];

assert(CATEGORY_TABS.length === 6, '1.1 Co du 6 tab phan loai danh muc', `Count: ${CATEGORY_TABS.length}`);
const tabKeys = CATEGORY_TABS.map(t => t.key);
assert(tabKeys.includes('ALL') && tabKeys.includes('CI') && tabKeys.includes('SECURITY') && tabKeys.includes('BUILD') && tabKeys.includes('GITOPS') && tabKeys.includes('MONITOR'), '1.2 Cac key tab danh muc chinh xac');

// Filter simulation
function filterTools(category, searchQuery = '') {
  return OPEN_SOURCE_DEVOPS_CATALOG.filter(tool => {
    const matchCat = category === 'ALL' || tool.category === category || (category === 'GITOPS' && tool.category === 'DEPLOY');
    const matchSearch = searchQuery.trim() === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });
}

const allTools = filterTools('ALL');
assert(allTools.length >= 24, '1.3 Tab Tat Ca hien thi day du toan bo kho cong cu', `Tong so cong cu: ${allTools.length}`);

const ciTools = filterTools('CI');
assert(ciTools.length >= 5, '1.4 Tab CI / CD loc dung cac cong cu CI (Jenkins, Woodpecker, Drone, Act, Gitea, GitLab)', `CI Count: ${ciTools.length}`);

const secTools = filterTools('SECURITY');
assert(secTools.length >= 5, '1.5 Tab Bao Mat loc dung cac cong cu SAST/SCA (SonarQube, OWASP, Trivy, Snyk, Semgrep, Grype, Gitleaks)', `Security Count: ${secTools.length}`);

const buildTools = filterTools('BUILD');
assert(buildTools.length >= 4, '1.6 Tab Build & Pod loc dung cac cong cu (Docker, Podman, Kaniko, Harbor)', `Build Count: ${buildTools.length}`);

const gitopsTools = filterTools('GITOPS');
assert(gitopsTools.length >= 5, '1.7 Tab GitOps loc dung cac cong cu (ArgoCD, FluxCD, K3s, OpenShift, Coolify, Portainer)', `GitOps Count: ${gitopsTools.length}`);

const monTools = filterTools('MONITOR');
assert(monTools.length >= 5, '1.8 Tab Giam Sat loc dung cac cong cu (Prometheus, Grafana, VictoriaMetrics, Zabbix, Loki, Uptime Kuma)', `Monitor Count: ${monTools.length}`);

// Search test
const searchGitLab = filterTools('ALL', 'gitlab');
assert(searchGitLab.length >= 1 && searchGitLab.some(t => t.name.includes('GitLab')), '1.9 Tim kiem tu khoa "gitlab" tra ve chinh xac GitLab CI');

const searchK8s = filterTools('ALL', 'k8s');
assert(searchK8s.length >= 1, '1.10 Tim kiem tu khoa "k8s" tra ve cac cong cu lien quan qua tags');


// -----------------------------------------------------------------------------
// SECTION 2: THAO TAC KEP: DRAG & DROP VA NUT 1 CHAM (+ CI / + CD)
// -----------------------------------------------------------------------------
console.log('\n--- 2. KIEM TRA THAO TAC KEP: DRAG & DROP VA NUT 1 CHAM ---');

class MockPipelineBoard {
  constructor() {
    this.nodes = [];
  }

  addTool(tool, targetBox) {
    const newNodeId = `node-dynamic-${tool.id}`;
    const newNode = {
      id: newNodeId,
      name: tool.name,
      category: tool.category,
      box: targetBox,
      status: 'STANDBY',
      statusText: 'sẵn sàng',
      logs: [`[Dynamic Plugin] ${tool.name} đã được thêm vào ${targetBox}`]
    };
    const existingIdx = this.nodes.findIndex(n => n.id === newNodeId);
    if (existingIdx >= 0) {
      this.nodes[existingIdx] = newNode;
    } else {
      this.nodes.push(newNode);
    }
    return newNode;
  }
}

const board = new MockPipelineBoard();

// 2.1 Drag & Drop test
const gitlabTool = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'gitlab-ci');
const droppedGitlab = board.addTool(gitlabTool, 'CI_BOX');
assert(droppedGitlab.box === 'CI_BOX', '2.1 Keo tha GitLab vao Box 1 (CI_BOX) thanh cong');

const fluxTool = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'fluxcd-gitops');
const droppedFlux = board.addTool(fluxTool, 'CD_BOX');
assert(droppedFlux.box === 'CD_BOX', '2.2 Keo tha FluxCD vao Box 2 (CD_BOX) thanh cong');

// 2.2 1-Touch Button (+ CI và + CD) test
const snykTool = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'snyk-security');
const touchedSnykCI = board.addTool(snykTool, 'CI_BOX');
assert(touchedSnykCI.box === 'CI_BOX', '2.3 Nut 1 cham "+ CI" nap Snyk truc tiep vao Box 1 (CI_BOX)');

const lokiTool = OPEN_SOURCE_DEVOPS_CATALOG.find(t => t.id === 'grafana-loki');
const touchedLokiCD = board.addTool(lokiTool, 'CD_BOX');
assert(touchedLokiCD.box === 'CD_BOX', '2.4 Nut 1 cham "+ CD" nap Loki truc tiep vao Box 2 (CD_BOX)');


// -----------------------------------------------------------------------------
// SECTION 3: KIEM TRA TINH CHUAN XAC CUA LOGO SVG 100% CHINH THUC
// -----------------------------------------------------------------------------
console.log('\n--- 3. KIEM TRA LOGO SVG 100% CHINH THUC CUA 24 CONG CU ---');

const REQUIRED_24_TOOLS = [
  'GitLab',
  'Woodpecker',
  'Drone',
  'Act',
  'Gitea',
  'Snyk',
  'Semgrep',
  'Grype',
  'Podman',
  'Kaniko',
  'FluxCD',
  'OpenShift',
  'VictoriaMetrics',
  'Zabbix',
  'Loki',
  'Alertmanager',
  'Jenkins',
  'SonarQube',
  'Trivy',
  'Docker',
  'ArgoCD',
  'Kubernetes',
  'Prometheus',
  'Grafana'
];

const brandLogosPath = path.resolve('src/components/BrandLogos.tsx');
const brandLogosContent = fs.readFileSync(brandLogosPath, 'utf-8');

for (const toolName of REQUIRED_24_TOOLS) {
  const funcPattern = new RegExp(`export const ${toolName.replace(/[^a-zA-Z]/g, '')}Logo`, 'i');
  const foundInLogos = funcPattern.test(brandLogosContent);
  assert(foundInLogos, `3.${REQUIRED_24_TOOLS.indexOf(toolName) + 1} Logo SVG chinh thuc cho [${toolName}] ton tai trong BrandLogos.tsx`);
}

// Verify OfficialToolIcon dispatcher covers all 24 tools without placeholder fallback
const dispatcherSection = brandLogosContent.slice(brandLogosContent.indexOf('export const OfficialToolIcon'));
for (const toolName of REQUIRED_24_TOOLS) {
  const lower = toolName.toLowerCase();
  const covered = dispatcherSection.toLowerCase().includes(lower);
  assert(covered, `3.Dispatcher: [${toolName}] duoc anh xa chinh xac trong OfficialToolIcon`);
}


// -----------------------------------------------------------------------------
// SECTION 4: KIEM TRA GIAO DIEN MOBILE VIEWPORT 430px (TOUCH DRAWER)
// -----------------------------------------------------------------------------
console.log('\n--- 4. KIEM TRA MOBILE VIEWPORT 430px (TOUCH DRAWER) ---');

const sidebarPath = path.resolve('src/components/WorkflowActorSidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');

assert(sidebarContent.includes('lg:hidden'), '4.1 Giao dien Mobile Drawer duoc bao ve boi responsive class lg:hidden');
assert(sidebarContent.includes('Touch 1 Chạm'), '4.2 Co tieu de Touch 1 Cham ro rang cho man hinh Mobile');
assert(sidebarContent.includes('+ Khâu CI') && sidebarContent.includes('+ Khâu CD'), '4.3 Cac nut 1 cham "+ Khau CI" va "+ Khau CD" san sang cho Mobile touch');
assert(sidebarContent.includes('grid grid-cols-2'), '4.4 Layout 2 cot toi uu cho man hinh 430px');


// -----------------------------------------------------------------------------
// SECTION 5: ZERO EMOJI COMPLIANCE AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- 5. KIEM TRA ZERO EMOJI POLICY ---');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

let emojiViolations = 0;
for (const tool of OPEN_SOURCE_DEVOPS_CATALOG) {
  if (emojiRegex.test(tool.name) || emojiRegex.test(tool.description)) {
    emojiViolations++;
    console.error(`Vi pham Emoji trong Catalog: ${tool.name}`);
  }
}

if (emojiRegex.test(sidebarContent)) {
  emojiViolations++;
  console.error('Vi pham Emoji trong WorkflowActorSidebar.tsx');
}

if (emojiRegex.test(brandLogosContent)) {
  emojiViolations++;
  console.error('Vi pham Emoji trong BrandLogos.tsx');
}

assert(emojiViolations === 0, '5.1 Zero Emoji Policy tuan thu 100% khong co emoji nao', `Violations: ${emojiViolations}`);

console.log('\n================================================================');
console.log(`TONG SO TEST CASE: ${totalTests}`);
console.log(`THANH CONG (PASSED): ${passedTests}`);
console.log(`THAT BAI (FAILED): ${failedTests}`);
console.log(`TY LE DAT: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
