import { NextRequest, NextResponse } from 'next/server';
import { fetchPipelineExecutionHistory, recordPipelineExecutionToDb } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const history = await fetchPipelineExecutionHistory(limit);

    return NextResponse.json({
      success: true,
      count: history.length,
      history
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Lỗi khi tải lịch sử pipeline'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await recordPipelineExecutionToDb(body);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Lỗi khi lưu lịch sử pipeline'
    }, { status: 500 });
  }
}
