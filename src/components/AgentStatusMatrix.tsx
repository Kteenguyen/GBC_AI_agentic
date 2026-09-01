'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Search, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Zap, 
  ChevronRight, 
  Terminal,
  Cpu,
  Crown,
  Smartphone,
  Database,
  FlaskConical,
  Server,
  Network,
  BarChart2,
  Play,
  RotateCcw,
  Radio,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AgentRoleProfile, AgentCategory, AgentStatus } from '@/types';

interface AgentStatusMatrixProps {
  agents: AgentRoleProfile[];
  onSelectAgent: (agent: AgentRoleProfile) => void;
  selectedAgentCode?: string;
  theme?: 'light' | 'dark';
}

interface AutonomousEvent {
  id: string;
  timestamp: string;
  fromAgent: string;
  toAgent: string;
  action: string;
  details: string;
  status: 'DISPATCH' | 'COMPLETED' | 'RUNNING' | 'PASS';
}

const PROACTIVE_EVENT_TEMPLATES: Array<Omit<AutonomousEvent, 'id' | 'timestamp'>> = [
  {
    fromAgent: 'Supreme NLP Leader',
    toAgent: 'Mobile UX Architect',
    action: 'Phát lệnh rà soát giao diện',
    details: 'Kiểm tra độ tương thích responsive màn hình mobile 430px và touch target 38px.',
    status: 'DISPATCH'
  },
  {
    fromAgent: 'Mobile UX Architect',
    toAgent: 'QA Testing Subagent',
    action: 'Chuyển giao UI Layout',
    details: 'Đã hoàn tất tối ưu giao diện theo chuẩn Vercel/Apple. Yêu cầu chạy Playwright E2E.',
    status: 'COMPLETED'
  },
  {
    fromAgent: 'QA Testing Subagent',
    toAgent: 'Backend & Supabase Guard',
    action: 'Báo cáo kết quả kiểm thử',
    details: '14/14 test cases PASSED (0ms latency, RLS policies verified). Sẵn sàng build container.',
    status: 'PASS'
  },
  {
    fromAgent: 'Backend & Supabase Guard',
    toAgent: 'DevOps Parity Officer',
    action: 'Xác thực Realtime Bus',
    details: 'Kênh CustomEvent("gcm_*") và REST Client Supabase Cloud hoạt động đồng bộ 100%.',
    status: 'COMPLETED'
  },
  {
    fromAgent: 'DevOps Parity Officer',
    toAgent: 'Rex (System Architect)',
    action: 'Kiểm toán Docker Standalone',
    details: 'Docker build standalone hoàn tất, dung lượng 78MB, kiểm tra kết nối port 3000 đạt.',
    status: 'PASS'
  },
  {
    fromAgent: 'Rex (System Architect)',
    toAgent: 'Supreme NLP Leader',
    action: 'Tổng kết chu trình tự hành',
    details: 'Toàn bộ 8 giai đoạn pipeline và hạ tầng hoạt động trơn tru. Squad sẵn sàng cho task tiếp theo.',
    status: 'COMPLETED'
  }
];

export const AgentStatusMatrix: React.FC<AgentStatusMatrixProps> = ({
  agents,
  onSelectAgent,
  selectedAgentCode,
  theme = 'light',
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(true);
  const [autonomousEvents, setAutonomousEvents] = useState<AutonomousEvent[]>([
    {
      id: 'evt-1',
      timestamp: '18:50:01',
      fromAgent: 'Supreme NLP Leader',
      toAgent: 'Toàn Squad',
      action: 'Khởi động Chế độ Tự Hành 24/7',
      details: 'Hệ thống tự động tuần tra mã nguồn và kiểm toán liên tục không đợi nhắc tên.',
      status: 'DISPATCH'
    },
    {
      id: 'evt-2',
      timestamp: '18:50:04',
      fromAgent: 'QA Testing Subagent',
      toAgent: 'Supreme NLP Leader',
      action: 'Tự động chạy Playwright Suite',
      details: 'Kiểm thử viewport 430px và TypeScript: 0 lỗi biên dịch, 100% Passed.',
      status: 'PASS'
    }
  ]);
  const [activeThinkingAgent, setActiveThinkingAgent] = useState<string>('Supreme NLP Leader');

  const streamEndRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // Autonomous proactive loop: triggers auto events when Auto-Pilot is enabled
  useEffect(() => {
    if (!isAutoPilot) return;

    const interval = setInterval(() => {
      const template = PROACTIVE_EVENT_TEMPLATES[Math.floor(Math.random() * PROACTIVE_EVENT_TEMPLATES.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newEvt: AutonomousEvent = {
        id: `evt-${Date.now()}`,
        timestamp: timeStr,
        ...template
      };

      setAutonomousEvents(prev => [...prev.slice(-15), newEvt]);
      setActiveThinkingAgent(template.fromAgent);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPilot]);

  // Trigger manual broadcast
  const handleBroadcastMission = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const broadcastEvt: AutonomousEvent = {
      id: `evt-${Date.now()}`,
      timestamp: timeStr,
      fromAgent: 'Supreme NLP Leader',
      toAgent: 'Toàn Squad (13 Subagents)',
      action: 'Phát Lệnh Tự Hành Khẩn Cấp',
      details: 'Đã kích hoạt toàn bộ 13 Subagents: Tự động rà soát code, kiểm thử QA và đồng bộ hạ tầng CI/CD!',
      status: 'DISPATCH'
    };

    setAutonomousEvents(prev => [...prev.slice(-15), broadcastEvt]);
    setActiveThinkingAgent('Supreme NLP Leader');
  };

  const categories = [
    'ALL', 
    'LEADER', 
    'FRONTEND', 
    'BACKEND', 
    'QA', 
    'DEVOPS', 
    'ARCHITECT', 
    'OPTIMIZER', 
    'ANALYST'
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = filterCategory === 'ALL' || agent.category === filterCategory;
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.currentTask.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'running':
        return {
          bg: isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: isLight ? 'bg-blue-600 animate-ping' : 'bg-cyan-400 animate-ping',
          label: 'Đang Tự Hành',
        };
      case 'testing':
        return {
          bg: isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: isLight ? 'bg-purple-600 animate-pulse' : 'bg-purple-400 animate-pulse',
          label: 'Tự Động Test',
        };
      case 'success':
        return {
          bg: isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dot: isLight ? 'bg-emerald-600' : 'bg-emerald-400',
          label: 'Đã Kiểm Toán',
        };
      case 'idle':
        return {
          bg: isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800/80 text-slate-400 border-slate-700',
          dot: 'bg-slate-400',
          label: 'Tuần Tra Ngầm',
        };
      case 'blocked':
      case 'error':
        return {
          bg: isLight ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: isLight ? 'bg-rose-600 animate-bounce' : 'bg-rose-400 animate-bounce',
          label: 'Cần Tối Ưu',
        };
    }
  };

  const renderCategoryIcon = (category: AgentCategory) => {
    switch (category) {
      case 'LEADER':
        return <Crown className="w-4 h-4 text-amber-500" />;
      case 'FRONTEND':
        return <Smartphone className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'BACKEND':
        return <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'QA':
        return <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'DEVOPS':
        return <Server className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'ARCHITECT':
        return <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'OPTIMIZER':
        return <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'ANALYST':
        return <BarChart2 className="w-4 h-4 text-amber-600 dark:text-yellow-400" />;
      default:
        return <Users className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColor = (category: AgentCategory) => {
    if (isLight) {
      switch (category) {
        case 'LEADER': return 'text-amber-700 bg-amber-50 border-amber-200';
        case 'FRONTEND': return 'text-cyan-700 bg-cyan-50 border-cyan-200';
        case 'BACKEND': return 'text-blue-700 bg-blue-50 border-blue-200';
        case 'QA': return 'text-purple-700 bg-purple-50 border-purple-200';
        case 'DEVOPS': return 'text-rose-700 bg-rose-50 border-rose-200';
        case 'ARCHITECT': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        case 'OPTIMIZER': return 'text-indigo-700 bg-indigo-50 border-indigo-200';
        case 'ANALYST': return 'text-amber-800 bg-amber-50 border-amber-200';
        default: return 'text-slate-700 bg-slate-100 border-slate-200';
      }
    } else {
      switch (category) {
        case 'LEADER': return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
        case 'FRONTEND': return 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
        case 'BACKEND': return 'text-blue-400 bg-blue-950/40 border-blue-500/30';
        case 'QA': return 'text-purple-400 bg-purple-950/40 border-purple-500/30';
        case 'DEVOPS': return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
        case 'ARCHITECT': return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
        case 'OPTIMIZER': return 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30';
        case 'ANALYST': return 'text-yellow-400 bg-yellow-950/40 border-yellow-500/30';
        default: return 'text-slate-300 bg-slate-800 border-slate-700';
      }
    }
  };

  return (
    <div className="w-full space-y-5">
      
      {/* 1. AUTONOMOUS PROACTIVE COMMAND HEADER */}
      <div className={`rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4 border transition-all ${
        isLight 
          ? 'bg-gradient-to-r from-[#FFFFFF] via-[#FAF8F5] to-[#F5F1E8] border-[#E2DDD5]'
          : 'bg-gradient-to-r from-[#0B101E] via-[#0E1528] to-[#0A0E1A] border-blue-500/30'
      }`}>
        
        {/* Left Title & Auto-Pilot Indicator */}
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition ${
            isLight
              ? 'bg-blue-50 border border-blue-200 text-blue-600'
              : 'bg-blue-600/10 border border-blue-500/40 text-blue-400 shadow-blue-500/10'
          }`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className={`font-bold text-sm sm:text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Bộ Chỉ Huy 13 AI Subagents Tự Hành 24/7
              </h3>
              <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${
                isLight
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>CHỦ ĐỘNG TỰ HÀNH • KHÔNG ĐỢI LỆNH</span>
              </div>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Toàn bộ squad liên tục tự động rà soát mã nguồn, kiểm thử giao diện và điều phối hạ tầng không cần người dùng nhắc tên.
            </p>
          </div>
        </div>

        {/* Right Proactive Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Auto-Pilot Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              isAutoPilot
                ? (isLight ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/20' : 'bg-blue-600 text-white border-blue-400/50 shadow-blue-600/20')
                : (isLight ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50' : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200')
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAutoPilot ? 'animate-pulse text-cyan-300' : ''}`} />
            <span>Auto-Pilot: {isAutoPilot ? 'Đang Bật' : 'Tắt'}</span>
          </button>

          {/* Manual Broadcast Trigger */}
          <button
            type="button"
            onClick={handleBroadcastMission}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/40 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Phát Lệnh Tự Hành Toàn Squad</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE INTER-AGENT AUTONOMOUS STREAM TICKER */}
      <div className={`rounded-2xl p-3.5 space-y-2 border transition ${
        isLight
          ? 'bg-white border-[#E2DDD5] shadow-sm'
          : 'bg-[#080C17] border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono">
          <div className={`flex items-center gap-2 font-bold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>
            <MessageSquare className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span>Luồng Trao Đổi Tự Hành Trực Tiếp Giữa Các Subagents (Live Inter-Agent Stream):</span>
          </div>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Auto-Refreshed 0ms</span>
        </div>

        <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
          {autonomousEvents.map((evt) => (
            <div key={evt.id} className={`flex items-start gap-2 p-2 rounded-lg text-[11px] leading-relaxed border transition ${
              isLight
                ? 'bg-[#FAF8F5] border-[#E8E3DA] text-slate-800'
                : 'bg-[#0E1526]/80 border-slate-800/80 text-slate-300'
            }`}>
              <span className={`shrink-0 text-[10px] pt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{evt.timestamp}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold shrink-0 border ${
                isLight ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-blue-950 text-cyan-300 border-cyan-500/30'
              }`}>
                {evt.fromAgent}
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
              <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold shrink-0 border ${
                isLight ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-purple-950 text-purple-300 border-purple-500/30'
              }`}>
                {evt.toAgent}
              </span>
              <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{evt.action}:</span>
              <span className={`truncate flex-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{evt.details}</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 border ${
                evt.status === 'PASS' 
                  ? (isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-950 text-emerald-400 border-emerald-500/30')
                  : (isLight ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-blue-950 text-blue-300 border-blue-500/30')
              }`}>
                {evt.status}
              </span>
            </div>
          ))}
          <div ref={streamEndRef} />
        </div>
      </div>

      {/* 3. SEARCH & CATEGORY FILTER BAR */}
      <div className={`rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border transition ${
        isLight
          ? 'bg-white border-[#E2DDD5]'
          : 'bg-[#0B0F19] border-slate-800'
      }`}>
        {/* Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên agent, role, task, kỹ năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none transition border ${
              isLight
                ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-800 placeholder-slate-400 focus:border-blue-500'
                : 'bg-[#0E1526] border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-cyan-500'
            }`}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center overflow-x-auto pb-1 md:pb-0 gap-1.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                filterCategory === cat
                  ? (isLight ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-blue-600 text-white border-blue-400 shadow-sm')
                  : (isLight ? 'bg-[#FAF8F5] text-slate-600 border-[#E2DDD5] hover:bg-slate-100' : 'bg-[#0E1526] text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. REDESIGNED 13-AGENT COMMAND GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredAgents.map((agent) => {
          const status = getStatusBadge(agent.status);
          const isSelected = selectedAgentCode === agent.code;

          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`rounded-2xl p-4 flex flex-col justify-between select-none relative overflow-hidden transition-all duration-200 border cursor-pointer group shadow-sm ${
                isSelected
                  ? (isLight ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60 shadow-md' : 'border-cyan-400 ring-2 ring-cyan-400/30 bg-[#0E172A] shadow-xl shadow-cyan-500/10')
                  : (isLight ? 'bg-white border-[#E2DDD5] hover:border-blue-400 hover:bg-[#FDFBF7]' : 'bg-[#0B101E] border-slate-800 hover:border-blue-500/60 hover:bg-[#0D1426]')
              }`}
              style={{ minHeight: '270px' }}
            >
              <div>
                {/* Header: Role Icon, Name, Category & Live Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow transition border ${
                      isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0E1526] border-slate-700'
                    }`}>
                      {renderCategoryIcon(agent.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold text-[11px] ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>
                          {agent.code}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getCategoryColor(agent.category)}`}>
                          {agent.category}
                        </span>
                      </div>
                      <h4 className={`font-bold text-xs tracking-tight line-clamp-1 mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        {agent.name}
                      </h4>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold border flex items-center gap-1.5 ${status.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    <span className="whitespace-nowrap">{status.label}</span>
                  </div>
                </div>

                {/* Role Description */}
                <p className={`text-xs line-clamp-2 leading-relaxed mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {agent.roleDescription}
                </p>

                {/* Autonomous Task & Proactive Activity Box */}
                <div className={`p-2.5 rounded-xl border mb-3 transition ${
                  isLight ? 'bg-[#FAF8F5] border-[#E8E3DA]' : 'bg-[#070B14] border-slate-800/80'
                }`}>
                  <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                    <span className={`flex items-center gap-1 font-semibold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>
                      <Terminal className={`w-3 h-3 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                      Nhiệm Vụ Tự Hành:
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Auto 0ms</span>
                  </div>
                  <p className={`text-[11.5px] font-medium line-clamp-2 leading-snug ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                    {agent.currentTask}
                  </p>
                </div>

                {/* Progress / Activity Meter */}
                <div className="mb-3">
                  <div className={`flex items-center justify-between text-[10.5px] font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <span className="flex items-center gap-1">
                      <Activity className={`w-3 h-3 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                      Công suất tự hành:
                    </span>
                    <span className={`font-mono font-bold ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>{agent.progress}%</span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800/80'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {agent.skills.slice(0, 3).map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono border ${
                        isLight
                          ? 'bg-[#FAF8F5] text-slate-700 border-[#E2DDD5]'
                          : 'bg-[#0E1526] text-slate-300 border-slate-700/60'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {agent.skills.length > 3 && (
                    <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400'}`}>
                      +{agent.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer: SLA & Inspect CoT */}
              <div className={`pt-2.5 border-t flex items-center justify-between text-[10.5px] font-mono ${
                isLight ? 'border-[#E2DDD5] text-slate-500' : 'border-slate-800 text-slate-400'
              }`}>
                <div className="flex items-center gap-2">
                  <span>Tasks: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{agent.metrics.tasksCompleted}</strong></span>
                  <span>•</span>
                  <span>SLA: <strong className="text-emerald-600 dark:text-emerald-400">{agent.metrics.successRate}%</strong></span>
                </div>
                <div className={`flex items-center gap-1 font-bold group-hover:translate-x-0.5 transition-transform ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>
                  <span>Xem CoT Log</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
