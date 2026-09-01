'use client';

import React from 'react';
import { ShieldAlert, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { UserRole } from '@/types';

interface RoleGuardBannerProps {
  currentRole: UserRole;
  requiredRole?: 'ADMIN_CEO' | 'HEAD';
  featureName?: string;
  onSwitchRole?: (role: UserRole) => void;
}

export const RoleGuardBanner: React.FC<RoleGuardBannerProps> = ({
  currentRole,
  requiredRole = 'ADMIN_CEO',
  featureName = 'Tính năng Quản trị & Điều phối Chiến lược',
  onSwitchRole,
}) => {
  const isCeoOrHead = currentRole === 'ADMIN_CEO' || currentRole === 'HEAD';

  if (isCeoOrHead) {
    return (
      <div className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-lg px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-400">
          <UserCheck className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Đã xác thực quyền {currentRole}:</strong> Toàn quyền truy cập Điều phối Squad, Solo Arena, Tuyển dụng và DevOps Pipeline.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>RBAC Guard: PASSED</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-amber-950/40 border border-amber-500/40 rounded-lg p-3 sm:p-4 text-xs">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-300 text-[13px]">{featureName}</span>
              <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Yêu cầu: {requiredRole} / HEAD
              </span>
            </div>
            <p className="text-slate-300 mt-1 text-[12px] leading-relaxed">
              Bạn đang ở quyền <strong className="text-amber-200">{currentRole}</strong> (Chế độ xem và chạy test). Các quyền điều hành, tuyển mộ và can thiệp quy trình CI/CD chỉ dành riêng cho CEO và Trưởng phòng (HEAD).
            </p>
          </div>
        </div>

        {onSwitchRole && (
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onSwitchRole('ADMIN_CEO')}
              className="btn-action bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md hover:shadow-amber-500/20"
              style={{ fontSize: '11.5px', height: '30px', padding: '4px 12px', whiteSpace: 'nowrap' }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Chuyển sang ADMIN_CEO
            </button>
            <button
              type="button"
              onClick={() => onSwitchRole('HEAD')}
              className="btn-action bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30"
              style={{ fontSize: '11.5px', height: '30px', padding: '4px 10px', whiteSpace: 'nowrap' }}
            >
              Chuyển HEAD
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
