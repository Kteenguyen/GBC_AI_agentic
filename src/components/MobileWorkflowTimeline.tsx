'use client';

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Layers
} from 'lucide-react';
import { WorkflowNode } from '@/app/page';

interface MobileWorkflowTimelineProps {
  nodes: WorkflowNode[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  renderLogo: (type: any, size?: string) => React.ReactNode;
  theme?: 'light' | 'dark';
}

export const MobileWorkflowTimeline: React.FC<MobileWorkflowTimelineProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  renderLogo,
  theme = 'light'
}) => {
  const isLight = theme === 'light';

  return (
    <div className="md:hidden space-y-3 pb-2 font-sans">
      <div className={`p-3 rounded-2xl border flex items-center justify-between shadow-xs ${
        isLight ? 'bg-white border-[#E2DDD5] text-slate-800' : 'bg-[#0B0F19] border-slate-800 text-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs">Tiến Trình Pipeline 8 Bước</h3>
            <p className="text-[10px] opacity-70">Chạm vào từng khâu để xem logs & artifacts</p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
          isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
        }`}>
          {nodes.filter(n => n.status === 'SUCCESS').length}/{nodes.length} Đạt
        </span>
      </div>

      {/* Step by Step Vertical List */}
      <div className="space-y-2.5">
        {nodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id;
          const isPass = node.status === 'SUCCESS';
          const isRunning = node.status === 'RUNNING';
          const isFailed = node.status === 'FAILED';

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs active:scale-[0.99] flex items-center justify-between gap-3 ${
                isSelected
                  ? (isLight ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/30' : 'bg-[#0E1B30] border-cyan-400 ring-2 ring-cyan-400/40')
                  : (isLight ? 'bg-white border-[#E2DDD5] hover:border-slate-300' : 'bg-[#0B0F19] border-slate-800 hover:border-slate-700')
              }`}
            >
              {/* Left: Step Index & Official Logo */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-xs ${
                    isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/90 border-slate-700'
                  }`}>
                    {renderLogo(node.logoType, 'w-6 h-6')}
                  </div>
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-slate-800 text-white font-mono text-[9px] font-black flex items-center justify-center border border-white">
                    {index + 1}
                  </span>
                </div>

                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {node.name}
                    </span>
                    <span className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded border ${
                      isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {node.category}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {node.subLabel || node.statusText}
                  </p>
                </div>
              </div>

              {/* Right: Status Pill & Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                {isPass && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>ĐẠT</span>
                  </span>
                )}
                {isRunning && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 animate-pulse">
                    <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                    <span>CHẠY</span>
                  </span>
                )}
                {isFailed && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300">
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    <span>LỖI</span>
                  </span>
                )}
                {!isPass && !isRunning && !isFailed && (
                  <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    CHỜ
                  </span>
                )}

                <ChevronRight className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
