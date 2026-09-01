import { NextRequest, NextResponse } from 'next/server';
import { OPEN_SOURCE_DEVOPS_CATALOG } from '@/lib/devopsCatalog';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase() || '';

    let filtered = OPEN_SOURCE_DEVOPS_CATALOG;

    if (category && category !== 'ALL') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      categories: ['ALL', 'CI', 'SECURITY', 'BUILD', 'GITOPS', 'DEPLOY', 'MONITOR', 'ALERT'],
      tools: filtered
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
