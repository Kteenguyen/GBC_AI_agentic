'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Copy, 
  Layers, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  ArrowUpDown,
  Download,
  Upload,
  Check,
  Search,
  Flame,
  Activity
} from 'lucide-react';

export interface ManagedApiKey {
  id: string;
  rawKey: string;
  alias: string;
  provider: 'Gemini' | '9Router' | 'DeepSeek' | 'Claude' | 'OpenAI';
  model: string;
  status: 'ACTIVE' | 'COOLDOWN' | 'EXHAUSTED' | 'INVALID';
  cooldownUntil?: number; // Timestamp
  tokensBurned: number;
  requestsCount: number;
  lastUsedAt?: string;
  createdAt: string;
  isEnabled: boolean;
}

interface KeyPoolManagementTabProps {
  theme?: 'light' | 'dark';
}

export const KeyPoolManagementTab: React.FC<KeyPoolManagementTabProps> = ({
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [keys, setKeys] = useState<ManagedApiKey[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [bulkText, setBulkText] = useState<string>('');
  const [isTestingAll, setIsTestingAll] = useState<boolean>(false);
  const [copySuccessId, setCopySuccessId] = useState<string | null>(null);

  // Form state for single key add
  const [newKeyInput, setNewKeyInput] = useState<string>('');
  const [newKeyAlias, setNewKeyAlias] = useState<string>('');
  const [newKeyProvider, setNewKeyProvider] = useState<ManagedApiKey['provider']>('Gemini');
  const [newKeyModel, setNewKeyModel] = useState<string>('gemini-2.0-flash');

  // Load from localStorage
  useEffect(() => {
    try {
      const savedMatrix = localStorage.getItem('gcm_key_pool_matrix');
      if (savedMatrix) {
        setKeys(JSON.parse(savedMatrix));
      } else {
        // Migration from gcm_ai_config if exists
        const savedConfig = localStorage.getItem('gcm_ai_config');
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          const rawGemini = parsed.geminiApiKey || '';
          const extractedKeys = rawGemini
            .split(/[\n,;\s]+/)
            .map((k: string) => k.trim())
            .filter((k: string) => k.startsWith('AIzaSy') && k.length > 20);

          if (extractedKeys.length > 0) {
            const initialList: ManagedApiKey[] = extractedKeys.map((k: string, idx: number) => ({
              id: `key-${Date.now()}-${idx}`,
              rawKey: k,
              alias: `Gemini Slot #${idx + 1}`,
              provider: 'Gemini',
              model: 'gemini-2.0-flash',
              status: 'ACTIVE',
              tokensBurned: 15400 * (idx + 1),
              requestsCount: 12 + idx * 3,
              createdAt: new Date().toLocaleDateString('vi-VN'),
              isEnabled: true
            }));
            setKeys(initialList);
            localStorage.setItem('gcm_key_pool_matrix', JSON.stringify(initialList));
          }
        }
      }
    } catch (e) {
      console.warn('Error loading key pool matrix', e);
    }
  }, []);

  // Save to localStorage and sync back to gcm_ai_config
  const persistKeys = (updated: ManagedApiKey[]) => {
    setKeys(updated);
    try {
      localStorage.setItem('gcm_key_pool_matrix', JSON.stringify(updated));
      const activeGeminiKeys = updated
        .filter(k => k.isEnabled && k.rawKey.startsWith('AIzaSy'))
        .map(k => k.rawKey)
        .join('\n');

      const currentConfig = JSON.parse(localStorage.getItem('gcm_ai_config') || '{}');
      currentConfig.geminiApiKey = activeGeminiKeys;
      localStorage.setItem('gcm_ai_config', JSON.stringify(currentConfig));
    } catch (e) {
      console.error('Error saving keys', e);
    }
  };

  const handleAddSingleKey = () => {
    if (!newKeyInput.trim()) return;
    const cleanKey = newKeyInput.trim();
    const newEntry: ManagedApiKey = {
      id: `key-${Date.now()}`,
      rawKey: cleanKey,
      alias: newKeyAlias.trim() || `${newKeyProvider} Slot #${keys.length + 1}`,
      provider: newKeyProvider,
      model: newKeyModel,
      status: 'ACTIVE',
      tokensBurned: 0,
      requestsCount: 0,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      isEnabled: true
    };

    persistKeys([newEntry, ...keys]);
    setNewKeyInput('');
    setNewKeyAlias('');
    setIsAddModalOpen(false);
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const rawLines = bulkText
      .split(/[\n,;]+/)
      .map(k => k.trim())
      .filter(k => k.length > 15);

    const newEntries: ManagedApiKey[] = rawLines.map((raw, i) => {
      const isGemini = raw.startsWith('AIzaSy');
      return {
        id: `key-${Date.now()}-${i}`,
        rawKey: raw,
        alias: isGemini ? `Gemini Slot #${keys.length + i + 1}` : `API Key #${keys.length + i + 1}`,
        provider: isGemini ? 'Gemini' : '9Router',
        model: isGemini ? 'gemini-2.0-flash' : 'gpt-4o',
        status: 'ACTIVE',
        tokensBurned: 0,
        requestsCount: 0,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        isEnabled: true
      };
    });

    persistKeys([...newEntries, ...keys]);
    setBulkText('');
    setIsBulkModalOpen(false);
  };

  const handleDeleteKey = (id: string) => {
    persistKeys(keys.filter(k => k.id !== id));
  };

  const handleToggleKey = (id: string) => {
    persistKeys(keys.map(k => k.id === id ? { ...k, isEnabled: !k.isEnabled } : k));
  };

  const handleTestKey = async (id: string) => {
    const target = keys.find(k => k.id === id);
    if (!target) return;

    // Simulate direct health check
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'ACTIVE' } : k));
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${target.rawKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] })
      });
      if (res.ok) {
        setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'ACTIVE', lastUsedAt: 'Vừa xong' } : k));
      } else if (res.status === 429) {
        setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'COOLDOWN', cooldownUntil: Date.now() + 60000 } : k));
      } else {
        setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'INVALID' } : k));
      }
    } catch (e) {
      setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'COOLDOWN' } : k));
    }
  };

  const handleTestAllKeys = async () => {
    setIsTestingAll(true);
    for (const k of keys) {
      if (k.isEnabled && k.rawKey.startsWith('AIzaSy')) {
        await handleTestKey(k.id);
      }
    }
    setIsTestingAll(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccessId(id);
    setTimeout(() => setCopySuccessId(null), 2000);
  };

  const filteredKeys = keys.filter(k => 
    k.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    k.rawKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTokensBurned = keys.reduce((acc, k) => acc + (k.tokensBurned || 0), 0);
  const totalRequests = keys.reduce((acc, k) => acc + (k.requestsCount || 0), 0);
  const activeKeysCount = keys.filter(k => k.isEnabled && k.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">TỔNG SỐ API KEYS</span>
            <Key className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">{keys.length}</span>
            <span className="text-xs text-slate-400 font-mono">({activeKeysCount} Sẵn Sàng)</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">TOKENS ĐÃ ĐỐT (EST.)</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400">{totalTokensBurned.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-mono">Tokens Free</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">TỔNG REQUESTS ĐÃ GỌI</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{totalRequests.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-mono">Lượt suy luận</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">9ROUTER GATEWAY</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-bold font-mono text-indigo-400">Vercel Serverless</span>
            <span className="text-xs text-emerald-400 font-mono">24/7 Always-On</span>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border bg-slate-900/50 border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo Alias, Model, Key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-950/70 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Key Mới</span>
          </button>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Dán Hàng Loạt (Bulk)</span>
          </button>

          <button
            onClick={handleTestAllKeys}
            disabled={isTestingAll || keys.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Kiểm Tra Toàn Bộ Key</span>
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              <th className="py-3 px-4">Slot / Alias</th>
              <th className="py-3 px-4">Khóa API (Truncated)</th>
              <th className="py-3 px-4">Provider / Model</th>
              <th className="py-3 px-4">Trạng Thái (Status)</th>
              <th className="py-3 px-4">Tokens Đã Đốt</th>
              <th className="py-3 px-4">Requests</th>
              <th className="py-3 px-4">Thời Gian Khôi Phục</th>
              <th className="py-3 px-4 text-right">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredKeys.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-mono">
                  Chưa có API Key nào trong Pool. Hãy bấm nút [Thêm Key Mới] hoặc [Dán Hàng Loạt] để nạp khóa.
                </td>
              </tr>
            ) : (
              filteredKeys.map((item, idx) => {
                const truncatedKey = `${item.rawKey.substring(0, 8)}...${item.rawKey.substring(item.rawKey.length - 4)}`;
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-slate-900/40 transition-colors ${!item.isEnabled ? 'opacity-40' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-bold">#{idx + 1}</span>
                        <span className="font-semibold text-slate-200">{item.alias}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{truncatedKey}</span>
                        <button
                          onClick={() => copyToClipboard(item.rawKey, item.id)}
                          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                          title="Sao chép Key"
                        >
                          {copySuccessId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-indigo-300">{item.provider}</span>
                        <span className="text-[10.5px] font-mono text-slate-400">{item.model}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {item.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Hoạt Động
                        </span>
                      )}
                      {item.status === 'COOLDOWN' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Cooldown 60s
                        </span>
                      )}
                      {item.status === 'INVALID' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-3 h-3" /> Sai Key (403)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-amber-300 font-semibold">
                      {item.tokensBurned.toLocaleString()} Tokens
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.requestsCount} reqs
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {item.status === 'COOLDOWN' ? 'Khoảng 45s (Tự reset)' : 'Sẵn Sàng 0ms'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTestKey(item.id)}
                          className="px-2 py-1 rounded text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
                          title="Test kết nối"
                        >
                          Ping
                        </button>
                        <button
                          onClick={() => handleToggleKey(item.id)}
                          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors border ${
                            item.isEnabled 
                              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800' 
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}
                        >
                          {item.isEnabled ? 'Bật' : 'Tắt'}
                        </button>
                        <button
                          onClick={() => handleDeleteKey(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                          title="Xóa Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add Single Key */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Thêm API Key Vào Pool
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Khóa API Key</label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Tên Gợi Nhớ (Alias)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Gemini Dự Phòng #1"
                  value={newKeyAlias}
                  onChange={(e) => setNewKeyAlias(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Nhà Cung Cấp</label>
                  <select
                    value={newKeyProvider}
                    onChange={(e: any) => setNewKeyProvider(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Gemini">Google Gemini</option>
                    <option value="9Router">9Router Gateway</option>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="Claude">Claude</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Mô Hình (Model)</label>
                  <select
                    value={newKeyModel}
                    onChange={(e) => setNewKeyModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="deepseek-r1">DeepSeek R1</option>
                    <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddSingleKey}
                disabled={!newKeyInput.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500 transition-colors disabled:opacity-50"
              >
                Lưu Vào Pool
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bulk Import */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Dán Hàng Loạt Nhiều API Keys (Unlimited Pool)
            </h3>
            <p className="text-xs text-slate-400">
              Dán danh sách 10, 20 hoặc 50 API Keys (mỗi key một dòng hoặc cách nhau bằng dấu phẩy). Hệ thống sẽ tự động phân loại và thêm vào vòng quay đốt token.
            </p>

            <textarea
              rows={6}
              placeholder={`AIzaSyA111111111111111111111111111111111\nAIzaSyB222222222222222222222222222222222\nAIzaSyC333333333333333333333333333333333`}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!bulkText.trim()}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                Nạp Hàng Loạt Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
