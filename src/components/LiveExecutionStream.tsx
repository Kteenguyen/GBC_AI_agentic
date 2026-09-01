'use client';

import React, { useState } from 'react';
import { DecomposedTask } from '@/lib/orchestrator-engine';
import { 
  Terminal, 
  Brain, 
  Wrench, 
  CheckCircle2, 
  Play, 
  Pause, 
  SkipForward, 
  Gauge, 
  Copy, 
  Check
} from 'lucide-react';

interface LiveExecutionStreamProps {
  activeTask?: DecomposedTask;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  currentCoTIndex: number;
  isAllCompleted: boolean;
}

export const LiveExecutionStream: React.FC<LiveExecutionStreamProps> = ({
  activeTask,
  isPlaying,
  onTogglePlay,
  onStepForward,
  playbackSpeed,
  onChangeSpeed,
  currentCoTIndex,
  isAllCompleted
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            Live CoT Thinking & Tool Execution Stream
            {activeTask && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {activeTask.agentCode}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">
            Theo dõi dòng suy luận nội tâm, tool invocations và lệnh terminal thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
            <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                  playbackSpeed === spd
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onTogglePlay}
            disabled={isAllCompleted}
            className="btn-action bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow"
            style={{ fontSize: '11.5px', height: '30px', padding: '4px 12px', whiteSpace: 'nowrap' }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto Stream</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onStepForward}
            disabled={isAllCompleted || isPlaying}
            className="btn-action bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            style={{ fontSize: '11.5px', height: '30px', padding: '4px 10px', whiteSpace: 'nowrap' }}
            title="Chạy bước tiếp theo"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Next Step</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-purple-500/20 text-purple-200">
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-400 mb-2">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <Brain className="w-3.5 h-3.5" />
              AI Chain of Thought (Suy luận nội tâm):
            </span>
            <span className="text-[10px] text-purple-300 font-mono">
              Live Stream Typing
            </span>
          </div>

          {activeTask && activeTask.cotThinking.length > 0 ? (
            <div className="space-y-1.5 text-[12px] leading-relaxed text-slate-200 font-sans">
              {activeTask.cotThinking.slice(0, currentCoTIndex + 1).map((thought, i) => (
                <div key={i} className="flex items-start gap-2 animate-in fade-in duration-300">
                  <span className="text-purple-400 shrink-0 font-mono">❯</span>
                  <p className="text-slate-300">{thought}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs italic">
              Đang chờ phát hành prompt để kích hoạt suy luận nội tâm của Squad Agents...
            </p>
          )}
        </div>

        {activeTask && activeTask.toolCalls.length > 0 && (
          <div className="p-3.5 rounded-xl bg-[#090D16] border border-cyan-500/30 text-cyan-200 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                Tool Invoked: {activeTask.toolCalls[0].toolName}
              </span>
              <button
                type="button"
                onClick={() => copyText(JSON.stringify(activeTask.toolCalls[0].args, null, 2), 'tool-args')}
                className="text-[10px] hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedId === 'tool-args' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy JSON
              </button>
            </div>

            <pre className="p-2.5 rounded-lg bg-[#050811] border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto">
              {JSON.stringify(activeTask.toolCalls[0].args, null, 2)}
            </pre>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-sans flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{activeTask.toolCalls[0].output}</span>
            </div>
          </div>
        )}

        {activeTask && activeTask.terminalCommands.length > 0 && (
          <div className="p-3 rounded-xl bg-black/80 border border-amber-500/20 text-amber-300">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>$ Terminal Command:</span>
            </div>
            <code className="text-amber-200 text-xs font-mono block">
              {activeTask.terminalCommands.join(' && ')}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
