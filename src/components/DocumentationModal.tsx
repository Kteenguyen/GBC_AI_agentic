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
  theme?: 'light' | 'dark';
}

export default function DocumentationModal({
  isOpen,
  onClose,
  initialDocId,
  theme = 'light'
}: DocumentationModalProps) {
  const isLight = theme === 'light';
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
          const formattedCats = data.categories.map((c: any) => ({
            key: c.key,
            name: c.label
          }));
          setCategories(formattedCats);
        }
      }
    } catch (e) {
      console.warn('Dùng dữ liệu tài liệu bundled dự phòng', e);
    }
  };

  // Filtered docs based on category and search
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchCategory =
        selectedCategory === 'all' || doc.categoryKey === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleCopyFullDoc = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.content);
    setCopiedDoc(true);
    setTimeout(() => setCopiedDoc(false), 2000);
  };

  const handleCopyCodeBlock = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlockId(blockId);
    setTimeout(() => setCopiedBlockId(null), 2000);
  };

  const handleDownloadDoc = () => {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], {
      type: 'text/markdown;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedDoc.filename || `${selectedDoc.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const getCategoryIcon = (categoryKey: string, className = 'w-3.5 h-3.5') => {
    switch (categoryKey) {
      case 'git':
        return <GitBranch className={`${className} ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />;
      case 'ci':
        return <Server className={`${className} ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />;
      case 'security':
        return <ShieldCheck className={`${className} ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />;
      case 'docker':
        return <Layers className={`${className} ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />;
      case 'k8s':
        return <Cpu className={`${className} ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />;
      case 'telemetry':
        return <Radio className={`${className} ${isLight ? 'text-orange-600' : 'text-orange-400'}`} />;
      default:
        return <BookOpen className={`${className} ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />;
    }
  };

  const getCategoryBadgeClass = (categoryKey: string) => {
    if (isLight) {
      switch (categoryKey) {
        case 'git': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'ci': return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'security': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'docker': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'k8s': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
        case 'telemetry': return 'bg-orange-50 text-orange-700 border-orange-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    }
    switch (categoryKey) {
      case 'git': return 'bg-purple-950 text-purple-300 border-purple-500/40';
      case 'ci': return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'security': return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'docker': return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'k8s': return 'bg-cyan-950 text-cyan-300 border-cyan-500/40';
      case 'telemetry': return 'bg-orange-950 text-orange-300 border-orange-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const renderInlineFormatted = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className={`px-1.5 py-0.5 rounded border font-mono text-[11px] ${
              isLight ? 'bg-[#FAF8F5] border-[#E2DDD5] text-blue-700' : 'bg-[#0E1526] border-cyan-500/30 text-cyan-300'
            }`}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
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
              className={`my-4 rounded-xl overflow-hidden border shadow-sm ${
                isLight ? 'border-[#E2DDD5] bg-[#FAF8F5]' : 'border-slate-800 bg-[#060911]'
              }`}
            >
              <div className={`px-4 py-2 border-b flex items-center justify-between ${
                isLight ? 'bg-[#EFECE6] border-[#E2DDD5]' : 'bg-[#090E1A] border-slate-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Terminal className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                  <span className={`text-[11px] font-mono font-bold uppercase ${
                    isLight ? 'text-blue-800' : 'text-cyan-300'
                  }`}>
                    {codeLanguage}
                  </span>
                  <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                    ({codeLines.length} dòng)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCodeBlock(currentCode, blockId)}
                  className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded transition cursor-pointer border ${
                    isLight 
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-[#E2DDD5]' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="Sao chép đoạn mã"
                >
                  {copiedBlockId === blockId ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
              <pre className={`p-4 text-[11.5px] font-mono overflow-x-auto leading-relaxed ${
                isLight ? 'text-slate-900 bg-[#FAF8F5]' : 'text-slate-200 bg-[#060911]'
              }`}>
                <code>{currentCode}</code>
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

      if (line.trim() === '') {
        elements.push(<div key={`space-${i}`} className="h-3" />);
        continue;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className={`text-lg sm:text-xl font-extrabold pb-2 border-b my-4 tracking-tight ${
              isLight ? 'text-slate-900 border-[#E2DDD5]' : 'text-white border-slate-800'
            }`}
          >
            {line.replace('# ', '')}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className={`text-sm sm:text-base font-bold my-3 flex items-center gap-2 ${
              isLight ? 'text-blue-800' : 'text-cyan-300'
            }`}
          >
            <span className="w-1.5 h-4 rounded-full bg-blue-600" />
            <span>{line.replace('## ', '')}</span>
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className={`text-xs sm:text-sm font-bold my-2 ${
              isLight ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            {line.replace('### ', '')}
          </h3>
        );
        continue;
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <div
            key={`li-${i}`}
            className={`flex items-start gap-2 text-xs leading-relaxed my-1 pl-2 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            <span className={`mt-1 text-[8px] ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}>●</span>
            <div>{renderInlineFormatted(itemText)}</div>
          </div>
        );
        continue;
      }

      elements.push(
        <p
          key={`p-${i}`}
          className={`text-xs sm:text-[12.5px] leading-relaxed my-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          {renderInlineFormatted(line)}
        </p>
      );
    }

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className={`w-full max-w-6xl h-[92vh] max-h-[880px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition ${
        isLight ? 'bg-white border-[#E2DDD5] text-slate-900' : 'bg-[#0B0F19] border-slate-800 text-slate-100'
      }`}>
        {/* Modal Top Header */}
        <div className={`px-5 py-3.5 border-b flex items-center justify-between gap-4 shrink-0 ${
          isLight ? 'bg-[#EFECE6] border-[#E2DDD5]' : 'bg-[#090E1A] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs border ${
              isLight ? 'bg-white text-blue-600 border-[#E2DDD5]' : 'bg-[#10192E] text-cyan-400 border-cyan-500/30'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-sm sm:text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Cẩm Nang Hướng Dẫn Kỹ Thuật & Cấu Hình Hạ Tầng
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  DOCS HUB
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Kho tài liệu chuẩn hóa 8 khâu DevOps, bảo mật OWASP, SonarQube, Trivy, Docker, ArgoCD, Prometheus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition cursor-pointer border ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 text-slate-600 border-[#E2DDD5]' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal 2-Column Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* CỘT TRÁI: Tìm kiếm + Bộ lọc Category + Danh sách tài liệu */}
          <div className={`w-full lg:w-80 border-r flex flex-col overflow-hidden shrink-0 ${
            isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#080D1A] border-slate-800'
          }`}>
            
            {/* Search Box */}
            <div className={`p-3 border-b space-y-2.5 ${isLight ? 'border-[#E2DDD5] bg-white' : 'border-slate-800'}`}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tài liệu, lệnh, công cụ..."
                  className={`w-full rounded-xl pl-8 pr-7 py-1.5 text-xs outline-hidden border ${
                    isLight 
                      ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 placeholder-slate-400 focus:border-blue-500' 
                      : 'bg-[#0E1526] border-slate-700 text-cyan-300 placeholder-slate-500 focus:border-cyan-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                        isActive
                          ? (isLight ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20')
                          : (isLight ? 'bg-[#FAF8F5] text-slate-700 hover:bg-slate-100 border-[#E2DDD5]' : 'bg-[#0E1526] text-slate-400 hover:text-slate-200 border-slate-800')
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
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600 dark:text-cyan-400 mb-2" />
                  <span>Đang tải danh mục tài liệu...</span>
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs px-4">
                  <Folder className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p>Không tìm thấy tài liệu phù hợp</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className={`mt-2 underline font-bold cursor-pointer ${isLight ? 'text-blue-600' : 'text-cyan-400'}`}
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
                      className={`w-full text-left p-3 rounded-xl transition border group relative cursor-pointer shadow-xs ${
                        isSelected
                          ? (isLight ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-400/20 text-blue-950' : 'bg-[#10192E] border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40')
                          : (isLight ? 'bg-white border-[#E2DDD5] hover:bg-slate-50 text-slate-800' : 'bg-[#0A0F1D] border-slate-800 hover:border-slate-700 hover:bg-[#0E1528]')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {getCategoryIcon(doc.categoryKey)}
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold font-mono border uppercase ${getCategoryBadgeClass(
                              doc.categoryKey
                            )}`}
                          >
                            {doc.category}
                          </span>
                        </div>
                        <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          {doc.readTime || '5 phút'}
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold transition line-clamp-1 ${
                          isSelected
                            ? (isLight ? 'text-blue-700' : 'text-cyan-300')
                            : (isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-200 group-hover:text-white')
                        }`}
                      >
                        {doc.title}
                      </h4>

                      <p className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        {doc.summary}
                      </p>

                      <div className={`flex items-center justify-between mt-2 pt-1.5 border-t text-[10px] font-mono ${
                        isLight ? 'border-slate-100 text-slate-400' : 'border-slate-800/80 text-slate-500'
                      }`}>
                        <span className="truncate">{doc.filename}</span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition group-hover:translate-x-1 ${
                            isSelected ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT PHẢI: Trình đọc Markdown chi tiết + Thanh công cụ Action */}
          <div className={`flex-1 flex flex-col overflow-hidden ${
            isLight ? 'bg-white' : 'bg-[#0B0F19]'
          }`}>
            {selectedDoc ? (
              <>
                {/* Document Top Bar */}
                <div className={`px-6 py-3 border-b flex items-center justify-between gap-4 flex-wrap shrink-0 ${
                  isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0E1528] border-slate-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getCategoryBadgeClass(
                        selectedDoc.categoryKey
                      )}`}
                    >
                      {selectedDoc.category}
                    </span>
                    <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {selectedDoc.filename}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Nút Sao chép toàn bộ Markdown */}
                    <button
                      type="button"
                      onClick={handleCopyFullDoc}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer active:scale-95 shadow-xs ${
                        copiedDoc
                          ? (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-500')
                          : (isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-[#E2DDD5]' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700')
                      }`}
                      title="Sao chép toàn bộ nội dung tài liệu (.md)"
                    >
                      {copiedDoc ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép .md</span>
                        </>
                      )}
                    </button>

                    {/* Nút Tải file .md */}
                    <button
                      type="button"
                      onClick={handleDownloadDoc}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer active:scale-95 shadow-xs ${
                        isLight 
                          ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' 
                          : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border-cyan-700/60'
                      }`}
                      title="Tải tệp tài liệu Markdown về máy"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về .md</span>
                    </button>
                  </div>
                </div>

                {/* Markdown Reader Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
                  <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed mb-4 shadow-xs ${
                    isLight 
                      ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
                      : 'bg-[#101A30] border-cyan-500/30 text-cyan-200'
                  }`}>
                    <span className="font-bold">Tóm tắt tài liệu:</span> {selectedDoc.summary}
                  </div>

                  {renderMarkdown(selectedDoc.content)}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <FileText className="w-12 h-12 text-slate-400 mb-3" />
                <p className="text-sm font-bold">Chọn một tài liệu bên cột trái để xem hướng dẫn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
