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
  Flame, 
  Tag
} from 'lucide-react';
import { GitHubTrendingRepo } from '@/types';

interface GitHubTrendingHunterProps {
  repos: GitHubTrendingRepo[];
  onTriggerSoloBattle: (repo: GitHubTrendingRepo) => void;
  onDirectHireProposal: (repo: GitHubTrendingRepo) => void;
  theme?: 'light' | 'dark';
}

export const GitHubTrendingHunter: React.FC<GitHubTrendingHunterProps> = ({
  repos = [],
  onTriggerSoloBattle,
  onDirectHireProposal,
  theme = 'light'
}) => {
  const [filterFit, setFilterFit] = useState<'ALL' | 'NEW_ROLE_GAP' | 'ALREADY_HAVE'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isLight = theme === 'light';

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
    <div className="w-full space-y-4 font-sans">
      {/* Top Banner & Control Center */}
      <div className={`rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm border transition ${
        isLight
          ? 'bg-white border-[#E2DDD5] text-slate-800'
          : 'bg-[#111827] border-[#1E293B] text-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-base sm:text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Top 10 GitHub Trending Repositories (Realtime Hunter)
              </h2>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border ${
                isLight 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-amber-950 text-amber-300 border-amber-500/30'
              }`}>
                {repos.length} Repositories
              </span>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
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
              className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none transition border ${
                isLight
                  ? 'bg-[#FAF8F5] border-[#E2DDD5] text-slate-800 placeholder-slate-400 focus:border-amber-500'
                  : 'bg-[#0B0F19] border-[#1E293B] text-slate-200 placeholder-slate-500 focus:border-amber-500'
              }`}
              style={{ height: '32px' }}
            />
          </div>

          {/* Squad Fit Switcher */}
          <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${
            isLight ? 'bg-[#FAF8F5] border-[#E2DDD5]' : 'bg-[#0B0F19] border-[#1E293B]'
          }`}>
            {[
              { id: 'ALL', label: 'Tất Cả' },
              { id: 'NEW_ROLE_GAP', label: 'Cơ Hội Tuyển (5)' },
              { id: 'ALREADY_HAVE', label: 'Đã Có (5)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterFit(tab.id as any)}
                className={`rounded-lg transition-all font-bold text-xs ${
                  filterFit === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-slate-400 hover:text-slate-200')
                }`}
                style={{ fontSize: '11px', height: '28px', padding: '3px 10px', whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10-Repo Grid (Responsive < 1024px Stack 1fr) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredRepos.length === 0 ? (
          <div className={`col-span-2 p-12 text-center rounded-2xl border ${
            isLight ? 'bg-white border-[#E2DDD5] text-slate-500' : 'bg-[#111827] border-[#1E293B] text-slate-400'
          }`}>
            Đang tải dữ liệu GitHub Trending Repositories...
          </div>
        ) : (
          filteredRepos.map((repo, idx) => {
            const isAlreadyInTeam = repo.agentInTeamStatus === 'ALREADY_HAVE';

            return (
              <div
                key={repo.id}
                className={`rounded-2xl p-5 flex flex-col justify-between select-none relative overflow-hidden transition-all shadow-sm border ${
                  isLight
                    ? 'bg-white border-[#E2DDD5] hover:border-amber-400 hover:shadow-md'
                    : 'bg-[#111827] border-[#1E293B] hover:border-amber-500/40 hover:bg-[#131D30]'
                }`}
                style={{ minHeight: '280px' }}
              >
                {/* Top Row: Rank, Owner Avatar, Repo Name, Stars/Forks */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full font-mono font-black text-xs flex items-center justify-center border shrink-0 ${
                        isLight 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-slate-800 text-amber-400 border-slate-700'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`font-black text-sm sm:text-base transition-colors flex items-center gap-1 ${
                              isLight ? 'text-slate-900 hover:text-amber-600' : 'text-white hover:text-amber-400'
                            }`}
                          >
                            {repo.fullName}
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          </a>
                        </div>
                        <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          Ngôn ngữ: <strong className={isLight ? 'text-blue-700' : 'text-cyan-300'}>{repo.language}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Squad Fit Badge */}
                    <div className="flex flex-col items-end gap-1">
                      {isAlreadyInTeam ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                          isLight 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ĐÃ CÓ TRONG TEAM
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border animate-pulse ${
                          isLight 
                            ? 'bg-amber-50 text-amber-800 border-amber-300' 
                            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        }`}>
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          CHƯA CÓ TRONG TEAM
                        </span>
                      )}

                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        Đối ứng: <strong className={isLight ? 'text-blue-700' : 'text-cyan-400'}>{repo.matchedAgentCode}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Stars and Forks Count Chips */}
                  <div className="flex items-center gap-2.5 mb-2.5 text-[11px] font-mono flex-wrap">
                    <span className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg border ${
                      isLight 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-amber-950/40 text-amber-300 border-amber-500/20'
                    }`}>
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {repo.stars.toLocaleString()} Stars
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border ${
                      isLight 
                        ? 'bg-slate-100 text-slate-700 border-slate-200' 
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      <GitFork className="w-3 h-3" />
                      {repo.forks.toLocaleString()} Forks
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg font-bold border text-[10px] ${
                      isLight 
                        ? 'bg-blue-50 text-blue-800 border-blue-200' 
                        : 'bg-blue-950 text-blue-300 border-blue-500/30'
                    }`}>
                      {repo.roleFitCategory}
                    </span>
                  </div>

                  {/* Repo Description */}
                  <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {repo.description}
                  </p>

                  {/* Capability Summary & Squad Value Strip */}
                  <div className={`p-3 rounded-xl space-y-1 mb-3 text-xs border ${
                    isLight 
                      ? 'bg-[#FAF8F5] border-[#E2DDD5]' 
                      : 'bg-[#090D16] border-[#1E293B]'
                  }`}>
                    <div>
                      <span className={`font-semibold text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Năng lực cốt lõi: </span>
                      <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{repo.capabilitySummary}</span>
                    </div>
                    <div>
                      <span className={`font-semibold text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Giá trị cho Squad: </span>
                      <span className={`font-medium ${isLight ? 'text-blue-700' : 'text-cyan-300'}`}>{repo.whyUseful}</span>
                    </div>
                  </div>

                  {/* Topics Pills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${
                          isLight 
                            ? 'bg-[#FAF8F5] text-slate-600 border-[#E2DDD5]' 
                            : 'bg-[#0E1526] text-slate-400 border-slate-800'
                        }`}
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: 1v1 Battle Arena & Direct Hire */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 flex-wrap ${
                  isLight ? 'border-[#E2DDD5]' : 'border-[#1E293B]'
                }`}>
                  <button
                    type="button"
                    onClick={() => onTriggerSoloBattle(repo)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-xs py-2 shadow-sm transition active:scale-[0.98] cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Cử Agent Ra Solo 1v1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDirectHireProposal(repo)}
                    disabled={repo.isHired}
                    className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      repo.isHired
                        ? (isLight ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-slate-800 text-slate-500 border-slate-700')
                        : (isLight ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' : 'bg-blue-950/60 text-blue-300 border-blue-600/40 hover:bg-blue-900/60')
                    }`}
                  >
                    {repo.isHired ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Đã Tuyển</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Tuyển Dụng</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
