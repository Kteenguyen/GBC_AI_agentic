# TÀI LIỆU TỔNG THỂ DỰ ÁN GBC AI AGENTIC: KIẾN TRÚC, INPUT/OUTPUT & LUỒNG VẬN HÀNH

Dự án: **Workflow (GBC_AI_agentic)**
Production URL: **https://agent.globalcode.com.vn**
GitHub Repository: **https://github.com/Kteenguyen/GBC_AI_agentic.git** (Branch: main)

---

## 1. TỔNG QUAN HỆ THỐNG & CÔNG NGHỆ CỐT LÕI

Hệ thống **GBC AI Agentic Workflow** là nền tảng quản trị và tự động hóa chu trình phát triển phần mềm (DevOps Lifecycle) thế hệ mới, kết hợp đội ngũ **13 AI Subagents Tự Hành** phối hợp cùng **9Router Serverless Gateway** chạy 24/7 trên hạ tầng Vercel Cloud.

### 4 Trục Bất Biến Của Kiến Trúc:
1. **Phân Quyền RBAC Nghiêm Ngặt**: Tiến độ dự án và luồng dòng tiền (Cashflow) giới hạn nghiêm ngặt cho `ADMIN_CEO` và `HEAD`.
2. **Giao Diện Mobile-First 430px**: Chuẩn màn hình iPhone 14 Pro Max (430px), touch target >= 44px, nút bấm font 11.5px - 12.5px.
3. **Supabase Cloud REST 100% & Realtime Bus 0ms**: Toàn bộ dữ liệu đồng bộ qua `@/lib/supabase` và `CustomEvent('gcm_*_updated')`. Ngưng toàn bộ MongoDB.
4. **Vercel Production Parity 100%**: Mã nguồn vượt qua kiểm thử `npx tsc --noEmit` 0 lỗi và hoạt động mượt mà trên môi trường Serverless.

---

## 2. SƠ ĐỒ LUỒNG DỮ LIỆU TỔNG THỂ (SYSTEM DATA FLOW DIAGRAM)

```
                            [NGƯỜI DÙNG / SẾP (MOBILE HOẶC DESKTOP)]
                                               │
                                               ▼ (Prompt AI / Ctrl+K)
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │ 9ROUTER SERVERLESS GATEWAY (/api/9router/v1/chat/completions)               │
        │ ├── Quản lý Unlimited Gemini Key Pool (10 - 100 Keys)                      │
        │ ├── Cơ chế Auto-Failover 0ms khi chạm ngưỡng Rate Limit (429)               │
        │ └── Circuit Breaker 60s: Tự động cách ly và hồi phục Key sau 60 giây        │
        └──────────────────────────────────────┬──────────────────────────────────────┘
                                               │
                                               ▼
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │ SUPREME BRAINSTORMING LEADER (TỔNG CHỈ HUY TỐI CAO)                         │
        │ ├── Phân rã mục tiêu, xuất sơ đồ luồng ý tưởng (Flow Diagram)               │
        │ └── Tự động soạn prompt và phân công 13 Subagents (Không chờ nhắc)          │
        └───────────────────┬──────────────────────────────────┬──────────────────────┘
                            │                                  │
         ┌──────────────────┴─────────────────┐    ┌───────────┴──────────────────────┐
         ▼                                    ▼    ▼                                  ▼
   [FE Alex & Mobile UX]                 [Rex - Architect] [QA Subagent & Deep Tester] [Quinn - SecOps]
   (Component & 430px Layout)            (API & Supabase)  (Playwright E2E & 87 Tests) (OWASP & Token Guard)
                            │                                  │
                            └──────────────────┬───────────────┘
                                               │
                                               ▼
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │ 8-STAGE DEVOPS PIPELINE ENGINE (/api/pipeline)                              │
        │ Jenkins CI -> OWASP CVE -> SonarQube Gate A -> Trivy -> Docker -> ArgoCD -> K8s   │
        └──────────────────────────────────────┬──────────────────────────────────────┘
                                               │
                                               ▼
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │ BÀN GIAO & VERCEL PRODUCTION PARITY (TypeScript 0 Lỗi -> agent.globalcode.com.vn)│
        └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CHI TIẾT 8 GIAI ĐOẠN (PIPELINE NODES): INPUT, PROCESS & OUTPUT ARTIFACT

| Stage Node | Tên Giai Đoạn | Agent Phụ Trách | Input Đầu Vào | Quy Trình Xử Lý | Output Artifact Đầu Ra |
|---|---|---|---|---|---|
| **Node 1: DEV** | Workspace Local | Mobile UX / Alex | Mã nguồn TypeScript / React | Lập trình component, rà soát responsive 430px và Desktop 1 hàng | `Source Code Commit` |
| **Node 2: GIT** | Git Push & Webhook | DevOps Parity | Git Commit Message | Kích hoạt Webhook trigger tự động tới Jenkins Controller | `Git Webhook Payload` |
| **Node 3: CI** | Jenkins CI Server | DevOps Parity | Branch `main` | Chạy `npm ci`, biên dịch mã nguồn và chạy Unit Test suite | `JUnit Test Report XML` |
| **Node 4: SECURITY** | OWASP Dependency-Check | Quinn (SecOps) | `package.json`, `package-lock.json` | Quét cơ sở dữ liệu lỗ hổng bảo mật quốc tế CVE, chặn CVSS >= 7.0 | `OWASP Vulnerability Matrix` |
| **Node 5: CODE QUALITY** | SonarQube Quality Gate | Rex (Architect) | Toàn bộ mã nguồn `src/` | Phân tích tĩnh (SAST), kiểm tra nợ kỹ thuật, đánh giá Grade A | `SonarQube Grade A Certificate` |
| **Node 6: CONTAINER SEC** | Trivy Security Scanner | Quinn (SecOps) | Filesystem & Rootfs | Quét lộ lọt Secret (`.env`), rà soát thư viện hệ thống OS | `Trivy Clean Security Audit` |
| **Node 7: BUILD** | Docker BuildKit | Dep (Auditor) | Multi-stage Dockerfile | Đóng gói container image tối ưu dung lượng và đẩy lên Registry | `Container Image Digest` |
| **Node 8: CD & GITOPS** | ArgoCD & Kubernetes | Max (DB & Infra) | K8s Manifest YAML, Kubeconfig | Đồng bộ trạng thái khai báo GitOps và triển khai lên cụm K8s | `Kubernetes Deployment Status` |

---

## 4. DANH BỘ 13 AI SUBAGENTS & VAI TRÒ CHUYÊN BIỆT

1. **Supreme Brainstorming Leader (`LEADER_BRAINSTORMING`)**:
   - Tổng chỉ huy tối cao, phân tích phản biện, vẽ sơ đồ luồng ý tưởng và tự động phân bổ subagent.
2. **Mobile UX Architect (`UX_MOBILE_430`)**:
   - Chuyên gia giao diện Mobile-First, chuẩn iPhone 14 Pro Max (430px), touch target >= 44px.
3. **QA Testing Subagent (`QA_AUTOMATION` / `qa_e2e_browser_reviewer`)**:
   - Kiểm thử tự động đa tầng: Visual 430px, Playwright E2E, Unit Tests, kiểm tra thanh Top Bar 1 hàng duy nhất trên Desktop.
4. **Backend & Supabase Guard (`BACKEND_REALTIME`)**:
   - Bảo vệ kết nối Supabase Cloud REST 100%, duy trì Event Bus 0ms qua `CustomEvent('gcm_*_updated')`.
5. **DevOps Parity Officer (`DEVOPS_PARITY`)**:
   - Đảm bảo tính tương thích Vercel Production Parity 100%, kiểm soát cổng `npx tsc --noEmit` 0 lỗi.
6. **Rex - System Architect (`ARCH_REX` / `system_code_architect`)**:
   - Kiến trúc sư hệ thống Clean Architecture, chuẩn hóa Route Handlers và ngăn chặn vi phạm layer coupling.
7. **Alex - React & Tailwind Pro (`FE_ALEX`)**:
   - Kỹ sư giao diện Next.js App Router, Tailwind CSS, tối ưu bảng quản trị Key Pool và 2 chế độ màu (Sáng Nền Be / Tối Deep Slate).
8. **Aria - Workflow Analyst (`ANALYST_ARIA`)**:
   - Phân tích hiệu năng luồng, thời gian thực thi của từng node và phát hiện điểm nghẽn SLA.
9. **Mason - Context Optimizer (`OPT_MASON`)**:
   - Tối ưu hóa context window, nén token và lưu trữ bộ nhớ đệm phục vụ suy luận nhanh.
10. **Luna - Generative UI Crafter (`UI_LUNA`)**:
    - Sáng tạo hiệu ứng giao diện, radar score so găng Solo Arena 1v1 và các chuyển động micro-interactions.
11. **Quinn - SecOps Guard (`SEC_QUINN` / `deep_testing_specialist`)**:
    - Kiểm toán an ninh mã nguồn, quét CVE OWASP, giám sát hạn mức Rate Limit 429 và bảo mật API tokens.
12. **Max - DB & Cache Engineer (`DB_MAX`)**:
    - Tối ưu hóa Supabase PostgreSQL RLS, bộ nhớ tạm Redis và cấu trúc dữ liệu bền vững.
13. **Dep - Dependency Auditor (`DEP_AUDITOR`)**:
    - Rà soát cây phụ thuộc npm, kiểm soát container security và audit các gói mã nguồn mở.

---

## 5. HẠ TẦNG 9ROUTER SERVERLESS GATEWAY & UNLIMITED KEY POOL

- **Đường dẫn Cổng Gateway**: `/api/9router/v1/chat/completions` (Tương thích chuẩn OpenAI Chat Completions).
- **Trạng thái Trực Tuyến**: `GET /api/9router` trả về trạng thái hoạt động 24/7 trên Vercel Serverless.
- **Cơ chế Nạp Keys**:
  + Nạp qua biến môi trường Vercel (chạy chung cho toàn team).
  + Nạp trực tiếp trên trình duyệt điện thoại/máy tính (Lưu vào LocalStorage mã hóa).
  + Hỗ trợ dán hàng loạt (Bulk Import) không giới hạn: 10, 20, 50, 100 Keys cùng lúc.
- **Vòng Lặp Đốt Token Liên Hoàn (Failover Loop)**:
  + Phân phối tải ngẫu nhiên giữa các key trong pool.
  + Khi một key chạm ngưỡng 429 RPM, hệ thống tự động cách ly trong 60 giây và chuyển tiếp yêu cầu sang key kế tiếp ngay tức thì (độ trễ < 5ms).

---

## 6. DANH BỤC CÁC API ROUTES HỆ THỐNG

| Method | Endpoint | Chức Năng Chính | Quyền Hạn RBAC |
|---|---|---|---|
| `GET` | `/api/9router` | Báo cáo trạng thái cổng Gateway Serverless 24/7 | Toàn bộ thành viên |
| `POST` | `/api/9router/v1/chat/completions` | Giao tiếp suy luận LLM chuẩn OpenAI API | Toàn bộ thành viên |
| `POST` | `/api/chat` | Hội thoại với Agent Squad, phân tích ngữ cảnh dự án | Toàn bộ thành viên |
| `GET` / `POST` | `/api/pipeline` | Lấy dữ liệu 8 Stage nodes, bước logs, chuyển giai đoạn | `ADMIN_CEO`, `HEAD` |
| `GET` | `/api/github-trending` | Quét Top 10 GitHub Trending Repositories | Toàn bộ thành viên |
| `POST` | `/api/solo-battle` | Đấu trường Solo 1v1 so găng 5 tiêu chí điểm số | Toàn bộ thành viên |
| `GET` / `POST` | `/api/hire-agent` | Đề xuất và duyệt tuyển dụng kỹ năng vào Squad | `ADMIN_CEO`, `HEAD` |
| `GET` | `/api/docs` | Danh mục toàn bộ 9 tài liệu hướng dẫn kỹ thuật | Toàn bộ thành viên |
| `GET` / `POST` | `/api/config` | Đọc và lưu cấu hình hạ tầng `workflow.config.json` | `ADMIN_CEO`, `HEAD` |
| `POST` | `/api/node-action` | Thực thi hành động từng node (OWASP, SonarQube, Trivy) | `ADMIN_CEO`, `HEAD` |

---
*Tài liệu được biên soạn tự động bởi Supreme Brainstorming Leader và Rex (System Architect).*
