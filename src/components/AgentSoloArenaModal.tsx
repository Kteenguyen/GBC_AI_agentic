'use client';

import React, { useState } from 'react';
import { 
  X, 
  Swords, 
  Trophy, 
  Star, 
  ShieldCheck, 
  Smartphone, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  UserPlus, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { SoloBattleResult, GitHubTrendingRepo, AgentRoleProfile } from '@/types';
import { emitRealtimeUpdate } from '@/lib/data';

interface AgentSoloArenaModalProps {
  battleResult: SoloBattleResult | null;
  repo: GitHubTrendingRepo | null;
  agent: AgentRoleProfile | null;
  onClose: () => void;
  onConfirmHire: (proposalData: { repoFullName: string; skillName: string; rationale: string; category: any }) => void;
}

export const AgentSoloArenaModal: React.FC<AgentSoloArenaModalProps> = ({
  battleResult,
  repo,
  agent,
  onClose,
  onConfirmHire,
}) => {
  const [activeTab, setActiveTab] = useState<'scoring' | 'rounds' | 'verdict'>('scoring');
  const [isHired, setIsHired] = useState<boolean>(false);

  if (!battleResult || !repo || !agent) return null;

  const isAgentWinner = battleResult.winner === 'AGENT';

  const handleHire = () => {
    setIsHired(true);
    onConfirmHire({
      repoFullName: repo.fullName,
      skillName: battleResult.hireRecommendation.hireTitle,
      rationale: battleResult.hireRecommendation.rationale,
      category: repo.roleFitCategory,
    });
    emitRealtimeUpdate('gcm_agent_hired', {
      repo: repo.fullName,
      skill: battleResult.hireRecommendation.hireTitle,
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl bg-[#0B0F19] border border-[#1E293B] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arena Top Header */}
        <div className="p-4 sm:p-5 bg-[#111827] border-b border-[#1E293B] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                  ĐẤU TRƯỜNG SOLO 1v1 <span className="text-amber-400">AGENT ARENA</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/30 font-mono">
                  Trọng tài: AGENT-11
                </span>
              </div>
              <p className="text-[11.5px] text-slate-400">
                So găng 5 tiêu chí kỹ thuật: {repo.name} VS {agent.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1v1 Face-off Ring Stage Banner */}
        <div className="px-4 sm:px-6 py-5 bg-gradient-to-b from-[#131D30] to-[#0B0F19] border-b border-[#1E293B]">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Left Fighter: GitHub Repo (5 cols) */}
            <div className="md:col-span-5 bg-[#111827]/90 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                ⭐
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-amber-400">GITHUB REPO</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                    {repo.language}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm sm:text-base truncate">
                  {repo.fullName}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-amber-300 font-bold">{repo.stars.toLocaleString()} Stars</span>
                  <span>Điểm: <strong className="text-amber-300 text-sm">{battleResult.scoreRepo}</strong>/100</span>
                </div>
              </div>
            </div>

            {/* Center: VS Badge (1 col) */}
            <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white font-extrabold text-xs shadow-lg shadow-rose-500/30 animate-pulse">
                VS
              </div>
            </div>

            {/* Right Fighter: Squad Agent (5 cols) */}
            <div className="md:col-span-5 bg-[#111827]/90 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-cyan-400">{agent.code}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-950 text-cyan-300 border border-cyan-500/30 font-bold">
                    SQUAD DEFENDER
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm sm:text-base truncate">
                  {agent.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">{agent.metrics.successRate}% SLA</span>
                  <span>Điểm: <strong className="text-cyan-300 text-sm">{battleResult.scoreAgent}</strong>/100</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                {agent.avatar}
              </div>
            </div>
          </div>

          {/* Winner Banner */}
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>
                CHIẾN THẮNG: {isAgentWinner ? `${agent.name} (${agent.code})` : repo.fullName}
              </span>
            </div>
            <span className="font-mono text-emerald-400 text-[11px]">
              Tỷ số chung cuộc: {battleResult.scoreAgent} (Agent) - {battleResult.scoreRepo} (Repo)
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-[#111827] border-b border-[#1E293B] flex items-center gap-2">
          {[
            { id: 'scoring', label: '1. Bảng Điểm 5 Tiêu Chí' },
            { id: 'rounds', label: '2. Diễn Biến Trận Đấu (4 Hiệp)' },
            { id: 'verdict', label: '3. Phán Quyết & Tuyển Mộ' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn-action border transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-[#0B0F19] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              style={{ fontSize: '11.5px', height: '30px', padding: '4px 12px', whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 scrollbar-none text-xs">
          {/* Tab 1: 5 Criteria Scoring Table */}
          {activeTab === 'scoring' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0E1524] text-[11px] font-bold text-slate-400 border-b border-[#1E293B]">
                      <th className="p-3">Tiêu Chí Đánh Giá</th>
                      <th className="p-3 text-center">Trọng Số</th>
                      <th className="p-3 text-center text-amber-400">{repo.name}</th>
                      <th className="p-3 text-center text-cyan-400">{agent.code}</th>
                      <th className="p-3">Phân Tích So Sánh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] text-slate-300">
                    {battleResult.criteriaScores.map((crit, idx) => (
                      <tr key={idx} className="hover:bg-[#131D30] transition-colors">
                        <td className="p-3">
                          <strong className="text-slate-100 block text-[12px]">{crit.nameVi}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{crit.name}</span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-400">
                          {Math.round(crit.weight * 100)}%
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-amber-300 text-sm">
                          {crit.repoScore}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-cyan-300 text-sm">
                          {crit.agentScore}
                        </td>
                        <td className="p-3 text-[11.5px] leading-relaxed text-slate-300">
                          {crit.analysis}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Round Commentary */}
          {activeTab === 'rounds' && (
            <div className="space-y-3">
              {battleResult.battleLog.map((round) => (
                <div key={round.round} className="p-3.5 rounded-xl bg-[#111827] border border-[#1E293B] space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-amber-400 text-[12.5px]">
                      {round.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      round.advantage === 'AGENT'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/30'
                        : round.advantage === 'REPO'
                        ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      Ưu thế: {round.advantage === 'AGENT' ? agent.code : round.advantage === 'REPO' ? repo.name : 'Ngang Tài'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[12px] leading-relaxed">
                    {round.commentary}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Verdict & Hiring Proposal */}
          {activeTab === 'verdict' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#111827] border border-cyan-500/30 space-y-2">
                <span className="font-bold text-cyan-300 text-xs sm:text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Phán Quyết Toàn Diện Từ Trọng Tài AGENT-11:
                </span>
                <p className="text-slate-200 text-[12.5px] leading-relaxed">
                  {battleResult.summaryVerdict}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
                <span className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" />
                  Khuyến Nghị Tuyển Mộ Vào Squad:
                </span>
                <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B]">
                  <span className="font-bold text-slate-100 text-[12.5px] block mb-1">
                    {battleResult.hireRecommendation.hireTitle}
                  </span>
                  <p className="text-slate-300 text-[11.5px] leading-relaxed">
                    {battleResult.hireRecommendation.rationale}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-[#111827] border-t border-[#1E293B] flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-action bg-slate-800 hover:bg-slate-700 text-slate-300"
            style={{ fontSize: '11.5px', height: '32px', padding: '4px 14px', whiteSpace: 'nowrap' }}
          >
            Đóng Đấu Trường
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleHire}
              disabled={isHired}
              className={`btn-action font-extrabold shadow-lg transition-all ${
                isHired
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-amber-500/20'
              }`}
              style={{ fontSize: '12px', height: '34px', padding: '6px 14px', whiteSpace: 'nowrap' }}
            >
              {isHired ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã Tuyển Mộ & Đồng Bộ Vào Squad!</span>
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5" />
                  <span>🏆 Đề Xuất Tuyển Dụng / Nhập Skill Này</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
