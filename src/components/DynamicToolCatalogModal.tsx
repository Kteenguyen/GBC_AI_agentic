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
import { OfficialToolIcon } from '@/components/BrandLogos';

interface DynamicToolCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToolToPipeline: (tool: DevOpsToolDefinition, configuredValues: Record<string, any>, targetBox?: 'CI_BOX' | 'CD_BOX') => void;
  activePipelineToolIds: string[];
  theme?: 'light' | 'dark';
}

export default function DynamicToolCatalogModal({
  isOpen,
  onClose,
  onAddToolToPipeline,
  activePipelineToolIds,
  theme = 'light'
}: DynamicToolCatalogModalProps) {
  const isLight = theme === 'light';
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
        setTools(data.tools || []);
        if (data.categories) setCategories(data.categories);
      }
    } catch (e) {
      console.error('Lỗi khi tải kho công cụ:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenConfig = (tool: DevOpsToolDefinition) => {
    setConfiguringTool(tool);
    // Preset default values
    const initial: Record<string, any> = {};
    tool.configFields.forEach(f => {
      initial[f.key] = f.defaultValue !== undefined ? f.defaultValue : '';
    });
    setFormValues(initial);
  };

  const handleSaveAndAdd = (targetBox?: 'CI_BOX' | 'CD_BOX') => {
    if (!configuringTool) return;
    onAddToolToPipeline(configuringTool, formValues, targetBox);
    setConfiguringTool(null);
    onClose();
  };

  if (!isOpen) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CI': return <Server className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />;
      case 'SECURITY': return <ShieldCheck className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />;
      case 'BUILD': return <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />;
      case 'GITOPS':
      case 'DEPLOY': return <Cpu className={`w-3.5 h-3.5 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />;
      case 'MONITOR': return <Activity className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />;
      case 'ALERT': return <Bell className={`w-3.5 h-3.5 ${isLight ? 'text-rose-600' : 'text-rose-400'}`} />;
      default: return <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`relative w-full max-w-5xl max-h-[90vh] border rounded-3xl shadow-2xl flex flex-col overflow-hidden transition ${
        isLight ? 'bg-white border-[#E2DDD5] text-slate-900' : 'bg-[#0A0F1E] border-slate-700/80 text-slate-100'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'bg-[#EFECE6] border-[#E2DDD5]' : 'bg-[#0E1526] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-xs ${
              isLight ? 'bg-white border-[#E2DDD5] text-blue-600' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  Kho Công Cụ Open Source & Nền Tảng CI/CD Miễn Phí
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-950 text-blue-300 border-blue-500/40'
                }`}>
                  DYNAMIC CATALOG
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Chọn nền tảng Open Source bất kỳ, nạp nhanh vào sơ đồ Workflow của bạn.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition border cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-600 border-[#E2DDD5]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-transparent'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
          isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#070B14] border-slate-800/80'
        }`}>
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-xl">
            {['ALL', 'CI', 'SECURITY', 'BUILD', 'GITOPS', 'DEPLOY', 'MONITOR', 'ALERT'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                  selectedCategory === cat
                    ? (isLight ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20')
                    : (isLight ? 'bg-white text-slate-700 hover:bg-slate-100 border-[#E2DDD5]' : 'bg-[#0E1526] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-slate-800')
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
              className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs outline-hidden transition border ${
                isLight 
                  ? 'bg-white border-[#E2DDD5] text-slate-900 placeholder-slate-400 focus:border-blue-500' 
                  : 'bg-[#0E1526] border-slate-700/80 text-slate-200 placeholder-slate-500 focus:border-blue-500 font-mono'
              }`}
            />
          </div>
        </div>

        {/* Tool Grid */}
        <div className={`flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
          isLight ? 'bg-[#F7F5F0]' : 'bg-[#0A0F1E]'
        }`}>
          {isLoading ? (
            <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
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
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${
                    isLight 
                      ? 'bg-white border-[#E2DDD5] hover:border-blue-400' 
                      : 'bg-[#0D1424] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-xs ${
                          isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/80 border-slate-700'
                        }`}>
                          <OfficialToolIcon toolIdOrName={tool.id} className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                            {tool.name}
                          </h3>
                          <span className={`text-[10px] font-mono block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {tool.license}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${
                        tool.category === 'CI' ? (isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-500/10 text-blue-400') :
                        tool.category === 'SECURITY' ? (isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400') :
                        tool.category === 'BUILD' ? (isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-500/10 text-amber-400') :
                        (isLight ? 'bg-purple-50 text-purple-700' : 'bg-purple-500/10 text-purple-400')
                      }`}>
                        {tool.category}
                      </span>
                    </div>

                    {/* Description */}
                    <p className={`text-[11.5px] leading-relaxed line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {tool.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.map(tag => (
                        <span 
                          key={tag} 
                          className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono border ${
                            isLight ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-600' : 'bg-[#0B101E] border-slate-800 text-slate-400'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                    isLight ? 'border-slate-100' : 'border-slate-800/80'
                  }`}>
                    <a
                      href={tool.docsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`text-[11px] font-bold flex items-center gap-1 transition ${
                        isLight ? 'text-slate-500 hover:text-blue-600' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>Tài liệu</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {isAlreadyInPipeline ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã tích hợp</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onAddToolToPipeline(tool, {}, 'CI_BOX')}
                          className="px-2.5 py-1 rounded-xl text-[10.5px] font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ CI</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onAddToolToPipeline(tool, {}, 'CD_BOX')}
                          className="px-2.5 py-1 rounded-xl text-[10.5px] font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ CD</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
