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
  RotateCcw
} from 'lucide-react';
import { ChatMessage } from '@/app/api/chat/route';

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
  { cmd: '/run-pipeline', label: 'Chạy Pipeline 8 Bước', prompt: 'Kích hoạt chạy toàn bộ Pipeline DevOps 8 bước từ Dev đến Kubernetes' },
  { cmd: '/qa-test', label: 'Kiểm Thử QA 430px', prompt: 'Chạy toàn bộ bài test QA Playwright mobile viewport 430px và kiểm tra lỗi' },
  { cmd: '/solo-battle', label: 'So Găng Solo 1v1', prompt: 'Quét top 10 GitHub Trending và cử Agent ra solo 1v1 với repo AI xuất sắc nhất' },
  { cmd: '/agent-status', label: 'Trạng Thái 13 Agents', prompt: 'Báo cáo trạng thái tự hành 24/7 của toàn bộ 13 AI Subagents trong squad' },
];

export const AgentSquadChatTerminal: React.FC<AgentSquadChatTerminalProps> = ({
  isOpen,
  onClose,
  onOpenTab,
  onRunPipeline,
  theme = 'light'
}) => {
  const isLight = theme === 'light';
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('Antigravity Flash 3.7');
  const [targetAgent, setTargetAgent] = useState<string>('Supreme NLP Leader');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isThinkingOpen, setIsThinkingOpen] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: `Xin chào! Tôi là **Supreme NLP Leader** điều phối **13 AI Subagents Tự Hành**.\n\nBạn có thể gõ bất kỳ câu lệnh nào (ví dụ: *"Chạy pipeline"*, *"Kiểm thử QA"*, *"So găng solo với browser-use"*, hoặc dùng lệnh nhanh bên dưới). Tôi sử dụng model **\`Google Antigravity Flash 3.7\`** để phản hồi siêu tốc!`,
      timestamp: 'Vừa xong',
      targetAgent: 'Supreme NLP Leader',
      model: 'Antigravity Flash 3.7'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Phím tắt ESC đóng chat, Ctrl+K mở chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        // Tự động mở CoT Thinking cho tin nhắn mới
        setIsThinkingOpen(prev => ({ ...prev, [data.message.id]: true }));

        // Nếu lệnh là run pipeline và có callback
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

  const toggleThinking = (msgId: string) => {
    setIsThinkingOpen(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-[99999] transition-all duration-300 font-sans shadow-2xl flex flex-col ${
      isMaximized 
        ? 'inset-2 sm:inset-6 rounded-3xl' 
        : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[540px] h-[85vh] sm:h-[680px] rounded-3xl'
    } border backdrop-blur-2xl ${
      isLight 
        ? 'bg-[#FAF8F5]/98 border-[#E2DDD5] text-slate-800' 
        : 'bg-[#070B14]/98 border-slate-800 text-slate-100'
    }`}>
      
      {/* 1. TERMINAL HEADER */}
      <div className={`px-4 py-3.5 border-b flex items-center justify-between rounded-t-3xl ${
        isLight ? 'bg-white/80 border-[#E2DDD5]' : 'bg-[#0B101E]/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs sm:text-sm">Agent Squad Copilot Terminal</h3>
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border font-bold ${
                isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                Auto-Pilot 24/7
              </span>
            </div>
            <p className="text-[10px] opacity-70">Prompt trực tiếp tới 13 AI Subagents • Model: {selectedModel}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Maximize / Minimize Button */}
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition cursor-pointer"
            title={isMaximized ? 'Thu nhỏ' : 'Phóng to'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
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

      {/* 2. MODEL & AGENT SELECTOR BAR */}
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
              isLight 
                ? 'bg-white border-[#E2DDD5] text-slate-800' 
                : 'bg-slate-900 border-slate-700 text-slate-200'
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
              isLight 
                ? 'bg-white border-[#E2DDD5] text-slate-800' 
                : 'bg-slate-900 border-slate-700 text-slate-200'
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

      {/* 3. MESSAGES STREAMING CONTAINER */}
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
                
                {/* Thinking CoT Collapsible Box */}
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

                {/* Tool Calls Details */}
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

                {/* Message Body */}
                <div className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs whitespace-pre-wrap ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : isSystem
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                    : (isLight ? 'bg-white border border-[#E2DDD5] text-slate-900 rounded-tl-xs' : 'bg-[#0E1526] border border-slate-800 text-slate-100 rounded-tl-xs')
                }`}>
                  {msg.content}
                </div>

                {/* Dispatched Agents Pill & Action Link */}
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

      {/* 4. QUICK SLASH COMMAND CHIPS */}
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

      {/* 5. PROMPT INPUT BAR */}
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
  );
};
