'use client';

import React from 'react';
import { WorkflowPort } from '@/types/workflowGraph';
import { Plus } from 'lucide-react';

interface WorkflowNodePortHandleProps {
  nodeId: string;
  onStartConnect: (nodeId: string, port: WorkflowPort, e: React.MouseEvent) => void;
  onFinishConnect: (nodeId: string, port: WorkflowPort, e: React.MouseEvent) => void;
  isConnecting: boolean;
  theme?: 'light' | 'dark';
}

export default function WorkflowNodePortHandle({
  nodeId,
  onStartConnect,
  onFinishConnect,
  isConnecting,
  theme = 'light'
}: WorkflowNodePortHandleProps) {
  const isLight = theme === 'light';

  const renderHandle = (port: WorkflowPort, positionClass: string) => {
    return (
      <button
        type="button"
        data-port-node={nodeId}
        data-port-name={port}
        onClick={(e) => {
          e.stopPropagation();
          if (isConnecting) {
            onFinishConnect(nodeId, port, e);
          } else {
            onStartConnect(nodeId, port, e);
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(nodeId, port, e);
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          if (isConnecting) {
            onFinishConnect(nodeId, port, e);
          }
        }}
        className={`absolute ${positionClass} z-30 w-5 h-5 rounded-full flex items-center justify-center cursor-crosshair transition-all duration-150 transform hover:scale-125 active:scale-95 shadow-sm border ${
          isConnecting
            ? 'opacity-100 animate-pulse bg-blue-600 text-white border-white ring-2 ring-blue-400'
            : `opacity-0 group-hover:opacity-100 ${
                isLight 
                  ? 'bg-blue-600 text-white border-white hover:bg-blue-700' 
                  : 'bg-cyan-500 text-slate-950 border-slate-900 hover:bg-cyan-400'
              }`
        }`}
        title={`Nối dây từ điểm neo ${port} (Nhấp hoặc kéo để kết nối)`}
      >
        <Plus className="w-3 h-3 stroke-[3]" />
      </button>
    );
  };

  return (
    <>
      {/* Top Port */}
      {renderHandle('TOP', '-top-2.5 left-1/2 -translate-x-1/2')}

      {/* Right Port */}
      {renderHandle('RIGHT', '-right-2.5 top-1/2 -translate-y-1/2')}

      {/* Bottom Port */}
      {renderHandle('BOTTOM', '-bottom-2.5 left-1/2 -translate-x-1/2')}

      {/* Left Port */}
      {renderHandle('LEFT', '-left-2.5 top-1/2 -translate-y-1/2')}
    </>
  );
}
