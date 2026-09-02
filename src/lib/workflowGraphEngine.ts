import { WorkflowPort, WorkflowEdge, Point } from '@/types/workflowGraph';

export const DEFAULT_INITIAL_EDGES: WorkflowEdge[] = [
  {
    id: 'edge-dev-github',
    sourceNodeId: 'node-dev',
    sourcePort: 'RIGHT',
    targetNodeId: 'node-github-src',
    targetPort: 'LEFT',
    label: 'git push',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-github-jenkins',
    sourceNodeId: 'node-github-src',
    sourcePort: 'RIGHT',
    targetNodeId: 'node-jenkins-ci',
    targetPort: 'LEFT',
    label: 'webhook pull',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-jenkins-owasp',
    sourceNodeId: 'node-jenkins-ci',
    sourcePort: 'RIGHT',
    targetNodeId: 'node-owasp',
    targetPort: 'LEFT',
    label: 'deps scan',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-owasp-sonar',
    sourceNodeId: 'node-owasp',
    sourcePort: 'RIGHT',
    targetNodeId: 'node-sonarqube',
    targetPort: 'LEFT',
    label: 'code quality',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-sonar-trivy',
    sourceNodeId: 'node-sonarqube',
    sourcePort: 'BOTTOM',
    targetNodeId: 'node-trivy',
    targetPort: 'TOP',
    label: 'cve scan',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-trivy-docker',
    sourceNodeId: 'node-trivy',
    sourcePort: 'LEFT',
    targetNodeId: 'node-docker',
    targetPort: 'RIGHT',
    label: 'build image',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-docker-argocd',
    sourceNodeId: 'node-docker',
    sourcePort: 'BOTTOM',
    targetNodeId: 'node-argocd',
    targetPort: 'TOP',
    label: 'sync manifest',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-argocd-k8s',
    sourceNodeId: 'node-argocd',
    sourcePort: 'RIGHT',
    targetNodeId: 'node-k8s',
    targetPort: 'LEFT',
    label: 'deploy pod',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-k8s-prom',
    sourceNodeId: 'node-k8s',
    sourcePort: 'BOTTOM',
    targetNodeId: 'node-prom',
    targetPort: 'TOP',
    label: 'scrape metrics',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-prom-grafana',
    sourceNodeId: 'node-prom',
    sourcePort: 'RIGHT',
    targetNodeId: 'node-grafana',
    targetPort: 'LEFT',
    label: 'visualize',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'edge-prom-gmail',
    sourceNodeId: 'node-prom',
    sourcePort: 'BOTTOM',
    targetNodeId: 'node-gmail',
    targetPort: 'TOP',
    label: 'alert firing',
    status: 'SUCCESS',
    animated: false,
    createdAt: new Date().toISOString()
  }
];

/**
 * Tính toán đường cong Cubic Bezier SVG mượt mà giữa 2 điểm neo
 */
export function calculateBezierPath(
  p1: Point,
  p2: Point,
  port1: WorkflowPort = 'RIGHT',
  port2: WorkflowPort = 'LEFT'
): { path: string; center: Point; midControl1: Point; midControl2: Point } {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const offset = Math.max(dx * 0.45, dy * 0.45, 36);

  const cp1: Point = { x: p1.x, y: p1.y };
  const cp2: Point = { x: p2.x, y: p2.y };

  if (port1 === 'RIGHT') cp1.x += offset;
  else if (port1 === 'LEFT') cp1.x -= offset;
  else if (port1 === 'BOTTOM') cp1.y += offset;
  else if (port1 === 'TOP') cp1.y -= offset;

  if (port2 === 'RIGHT') cp2.x += offset;
  else if (port2 === 'LEFT') cp2.x -= offset;
  else if (port2 === 'BOTTOM') cp2.y += offset;
  else if (port2 === 'TOP') cp2.y -= offset;

  // Điểm giữa của đường cong Bezier (t = 0.5)
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

  return {
    path,
    center: { x: cx, y: cy },
    midControl1: cp1,
    midControl2: cp2
  };
}

/**
 * Thuật toán Kahn / DFS: Phát hiện vòng lặp (Cycle Detection) trong đồ thị có hướng (DAG)
 */
export function detectCycleDAG(nodeIds: string[], edges: WorkflowEdge[]): { hasCycle: boolean; cyclePath?: string[] } {
  const adj = new Map<string, string[]>();
  nodeIds.forEach(id => adj.set(id, []));

  edges.forEach(edge => {
    if (!adj.has(edge.sourceNodeId)) adj.set(edge.sourceNodeId, []);
    adj.get(edge.sourceNodeId)!.push(edge.targetNodeId);
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();
  const currentPath: string[] = [];

  function dfs(nodeId: string): boolean {
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

/**
 * Sắp xếp Topological Sort (Kahn's Algorithm)
 */
export function topologicalSort(nodeIds: string[], edges: WorkflowEdge[]): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  nodeIds.forEach(id => {
    inDegree.set(id, 0);
    adj.set(id, []);
  });

  edges.forEach(edge => {
    if (!adj.has(edge.sourceNodeId)) adj.set(edge.sourceNodeId, []);
    adj.get(edge.sourceNodeId)!.push(edge.targetNodeId);

    inDegree.set(edge.targetNodeId, (inDegree.get(edge.targetNodeId) || 0) + 1);
  });

  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
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
