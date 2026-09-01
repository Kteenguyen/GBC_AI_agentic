'use client';

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Layers, 
  Terminal, 
  Bug, 
  Sparkles, 
  Check,
  Send,
  Monitor,
  Code2,
  Wrench,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { QATestResult, QATestType } from '@/types';
import { emitRealtimeUpdate } from '@/lib/data';

interface QATestingPanelProps {
  testResults: QATestResult[];
  onRunAllTests?: () => void;
  onRunSingleTest?: (testId: string) => void;
  theme?: 'light' | 'dark';
}

// Live DOM Simulator State
interface LiveDOMState {
  theme: 'light' | 'dark';
  btnColor: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  borderRadius: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  touchTargetHeight: number;
  activeScreen: 'pipeline' | 'matrix' | 'arena' | 'hired';
  bannerText: string;
  showRbacGuard: boolean;
  pipelineProgress: number;
  lastFixApplied: string | null;
}

const INITIAL_DOM_STATE: LiveDOMState = {
  theme: 'light',
  btnColor: 'blue',
  borderRadius: 'lg',
  touchTargetHeight: 38,
  activeScreen: 'pipeline',
  bannerText: 'DevOps Pipeline 8 Khâu Tự Hành Chuẩn Vercel Cloud',
  showRbacGuard: false,
  pipelineProgress: 100,
  lastFixApplied: null
};

export const QATestingPanel: React.FC<QATestingPanelProps> = ({
  testResults,
  onRunAllTests,
  onRunSingleTest,
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  const [activeViewport, setActiveViewport] = useState<'430px' | '390px' | '375px'>('430px');
  const [filterTestType, setFilterTestType] = useState<string>('ALL');
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [isInspectorMode, setIsInspectorMode] = useState<boolean>(false);

  // Live Simulated DOM State
  const [domState, setDomState] = useState<LiveDOMState>(INITIAL_DOM_STATE);
  const [simToast, setSimToast] = useState<string | null>(null);

  // QA Prompt Chat Fix Console State
  const [qaPrompt, setQaPrompt] = useState<string>('');
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [fixLogs, setFixLogs] = useState<Array<{
    id: string;
    prompt: string;
    action: string;
    timestamp: string;
    subagent: string;
  }>>([
    {
      id: 'fix-0',
      prompt: 'Khởi tạo giả lập DOM iPhone 14 Pro Max 430px',
      action: 'DOM Rendered: Touch target 38px, Responsive 1fr Stack, Zero Overflow.',
      timestamp: '20:55:00',
      subagent: 'Mobile UX Architect'
    }
  ]);

  // Bug report form
  const [bugDescription, setBugDescription] = useState<string>('');
  const [assignedAgent, setAssignedAgent] = useState<string>('AGENT-05');
  const [bugSubmitted, setBugSubmitted] = useState<boolean>(false);

  const passedTests = testResults.filter(t => t.status === 'PASS').length;
  const totalTests = testResults.length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;

  const filteredTests = testResults.filter(t => {
    return filterTestType === 'ALL' || t.type === filterTestType;
  });

  const showToast = (msg: string) => {
    setSimToast(msg);
    setTimeout(() => setSimToast(null), 2500);
  };

  const handleRunAll = () => {
    setIsRunningTests(true);
    emitRealtimeUpdate('gcm_qa_test_started', { timestamp: Date.now() });
    if (onRunAllTests) onRunAllTests();
    setTimeout(() => {
      setIsRunningTests(false);
      emitRealtimeUpdate('gcm_qa_test_completed', { timestamp: Date.now(), passRate: 100 });
      showToast('Đã chạy xong toàn bộ 8 bài test QA!');
    }, 1200);
  };

  // AI QA PROMPT & LIVE DOM FIX ENGINE
  const handleApplyQAPrompt = (customPrompt?: string) => {
    const textToApply = customPrompt || qaPrompt;
    if (!textToApply.trim() || isFixing) return;

    const lower = textToApply.toLowerCase();
    setIsFixing(true);

    setTimeout(() => {
      let actionTaken = '';
      let targetSubagent = 'Mobile UX Architect';

      if (lower.includes('xanh') || lower.includes('green') || lower.includes('emerald')) {
        setDomState(prev => ({ ...prev, btnColor: 'emerald', lastFixApplied: 'Đổi màu nút sang Xanh Lục Emerald' }));
        actionTaken = 'CSS Patch: Primary buttons updated to Emerald-600 with glow effect.';
      } else if (lower.includes('tối') || lower.includes('dark')) {
        setDomState(prev => ({ ...prev, theme: 'dark', lastFixApplied: 'Chuyển giao diện sang Nền Tối' }));
        actionTaken = 'Theme Patch: Document theme switched to Dark Slate (#070B14).';
      } else if (lower.includes('sáng') || lower.includes('light') || lower.includes('be')) {
        setDomState(prev => ({ ...prev, theme: 'light', lastFixApplied: 'Chuyển giao diện sang Nền Be Sáng' }));
        actionTaken = 'Theme Patch: Document theme switched to Warm Beige (#FAF8F5).';
      } else if (lower.includes('touch') || lower.includes('44px') || lower.includes('nút to')) {
        setDomState(prev => ({ ...prev, touchTargetHeight: 44, borderRadius: 'xl', lastFixApplied: 'Tối ưu Touch Target 44px' }));
        actionTaken = 'WCAG 2.2 Patch: Touch targets enlarged to 44px height (Apple HIG standard).';
      } else if (lower.includes('rbac') || lower.includes('ceo') || lower.includes('phân quyền')) {
        setDomState(prev => ({ ...prev, showRbacGuard: !prev.showRbacGuard, lastFixApplied: 'Kích hoạt RBAC Role Guard' }));
        targetSubagent = 'QA Testing Subagent';
        actionTaken = 'Security Patch: RBAC CEO Role Guard toggle applied on Dashboard.';
      } else if (lower.includes('bo tròn') || lower.includes('rounded')) {
        setDomState(prev => ({ ...prev, borderRadius: 'full', lastFixApplied: 'Bo tròn toàn bộ góc nút bấm' }));
        actionTaken = 'Style Patch: Border-radius set to 9999px (Pill shape).';
      } else if (lower.includes('reset') || lower.includes('mặc định')) {
        setDomState(INITIAL_DOM_STATE);
        actionTaken = 'Reset Patch: DOM restored to default baseline.';
      } else {
        setDomState(prev => ({
          ...prev,
          bannerText: textToApply,
          btnColor: 'purple',
          lastFixApplied: `Áp dụng yêu cầu: "${textToApply}"`
        }));
        actionTaken = `Custom DOM Patch: Rendered updated UI state based on prompt.`;
      }

      setFixLogs(prev => [
        {
          id: `fix-${Date.now()}`,
          prompt: textToApply,
          action: actionTaken,
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          subagent: targetSubagent
        },
        ...prev.slice(0, 5)
      ]);

      setIsFixing(false);
      if (!customPrompt) setQaPrompt('');
      showToast(`Đã áp dụng thay đổi vào DOM giả lập!`);
    }, 600);
  };

  const handleReportBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugDescription.trim()) return;
    setBugSubmitted(true);
    emitRealtimeUpdate('gcm_bug_reported', {
      description: bugDescription,
      assignedTo: assignedAgent,
      viewport: activeViewport,
      timestamp: Date.now()
    });
    setTimeout(() => {
      setBugDescription('');
      setBugSubmitted(false);
      showToast('Đã gửi báo cáo bug tới Subagent!');
    }, 2000);
  };

  // Helper styles based on domState
  const getBtnBgClass = () => {
    switch (domState.btnColor) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500 text-white';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500 text-white';
      case 'amber': return 'bg-amber-600 hover:bg-amber-500 text-white';
      case 'rose': return 'bg-rose-600 hover:bg-rose-500 text-white';
      default: return 'bg-blue-600 hover:bg-blue-500 text-white';
    }
  };

  const getRadiusClass = () => {
    switch (domState.borderRadius) {
      case 'sm': return 'rounded-sm';
      case 'md': return 'rounded-md';
      case 'xl': return 'rounded-xl';
      case '2xl': return 'rounded-2xl';
      case 'full': return 'rounded-full';
      default: return 'rounded-lg';
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top QA Status Banner */}
      <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg transition ${
        isLight ? 'bg-white border-[#E2DDD5] text-slate-800' : 'bg-[#111827] border-[#1E293B] text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold">
                Phòng Thí Nghiệm QA & Trình Giả Lập DOM Tương Tác
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                {passRate}% Pass Rate
              </span>
              {domState.lastFixApplied && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-cyan-300 border border-cyan-500/30 animate-pulse">
                  Đã fix: {domState.lastFixApplied}
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Gõ lệnh prompt bên phải để AI tự động fix và cập nhật trực tiếp vào DOM giả lập bên trái!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsInspectorMode(!isInspectorMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              isInspectorMode
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isInspectorMode ? 'Tắt DOM Inspector' : 'Bật DOM Inspector'}</span>
          </button>

          <button
            type="button"
            onClick={handleRunAll}
            disabled={isRunningTests}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-purple-500/20 transition cursor-pointer active:scale-95"
          >
            {isRunningTests ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunningTests ? 'Đang Chạy Toàn Bộ Test...' : 'Chạy Toàn Bộ Test Suites'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout (< 1024px stack 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: LIVE INTERACTIVE DOM SIMULATOR (5 COLS)     */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Simulator Toolbar */}
          <div className={`w-full border rounded-2xl p-3 mb-3 shadow-sm ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-[#1E293B]'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-500" />
                <span>Trình Giả Lập DOM Thực Tế</span>
              </span>

              {/* Viewport Width Controls */}
              <div className="flex items-center gap-1">
                {(['430px', '390px', '375px'] as const).map(vp => (
                  <button
                    key={vp}
                    type="button"
                    onClick={() => setActiveViewport(vp)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                      activeViewport === vp
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {vp}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Tabs Inside Simulator */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'pipeline', label: '1. Pipeline' },
                { id: 'matrix', label: '2. 13 Agents' },
                { id: 'arena', label: '3. Solo 1v1' },
                { id: 'hired', label: '4. Skills' },
              ].map(screen => (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => setDomState(prev => ({ ...prev, activeScreen: screen.id as any }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
                    domState.activeScreen === screen.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300'
                  }`}
                >
                  {screen.label}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic iPhone Frame with Dynamic Rendered App */}
          <div 
            className="w-full max-w-[430px] bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl p-3 relative overflow-hidden ring-1 ring-white/10 select-none transition-all duration-300"
            style={{ 
              height: '640px',
              maxWidth: activeViewport === '375px' ? '375px' : activeViewport === '390px' ? '390px' : '430px'
            }}
          >
            {/* Dynamic Island Notch */}
            <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2 cursor-pointer" onClick={() => showToast('Dynamic Island: All 13 Agents Active')}>
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900/60 animate-pulse" />
            </div>

            {/* Mobile Screen Header */}
            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold">iPhone 14 Pro Max ({activeViewport})</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live DOM
              </span>
            </div>

            {/* Toast inside Simulator */}
            {simToast && (
              <div className="absolute top-12 left-6 right-6 z-50 bg-blue-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xl text-center animate-bounce">
                {simToast}
              </div>
            )}

            {/* LIVE INTERACTIVE RENDERED DOM CONTENT */}
            <div className={`overflow-y-auto space-y-3 h-[525px] p-2 rounded-2xl scrollbar-none transition-colors duration-300 text-xs relative ${
              domState.theme === 'light' ? 'bg-[#FAF8F5] text-slate-800' : 'bg-[#090E1A] text-slate-100'
            }`}>
              
              {/* DOM Inspector Overlay Badges */}
              {isInspectorMode && (
                <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[10px] space-y-1">
                  <div>📐 Viewport: <strong>{activeViewport}</strong></div>
                  <div>🎯 Touch Target: <strong>{domState.touchTargetHeight}px</strong> (Standard: &gt;= 38px)</div>
                  <div>🎨 Button Radius: <strong>{domState.borderRadius}</strong> | Theme: <strong>{domState.theme}</strong></div>
                </div>
              )}

              {/* Banner Area */}
              <div className={`p-3 rounded-xl border shadow-xs transition ${
                domState.theme === 'light' ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[11.5px] text-blue-600 dark:text-cyan-400">
                    {domState.bannerText}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    100% OK
                  </span>
                </div>
                <p className="text-[10.5px] opacity-75 leading-relaxed">
                  Trực quan hóa quy trình tự động hóa với 13 AI Subagents & 8 khâu DevOps Pipeline.
                </p>
              </div>

              {/* RBAC Banner if toggled */}
              {domState.showRbacGuard && (
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span><strong>RBAC Active:</strong> Chế độ bảo mật CEO / Trưởng phòng đang kích hoạt.</span>
                </div>
              )}

              {/* Screen 1: Pipeline */}
              {domState.activeScreen === 'pipeline' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold opacity-80">
                    <span>8 Khâu DevOps Pipeline</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">8/8 Passed</span>
                  </div>

                  {[
                    { step: 1, name: 'Workspace Local', agent: 'Developer' },
                    { step: 2, name: 'GitHub Push & Webhook', agent: 'GitHub' },
                    { step: 3, name: 'Jenkins CI Build', agent: 'Jenkins' },
                    { step: 4, name: 'OWASP Security Scan', agent: 'OWASP' },
                    { step: 5, name: 'SonarQube Grade A', agent: 'SonarQube' },
                    { step: 6, name: 'Trivy Secret Scanner', agent: 'Trivy' },
                    { step: 7, name: 'Docker BuildKit Push', agent: 'Docker' },
                    { step: 8, name: 'ArgoCD & Kubernetes', agent: 'ArgoCD' },
                  ].map(item => (
                    <div 
                      key={item.step} 
                      onClick={() => showToast(`Click khâu #${item.step}: ${item.name}`)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                        domState.theme === 'light' 
                          ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' 
                          : 'bg-[#111827] hover:bg-slate-800 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 font-bold text-[10px] flex items-center justify-center font-mono">
                          {item.step}
                        </span>
                        <div>
                          <div className="font-bold text-[11px]">{item.name}</div>
                          <div className="text-[9.5px] opacity-60 font-mono">{item.agent}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500/20">
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Screen 2: 13 Agents */}
              {domState.activeScreen === 'matrix' && (
                <div className="space-y-2">
                  <span className="font-bold text-[11px] opacity-80 block">Danh Sách 13 Subagents (1 Column Stack)</span>
                  {['Supreme NLP Leader', 'Mobile UX Architect', 'DevOps Parity Officer', 'QA Testing Subagent', 'Backend Guard'].map((name, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${
                      domState.theme === 'light' ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px]">{name}</span>
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">RUNNING 24/7</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${80 + i * 4}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Screen 3: Arena */}
              {domState.activeScreen === 'arena' && (
                <div className={`p-4 rounded-2xl border text-center space-y-3 ${
                  domState.theme === 'light' ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-slate-800'
                }`}>
                  <div className="font-bold text-xs text-purple-600 dark:text-purple-400">Đấu Trường Solo 1v1</div>
                  <div className="flex items-center justify-around font-bold text-xs">
                    <span className="text-cyan-600 dark:text-cyan-400">browser-use (96)</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 text-[10px]">VS</span>
                    <span className="text-blue-600 dark:text-blue-400">Mobile Architect (92)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Đã kích hoạt Solo Battle trong Simulator!')}
                    className={`w-full py-2 ${getBtnBgClass()} ${getRadiusClass()} font-bold text-xs shadow-md transition`}
                  >
                    Bắt Đầu Trận Đấu
                  </button>
                </div>
              )}

              {/* Screen 4: Hired */}
              {domState.activeScreen === 'hired' && (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                    <div className="font-bold text-xs">browser-use Browser Automation</div>
                    <div className="text-[10px] opacity-80 mt-0.5">Kỹ năng đã duyệt tuyển mộ vào Squad</div>
                  </div>
                </div>
              )}

              {/* Simulated Interactive Action Buttons */}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => showToast('Kích hoạt chạy Pipeline từ Simulator!')}
                  className={`flex-1 flex items-center justify-center gap-1.5 ${getBtnBgClass()} ${getRadiusClass()} font-bold text-xs shadow-md transition cursor-pointer active:scale-95`}
                  style={{ height: `${domState.touchTargetHeight}px` }}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Kích Hoạt Pipeline</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Giao việc tự động cho Agent')}
                  className={`px-3 ${getRadiusClass()} border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer`}
                  style={{ height: `${domState.touchTargetHeight}px` }}
                >
                  Giao Việc
                </button>
              </div>

            </div>

            {/* Home Indicator Bar */}
            <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: AI QA COPILOT & PROMPT FIX CONSOLE (7 COLS) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* AI QA PROMPT & LIVE DOM FIX CONSOLE */}
          <div className={`border rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-[#1E293B]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    AI QA Prompt & Trình Sửa DOM Giả Lập Trực Tiếp
                  </h3>
                  <p className="text-[11.5px] text-slate-400">
                    Nhập câu lệnh để AI phân tích và sửa trực tiếp giao diện trên Simulator bên trái!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDomState(INITIAL_DOM_STATE)}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
                title="Khôi phục trạng thái DOM ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset DOM</span>
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Gợi Ý Lệnh Fix Nhanh:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: '✨ Nút Màu Xanh Lục', prompt: 'Đổi nút bấm thành màu xanh lục' },
                  { label: '📱 Touch Target 44px', prompt: 'Tối ưu touch target chuẩn 44px' },
                  { label: '🌙 Giao Diện Nền Tối', prompt: 'Chuyển sang giao diện nền tối' },
                  { label: '☀️ Giao Diện Nền Sáng', prompt: 'Chuyển sang giao diện nền sáng' },
                  { label: '🛡️ Bật RBAC CEO Guard', prompt: 'Bật kiểm soát phân quyền RBAC CEO' },
                  { label: '🔘 Bo Tròn Nút Bấm', prompt: 'Bo tròn toàn bộ góc nút bấm' },
                ].map(chip => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleApplyQAPrompt(chip.prompt)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-semibold transition border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyQAPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={qaPrompt}
                onChange={(e) => setQaPrompt(e.target.value)}
                placeholder="Ví dụ: Đổi màu nút sang xanh, tăng touch target 44px, đổi theme tối..."
                disabled={isFixing}
                className={`flex-1 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border focus:outline-none transition ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-800 focus:border-blue-500'
                    : 'bg-[#090E1A] border-slate-700 text-slate-100 focus:border-cyan-400'
                }`}
              />

              <button
                type="submit"
                disabled={!qaPrompt.trim() || isFixing}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer ${
                  qaPrompt.trim() && !isFixing
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isFixing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wrench className="w-3.5 h-3.5" />}
                <span>{isFixing ? 'Đang Fix...' : 'Fix DOM'}</span>
              </button>
            </form>

            {/* Live Patch Logs Stream */}
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                Nhật Ký Fix DOM Trực Tiếp:
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                {fixLogs.map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-start gap-2">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600 dark:text-cyan-400">Lệnh: "{log.prompt}"</span>
                        <span className="text-[10px] text-slate-500">{log.timestamp} • {log.subagent}</span>
                      </div>
                      <div className="text-[11px] opacity-80">{log.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Test Suites Filter & List */}
          <div className={`border rounded-2xl p-4 shadow-lg space-y-3 ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-[#1E293B]'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Kết Quả Kiểm Thử Tự Động (Playwright & RBAC):
              </span>

              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {['ALL', 'VISUAL_PIXEL_430PX', 'INTEGRATION', 'UNIT'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterTestType(type)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                      filterTestType === type
                        ? 'bg-purple-600 text-white border-purple-400'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Cards */}
            <div className="space-y-2">
              {filteredTests.map((test) => (
                <div 
                  key={test.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0B0F19] border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs">{test.name}</span>
                        <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 opacity-80">
                          {test.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {test.details || 'Kiểm thử đạt chuẩn 100% không phát hiện lỗi.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {test.status}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {test.durationMs}ms
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bug Reporter Form */}
          <div className={`border rounded-2xl p-4 shadow-lg ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#111827] border-[#1E293B]'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Bug className="w-4 h-4 text-rose-500" />
              <h4 className="font-bold text-xs sm:text-sm">
                Báo Cáo Sự Cố & Ủy Thác Sửa Lỗi Cho Subagent
              </h4>
            </div>

            <form onSubmit={handleReportBug} className="space-y-3">
              <textarea
                value={bugDescription}
                onChange={(e) => setBugDescription(e.target.value)}
                placeholder="Mô tả lỗi UI, lệch pixel 430px, vỡ responsive, hoặc sai RBAC guard..."
                rows={2}
                className={`w-full text-xs p-3 rounded-xl border focus:outline-none transition ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-800 focus:border-rose-500'
                    : 'bg-[#090E1A] border-slate-700 text-slate-100 focus:border-rose-400'
                }`}
              />

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Ủy thác khắc phục:</span>
                  <select
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none ${
                      isLight ? 'bg-white border-[#E2DDD5]' : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    <option value="AGENT-05">AGENT-05 (DevOps Parity Officer)</option>
                    <option value="AGENT-02">AGENT-02 (Mobile UX Architect)</option>
                    <option value="AGENT-03">AGENT-03 (QA Testing Subagent)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!bugDescription.trim() || bugSubmitted}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                    bugDescription.trim() && !bugSubmitted
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-500/20 cursor-pointer active:scale-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{bugSubmitted ? 'Đã Gửi Báo Cáo' : 'Gửi Báo Cáo Sự Cố'}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
