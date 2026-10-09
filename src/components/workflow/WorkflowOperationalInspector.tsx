'use client';

import React from 'react';
import { 
  Zap, 
  Settings2, 
  Terminal, 
  Layers, 
  FileCode, 
  ShieldCheck, 
  Eye 
} from 'lucide-react';
import { WorkflowNode } from '@/types/workflow';

interface WorkflowOperationalInspectorProps {
  selectedNode: WorkflowNode | undefined;
  isLight: boolean;
  renderLogo: (logoType: WorkflowNode['logoType'], className?: string, nodeName?: string) => React.ReactNode;
  onOpenNodeConfig: (nodeId: string) => void;
  onExecuteNodeAction: () => void;
  isExecutingNodeAction: boolean;
  onInspectArtifact: (artifactName: string, isInput: boolean) => void;
}

export const WorkflowOperationalInspector: React.FC<WorkflowOperationalInspectorProps> = ({
  selectedNode,
  isLight,
  renderLogo,
  onOpenNodeConfig,
  onExecuteNodeAction,
  isExecutingNodeAction,
  onInspectArtifact
}) => {
  if (!selectedNode) return null;

  return (
    <div className={`w-full rounded-3xl p-6 shadow-xl space-y-5 border transition ${
      isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#090E1A] border-[#1E293B]'
    }`}>
      {/* Node Header & Action Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-[#E2DDD5]' : 'border-[#1E293B]'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border ${
            isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/90 border-slate-700'
          }`}>
            {renderLogo(selectedNode.logoType, 'w-8 h-8', selectedNode.name)}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {selectedNode.details.title}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
              }`}>
                {selectedNode.statusText}
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {selectedNode.details.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onOpenNodeConfig(selectedNode.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              isLight 
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
            title="Mở bảng cấu hình kết nối bên thứ 3 và Live Ping"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Cấu Hình & Live Ping</span>
          </button>

          {selectedNode.actionLabel && (
            <button
              type="button"
              onClick={onExecuteNodeAction}
              disabled={isExecutingNodeAction}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/40 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 text-yellow-300 ${isExecutingNodeAction ? 'animate-spin' : ''}`} />
              <span>{isExecutingNodeAction ? 'Đang thực thi...' : selectedNode.actionLabel}</span>
            </button>
          )}

          {selectedNode.metrics && Object.entries(selectedNode.metrics).map(([k, v]) => (
            <div key={k} className={`p-1.5 px-2.5 rounded-lg border font-mono text-xs ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0F172A] border-slate-800'
            }`}>
              <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{k}</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{v}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Logs & Artifacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#060911] border-slate-800'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider block flex items-center gap-1.5 ${
            isLight ? 'text-blue-700' : 'text-slate-400'
          }`}>
            <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            Live Execution Logs:
          </span>
          <div className={`space-y-1 text-[11.5px] leading-relaxed max-h-40 overflow-y-auto pr-1 ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}>
            {selectedNode.logs.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-2xl border space-y-3 ${
          isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#060911] border-slate-800'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider block flex items-center gap-1.5 ${
            isLight ? 'text-purple-700' : 'text-slate-400'
          }`}>
            <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Input / Output Artifacts:
          </span>

          {selectedNode.details.inputArtifact && (
            <div
              onClick={() => onInspectArtifact(selectedNode.details.inputArtifact!, true)}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                isLight 
                  ? 'bg-white border-[#E2DDD5] hover:border-blue-500'
                  : 'bg-[#0B101E] border-slate-700/80 hover:border-cyan-500/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCode className={`w-4 h-4 transition ${isLight ? 'text-slate-500 group-hover:text-blue-600' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                <div>
                  <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Input Payload</span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{selectedNode.details.inputArtifact}</span>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition border ${
                isLight 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100'
                  : 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-900'
              }`}>
                <Eye className="w-3 h-3" />
                <span>Xem</span>
              </span>
            </div>
          )}

          {selectedNode.details.outputArtifact && (
            <div
              onClick={() => onInspectArtifact(selectedNode.details.outputArtifact!, false)}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between group shadow-xs ${
                isLight 
                  ? 'bg-white border-emerald-300 hover:border-emerald-500'
                  : 'bg-[#0B101E] border-emerald-900/60 hover:border-emerald-500/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
                <div>
                  <span className={`text-[10px] block uppercase font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-500'}`}>Output Artifact</span>
                  <span className={`text-xs font-semibold ${isLight ? 'text-emerald-900' : 'text-emerald-300'}`}>{selectedNode.details.outputArtifact}</span>
                </div>
              </div>
              <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg transition border ${
                isLight 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 group-hover:bg-emerald-100'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 group-hover:bg-emerald-900'
              }`}>
                <Eye className="w-3 h-3" />
                <span>Xem & Tải</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
