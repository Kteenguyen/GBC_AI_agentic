'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Layers, 
  Move,
  X
} from 'lucide-react';
import { DevOpsToolDefinition, OPEN_SOURCE_DEVOPS_CATALOG } from '@/lib/devopsCatalog';
import { OfficialToolIcon } from '@/components/BrandLogos';

interface WorkflowActorSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddTool: (tool: DevOpsToolDefinition, targetBox: 'CI_BOX' | 'CD_BOX') => void;
  theme: 'light' | 'dark';
}

const CATEGORY_TABS = [
  { key: 'ALL', label: 'Tất Cả' },
  { key: 'CI', label: 'CI / CD' },
  { key: 'SECURITY', label: 'Bảo Mật' },
  { key: 'BUILD', label: 'Build & Pod' },
  { key: 'GITOPS', label: 'GitOps' },
  { key: 'MONITOR', label: 'Giám Sát' }
];

export const WorkflowActorSidebar: React.FC<WorkflowActorSidebarProps> = ({
  isOpen,
  onToggle,
  onAddTool,
  theme
}) => {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return OPEN_SOURCE_DEVOPS_CATALOG.filter(tool => {
      const matchCat = selectedCategory === 'ALL' || tool.category === selectedCategory || (selectedCategory === 'GITOPS' && tool.category === 'DEPLOY');
      const matchSearch = searchQuery.trim() === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleDragStart = (e: React.DragEvent, tool: DevOpsToolDefinition) => {
    const payload = JSON.stringify(tool);
    e.dataTransfer.setData('text/plain', payload);
    e.dataTransfer.setData('application/json', payload);
    if (typeof window !== 'undefined') {
      (window as any).__draggedDevOpsTool = tool;
    }
  };

  const handleDragEnd = () => {
    if (typeof window !== 'undefined') {
      (window as any).__draggedDevOpsTool = null;
    }
  };

  return (
    <>
      {/* DESKTOP COLLAPSIBLE SIDEBAR (>= 1024px) */}
      <aside 
        className={`hidden lg:flex flex-col shrink-0 transition-all duration-300 relative border rounded-2xl z-30 shadow-md ${
          isOpen ? 'w-[290px]' : 'w-[58px]'
        } ${
          isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#090E1A] border-[#1E293B]'
        }`}
        style={{ minHeight: '680px' }}
      >
        {/* Sidebar Header & Toggle Button */}
        <div className={`p-3 border-b flex items-center justify-between rounded-t-2xl ${
          isLight ? 'border-[#E2DDD5] bg-[#FAF8F5]' : 'border-[#1E293B] bg-[#0C1322]'
        }`}>
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isLight ? 'bg-blue-50 text-blue-600' : 'bg-cyan-950/60 text-cyan-400'}`}>
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-xs font-bold leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Kho Actor Mở Rộng
                </h3>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {OPEN_SOURCE_DEVOPS_CATALOG.length} công cụ Open Source
                </span>
              </div>
            </div>
          ) : (
            <div className="mx-auto" title="Mở Kho Actor">
              <Layers className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className={`p-1.5 rounded-lg transition border cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-[#E2DDD5]' 
                : 'bg-[#1E293B] hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isOpen ? 'Thu gọn Sidebar' : 'Mở rộng Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* EXPANDED CONTENT */}
        {isOpen ? (
          <div className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm actor, công cụ CI/CD, SAST..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-[11.5px] border font-sans outline-hidden transition ${
                  isLight 
                    ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-800 focus:border-blue-500 focus:bg-white' 
                    : 'bg-[#0F172A] border-slate-700 text-slate-100 focus:border-cyan-400 focus:bg-[#0B1020]'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === tab.key
                      ? (isLight ? 'bg-blue-600 text-white shadow-xs' : 'bg-cyan-600 text-white shadow-xs')
                      : (isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:bg-slate-700')
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Hint Notice */}
            <div className={`px-2 py-1.5 rounded-xl border text-[10px] flex items-center gap-1.5 ${
              isLight ? 'bg-blue-50/70 border-blue-200 text-blue-800' : 'bg-cyan-950/40 border-cyan-900/60 text-cyan-300'
            }`}>
              <Move className="w-3 h-3 shrink-0 text-blue-500 dark:text-cyan-400" />
              <span>Kéo thả sang Box 1/2 hoặc bấm nút + CI / + CD để nạp ngay!</span>
            </div>

            {/* Tools List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {filteredTools.length === 0 ? (
                <div className={`p-4 text-center rounded-2xl border ${
                  isLight ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-500' : 'bg-[#0F172A] border-slate-800 text-slate-400'
                }`}>
                  <p className="text-xs">Không tìm thấy actor phù hợp.</p>
                </div>
              ) : (
                filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, tool)}
                    onDragEnd={handleDragEnd}
                    className={`p-2.5 rounded-2xl border transition-all cursor-grab active:cursor-grabbing group shadow-xs ${
                      isLight
                        ? 'bg-white hover:bg-slate-50/80 border-[#E2DDD5] hover:border-blue-400'
                        : 'bg-[#0F172A] hover:bg-[#131E35] border-slate-800 hover:border-cyan-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Official Vector Logo */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${
                        isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-slate-800/90 border-slate-700'
                      }`}>
                        <OfficialToolIcon toolIdOrName={tool.id} className="w-6 h-6" />
                      </div>

                      {/* Tool Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {tool.name}
                          </h4>
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-mono uppercase font-bold shrink-0 ${
                            tool.category === 'CI' ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400' :
                            tool.category === 'SECURITY' ? 'bg-emerald-500/10 text-emerald-600' :
                            tool.category === 'BUILD' ? 'bg-amber-500/10 text-amber-600' :
                            'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}>
                            {tool.category}
                          </span>
                        </div>

                        <p className={`text-[10px] line-clamp-1 mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {tool.description}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800/80">
                          <span className="text-[9px] font-mono text-slate-400 truncate max-w-[80px]">
                            {tool.license.replace('Open Source ', '')}
                          </span>

                          {/* 1-Touch Add Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onAddTool(tool, 'CI_BOX')}
                              className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold transition flex items-center gap-0.5 cursor-pointer border ${
                                isLight 
                                  ? 'bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border-blue-200' 
                                  : 'bg-cyan-950/60 hover:bg-cyan-600 hover:text-white text-cyan-300 border-cyan-800/80'
                              }`}
                              title="Thêm nhanh vào Khâu ① CI & Bảo Mật"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>CI</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => onAddTool(tool, 'CD_BOX')}
                              className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold transition flex items-center gap-0.5 cursor-pointer border ${
                                isLight 
                                  ? 'bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 border-purple-200' 
                                  : 'bg-purple-950/60 hover:bg-purple-600 hover:text-white text-purple-300 border-purple-800/80'
                              }`}
                              title="Thêm nhanh vào Khâu ② CD GitOps & Giám Sát"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>CD</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* COLLAPSED ICON STRIP */
          <div className="flex-1 flex flex-col items-center py-3 space-y-3 overflow-y-auto no-scrollbar">
            {OPEN_SOURCE_DEVOPS_CATALOG.slice(0, 12).map((tool) => (
              <div
                key={tool.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, tool)}
                onDragEnd={handleDragEnd}
                onClick={() => onAddTool(tool, (tool.category === 'CI' || tool.category === 'SECURITY' || tool.category === 'BUILD') ? 'CI_BOX' : 'CD_BOX')}
                className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing border shadow-xs transition-transform hover:scale-105 group relative ${
                  isLight ? 'bg-white hover:bg-blue-50 border-[#E2DDD5]' : 'bg-[#0F172A] hover:bg-slate-800 border-slate-800'
                }`}
                title={`${tool.name} (Kéo thả hoặc nhấp để thêm)`}
              >
                <OfficialToolIcon toolIdOrName={tool.id} className="w-6 h-6" />
                
                {/* Tooltip on hover */}
                <div className={`absolute left-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[10.5px] font-bold whitespace-nowrap shadow-lg border opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 ${
                  isLight ? 'bg-slate-900 text-white border-slate-700' : 'bg-black text-cyan-300 border-slate-700'
                }`}>
                  {tool.name} (+{tool.category})
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* MOBILE 430px BOTTOM DRAWER / FLOATING TRIGGER */}
      <div className="lg:hidden w-full">
        {isOpen ? (
          <div className={`w-full rounded-2xl border p-4 shadow-lg mb-4 transition ${
            isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#090E1A] border-[#1E293B]'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Kho Actor Mã Nguồn Mở (Touch 1 Chạm)
                </h3>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5">
              {CATEGORY_TABS.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                    selectedCategory === tab.key
                      ? (isLight ? 'bg-blue-600 text-white' : 'bg-cyan-600 text-white')
                      : (isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto no-scrollbar pt-1">
              {filteredTools.map(tool => (
                <div
                  key={tool.id}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                    isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0F172A] border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <OfficialToolIcon toolIdOrName={tool.id} className="w-5 h-5 shrink-0" />
                    <span className={`text-[11px] font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {tool.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-dashed border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onAddTool(tool, 'CI_BOX')}
                      className="flex-1 py-1 text-[10px] font-bold rounded-lg bg-blue-600 text-white text-center"
                    >
                      + Khâu CI
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddTool(tool, 'CD_BOX')}
                      className="flex-1 py-1 text-[10px] font-bold rounded-lg bg-purple-600 text-white text-center"
                    >
                      + Khâu CD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <button
              type="button"
              onClick={onToggle}
              className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 text-blue-700 border-[#E2DDD5]' 
                  : 'bg-[#0F172A] hover:bg-slate-800 text-cyan-400 border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mở Kho Actor Mở Rộng ({OPEN_SOURCE_DEVOPS_CATALOG.length} công cụ)</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
