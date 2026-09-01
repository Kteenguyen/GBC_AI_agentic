'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderGit2, 
  ChevronDown, 
  Check, 
  Search, 
  RefreshCw, 
  GitBranch, 
  Globe, 
  Folder 
} from 'lucide-react';
import { LocalProject } from '@/app/page';

interface ProjectDropdownProps {
  projects: LocalProject[];
  selectedProject: LocalProject | null;
  onSelectProject: (project: LocalProject) => void;
  onRefresh: () => void;
  isLoading: boolean;
  theme?: 'light' | 'dark';
}

export default function ProjectDropdown({
  projects,
  selectedProject,
  onSelectProject,
  onRefresh,
  isLoading,
  theme = 'light'
}: ProjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.branch?.toLowerCase().includes(search.toLowerCase()) ||
    p.repoName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      
      {/* Trigger Box */}
      <div 
        data-testid="project-dropdown-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center justify-between rounded-xl px-3 py-1.5 shadow-sm cursor-pointer transition-all group select-none border ${
          isLight
            ? 'bg-white border-[#E2DDD5] hover:border-blue-500 shadow-xs'
            : 'bg-[#080D1A] border-cyan-500/40 hover:border-cyan-400'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
            isLight
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
          }`}>
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className={`text-[9.5px] font-bold uppercase block tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              1. Tên Dự Án (Folder)
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-xs truncate block max-w-[180px] ${
                isLight ? 'text-slate-900' : 'text-cyan-300'
              }`}>
                {selectedProject?.name || 'Chọn Dự Án'}
              </span>
              {selectedProject?.branch && (
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                  isLight
                    ? 'bg-[#FAF8F5] text-slate-700 border-[#E2DDD5]'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {selectedProject.branch}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            className={`p-1 transition rounded-md ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white'
            }`}
            title="Quét lại các dự án trên máy"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : (isLight ? 'text-slate-400 group-hover:text-blue-600' : 'text-slate-400 group-hover:text-cyan-400')
          }`} />
        </div>
      </div>

      {/* Custom Sleek Dropdown Menu */}
      {isOpen && (
        <div className={`absolute left-0 top-full mt-1.5 w-80 rounded-2xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 border ${
          isLight
            ? 'bg-white border-[#E2DDD5] text-slate-800'
            : 'bg-[#0B101E] border-slate-700 text-slate-100'
        }`}>
          
          {/* Header & Search */}
          <div className="space-y-2 mb-2">
            <div className={`flex items-center justify-between pb-1.5 border-b text-xs ${
              isLight ? 'border-[#E2DDD5]' : 'border-slate-800'
            }`}>
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Dự Án Trên Máy Cục Bộ</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-950 text-cyan-400 border-cyan-800'
              }`}>
                {projects.length} Projects
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-slate-400' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Tìm dự án, nhánh git..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-lg pl-8 pr-2.5 py-1.5 text-xs focus:outline-none transition border ${
                  isLight
                    ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    : 'bg-[#060911] border-slate-800 text-slate-200 placeholder-slate-500 focus:border-cyan-500'
                }`}
                autoFocus
              />
            </div>
          </div>

          {/* Project List */}
          <div className="max-h-56 overflow-y-auto space-y-1 pr-1 font-sans">
            {filtered.length === 0 ? (
              <div className={`p-4 text-center text-xs ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                Không tìm thấy dự án phù hợp
              </div>
            ) : (
              filtered.map((proj) => {
                const isSelected = selectedProject?.id === proj.id;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-between border ${
                      isSelected
                        ? (isLight ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-bold' : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 font-bold')
                        : (isLight ? 'bg-white border-transparent hover:bg-[#FAF8F5] text-slate-700' : 'bg-transparent border-transparent hover:bg-slate-800/60 text-slate-300')
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Folder className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? (isLight ? 'text-blue-600' : 'text-cyan-400') : 'text-slate-400'
                      }`} />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold truncate block">{proj.name}</span>
                          {proj.isGitRepo && (
                            <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                              isLight ? 'bg-emerald-50 text-emerald-700' : 'bg-emerald-950 text-emerald-400'
                            }`}>
                              GIT
                            </span>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] truncate ${
                          isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <span className="flex items-center gap-0.5 font-mono">
                            <GitBranch className="w-2.5 h-2.5" />
                            {proj.branch}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[120px]">{proj.gitUserName}</span>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className={`w-4 h-4 shrink-0 ${isLight ? 'text-blue-600' : 'text-cyan-400'}`} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
            isLight ? 'border-[#E2DDD5] text-slate-500' : 'border-slate-800 text-slate-500'
          }`}>
            <span>Dữ liệu Git 100% Cục Bộ</span>
            <span className={isLight ? 'text-blue-600 font-bold' : 'text-cyan-400 font-bold'}>No Fake Data</span>
          </div>

        </div>
      )}

    </div>
  );
}
