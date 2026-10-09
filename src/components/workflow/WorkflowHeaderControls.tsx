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
  Key,
  ShieldCheck,
  Cpu
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
    <header className="workflow-header-bar">
      {/* Row 1: Primary Dock and Navigation */}
      <div className="max-w-[1850px] w-full mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar flex-nowrap py-1">
        
        {/* Left: Brand Identity & Mode Tabs */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700/40">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 text-white">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="hidden xl:block">
              <h1 className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase leading-none">
                DevSecOps IDP
              </h1>
              <span className="text-[9.5px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                Control Plane
              </span>
            </div>
          </div>

          {/* 5 Main Navigation Tabs */}
          <nav className="nav-tab-container">
            <button
              type="button"
              onClick={() => setActiveMainTab('WORKFLOW')}
              className={`nav-tab-item ${activeMainTab === 'WORKFLOW' ? 'is-active' : ''}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sơ Đồ Visual</span>
              <span className="sm:hidden">Sơ Đồ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('AGENTS')}
              className={`nav-tab-item ${activeMainTab === 'AGENTS' ? 'is-active' : ''}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>13 Agents</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('QA_LAB')}
              className={`nav-tab-item ${activeMainTab === 'QA_LAB' ? 'is-active' : ''}`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>QA Lab</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('SOLO_ARENA')}
              className={`nav-tab-item ${activeMainTab === 'SOLO_ARENA' ? 'is-active' : ''}`}
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Solo 1v1</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('KEY_POOL')}
              className={`nav-tab-item ${activeMainTab === 'KEY_POOL' ? 'is-active' : ''}`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Key Pool</span>
            </button>
          </nav>
        </div>

        {/* Center: High-Impact Execution Dock (Desktop >= md, Mobile uses Sticky Bottom Thumb Dock) */}
        <div className="floating-action-capsule shrink-0 hidden md:inline-flex">
          <button
            type="button"
            onClick={onPushCodeRunAll}
            disabled={isRunningAll}
            className={`btn-primary-run ${isRunningAll ? 'is-running' : ''}`}
            title="Kích hoạt tự động đẩy commit và chạy toàn bộ quy trình qua 3 cổng bảo mật"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? 'Đang Thực Thi...' : 'Chạy Pipeline (Push Code)'}</span>
          </button>

          <button
            type="button"
            onClick={onStepForward}
            disabled={isRunningAll}
            className="btn-header-secondary"
            title="Chuyển sang Node kế tiếp trong chuỗi"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Từng Bước</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="btn-header-secondary"
            title="Đặt lại toàn bộ trạng thái Pipeline về ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt Lại</span>
          </button>
        </div>

        {/* Right: AI Copilot, Theme Toggle & System Config */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Prompt Terminal Button */}
          <button
            type="button"
            onClick={onOpenChat}
            className="btn-primary-run from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-purple-400/40"
            title="Mở AI Prompt Terminal (Ctrl + K)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Prompt AI Squad</span>
            <span className="hidden xl:inline text-[9px] font-mono bg-white/20 px-1 rounded ml-1">Ctrl+K</span>
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            type="button"
            onClick={() => setTheme(curr => curr === 'light' ? 'dark' : 'light')}
            className="btn-header-secondary"
            title="Chuyển đổi giao diện Sáng / Tối"
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">Sáng</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline">Tối</span>
              </>
            )}
          </button>

          {/* Open Source Tool Catalog */}
          <button
            type="button"
            onClick={onOpenCatalog}
            className="btn-header-secondary"
            title="Mở Kho Actor DevOps Mở Rộng"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span className="hidden xl:inline">Kho Actor</span>
          </button>

          {/* Reset Connection Edges */}
          <button
            type="button"
            onClick={onResetEdges}
            className="btn-header-secondary"
            title="Khôi phục toàn bộ đường nối mũi tên mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Dây ({workflowEdgesCount})</span>
          </button>

          {/* Documentation Link */}
          <a
            href="/docs"
            className="btn-header-secondary text-cyan-600 dark:text-cyan-400"
            title="Tài liệu kiến trúc"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Docs</span>
          </a>

          {/* Infrastructure Config Button */}
          <button
            type="button"
            onClick={onOpenConfig}
            title="Cấu Hình Hạ Tầng & API Tokens"
            aria-label="Cấu Hình Hạ Tầng"
            className="btn-header-secondary px-2"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400 hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Row 2: Project Context & Realtime Event Bus Status */}
      <div className="max-w-[1850px] mx-auto flex flex-wrap items-center justify-between gap-3 pt-1.5 border-t border-slate-700/20 dark:border-slate-800 text-xs">
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
              <span className="text-slate-500 dark:text-slate-400">Git User:</span>
              <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-purple-600 dark:text-purple-300">
                {selectedProject.gitUserName}
              </span>
              <span className="text-slate-500 dark:text-slate-400">Branch:</span>
              <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                {selectedProject.branch}
              </span>
            </div>
          )}
        </div>

        <div className="realtime-bus-badge">
          <span className="realtime-pulse-dot" />
          <span>REALTIME EVENT BUS: 0MS SYNCHRONIZED</span>
        </div>
      </div>
    </header>
  );
};
