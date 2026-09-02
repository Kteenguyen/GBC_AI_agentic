'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowEdge, WorkflowPort, Point } from '@/types/workflowGraph';
import { calculateBezierPath } from '@/lib/workflowGraphEngine';
import { X, Minus, Sparkles } from 'lucide-react';

interface WorkflowConnectionCanvasProps {
  containerRef: React.RefObject<HTMLDivElement>;
  edges: WorkflowEdge[];
  nodePositions: Record<string, { x: number; y: number; width: number; height: number }>;
  activeConnectingPort: { nodeId: string; port: WorkflowPort; startPoint: Point } | null;
  cursorPos: Point | null;
  onRemoveEdge: (edgeId: string) => void;
  isRunningPipeline: boolean;
  theme?: 'light' | 'dark';
}

export default function WorkflowConnectionCanvas({
  containerRef,
  edges,
  nodePositions,
  activeConnectingPort,
  cursorPos,
  onRemoveEdge,
  isRunningPipeline,
  theme = 'light'
}: WorkflowConnectionCanvasProps) {
  const isLight = theme === 'light';
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);

  // Tính toán tọa độ chính xác của 4 điểm neo dựa trên bounding box của node
  const getPortCoordinates = useCallback((
    nodeId: string,
    port: WorkflowPort
  ): Point | null => {
    const pos = nodePositions[nodeId];
    if (!pos) return null;

    switch (port) {
      case 'TOP':
        return { x: pos.x + pos.width / 2, y: pos.y };
      case 'RIGHT':
        return { x: pos.x + pos.width, y: pos.y + pos.height / 2 };
      case 'BOTTOM':
        return { x: pos.x + pos.width / 2, y: pos.y + pos.height };
      case 'LEFT':
        return { x: pos.x, y: pos.y + pos.height / 2 };
      default:
        return { x: pos.x + pos.width, y: pos.y + pos.height / 2 };
    }
  }, [nodePositions]);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
      style={{ minWidth: '100%', minHeight: '100%' }}
    >
      <defs>
        {/* Marker Arrowhead - Light Theme (Blue) */}
        <marker
          id="arrowhead-light"
          markerWidth="9"
          markerHeight="7"
          refX="7"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 9 3.5, 0 7"
            fill="#2563EB"
          />
        </marker>

        {/* Marker Arrowhead - Dark Theme (Cyan) */}
        <marker
          id="arrowhead-dark"
          markerWidth="9"
          markerHeight="7"
          refX="7"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 9 3.5, 0 7"
            fill="#38BDF8"
          />
        </marker>

        {/* Marker Arrowhead - Hover / Active */}
        <marker
          id="arrowhead-hover"
          markerWidth="10"
          markerHeight="8"
          refX="8"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 10 4, 0 8"
            fill="#E11D48"
          />
        </marker>

        {/* Gradient for Running Flow */}
        <linearGradient id="running-flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Render Established Edges */}
      {edges.map((edge) => {
        const p1 = getPortCoordinates(edge.sourceNodeId, edge.sourcePort);
        const p2 = getPortCoordinates(edge.targetNodeId, edge.targetPort);

        if (!p1 || !p2) return null;

        const { path, center } = calculateBezierPath(p1, p2, edge.sourcePort, edge.targetPort);
        const isHovered = hoveredEdgeId === edge.id;
        const isRunning = isRunningPipeline || edge.status === 'RUNNING';

        return (
          <g
            key={edge.id}
            className="group pointer-events-auto"
            onMouseEnter={() => setHoveredEdgeId(edge.id)}
            onMouseLeave={() => setHoveredEdgeId(null)}
          >
            {/* Invisible Wide Hitbox for easier hover/click */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth={20}
              className="cursor-pointer"
            />

            {/* Background Glow when running */}
            {isRunning && (
              <path
                d={path}
                fill="none"
                stroke={isLight ? '#93C5FD' : '#0284C7'}
                strokeWidth={6}
                strokeOpacity={0.4}
                className="animate-pulse"
              />
            )}

            {/* Main Bezier Line */}
            <path
              d={path}
              fill="none"
              stroke={
                isHovered
                  ? '#E11D48'
                  : isRunning
                  ? (isLight ? '#2563EB' : '#38BDF8')
                  : (isLight ? '#94A3B8' : '#475569')
              }
              strokeWidth={isHovered ? 2.5 : isRunning ? 2.5 : 1.8}
              strokeDasharray={isRunning ? '6 4' : 'none'}
              markerEnd={
                isHovered
                  ? 'url(#arrowhead-hover)'
                  : isLight
                  ? 'url(#arrowhead-light)'
                  : 'url(#arrowhead-dark)'
              }
              className={`transition-all duration-150 ${isRunning ? 'animate-[dash_1s_linear_infinite]' : ''}`}
              style={{
                strokeDashoffset: isRunning ? 0 : undefined
              }}
            />

            {/* Animated Flowing Pulse Particles when Pipeline is Running */}
            {isRunning && (
              <circle r="3.5" fill={isLight ? '#1D4ED8' : '#38BDF8'} className="filter drop-shadow-xs">
                <animateMotion
                  path={path}
                  dur="1.8s"
                  repeatCount="indefinite"
                  rotate="auto"
                />
              </circle>
            )}

            {/* Center Label Badge with interactive Delete button [-] */}
            <foreignObject
              x={center.x - 45}
              y={center.y - 12}
              width={90}
              height={28}
              className="overflow-visible pointer-events-auto"
            >
              <div className="flex items-center justify-center h-full">
                {isHovered ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveEdge(edge.id);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition transform scale-105 active:scale-95 cursor-pointer"
                    title="Gỡ đường nối mũi tên này"
                  >
                    <Minus className="w-2.5 h-2.5" />
                    <span>Gỡ</span>
                  </button>
                ) : (
                  edge.label && (
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold border shadow-2xs whitespace-nowrap transition ${
                      isLight
                        ? 'bg-white/95 text-slate-700 border-[#E2DDD5]'
                        : 'bg-[#0B0F19]/90 text-slate-300 border-slate-700/80'
                    }`}>
                      {edge.label}
                    </span>
                  )
                )}
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Rubberband Connection Preview Line while Dragging / Connecting */}
      {activeConnectingPort && cursorPos && (
        <g>
          {(() => {
            const p1 = activeConnectingPort.startPoint;
            const p2 = cursorPos;
            const { path } = calculateBezierPath(p1, p2, activeConnectingPort.port, 'LEFT');
            return (
              <>
                <path
                  d={path}
                  fill="none"
                  stroke={isLight ? '#2563EB' : '#38BDF8'}
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  className="animate-pulse"
                />
                <circle
                  cx={p2.x}
                  cy={p2.y}
                  r="5"
                  fill={isLight ? '#2563EB' : '#38BDF8'}
                  className="animate-ping"
                />
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
}
