'use client';

import React from 'react';
import { Layers, Plus, X } from 'lucide-react';
import { WorkflowNode, LocalProject } from '@/types/workflow';
import { WorkflowEdge, WorkflowPort, Point } from '@/types/workflowGraph';
import WorkflowConnectionCanvas from '@/components/WorkflowConnectionCanvas';
import WorkflowNodePortHandle from '@/components/WorkflowNodePortHandle';
import { OfficialToolIcon } from '@/components/BrandLogos';

interface WorkflowCanvasBoardProps {
  theme: 'light' | 'dark';
  isLight: boolean;
  nodes: WorkflowNode[];
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
  selectedProject: LocalProject | null;
  isRunningAll: boolean;
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  workflowEdges: WorkflowEdge[];
  nodePositions: Record<string, { x: number; y: number; width: number; height: number }>;
  activeConnectingPort: { nodeId: string; port: WorkflowPort; startPoint: Point } | null;
  cursorPos: Point | null;
  onRemoveEdge: (edgeId: string) => void;
  onStartConnect: (nodeId: string, port: WorkflowPort, e: React.MouseEvent) => void;
  onFinishConnect: (targetNodeId: string, targetPort: WorkflowPort) => void;
  onMouseMoveCanvas: (e: React.MouseEvent) => void;
  onMouseUpCanvas: () => void;
  renderLogo: (logoType: WorkflowNode['logoType'], className?: string, nodeName?: string) => React.ReactNode;
  getNodeBorder: (nodeId: string, status: WorkflowNode['status']) => string;
  onSwapNodes: (sourceId: string, targetId: string) => void;
  setDraggedNodeId: (id: string | null) => void;
  isOverBox1: boolean;
  setIsOverBox1: (val: boolean) => void;
  isOverBox2: boolean;
  setIsOverBox2: (val: boolean) => void;
  onDropToolOnBox: (boxType: 'CI_BOX' | 'CD_BOX', e: React.DragEvent) => void;
  onRemoveDynamicNode: (id: string) => void;
}

export const WorkflowCanvasBoard: React.FC<WorkflowCanvasBoardProps> = ({
  theme,
  isLight,
  nodes,
  selectedNodeId,
  onSelectNode,
  selectedProject,
  isRunningAll,
  canvasContainerRef,
  workflowEdges,
  nodePositions,
  activeConnectingPort,
  cursorPos,
  onRemoveEdge,
  onStartConnect,
  onFinishConnect,
  onMouseMoveCanvas,
  onMouseUpCanvas,
  renderLogo,
  getNodeBorder,
  onSwapNodes,
  setDraggedNodeId,
  isOverBox1,
  setIsOverBox1,
  isOverBox2,
  setIsOverBox2,
  onDropToolOnBox,
  onRemoveDynamicNode
}) => {
  return (
    <div 
      ref={canvasContainerRef}
      onMouseMove={onMouseMoveCanvas}
      onMouseUp={onMouseUpCanvas}
      className={`hidden md:block w-full rounded-3xl p-6 sm:p-8 shadow-xl overflow-x-auto relative border transition ${
        isLight
          ? 'bg-white border-[#E2DDD5]'
          : 'bg-[#090E1A] border-[#1E293B]'
      }`}
    >
      {/* Interactive Dynamic Bezier SVG Connection Canvas */}
      <WorkflowConnectionCanvas
        containerRef={canvasContainerRef}
        edges={workflowEdges}
        nodePositions={nodePositions}
        activeConnectingPort={activeConnectingPort}
        cursorPos={cursorPos}
        onRemoveEdge={onRemoveEdge}
        isRunningPipeline={isRunningAll}
        theme={theme}
      />

      <div className="min-w-[1150px] space-y-8">
        {/* EXTERNAL LEFT: Developer & GitHub Source */}
        <div className="flex items-center gap-6">
          {/* Developer Node */}
          <div
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/node-id', 'node-dev');
              setDraggedNodeId('node-dev');
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const srcId = e.dataTransfer.getData('text/node-id');
              if (srcId) onSwapNodes(srcId, 'node-dev');
            }}
            data-workflow-node-id="node-dev"
            onClick={() => onSelectNode('node-dev')}
            className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${getNodeBorder('node-dev', nodes.find(n => n.id === 'node-dev')?.status || 'STANDBY')}`}
            style={{ width: '130px', height: '110px' }}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
            }`}>
              {renderLogo('DEV', 'w-6 h-6')}
            </div>
            <span className={`font-bold text-xs text-center truncate max-w-[110px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {selectedProject?.gitUserName || 'Developer'}
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>push code</span>
            <WorkflowNodePortHandle nodeId="node-dev" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
          </div>

          {/* Connecting line */}
          <div className="flex items-center gap-1 text-slate-500">
            <div className={`h-[2px] w-14 relative transition-all ${
              isRunningAll
                ? (isLight ? 'bg-blue-600 shadow-sm shadow-blue-500/50 animate-pulse' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse')
                : (isLight ? 'bg-slate-300' : 'bg-slate-700')
            }`}>
              <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap transition-all ${
                isRunningAll 
                  ? (isLight ? 'text-blue-700 font-bold' : 'text-cyan-400 font-bold') 
                  : (isLight ? 'text-slate-600' : 'text-slate-400')
              }`}>
                push code
              </span>
            </div>
            <span className={`text-xs font-bold transition-all ${isRunningAll ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'}`}>▶</span>
          </div>

          {/* GitHub Source Repo */}
          <div
            draggable={true}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/node-id', 'node-github-src');
              setDraggedNodeId('node-github-src');
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const srcId = e.dataTransfer.getData('text/node-id');
              if (srcId) onSwapNodes(srcId, 'node-github-src');
            }}
            data-workflow-node-id="node-github-src"
            onClick={() => onSelectNode('node-github-src')}
            className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${getNodeBorder('node-github-src', nodes.find(n => n.id === 'node-github-src')?.status || 'STANDBY')}`}
            style={{ width: '140px', height: '110px' }}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
            }`}>
              {renderLogo('GITHUB', 'w-6 h-6')}
            </div>
            <span className={`font-bold text-xs text-center truncate max-w-[120px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {selectedProject?.repoName !== 'Chưa liên kết' ? selectedProject?.repoName : 'GitHub (Source)'}
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>source repo</span>
            <WorkflowNodePortHandle nodeId="node-github-src" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
          </div>
        </div>

        {/* BOX 1: ① JENKINS CI — BUILD & 3 CỔNG BẢO MẬT */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsOverBox1(true);
          }}
          onDragLeave={() => setIsOverBox1(false)}
          onDrop={(e) => onDropToolOnBox('CI_BOX', e)}
          className={`rounded-3xl border-2 border-dashed transition-all duration-200 p-6 relative space-y-6 ${
            isOverBox1
              ? (isLight ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-500/20 scale-[1.005]' : 'border-cyan-400 bg-[#0E1F38] ring-4 ring-cyan-500/20 scale-[1.005]')
              : (isLight ? 'border-[#CBD5E1] bg-[#FAF8F5]/90' : 'border-slate-700/80 bg-[#0A101E]/70')
          }`}
        >
          <div className={`absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full border text-xs font-bold flex items-center gap-2 shadow-xs ${
            isLight 
              ? 'bg-white border-[#E2DDD5] text-blue-700' 
              : 'bg-[#0B0F19] border-slate-700 text-cyan-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            ① KHÂU CI & 3 CỔNG BẢO MẬT (KÉO THẢ VÀO ĐÂY)
          </div>

          {isOverBox1 && (
            <div className={`absolute inset-0 backdrop-blur-xs rounded-3xl border-2 flex flex-col items-center justify-center font-bold text-xs z-30 pointer-events-none ${
              isLight ? 'bg-blue-100/90 border-blue-500 text-blue-900' : 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
            }`}>
              <Layers className="w-8 h-8 text-blue-600 dark:text-cyan-400 mb-2 animate-bounce" />
              <span>Thả vào đây để tích hợp công cụ vào Khâu ① CI & Bảo Mật!</span>
            </div>
          )}

          {/* Top Row in Box 1 */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {/* Jenkins CI */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-jenkins-ci')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-jenkins-ci');
              }}
              data-workflow-node-id="node-jenkins-ci"
              onClick={() => onSelectNode('node-jenkins-ci')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-jenkins-ci', nodes.find(n => n.id === 'node-jenkins-ci')?.status || 'STANDBY')}`}
              style={{ width: '160px', height: '125px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('JENKINS', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Jenkins CI</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {nodes.find(n => n.id === 'node-jenkins-ci')?.statusText}
              </span>
              <WorkflowNodePortHandle nodeId="node-jenkins-ci" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 relative px-2">
              <div className={`h-[2px] w-full relative flex items-center justify-end transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-blue-600 shadow-sm shadow-blue-500/50 animate-pulse' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse') 
                  : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-blue-700 font-bold' : 'text-cyan-400 font-bold') 
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  dependency
                </span>
                <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'}`}>▶</span>
              </div>
            </div>

            {/* OWASP */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-owasp')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-owasp');
              }}
              data-workflow-node-id="node-owasp"
              onClick={() => onSelectNode('node-owasp')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-owasp', nodes.find(n => n.id === 'node-owasp')?.status || 'STANDBY')}`}
              style={{ width: '170px', height: '125px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('OWASP', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>OWASP</span>
              <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>cổng 1</span>
              <WorkflowNodePortHandle nodeId="node-owasp" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 relative px-2">
              <div className={`h-[2px] w-full relative flex items-center justify-end transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-blue-600 shadow-sm shadow-blue-500/50 animate-pulse' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse') 
                  : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9.5px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-blue-700 font-bold' : 'text-cyan-400 font-bold') 
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  quality gate
                </span>
                <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'}`}>▶</span>
              </div>
            </div>

            {/* SonarQube */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-sonarqube')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-sonarqube');
              }}
              data-workflow-node-id="node-sonarqube"
              onClick={() => onSelectNode('node-sonarqube')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-sonarqube', nodes.find(n => n.id === 'node-sonarqube')?.status || 'STANDBY')}`}
              style={{ width: '170px', height: '125px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('SONARQUBE', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>SonarQube</span>
              <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>cổng 2</span>
              <WorkflowNodePortHandle nodeId="node-sonarqube" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>
          </div>

          {/* Bottom Row in Box 1: Docker <- Trivy */}
          <div className="flex items-center justify-end gap-6 pt-1">
            {/* Docker */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-docker')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-docker');
              }}
              data-workflow-node-id="node-docker"
              onClick={() => onSelectNode('node-docker')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-docker', nodes.find(n => n.id === 'node-docker')?.status || 'STANDBY')}`}
              style={{ width: '160px', height: '115px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('DOCKER', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Docker</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {nodes.find(n => n.id === 'node-docker')?.statusText}
              </span>
              <WorkflowNodePortHandle nodeId="node-docker" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'}`}>◀</span>
              <div className={`h-[2px] w-28 relative transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-blue-600 shadow-sm shadow-blue-500/50 animate-pulse' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse') 
                  : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-blue-700 font-bold' : 'text-cyan-400 font-bold') 
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  docker build & push
                </span>
              </div>
            </div>

            {/* Trivy */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-trivy')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-trivy');
              }}
              data-workflow-node-id="node-trivy"
              onClick={() => onSelectNode('node-trivy')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-trivy', nodes.find(n => n.id === 'node-trivy')?.status || 'STANDBY')}`}
              style={{ width: '170px', height: '115px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('TRIVY', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Trivy</span>
              <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>cổng 3</span>
              <WorkflowNodePortHandle nodeId="node-trivy" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>
          </div>

          {/* DYNAMIC DROPPED PLUGINS IN BOX 1 */}
          {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').length > 0 && (
            <div className={`mt-3 pt-3 border-t border-dashed ${isLight ? 'border-blue-200' : 'border-cyan-900/50'}`}>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-blue-600 dark:text-cyan-400">
                <Plus className="w-3.5 h-3.5" />
                <span>Công cụ mở rộng đã tích hợp vào Khâu CI & Bảo Mật ({nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').length}):</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').map(dynNode => (
                  <div
                    key={dynNode.id}
                    onClick={() => onSelectNode(dynNode.id)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                      selectedNodeId === dynNode.id
                        ? (isLight ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/30' : 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/30')
                        : (isLight ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' : 'bg-[#0E1526] hover:bg-slate-800 border-slate-700')
                    }`}
                    style={{ minWidth: '180px' }}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800 border-slate-700'}`}>
                      <OfficialToolIcon toolIdOrName={dynNode.name} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{dynNode.name}</div>
                      <div className="text-[10px] text-emerald-500 font-mono font-bold">{dynNode.statusText}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDynamicNode(dynNode.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
                      title="Gỡ công cụ"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOX 2: ② JENKINS CD — GITOPS DEPLOY & MONITOR */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsOverBox2(true);
          }}
          onDragLeave={() => setIsOverBox2(false)}
          onDrop={(e) => onDropToolOnBox('CD_BOX', e)}
          className={`rounded-3xl border-2 border-dashed transition-all duration-200 p-6 relative space-y-6 ${
            isOverBox2
              ? (isLight ? 'border-purple-500 bg-purple-50/80 ring-4 ring-purple-500/20 scale-[1.005]' : 'border-purple-400 bg-[#1E0F38] ring-4 ring-purple-500/20 scale-[1.005]')
              : (isLight ? 'border-[#CBD5E1] bg-[#FAF8F5]/90' : 'border-slate-700/80 bg-[#0A101E]/70')
          }`}
        >
          <div className={`absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full border text-xs font-bold flex items-center gap-2 shadow-xs ${
            isLight
              ? 'bg-white border-[#E2DDD5] text-purple-700'
              : 'bg-[#0B0F19] border-slate-700 text-purple-300'
          }`}>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            ② KHÂU CD GITOPS & GIÁM SÁT (KÉO THẢ VÀO ĐÂY)
          </div>

          {isOverBox2 && (
            <div className={`absolute inset-0 backdrop-blur-xs rounded-3xl border-2 flex flex-col items-center justify-center font-bold text-xs z-30 pointer-events-none ${
              isLight ? 'bg-purple-100/90 border-purple-500 text-purple-900' : 'bg-purple-950/80 border-purple-400 text-purple-300'
            }`}>
              <Layers className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 animate-bounce" />
              <span>Thả vào đây để tích hợp công cụ vào Khâu ② CD GitOps & Giám Sát!</span>
            </div>
          )}

          {/* Main GitOps Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {/* Jenkins CD */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-jenkins-cd')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-jenkins-cd');
              }}
              data-workflow-node-id="node-jenkins-cd"
              onClick={() => onSelectNode('node-jenkins-cd')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-jenkins-cd', nodes.find(n => n.id === 'node-jenkins-cd')?.status || 'STANDBY')}`}
              style={{ width: '145px', height: '120px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('JENKINS', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Jenkins CD</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {nodes.find(n => n.id === 'node-jenkins-cd')?.statusText}
              </span>
              <WorkflowNodePortHandle nodeId="node-jenkins-cd" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
              <div className={`h-[2px] w-full relative flex items-center justify-end transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-purple-600 shadow-sm shadow-purple-500/50 animate-pulse' : 'bg-purple-400 shadow-sm shadow-purple-400/50 animate-pulse') 
                  : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-purple-700 font-bold' : 'text-purple-400 font-bold') 
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  update image
                </span>
                <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-purple-600' : 'text-purple-400') : 'text-slate-400'}`}>▶</span>
              </div>
            </div>

            {/* GitHub config repo */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-github-config')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-github-config');
              }}
              data-workflow-node-id="node-github-config"
              onClick={() => onSelectNode('node-github-config')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-github-config', nodes.find(n => n.id === 'node-github-config')?.status || 'STANDBY')}`}
              style={{ width: '145px', height: '120px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('GITHUB', 'w-6 h-6')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>GitHub</span>
              <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>config repo</span>
              <WorkflowNodePortHandle nodeId="node-github-config" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
              <div className={`h-[2px] w-full relative flex items-center justify-end transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-purple-600 shadow-sm shadow-purple-500/50 animate-pulse' : 'bg-purple-400 shadow-sm shadow-purple-400/50 animate-pulse') 
                  : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-purple-700 font-bold' : 'text-purple-400 font-bold') 
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  pull config
                </span>
                <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-purple-600' : 'text-purple-400') : 'text-slate-400'}`}>▶</span>
              </div>
            </div>

            {/* ArgoCD */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-argocd')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-argocd');
              }}
              data-workflow-node-id="node-argocd"
              onClick={() => onSelectNode('node-argocd')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-argocd', nodes.find(n => n.id === 'node-argocd')?.status || 'STANDBY')}`}
              style={{ width: '145px', height: '120px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('ARGOCD', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>ArgoCD</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {nodes.find(n => n.id === 'node-argocd')?.statusText}
              </span>
              <WorkflowNodePortHandle nodeId="node-argocd" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
              <div className={`h-[2px] w-full relative flex items-center justify-end transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-blue-600 shadow-sm shadow-blue-500/50 animate-pulse' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse') 
                  : (isLight ? 'bg-slate-300' : 'bg-slate-700')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-blue-700 font-bold' : 'text-cyan-400 font-bold') 
                    : (isLight ? 'text-slate-600' : 'text-slate-400')
                }`}>
                  deploy on k8s
                </span>
                <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'}`}>▶</span>
              </div>
            </div>

            {/* Kubernetes */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-k8s')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-k8s');
              }}
              data-workflow-node-id="node-k8s"
              onClick={() => onSelectNode('node-k8s')}
              className={`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-k8s', nodes.find(n => n.id === 'node-k8s')?.status || 'STANDBY')}`}
              style={{ width: '145px', height: '120px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('KUBERNETES', 'w-7 h-7')}
              </div>
              <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Kubernetes</span>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {nodes.find(n => n.id === 'node-k8s')?.statusText}
              </span>
              <WorkflowNodePortHandle nodeId="node-k8s" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 relative px-1">
              <div className={`h-[2px] w-full relative flex items-center justify-end transition-all ${
                isRunningAll 
                  ? (isLight ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse') 
                  : (isLight ? 'bg-emerald-300' : 'bg-emerald-700/60')
              }`}>
                <span className={`absolute -top-4 left-1/2 -translate-x-1/2 text-[8.5px] font-mono whitespace-nowrap transition-all ${
                  isRunningAll 
                    ? (isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold') 
                    : (isLight ? 'text-emerald-700' : 'text-emerald-400')
                }`}>
                  truy cập
                </span>
                <span className={`text-xs font-bold ${isRunningAll ? (isLight ? 'text-emerald-600' : 'text-emerald-400') : 'text-slate-400'}`}>▶</span>
              </div>
            </div>

            {/* Live App */}
            <div
              draggable={true}
              onDragStart={(e) => e.dataTransfer.setData('text/node-id', 'node-myapp')}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-myapp');
              }}
              data-workflow-node-id="node-myapp"
              onClick={() => onSelectNode('node-myapp')}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-myapp', nodes.find(n => n.id === 'node-myapp')?.status || 'STANDBY')}`}
              style={{ width: '145px', height: '120px' }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
                isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
              }`}>
                {renderLogo('MYAPP', 'w-7 h-7')}
              </div>
              <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 text-center truncate max-w-[130px]">
                {selectedProject?.name || 'MyApp'}
              </span>
              <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>production</span>
              <WorkflowNodePortHandle nodeId="node-myapp" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
            </div>
          </div>

          {/* DYNAMIC DROPPED PLUGINS IN BOX 2 */}
          {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').length > 0 && (
            <div className={`mt-3 pt-3 border-t border-dashed ${isLight ? 'border-purple-200' : 'border-purple-900/50'}`}>
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                <Plus className="w-3.5 h-3.5" />
                <span>Công cụ mở rộng đã tích hợp vào Khâu CD GitOps & Giám Sát ({nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').length}):</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').map(dynNode => (
                  <div
                    key={dynNode.id}
                    onClick={() => onSelectNode(dynNode.id)}
                    className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                      selectedNodeId === dynNode.id
                        ? (isLight ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-400/30' : 'bg-purple-950/40 border-purple-400 ring-2 ring-purple-400/30')
                        : (isLight ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' : 'bg-[#0E1526] hover:bg-slate-800 border-slate-700')
                    }`}
                    style={{ minWidth: '180px' }}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800 border-slate-700'}`}>
                      <OfficialToolIcon toolIdOrName={dynNode.name} className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{dynNode.name}</div>
                      <div className="text-[10px] text-emerald-500 font-mono font-bold">{dynNode.statusText}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDynamicNode(dynNode.id);
                      }}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition"
                      title="Gỡ công cụ"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM EXTERNAL: Telemetry & Notification Loop */}
        <div className="flex items-center justify-end gap-6 pt-2">
          {/* Prometheus */}
          <div
            data-workflow-node-id="node-prometheus"
            onClick={() => onSelectNode('node-prometheus')}
            className={`group relative p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-prometheus', nodes.find(n => n.id === 'node-prometheus')?.status || 'STANDBY')}`}
            style={{ width: '135px', height: '110px' }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
            }`}>
              {renderLogo('PROMETHEUS', 'w-6 h-6')}
            </div>
            <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Prometheus</span>
            <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>metrics 15s</span>
            <WorkflowNodePortHandle nodeId="node-prometheus" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
          </div>

          {/* Grafana */}
          <div
            data-workflow-node-id="node-grafana"
            onClick={() => onSelectNode('node-grafana')}
            className={`group relative p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-grafana', nodes.find(n => n.id === 'node-grafana')?.status || 'STANDBY')}`}
            style={{ width: '135px', height: '110px' }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
            }`}>
              {renderLogo('GRAFANA', 'w-6 h-6')}
            </div>
            <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Grafana</span>
            <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>dashboard</span>
            <WorkflowNodePortHandle nodeId="node-grafana" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
          </div>

          {/* Gmail Alert */}
          <div
            data-workflow-node-id="node-gmail"
            onClick={() => onSelectNode('node-gmail')}
            className={`group relative p-3.5 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all ${getNodeBorder('node-gmail', nodes.find(n => n.id === 'node-gmail')?.status || 'STANDBY')}`}
            style={{ width: '135px', height: '110px' }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs mb-1 border ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
            }`}>
              {renderLogo('GMAIL', 'w-6 h-6')}
            </div>
            <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Gmail</span>
            <span className={`text-[9.5px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>notify sếp</span>
            <WorkflowNodePortHandle nodeId="node-gmail" onStartConnect={onStartConnect} onFinishConnect={onFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />
          </div>
        </div>

      </div>
    </div>
  );
};
