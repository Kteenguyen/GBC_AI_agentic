import fs from 'fs';
import path from 'path';

const doc09Content = `# KIẾN TRÚC 13 AI SUBAGENTS & CỔNG 9ROUTER SERVERLESS GATEWAY

## 1. Tổng Quan Hệ Thống Đội Ngũ AI Tự Hành (Agent Squad)

Hệ thống **GBC AI Agentic** vận hành dựa trên cơ chế điều phối đa tác nhân (Multi-Agent Swarm) với **13 AI Subagents Chuyên Trách** dưới sự chỉ huy trực tiếp của **Supreme Brainstorming Leader**. Mỗi Subagent đảm nhiệm một vai trò độc lập trong chu trình phát triển mã nguồn Clean Architecture.

```mermaid
flowchart TD
    LEADER["Supreme Brainstorming Leader (Tổng Chỉ Huy Tối Cao)"]
    
    subgraph Frontend_Group["Nhóm Giao Diện & Trải Nghiệm"]
        ALEX["Alex: React / Next.js Pro"]
        MOBILE_UX["Mobile UX: Chuẩn 430px Pixel-Perfect"]
        LUNA["Luna: Generative UI & Visuals"]
    end

    subgraph Backend_Data_Group["Nhóm Hệ Thống & Dữ Liệu"]
        REX["Rex: System Architect"]
        BACKEND_GUARD["Backend & Supabase Guard"]
        MAX["Max: PostgreSQL RLS & Cache"]
    end

    subgraph Security_QA_Group["Nhóm Bảo Mật & Kiểm Thử"]
        QA_AUTO["QA Testing Subagent (Playwright E2E)"]
        QUINN["Quinn: SecOps & Token Guard"]
        DEEP_TESTER["Deep Testing Specialist"]
    end

    subgraph DevOps_Analytics_Group["Nhóm Vận Hành & Tối Ưu"]
        DEVOPS_PARITY["DevOps Parity Officer (TypeScript 0 Lỗi)"]
        ARIA["Aria: Workflow Performance Analyst"]
        MASON["Mason: Token & Context Optimizer"]
        DEP_AUDITOR["Dep: Dependency & Container Auditor"]
    end

    LEADER --> Frontend_Group
    LEADER --> Backend_Data_Group
    LEADER --> Security_QA_Group
    LEADER --> DevOps_Analytics_Group
```

---

## 2. Danh Bộ 13 AI Subagents & Nghiệp Vụ Cốt Lõi

1. **Supreme Brainstorming Leader (\`LEADER_BRAINSTORMING\`)**: Phân rã mục tiêu, xuất sơ đồ luồng ý tưởng (Flow Diagram), kích hoạt đào sâu ngữ cảnh Non-Tech và tự động soạn prompt giao việc cho từng subagent.
2. **Alex - Frontend Pro (\`FE_ALEX\`)**: Lập trình giao diện Next.js App Router, Tailwind CSS, bảo đảm hỗ trợ Dark/Light Theme nền Be sang trọng.
3. **Mobile UX Architect (\`UX_MOBILE_430\`)**: Chuyên gia thiết kế giao diện Mobile-First, chuẩn xác tuyệt đối trên màn hình iPhone 14 Pro Max (430px), touch target tối thiểu 44px.
4. **QA Testing Subagent (\`QA_AUTOMATION\`)**: Kiểm thử tự động đa tầng: Playwright E2E, Visual Regression và Unit Tests.
5. **Backend & Supabase Guard (\`BACKEND_REALTIME\`)**: Quản lý Supabase Cloud REST 100%, bảo vệ Event Bus 0ms qua \`CustomEvent('gcm_*_updated')\`.
6. **Rex - System Architect (\`ARCH_REX\`)**: Kiến trúc sư Clean Architecture, chuẩn hóa Route Handlers và ngăn chặn vi phạm layer coupling.
7. **Quinn - SecOps Guard (\`SEC_QUINN\`)**: Kiểm toán an ninh mã nguồn, quét CVE OWASP, giám sát an toàn API Tokens.
8. **DevOps Parity Officer (\`DEVOPS_PARITY\`)**: Kiểm soát cổng \`npx tsc --noEmit\` 0 lỗi, bảo đảm chạy mượt 100% trên Vercel Production.
9. **Aria - Workflow Analyst (\`ANALYST_ARIA\`)**: Phân tích hiệu năng luồng, thời gian thực thi của từng node và phát hiện điểm nghẽn SLA.
10. **Mason - Context Optimizer (\`OPT_MASON\`)**: Tối ưu hóa context window, nén token và lưu trữ bộ nhớ đệm phục vụ suy luận nhanh.
11. **Luna - Generative UI Crafter (\`UI_LUNA\`)**: Sáng tạo hiệu ứng giao diện, radar score so găng Solo Arena 1v1 và các chuyển động micro-interactions.
12. **Max - DB & Cache Engineer (\`DB_MAX\`)**: Tối ưu hóa Supabase PostgreSQL RLS, bộ nhớ tạm Redis và cấu trúc dữ liệu bền vững.
13. **Dep - Dependency Auditor (\`DEP_AUDITOR\`)**: Rà soát cây phụ thuộc npm, kiểm soát container security và audit các gói mã nguồn mở.

---

## 3. Kiến Trúc Cổng 9Router Serverless Gateway & Unlimited Key Pool

**9Router** là cổng Gateway Serverless tương thích 100% chuẩn OpenAI Chat Completions API (\`/api/9router/v1/chat/completions\`), cho phép nạp không giới hạn Gemini API Keys (từ 10 đến 100 keys) và tự động xoay vòng tải liên tục.

### Cơ Chế Auto-Failover 0ms & Circuit Breaker 60s
- **Phân Phối Tải Ngẫu Nhiên (Load Balancing)**: Khi có request đến, 9Router chọn ngẫu nhiên một Key khả dụng trong Pool.
- **Xử Lý Lỗi 429 Tức Thì (Failover)**: Nếu Key gặp lỗi Rate Limit 429 hoặc Quota Exceeded, 9Router tự động chuyển sang Key kế tiếp ngay lập tức mà không làm gián đoạn người dùng.
- **Cơ Chế Phục Hồi (Circuit Breaker)**: Key bị lỗi 429 được đưa vào hàng đợi cách ly trong đúng 60 giây và tự động mở khóa khi hết thời gian chờ.

---

## 4. Hướng Dẫn Sử Dụng 9Router CLI & REST API

Gửi yêu cầu Chat Completion thông qua cổng 9Router:

\`\`\`bash
curl -X POST "https://agent.globalcode.com.vn/api/9router/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_APP_API_KEY" \\
  -d '{
    "model": "gemini-2.5-flash",
    "messages": [
      { "role": "system", "content": "Ban la chuyen gia DevOps." },
      { "role": "user", "content": "Huong dan toi cau hinh ArgoCD GitOps." }
    ],
    "temperature": 0.7
  }'
\`\`\`

---
*Tài liệu được biên soạn tự động bởi Supreme Brainstorming Leader.*
`;

const doc10Content = `# CÂU HỎI THƯỜNG GẶP (FAQ) & SỔ TAY XỬ LÝ SỰ CỐ PIPELINE

## 1. Các Câu Hỏi Thường Gặp Về Hệ Thống (General FAQ)

### Q1: Hệ thống GBC AI Agentic hoạt động trên hạ tầng nào?
**Trả lời**: Hệ thống được triển khai trên nền tảng **Vercel Serverless Edge** kết hợp cơ sở dữ liệu **Supabase Cloud REST** và kho mã nguồn **GitHub**. Toàn bộ chu trình vận hành độc lập, không phụ thuộc vào máy chủ nội bộ hay MongoDB.

### Q2: Quyền hạn RBAC được phân cấp như thế nào?
**Trả lời**:
- \`ADMIN_CEO\` & \`HEAD\`: Toàn quyền quản trị, xem màn hình Tiến độ Dự án (PM Dashboard), Cashflow, kích hoạt Pipeline và phê duyệt tuyển dụng Agent.
- \`DEV\`, \`QA\`, \`MKT\`, \`Intern\`: Xem sơ đồ Workflow Canvas, tham gia kiểm thử QA Lab và tương tác với AI Prompt Terminal.

### Q3: Bàn điều khiển Node Quick-Config hoạt động ra sao?
**Trả lời**: Khi nhấp vào bất kỳ Node nào trên Canvas, thanh trượt Quick-Config bên phải sẽ mở ra cho phép:
1. Nhập 100% trường cấu hình kết nối bên thứ 3 của Node đó.
2. Bấm nút \`Live Ping Healthcheck\` để kiểm tra thời gian phản hồi thực tế (Latency ms) và mã HTTP.
3. Xem và tải về file cấu hình chuẩn (\`pipeline.env\`, \`docker-compose.yml\`, \`k8s-manifest.yaml\`).

---

## 2. Sổ Tay Xử Lý Sự Cố Thường Gặp (Troubleshooting Runbook)

### Sự cố 1: API Key bị chạm ngưỡng Rate Limit 429
- **Hiện tượng**: Request báo lỗi \`Resource Exhausted: Rate Limit 429\`.
- **Nguyên nhân**: Key Gemini miễn phí bị giới hạn 15 RPM.
- **Cách khắc phục**:
  1. Vào tab **Unlimited Key Pool Management** trên thanh điều hướng.
  2. Dán thêm danh sách 5 - 10 Gemini API Keys mới từ Google AI Studio.
  3. 9Router sẽ tự động kích hoạt vòng lặp Failover và Circuit Breaker 60s để phục hồi Key.

### Sự cố 2: Jenkins Build thất bại ở bước Docker Socket Permission
- **Hiện tượng**: Log báo \`Got permission denied while trying to connect to the Docker daemon socket\`.
- **Cách khắc phục**:
  \`\`\`bash
  # Cấp quyền đọc ghi cho socket Docker trên máy chủ Linux
  sudo chmod 666 /var/run/docker.sock
  sudo usermod -aG docker jenkins
  \`\`\`

### Sự cố 3: SonarQube Quality Gate báo lỗi Grade A Failed
- **Hiện tượng**: Pipeline dừng lại ở bước \`Quality Gate Evaluation\`.
- **Nguyên nhân**: Độ phủ Unit Test (Code Coverage) dưới 80% hoặc có New Critical Bugs.
- **Cách khắc phục**:
  \`\`\`bash
  # Chạy test kiểm tra coverage cục bộ
  npm run test:coverage
  # Kiểm tra file coverage/lcov.info đã được sinh đầy đủ chưa
  \`\`\`

### Sự cố 4: Kubernetes Pod rơi vào trạng thái ImagePullBackOff
- **Hiện tượng**: Pod không thể khởi động trên cụm K8s.
- **Nguyên nhân**: Docker Registry Secret chưa được cấu hình hoặc sai Image Tag.
- **Cách khắc phục**:
  \`\`\`bash
  # Tạo Image Pull Secret trên Kubernetes
  kubectl create secret docker-registry regcred \\
    --docker-server=docker.io \\
    --docker-username=YOUR_USERNAME \\
    --docker-password=YOUR_TOKEN \\
    --namespace=production
  \`\`\`

---
*Tài liệu được biên soạn tự động bởi Supreme Brainstorming Leader.*
`;

fs.writeFileSync('docs/guides/09-ai-squad-and-9router-architecture.md', doc09Content, 'utf8');
fs.writeFileSync('docs/guides/10-faq-and-troubleshooting-guide.md', doc10Content, 'utf8');

console.log('Successfully created docs 09 and 10 in docs/guides!');
