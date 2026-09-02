import { NextRequest, NextResponse } from 'next/server';
import { BUNDLED_TECHNICAL_DOCS, DOC_CATEGORIES, TechnicalDoc } from '@/lib/docsData';

export const dynamic = 'force-dynamic';

// In-memory / custom added docs storage
let customDocsStore: TechnicalDoc[] = [
  {
    id: 'doc_agents_squad_spec',
    order: 0,
    title: 'Quy Chuẩn 13 AI Subagents & Supreme Brainstorming Leader',
    category: 'Kiến Trúc & Đội Ngũ',
    categoryKey: 'architecture',
    filename: '00-agents-squad-spec.md',
    summary: 'Đặc tả vai trò của 13 AI Subagents, quy trình xuất sơ đồ luồng ý tưởng và 4 trục bất biến.',
    tags: ['Agent Squad', 'Brainstorming', 'Leader', 'RBAC', 'Mobile 430px', 'Supabase'],
    content: `# AGENT SQUAD DIRECTIVE & SUPREME BRAINSTORMING LEADER (ROOT SPECIFICATION)

Dự án: **Workflow (GBC_AI_agentic)**  
Repository: \`https://github.com/Kteenguyen/GBC_AI_agentic.git\` (Branch: \`main\`)  
Production Domain: \`https://agent.globalcode.com.vn\`

---

## 1. QUY TRÌNH MẶC ĐỊNH BẮT BUỘC: SUPREME BRAINSTORMING LEADER (99.99% ACCURACY)

Supreme Brainstorming Leader là Tổng Chỉ Huy Tối Cao của toàn bộ Agent Squad. Sau MỖI Prompt của người dùng, Leader BẮT BUỘC thực hiện quy trình sau trước khi giao việc cho các Subagents:

1. **Trường Hợp 1: Ý Tưởng Đã Rõ Ràng (Clear Concept)**:
   - Bắt buộc vẽ và xuất **SƠ ĐỒ LUỒNG (Flow Diagram / Mermaid / ASCII)** chi tiết từng bước.
   - Trực quan hóa toàn bộ luồng hoạt động để người dùng xác nhận và duyệt trước khi thực thi code.

2. **Trường Hợp 2: Ý Tưởng Chưa Rõ Hoặc Cần Làm Sáng Tỏ (Underspecified / Ambiguous)**:
   - Bắt buộc **hỏi lại người dùng** các điểm nút quan trọng.
   - Luôn kèm theo phương án đề xuất tối ưu **[Recommended]** và các phương án phụ để người dùng dễ dàng bấm chọn xác nhận.

3. **Kiểm Tra Chặt Chẽ 4 Trục Bất Biến**:
   - Trục 1: Phân Quyền RBAC Guard: Màn hình Quản lý Tiến độ Project và Cashflow CHỈ DÀNH CHO ADMIN_CEO và HEAD.
   - Trục 2: Chuẩn Giao Diện Mobile-First 430px: Viewport iPhone 14 Pro Max 430px, Touch Target >= 44px, nút font 11.5px - 12.5px.
   - Trục 3: Supabase Cloud REST 100% & Realtime Bus 0ms: Ngưng toàn bộ MongoDB. Mọi thay đổi dữ liệu đồng bộ qua CustomEvent('gcm_*_updated') và storage listener.
   - Trục 4: Vercel Production Parity 100%: Mọi tính năng chạy mượt trên https://agent.globalcode.com.vn, npx tsc --noEmit đạt 0 lỗi 100%.`
  }
];

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

    const categoriesWithAll = [
      { key: 'all', label: 'Tất Cả Tài Liệu', count: allDocs.length },
      { key: 'architecture', label: 'Kiến Trúc & Đội Ngũ', count: allDocs.filter(d => d.categoryKey === 'architecture').length },
      ...DOC_CATEGORIES.filter(c => c.key !== 'all')
    ];

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
