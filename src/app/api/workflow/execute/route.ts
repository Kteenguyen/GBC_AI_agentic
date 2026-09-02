import { NextResponse } from 'next/server';
import { DEFAULT_INITIAL_EDGES, topologicalSort, detectCycleDAG } from '@/lib/workflowGraphEngine';
import { WorkflowEdge } from '@/types/workflowGraph';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nodeIds: string[] = body.nodeIds || [];
    const edges: WorkflowEdge[] = body.edges || DEFAULT_INITIAL_EDGES;

    if (nodeIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Danh sách nodeIds rỗng'
      }, { status: 400 });
    }

    // 1. Kiểm tra chu trình trước khi thực thi
    const cycleCheck = detectCycleDAG(nodeIds, edges);
    if (cycleCheck.hasCycle) {
      return NextResponse.json({
        success: false,
        error: `Không thể thực thi pipeline: Phát hiện vòng lặp vô tận qua ${cycleCheck.cyclePath?.join(' -> ')}`,
        cyclePath: cycleCheck.cyclePath
      }, { status: 400 });
    }

    // 2. Sắp xếp Topological Sort theo Kahn's Algorithm
    const executionOrder = topologicalSort(nodeIds, edges);

    return NextResponse.json({
      success: true,
      message: 'Đã lập lịch thứ tự thực thi topo thành công',
      executionOrder,
      totalSteps: executionOrder.length,
      startedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
