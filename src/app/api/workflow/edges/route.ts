import { NextResponse } from 'next/server';
import { DEFAULT_INITIAL_EDGES, detectCycleDAG } from '@/lib/workflowGraphEngine';
import { WorkflowEdge, WorkflowPort } from '@/types/workflowGraph';

// Reference memory store
let activeEdges: WorkflowEdge[] = [...DEFAULT_INITIAL_EDGES];

export async function GET() {
  return NextResponse.json({
    success: true,
    edges: activeEdges
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sourceNodeId, sourcePort = 'RIGHT', targetNodeId, targetPort = 'LEFT', label = 'pipeline link' } = body;

    if (!sourceNodeId || !targetNodeId) {
      return NextResponse.json({
        success: false,
        error: 'Thiếu thông tin sourceNodeId hoặc targetNodeId'
      }, { status: 400 });
    }

    // 1. Chặn kết nối tự trỏ vào chính mình (Self-loop)
    if (sourceNodeId === targetNodeId) {
      return NextResponse.json({
        success: false,
        error: 'Không thể tự kết nối Node vào chính nó (Self-loop rejected)'
      }, { status: 400 });
    }

    // 2. Chặn trùng lặp đường nối giữa 2 Node cùng hướng
    const isDuplicate = activeEdges.some(
      e => e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId
    );
    if (isDuplicate) {
      return NextResponse.json({
        success: false,
        error: 'Đường nối giữa 2 Node này đã tồn tại trong đồ thị'
      }, { status: 400 });
    }

    // Tạo cạnh mới
    const newEdge: WorkflowEdge = {
      id: `edge-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sourceNodeId,
      sourcePort: sourcePort as WorkflowPort,
      targetNodeId,
      targetPort: targetPort as WorkflowPort,
      label,
      status: 'STANDBY',
      animated: false,
      createdAt: new Date().toISOString()
    };

    // 3. Kiểm tra Chu Trình DAG (Cycle Detection bằng thuật toán DFS/Kahn)
    const testEdges = [...activeEdges, newEdge];
    const allNodeIds = Array.from(new Set(testEdges.flatMap(e => [e.sourceNodeId, e.targetNodeId])));
    const cycleCheck = detectCycleDAG(allNodeIds, testEdges);

    if (cycleCheck.hasCycle) {
      return NextResponse.json({
        success: false,
        error: `Phát hiện vòng lặp vô tận (Cycle Detected) qua các node: ${cycleCheck.cyclePath?.join(' -> ')}`,
        cyclePath: cycleCheck.cyclePath
      }, { status: 400 });
    }

    // Lưu cạnh mới
    activeEdges.push(newEdge);

    return NextResponse.json({
      success: true,
      message: 'Đã tạo đường nối mũi tên thành công',
      edge: newEdge,
      edges: activeEdges
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Thiếu tham số ID đường nối cần gỡ'
      }, { status: 400 });
    }

    const beforeLength = activeEdges.length;
    activeEdges = activeEdges.filter(e => e.id !== id);

    if (activeEdges.length === beforeLength) {
      return NextResponse.json({
        success: false,
        error: 'Không tìm thấy đường nối với ID tương ứng'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Đã gỡ bỏ đường nối thành công',
      deletedId: id,
      edges: activeEdges
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
