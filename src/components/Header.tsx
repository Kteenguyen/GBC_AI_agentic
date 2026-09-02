'use client';

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  Layers, 
  Zap, 
  Users,
  GitFork
} from 'lucide-react';
import { UserRole, PipelineStage } from '@/types';
import { emitRealtimeUpdate } from '@/lib/data';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeStage?: PipelineStage;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onTriggerFullRun?: () => void;
  onLaunchInteractiveMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeStage,
  activeTab,
  onTabChange,
}) => {
  const [lastSync, setLastSync] = useState<string>('Vừa xong');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastSync(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    emitRealtimeUpdate('gcm_manual_sync_triggered', { timestamp: Date.now() });
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSync(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'ADMIN_CEO':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'HEAD':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30';
      case 'DEV':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'QA':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600 hover:bg-slate-700';
    }
  };

  return (
    <header className="w-full bg-[#0B0F19]/95 backdrop-blur-md border-b border-[#1E293B] sticky top-0 z-40 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Section: Logo, Title & Active Stage */}
        <div className="flex items-center justify-between lg:justify-start gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  ANTIGRAVITY <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">SQUAD ARENA</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-900/60 text-cyan-300 border border-cyan-500/30">
                  13 AGENTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">DevOps CI/CD & 1v1 Battle Arena System</p>
            </div>
          </div>

          {activeStage && (
            <div className="hidden xl:flex items-center gap-2 bg-[#111827] border border-[#1E293B] px-2.5 py-1 rounded-md text-[11.5px]">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
              <span className="text-slate-400">Tiến độ:</span>
              <span className="font-bold text-cyan-300 truncate max-w-[210px]">
                Stage {activeStage.order}: {activeStage.name}
              </span>
            </div>
          )}
        </div>

        {/* Center: Main Tab Navigation */}
        <nav className="flex items-center overflow-x-auto pb-1 lg:pb-0 gap-1 bg-[#111827]/80 p-1 rounded-lg border border-[#1E293B]/80 scrollbar-none max-w-full">
          {[
            { id: 'workflow', label: 'Sơ Đồ Visual Workflow', icon: GitFork },
            { id: 'interactive', label: 'Điều Phối Prompt & Browser Test', icon: Zap },
            { id: 'pipeline', label: 'DevOps & Squad Agents', icon: Layers },
            { id: 'qa', label: 'QA Lab 430px', icon: Smartphone },
            { id: 'trending', label: 'GitHub Trending & Solo', icon: Sparkles },
            { id: 'roster', label: 'Kỹ Năng Đã Tuyển Mộ', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`btn-action transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-500/20 border border-cyan-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                style={{ fontSize: '12px', height: '32px', padding: '6px 12px', whiteSpace: 'nowrap' }}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Sync status, Manual Sync button & Role Switcher */}
        <div className="flex items-center justify-between lg:justify-end gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Realtime 0ms:</span>
            <span className="text-slate-200">{lastSync}</span>
          </div>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Làm mới trạng thái tức thời qua Realtime Bus"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-[#111827] border border-[#1E293B] p-1 rounded-lg">
            <span className="text-[11px] text-slate-400 font-medium pl-1 hidden sm:inline">Role:</span>
            {(['ADMIN_CEO', 'HEAD', 'DEV', 'QA'] as UserRole[]).map((role) => {
              const isCurrent = currentRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => onRoleChange(role)}
                  className={`btn-action transition-all duration-150 rounded ${
                    isCurrent
                      ? getRoleBadgeStyle(role) + ' font-extrabold shadow-sm ring-1 ring-white/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  style={{ fontSize: '11px', height: '26px', padding: '2px 8px', whiteSpace: 'nowrap' }}
                >
                  {role === 'ADMIN_CEO' ? 'CEO' : role}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
