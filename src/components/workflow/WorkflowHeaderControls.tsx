'use client';

import React from 'react';
import { 
  Play, 
  SkipForward, 
  RotateCcw, 
  Layers, 
  Users, 
  FlaskConical, 
  Swords, 
  Sparkles, 
  Sun, 
  Moon, 
  Plus, 
  BookOpen, 
  Settings,
  Key
} from 'lucide-react';
import ProjectDropdown from '@/components/ProjectDropdown';
import { LocalProject } from '@/types/workflow';

interface WorkflowHeaderControlsProps {
  theme: 'light' | 'dark';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  isLight: boolean;
  activeMainTab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA' | 'KEY_POOL';
  setActiveMainTab: (tab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA' | 'KEY_POOL') => void;
  localProjects: LocalProject[];
  selectedProject: LocalProject | null;
  onSelectProject: (proj: LocalProject) => void;
  isLoadingProjects: boolean;
  onRefreshProjects: () => void;
  isRunningAll: boolean;
  onPushCodeRunAll: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onOpenChat: () => void;
  onOpenCatalog: () => void;
  onResetEdges: () => void;
  workflowEdgesCount: number;
  onOpenConfig: () => void;
}

export const WorkflowHeaderControls: React.FC<WorkflowHeaderControlsProps> = ({
  theme,
  setTheme,
  isLight,
  activeMainTab,
  setActiveMainTab,
  localProjects,
  selectedProject,
  onSelectProject,
  isLoadingProjects,
  onRefreshProjects,
  isRunningAll,
  onPushCodeRunAll,
  onStepForward,
  onReset,
  onOpenChat,
  onOpenCatalog,
  onResetEdges,
  workflowEdgesCount,
  onOpenConfig
}) => {
  return (
    <div className={`w-full px-2 sm:px-4 py-2 sticky top-0 z-50 border-b transition-colors ${
      isLight ? 'bg-[#EFECE6] border-[#E2DDD5]' : 'bg-[#0B0F19] border-[#1E293B]'
    }`}>
      {/* Row 1: Main Tabs and Quick Actions */}
      <div className="max-w-[1850px] w-full mx-auto flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar flex-nowrap">
        {/* Group 1: 5 Main Navigation Tabs */}
        <div className={`flex items-center gap-0.5 sm:gap-1 p-0.5 rounded-lg border shrink-0 transition ${
          isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#090D18] border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => setActiveMainTab('WORKFLOW')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
              activeMainTab === 'WORKFLOW'
                ? (isLight ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm shadow-blue-600/30')
                : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
            }`}
            style={{ height: '30px' }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sơ Đồ Visual</span>
            <span className="sm:hidden">Sơ Đồ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('AGENTS')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
              activeMainTab === 'AGENTS'
                ? (isLight ? 'bg-blue-700 text-white shadow-sm' : 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30')
                : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
            }`}
            style={{ height: '30px' }}
          >
            <Users className="w-3.5 h-3.5" />
            <span>13 Agents</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-0.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('QA_LAB')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
              activeMainTab === 'QA_LAB'
                ? 'bg-purple-600 text-white shadow-sm'
                : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
            }`}
            style={{ height: '30px' }}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>QA Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('SOLO_ARENA')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
              activeMainTab === 'SOLO_ARENA'
                ? 'bg-amber-600 text-white shadow-sm'
                : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
            }`}
            style={{ height: '30px' }}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Solo 1v1</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('KEY_POOL')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[11.5px] font-bold transition-all whitespace-nowrap ${
              activeMainTab === 'KEY_POOL'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60')
            }`}
            style={{ height: '30px' }}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Key Pool</span>
          </button>
        </div>

        {/* Group 2: Pipeline Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onPushCodeRunAll}
            disabled={isRunningAll}
            className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-[11.5px] font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap ${
              isRunningAll
                ? 'bg-slate-500 cursor-not-allowed opacity-75'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25 border border-emerald-400/40'
            }`}
            style={{ height: '32px' }}
            title="Kích hoạt tự động đẩy commit và chạy toàn bộ quy trình CI/CD"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunningAll ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Chạy Full Pipeline</span>
            <span className="sm:hidden">Chạy</span>
          </button>

          <button
            type="button"
            onClick={onStepForward}
            disabled={isRunningAll}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] sm:text-[11.5px] font-bold transition-all border whitespace-nowrap ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#E2DDD5]'
                : 'bg-[#1E293B] hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            style={{ height: '32px' }}
            title="Chuyển sang Node tiếp theo"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tiếp tục</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-[11.5px] font-bold transition-all border whitespace-nowrap ${
              isLight 
                ? 'bg-[#FAF8F5] hover:bg-slate-200 text-slate-600 border-[#E2DDD5]'
                : 'bg-[#0F172A] hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
            }`}
            style={{ height: '32px' }}
            title="Dừng và đặt lại toàn bộ trạng thái Pipeline về ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Dừng / Reset</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>

        {/* Group 3: Utility Controls & Modals */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 text-xs">
          {/* AI Prompt Copilot Terminal Button */}
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-400/40 shadow-sm transition cursor-pointer active:scale-95 whitespace-nowrap"
            style={{ height: '30px' }}
            title="Mở AI Prompt Terminal (Ctrl + K)"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Prompt AI</span>
            <span className="hidden xl:inline text-[9px] font-mono bg-white/20 px-1 rounded">Ctrl+K</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(curr => curr === 'light' ? 'dark' : 'light')}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition-all border shadow-xs cursor-pointer whitespace-nowrap ${
              isLight
                ? 'bg-[#FFFFFF] hover:bg-[#FAF8F5] text-amber-800 border-[#E2DDD5]'
                : 'bg-[#0F172A] hover:bg-slate-800 text-amber-300 border-slate-700'
            }`}
            style={{ height: '30px' }}
            title="Chuyển đổi giao diện Sáng / Tối"
          >
            {isLight ? (
              <>
                <Sun className="w-3 h-3 text-amber-600 fill-amber-500/30" />
                <span className="hidden md:inline">Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-3 h-3 text-cyan-300" />
                <span className="hidden md:inline">Tối</span>
              </>
            )}
          </button>

          {/* Dynamic Open Source Catalog */}
          <button
            type="button"
            onClick={onOpenCatalog}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold border border-blue-500/40 shadow-xs transition cursor-pointer whitespace-nowrap"
            style={{ height: '30px' }}
          >
            <Plus className="w-3 h-3" />
            <span className="hidden xl:inline">Kho Open Source</span>
            <span className="xl:hidden">Kho OS</span>
          </button>

          {/* Reset Connection Edges */}
          <button
            type="button"
            onClick={onResetEdges}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition cursor-pointer border whitespace-nowrap ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#E2DDD5]'
                : 'bg-[#0F172A] hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            style={{ height: '30px' }}
            title="Khôi phục toàn bộ đường nối mũi tên mặc định"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span className="hidden xl:inline">Dây Nối ({workflowEdgesCount})</span>
            <span className="xl:hidden">Dây ({workflowEdgesCount})</span>
          </button>

          {/* Documentation Guides */}
          <a
            href="/docs"
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-[11.5px] font-bold transition cursor-pointer border whitespace-nowrap ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-blue-700 border-[#E2DDD5]'
                : 'bg-[#0F172A] hover:bg-slate-800 text-cyan-400 border-slate-700'
            }`}
            style={{ height: '30px' }}
            title="Xem Trang Tài Liệu (/docs)"
          >
            <BookOpen className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
            <span>Docs</span>
          </a>

          {/* Infrastructure Config Gear Button */}
          <button
            type="button"
            onClick={onOpenConfig}
            title="Cấu Hình Hạ Tầng & API Tokens"
            aria-label="Cấu Hình Hạ Tầng"
            className={`w-[30px] h-[30px] rounded-lg transition cursor-pointer border shadow-xs flex items-center justify-center group shrink-0 ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-[#E2DDD5] hover:border-blue-400 hover:text-blue-600'
                : 'bg-[#0F172A] hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-cyan-400 hover:text-cyan-400'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 group-hover:rotate-90 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Row 2: Real Project Selector & Branch */}
      <div className={`max-w-[1850px] mx-auto flex flex-wrap items-center justify-between gap-3 pt-1 border-t text-xs ${
        isLight ? 'border-[#E2DDD5]' : 'border-slate-800/80'
      }`}>
        <div className="flex items-center gap-3 flex-wrap">
          <ProjectDropdown
            projects={localProjects}
            selectedProject={selectedProject}
            onSelectProject={onSelectProject}
            isLoading={isLoadingProjects}
            onRefresh={onRefreshProjects}
            theme={theme}
          />

          {selectedProject && (
            <div className="flex items-center gap-2 font-mono">
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Git User:</span>
              <span className={`px-2 py-0.5 rounded border font-bold ${
                isLight ? 'bg-white border-[#E2DDD5] text-purple-700' : 'bg-[#0E1526] border-slate-800 text-purple-300'
              }`}>
                {selectedProject.gitUserName}
              </span>
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Branch:</span>
              <span className={`px-2 py-0.5 rounded border font-bold ${
                isLight ? 'bg-white border-[#E2DDD5] text-emerald-700' : 'bg-[#0E1526] border-slate-800 text-emerald-400'
              }`}>
                {selectedProject.branch}
              </span>
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 font-mono text-[11px] ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>REALTIME EVENT BUS: 0MS SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  );
};
