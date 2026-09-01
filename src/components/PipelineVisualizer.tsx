'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  FileCode, 
  Play, 
  CheckCheck, 
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Cpu,
  Layers,
  Flame
} from 'lucide-react';
import { PipelineStage, PipelineStageStatus } from '@/types';

interface PipelineVisualizerProps {
  stages: PipelineStage[];
  selectedStageId?: string;
  onSelectStage: (stageId: string) => void;
  onRunStage?: (stageId: string) => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  onRunStage,
}) => {
  const getStatusIcon = (status: PipelineStageStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'skipped':
        return <Clock className="w-4 h-4 text-slate-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: PipelineStageStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'running':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 animate-pulse';
      case 'failed':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const totalCount = stages.length;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="w-full bg-[#111827] border border-[#1E293B] rounded-xl p-4 sm:p-5 shadow-xl">
      {/* Header & Metrics Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              DevOps CI/CD 8-Stage Interactive Pipeline
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {completedCount}/{totalCount} Giai đoạn Hoàn tất
            </span>
          </div>
          <p className="text-[12px] text-slate-400 mt-0.5">
            Nhấp vào từng giai đoạn để lọc nhật ký chuyên sâu của Subagent phụ trách.
          </p>
        </div>

        {/* Global Pipeline Progress Bar */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-cyan-300 whitespace-nowrap">
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* 8-Stage Horizontal Interactive Step Bar */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-stretch min-w-[980px] gap-2">
          {stages.map((stage, idx) => {
            const isSelected = selectedStageId === stage.id;
            const isLast = idx === stages.length - 1;

            return (
              <div key={stage.id} className="flex-1 flex items-center min-w-[120px]">
                <div
                  onClick={() => onSelectStage(stage.id)}
                  className={`w-full p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? 'bg-blue-950/60 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                      : stage.status === 'completed'
                      ? 'bg-[#0E1524] border-emerald-500/30 hover:border-emerald-400/60'
                      : stage.status === 'running'
                      ? 'bg-[#0E1B2E] border-cyan-500/50 hover:border-cyan-400'
                      : 'bg-[#0A0E17] border-slate-800 hover:border-slate-700'
                  }`}
                  style={{ minHeight: '110px' }}
                >
                  {/* Top Bar: Order & Status */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[10.5px] font-bold text-slate-400">
                      #{stage.order}
                    </span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(stage.status)}
                    </div>
                  </div>

                  {/* Stage Title */}
                  <div className="my-1">
                    <h4 className="text-[12px] font-bold text-slate-200 line-clamp-2 leading-tight">
                      {stage.name}
                    </h4>
                  </div>

                  {/* Bottom: Agent & Metric */}
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-800/80 text-[10.5px]">
                    <span className="font-mono text-cyan-400 font-semibold truncate max-w-[65px]">
                      {stage.primaryAgentCode}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {stage.durationMs > 0 ? `${(stage.durationMs / 1000).toFixed(1)}s` : '0.0s'}
                    </span>
                  </div>
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="px-1 text-slate-600 flex-shrink-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Drawer / Info Strip */}
      {selectedStageId && (() => {
        const stage = stages.find(s => s.id === selectedStageId);
        if (!stage) return null;

        return (
          <div className="mt-3.5 p-3 rounded-lg bg-[#0B0F19] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start md:items-center gap-3">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-100 text-[13px]">
                    Giai đoạn {stage.order}: {stage.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${getStatusBadge(stage.status)}`}>
                    {stage.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">
                    Agent phụ trách: <strong className="text-cyan-300 font-mono">{stage.primaryAgentCode}</strong>
                  </span>
                </div>
                <p className="text-slate-300 mt-0.5 text-[12px]">{stage.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {stage.outputArtifact && (
                <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded border border-slate-700 text-[11px] text-slate-300">
                  <FileCode className="w-3 h-3 text-cyan-400" />
                  <span className="font-mono">{stage.outputArtifact}</span>
                </div>
              )}
              {stage.testPassRate !== undefined && stage.testPassRate > 0 && (
                <div className="flex items-center gap-1 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30 text-[11px] text-emerald-300 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Pass: {stage.testPassRate}%</span>
                </div>
              )}
              {onRunStage && (
                <button
                  type="button"
                  onClick={() => onRunStage(stage.id)}
                  className="btn-action bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow"
                  style={{
                    fontSize: '11.5px',
                    height: '28px',
                    padding: '4px 10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Chạy Lại Stage</span>
                </button>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
