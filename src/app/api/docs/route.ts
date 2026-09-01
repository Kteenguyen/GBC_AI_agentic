import { NextRequest, NextResponse } from 'next/server';
import { BUNDLED_TECHNICAL_DOCS, DOC_CATEGORIES } from '@/lib/docsData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('id');
    const category = searchParams.get('category');
    const categoryKey = searchParams.get('categoryKey');
    const search = searchParams.get('search')?.toLowerCase().trim();

    // 1. Truong hop tim theo ID cu the
    if (docId) {
      const matchedDoc = BUNDLED_TECHNICAL_DOCS.find(
        (d) => d.id === docId || d.filename === docId || d.id.includes(docId)
      );
      if (!matchedDoc) {
        return NextResponse.json(
          {
            success: false,
            error: `Khong tim thay tai lieu voi ID: ${docId}`,
            availableIds: BUNDLED_TECHNICAL_DOCS.map((m) => m.id)
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        doc: matchedDoc,
        data: matchedDoc
      });
    }

    // 2. Loc theo Category neu co
    let filteredDocs = [...BUNDLED_TECHNICAL_DOCS];
    if (categoryKey && categoryKey !== 'all') {
      filteredDocs = filteredDocs.filter(
        (d) => d.categoryKey.toLowerCase() === categoryKey.toLowerCase()
      );
    } else if (category && category.toLowerCase() !== 'all' && category.toLowerCase() !== 'tất cả') {
      filteredDocs = filteredDocs.filter(
        (d) => d.category.toLowerCase() === category.toLowerCase() ||
               d.categoryKey.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Tim kiem theo tu khoa search neu co
    if (search) {
      filteredDocs = filteredDocs.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          d.summary.toLowerCase().includes(search) ||
          d.tags?.some((t) => t.toLowerCase().includes(search)) ||
          d.content.toLowerCase().includes(search)
      );
    }

    // Sap xep theo thu tu order tang dan (1 -> 8)
    filteredDocs.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      count: filteredDocs.length,
      total: BUNDLED_TECHNICAL_DOCS.length,
      docs: filteredDocs,
      data: filteredDocs,
      categories: DOC_CATEGORIES
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Loi may chu noi bo khi xu ly API Docs'
      },
      { status: 500 }
    );
  }
}
