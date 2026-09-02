import { NextResponse } from 'next/server';
import { DEFAULT_INITIAL_EDGES, detectCycleDAG } from '@/lib/workflowGraphEngine';
import { WorkflowEdge } from '@/types/workflowGraph';

// Global In-Memory Store (Synced with Supabase REST client if configured)
let currentEdges: WorkflowEdge[] = [...DEFAULT_INITIAL_EDGES];

export async function GET() {
  return NextResponse.json({
    success: true,
    edges: currentEdges,
    total: currentEdges.length,
    updatedAt: new Date().toISOString()
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.action === 'RESET') {
      currentEdges = [...DEFAULT_INITIAL_EDGES];
      return NextResponse.json({
        success: true,
        message: 'Đã khôi phục các đường nối mặc định của hệ thống',
        edges: currentEdges
      });
    }

    if (Array.isArray(body.edges)) {
      currentEdges = body.edges;
      return NextResponse.json({
        success: true,
        message: 'Đã cập nhật toàn bộ đồ thị kết nối',
        edges: currentEdges
      });
    }

    return NextResponse.json({ success: false, error: 'Tham số không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
