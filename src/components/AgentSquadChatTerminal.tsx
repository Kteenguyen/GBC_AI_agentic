'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Terminal, 
  Maximize2, 
  Minimize2, 
  X, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  CheckCircle2, 
  Wrench, 
  ArrowRight,
  RotateCcw,
  Code,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ChatMessage } from '@/app/api/chat/route';
import { CLIExecutionResult } from '@/app/api/cli/route';

interface AgentSquadChatTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTab?: (tab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA') => void;
  onRunPipeline?: () => void;
  theme?: 'light' | 'dark';
}

const AVAILABLE_MODELS = [
  { id: 'Antigravity Flash 3.7', name: 'Google Flash 3.7', desc: 'Phản hồi tức thì • Tối ưu Mobile' },
  { id: 'Antigravity Pro 2.5', name: 'Google Pro 2.5', desc: 'Suy luận kiến trúc phức tạp' },
  { id: 'DeepSeek R1', name: 'DeepSeek R1 Reasoner', desc: 'Mô hình suy luận mã nguồn sâu' },
  { id: 'Claude 3.7 Sonnet', name: 'Claude 3.7 Thinking', desc: 'Refactor code & Viết tài liệu' },
];

const QUICK_COMMANDS = [
  { cmd: '/grill-me', label: '/grill-me Phản Biện 99.99%', prompt: '/grill-me Phỏng vấn đào sâu, phản biện đa chiều về kiến trúc, RBAC và UI 430px trước khi triển khai' },
  { cmd: '/run-pipeline', label: 'Chạy Pipeline 8 Bước', prompt: 'Kích hoạt chạy toàn bộ Pipeline DevOps 8 bước từ Dev đến Kubernetes' },
  { cmd: '/qa-test', label: 'Kiểm Thử QA 430px', prompt: 'Chạy toàn bộ bài test QA Playwright mobile viewport 430px và kiểm tra lỗi' },
  { cmd: '/solo-battle', label: 'So Găng Solo 1v1', prompt: 'Quét top 10 GitHub Trending và cử Agent ra solo 1v1 với repo AI xuất sắc nhất' },
  { cmd: '/agent-status', label: 'Trạng Thái 13 Agents', prompt: 'Báo cáo trạng thái tự hành 24/7 của toàn bộ 13 AI Subagents trong squad' },
];

const CLI_SHORTCUTS = [
  { label: '/grill-me', cmd: '/grill-me' },
  { label: 'agy status', cmd: 'agy status' },
  { label: 'agy agents list', cmd: 'agy agents list' },
  { label: 'agy pipeline run', cmd: 'agy pipeline run' },
  { label: 'agy qa', cmd: 'agy qa' },
  { label: 'agy solo', cmd: 'agy solo' },
  { label: 'git status', cmd: 'git status' },
  { label: 'ls', cmd: 'ls' },
  { label: 'clear', cmd: 'clear' },
];

export const AgentSquadChatTerminal: React.FC<AgentSquadChatTerminalProps> = ({
  isOpen,
  onClose,
  onOpenTab,
  onRunPipeline,
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  const [activeMode, setActiveMode] = useState<'CHAT' | 'CLI'>('CLI'); // Mặc định mở CLI trực tiếp theo yêu cầu
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('Antigravity Flash 3.7');
  const [targetAgent, setTargetAgent] = useState<string>('Supreme NLP Leader');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isThinkingOpen, setIsThinkingOpen] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Xin chào! Tôi là **Supreme NLP Leader** điều phối **13 AI Subagents Tự Hành** tại dự án **\`Workflow\`** (\`https://github.com/Kteenguyen/GBC_AI_agentic.git\`).\n\nBạn có thể gõ câu lệnh hoặc chuyển sang tab **Antigravity CLI (agy)** để chạy dòng lệnh terminal trực tiếp!`,
      timestamp: 'Vừa xong',
      targetAgent: 'Supreme NLP Leader',
      model: 'Antigravity Flash 3.7'
    }
  ]);

  // CLI state
  const [cliHistory, setCliHistory] = useState<Array<{
    cmd: string;
    output: string;
    timestamp: string;
    exitCode: number;
    subagent?: string;
  }>>([
    {
      cmd: 'agy --version',
      output: `Antigravity CLI (agy) v2.4.0 (build 2026.09.01-prod)\nModel: Google Antigravity Flash 3.7\nWorkspace: c:\\Users\\ADMIN\\OneDrive\\Documents\\Work\\Workflow\nType 'agy --help' to see all available commands.`,
      timestamp: '20:50:00',
      exitCode: 0,
      subagent: 'Supreme NLP Leader'
    }
  ]);
  const [cliInput, setCliInput] = useState<string>('');
  const [cliHistoryIndex, setCliHistoryIndex] = useState<number>(-1);
  const [pastCommands, setPastCommands] = useState<string[]>(['agy --version']);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cliEndRef = useRef<HTMLDivElement>(null);
  const cliInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (activeMode === 'CHAT') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      cliEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (activeMode === 'CLI') {
        setTimeout(() => cliInputRef.current?.focus(), 100);
      }
    }
  }, [messages, cliHistory, isOpen, activeMode]);

  // Phím tắt ESC đóng, Ctrl+` chuyển tab
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setActiveMode(prev => prev === 'CHAT' ? 'CLI' : 'CHAT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Send Chat
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      targetAgent,
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim(),
          model: selectedModel,
          targetAgent,
          history: messages.slice(-6)
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages(prev => [...prev, data.message]);
        setIsThinkingOpen(prev => ({ ...prev, [data.message.id]: true }));

        if (textToSend.toLowerCase().includes('pipeline') && onRunPipeline) {
          onRunPipeline();
        }
      } else {
        throw new Error(data.error || 'Lỗi từ máy chủ');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'system',
        content: `Lỗi kết nối: ${err.message || 'Không thể phản hồi ngay lúc này'}. Vui lòng thử lại!`,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Execute CLI Command
  const handleExecuteCli = async (cmdToRun?: string) => {
    const command = cmdToRun || cliInput;
    if (!command.trim() || isLoading) return;

    const cmdClean = command.trim();
    setPastCommands(prev => [...prev, cmdClean]);
    setCliHistoryIndex(-1);
    if (!cmdToRun) setCliInput('');

    if (cmdClean === 'clear' || cmdClean === 'cls' || cmdClean === '/clear') {
      setCliHistory([]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/cli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmdClean })
      });

      const data = await res.json();
      if (data.success && data.result) {
        if (data.result.stdout === 'CLEAR_SCREEN') {
          setCliHistory([]);
        } else {
          setCliHistory(prev => [...prev, {
            cmd: cmdClean,
            output: data.result.stdout,
            timestamp: data.result.timestamp,
            exitCode: data.result.exitCode,
            subagent: data.result.subagent
          }]);
        }

        // Tự động kích hoạt hành động nếu lệnh là pipeline
        if ((cmdClean.includes('pipeline run') || cmdClean.includes('pipeline trigger')) && onRunPipeline) {
          onRunPipeline();
        }
      } else {
        throw new Error(data.error || 'Lỗi thực thi lệnh CLI');
      }
    } catch (err: any) {
      setCliHistory(prev => [...prev, {
        cmd: cmdClean,
        output: `Error: ${err.message || 'Lệnh thất bại'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        exitCode: 1,
        subagent: 'CLI Error Guard'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Phím Mũi tên Lên / Xuống để duyệt lịch sử lệnh
  const handleCliKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length === 0) return;
      const nextIndex = cliHistoryIndex === -1 ? pastCommands.length - 1 : Math.max(0, cliHistoryIndex - 1);
      setCliHistoryIndex(nextIndex);
      setCliInput(pastCommands[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cliHistoryIndex === -1) return;
      const nextIndex = cliHistoryIndex + 1;
      if (nextIndex >= pastCommands.length) {
        setCliHistoryIndex(-1);
        setCliInput('');
      } else {
        setCliHistoryIndex(nextIndex);
        setCliInput(pastCommands[nextIndex]);
      }
    }
  };

  const toggleThinking = (msgId: string) => {
    setIsThinkingOpen(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-[99999] transition-all duration-300 font-sans shadow-2xl flex flex-col ${
      isMaximized 
        ? 'inset-2 sm:inset-6 rounded-3xl' 
        : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[620px] h-[85vh] sm:h-[700px] rounded-3xl'
    } border backdrop-blur-2xl ${
      isLight 
        ? 'bg-[#FAF8F5]/98 border-[#E2DDD5] text-slate-800' 
        : 'bg-[#070B14]/98 border-slate-800 text-slate-100'
    }`}>
      
      {/* 1. TERMINAL HEADER WITH DUAL MODE SWITCHER (CHAT VS CLI) */}
      <div className={`px-4 py-3 border-b flex items-center justify-between rounded-t-3xl ${
        isLight ? 'bg-white/90 border-[#E2DDD5]' : 'bg-[#0B101E]/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          {/* Dual Mode Switcher Tabs */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-900 border-slate-800'
          }`}>
            <button
              type="button"
              onClick={() => setActiveMode('CLI')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeMode === 'CLI'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Antigravity CLI (`agy`)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('CHAT')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeMode === 'CHAT'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Copilot (Flash 3.7)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
            title={isMaximized ? 'Thu nhỏ' : 'Phóng to'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950 dark:hover:text-rose-400 text-slate-500 transition cursor-pointer"
            title="Đóng Terminal (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MODE: ANTIGRAVITY CLI (EMBEDDED REAL TERMINAL) */}
      {activeMode === 'CLI' && (
        <div className="flex-1 flex flex-col overflow-hidden bg-[#050811] text-emerald-400 font-mono text-xs select-text">
          
          {/* CLI Top Sub-Header */}
          <div className="px-4 py-1.5 bg-[#090E1A] border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>workspace: <strong>Workflow</strong> (git: main) • kernel: <strong>agy v2.4.0</strong></span>
            </span>
            <span className="hidden sm:inline opacity-70">Gõ 'agy --help' hoặc click nút gợi ý</span>
          </div>

          {/* CLI Terminal Output Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {cliHistory.map((item, idx) => (
              <div key={idx} className="space-y-1">
                {/* Command Line Prompt */}
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <span className="text-emerald-500">agy@workflow:~$</span>
                  <span>{item.cmd}</span>
                  <span className="text-[10px] text-slate-500 font-normal ml-auto">{item.timestamp}</span>
                </div>

                {/* Command Output Block */}
                <pre className={`p-2.5 rounded-xl border whitespace-pre-wrap leading-relaxed text-[11.5px] ${
                  item.exitCode === 0 
                    ? 'bg-[#080D1A] border-slate-800/80 text-slate-200' 
                    : 'bg-rose-950/30 border-rose-900 text-rose-300'
                }`}>
                  {item.output}
                </pre>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-amber-400 animate-pulse">
                <Terminal className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Antigravity command in background...</span>
              </div>
            )}

            <div ref={cliEndRef} />
          </div>

          {/* Quick CLI Shortcuts */}
          <div className="px-3 py-1.5 bg-[#080C17] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Lệnh Nhanh:</span>
            {CLI_SHORTCUTS.map(s => (
              <button
                key={s.cmd}
                type="button"
                onClick={() => handleExecuteCli(s.cmd)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 text-[10.5px] font-mono whitespace-nowrap transition cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* CLI Interactive Input Line */}
          <div className="p-3 bg-[#090E1A] border-t border-slate-800 flex items-center gap-2">
            <span className="text-emerald-500 font-bold shrink-0">agy@workflow:~$</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteCli();
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                ref={cliInputRef}
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                onKeyDown={handleCliKeyDown}
                placeholder="Nhập lệnh agy (ví dụ: agy status, agy pipeline run, agy qa)..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-600"
                autoFocus
              />
              <button
                type="submit"
                disabled={!cliInput.trim() || isLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  cliInput.trim() && !isLoading
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Run</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* 3. MODE: NATURAL LANGUAGE AI COPILOT CHAT */}
      {activeMode === 'CHAT' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Model & Agent Selector Bar */}
          <div className={`px-4 py-2 border-b flex items-center justify-between gap-2 flex-wrap text-xs ${
            isLight ? 'bg-[#F2EFE9] border-[#E2DDD5]' : 'bg-[#0B0F19] border-slate-800/80'
          }`}>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span className="font-semibold text-[11px] opacity-75">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer transition ${
                  isLight ? 'bg-white border-[#E2DDD5] text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                {AVAILABLE_MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-[11px] opacity-75">Tag Agent:</span>
              <select
                value={targetAgent}
                onChange={(e) => setTargetAgent(e.target.value)}
                className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer transition ${
                  isLight ? 'bg-white border-[#E2DDD5] text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <option value="Supreme NLP Leader">@Supreme NLP Leader (Chỉ huy)</option>
                <option value="DevOps Parity Officer">@DevOps Parity Officer (CI/CD)</option>
                <option value="QA Testing Subagent">@QA Testing Subagent (Kiểm thử)</option>
                <option value="Mobile UX Architect">@Mobile UX Architect (Giao diện)</option>
                <option value="Backend & Supabase Guard">@Backend & Supabase Guard</option>
                <option value="Toàn Bộ 13 Agents">@Toàn Bộ 13 Agents (Squad)</option>
              </select>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSystem = msg.role === 'system';
              const hasThinking = Boolean(msg.thinking);
              const showThinking = isThinkingOpen[msg.id] ?? false;

              return (
                <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[88%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                    {hasThinking && (
                      <div className={`rounded-xl border text-[11px] font-mono transition overflow-hidden ${
                        isLight 
                          ? 'bg-amber-50/70 border-amber-200/80 text-amber-900' 
                          : 'bg-amber-950/30 border-amber-800/60 text-amber-300'
                      }`}>
                        <button
                          type="button"
                          onClick={() => toggleThinking(msg.id)}
                          className="w-full px-3 py-1.5 flex items-center justify-between font-bold cursor-pointer hover:opacity-90"
                        >
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>Chain-of-Thought (CoT) Reasoning</span>
                          </span>
                          {showThinking ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {showThinking && (
                          <div className="px-3 py-2 border-t border-amber-200/60 dark:border-amber-800/60 whitespace-pre-wrap text-[10.5px] leading-relaxed opacity-90">
                            {msg.thinking}
                          </div>
                        )}
                      </div>
                    )}

                    {msg.toolCalls && msg.toolCalls.map((tool, idx) => (
                      <div key={idx} className={`p-2 rounded-xl border text-[10.5px] font-mono flex items-center gap-2 ${
                        isLight ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-blue-950/40 border-blue-800 text-cyan-300'
                      }`}>
                        <Wrench className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-bold">{tool.name}</span>
                        <span className="opacity-70 truncate">({JSON.stringify(tool.args)})</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-auto shrink-0 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã chạy
                        </span>
                      </div>
                    ))}

                    <div className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : isSystem
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                        : (isLight ? 'bg-white border border-[#E2DDD5] text-slate-900 rounded-tl-xs' : 'bg-[#0E1526] border border-slate-800 text-slate-100 rounded-tl-xs')
                    }`}>
                      {msg.content}
                    </div>

                    {msg.actionLink && onOpenTab && (
                      <div className="pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onOpenTab(msg.actionLink!.tab);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95"
                        >
                          <span>{msg.actionLink.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="text-[9.5px] opacity-50 px-1">
                      {msg.timestamp} {msg.targetAgent && `• ${msg.targetAgent}`}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center text-white shrink-0 shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className={`p-3 rounded-2xl text-xs font-mono border flex items-center gap-2 ${
                  isLight ? 'bg-white border-[#E2DDD5] text-slate-600' : 'bg-[#0E1526] border-slate-800 text-slate-400'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  <span>13 Agents đang phân tích CoT & thực thi...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Slash Commands */}
          <div className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto scrollbar-none ${
            isLight ? 'bg-white/60 border-[#E2DDD5]' : 'bg-[#090E1A] border-slate-800/80'
          }`}>
            <span className="text-[10px] font-bold uppercase opacity-50 shrink-0 font-mono">Gợi ý:</span>
            {QUICK_COMMANDS.map((q) => (
              <button
                key={q.cmd}
                type="button"
                onClick={() => handleSendMessage(q.prompt)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition border cursor-pointer active:scale-95 ${
                  isLight 
                    ? 'bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-[#E2DDD5] hover:border-blue-300' 
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-800'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className={`p-3 border-t rounded-b-3xl ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0B101E] border-slate-800'
          }`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Gõ lệnh hoặc prompt cho ${targetAgent} (Model Flash 3.7)...`}
                disabled={isLoading}
                className={`flex-1 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border focus:outline-none transition ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    : 'bg-[#070B14] border-slate-700 text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                }`}
              />

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer ${
                  inputPrompt.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gửi Lệnh</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
