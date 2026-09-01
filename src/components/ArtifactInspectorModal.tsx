'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code2, Terminal, ShieldCheck } from 'lucide-react';

interface ArtifactInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  artifactName: string;
  format: 'JSON' | 'CODE' | 'YAML' | 'XML';
  content: string;
  sourceNodeName: string;
}

export default function ArtifactInspectorModal({
  isOpen,
  onClose,
  title,
  artifactName,
  format,
  content,
  sourceNodeName
}: ArtifactInspectorModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifactName.replace(/[^a-zA-Z0-9._-]/g, '_');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B101E] border border-cyan-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#080C17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {format === 'CODE' || format === 'YAML' ? <Code2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {format}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Artifact từ: <strong className="text-slate-200">{sourceNodeName}</strong> • {artifactName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Sao chép nội dung"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 transition"
              title="Tải tệp về máy"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải về</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-200 bg-[#060911] leading-relaxed">
          <pre className="whitespace-pre-wrap select-text">{content}</pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080C17] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Artifact được ký số và xác thực bởi Antigravity Pipeline Engine</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Dung lượng: {new Blob([content]).size} bytes
          </span>
        </div>

      </div>
    </div>
  );
}
