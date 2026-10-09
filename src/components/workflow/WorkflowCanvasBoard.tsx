'use client';

import React from 'react';
import { Layers, Plus, X, ShieldCheck, GitMerge, Radio, Terminal, Server, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
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

// Reusable Modern Node Card Component
interface CanvasNodeCardProps {
  id: string;
  node: WorkflowNode | undefined;
  defaultTitle: string;
  defaultRole: string;
  sizePreset?: 'standard' | 'compact' | 'wide';
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onClick: () => void;
  isSelected: boolean;
  getNodeBorder: (id: string, status: WorkflowNode['status']) => string;
  renderLogo: (logoType: WorkflowNode['logoType'], className?: string, nodeName?: string) => React.ReactNode;
  onStartConnect: (nodeId: string, port: WorkflowPort, e: React.MouseEvent) => void;
  onFinishConnect: (targetNodeId: string, targetPort: WorkflowPort) => void;
  activeConnectingPort: any;
  theme: 'light' | 'dark';
}

const CanvasNodeCard: React.FC<CanvasNodeCardProps> = ({
  id,
  node,
  defaultTitle,
  defaultRole,
  sizePreset = 'standard',
  isDraggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  onClick,
  isSelected,
  getNodeBorder,
  renderLogo,
  onStartConnect,
  onFinishConnect,
  activeConnectingPort,
  theme
}) => {
  const status = node?.status || 'STANDBY';
  const statusText = node?.statusText || (status === 'RUNNING' ? 'Đang chạy...' : status === 'SUCCESS' ? 'Đạt chuẩn' : status === 'FAILED' ? 'Bị chặn' : 'Chờ lệnh');
  const sizeClass = sizePreset === 'compact' ? 'node-size-compact' : sizePreset === 'wide' ? 'node-size-wide' : 'node-size-standard';
  const borderClass = getNodeBorder(id, status);

  return (
    <div
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-workflow-node-id={id}
      onClick={onClick}
      className={`node-card-base ${sizeClass} ${borderClass}`}
    >
      <WorkflowNodePortHandle
        nodeId={id}
        onStartConnect={onStartConnect}
        onFinishConnect={onFinishConnect}
        isConnecting={!!activeConnectingPort}
        theme={theme}
      />

      <div className="node-icon-holder">
        {renderLogo(node?.logoType || 'DEV', 'w-6 h-6', node?.name)}
      </div>

      <div className="flex flex-col items-center w-full px-1">
        <span className="node-title">
          {node?.name || defaultTitle}
        </span>
        <span className="node-role-chip">
          {defaultRole}
        </span>
      </div>

      <div className={`node-status-indicator ${
        status === 'RUNNING' ? 'status-running' : status === 'SUCCESS' ? 'status-success' : status === 'FAILED' ? 'status-failed' : 'status-standby'
      }`}>
        <span className="status-dot" />
        <span className="truncate max-w-[90px]">{statusText}</span>
      </div>
    </div>
  );
};

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
  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div 
      ref={canvasContainerRef}
      onMouseMove={onMouseMoveCanvas}
      onMouseUp={onMouseUpCanvas}
      className="hidden md:block w-full workflow-canvas-viewport p-6 sm:p-8"
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

      <div className="min-w-[1150px] space-y-10 relative z-10">
        
        {/* EXTERNAL LEFT: Developer & GitHub Source */}
        <div className="flex items-center gap-16 pl-2">
          {/* Developer Node */}
          <CanvasNodeCard
            id="node-dev"
            node={getNode('node-dev')}
            defaultTitle={selectedProject?.gitUserName || 'Developer'}
            defaultRole="Push Code Origin"
            sizePreset="compact"
            isSelected={selectedNodeId === 'node-dev'}
            onClick={() => onSelectNode('node-dev')}
            getNodeBorder={getNodeBorder}
            renderLogo={renderLogo}
            onStartConnect={onStartConnect}
            onFinishConnect={onFinishConnect}
            activeConnectingPort={activeConnectingPort}
            theme={theme}
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
          />

          {/* GitHub Source Repo */}
          <CanvasNodeCard
            id="node-github-src"
            node={getNode('node-github-src')}
            defaultTitle={selectedProject?.repoName !== 'Chưa liên kết' ? (selectedProject?.repoName || 'GitHub Source') : 'GitHub (Source)'}
            defaultRole="Source Repository"
            sizePreset="compact"
            isSelected={selectedNodeId === 'node-github-src'}
            onClick={() => onSelectNode('node-github-src')}
            getNodeBorder={getNodeBorder}
            renderLogo={renderLogo}
            onStartConnect={onStartConnect}
            onFinishConnect={onFinishConnect}
            activeConnectingPort={activeConnectingPort}
            theme={theme}
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
          />
        </div>

        {/* BOX 1: STAGE 1 — CI & 3 CỔNG BẢO MẬT (PREMIUM GLASSMORPHISM CONTAINER) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsOverBox1(true);
          }}
          onDragLeave={() => setIsOverBox1(false)}
          onDrop={(e) => onDropToolOnBox('CI_BOX', e)}
          className={`stage-studio-panel stage-ci-container ${isOverBox1 ? 'is-drag-over' : ''} space-y-6`}
        >
          {/* Stage Header Badge */}
          <div className="stage-header-badge stage-header-ci">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>KHÂU 1: CI & 3 CỔNG BẢO MẬT (OWASP · SONARQUBE · TRIVY)</span>
            <span className="stage-meta-pill">3 GATES ACTIVE</span>
          </div>

          {isOverBox1 && (
            <div className="absolute inset-0 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center font-bold text-xs z-30 pointer-events-none bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300">
              <Layers className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
              <span>Thả vào đây để tích hợp công cụ vào Khâu ① CI & Bảo Mật!</span>
            </div>
          )}

          {/* Top Row: Jenkins CI -> OWASP -> SonarQube */}
          <div className="flex items-center justify-between gap-12 pt-3 px-2">
            <CanvasNodeCard
              id="node-jenkins-ci"
              node={getNode('node-jenkins-ci')}
              defaultTitle="Jenkins CI"
              defaultRole="CI Automation Engine"
              isSelected={selectedNodeId === 'node-jenkins-ci'}
              onClick={() => onSelectNode('node-jenkins-ci')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-jenkins-ci');
                setDraggedNodeId('node-jenkins-ci');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-jenkins-ci');
              }}
            />

            <CanvasNodeCard
              id="node-owasp"
              node={getNode('node-owasp')}
              defaultTitle="OWASP Gate"
              defaultRole="Cổng 1 · Deps Security"
              sizePreset="wide"
              isSelected={selectedNodeId === 'node-owasp'}
              onClick={() => onSelectNode('node-owasp')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-owasp');
                setDraggedNodeId('node-owasp');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-owasp');
              }}
            />

            <CanvasNodeCard
              id="node-sonarqube"
              node={getNode('node-sonarqube')}
              defaultTitle="SonarQube Gate"
              defaultRole="Cổng 2 · SAST Quality"
              sizePreset="wide"
              isSelected={selectedNodeId === 'node-sonarqube'}
              onClick={() => onSelectNode('node-sonarqube')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-sonarqube');
                setDraggedNodeId('node-sonarqube');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-sonarqube');
              }}
            />
          </div>

          {/* Bottom Row in Box 1: Docker <- Trivy */}
          <div className="flex items-center justify-end gap-16 pt-2 px-2">
            <CanvasNodeCard
              id="node-docker"
              node={getNode('node-docker')}
              defaultTitle="Docker Engine"
              defaultRole="Build & Image Registry"
              isSelected={selectedNodeId === 'node-docker'}
              onClick={() => onSelectNode('node-docker')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-docker');
                setDraggedNodeId('node-docker');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-docker');
              }}
            />

            <CanvasNodeCard
              id="node-trivy"
              node={getNode('node-trivy')}
              defaultTitle="Trivy Gate"
              defaultRole="Cổng 3 · Container CVE"
              sizePreset="wide"
              isSelected={selectedNodeId === 'node-trivy'}
              onClick={() => onSelectNode('node-trivy')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-trivy');
                setDraggedNodeId('node-trivy');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-trivy');
              }}
            />
          </div>

          {/* DYNAMIC DROPPED PLUGINS IN BOX 1 */}
          {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').length > 0 && (
            <div className="mt-4 pt-3 border-t border-cyan-500/20">
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-cyan-400">
                <Plus className="w-3.5 h-3.5" />
                <span>Công cụ mở rộng đã tích hợp ({nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').length}):</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CI_BOX').map(dynNode => (
                  <div
                    key={dynNode.id}
                    onClick={() => onSelectNode(dynNode.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                      selectedNodeId === dynNode.id
                        ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-400/20'
                        : 'bg-[#0E1526] hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-slate-800 border-slate-700">
                      <OfficialToolIcon toolIdOrName={dynNode.name} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs truncate text-white">{dynNode.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">{dynNode.statusText}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDynamicNode(dynNode.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition"
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

        {/* BOX 2: STAGE 2 — CD GITOPS & KUBERNETES (PREMIUM GLASSMORPHISM CONTAINER) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsOverBox2(true);
          }}
          onDragLeave={() => setIsOverBox2(false)}
          onDrop={(e) => onDropToolOnBox('CD_BOX', e)}
          className={`stage-studio-panel stage-cd-container ${isOverBox2 ? 'is-drag-over' : ''} space-y-6`}
        >
          {/* Stage Header Badge */}
          <div className="stage-header-badge stage-header-cd">
            <GitMerge className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>KHÂU 2: CD GITOPS & TRIỂN KHAI KUBERNETES</span>
            <span className="stage-meta-pill">GITOPS REALTIME</span>
          </div>

          {isOverBox2 && (
            <div className="absolute inset-0 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center font-bold text-xs z-30 pointer-events-none bg-purple-950/80 border-2 border-purple-400 text-purple-300">
              <Layers className="w-8 h-8 text-purple-400 mb-2 animate-bounce" />
              <span>Thả vào đây để tích hợp công cụ vào Khâu ② CD GitOps & Giám Sát!</span>
            </div>
          )}

          {/* Main GitOps Row: Jenkins CD -> GitHub Config -> ArgoCD -> Kubernetes -> MyApp */}
          <div className="flex items-center justify-between gap-6 pt-3 px-2">
            <CanvasNodeCard
              id="node-jenkins-cd"
              node={getNode('node-jenkins-cd')}
              defaultTitle="Jenkins CD"
              defaultRole="CD Automation Engine"
              isSelected={selectedNodeId === 'node-jenkins-cd'}
              onClick={() => onSelectNode('node-jenkins-cd')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-jenkins-cd');
                setDraggedNodeId('node-jenkins-cd');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-jenkins-cd');
              }}
            />

            <CanvasNodeCard
              id="node-github-config"
              node={getNode('node-github-config')}
              defaultTitle="GitHub Config"
              defaultRole="GitOps Manifest Repo"
              isSelected={selectedNodeId === 'node-github-config'}
              onClick={() => onSelectNode('node-github-config')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-github-config');
                setDraggedNodeId('node-github-config');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-github-config');
              }}
            />

            <CanvasNodeCard
              id="node-argocd"
              node={getNode('node-argocd')}
              defaultTitle="ArgoCD"
              defaultRole="GitOps Controller"
              isSelected={selectedNodeId === 'node-argocd'}
              onClick={() => onSelectNode('node-argocd')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-argocd');
                setDraggedNodeId('node-argocd');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-argocd');
              }}
            />

            <CanvasNodeCard
              id="node-k8s"
              node={getNode('node-k8s')}
              defaultTitle="Kubernetes"
              defaultRole="Production Cluster"
              isSelected={selectedNodeId === 'node-k8s'}
              onClick={() => onSelectNode('node-k8s')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-k8s');
                setDraggedNodeId('node-k8s');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-k8s');
              }}
            />

            <CanvasNodeCard
              id="node-myapp"
              node={getNode('node-myapp')}
              defaultTitle={selectedProject?.name || 'MyApp'}
              defaultRole="Production Live Service"
              isSelected={selectedNodeId === 'node-myapp'}
              onClick={() => onSelectNode('node-myapp')}
              getNodeBorder={getNodeBorder}
              renderLogo={renderLogo}
              onStartConnect={onStartConnect}
              onFinishConnect={onFinishConnect}
              activeConnectingPort={activeConnectingPort}
              theme={theme}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/node-id', 'node-myapp');
                setDraggedNodeId('node-myapp');
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const srcId = e.dataTransfer.getData('text/node-id');
                if (srcId) onSwapNodes(srcId, 'node-myapp');
              }}
            />
          </div>

          {/* DYNAMIC DROPPED PLUGINS IN BOX 2 */}
          {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').length > 0 && (
            <div className="mt-4 pt-3 border-t border-purple-500/20">
              <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-purple-400">
                <Plus className="w-3.5 h-3.5" />
                <span>Công cụ mở rộng đã tích hợp ({nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').length}):</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {nodes.filter(n => n.id.startsWith('node-dynamic-') && n.box === 'CD_BOX').map(dynNode => (
                  <div
                    key={dynNode.id}
                    onClick={() => onSelectNode(dynNode.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all shadow-sm ${
                      selectedNodeId === dynNode.id
                        ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-400/40 shadow-purple-400/20'
                        : 'bg-[#0E1526] hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-slate-800 border-slate-700">
                      <OfficialToolIcon toolIdOrName={dynNode.name} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs truncate text-white">{dynNode.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono font-bold">{dynNode.statusText}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDynamicNode(dynNode.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded-lg transition"
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
        <div className="flex items-center justify-end gap-8 pr-2">
          <CanvasNodeCard
            id="node-prometheus"
            node={getNode('node-prometheus')}
            defaultTitle="Prometheus"
            defaultRole="Metrics Scraping 15s"
            sizePreset="compact"
            isSelected={selectedNodeId === 'node-prometheus'}
            onClick={() => onSelectNode('node-prometheus')}
            getNodeBorder={getNodeBorder}
            renderLogo={renderLogo}
            onStartConnect={onStartConnect}
            onFinishConnect={onFinishConnect}
            activeConnectingPort={activeConnectingPort}
            theme={theme}
          />

          <CanvasNodeCard
            id="node-grafana"
            node={getNode('node-grafana')}
            defaultTitle="Grafana"
            defaultRole="Realtime Analytics"
            sizePreset="compact"
            isSelected={selectedNodeId === 'node-grafana'}
            onClick={() => onSelectNode('node-grafana')}
            getNodeBorder={getNodeBorder}
            renderLogo={renderLogo}
            onStartConnect={onStartConnect}
            onFinishConnect={onFinishConnect}
            activeConnectingPort={activeConnectingPort}
            theme={theme}
          />

          <CanvasNodeCard
            id="node-gmail"
            node={getNode('node-gmail')}
            defaultTitle="Gmail Alert"
            defaultRole="Incident Dispatcher"
            sizePreset="compact"
            isSelected={selectedNodeId === 'node-gmail'}
            onClick={() => onSelectNode('node-gmail')}
            getNodeBorder={getNodeBorder}
            renderLogo={renderLogo}
            onStartConnect={onStartConnect}
            onFinishConnect={onFinishConnect}
            activeConnectingPort={activeConnectingPort}
            theme={theme}
          />
        </div>

      </div>
    </div>
  );
};
