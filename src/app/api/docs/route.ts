import { NextRequest, NextResponse } from 'next/server';
import { BUNDLED_TECHNICAL_DOCS, DOC_CATEGORIES, TechnicalDoc } from '@/lib/docsData';

export const dynamic = 'force-dynamic';

// In-memory / custom added docs storage
let customDocsStore: TechnicalDoc[] = [];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('id');
    const category = searchParams.get('category');
    const categoryKey = searchParams.get('categoryKey');
    const projectId = searchParams.get('projectId') || 'workflow';
    const search = searchParams.get('search')?.toLowerCase().trim();

    const allDocs = [...customDocsStore, ...BUNDLED_TECHNICAL_DOCS];

    // 1. Truong hop tim theo ID cu the
    if (docId) {
      const matchedDoc = allDocs.find(
        (d) => d.id === docId || d.filename === docId || d.id.includes(docId)
      );
      if (!matchedDoc) {
        return NextResponse.json(
          {
            success: false,
            error: `Khong tim thay tai lieu voi ID: ${docId}`,
            availableIds: allDocs.map((m) => m.id)
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
    let filteredDocs = [...allDocs];
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
          d.tags?.some((t: string) => t.toLowerCase().includes(search)) ||
          d.content.toLowerCase().includes(search)
      );
    }

    // Sap xep theo thu tu order tang dan
    filteredDocs.sort((a, b) => a.order - b.order);

    const categoriesWithAll = DOC_CATEGORIES.map((cat) => ({
      key: cat.key,
      name: cat.name,
      label: cat.label,
      count:
        cat.key === 'all'
          ? allDocs.length
          : allDocs.filter((d) => d.categoryKey.toLowerCase() === cat.key.toLowerCase()).length
    }));

    return NextResponse.json({
      success: true,
      projectId,
      count: filteredDocs.length,
      total: allDocs.length,
      docs: filteredDocs,
      data: filteredDocs,
      categories: categoriesWithAll
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, categoryKey = 'general', summary, content, tags = [], projectId = 'workflow' } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và nội dung tài liệu không được để trống' },
        { status: 400 }
      );
    }

    const newDoc: TechnicalDoc = {
      id: `doc_${Date.now()}`,
      order: customDocsStore.length + 10,
      title: title.trim(),
      category: category || 'Tài Liệu Tùy Chỉnh',
      categoryKey: categoryKey || 'general',
      filename: `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`,
      summary: summary || title,
      tags: Array.isArray(tags) ? tags : [tags],
      content: content.trim()
    };

    customDocsStore.unshift(newDoc);

    return NextResponse.json({
      success: true,
      message: 'Đã lưu tài liệu kỹ thuật thành công',
      doc: newDoc
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Lỗi lưu tài liệu' },
      { status: 500 }
    );
  }
}
