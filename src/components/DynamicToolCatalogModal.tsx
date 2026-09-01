'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  Sliders, 
  Trash2, 
  Server, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Activity, 
  Bell, 
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DevOpsToolDefinition } from '@/lib/devopsCatalog';

interface DynamicToolCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToolToPipeline: (tool: DevOpsToolDefinition, configuredValues: Record<string, any>) => void;
  activePipelineToolIds: string[];
}

export default function DynamicToolCatalogModal({
  isOpen,
  onClose,
  onAddToolToPipeline,
  activePipelineToolIds
}: DynamicToolCatalogModalProps) {
  const [tools, setTools] = useState<DevOpsToolDefinition[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Configuration Drawer for selected tool
  const [configuringTool, setConfiguringTool] = useState<DevOpsToolDefinition | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen) {
      fetchCatalog();
    }
  }, [isOpen, selectedCategory, searchQuery]);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'ALL') queryParams.set('category', selectedCategory);
      if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());

      const res = await fetch(`/api/catalog?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setTools(data.tools);
        if (data.categories) setCategories(data.categories);
      }
    } catch (e) {
      console.error('Failed to fetch catalog:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConfiguring = (tool: DevOpsToolDefinition) => {
    setConfiguringTool(tool);
    const initialVals: Record<string, any> = {};
    tool.configFields.forEach(f => {
      initialVals[f.key] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormValues(initialVals);
  };

  const handleConfirmAddToPipeline = () => {
    if (!configuringTool) return;
    onAddToolToPipeline(configuringTool, formValues);
    setConfiguringTool(null);
  };

  if (!isOpen) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'CI': return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'SECURITY': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'BUILD': return <Server className="w-3.5 h-3.5 text-amber-400" />;
      case 'GITOPS':
      case 'DEPLOY': return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
      case 'MONITOR': return <Activity className="w-3.5 h-3.5 text-purple-400" />;
      case 'ALERT': return <Bell className="w-3.5 h-3.5 text-rose-400" />;
      default: return <Zap className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0A0F1E] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0E1526]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">Kho Công Cụ Open Source & Nền Tảng CI/CD Miễn Phí</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-500/40">
                  DYNAMIC CATALOG
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chọn nền tảng Open Source bất kỳ, nhập cấu hình và đưa trực tiếp vào sơ đồ Workflow của bạn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-[#070B14] flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-xl">
            {['ALL', 'CI', 'SECURITY', 'BUILD', 'GITOPS', 'DEPLOY', 'MONITOR', 'ALERT'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[#0E1526] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat === 'ALL' ? 'Tất cả' : cat}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, tag, docker..."
              className="w-full bg-[#0E1526] border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono"
            />
          </div>
        </div>

        {/* Tool Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono">Đang tải danh mục nền tảng Open Source...</span>
            </div>
          ) : tools.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <p className="text-xs">Không tìm thấy công cụ nào phù hợp với từ khóa.</p>
            </div>
          ) : (
            tools.map((tool) => {
              const isAlreadyInPipeline = activePipelineToolIds.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition group ${
                    isAlreadyInPipeline
                      ? 'bg-[#0E1B2E] border-blue-500/50 shadow-md shadow-blue-900/10'
                      : 'bg-[#0D1424] border-slate-800 hover:border-slate-700 hover:bg-[#111A30]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700">
                          {getCategoryIcon(tool.category)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition">
                            {tool.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {tool.license}
                          </span>
                        </div>
                      </div>

                      {isAlreadyInPipeline && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Đã thêm
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {tool.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.tags.map(t => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                      {tool.defaultPort && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
                          Port {tool.defaultPort}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <a
                      href={tool.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Tài liệu</span>
                    </a>

                    <button
                      onClick={() => handleStartConfiguring(tool)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                        isAlreadyInPipeline
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAlreadyInPipeline ? 'Sửa Cấu Hình' : 'Thêm Vào Workflow'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Configuration Drawer / Submodal */}
        {configuringTool && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
            <div className="w-full max-w-lg h-full bg-[#0D1424] border-l border-slate-700 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{configuringTool.name}</h3>
                      <span className="text-[11px] font-mono text-blue-400">Cấu hình tham số kết nối</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfiguringTool(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {configuringTool.configFields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-bold block">
                        {field.label} {field.required && <span className="text-rose-400">*</span>}
                      </label>
                      {field.type === 'boolean' ? (
                        <select
                          value={String(formValues[field.key] ?? false)}
                          onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value === 'true' })}
                          className="w-full bg-[#070B14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono"
                        >
                          <option value="true">Bật (true)</option>
                          <option value="false">Tắt (false)</option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={formValues[field.key] || ''}
                          onChange={(e) => setFormValues({ ...formValues, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-[#070B14] border border-slate-700 rounded-xl px-3 py-2 text-xs text-blue-200 font-mono focus:border-blue-500 focus:outline-none transition"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setConfiguringTool(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800 transition"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAddToPipeline}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Xác Nhận & Đưa Vào Workflow</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-[#0E1526]">
          <div className="text-xs text-slate-400 font-mono">
            Tổng số: <span className="text-blue-400 font-bold">{tools.length}</span> nền tảng Open Source miễn phí
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
