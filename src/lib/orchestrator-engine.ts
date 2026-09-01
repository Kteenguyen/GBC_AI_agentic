import { AgentRoleProfile } from '@/types';

export interface PromptScenario {
  id: string;
  title: string;
  category: string;
  promptText: string;
  description: string;
  tasks: DecomposedTask[];
  browserTestFlow: BrowserTestAction[];
}

export interface DecomposedTask {
  id: string;
  title: string;
  agentCode: string;
  agentName: string;
  agentAvatar: string;
  roleDescription: string;
  skills: string[];
  status: 'PENDING' | 'DISPATCHED' | 'RUNNING' | 'TESTING' | 'COMPLETED';
  progress: number;
  cotThinking: string[];
  toolCalls: Array<{
    toolName: string;
    args: Record<string, any>;
    output: string;
  }>;
  terminalCommands: string[];
}

export interface BrowserTestAction {
  stepIndex: number;
  actionType: 'NAVIGATE' | 'MOUSE_MOVE' | 'CLICK' | 'TYPE' | 'MEASURE_PIXELS' | 'ASSERT_PASS' | 'SNAPSHOT';
  title: string;
  description: string;
  targetSelector?: string;
  targetText?: string;
  inputValue?: string;
  cursorPos?: { x: number; y: number };
  pixelMetrics?: {
    measuredRight: number;
    maxAllowed: number;
    measuredWidth: number;
    status: 'PASS' | 'FAIL';
  };
  durationMs: number;
}

export const PROMPT_SCENARIOS: PromptScenario[] = [
  {
    id: 'scenario-1',
    title: 'Xây dựng Báo Giá Realtime & Mobile 430px',
    category: 'Fullstack Feature',
    description: 'Phát triển module tạo báo giá tự động, cập nhật realtime 0ms qua Supabase và tối ưu hiển thị iPhone 14 Pro Max 430px.',
    promptText: 'Xây dựng tính năng Báo Giá Realtime: hỗ trợ tính tổng tiền, chiết khấu tự động, đẩy sự kiện qua Supabase Realtime Bus và đảm bảo giao diện iPhone 14 Pro Max (430x932) đạt chuẩn zero-defect không tràn viền.',
    tasks: [
      {
        id: 't-1',
        title: 'Phân tích yêu cầu & Bóc tách Checklist DoDs',
        agentCode: 'AGENT-01',
        agentName: 'Lead Orchestrator',
        agentAvatar: '👑',
        roleDescription: 'Phân tích prompt, lập ma trận nhiệm vụ và phân bổ cho 4 subagents',
        skills: ['Task Decomposition', 'Context Bridge', 'Risk Mitigation'],
        status: 'PENDING',
        progress: 0,
        cotThinking: [
          'Tiếp nhận prompt: Phát triển tính năng Báo Giá Realtime & Mobile 430px.',
          'Phân rã thành 4 giai đoạn độc lập: Schema DB -> Mobile UI -> QA Browser Test -> Build Parity.',
          'Kích hoạt Subagent Frontend, Backend và QA để thực thi song song.'
        ],
        toolCalls: [
          {
            toolName: 'invoke_subagent',
            args: { roles: ['Mobile UX Architect', 'Backend & Supabase Guard', 'QA Testing Subagent'] },
            output: 'Subagents spawned successfully: [AGENT-02, AGENT-03, AGENT-05]'
          }
        ],
        terminalCommands: ['git status', 'node -v']
      },
      {
        id: 't-2',
        title: 'Dựng Giao Diện Thẻ Báo Giá & Form Chuẩn 430px',
        agentCode: 'AGENT-02',
        agentName: 'Mobile UX & Frontend Architect',
        agentAvatar: '📱',
        roleDescription: 'Xây dựng component Next.js, atomic CSS variables, responsive grid 2x2',
        skills: ['Next.js 14 App Router', 'Tailwind CSS', 'Mobile 430px Viewport', 'CSS Tokens'],
        status: 'PENDING',
        progress: 0,
        cotThinking: [
          'Thiết kế QuotationCard component với CSS variables token --font-btn, --font-label.',
          'Áp dụng flexWrap: wrap và gap: 8px cho container nút bấm.',
          'Bảo đảm toàn bộ thẻ có cursor: pointer để mở Popup Chi Tiết.'
        ],
        toolCalls: [
          {
            toolName: 'write_to_file',
            args: { TargetFile: 'src/components/QuotationCard.tsx', Overwrite: true },
            output: 'Created src/components/QuotationCard.tsx with zero-defect typography.'
          }
        ],
        terminalCommands: ['npm run lint']
      },
      {
        id: 't-3',
        title: 'Thiết Kế API & Tích Hợp Supabase Realtime Bus 0ms',
        agentCode: 'AGENT-03',
        agentName: 'Backend & Supabase Guard',
        agentAvatar: '⚡',
        roleDescription: 'Xây dựng API route /api/quotations và broadcast CustomEvent gcm_quotation_updated',
        skills: ['RESTful Design', 'Next.js Route Handlers', 'Supabase Realtime', 'Type Safety'],
        status: 'PENDING',
        progress: 0,
        cotThinking: [
          'Tạo route POST /api/quotations lưu trực tiếp vào CSDL Supabase Cloud.',
          'Buộc chặt dữ liệu với matchedUserEmp của nhân sự đăng nhập, cấm fallback employees[0].',
          'Kích hoạt CustomEvent và storage listener để giao diện tự cập nhật 0ms.'
        ],
        toolCalls: [
          {
            toolName: 'write_to_file',
            args: { TargetFile: 'src/app/api/quotations/route.ts', Overwrite: true },
            output: 'Created src/app/api/quotations/route.ts with Supabase Client.'
          }
        ],
        terminalCommands: ['npx tsc --noEmit']
      },
      {
        id: 't-4',
        title: 'Kiểm Thử Trực Tiếp Trình Duyệt iPhone 14 Pro Max',
        agentCode: 'AGENT-05',
        agentName: 'QA Testing Subagent',
        agentAvatar: '🔍',
        roleDescription: 'Điều khiển trình duyệt ảo, đo pixel bounds getBoundingClientRect().right <= 430',
        skills: ['Playwright Automation', 'Multimodal Vision', '430px Pixel Testing', 'Zero-Defect Audit'],
        status: 'PENDING',
        progress: 0,
        cotThinking: [
          'Mở viewport iPhone 14 Pro Max 430x932.',
          'Mô phỏng chuột di chuyển đến nút "Tạo Báo Giá Mới" và click.',
          'Đo đạc pixel: Toàn bộ thẻ và form có right <= 430px -> Zero Defect Verified!'
        ],
        toolCalls: [
          {
            toolName: 'run_playwright_test',
            args: { viewport: '430x932', target: 'http://localhost:3000' },
            output: '100% Passed. 0 overflow defects. Measured max right: 428px.'
          }
        ],
        terminalCommands: ['python run_qa.py']
      }
    ],
    browserTestFlow: [
      {
        stepIndex: 1,
        actionType: 'NAVIGATE',
        title: 'Điều Hướng Trình Duyệt Đến URL Mục Tiêu',
        description: 'Mở cửa sổ trình duyệt và điều hướng tới http://localhost:3000/quotations',
        cursorPos: { x: 50, y: 50 },
        durationMs: 600
      },
      {
        stepIndex: 2,
        actionType: 'MOUSE_MOVE',
        title: 'Di Chuyển Chuột Đến Nút "Tạo Báo Giá"',
        description: 'Con trỏ chuột di chuyển đến vị trí nút Tạo Báo Giá (#btn-create-quote)',
        targetSelector: '#btn-create-quote',
        cursorPos: { x: 215, y: 160 },
        durationMs: 800
      },
      {
        stepIndex: 3,
        actionType: 'CLICK',
        title: 'Click Kích Hoạt Form Báo Giá',
        description: 'Nhấp chuột và kích hoạt mở Modal Tạo Báo Giá Realtime',
        targetSelector: '#btn-create-quote',
        cursorPos: { x: 215, y: 160 },
        durationMs: 600
      },
      {
        stepIndex: 4,
        actionType: 'TYPE',
        title: 'Tự Động Nhập Dữ Liệu Khách Hàng',
        description: 'Gõ thông tin khách hàng: "Công ty Cổ Phần Global Code Việt Nam"',
        targetSelector: '#input-customer',
        inputValue: 'Công ty Cổ Phần Global Code Việt Nam',
        cursorPos: { x: 215, y: 280 },
        durationMs: 1000
      },
      {
        stepIndex: 5,
        actionType: 'MEASURE_PIXELS',
        title: 'Mắt Thần Đo Đạc Pixel Viewport iPhone 430px',
        description: 'Đo getBoundingClientRect().right trên toàn bộ các thẻ giao diện',
        targetSelector: '.card-container',
        cursorPos: { x: 215, y: 380 },
        pixelMetrics: {
          measuredRight: 428,
          maxAllowed: 430,
          measuredWidth: 414,
          status: 'PASS'
        },
        durationMs: 900
      },
      {
        stepIndex: 6,
        actionType: 'ASSERT_PASS',
        title: 'Xác Nhận Đạt Chuẩn Zero-Defect Layout',
        description: 'Kiểm tra 0 lỗi bẹp nút, 0 lỗi tràn viền phải, bố cục xếp dọc 1fr hoàn hảo',
        cursorPos: { x: 215, y: 460 },
        durationMs: 600
      },
      {
        stepIndex: 7,
        actionType: 'SNAPSHOT',
        title: 'Chụp Ảnh Màn Hình Nghiệm Thu QA',
        description: 'Lưu ảnh rendered snapshot vào artifacts và sẵn sàng bàn giao',
        cursorPos: { x: 215, y: 500 },
        durationMs: 500
      }
    ]
  },
  {
    id: 'scenario-2',
    title: 'Kiểm Thử Toàn Diện Phân Quyền RBAC & Solo Arena',
    category: 'Security & QA',
    description: 'Rà soát ma trận quyền hạn CEO/HEAD vs DEV/Staff, chạy đối đầu 1v1 Top 10 GitHub Repos và tích hợp Skill.',
    promptText: 'Kiểm thử toàn diện phân quyền Strict Role-Based Guard: đảm bảo DEV không thể truy cập các tính năng duyệt tuyển dụng, kích hoạt trận đấu Solo 1v1 giữa AGENT-01 và microsoft/autogen, xuất báo cáo phán quyết.',
    tasks: [
      {
        id: 't-21',
        title: 'Phân tích Ma trận Quyền Hạn & RBAC Strict Guard',
        agentCode: 'AGENT-01',
        agentName: 'Lead Orchestrator',
        agentAvatar: '👑',
        roleDescription: 'Thiết lập danh sách kiểm thử quyền CEO/HEAD vs DEV',
        skills: ['RBAC Verification', 'Security Audit'],
        status: 'PENDING',
        progress: 0,
        cotThinking: [
          'Kiểm tra role permission: Chỉ ADMIN_CEO và HEAD được cấp nút Duyệt Tuyển Mộ.',
          'Khởi tạo kịch bản đối soát chéo trên tài khoản nhân sự thật.'
        ],
        toolCalls: [],
        terminalCommands: []
      },
      {
        id: 't-22',
        title: 'Kích Hoạt Trận Đấu 1v1 Arena Solo',
        agentCode: 'AGENT-05',
        agentName: 'QA Testing Subagent',
        agentAvatar: '🔍',
        roleDescription: 'Khởi chạy benchmark 5 tiêu chuẩn so tài với Repo microsoft/autogen',
        skills: ['Benchmarking', '1v1 Arena Simulator'],
        status: 'PENDING',
        progress: 0,
        cotThinking: [
          'So sánh tính năng: Agent Squad hỗ trợ Realtime Bus và Mobile 430px chuyên sâu.',
          'Kết luận: AGENT-01 thắng 94đ vs 88đ.'
        ],
        toolCalls: [],
        terminalCommands: []
      }
    ],
    browserTestFlow: [
      {
        stepIndex: 1,
        actionType: 'NAVIGATE',
        title: 'Mở Sàn Đấu GitHub Trending & Solo Arena',
        description: 'Điều hướng tới tab GitHub Trending & Solo Arena',
        cursorPos: { x: 100, y: 60 },
        durationMs: 600
      },
      {
        stepIndex: 2,
        actionType: 'CLICK',
        title: 'Click "Cử Agent Ra Solo 1v1"',
        description: 'Bấm nút thách đấu trên thẻ repo microsoft/autogen',
        cursorPos: { x: 340, y: 220 },
        durationMs: 800
      },
      {
        stepIndex: 3,
        actionType: 'MEASURE_PIXELS',
        title: 'Đo Điểm Số & Radar Chart',
        description: 'Đo đạc 5 cột điểm kỹ năng so tài trực tiếp',
        cursorPos: { x: 215, y: 350 },
        pixelMetrics: { measuredRight: 426, maxAllowed: 430, measuredWidth: 410, status: 'PASS' },
        durationMs: 900
      },
      {
        stepIndex: 4,
        actionType: 'ASSERT_PASS',
        title: 'Phán Quyết Thắng Cuộc & Phê Duyệt Tuyển Dụng',
        description: 'Xác nhận trạng thái phân quyền ADMIN_CEO phê duyệt nạp Skill thành công',
        cursorPos: { x: 215, y: 480 },
        durationMs: 700
      }
    ]
  }
];
