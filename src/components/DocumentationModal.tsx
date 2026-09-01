'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  FileText,
  Download,
  Copy,
  Check,
  Search,
  X,
  GitBranch,
  Server,
  ShieldCheck,
  Layers,
  Cpu,
  Radio,
  Clock,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Folder
} from 'lucide-react';
import { BUNDLED_TECHNICAL_DOCS, DOC_CATEGORIES } from '@/lib/docsData';

export interface DocItem {
  id: string;
  title: string;
  category: 'Git' | 'CI' | 'Bảo Mật' | 'Docker' | 'K8s' | 'Giám Sát';
  categoryKey: 'git' | 'ci' | 'security' | 'docker' | 'k8s' | 'telemetry';
  summary: string;
  filename: string;
  readTime: string;
  updatedAt: string;
  content: string;
}

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: string;
}

export default function DocumentationModal({
  isOpen,
  onClose,
  initialDocId
}: DocumentationModalProps) {
  const [docs, setDocs] = useState<DocItem[]>(BUNDLED_TECHNICAL_DOCS as DocItem[]);
  const [categories, setCategories] = useState<{ key: string; name: string }[]>(DOC_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDocId, setSelectedDocId] = useState<string>(BUNDLED_TECHNICAL_DOCS[0]?.id || '01-workspace-git-setup');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedDoc, setCopiedDoc] = useState<boolean>(false);
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDocs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
    }
  }, [initialDocId]);

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/docs');
      const data = await res.json();
      const loadedDocs = data.docs || data.data;
      if (data.success && Array.isArray(loadedDocs) && loadedDocs.length > 0) {
        setDocs(loadedDocs);
        if (data.categories) {
          setCategories(data.categories);
        }
        if (!selectedDocId || !loadedDocs.find((d: DocItem) => d.id === selectedDocId)) {
          setSelectedDocId(loadedDocs[0]?.id || '01-workspace-git-setup');
        }
      }
    } catch (e) {
      console.error('Error fetching documentation:', e);
    }
  };

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchCategory =
        selectedCategory === 'all' || doc.categoryKey === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        doc.category.toLowerCase().includes(q) ||
        doc.content.toLowerCase().includes(q) ||
        doc.filename.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [docs, selectedCategory, searchQuery]);

  const selectedDoc = useMemo(() => {
    return (
      docs.find((d) => d.id === selectedDocId) ||
      filteredDocs[0] ||
      docs[0] ||
      null
    );
  }, [docs, selectedDocId, filteredDocs]);

  const handleCopyMarkdown = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.content);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedDoc.filename || `${selectedDoc.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCodeBlock = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlockId(blockId);
    setTimeout(() => setCopiedBlockId(null), 2000);
  };

  const getCategoryIcon = (categoryKey: string, className = 'w-3.5 h-3.5') => {
    switch (categoryKey) {
      case 'git':
        return <GitBranch className={`${className} text-purple-400`} />;
      case 'ci':
        return <Server className={`${className} text-amber-400`} />;
      case 'security':
        return <ShieldCheck className={`${className} text-emerald-400`} />;
      case 'docker':
        return <Layers className={`${className} text-blue-400`} />;
      case 'k8s':
        return <Cpu className={`${className} text-cyan-400`} />;
      case 'telemetry':
        return <Radio className={`${className} text-orange-400`} />;
      default:
        return <BookOpen className={`${className} text-cyan-400`} />;
    }
  };

  const getCategoryBadgeClass = (categoryKey: string) => {
    switch (categoryKey) {
      case 'git':
        return 'bg-purple-950 text-purple-300 border-purple-500/40';
      case 'ci':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'security':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'docker':
        return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'k8s':
        return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'telemetry':
        return 'bg-orange-950 text-orange-300 border-orange-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const renderInlineFormatted = (text: string) => {
    // Splits inline code `...`, bold **...**, italic *...*
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-[#0E1526] border border-cyan-500/30 text-cyan-300 font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="text-white font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const renderMarkdown = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines: string[] = [];
    let codeBlockCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start / End
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '') || 'bash';
          codeLines = [];
        } else {
          inCodeBlock = false;
          const currentCode = codeLines.join('\n');
          const blockId = `block-${codeBlockCount++}`;
          elements.push(
            <div
              key={`code-${i}`}
              className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#060911] shadow-lg"
            >
              <div className="px-4 py-2 bg-[#090E1A] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase">
                    {codeLanguage}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ({codeLines.length} dòng)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCodeBlock(currentCode, blockId)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition cursor-pointer"
                  title="Sao chép đoạn mã"
                >
                  {copiedBlockId === blockId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto select-text leading-relaxed">
                {currentCode}
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // Heading 1
      if (line.startsWith('# ')) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-xl font-extrabold text-white mt-6 mb-3 pb-2 border-b border-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>{line.replace('# ', '')}</span>
          </h1>
        );
        continue;
      }

      // Heading 2
      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-base font-bold text-cyan-300 mt-5 mb-2.5 flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
            <span>{line.replace('## ', '')}</span>
          </h2>
        );
        continue;
      }

      // Heading 3
      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-sm font-bold text-emerald-300 mt-4 mb-2 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{line.replace('### ', '')}</span>
          </h3>
        );
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-3 pl-3.5 py-1.5 border-l-2 border-cyan-500 bg-cyan-950/20 text-xs text-slate-300 rounded-r-lg italic"
          >
            {renderInlineFormatted(line.replace('> ', ''))}
          </blockquote>
        );
        continue;
      }

      // Bullet List Item
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <div key={`li-${i}`} className="flex items-start gap-2 my-1 pl-2 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
            <div className="flex-1 leading-relaxed">
              {renderInlineFormatted(line.trim().replace(/^[-*]\s+/, ''))}
            </div>
          </div>
        );
        continue;
      }

      // Numbered List Item
      if (/^\d+\.\s+/.test(line.trim())) {
        const numMatch = line.trim().match(/^(\d+)\.\s+/);
        const num = numMatch ? numMatch[1] : '1';
        elements.push(
          <div key={`num-li-${i}`} className="flex items-start gap-2 my-1 pl-2 text-xs text-slate-300">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 shrink-0">
              {num}
            </span>
            <div className="flex-1 leading-relaxed">
              {renderInlineFormatted(line.trim().replace(/^\d+\.\s+/, ''))}
            </div>
          </div>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        continue;
      }

      // Standard paragraph
      elements.push(
        <p key={`p-${i}`} className="text-xs text-slate-300 leading-relaxed my-2">
          {renderInlineFormatted(line)}
        </p>
      );
    }

    return <div className="space-y-1">{elements}</div>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0B101E] border border-cyan-500/40 rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#080C17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Trung Tâm Tài Liệu & Hướng Dẫn Cấu Hình Chi Tiết
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  ZERO EMOJI • 100% SPEC
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Cẩm nang hướng dẫn chuẩn chỉ cho Git, Jenkins CI, 3 Cổng Bảo Mật, Docker, ArgoCD K8s và Giám Sát.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal 2-Column Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* CỘT TRÁI: Tìm kiếm + Bộ lọc Category + Danh sách tài liệu */}
          <div className="w-full lg:w-80 border-r border-slate-800 bg-[#080D1A] flex flex-col overflow-hidden shrink-0">
            
            {/* Search Box */}
            <div className="p-3 border-b border-slate-800 space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tài liệu, lệnh, công cụ..."
                  className="w-full bg-[#0E1526] border border-slate-700 rounded-xl pl-8 pr-7 py-1.5 text-xs text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-[#0E1526] text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat.key !== 'all' && getCategoryIcon(cat.key, 'w-3 h-3')}
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Document Items List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <RefreshCw className="w-5 h-5 animate-spin text-cyan-400 mb-2" />
                  <span>Đang tải danh mục tài liệu...</span>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs px-4">
                  <Folder className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                  <p>Không tìm thấy tài liệu phù hợp</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-cyan-400 underline font-bold cursor-pointer"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`w-full text-left p-3 rounded-xl transition border group relative cursor-pointer ${
                        isSelected
                          ? 'bg-[#10192E] border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                          : 'bg-[#0A0F1D] border-slate-800 hover:border-slate-700 hover:bg-[#0E1528]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(doc.categoryKey)}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border ${getCategoryBadgeClass(
                              doc.categoryKey
                            )}`}
                          >
                            {doc.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{doc.readTime}</span>
                        </div>
                      </div>

                      <h4
                        className={`text-xs font-bold transition line-clamp-1 ${
                          isSelected ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {doc.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-normal font-sans">
                        {doc.summary}
                      </p>

                      {isSelected && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-400 rounded-full" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* List Footer Count */}
            <div className="p-2.5 border-t border-slate-800 bg-[#070B14] text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Tổng: <strong>{filteredDocs.length}</strong> / {docs.length} tài liệu</span>
              <span className="text-emerald-400 font-semibold">100% Offline Ready</span>
            </div>
          </div>

          {/* CỘT PHẢI: Trình đọc Markdown chi tiết + Nút Sao chép & Tải tệp .md */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#060911]">
            
            {selectedDoc ? (
              <>
                {/* Doc Top Bar Header */}
                <div className="px-6 py-3.5 border-b border-slate-800 bg-[#090E1A] flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      {getCategoryIcon(selectedDoc.categoryKey, 'w-4 h-4')}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{selectedDoc.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border shrink-0 ${getCategoryBadgeClass(
                            selectedDoc.categoryKey
                          )}`}
                        >
                          {selectedDoc.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="text-cyan-300 font-bold">{selectedDoc.filename}</span>
                        <span>•</span>
                        <span>Đọc trong {selectedDoc.readTime}</span>
                        <span>•</span>
                        <span>Cập nhật: {selectedDoc.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Sao chép & Tải về */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyMarkdown}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
                      title="Sao chép toàn bộ tài liệu Markdown"
                    >
                      {copiedDoc ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadMarkdown}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 shadow-md shadow-cyan-500/20 transition cursor-pointer"
                      title="Tải tệp Markdown (.md) về máy tính"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải tệp .md về máy</span>
                    </button>
                  </div>
                </div>

                {/* Markdown Reader Body */}
                <div className="p-6 overflow-y-auto flex-1 text-slate-200 select-text">
                  <div className="max-w-3xl mx-auto">
                    {renderMarkdown(selectedDoc.content)}
                  </div>
                </div>

                {/* Right Bottom Footer */}
                <div className="px-6 py-2.5 border-t border-slate-800 bg-[#080C17] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Tài liệu tiêu chuẩn DevOps & 3 Cổng Bảo Mật Antigravity</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Dung lượng: {new Blob([selectedDoc.content]).size} bytes
                  </span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
                <FileText className="w-10 h-10 text-slate-600 mb-3" />
                <p>Vui lòng chọn tài liệu từ danh sách bên trái để đọc nội dung</p>
              </div>
            )}

          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080C17] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono">Tài liệu đã chọn: <strong className="text-cyan-300">{selectedDoc?.title || 'Chưa chọn'}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
