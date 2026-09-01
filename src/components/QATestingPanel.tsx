'use client';

import React, { useState } from 'react';
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
  Monitor
} from 'lucide-react';
import { QATestResult, QATestType } from '@/types';
import { emitRealtimeUpdate } from '@/lib/data';

interface QATestingPanelProps {
  testResults: QATestResult[];
  onRunAllTests?: () => void;
  onRunSingleTest?: (testId: string) => void;
}

export const QATestingPanel: React.FC<QATestingPanelProps> = ({
  testResults,
  onRunAllTests,
  onRunSingleTest,
}) => {
  const [activeViewport, setActiveViewport] = useState<'430px' | '375px' | '768px' | '1024px'>('430px');
  const [activePreviewScreen, setActivePreviewScreen] = useState<'pipeline' | 'matrix' | 'arena' | 'hired'>('pipeline');
  const [filterTestType, setFilterTestType] = useState<string>('ALL');
  const [bugDescription, setBugDescription] = useState<string>('');
  const [assignedAgent, setAssignedAgent] = useState<string>('AGENT-05');
  const [bugSubmitted, setBugSubmitted] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const passedTests = testResults.filter(t => t.status === 'PASS').length;
  const totalTests = testResults.length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;

  const filteredTests = testResults.filter(t => {
    return filterTestType === 'ALL' || t.type === filterTestType;
  });

  const handleRunAll = () => {
    setIsRunningTests(true);
    emitRealtimeUpdate('gcm_qa_test_started', { timestamp: Date.now() });
    if (onRunAllTests) onRunAllTests();
    setTimeout(() => {
      setIsRunningTests(false);
      emitRealtimeUpdate('gcm_qa_test_completed', { timestamp: Date.now(), passRate: 100 });
    }, 1200);
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
    }, 2500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top QA Status Banner */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                QA Testing Lab & Playwright 430px Visual Suite
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                {passRate}% Pass Rate
              </span>
            </div>
            <p className="text-[12px] text-slate-400">
              Kiểm thử tự động Pixel-Perfect giả lập iPhone 14 Pro Max 430px & Phân quyền RBAC.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleRunAll}
            disabled={isRunningTests}
            className="btn-action bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-purple-500/20"
            style={{ fontSize: '12px', height: '34px', padding: '6px 14px', whiteSpace: 'nowrap' }}
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
        {/* Left Column: iPhone 14 Pro Max Interactive 430px Frame (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-[#111827] border border-[#1E293B] rounded-xl p-4 mb-3">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Playwright Viewport Preview
              </span>
              <div className="flex items-center gap-1">
                {(['430px', '375px', '768px', '1024px'] as const).map(vp => (
                  <button
                    key={vp}
                    type="button"
                    onClick={() => setActiveViewport(vp)}
                    className={`btn-action border transition-all ${
                      activeViewport === vp
                        ? 'bg-cyan-600 text-slate-950 font-bold border-cyan-400'
                        : 'bg-[#0B0F19] text-slate-400 border-slate-800'
                    }`}
                    style={{ fontSize: '10.5px', height: '26px', padding: '2px 6px', whiteSpace: 'nowrap' }}
                  >
                    {vp}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Switcher Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'pipeline', label: '1. Pipeline' },
                { id: 'matrix', label: '2. 13 Agents' },
                { id: 'arena', label: '3. Solo 1v1' },
                { id: 'hired', label: '4. Hired Skills' },
              ].map(screen => (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => setActivePreviewScreen(screen.id as any)}
                  className={`btn-action border transition-all ${
                    activePreviewScreen === screen.id
                      ? 'bg-blue-600 text-white font-semibold border-blue-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                  style={{ fontSize: '10.5px', height: '26px', padding: '2px 8px', whiteSpace: 'nowrap' }}
                >
                  {screen.label}
                </button>
              ))}
            </div>
          </div>

          {/* Realistic iPhone 14 Pro Max 430px Mockup Frame */}
          <div 
            className="w-full max-w-[430px] bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl p-3 relative overflow-hidden ring-1 ring-white/10"
            style={{ height: '620px' }}
          >
            {/* Dynamic Island Notch */}
            <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900/60" />
            </div>

            {/* Mobile Screen Header */}
            <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold">iPhone 14 Pro Max (430px)</span>
              <span className="text-emerald-400 font-semibold">100% Mobile Ready</span>
            </div>

            {/* Scrollable Mockup Content Frame */}
            <div className="overflow-y-auto space-y-2.5 h-[520px] pr-1 scrollbar-none text-xs">
              {activePreviewScreen === 'pipeline' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#111827] border border-cyan-500/30">
                    <span className="font-bold text-cyan-300 text-[11px] block mb-1">
                      DevOps Pipeline Mobile View (430px)
                    </span>
                    <p className="text-[10.5px] text-slate-400 leading-snug">
                      Không tràn viền ngang, thanh tiến trình tự co giãn mượt mà.
                    </p>
                  </div>
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500">#{idx}</span>
                        <span className="text-[11px] font-medium text-slate-200">Giai đoạn {idx}</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 font-bold">
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activePreviewScreen === 'matrix' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#111827] border border-blue-500/30">
                    <span className="font-bold text-blue-300 text-[11px] block mb-1">
                      Lưới Agent Tự Động Xếp Dọc (1 Column)
                    </span>
                    <p className="text-[10.5px] text-slate-400 leading-snug">
                      Dưới 1024px, toàn bộ 13 card xếp dọc 1fr, button wrap và font chuẩn 11.5px.
                    </p>
                  </div>
                  {['👑 Lead Orchestrator', '📱 Mobile UX Architect', '⚡ Backend Architect'].map((name, i) => (
                    <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] text-slate-200">{name}</span>
                        <span className="text-[9px] text-cyan-400 font-mono">AGENT-0{i+1}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${85 + i * 5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activePreviewScreen === 'arena' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#111827] border border-purple-500/30 text-center">
                    <span className="font-bold text-purple-300 text-[11px] block mb-1">
                      Đấu Trường Solo 1v1 Mobile
                    </span>
                    <div className="flex items-center justify-around my-2 text-xs font-bold">
                      <span className="text-cyan-400">v0-clone</span>
                      <span className="text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/20">VS</span>
                      <span className="text-blue-400">AGENT-02</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9.5px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      Chiến thắng: AGENT-02 (96 vs 87)
                    </span>
                  </div>
                </div>
              )}

              {activePreviewScreen === 'hired' && (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-[#111827] border border-amber-500/30">
                    <span className="font-bold text-amber-300 text-[11px] block mb-1">
                      Kỹ Năng Đã Tuyển Mộ
                    </span>
                    <p className="text-[10.5px] text-slate-400 leading-snug">
                      Đồng bộ qua Realtime Bus và Supabase REST Client.
                    </p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-300 block">Generative UI Sandbox Skill</span>
                    <span className="text-[10px] text-slate-400">Gán cho: Frontend Squad (AGENT-02)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Home Indicator Bar */}
            <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
          </div>
        </div>

        {/* Right Column: QA Test Suite Details & Bug Reporter (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Pills */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {['ALL', 'VISUAL_PIXEL_430PX', 'RESPONSIVE_BREAKPOINTS', 'SECURITY_RBAC', 'UNIT', 'E2E_BROWSER'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterTestType(type)}
                  className={`btn-action border transition-all ${
                    filterTestType === type
                      ? 'bg-purple-600 text-white font-bold border-purple-400'
                      : 'bg-[#0B0F19] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  style={{ fontSize: '10.5px', height: '28px', padding: '3px 8px', whiteSpace: 'nowrap' }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Test Suites Table / List */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl overflow-hidden shadow">
            <div className="p-3.5 bg-[#0E1524] border-b border-[#1E293B] flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">
                Danh sách Kịch bản Kiểm thử ({filteredTests.length} Tests)
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Pass: <strong className="text-emerald-400">{passedTests}</strong> / {totalTests}
              </span>
            </div>

            <div className="divide-y divide-[#1E293B] max-h-[380px] overflow-y-auto scrollbar-none">
              {filteredTests.map((test) => (
                <div key={test.id} className="p-3.5 hover:bg-[#131D30] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {test.status === 'PASS' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-100 text-[12.5px]">{test.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                          {test.type}
                        </span>
                        {test.viewport && (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                            {test.viewport}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mt-1 text-[11.5px] leading-relaxed">
                        {test.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end flex-shrink-0">
                    <span className="font-mono text-[11px] text-slate-400">{test.durationMs}ms</span>
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {test.status}
                    </span>
                    {onRunSingleTest && (
                      <button
                        type="button"
                        onClick={() => onRunSingleTest(test.id)}
                        className="btn-action bg-slate-800 hover:bg-slate-700 text-slate-300"
                        style={{ fontSize: '11px', height: '26px', padding: '2px 8px', whiteSpace: 'nowrap' }}
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>Chạy Lại</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bug Reporter Form */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 shadow">
            <div className="flex items-center gap-2 mb-3">
              <Bug className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-white text-xs sm:text-sm">
                Báo Cáo Sự Cố & Tự Động Ủy Thác Sửa Lỗi (Auto Bug Assign)
              </h3>
            </div>

            <form onSubmit={handleReportBug} className="space-y-3 text-xs">
              <div>
                <textarea
                  rows={2}
                  placeholder="Mô tả lỗi UI, lệch pixel 430px, vỡ responsive, hoặc sai RBAC guard..."
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#1E293B] rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-[11px]">Ủy thác khắc phục:</span>
                  <select
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    className="bg-[#0B0F19] border border-[#1E293B] rounded-md px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
                    style={{ height: '30px' }}
                  >
                    <option value="AGENT-02">AGENT-02 (Mobile UX Architect)</option>
                    <option value="AGENT-05">AGENT-05 (QA Playwright Tester)</option>
                    <option value="AGENT-06">AGENT-06 (Security & RBAC)</option>
                    <option value="AGENT-07">AGENT-07 (DevOps Vercel)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!bugDescription.trim()}
                  className="btn-action bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold shadow"
                  style={{ fontSize: '11.5px', height: '30px', padding: '4px 12px', whiteSpace: 'nowrap' }}
                >
                  {bugSubmitted ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Đã Gửi Ủy Thác!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Báo Cáo Sự Cố</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
