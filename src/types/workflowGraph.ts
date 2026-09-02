export type WorkflowPort = 'TOP' | 'RIGHT' | 'BOTTOM' | 'LEFT';

export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  sourcePort: WorkflowPort;
  targetNodeId: string;
  targetPort: WorkflowPort;
  label?: string;
  status: 'STANDBY' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  animated?: boolean;
  color?: string;
  createdAt: string;
}

export interface WorkflowGraph {
  nodes: any[];
  edges: WorkflowEdge[];
  updatedAt: string;
}

export interface Point {
  x: number;
  y: number;
}
