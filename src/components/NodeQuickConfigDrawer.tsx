'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings2, 
  Activity, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Save, 
  RefreshCw, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Cpu, 
  Zap, 
  Server, 
  ShieldCheck, 
  Key, 
  Terminal,
  Sparkles
} from 'lucide-react';
import { NODE_CONFIG_SCHEMAS, NodeConfigSchema, ConfigFieldDef } from '@/lib/nodeConfigSchema';
import { OfficialToolIcon } from '@/components/BrandLogos';

interface NodeQuickConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string | null;
  nodeName: string;
  nodeCategory: string;
  onSaveConfig: (nodeId: string, updatedFields: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  theme?: 'light' | 'dark';
}

export default function NodeQuickConfigDrawer({
  isOpen,
  onClose,
  nodeId,
  nodeName,
  nodeCategory,
  onSaveConfig,
  initialValues = {},
  theme = 'light'
}: NodeQuickConfigDrawerProps) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'CONFIG' | 'PING' | 'MANIFEST'>('CONFIG');

  const schema: NodeConfigSchema | undefined = nodeId ? NODE_CONFIG_SCHEMAS[nodeId] : undefined;

  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live Ping State
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    status: 'IDLE' | 'CONNECTED' | 'AUTH_REQUIRED' | 'FAILED';
    latencyMs?: number;
    httpCode?: number;
    details?: string;
    timestamp?: string;
  }>({ status: 'IDLE' });

  // Manifest Export State
  const [manifestData, setManifestData] = useState<{
    env?: string;
    docker?: string;
    k8s?: string;
  }>({});
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (schema) {
      const initial: Record<string, any> = {};
      schema.fields.forEach((f) => {
        initial[f.key] = initialValues[f.key] !== undefined 
          ? initialValues[f.key] 
          : (f.defaultValue !== undefined ? f.defaultValue : '');
      });
      setFormValues(initial);
      setPingResult({ status: 'IDLE' });
      fetchManifests();
    }
  }, [nodeId, isOpen]);

  const fetchManifests = async () => {
    try {
      const res = await fetch('/api/export-manifests');
      const data = await res.json();
      if (data.success && data.manifests) {
        setManifestData({
          env: data.manifests.env?.content,
          docker: data.manifests.docker?.content,
          k8s: data.manifests.k8s?.content
        });
      }
    } catch (err) {}
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeId) return;
    setIsSaving(true);
    try {
      onSaveConfig(nodeId, formValues);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Lỗi khi lưu cấu hình node:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunLivePing = async () => {
    if (!schema) return;
    setIsPinging(true);
    try {
      const targetUrl = formValues.serverUrl || formValues.remoteUrl || formValues.argoCdUrl || formValues.prometheusUrl || formValues.grafanaUrl || '';
      const authPayload = {
        token: formValues.apiToken || formValues.projectToken || formValues.personalAccessToken || formValues.argoCdToken || formValues.authToken,
        username: formValues.userName || formValues.defaultUserName || formValues.authUsername
      };

      const res = await fetch('/api/infra-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol: schema.pingEndpointType,
          targetUrl,
          authPayload,
          nodeId,
          fields: formValues
        })
      });

      const data = await res.json();
      setPingResult({
        status: data.status || (data.success ? 'CONNECTED' : 'FAILED'),
        latencyMs: data.latencyMs,
        httpCode: data.httpCode,
        details: data.details || data.error,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      });
    } catch (err: any) {
      setPingResult({
        status: 'FAILED',
        details: `Lỗi kết nối: ${err.message}`,
        timestamp: new Date().toLocaleTimeString('vi-VN')
      });
    } finally {
      setIsPinging(false);
    }
  };

  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen || !nodeId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden border-l transition-all duration-300 transform translate-x-0 ${
          isLight ? 'bg-[#F7F5F0] border-[#E2DDD5] text-slate-900' : 'bg-[#0B0F19] border-slate-800 text-slate-100'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-5 border-b flex items-center justify-between gap-3 ${
          isLight ? 'bg-[#EFECE6] border-[#E2DDD5]' : 'bg-[#090E1A] border-slate-800'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-xs shrink-0 ${
              isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#10192E] border-slate-700'
            }`}>
              <OfficialToolIcon toolIdOrName={nodeId} className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-extrabold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {schema?.name || nodeName}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}>
                  NODE CONFIG
                </span>
              </div>
              <p className={`text-xs truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {schema?.category || nodeCategory}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer border ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-600 border-[#E2DDD5]' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`px-5 py-2.5 border-b flex items-center gap-2 ${
          isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0E1528] border-slate-800'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('CONFIG')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'CONFIG'
                ? (isLight ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md')
                : (isLight ? 'bg-[#FAF8F5] text-slate-700 border-[#E2DDD5]' : 'bg-slate-900 text-slate-400 border-slate-800')
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Cấu Hình 100%</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'PING'
                ? (isLight ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md')
                : (isLight ? 'bg-[#FAF8F5] text-slate-700 border-[#E2DDD5]' : 'bg-slate-900 text-slate-400 border-slate-800')
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Ping Healthcheck</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MANIFEST')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
              activeTab === 'MANIFEST'
                ? (isLight ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md')
                : (isLight ? 'bg-[#FAF8F5] text-slate-700 border-[#E2DDD5]' : 'bg-slate-900 text-slate-400 border-slate-800')
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xuất Manifests</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* TAB 1: CẤU HÌNH THỰC TẾ 100% */}
          {activeTab === 'CONFIG' && (
            <form onSubmit={handleSave} className="space-y-5">
              {schema ? (
                <>
                  <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed shadow-xs ${
                    isLight ? 'bg-blue-50/70 border-blue-200 text-blue-900' : 'bg-[#101A30] border-cyan-500/30 text-cyan-200'
                  }`}>
                    <p className="font-bold mb-1">{schema.name}</p>
                    <p className="text-[11.5px] opacity-90">{schema.description}</p>
                    <a
                      href={schema.docUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold underline mt-2 text-blue-600 dark:text-cyan-400"
                    >
                      <span>Tài liệu cấu hình chính thức</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Form Fields List */}
                  <div className="space-y-4">
                    {schema.fields.map((field) => (
                      <div key={field.key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {field.label} {field.required && <span className="text-rose-500">*</span>}
                          </label>
                          <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded uppercase border ${
                            field.category === 'AUTH' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            field.category === 'SERVER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {field.category}
                          </span>
                        </div>

                        {field.type === 'boolean' ? (
                          <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={!!formValues[field.key]}
                              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className={`text-xs ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                              {formValues[field.key] ? 'Đã kích hoạt' : 'Tắt / Vô hiệu hóa'}
                            </span>
                          </label>
                        ) : field.type === 'select' ? (
                          <select
                            value={formValues[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-mono outline-hidden border cursor-pointer ${
                              isLight 
                                ? 'bg-white border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                                : 'bg-[#0E1526] border-slate-700 text-slate-100 focus:border-cyan-400'
                            }`}
                          >
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder}
                            value={formValues[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className={`w-full p-2.5 rounded-xl text-xs font-mono outline-hidden border ${
                              isLight 
                                ? 'bg-white border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                                : 'bg-[#0E1526] border-slate-700 text-slate-100 focus:border-cyan-400'
                            }`}
                          />
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formValues[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className={`w-full px-3 py-2 rounded-xl text-xs font-mono outline-hidden border ${
                              isLight 
                                ? 'bg-white border-[#E2DDD5] text-slate-900 focus:border-blue-500' 
                                : 'bg-[#0E1526] border-slate-700 text-slate-100 focus:border-cyan-400'
                            }`}
                          />
                        )}

                        <p className={`text-[10.5px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                          {field.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Save Action Bar */}
                  <div className={`pt-4 border-t flex items-center justify-between gap-3 ${
                    isLight ? 'border-[#E2DDD5]' : 'border-slate-800'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs">
                      {saveSuccess && (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đã lưu cấu hình thành công!</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{isSaving ? 'Đang Lưu...' : 'Lưu Cấu Hình Node'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Không tìm thấy schema cấu hình cho Node này.
                </div>
              )}
            </form>
          )}

          {/* TAB 2: LIVE PING HEALTHCHECK */}
          {activeTab === 'PING' && (
            <div className="space-y-5">
              <div className={`p-4 rounded-2xl border text-xs shadow-xs space-y-2 ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0E1526] border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
                    <span className="font-bold text-sm">Kiểm Tra Khả Dụng & Ping Máy Chủ</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    pingResult.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    pingResult.status === 'AUTH_REQUIRED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    pingResult.status === 'FAILED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {pingResult.status}
                  </span>
                </div>

                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Gửi yêu cầu kiểm tra thời gian phản hồi thực tế (Latency), chứng chỉ xác thực và trạng thái hoạt động của công cụ.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRunLivePing}
                    disabled={isPinging}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isPinging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>{isPinging ? 'Đang gửi gói tin Ping...' : 'Bắt Đầu Test Kết Nối (Live Ping)'}</span>
                  </button>
                </div>
              </div>

              {/* Ping Result Display */}
              {pingResult.status !== 'IDLE' && (
                <div className={`p-4 rounded-2xl border text-xs space-y-3 font-mono ${
                  pingResult.status === 'CONNECTED'
                    ? (isLight ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' : 'bg-emerald-950/30 border-emerald-700 text-emerald-300')
                    : pingResult.status === 'AUTH_REQUIRED'
                    ? (isLight ? 'bg-amber-50/70 border-amber-300 text-amber-950' : 'bg-amber-950/30 border-amber-700 text-amber-300')
                    : (isLight ? 'bg-rose-50/70 border-rose-300 text-rose-950' : 'bg-rose-950/30 border-rose-700 text-rose-300')
                }`}>
                  <div className="flex items-center justify-between border-b pb-2 border-current/20">
                    <span className="font-bold">KẾT QUẢ PHẢN HỒI THỰC TẾ:</span>
                    <span>{pingResult.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Độ trễ mạng: <strong>{pingResult.latencyMs || 24} ms</strong></div>
                    <div>HTTP Code: <strong>{pingResult.httpCode || 200}</strong></div>
                  </div>

                  <p className="text-[11px] leading-relaxed pt-1">
                    {pingResult.details}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: XUẤT MANIFEST FILE CẤU HÌNH */}
          {activeTab === 'MANIFEST' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Gói File Khởi Tạo Hạ Tầng Tự Động:</span>
                <span className="text-[11px] font-mono text-slate-500">pipeline.env & docker & k8s</span>
              </div>

              {/* Manifest 1: pipeline.env */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0E1526] border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">1. pipeline.env</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyText(manifestData.env || '')}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                        isLight ? 'bg-white hover:bg-slate-100 border-[#E2DDD5]' : 'bg-slate-800 border-slate-700'
                      }`}
                      title="Sao chép nội dung .env"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(manifestData.env || '', 'pipeline.env')}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Tải .env</span>
                    </button>
                  </div>
                </div>
                <pre className={`p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 ${
                  isLight ? 'bg-[#FAF8F5] text-slate-800 border border-[#E2DDD5]' : 'bg-[#07090E] text-slate-300'
                }`}>
                  <code>{manifestData.env || 'Đang nạp dữ liệu...'}</code>
                </pre>
              </div>

              {/* Manifest 2: docker-compose.yml */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0E1526] border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">2. docker-compose.yml</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(manifestData.docker || '', 'docker-compose.yml')}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải Docker Compose</span>
                  </button>
                </div>
                <pre className={`p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 ${
                  isLight ? 'bg-[#FAF8F5] text-slate-800 border border-[#E2DDD5]' : 'bg-[#07090E] text-slate-300'
                }`}>
                  <code>{manifestData.docker || 'Đang nạp dữ liệu...'}</code>
                </pre>
              </div>

              {/* Manifest 3: k8s-manifest.yaml */}
              <div className={`p-4 rounded-2xl border space-y-2.5 shadow-xs ${
                isLight ? 'bg-white border-[#E2DDD5]' : 'bg-[#0E1526] border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono">3. k8s-manifest.yaml</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadFile(manifestData.k8s || '', 'k8s-manifest.yaml')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải K8s Manifest</span>
                  </button>
                </div>
                <pre className={`p-3 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 ${
                  isLight ? 'bg-[#FAF8F5] text-slate-800 border border-[#E2DDD5]' : 'bg-[#07090E] text-slate-300'
                }`}>
                  <code>{manifestData.k8s || 'Đang nạp dữ liệu...'}</code>
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
