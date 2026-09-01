'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  GitFork, 
  ExternalLink, 
  Swords, 
  UserPlus, 
  CheckCircle2, 
  Search, 
  Filter, 
  Flame, 
  ShieldCheck, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { GitHubTrendingRepo, AgentCategory } from '@/types';

interface GitHubTrendingHunterProps {
  repos: GitHubTrendingRepo[];
  onTriggerSoloBattle: (repo: GitHubTrendingRepo) => void;
  onDirectHireProposal: (repo: GitHubTrendingRepo) => void;
}

export const GitHubTrendingHunter: React.FC<GitHubTrendingHunterProps> = ({
  repos,
  onTriggerSoloBattle,
  onDirectHireProposal,
}) => {
  const [filterFit, setFilterFit] = useState<'ALL' | 'NEW_ROLE_GAP' | 'ALREADY_HAVE'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRepos = repos.filter((repo) => {
    const matchesFit = filterFit === 'ALL' || repo.agentInTeamStatus === filterFit;
    const matchesCategory = filterCategory === 'ALL' || repo.roleFitCategory === filterCategory;
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFit && matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-4">
      {/* Top Banner & Control Center */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                Top 10 GitHub Trending Repositories (Realtime Hunter)
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30 font-mono">
                {repos.length} Repositories
              </span>
            </div>
            <p className="text-[12px] text-slate-400">
              Phân tích các kho mã nguồn AI & DevTools hàng đầu, đánh giá Squad Fit và mở đấu trường Solo 1v1.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên repo, chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F19] border border-[#1E293B] rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              style={{ height: '32px' }}
            />
          </div>

          {/* Squad Fit Switcher */}
          <div className="flex items-center gap-1 bg-[#0B0F19] p-0.5 rounded-lg border border-[#1E293B]">
            {[
              { id: 'ALL', label: 'Tất Cả' },
              { id: 'NEW_ROLE_GAP', label: 'Cơ Hội Tuyển (5)' },
              { id: 'ALREADY_HAVE', label: 'Đã Có (5)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterFit(tab.id as any)}
                className={`btn-action border transition-all ${
                  filterFit === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
                style={{ fontSize: '11px', height: '28px', padding: '3px 8px', whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10-Repo Grid (Responsive < 1024px Stack 1fr) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredRepos.map((repo, idx) => {
          const isAlreadyInTeam = repo.agentInTeamStatus === 'ALREADY_HAVE';

          return (
            <div
              key={repo.id}
              className="card-clickable rounded-xl p-4 sm:p-5 flex flex-col justify-between select-none relative overflow-hidden bg-[#111827] border-[#1E293B] hover:border-amber-500/40 hover:bg-[#131D30] transition-all"
              style={{ minHeight: '280px' }}
            >
              {/* Top Row: Rank, Owner Avatar, Repo Name, Stars/Forks */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors flex items-center gap-1"
                        >
                          {repo.fullName}
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </a>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Ngôn ngữ: <strong className="text-cyan-300">{repo.language}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Squad Fit Badge */}
                  <div className="flex flex-col items-end gap-1">
                    {isAlreadyInTeam ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ĐÃ CÓ TRONG TEAM
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        CHƯA CÓ TRONG TEAM
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 font-mono">
                      Đối ứng: <strong className="text-cyan-400">{repo.matchedAgentCode}</strong>
                    </span>
                  </div>
                </div>

                {/* Stars and Forks Count Chips */}
                <div className="flex items-center gap-3 mb-2.5 text-[11px] font-mono">
                  <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                    <Star className="w-3 h-3 fill-current" />
                    {repo.stars.toLocaleString()} Stars
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    <GitFork className="w-3 h-3" />
                    {repo.forks.toLocaleString()} Forks
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-500/30 text-[10px]">
                    {repo.roleFitCategory}
                  </span>
                </div>

                {/* Repo Description */}
                <p className="text-[12px] text-slate-300 leading-relaxed mb-3 line-clamp-2">
                  {repo.description}
                </p>

                {/* Capability Summary & Squad Value Strip */}
                <div className="p-2.5 rounded-lg bg-[#090D16] border border-[#1E293B] space-y-1.5 mb-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium text-[11px]">Năng lực cốt lõi: </span>
                    <span className="text-slate-200 text-[11.5px] font-medium">{repo.capabilitySummary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-[11px]">Giá trị cho Squad: </span>
                    <span className="text-cyan-300 text-[11.5px]">{repo.whyUseful}</span>
                  </div>
                </div>

                {/* Topics Pills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {repo.topics.slice(0, 4).map((topic, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-800/90 text-slate-300 border border-slate-700 font-mono"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer (Strict token compliance: 11.5-12.5px, 28-38px, nowrap, flex-wrap) */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="text-[11px] text-slate-400 font-mono">
                  Ghép cặp: <strong className="text-cyan-300">{repo.matchedAgentCode}</strong>
                </div>

                <div className="btn-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerSoloBattle(repo);
                    }}
                    className="btn-action bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20"
                    style={{ fontSize: '11.5px', height: '32px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>⚔️ Cử Agent Solo 1v1</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDirectHireProposal(repo);
                    }}
                    className="btn-action bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-semibold"
                    style={{ fontSize: '11.5px', height: '32px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>🏆 Tuyển Mộ Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
