"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  FileText, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  FolderGit2, 
  ShieldCheck, 
  Container, 
  Activity, 
  ArrowLeft,
  Plus,
  RefreshCw,
  Cpu,
  Boxes,
  Sun,
  Moon,
  Sparkles,
  X,
  ChevronDown,
  ChevronRight,
  Menu,
  ArrowRight,
  HelpCircle,
  Bot
} from "lucide-react";
import { 
  TechnicalDoc, 
  DOC_ACCORDION_GROUPS, 
  BUNDLED_TECHNICAL_DOCS,
  DocAccordionGroup 
} from "@/lib/docsData";
import { MarkdownDocViewer } from "@/components/MarkdownDocViewer";

interface ProjectItem {
  id: string;
  name: string;
  repo: string;
  branch: string;
  isCurrent: boolean;
}

const AVAILABLE_PROJECTS: ProjectItem[] = [
  { id: "workflow", name: "Workflow (GBC_AI_agentic)", repo: "https://github.com/Kteenguyen/GBC_AI_agentic.git", branch: "main", isCurrent: true },
  { id: "global-api", name: "Global Code Backend API", repo: "https://github.com/Kteenguyen/global-api-core.git", branch: "main", isCurrent: false },
  { id: "mobile-copilot", name: "AI Agentic Mobile Copilot", repo: "https://github.com/Kteenguyen/mobile-copilot.git", branch: "main", isCurrent: false },
];

export default function DocsHubPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('app_theme') as 'light' | 'dark';
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const isLight = theme === 'light';

  const [selectedProjectId, setSelectedProjectId] = useState<string>("workflow");
  const [docs, setDocs] = useState<TechnicalDoc[]>(BUNDLED_TECHNICAL_DOCS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDocId, setSelectedDocId] = useState<string>(
    BUNDLED_TECHNICAL_DOCS[0]?.id || "00-project-blueprint-and-workflow-architecture"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Accordion open/close state: All open by default
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    OVERVIEW: true,
    AI_SQUAD: true,
    GIT_CI: true,
    DEVSECOPS: true,
    DOCKER_K8S: true,
    MONITORING: true,
    FAQ_TROUBLESHOOTING: true,
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Form State for Adding New Doc
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Kiến Trúc & Đội Ngũ");
  const [newCategoryKey, setNewCategoryKey] = useState("architecture");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch docs from API if available
  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/docs?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (data.success && data.docs && data.docs.length > 0) {
        setDocs(data.docs);
        if (!data.docs.find((d: TechnicalDoc) => d.id === selectedDocId)) {
          setSelectedDocId(data.docs[0].id);
        }
      }
    } catch (err) {
      console.warn("Dùng tài liệu tĩnh có sẵn:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedProjectId]);

  // Selected Doc Object
  const selectedDoc = useMemo(() => {
    return docs.find(d => d.id === selectedDocId) || docs[0] || null;
  }, [docs, selectedDocId]);

  // Grouped Docs Map for NestJS Sidebar
  const docsByGroup = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result: Record<string, TechnicalDoc[]> = {};

    DOC_ACCORDION_GROUPS.forEach(group => {
      const matched = docs.filter(doc => {
        const belongsToGroup = group.docIds.includes(doc.id) || 
          (group.key === 'DEVSECOPS' && doc.categoryKey === 'security') ||
          (group.key === 'GIT_CI' && (doc.categoryKey === 'git' || doc.categoryKey === 'ci')) ||
          (group.key === 'DOCKER_K8S' && (doc.categoryKey === 'docker' || doc.categoryKey === 'k8s')) ||
          (group.key === 'MONITORING' && doc.categoryKey === 'monitoring') ||
          (group.key === 'OVERVIEW' && doc.categoryKey === 'architecture');

        if (!belongsToGroup) return false;

        if (!query) return true;
        return (
          doc.title.toLowerCase().includes(query) ||
          doc.summary.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query) ||
          doc.tags?.some(t => t.toLowerCase().includes(query))
        );
      });

      result[group.key] = matched;
    });

    return result;
  }, [docs, searchQuery]);

  // Extract Heading 2 anchors from current doc for Quick Jump Pills
  const onPageHeadings = useMemo(() => {
    if (!selectedDoc) return [];
    const lines = selectedDoc.content.split("\n");
    const headings: Array<{ id: string; title: string }> = [];

    lines.forEach(line => {
      if (line.startsWith("## ")) {
        const title = line.replace(/^## /, "").trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 50);
        headings.push({ id, title });
      }
    });

    return headings;
  }, [selectedDoc]);

  // Previous and Next Doc for Pagination Footer
  const { prevDoc, nextDoc } = useMemo(() => {
    if (!selectedDoc) return { prevDoc: null, nextDoc: null };
    const currentIndex = docs.findIndex(d => d.id === selectedDoc.id);
    return {
      prevDoc: currentIndex > 0 ? docs[currentIndex - 1] : null,
      nextDoc: currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null
    };
  }, [docs, selectedDoc]);

  const handleCopyContent = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedDoc.filename || `${selectedDoc.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const tagsArray = newTags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title: newTitle.trim(),
        category: newCategory,
        categoryKey: newCategoryKey,
        summary: newSummary.trim() || newTitle.trim(),
        content: newContent.trim(),
        tags: tagsArray.length > 0 ? tagsArray : ["Docs", newCategoryKey],
        projectId: selectedProjectId
      };

      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.doc) {
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewSummary("");
        setNewContent("");
        setNewTags("");
        await fetchDocs();
        setSelectedDocId(data.doc.id);
      }
    } catch (err) {
      console.error("Lỗi tạo tài liệu mới:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGroupIcon = (key: string) => {
    switch (key) {
      case "OVERVIEW": return <BookOpen className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />;
      case "AI_SQUAD": return <Bot className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />;
      case "GIT_CI": return <FolderGit2 className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />;
      case "DEVSECOPS": return <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />;
      case "DOCKER_K8S": return <Container className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />;
      case "MONITORING": return <Activity className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />;
      case "FAQ_TROUBLESHOOTING": return <HelpCircle className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`} />;
      default: return <FileText className={`w-3.5 h-3.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`} />;
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isLight ? 'bg-[#F7F5F0] text-slate-900' : 'bg-[#07090E] text-slate-100'
    }`}>
      {/* Top Header Bar */}
      <header className={`sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap border-b backdrop-blur-md transition-colors ${
        isLight ? 'bg-[#FAF8F5]/95 border-[#E2DDD5]' : 'bg-[#0B0F19]/90 border-slate-800/80'
      }`}>
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(prev => !prev)}
            className={`lg:hidden p-1.5 rounded-xl border transition ${
              isLight ? 'bg-white border-[#E2DDD5] text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
            title="Mở menu danh mục"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 shadow-xs ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-800 border-[#E2DDD5]' 
                : 'bg-slate-900 border-slate-700/80 hover:bg-slate-800 text-slate-200'
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">Trở Về Canvas</span>
            <span className="sm:hidden">Canvas</span>
          </Link>

          <div className={`h-4 w-px hidden sm:block ${isLight ? 'bg-[#E2DDD5]' : 'bg-slate-800'}`} />

          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
              isLight ? 'bg-gradient-to-tr from-blue-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-600 to-blue-600'
            }`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className={`text-xs sm:text-sm font-extrabold tracking-tight flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>Tài Liệu Kỹ Thuật (Docs Hub)</span>
                <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono border font-bold ${
                  isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  NESTJS STYLE
                </span>
              </h1>
              <p className={`text-[10.5px] hidden md:block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                100% Tiếng Việt • Kiến trúc, Pipeline, 3 Cổng Bảo Mật & 13 Subagents
              </p>
            </div>
          </div>
        </div>

        {/* Project Selector, Theme Toggle & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <Cpu className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span className={`text-[11px] font-semibold hidden sm:inline ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Dự Án:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className={`bg-transparent text-xs font-bold focus:outline-none cursor-pointer ${
                isLight ? 'text-slate-900' : 'text-slate-200'
              }`}
            >
              {AVAILABLE_PROJECTS.map((p) => (
                <option key={p.id} value={p.id} className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-200'}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(curr => curr === 'light' ? 'dark' : 'light')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition shadow-xs cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-amber-800 border-[#E2DDD5]' 
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
            }`}
            title="Chuyển đổi giao diện Sáng / Tối"
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />
                <span className="hidden sm:inline">Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Tối</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm Bài Mới</span>
          </button>
        </div>
      </header>

      {/* 2-Column Body Layout (NestJS Style) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Accordion Group Tree */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-72 sm:w-80 lg:min-w-[300px] lg:max-w-[320px]
          transform transition-transform duration-200 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r flex flex-col shrink-0
          ${isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0B0F19] border-slate-800/80'}
        `}>
          {/* Search Box inside Sidebar */}
          <div className={`p-3 border-b ${isLight ? 'border-[#E2DDD5] bg-white' : 'border-slate-800/80 bg-[#0E1528]'}`}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu & từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-1.5 rounded-xl text-xs transition outline-hidden border ${
                  isLight 
                    ? 'bg-[#F7F5F0] border-[#E2DDD5] text-slate-900 placeholder-slate-400 focus:border-blue-500' 
                    : 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-cyan-500'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Accordion List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {DOC_ACCORDION_GROUPS.map((group) => {
              const groupDocs = docsByGroup[group.key] || [];
              const isExpanded = expandedGroups[group.key] ?? true;

              // Hide empty groups when searching
              if (searchQuery && groupDocs.length === 0) return null;

              return (
                <div key={group.key} className="rounded-xl overflow-hidden">
                  {/* Group Header (Clickable Accordion) */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left transition cursor-pointer font-bold text-[11px] uppercase tracking-wider ${
                      isLight 
                        ? 'hover:bg-[#EFECE6] text-slate-700' 
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getGroupIcon(group.key)}
                      <span className="truncate">{group.title}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                        isLight ? 'bg-white border-[#E2DDD5] text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}>
                        {groupDocs.length}
                      </span>
                    </div>

                    <div className="text-slate-400 shrink-0">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                  </button>

                  {/* Group Items (Child Docs) */}
                  {isExpanded && (
                    <div className="mt-1 pl-2 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-800 ml-4">
                      {groupDocs.length === 0 ? (
                        <div className="px-3 py-1.5 text-[11px] text-slate-400 italic">
                          Chưa có tài liệu
                        </div>
                      ) : (
                        groupDocs.map((doc) => {
                          const isSelected = selectedDocId === doc.id;
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => {
                                setSelectedDocId(doc.id);
                                setIsMobileSidebarOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition cursor-pointer flex items-center justify-between gap-2 relative ${
                                isSelected
                                  ? (isLight 
                                      ? 'bg-blue-50/90 text-blue-700 font-bold border border-blue-200/80 shadow-xs' 
                                      : 'bg-cyan-950/40 text-cyan-300 font-bold border border-cyan-800/60 shadow-xs')
                                  : (isLight 
                                      ? 'text-slate-700 hover:text-slate-950 hover:bg-[#EFECE6]/60' 
                                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60')
                              }`}
                            >
                              {/* NestJS Style Vertical Accent Indicator */}
                              {isSelected && (
                                <span className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full ${
                                  isLight ? 'bg-blue-600' : 'bg-cyan-400'
                                }`} />
                              )}

                              <span className="truncate leading-tight pl-1.5">
                                {doc.title}
                              </span>

                              {doc.readTime && (
                                <span className={`text-[10px] font-mono shrink-0 ${
                                  isSelected ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'
                                }`}>
                                  {doc.readTime}
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Mobile Backdrop Overlay */}
        {isMobileSidebarOpen && (
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-20 lg:hidden"
          />
        )}

        {/* Right Main Content Area: Maximum Width Reading Canvas */}
        <main className={`flex-1 flex flex-col overflow-y-auto transition-colors ${
          isLight ? 'bg-[#F7F5F0]' : 'bg-[#07090E]'
        }`}>
          {selectedDoc ? (
            <div className="flex-1 flex flex-col">
              {/* Document Header & Meta */}
              <div className={`px-6 sm:px-10 py-6 border-b transition-colors ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0B0F19] border-slate-800/80'
              }`}>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mb-2 flex-wrap">
                  <Link href="/" className="hover:underline">Workflow</Link>
                  <span>/</span>
                  <span>Tài Liệu</span>
                  <span>/</span>
                  <span className={isLight ? 'text-blue-700' : 'text-cyan-400'}>{selectedDoc.category}</span>
                </div>

                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-2 max-w-3xl">
                    <h1 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {selectedDoc.title}
                    </h1>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                      <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono border ${
                        isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {selectedDoc.category}
                      </span>
                      {selectedDoc.readTime && (
                        <span>• Thời gian đọc: {selectedDoc.readTime}</span>
                      )}
                      <span>• Tệp: {selectedDoc.filename}</span>
                    </div>
                  </div>

                  {/* Actions: Copy Markdown & Download */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 shadow-xs ${
                        isLight 
                          ? 'bg-[#FAF8F5] hover:bg-slate-100 text-slate-800 border-[#E2DDD5]' 
                          : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isCopied ? "Đã Sao Chép" : "Sao Chép"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadMd}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer active:scale-95 shadow-xs ${
                        isLight 
                          ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' 
                          : 'bg-cyan-950/60 border-cyan-700/60 hover:bg-cyan-900/80 text-cyan-300'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải .md</span>
                    </button>
                  </div>
                </div>

                {/* On-Page Quick Jump Pills */}
                {onPageHeadings.length > 0 && (
                  <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <span>Mục Lục Đề Mục Nhanh:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {onPageHeadings.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => scrollToSection(h.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                            isLight 
                              ? 'bg-[#FAF8F5] hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border-[#E2DDD5] text-slate-700' 
                              : 'bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 hover:border-cyan-700/60 border-slate-800 text-slate-300'
                          }`}
                        >
                          #{h.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Reading Canvas */}
              <div className="px-6 sm:px-10 py-8 max-w-4xl w-full">
                <MarkdownDocViewer content={selectedDoc.content} isLight={isLight} />

                {/* Pagination Footer */}
                <div className={`mt-12 pt-6 border-t flex items-center justify-between gap-4 flex-wrap ${
                  isLight ? 'border-[#E2DDD5]' : 'border-slate-800'
                }`}>
                  {prevDoc ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDocId(prevDoc.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition cursor-pointer max-w-[48%] shadow-xs ${
                        isLight 
                          ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' 
                          : 'bg-[#0B0F19] hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <ArrowLeft className="w-3 h-3" /> Bài Trước
                      </span>
                      <span className={`text-xs font-extrabold truncate w-full mt-1 ${
                        isLight ? 'text-blue-700' : 'text-cyan-300'
                      }`}>
                        {prevDoc.title}
                      </span>
                    </button>
                  ) : <div />}

                  {nextDoc && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDocId(nextDoc.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex flex-col items-end p-3.5 rounded-xl border text-right transition cursor-pointer max-w-[48%] ml-auto shadow-xs ${
                        isLight 
                          ? 'bg-white hover:bg-slate-50 border-[#E2DDD5]' 
                          : 'bg-[#0B0F19] hover:bg-slate-900 border-slate-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        Bài Tiếp Theo <ArrowRight className="w-3 h-3" />
                      </span>
                      <span className={`text-xs font-extrabold truncate w-full mt-1 ${
                        isLight ? 'text-blue-700' : 'text-cyan-300'
                      }`}>
                        {nextDoc.title}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <BookOpen className="w-12 h-12 stroke-1 text-slate-400 mb-3" />
              <p className={`text-sm font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Chọn một bài viết trong danh mục để đọc</p>
            </div>
          )}
        </main>
      </div>

      {/* Add New Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border p-5 sm:p-6 shadow-2xl ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0B0F19] border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600 dark:text-cyan-400">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Tạo Tài Liệu Kỹ Thuật Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3 mt-4 text-xs">
              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Tiêu Đề Tài Liệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hướng dẫn cấu hình ArgoCD GitOps & Kubernetes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl outline-hidden ${
                    isLight 
                      ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nhóm Danh Mục</label>
                  <select
                    value={newCategoryKey}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewCategoryKey(val);
                      if (val === "architecture") setNewCategory("Kiến Trúc & Đội Ngũ");
                      else if (val === "git") setNewCategory("Git & Quản Lý Mã Nguồn");
                      else if (val === "ci") setNewCategory("CI / CD Tự Động Hóa");
                      else if (val === "security") setNewCategory("Bảo Mật & Quét Lỗ Hổng");
                      else if (val === "docker") setNewCategory("Đóng Gói Container");
                      else if (val === "k8s") setNewCategory("Kubernetes & GitOps");
                      else if (val === "monitoring") setNewCategory("Giám Sát & Cảnh Báo");
                    }}
                    className={`w-full px-3 py-2 border rounded-xl outline-hidden ${
                      isLight 
                        ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                        : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                    }`}
                  >
                    <option value="architecture">Kiến Trúc & Đội Ngũ</option>
                    <option value="git">Git & Quản Lý Mã Nguồn</option>
                    <option value="ci">CI / CD Tự Động Hóa</option>
                    <option value="security">Bảo Mật & Quét Lỗ Hổng</option>
                    <option value="docker">Đóng Gói Container</option>
                    <option value="k8s">Kubernetes & GitOps</option>
                    <option value="monitoring">Giám Sát & Cảnh Báo</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Thẻ Tags (cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="GitOps, ArgoCD, Kubernetes, YAML"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl outline-hidden ${
                      isLight 
                        ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                        : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Tóm Tắt Ngắn</label>
                <input
                  type="text"
                  placeholder="Tóm tắt mục đích chính của tài liệu trong 1-2 câu"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl outline-hidden ${
                    isLight 
                      ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-bold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nội Dung Markdown *</label>
                <textarea
                  required
                  rows={8}
                  placeholder="# Tiêu Đề Bài Viết&#10;&#10;Nội dung hướng dẫn chi tiết từng bước, cấu hình, mã lệnh terminal..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className={`w-full p-3 border rounded-xl font-mono text-[11px] leading-relaxed outline-hidden ${
                    isLight 
                      ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-200 focus:border-cyan-500'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-2 border-t ${
                isLight ? 'border-[#E2DDD5]' : 'border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border font-bold ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? "Đang Lưu..." : "Lưu Tài Liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
