'use client';

import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Cpu, 
  BrainCircuit, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Filter, 
  Search,
  Code2,
  Play
} from 'lucide-react';
import { AgentRoleProfile, AgentLogStep, LogStepType } from '@/types';

interface AgentLogInspectorModalProps {
  agent: AgentRoleProfile | null;
  logs: AgentLogStep[];
  onClose: () => void;
  onTriggerAgentTask?: (agentCode: string) => void;
}

export const AgentLogInspectorModal: React.FC<AgentLogInspectorModalProps> = ({
  agent,
  logs,
  onClose,
  onTriggerAgentTask,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchLog, setSearchLog] = useState<string>('');
  const [expandedCoT, setExpandedCoT] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!agent) return null;

  // Filter agent specific logs
  const agentLogs = logs.filter(log => {
    const isThisAgent = log.agentCode === agent.code;
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesSearch = 
      log.title.toLowerCase().includes(searchLog.toLowerCase()) ||
      (log.thinking && log.thinking.toLowerCase().includes(searchLog.toLowerCase())) ||
      (log.toolOutput && log.toolOutput.toLowerCase().includes(searchLog.toLowerCase())) ||
      (log.commandLine && log.commandLine.toLowerCase().includes(searchLog.toLowerCase()));
    return isThisAgent && matchesType && matchesSearch;
  });

  const toggleCoT = (stepId: string) => {
    setExpandedCoT(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStepIcon = (type: LogStepType) => {
    switch (type) {
      case 'USER_INPUT':
        return <Play className="w-4 h-4 text-cyan-400" />;
      case 'THINKING':
        return <BrainCircuit className="w-4 h-4 text-purple-400" />;
      case 'TOOL_CALL':
      case 'TOOL_RESULT':
        return <Wrench className="w-4 h-4 text-blue-400" />;
      case 'COMMAND_EXEC':
        return <Terminal className="w-4 h-4 text-amber-400" />;
      case 'QA_TEST':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Code2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStepBadge = (type: LogStepType) => {
    switch (type) {
      case 'THINKING':
        return 'bg-purple-950/60 text-purple-300 border-purple-500/30';
      case 'TOOL_CALL':
        return 'bg-blue-950/60 text-blue-300 border-blue-500/30';
      case 'COMMAND_EXEC':
        return 'bg-amber-950/60 text-amber-300 border-amber-500/30';
      case 'QA_TEST':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';
      case 'ERROR':
        return 'bg-rose-950/60 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-[#0B0F19] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-[#111827] border-b border-[#1E293B] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow">
              {agent.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-sm text-cyan-400">
                  {agent.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30">
                  {agent.category}
                </span>
                <span className="text-slate-400 text-xs font-medium">
                  {agent.phase}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {agent.name} — Nhật Ký Thực Thi Từng Bước (Deep Inspector)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onTriggerAgentTask && (
              <button
                type="button"
                onClick={() => onTriggerAgentTask(agent.code)}
                className="btn-action bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow"
                style={{ fontSize: '11.5px', height: '32px', padding: '6px 12px', whiteSpace: 'nowrap' }}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Kích Hoạt Agent</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Agent Info & SLA Metrics Strip */}
        <div className="px-5 py-3 bg-[#0E1524] border-b border-[#1E293B] flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-400">Trạng thái: </span>
              <strong className="text-cyan-300 font-mono">{agent.status.toUpperCase()}</strong>
            </div>
            <div>
              <span className="text-slate-400">Đã hoàn tất: </span>
              <strong className="text-slate-200 font-mono">{agent.metrics.tasksCompleted} Tasks</strong>
            </div>
            <div>
              <span className="text-slate-400">Độ trễ trung bình: </span>
              <strong className="text-slate-200 font-mono">{agent.metrics.avgResponseMs}ms</strong>
            </div>
            <div>
              <span className="text-slate-400">Tỷ lệ thành công: </span>
              <strong className="text-emerald-400 font-mono">{agent.metrics.successRate}%</strong>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Hoạt động gần nhất: {agent.lastActive}</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="px-5 py-3 bg-[#111827]/70 border-b border-[#1E293B] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center overflow-x-auto gap-1 scrollbar-none">
            {['ALL', 'THINKING', 'TOOL_CALL', 'COMMAND_EXEC', 'QA_TEST', 'OUTPUT'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`btn-action border transition-all ${
                  filterType === type
                    ? 'bg-cyan-600 text-slate-950 font-bold border-cyan-400'
                    : 'bg-[#0B0F19] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                style={{ fontSize: '11px', height: '28px', padding: '4px 8px', whiteSpace: 'nowrap' }}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Lọc nội dung log, command, CoT..."
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              className="w-full bg-[#0B0F19] border border-slate-800 rounded-md pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              style={{ height: '28px' }}
            />
          </div>
        </div>

        {/* Step Timeline Log Content (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-none">
          {agentLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Không tìm thấy bước thực thi nào phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            agentLogs.map((log) => {
              const isCoTExpanded = expandedCoT[log.id] ?? true;

              return (
                <div 
                  key={log.id} 
                  className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 transition-all hover:border-slate-700"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
                        Step #{log.stepIndex}
                      </span>
                      <div className="p-1 rounded bg-slate-800/80">
                        {getStepIcon(log.type)}
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStepBadge(log.type)}`}>
                        {log.type}
                      </span>
                      <h4 className="font-bold text-slate-100 text-xs sm:text-sm">
                        {log.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                      {log.durationMs !== undefined && (
                        <span>{log.durationMs}ms</span>
                      )}
                      <span>{log.timestamp}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950/40' : 'text-rose-400 bg-rose-950/40'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </div>

                  {/* Thinking / Chain-of-Thought (CoT) collapsible section */}
                  {log.thinking && (
                    <div className="mt-2.5 rounded-lg bg-[#090D16] border border-purple-500/20 overflow-hidden">
                      <div 
                        onClick={() => toggleCoT(log.id)}
                        className="px-3 py-1.5 bg-purple-950/20 border-b border-purple-500/20 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>Suy Luận Logic & Kế Hoạch (Chain-of-Thought)</span>
                        </div>
                        {isCoTExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
                        )}
                      </div>

                      {isCoTExpanded && (
                        <div className="p-3 text-[12px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                          {log.thinking}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tool Call and Arguments Payload */}
                  {log.toolName && (
                    <div className="mt-2.5 rounded-lg bg-[#090D16] border border-blue-500/20 p-3">
                      <div className="flex items-center justify-between text-[11px] text-blue-300 font-bold mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Công cụ Được Gọi: <strong className="text-cyan-300 font-mono">{log.toolName}</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(JSON.stringify(log.toolArgs || {}, null, 2), `tool-${log.id}`)}
                          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300"
                        >
                          {copiedId === `tool-${log.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Sao chép JSON</span>
                        </button>
                      </div>
                      {log.toolArgs && (
                        <pre className="code-block p-2 text-[11px] text-cyan-200/90 overflow-x-auto">
                          {JSON.stringify(log.toolArgs, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Terminal Command Execution Viewer */}
                  {log.commandLine && (
                    <div className="mt-2.5 rounded-lg bg-[#090D16] border border-amber-500/20 p-3">
                      <div className="flex items-center justify-between text-[11px] text-amber-300 font-bold mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Lệnh Thực Thi Terminal:</span>
                        </div>
                        <span className="font-mono text-[10.5px] text-slate-400">
                          Exit Code: <strong className="text-emerald-400">{log.exitCode ?? 0}</strong>
                        </span>
                      </div>
                      <div className="code-block p-2 text-[11.5px] text-amber-200 font-mono">
                        $ {log.commandLine}
                      </div>
                    </div>
                  )}

                  {/* Tool / Command Output */}
                  {log.toolOutput && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-[#090D16] border border-slate-800 text-[11.5px] text-slate-300 font-mono">
                      <span className="text-slate-500 font-bold block mb-1">Output / Kết quả:</span>
                      {log.toolOutput}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-[#111827] border-t border-[#1E293B] flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-400">
            Tổng cộng: <strong className="text-cyan-300 font-mono">{agentLogs.length}</strong> bước thực thi được ghi nhận
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-action bg-slate-800 hover:bg-slate-700 text-slate-200"
            style={{ fontSize: '11.5px', height: '30px', padding: '4px 14px', whiteSpace: 'nowrap' }}
          >
            Đóng Thanh Tra
          </button>
        </div>
      </div>
    </div>
  );
};
