# AGENT SQUAD DIRECTIVE & GRILL-ME PROTOCOL (ROOT SPECIFICATION)

Dự án: Workflow (GBC_AI_agentic)
Repository: https://github.com/Kteenguyen/GBC_AI_agentic.git (Branch: main)
Production Domain: https://agent.globalcode.com.vn

---

## 1. QUY TRÌNH MẶC ĐỊNH BẮT BUỘC: /grill-me PHẢN BIỆN ĐA CHIỀU (99.99% ACCURACY)

Khi nhận được bất kỳ Prompt yêu cầu tính năng hoặc thay đổi hệ thống mới nào từ người dùng, toàn bộ Agent Squad BAT BUOC tự động kích hoạt quy trình /grill-me trước khi viết code:

1. Phỏng vấn và Rà soát Cây Quyết Định Thiết Kế (Design Decision Tree):
   - Đi sâu vào từng nhánh quyết định, giải quyết sự phụ thuộc giữa các thành phần.
   - Đặt câu hỏi phỏng vấn tương tác (1 câu hỏi tại một thời điểm hoặc nhóm quyết định có cấu trúc).
   - Luôn kèm phương án đề xuất tối ưu [Recommended].

2. Kiểm Tra Chặt Chẽ 4 Trục Bất Biến:
   - Trục 1: Phân Quyền RBAC Guard: Màn hình Quản lý Tiến độ Project và Cashflow CHỈ DÀNH CHO ADMIN_CEO và HEAD.
   - Trục 2: Chuẩn Giao Diện Mobile-First 430px: Viewport iPhone 14 Pro Max 430px, Touch Target >= 44px, nút font 11.5px - 12.5px.
   - Trục 3: Supabase Cloud REST 100% & Realtime Bus 0ms: Ngưng toàn bộ MongoDB. Mọi thay đổi dữ liệu đồng bộ qua CustomEvent('gcm_*_updated') và storage listener.
   - Trục 4: Vercel Production Parity 100%: Mọi tính năng chạy mượt trên https://agent.globalcode.com.vn, npx tsc --noEmit đạt 0 lỗi 100%.

---

## 2. DANH BỘ 13 AI SUBAGENTS TỰ HÀNH (SQUAD ROSTER)

| STT | Tên Agent | Mã Định Danh | Nhóm Chuyên Môn | Vai Trò & Nghiệp Vụ Cốt Lõi |
|---|---|---|---|---|
| 01 | Supreme NLP Leader | LEADER_NLP | Leader | Tổng chỉ huy tối cao, điều phối 13 Agents, thực thi /grill-me và Stage 1 Brainstorming |
| 02 | Mobile UX Architect | UX_MOBILE_430 | Frontend | Chuyên gia giao diện Mobile-First, chuẩn iPhone 14 Pro Max 430px pixel-perfect |
| 03 | QA Testing Subagent | QA_AUTOMATION | QA | Kiểm thử tự động đa tầng: Visual 430px, Playwright E2E, Unit Tests |
| 04 | Backend & Supabase Guard | BACKEND_REALTIME | Backend | Bảo vệ kiến trúc Supabase Cloud REST 100%, Realtime Event Bus 0ms |
| 05 | DevOps Parity Officer | DEVOPS_PARITY | DevOps | Đảm bảo Vercel Production Parity 100%, TypeScript 0 lỗi, CI/CD Gate |
| 06 | Rex (System Architect) | ARCH_REX | Architect | Kiến trúc sư hệ thống phân tán, thiết kế schema tối ưu |
| 07 | Alex (React & Tailwind Pro) | FE_ALEX | Frontend | Kỹ sư frontend React/Next.js 14 App Router, Tailwind CSS, Dark/Light Mode |
| 08 | Aria (Workflow Analyst) | ANALYST_ARIA | Analyst | Phân tích hiệu năng luồng làm việc, phát hiện điểm nghẽn SLA |
| 09 | Mason (Context Optimizer) | OPT_MASON | Optimizer | Tối ưu hóa context window, nén token và lưu trữ vector cache |
| 10 | Luna (Generative UI Crafter) | UI_LUNA | Frontend | Sáng tạo Generative UI, hiệu ứng thị giác và micro-interactions |
| 11 | Quinn (SecOps Guard) | SEC_QUINN | Security | Kiểm toán an ninh mã nguồn, quét CVE OWASP, SonarQube Grade A, Trivy |
| 12 | Max (DB & Cache Engineer) | DB_MAX | Database | Tối ưu hóa PostgreSQL RLS, Redis cache và truy vấn Supabase |
| 13 | Dep (Dependency Auditor) | DEP_AUDITOR | DevOps | Quản lý cây phụ thuộc npm, Dockerfile multi-stage, container security |
