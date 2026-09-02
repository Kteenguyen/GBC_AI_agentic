"use client";

import React, { useState, useEffect } from "react";
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
  X
} from "lucide-react";
import { TechnicalDoc } from "@/lib/docsData";

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
  const [selectedProjectId, setSelectedProjectId] = useState<string>("workflow");
  const [docs, setDocs] = useState<TechnicalDoc[]>([]);
  const [categories, setCategories] = useState<Array<{ key: string; label: string; count?: number }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<TechnicalDoc | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Doc Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Kiến Trúc & Đội Ngũ");
  const [newCategoryKey, setNewCategoryKey] = useState("architecture");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/docs?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (data.success && data.docs) {
        setDocs(data.docs);
        if (data.categories) setCategories(data.categories);
        if (!selectedDoc && data.docs.length > 0) {
          setSelectedDoc(data.docs[0]);
        }
      }
    } catch (err) {
      console.error("Lỗi tải danh mục tài liệu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [selectedProjectId]);

  const filteredDocs = docs.filter(doc => {
    const matchesCategory = selectedCategory === "all" || doc.categoryKey === selectedCategory;
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
    a.download = selectedDoc.filename || `${selectedDoc.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          categoryKey: newCategoryKey,
          summary: newSummary,
          content: newContent,
          tags: newTags.split(",").map(t => t.trim()).filter(Boolean),
          projectId: selectedProjectId
        })
      });
      const data = await res.json();
      if (data.success && data.doc) {
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewSummary("");
        setNewContent("");
        setNewTags("");
        await fetchDocs();
        setSelectedDoc(data.doc);
      }
    } catch (err) {
      console.error("Lỗi tạo tài liệu mới:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case "architecture": return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      case "git": return <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />;
      case "ci": return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      case "security": return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
      case "docker": return <Container className="w-3.5 h-3.5 text-cyan-400" />;
      case "kubernetes": return <Boxes className="w-3.5 h-3.5 text-indigo-400" />;
      case "monitoring": return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trở Về Bàn Điều Khiển</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>Trung Tâm Tài Liệu Dự Án Đa Nền Tảng</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  DOCS HUB
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Quản lý & tra cứu tài liệu kiến trúc, CI/CD, bảo mật và chỉ thị Agent Squad
              </p>
            </div>
          </div>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl text-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-slate-400 font-semibold">Dự Án:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              {AVAILABLE_PROJECTS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.name} {p.isCurrent ? "(Hiện Tại)" : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Tài Liệu Mới</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Filters & Doc List */}
        <aside className="w-full lg:w-80 lg:min-w-[320px] bg-[#0A0E17] border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col shrink-0">
          {/* Search Box */}
          <div className="p-3 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu, lệnh, từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="p-3 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              Tất Cả ({docs.length})
            </button>
            {categories.filter(c => c.key !== "all").map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  selectedCategory === cat.key
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {getCategoryIcon(cat.key)}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[35vh] lg:max-h-none">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Đang tải danh mục tài liệu...</span>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Không tìm thấy tài liệu phù hợp với từ khóa.
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "bg-cyan-950/40 border-cyan-500/50 shadow-sm"
                        : "bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {getCategoryIcon(doc.categoryKey)}
                        <span className="text-[11px] font-bold text-slate-400 truncate">
                          {doc.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        #{String(doc.order).padStart(2, "0")}
                      </span>
                    </div>

                    <div className={`text-xs font-bold line-clamp-1 ${
                      isSelected ? "text-cyan-300" : "text-slate-200"
                    }`}>
                      {doc.title}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>

                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.tags.slice(0, 3).map((tag: string, tIdx: number) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.2 rounded text-[9.5px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Reader Area */}
        <main className="flex-1 flex flex-col bg-[#07090E] overflow-hidden">
          {selectedDoc ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Doc Title & Action Bar */}
              <div className="px-5 py-3.5 bg-[#0B0F19] border-b border-slate-800/80 flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {selectedDoc.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Tệp: {selectedDoc.filename}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    {selectedDoc.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold transition cursor-pointer active:scale-95"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{isCopied ? "Đã Sao Chép" : "Sao Chép"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadMd}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-700/60 hover:bg-cyan-900/80 text-cyan-300 text-xs font-bold transition cursor-pointer active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải Về .md</span>
                  </button>
                </div>
              </div>

              {/* Doc Content Viewer */}
              <div className="flex-1 p-5 sm:p-8 overflow-y-auto max-w-5xl space-y-6">
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200/90 leading-relaxed">
                  <span className="font-bold text-cyan-300">Tóm tắt tài liệu:</span> {selectedDoc.summary}
                </div>

                <div className="prose prose-invert max-w-none text-xs sm:text-[13px] leading-relaxed font-sans space-y-4 text-slate-200">
                  <pre className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 text-slate-200 font-mono text-[11px] sm:text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {selectedDoc.content}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <BookOpen className="w-12 h-12 stroke-1 text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-400">Chọn một tài liệu để bắt đầu đọc</p>
            </div>
          )}
        </main>
      </div>

      {/* Add New Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0E1526] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-extrabold text-white">Thêm Tài Liệu Kỹ Thuật Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Tiêu Đề Tài Liệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hướng dẫn cấu hình Redis Cluster & Cache RLS"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Chuyên Mục</label>
                  <select
                    value={newCategoryKey}
                    onChange={(e) => {
                      setNewCategoryKey(e.target.value);
                      const matched = categories.find(c => c.key === e.target.value);
                      if (matched) setNewCategory(matched.label);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="architecture">Kiến Trúc & Đội Ngũ</option>
                    <option value="git">Workspace & Git</option>
                    <option value="ci">Jenkins & CI Server</option>
                    <option value="security">An Ninh & Quét Lỗ Hổng</option>
                    <option value="docker">Docker & Registry</option>
                    <option value="kubernetes">Kubernetes & GitOps</option>
                    <option value="monitoring">Giám Sát & Alerts</option>
                    <option value="general">Khác / Tùy Biến</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Thẻ (Tags, cách nhau dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="Redis, Cache, Security, Supabase"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Tóm Tắt Ngắn</label>
                <input
                  type="text"
                  placeholder="Tóm tắt mục đích chính của tài liệu trong 1-2 câu"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Nội Dung Markdown *</label>
                <textarea
                  required
                  rows={8}
                  placeholder="# Tiêu Đề Tài Liệu\n\nNội dung hướng dẫn chi tiết từng bước, cấu hình, mã lệnh terminal..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold disabled:opacity-50"
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
