'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Layers,
  ShieldCheck,
  GitMerge,
  Play,
  SkipForward,
  RotateCcw,
  Sparkles,
  Terminal,
  FileCode,
  Eye,
  Zap,
  X,
  Radio,
  Server,
  Cpu
} from 'lucide-react';
import { WorkflowNode, LocalProject } from '@/types/workflow';

interface MobileWorkflowTimelineProps {
  nodes: WorkflowNode[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  renderLogo: (type: any, size?: string, nodeName?: string) => React.ReactNode;
  theme?: 'light' | 'dark';
  isRunningAll?: boolean;
  onPushCodeRunAll?: () => void;
  onStepForward?: () => void;
  onReset?: () => void;
  onOpenChat?: () => void;
  selectedProject?: LocalProject | null;
  onExecuteNodeAction?: () => void;
  isExecutingNodeAction?: boolean;
}

export const MobileWorkflowTimeline: React.FC<MobileWorkflowTimelineProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  renderLogo,
  theme = 'dark',
  isRunningAll = false,
  onPushCodeRunAll,
  onStepForward,
  onReset,
  onOpenChat,
  selectedProject,
  onExecuteNodeAction,
  isExecutingNodeAction = false
}) => {
  const isLight = theme === 'light';
  const [activeSheetNodeId, setActiveSheetNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find(n => n.id === (activeSheetNodeId || selectedNodeId));
  const successCount = nodes.filter(n => n.status === 'SUCCESS').length;
  const runningCount = nodes.filter(n => n.status === 'RUNNING').length;
  const failedCount = nodes.filter(n => n.status === 'FAILED').length;

  // Split into Stage 1 (CI & Security) and Stage 2 (CD GitOps)
  const ciStageNodeIds = ['node-dev', 'node-github-src', 'node-jenkins-ci', 'node-owasp', 'node-sonarqube', 'node-trivy', 'node-docker'];
  const cdStageNodeIds = ['node-jenkins-cd', 'node-github-config', 'node-argocd', 'node-k8s', 'node-myapp', 'node-prometheus', 'node-grafana', 'node-gmail'];

  const ciNodes = nodes.filter(n => ciStageNodeIds.includes(n.id) || (n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX'));
  const cdNodes = nodes.filter(n => cdStageNodeIds.includes(n.id) || (n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX'));

  const handleCardClick = (nodeId: string) => {
    onSelectNode(nodeId);
    setActiveSheetNodeId(nodeId);
  };

  return (
    <div className="md:hidden w-full space-y-4 font-sans max-w-[430px] mx-auto pb-28">
      
      {/* 1. MANDATORY 2x2 KPI GRID (APPLE WIDGET STYLE - 4 Ô VUÔNG ĐỐI SOÁT) */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {/* Box 1: Pipeline Execution Status */}
        <div className="p-3.5 rounded-2xl border bg-white dark:bg-[#0D1629] border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[88px]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng Thái</span>
            <div className={`w-2.5 h-2.5 rounded-full ${isRunningAll ? 'bg-cyan-400 animate-ping' : failedCount > 0 ? 'bg-rose-500' : successCount === nodes.length && nodes.length > 0 ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 dark:text-white truncate">
              {isRunningAll ? 'Đang Chạy...' : failedCount > 0 ? 'Phát Hiện Lỗi' : successCount > 0 ? `${successCount}/${nodes.length} Đạt` : 'Sẵn Sàng'}
            </div>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
              {isRunningAll ? 'Auto CI/CD Execution' : 'Chờ lệnh đẩy code'}
            </span>
          </div>
        </div>

        {/* Box 2: 3 Security Gates Indicator */}
        <div className="p-3.5 rounded-2xl border bg-white dark:bg-[#0D1629] border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[88px]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">3 Cổng Bảo Mật</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
              3/3 Cổng An Ninh
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              OWASP · Sonar · Trivy
            </span>
          </div>
        </div>

        {/* Box 3: GitOps CD Progress */}
        <div className="p-3.5 rounded-2xl border bg-white dark:bg-[#0D1629] border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[88px]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GitOps Cluster</span>
            <GitMerge className="w-3.5 h-3.5 text-purple-500" />
          </div>
          <div>
            <div className="text-sm font-black text-purple-600 dark:text-purple-400 truncate">
              ArgoCD & K8s
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Sync Manifest Auto
            </span>
          </div>
        </div>

        {/* Box 4: Realtime Event Bus */}
        <div className="p-3.5 rounded-2xl border bg-white dark:bg-[#0D1629] border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[88px]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Realtime Bus</span>
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">
              0ms Synced
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Supabase Realtime
            </span>
          </div>
        </div>
      </div>

      {/* 2. STAGE 1: CI & 3 CỔNG BẢO MẬT (VERTICAL STEPPER FLOW) */}
      <div className="stage-studio-panel stage-ci-container space-y-3 pt-5 pb-4 px-3.5">
        <div className="stage-header-badge stage-header-ci">
          <ShieldCheck className="w-3 h-3 text-cyan-300" />
          <span>KHÂU 1: CI & 3 CỔNG AN NINH</span>
          <span className="stage-meta-pill">3 GATES</span>
        </div>

        <div className="space-y-2 relative">
          {ciNodes.map((node, idx) => {
            const isSelected = selectedNodeId === node.id;
            const isPass = node.status === 'SUCCESS';
            const isRunning = node.status === 'RUNNING';
            const isFail = node.status === 'FAILED';

            return (
              <div
                key={node.id}
                onClick={() => handleCardClick(node.id)}
                className={`w-full min-h-[56px] p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs active:scale-[0.98] ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-[#132442] border-cyan-400 ring-2 ring-cyan-400/40 shadow-md shadow-cyan-400/20'
                    : isRunning
                    ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/50 animate-pulse'
                    : isFail
                    ? 'bg-rose-500/10 border-rose-500 ring-1 ring-rose-500/50'
                    : isPass
                    ? 'bg-white dark:bg-[#0B1322] border-emerald-500/40 hover:border-emerald-500'
                    : 'bg-white dark:bg-[#0B1322] border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Left: Step Index & Logo */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                      {renderLogo(node.logoType, 'w-5 h-5', node.name)}
                    </div>
                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-white/40">
                      {idx + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs truncate text-slate-900 dark:text-white">
                        {node.name}
                      </span>
                      {node.id.includes('owasp') && (
                        <span className="text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          CỔNG 1
                        </span>
                      )}
                      {node.id.includes('sonar') && (
                        <span className="text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          CỔNG 2
                        </span>
                      )}
                      {node.id.includes('trivy') && (
                        <span className="text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          CỔNG 3
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] truncate text-slate-500 dark:text-slate-400">
                      {node.subLabel || node.details.description}
                    </p>
                  </div>
                </div>

                {/* Right: Status LED & Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isRunning 
                      ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 border-cyan-500/30 animate-pulse'
                      : isPass 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                      : isFail 
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}>
                    {isRunning ? 'CHẠY' : isPass ? 'ĐẠT' : isFail ? 'CHẶN' : 'CHỜ'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. STAGE 2: CD GITOPS & KUBERNETES (VERTICAL STEPPER FLOW) */}
      <div className="stage-studio-panel stage-cd-container space-y-3 pt-5 pb-4 px-3.5">
        <div className="stage-header-badge stage-header-cd">
          <GitMerge className="w-3 h-3 text-purple-300" />
          <span>KHÂU 2: CD GITOPS & TRIỂN KHAI</span>
          <span className="stage-meta-pill">K8S CLUSTER</span>
        </div>

        <div className="space-y-2 relative">
          {cdNodes.map((node, idx) => {
            const isSelected = selectedNodeId === node.id;
            const isPass = node.status === 'SUCCESS';
            const isRunning = node.status === 'RUNNING';
            const isFail = node.status === 'FAILED';

            return (
              <div
                key={node.id}
                onClick={() => handleCardClick(node.id)}
                className={`w-full min-h-[56px] p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs active:scale-[0.98] ${
                  isSelected
                    ? 'bg-purple-50/90 dark:bg-[#261542] border-purple-400 ring-2 ring-purple-400/40 shadow-md shadow-purple-400/20'
                    : isRunning
                    ? 'bg-purple-500/10 border-purple-400 ring-1 ring-purple-400/50 animate-pulse'
                    : isFail
                    ? 'bg-rose-500/10 border-rose-500 ring-1 ring-rose-500/50'
                    : isPass
                    ? 'bg-white dark:bg-[#120B22] border-emerald-500/40 hover:border-emerald-500'
                    : 'bg-white dark:bg-[#120B22] border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Left: Step Index & Logo */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                      {renderLogo(node.logoType, 'w-5 h-5', node.name)}
                    </div>
                    <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-slate-900 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-white/40">
                      {ciNodes.length + idx + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-xs truncate text-slate-900 dark:text-white block">
                      {node.name}
                    </span>
                    <p className="text-[10.5px] truncate text-slate-500 dark:text-slate-400">
                      {node.subLabel || node.details.description}
                    </p>
                  </div>
                </div>

                {/* Right: Status LED & Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isRunning 
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30 animate-pulse'
                      : isPass 
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                      : isFail 
                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}>
                    {isRunning ? 'CHẠY' : isPass ? 'ĐẠT' : isFail ? 'LỖI' : 'CHỜ'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MOBILE BOTTOM DRAWER SHEET (CHẠM VÀO NODE ĐỂ XEM CHI TIẾT LOG & ARTIFACT) */}
      {activeSheetNodeId && selectedNode && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-xs p-2 animate-in fade-in duration-200">
          <div className="w-full max-w-[430px] mx-auto bg-white dark:bg-[#0D1629] border border-slate-200 dark:border-slate-700 rounded-3xl p-4 shadow-2xl space-y-4 max-h-[82vh] overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  {renderLogo(selectedNode.logoType, 'w-6 h-6', selectedNode.name)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedNode.details.title || selectedNode.name}
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                    {selectedNode.statusText}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveSheetNodeId(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedNode.details.description}
            </p>

            {/* Metrics Chips */}
            {selectedNode.metrics && Object.keys(selectedNode.metrics).length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedNode.metrics).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">{k}</span>
                    <strong className="text-xs text-emerald-500 font-mono">{v}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* Action Trigger Button */}
            {selectedNode.actionLabel && onExecuteNodeAction && (
              <button
                type="button"
                onClick={() => {
                  onExecuteNodeAction();
                  setActiveSheetNodeId(null);
                }}
                disabled={isExecutingNodeAction}
                className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center gap-2 shadow-md shadow-cyan-600/30"
              >
                <Zap className={`w-3.5 h-3.5 ${isExecutingNodeAction ? 'animate-spin' : ''}`} />
                <span>{isExecutingNodeAction ? 'Đang thực thi...' : selectedNode.actionLabel}</span>
              </button>
            )}

            {/* Live Terminal Logs */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-300 max-h-36 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Live Terminal Log:
              </span>
              {selectedNode.logs.length === 0 ? (
                <p className="text-slate-500 italic">Chưa có log thực thi.</p>
              ) : (
                selectedNode.logs.map((log, i) => (
                  <p key={i} className="leading-snug">{log}</p>
                ))
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveSheetNodeId(null)}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Đóng Bảng Tra Cứu
            </button>
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM THUMB ACTION DOCK (VÙNG NGÓN TAY CÁI BẤM TRỰC TIẾP) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-2.5 bg-white/90 dark:bg-[#080C14]/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="max-w-[430px] mx-auto flex items-center gap-2">
          {/* Main Primary Run Button */}
          <button
            type="button"
            onClick={onPushCodeRunAll}
            disabled={isRunningAll}
            className={`flex-1 h-12 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              isRunningAll
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30 animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-cyan-600/30'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? 'ĐANG CHẠY PIPELINE...' : 'CHẠY FULL PIPELINE'}</span>
          </button>

          {/* Step Forward */}
          {onStepForward && (
            <button
              type="button"
              onClick={onStepForward}
              disabled={isRunningAll}
              className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95"
              title="Từng Bước"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          {/* Reset */}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center active:scale-95"
              title="Đặt Lại"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* AI Prompt */}
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 active:scale-95"
              title="Prompt AI Squad"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
