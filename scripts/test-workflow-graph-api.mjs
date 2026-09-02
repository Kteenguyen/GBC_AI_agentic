import { 
  calculateBezierPath, 
  detectCycleDAG, 
  topologicalSort, 
  DEFAULT_INITIAL_EDGES 
} from '../src/lib/workflowGraphEngine.js';

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
assert(Array.isArray(check2.cyclePath), 'Trả về đường đi chi tiết của vòng lặp');

// 3. Test topologicalSort
console.log('\n--- TEST 3: Sắp Xếp Topological Sort Thứ Tự Thực Thi ---');
const topoOrder = topologicalSort(normalNodes, acyclicEdges);
assert(topoOrder[0] === 'A' && topoOrder[1] === 'B' && topoOrder[2] === 'C' && topoOrder[3] === 'D', 'Thứ tự topo chuẩn A -> B -> C -> D');

// 4. Test Default Initial Edges
console.log('\n--- TEST 4: Danh Mục 11 Dây Mặc Định Hệ Thống ---');
assert(DEFAULT_INITIAL_EDGES.length === 11, 'Có đúng 11 đường nối mặc định kết nối 12 node chính');
const defaultNodes = Array.from(new Set(DEFAULT_INITIAL_EDGES.flatMap(e => [e.sourceNodeId, e.targetNodeId])));
const defaultCheck = detectCycleDAG(defaultNodes, DEFAULT_INITIAL_EDGES);
assert(defaultCheck.hasCycle === false, 'Toàn bộ 11 đường nối mặc định là DAG hợp lệ 100%');

console.log(`\n=== TỔNG KẾT KIỂM THỬ: ${passCount} ĐẠT, ${failCount} THẤT BẠI ===`);
if (failCount > 0) process.exit(1);
