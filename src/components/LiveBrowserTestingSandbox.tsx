'use client';

import React, { useState, useEffect } from 'react';
import { BrowserTestAction } from '@/lib/orchestrator-engine';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCw, 
  ShieldCheck, 
  CheckCircle2, 
  MousePointer, 
  Ruler, 
  Camera, 
  Lock, 
  Sparkles
} from 'lucide-react';

interface LiveBrowserTestingSandboxProps {
  actions: BrowserTestAction[];
  currentActionIndex: number;
  isPlaying: boolean;
  viewportMode: 'IPHONE_430' | 'TABLET_768' | 'DESKTOP_1280';
  onChangeViewport: (mode: 'IPHONE_430' | 'TABLET_768' | 'DESKTOP_1280') => void;
}

export const LiveBrowserTestingSandbox: React.FC<LiveBrowserTestingSandboxProps> = ({
  actions,
  currentActionIndex,
  isPlaying,
  viewportMode,
  onChangeViewport
}) => {
  const currentAction = actions[currentActionIndex] || actions[0];
  const [typedValue, setTypedValue] = useState<string>('');

  useEffect(() => {
    if (currentAction && currentAction.actionType === 'TYPE' && currentAction.inputValue) {
      setTypedValue(currentAction.inputValue);
    }
  }, [currentActionIndex, currentAction]);

  const getViewportWidthClass = () => {
    switch (viewportMode) {
      case 'IPHONE_430':
        return 'w-[430px] max-w-full';
      case 'TABLET_768':
        return 'w-[680px] max-w-full';
      default:
        return 'w-full max-w-4xl';
    }
  };

  return (
    <div className="w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Interactive Live Browser UI Sandbox (iPhone 14 Pro Max 430px)
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PLAYWRIGHT VISION
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mắt thần QA Testing Subagent trực tiếp click nút, điền form và đo pixel bounds 430px
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => onChangeViewport('IPHONE_430')}
            className={`btn-action transition-all ${
              viewportMode === 'IPHONE_430'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{ fontSize: '11px', height: '28px', padding: '4px 10px' }}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 430px</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewport('TABLET_768')}
            className={`btn-action transition-all ${
              viewportMode === 'TABLET_768'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{ fontSize: '11px', height: '28px', padding: '4px 10px' }}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet 768px</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeViewport('DESKTOP_1280')}
            className={`btn-action transition-all ${
              viewportMode === 'DESKTOP_1280'
                ? 'bg-purple-600 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{ fontSize: '11px', height: '28px', padding: '4px 10px' }}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className={`${getViewportWidthClass()} transition-all duration-300 rounded-2xl border-4 border-slate-800 bg-[#070B14] shadow-2xl overflow-hidden relative min-h-[520px] flex flex-col`}>
            <div className="bg-[#111827] border-b border-slate-800 p-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>

              <div className="flex-1 bg-[#090D16] border border-slate-800 rounded-md px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-slate-500">https://</span>
                <span className="text-cyan-300 font-bold truncate">localhost:3000/quotations</span>
              </div>

              <RotateCw className={`w-3.5 h-3.5 text-slate-400 ${isPlaying ? 'animate-spin text-cyan-400' : ''}`} />
            </div>

            <div className="flex-1 p-4 bg-[#0B0F19] relative flex flex-col justify-between space-y-4 overflow-hidden select-none">
              {currentAction && currentAction.cursorPos && (
                <div
                  className="absolute z-50 pointer-events-none transition-all duration-500 flex items-center gap-1"
                  style={{
                    left: `${Math.min(currentAction.cursorPos.x, 360)}px`,
                    top: `${currentAction.cursorPos.y}px`
                  }}
                >
                  <MousePointer className="w-5 h-5 text-rose-400 fill-rose-500 drop-shadow-md animate-bounce" />
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-rose-950 text-rose-200 border border-rose-500/40">
                    QA Pointer
                  </span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111827] border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-[10px] text-white font-bold">
                      GC
                    </div>
                    <span className="text-xs font-bold text-white">Báo Giá Nhanh</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Realtime 0ms
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#111827] border border-slate-800 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">Tạo Báo Giá Mới</span>
                    <button
                      id="btn-create-quote"
                      type="button"
                      className={`btn-action text-white font-bold transition-all relative ${
                        currentAction && currentAction.targetSelector === '#btn-create-quote'
                          ? 'bg-rose-500 ring-4 ring-rose-400/30 scale-105'
                          : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                      style={{ fontSize: '11px', height: '28px', padding: '4px 10px' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      + Tạo Báo Giá
                    </button>
                  </div>

                  <div className="space-y-1 mt-2">
                    <label className="text-[10px] font-semibold text-slate-400 block">
                      Tên Khách Hàng:
                    </label>
                    <input
                      id="input-customer"
                      type="text"
                      readOnly
                      value={typedValue}
                      placeholder="Chờ QA tự động nhập liệu..."
                      className={`w-full bg-[#070B14] border text-xs text-cyan-200 rounded px-2.5 py-1.5 focus:outline-none transition-all ${
                        currentAction && currentAction.targetSelector === '#input-customer'
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-[#0C1629]'
                          : 'border-slate-800'
                      }`}
                    />
                  </div>
                </div>

                {currentAction && currentAction.pixelMetrics && (
                  <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-950/20 animate-pulse relative">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" />
                        Pixel Measurement Gate:
                      </span>
                      <span>{currentAction.pixelMetrics.measuredRight}px &lt;= {currentAction.pixelMetrics.maxAllowed}px</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-emerald-400 h-full w-full" />
                    </div>
                    <span className="text-[9.5px] font-bold text-emerald-300 block mt-1">
                      ✓ ZERO-DEFECT: Không tràn viền màn hình iPhone 14 Pro Max!
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#111827] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Tổng Chi Phí:</span>
                    <span className="text-sm font-bold text-white font-mono">15.000.000đ</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#111827] border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Chiết Khấu:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">10% (-1.5M)</span>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-[#090D16] border border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Viewport: <strong>430 x 932 px</strong></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Playwright Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-400" />
              Nhật Ký Thao Tác Trình Duyệt ({actions.length} Bước)
            </h4>
            <span className="text-[11px] font-mono text-cyan-300">
              Bước {currentActionIndex + 1}/{actions.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {actions.map((act, idx) => {
              const isCurrent = idx === currentActionIndex;
              const isDone = idx < currentActionIndex;

              return (
                <div
                  key={act.stepIndex}
                  className={`p-3 rounded-xl border transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#121E36] border-purple-400 ring-1 ring-purple-400/40 shadow-md'
                      : isDone
                      ? 'bg-[#0E1524] border-emerald-500/30'
                      : 'bg-[#0B0F19] border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                        #{act.stepIndex}
                      </span>
                      <span className="text-xs font-bold text-white">{act.title}</span>
                    </div>

                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                    ) : null}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    {act.description}
                  </p>

                  {act.pixelMetrics && isCurrent && (
                    <div className="mt-2 p-1.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
                      <span>Đo Pixel right:</span>
                      <strong className="text-emerald-400">{act.pixelMetrics.measuredRight}px / 430px (PASS)</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
