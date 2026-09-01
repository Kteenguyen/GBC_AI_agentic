'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  Plus, 
  Check, 
  Clock, 
  Filter, 
  ShieldCheck,
  Zap,
  Tag
} from 'lucide-react';
import { HiredSkillProposal, AgentCategory } from '@/types';
import { emitRealtimeUpdate } from '@/lib/data';

interface HiringProposalsListProps {
  proposals: HiredSkillProposal[];
  onUpdateStatus?: (proposalId: string, newStatus: 'APPROVED' | 'INTEGRATED' | 'REJECTED') => void;
  onOpenSoloArena?: () => void;
}

export const HiringProposalsList: React.FC<HiringProposalsListProps> = ({
  proposals,
  onUpdateStatus,
  onOpenSoloArena,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredProposals = proposals.filter((prop) => {
    return filterStatus === 'ALL' || prop.status === filterStatus;
  });

  const integratedCount = proposals.filter(p => p.status === 'INTEGRATED').length;
  const approvedCount = proposals.filter(p => p.status === 'APPROVED').length;
  const proposedCount = proposals.filter(p => p.status === 'PROPOSED').length;

  const getStatusBadge = (status: HiredSkillProposal['status']) => {
    switch (status) {
      case 'INTEGRATED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'APPROVED':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      case 'PROPOSED':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'REJECTED':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
    }
  };

  const handleStatusChange = (id: string, newStatus: 'APPROVED' | 'INTEGRATED' | 'REJECTED') => {
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
    }
    emitRealtimeUpdate('gcm_proposal_status_updated', { id, newStatus, timestamp: Date.now() });
  };

  return (
    <div className="w-full space-y-5">
      {/* Top Banner & Stats Overview */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-bold">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Kho Kỹ Năng & Tác Tử Đã Tuyển Mộ (Squad Roster Hub)
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono">
                {proposals.length} Skills
              </span>
            </div>
            <p className="text-[12px] text-slate-400">
              Quản lý các repo và kỹ năng mã nguồn mở đã được duyệt bổ sung sức mạnh cho 13 Subagents.
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-emerald-500/30 text-xs">
            <span className="text-slate-400 text-[11px] block">Đã Tích Hợp:</span>
            <strong className="text-emerald-400 font-mono text-sm">{integratedCount} Skills</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-cyan-500/30 text-xs">
            <span className="text-slate-400 text-[11px] block">Đã Duyệt:</span>
            <strong className="text-cyan-300 font-mono text-sm">{approvedCount} Skills</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-amber-500/30 text-xs">
            <span className="text-slate-400 text-[11px] block">Đang Đề Xuất:</span>
            <strong className="text-amber-300 font-mono text-sm">{proposedCount} Skills</strong>
          </div>
        </div>
      </div>

      {/* Filter Header & Actions */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {['ALL', 'INTEGRATED', 'APPROVED', 'PROPOSED'].map(status => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`btn-action border transition-all ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white font-bold border-emerald-400'
                  : 'bg-[#0B0F19] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              style={{ fontSize: '11px', height: '28px', padding: '3px 10px', whiteSpace: 'nowrap' }}
            >
              {status}
            </button>
          ))}
        </div>

        {onOpenSoloArena && (
          <button
            type="button"
            onClick={onOpenSoloArena}
            className="btn-action bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold shadow"
            style={{ fontSize: '11.5px', height: '30px', padding: '4px 12px', whiteSpace: 'nowrap' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Săn Kỹ Năng Mới Tại Solo Arena</span>
          </button>
        )}
      </div>

      {/* Proposals Card Grid (< 1024px Stack 1fr) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProposals.map((prop) => (
          <div
            key={prop.id}
            className="rounded-xl p-4 sm:p-5 flex flex-col justify-between select-none bg-[#111827] border border-[#1E293B] shadow-md transition-all hover:border-emerald-500/30"
            style={{ minHeight: '230px' }}
          >
            <div>
              {/* Top Row: Category & Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-cyan-300 border border-cyan-500/30 font-mono">
                  {prop.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(prop.status)}`}>
                  {prop.status}
                </span>
              </div>

              {/* Skill Name */}
              <h3 className="font-bold text-slate-100 text-sm sm:text-base mb-1">
                {prop.skillName}
              </h3>

              {/* Source Repo */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-2.5">
                <span>Nguồn:</span>
                <a
                  href={`https://github.com/${prop.repoFullName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                >
                  {prop.repoFullName}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Assigned Squad */}
              <div className="p-2 rounded bg-[#090D16] border border-[#1E293B] text-[11px] mb-2.5">
                <span className="text-slate-400">Gán cho: </span>
                <strong className="text-slate-200">{prop.assignedSquad}</strong>
              </div>

              {/* Rationale */}
              <p className="text-[11.5px] text-slate-300 leading-relaxed line-clamp-2 mb-3">
                {prop.rationale}
              </p>
            </div>

            {/* Card Footer: Author & Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-[11px]">
              <span className="text-slate-400 font-mono">
                Bởi: <strong className="text-amber-300">{prop.hiredBy}</strong>
              </span>

              <div className="btn-container">
                {prop.status === 'PROPOSED' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(prop.id, 'APPROVED')}
                    className="btn-action bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                    style={{ fontSize: '11px', height: '28px', padding: '2px 8px', whiteSpace: 'nowrap' }}
                  >
                    <Check className="w-3 h-3" />
                    <span>Duyệt Tuyển</span>
                  </button>
                )}

                {prop.status === 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(prop.id, 'INTEGRATED')}
                    className="btn-action bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    style={{ fontSize: '11px', height: '28px', padding: '2px 8px', whiteSpace: 'nowrap' }}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Tích Hợp Vào Squad</span>
                  </button>
                )}

                {prop.status === 'INTEGRATED' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono text-[10.5px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Đã Hoạt Động
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
