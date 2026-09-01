'use client';

import React from 'react';
import { PromptScenario, DecomposedTask, PROMPT_SCENARIOS } from '@/lib/orchestrator-engine';
import { 
  Send, 
  Sparkles, 
  Bot, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Activity, 
  Clock, 
  RotateCcw,
  Zap,
  Terminal
} from 'lucide-react';

interface PromptDispatcherProps {
  currentScenario: PromptScenario;
  onSelectScenario: (scenario: PromptScenario) => void;
  customPromptText: string;
  onChangePromptText: (text: string) => void;
  onDispatchPrompt: () => void;
  isDispatching: boolean;
  activeTaskId?: string;
  tasks: DecomposedTask[];
  onReset: () => void;
}

export const PromptDispatcher: React.FC<PromptDispatcherProps> = ({
  currentScenario,
  onSelectScenario,
  customPromptText,
  onChangePromptText,
  onDispatchPrompt,
  isDispatching,
  activeTaskId,
  tasks,
  onReset
}) => {
  return (
    <div className="w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Antigravity Prompt Dispatcher & Squad Task Decomposition
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LIVE INTERACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Phát hành Prompt ➔ Supreme NLP Leader phân rã task ➔ Điều phối 13 Subagents ➔ Chạy Browser Test UI 430px
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Kịch bản mẫu:
          </span>
          {PROMPT_SCENARIOS.map((sc) => {
            const isSelected = sc.id === currentScenario.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onSelectScenario(sc)}
                className={`btn-action transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                style={{ fontSize: '11.5px', height: '30px', padding: '4px 10px', whiteSpace: 'nowrap' }}
              >
                {sc.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative rounded-xl border border-slate-700/80 bg-[#0B0F19] p-3 sm:p-4 shadow-inner">
        <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Nội dung Prompt Phát Hành Đến Antigravity Engine:
          </span>
          <span className="text-slate-500 font-mono text-[10px]">Natural Language Prompting</span>
        </label>

        <textarea
          rows={3}
          value={customPromptText}
          onChange={(e) => onChangePromptText(e.target.value)}
          placeholder="Nhập prompt bất kỳ (VD: Xây dựng tính năng Báo giá realtime, kiểm thử responsive 430px...)"
          className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none font-sans leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Lead: <strong className="text-slate-200">Supreme NLP Leader</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              Target: <strong className="text-slate-200">Squad 13 Agents</strong>
            </span>
          </div>

          <div className="btn-container">
            <button
              type="button"
              onClick={onReset}
              disabled={isDispatching}
              className="btn-action bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              style={{ fontSize: '11.5px', height: '32px', padding: '6px 12px', whiteSpace: 'nowrap' }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Luồng
            </button>

            <button
              type="button"
              onClick={onDispatchPrompt}
              disabled={isDispatching}
              className={`btn-action font-extrabold text-white shadow-lg shadow-cyan-500/20 transition-all ${
                isDispatching
                  ? 'bg-cyan-600 animate-pulse cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500'
              }`}
              style={{ fontSize: '12px', height: '34px', padding: '6px 16px', whiteSpace: 'nowrap' }}
            >
              {isDispatching ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Đang Phân Rã & Điều Phối Task...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>🚀 Phát Hành Prompt Đến Squad</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Ma Trận Phân Rã & Giao Việc Cho Subagents ({tasks.length} Nhiệm vụ)
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Trạng thái: <strong className="text-cyan-300">{tasks.filter(t => t.status === 'COMPLETED').length}/{tasks.length} Hoàn tất</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
          {tasks.map((task, idx) => {
            const isActive = activeTaskId === task.id || task.status === 'RUNNING';
            const isCompleted = task.status === 'COMPLETED';

            return (
              <div
                key={task.id}
                className={`rounded-xl p-4 border flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? 'bg-[#121E36] border-cyan-400 ring-2 ring-cyan-400/40 shadow-xl shadow-cyan-500/10'
                    : isCompleted
                    ? 'bg-[#0F1C2E] border-emerald-500/40'
                    : 'bg-[#0E1524] border-[#1E293B] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      TASK #{idx + 1}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> ĐÃ XONG
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 animate-pulse">
                        <Activity className="w-3 h-3 animate-spin" /> ĐANG CHẠY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> CHỜ
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 mb-2 leading-snug">
                    {task.title}
                  </h4>

                  <div className="p-2.5 rounded-lg bg-[#080D1A] border border-slate-800 mb-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-base shadow shrink-0">
                      {task.agentAvatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9.5px] font-mono text-cyan-400 block font-bold truncate">
                        {task.agentCode}
                      </span>
                      <span className="text-[11.5px] font-bold text-slate-200 block truncate">
                        {task.agentName}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10.5px] text-slate-400 mb-1 font-mono">
                    <span>Tiến độ Task</span>
                    <span className="font-bold text-cyan-300">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-400'
                          : isActive
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
