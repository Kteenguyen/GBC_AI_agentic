'use client';

import React from 'react';
import { 
  Layers, 
  Users, 
  FlaskConical, 
  Swords, 
  Play, 
  RotateCcw,
  Sun,
  Moon,
  Settings2,
  BookOpen
} from 'lucide-react';

interface MobileBottomNavigationProps {
  activeTab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA';
  onTabChange: (tab: 'WORKFLOW' | 'AGENTS' | 'QA_LAB' | 'SOLO_ARENA') => void;
  onRunPipeline: () => void;
  isRunning: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenConfig: () => void;
  onOpenDocs: () => void;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onRunPipeline,
  isRunning,
  theme = 'light',
  onToggleTheme,
  onOpenConfig,
  onOpenDocs
}) => {
  const isLight = theme === 'light';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 select-none">
      
      {/* Mini Quick Bar above navigation */}
      <div className={`px-3 py-1.5 flex items-center justify-between border-t backdrop-blur-md text-[11px] ${
        isLight 
          ? 'bg-[#FAF8F5]/90 border-[#E2DDD5] text-slate-700' 
          : 'bg-[#0B0F19]/90 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold ${
              isLight ? 'bg-white border-[#E2DDD5] text-amber-800' : 'bg-slate-900 border-slate-700 text-amber-300'
            }`}
          >
            {isLight ? <Sun className="w-3 h-3 text-amber-600" /> : <Moon className="w-3 h-3 text-cyan-300" />}
            <span>{isLight ? 'Be (Sáng)' : 'Tối'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenDocs}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold ${
              isLight ? 'bg-white border-[#E2DDD5] text-blue-700' : 'bg-slate-900 border-slate-700 text-cyan-300'
            }`}
          >
            <BookOpen className="w-3 h-3 text-blue-600" />
            <span>Tài Liệu</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRunPipeline}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-white shadow-md transition active:scale-95 ${
            isRunning 
              ? 'bg-amber-600 animate-pulse' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
          }`}
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{isRunning ? 'Đang Chạy...' : 'Chạy Pipeline'}</span>
        </button>
      </div>

      {/* Main Touch-First Thumb Zone Navigation Bar */}
      <nav className={`px-2 pt-1.5 pb-safe border-t backdrop-blur-xl transition-colors shadow-2xl ${
        isLight 
          ? 'bg-white/95 border-[#E2DDD5] text-slate-600' 
          : 'bg-[#070B14]/95 border-slate-800/90 text-slate-400'
      }`}>
        <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
          
          {/* Tab 1: Workflow */}
          <button
            type="button"
            onClick={() => onTabChange('WORKFLOW')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'WORKFLOW'
                ? (isLight ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-blue-950/60 text-blue-400 font-bold')
                : (isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900 text-slate-400')
            }`}
            style={{ height: '48px' }}
          >
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10.5px] whitespace-nowrap">Sơ Đồ</span>
          </button>

          {/* Tab 2: 13 Agents */}
          <button
            type="button"
            onClick={() => onTabChange('AGENTS')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 relative ${
              activeTab === 'AGENTS'
                ? (isLight ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-cyan-950/60 text-cyan-400 font-bold')
                : (isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900 text-slate-400')
            }`}
            style={{ height: '48px' }}
          >
            <div className="relative">
              <Users className="w-5 h-5 mb-0.5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10.5px] whitespace-nowrap">13 Agents</span>
          </button>

          {/* Tab 3: QA Lab */}
          <button
            type="button"
            onClick={() => onTabChange('QA_LAB')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'QA_LAB'
                ? (isLight ? 'bg-purple-50 text-purple-700 font-bold' : 'bg-purple-950/60 text-purple-400 font-bold')
                : (isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900 text-slate-400')
            }`}
            style={{ height: '48px' }}
          >
            <FlaskConical className="w-5 h-5 mb-0.5" />
            <span className="text-[10.5px] whitespace-nowrap">QA Lab</span>
          </button>

          {/* Tab 4: Solo 1v1 */}
          <button
            type="button"
            onClick={() => onTabChange('SOLO_ARENA')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 ${
              activeTab === 'SOLO_ARENA'
                ? (isLight ? 'bg-amber-50 text-amber-800 font-bold' : 'bg-amber-950/60 text-amber-300 font-bold')
                : (isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-slate-900 text-slate-400')
            }`}
            style={{ height: '48px' }}
          >
            <Swords className="w-5 h-5 mb-0.5" />
            <span className="text-[10.5px] whitespace-nowrap">Solo 1v1</span>
          </button>

        </div>
      </nav>
    </div>
  );
};
