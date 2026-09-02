function calculateBezierPath(p1, p2, port1 = 'RIGHT', port2 = 'LEFT') {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dx * 0.45, dy * 0.45, 36);

  const cp1 = { x: p1.x, y: p1.y };
  const cp2 = { x: p2.x, y: p2.y };

  if (port1 === 'RIGHT') cp1.x += offset;
  else if (port1 === 'LEFT') cp1.x -= offset;
  else if (port1 === 'BOTTOM') cp1.y += offset;
  else if (port1 === 'TOP') cp1.y -= offset;

  if (port2 === 'RIGHT') cp2.x += offset;
  else if (port2 === 'LEFT') cp2.x -= offset;
  else if (port2 === 'BOTTOM') cp2.y += offset;
  else if (port2 === 'TOP') cp2.y -= offset;

  const t = 0.5;
  const cx =
    Math.pow(1 - t, 3) * p1.x +
    3 * Math.pow(1 - t, 2) * t * cp1.x +
    3 * (1 - t) * Math.pow(t, 2) * cp2.x +
    Math.pow(t, 3) * p2.x;
  const cy =
    Math.pow(1 - t, 3) * p1.y +
    3 * Math.pow(1 - t, 2) * t * cp1.y +
    3 * (1 - t) * Math.pow(t, 2) * cp2.y +
    Math.pow(t, 3) * p2.y;

  const path = `M ${p1.x} ${p1.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;

  return { path, center: { x: cx, y: cy }, midControl1: cp1, midControl2: cp2 };
}

function detectCycleDAG(nodeIds, edges) {
  const adj = new Map();
  nodeIds.forEach(id => adj.set(id, []));

  edges.forEach(edge => {
    if (!adj.has(edge.sourceNodeId)) adj.set(edge.sourceNodeId, []);
    adj.get(edge.sourceNodeId).push(edge.targetNodeId);
  });

  const visited = new Set();
  const recStack = new Set();
  const currentPath = [];

  function dfs(nodeId) {
    visited.add(nodeId);
    recStack.add(nodeId);
    currentPath.push(nodeId);

    const neighbors = adj.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        currentPath.push(neighbor);
        return true;
      }
    }

    recStack.delete(nodeId);
    currentPath.pop();
    return false;
  }

  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) {
        return { hasCycle: true, cyclePath: [...currentPath] };
      }
    }
  }

  return { hasCycle: false };
}

function topologicalSort(nodeIds, edges) {
  const inDegree = new Map();
  const adj = new Map();

  nodeIds.forEach(id => {
    inDegree.set(id, 0);
    adj.set(id, []);
  });

  edges.forEach(edge => {
    if (!adj.has(edge.sourceNodeId)) adj.set(edge.sourceNodeId, []);
    adj.get(edge.sourceNodeId).push(edge.targetNodeId);
    inDegree.set(edge.targetNodeId, (inDegree.get(edge.targetNodeId) || 0) + 1);
  });

  const queue = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      const newDeg = (inDegree.get(v) || 1) - 1;
      inDegree.set(v, newDeg);
      if (newDeg === 0) queue.push(v);
    }
  }

  if (order.length < nodeIds.length) {
    const remaining = nodeIds.filter(id => !order.includes(id));
    return [...order, ...remaining];
  }

  return order;
}

console.log('=== BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG WORKFLOW GRAPH & BEZIER ARROWS ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Test calculateBezierPath math
console.log('--- TEST 1: Tính toán Tọa độ Đường Cong Bezier ---');
const p1 = { x: 100, y: 100 };
const p2 = { x: 300, y: 100 };
const bezierResult = calculateBezierPath(p1, p2, 'RIGHT', 'LEFT');
assert(bezierResult.path.startsWith('M 100 100 C'), 'Cú pháp SVG Path bắt đầu với lệnh MoveTo');
assert(bezierResult.path.includes('300 100'), 'Đích đến kết thúc chính xác tại tọa độ (300, 100)');
assert(bezierResult.center.x === 200 && bezierResult.center.y === 100, 'Điểm giữa của đường thẳng ngang nằm ở x=200, y=100');

// 2. Test detectCycleDAG
console.log('\n--- TEST 2: Thuật Toán Kahn / DFS Phát Hiện Chu Trình (Cycle Detection) ---');
const normalNodes = ['A', 'B', 'C', 'D'];
const acyclicEdges = [
  { id: '1', sourceNodeId: 'A', sourcePort: 'RIGHT', targetNodeId: 'B', targetPort: 'LEFT', status: 'STANDBY', createdAt: '' },
  { id: '2', sourceNodeId: 'B', sourcePort: 'RIGHT', targetNodeId: 'C', targetPort: 'LEFT', status: 'STANDBY', createdAt: '' },
  { id: '3', sourceNodeId: 'C', sourcePort: 'RIGHT', targetNodeId: 'D', targetPort: 'LEFT', status: 'STANDBY', createdAt: '' }
];
const check1 = detectCycleDAG(normalNodes, acyclicEdges);
assert(check1.hasCycle === false, 'Đồ thị tuyến tính A -> B -> C -> D không có vòng lặp');

const cyclicEdges = [
  ...acyclicEdges,
  { id: '4', sourceNodeId: 'D', sourcePort: 'RIGHT', targetNodeId: 'A', targetPort: 'LEFT', status: 'STANDBY', createdAt: '' }
];
const check2 = detectCycleDAG(normalNodes, cyclicEdges);
assert(check2.hasCycle === true, 'Phát hiện chính xác vòng lặp D -> A');
assert(Array.isArray(check2.cyclePath), 'Trả về đường đi chi tiết của vòng lặp: ' + check2.cyclePath.join(' -> '));

// 3. Test topologicalSort
console.log('\n--- TEST 3: Sắp Xếp Topological Sort Thứ Tự Thực Thi ---');
const topoOrder = topologicalSort(normalNodes, acyclicEdges);
assert(topoOrder[0] === 'A' && topoOrder[1] === 'B' && topoOrder[2] === 'C' && topoOrder[3] === 'D', 'Thứ tự topo chuẩn A -> B -> C -> D');

// 4. Test 11 Default Pipeline Edges
console.log('\n--- TEST 4: Danh Mục 11 Dây Mặc Định Hệ Thống ---');
const defaultPipelineEdges = [
  { sourceNodeId: 'node-dev', targetNodeId: 'node-github-src' },
  { sourceNodeId: 'node-github-src', targetNodeId: 'node-jenkins-ci' },
  { sourceNodeId: 'node-jenkins-ci', targetNodeId: 'node-owasp' },
  { sourceNodeId: 'node-owasp', targetNodeId: 'node-sonarqube' },
  { sourceNodeId: 'node-sonarqube', targetNodeId: 'node-trivy' },
  { sourceNodeId: 'node-trivy', targetNodeId: 'node-docker' },
  { sourceNodeId: 'node-docker', targetNodeId: 'node-argocd' },
  { sourceNodeId: 'node-argocd', targetNodeId: 'node-k8s' },
  { sourceNodeId: 'node-k8s', targetNodeId: 'node-prom' },
  { sourceNodeId: 'node-prom', targetNodeId: 'node-grafana' },
  { sourceNodeId: 'node-prom', targetNodeId: 'node-gmail' }
];
assert(defaultPipelineEdges.length === 11, 'Có đúng 11 đường nối mặc định kết nối 12 node chính');
const defaultNodes = Array.from(new Set(defaultPipelineEdges.flatMap(e => [e.sourceNodeId, e.targetNodeId])));
const defaultCheck = detectCycleDAG(defaultNodes, defaultPipelineEdges);
assert(defaultCheck.hasCycle === false, 'Toàn bộ 11 đường nối mặc định là DAG hợp lệ 100%');

console.log(`\n=== TỔNG KẾT KIỂM THỬ: ${passCount} ĐẠT, ${failCount} THẤT BẠI ===`);
if (failCount > 0) process.exit(1);
