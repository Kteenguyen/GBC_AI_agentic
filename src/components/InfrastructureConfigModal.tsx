'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings2, 
  FolderGit2, 
  GitBranch, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Check, 
  AlertCircle, 
  Save, 
  Download, 
  RefreshCw, 
  Cpu, 
  Zap,
  Server,
  Plus,
  Copy,
  ExternalLink,
  Play
} from 'lucide-react';

export interface TabAuditResult {
  isConfigured: boolean;
  totalFields: number;
  configuredFields: number;
  missingFields: string[];
}

export function auditTabConfig(tabKey: string, config: any): TabAuditResult {
  if (!config) {
    return { isConfigured: false, totalFields: 0, configuredFields: 0, missingFields: [] };
  }

  const isValValid = (val: any) => {
    if (val === null || val === undefined) return false;
    const str = String(val).trim();
    if (str === '' || str === 'bot...' || str === 'https://api.telegram.org/bot...') return false;
    return true;
  };

  switch (tabKey) {
    case 'WORKSPACE': {
      const fields = [
        { key: 'Thư mục gốc (rootDir)', val: config.workspace?.rootDir }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    case 'GIT': {
      const fields = [
        { key: 'Git User Name', val: config.git?.defaultUserName },
        { key: 'Git User Email', val: config.git?.defaultUserEmail }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    case 'CI': {
      const fields = [
        { key: 'Jenkins Server URL', val: config.ci?.serverUrl },
        { key: 'Jenkins Username', val: config.ci?.userName },
        { key: 'Jenkins API Token', val: config.ci?.apiToken }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    case 'SECURITY': {
      const fields = [
        { key: 'OWASP Scanner', val: config.security?.owasp?.scannerPath },
        { key: 'SonarQube Server URL', val: config.security?.sonarQube?.serverUrl },
        { key: 'SonarQube Project Token', val: config.security?.sonarQube?.projectToken }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    case 'DOCKER': {
      const fields = [
        { key: 'Docker Registry URL', val: config.docker?.registryUrl },
        { key: 'Socket Path', val: config.docker?.socketPath },
        { key: 'Repository Namespace', val: config.docker?.repositoryNamespace }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    case 'K8S': {
      const fields = [
        { key: 'ArgoCD Server URL', val: config.gitops?.argoCdUrl },
        { key: 'ArgoCD Token', val: config.gitops?.argoCdToken },
        { key: 'Config Repo URL', val: config.gitops?.configRepoUrl },
        { key: 'Kubeconfig Path', val: config.kubernetes?.kubeconfigPath }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    case 'TELEMETRY': {
      const fields = [
        { key: 'Prometheus URL', val: config.telemetry?.prometheusUrl },
        { key: 'Grafana URL', val: config.telemetry?.grafanaUrl },
        { key: 'Alert Webhook URL', val: config.telemetry?.alertWebhookUrl },
        { key: 'Email Recipient', val: config.telemetry?.emailRecipient }
      ];
      const missing = fields.filter(f => !isValValid(f.val)).map(f => f.key);
      return {
        isConfigured: missing.length === 0,
        totalFields: fields.length,
        configuredFields: fields.length - missing.length,
        missingFields: missing
      };
    }
    default:
      return { isConfigured: true, totalFields: 0, configuredFields: 0, missingFields: [] };
  }
}

export const DEFAULT_CONFIG = {
  version: "1.0.0",
  name: "Antigravity Open Workflow Engine",
  workspace: {
    rootDir: "C:\\Users\\ADMIN\\OneDrive\\Documents\\Work",
    autoScanSubdirectories: true,
    platform: "windows"
  },
  git: {
    defaultUserName: "Ktee",
    defaultUserEmail: "kteenguyen@gmail.com",
    authType: "HTTPS",
    defaultBranch: "main",
    autoCommitOnStagePass: false
  },
  ci: {
    provider: "Jenkins CI",
    serverUrl: "",
    userName: "",
    apiToken: "",
    jobPrefix: "pipeline-"
  },
  security: {
    owasp: { enabled: false, scannerPath: "", failOnCvss: 7 },
    sonarQube: { enabled: false, serverUrl: "", projectToken: "", qualityGateRequired: "PASSED" },
    trivy: { enabled: false, scanType: "fs,secret", severity: "CRITICAL,HIGH" }
  },
  docker: {
    socketPath: "",
    registryUrl: "",
    repositoryNamespace: "",
    autoTagVersion: true
  },
  gitops: {
    argoCdUrl: "",
    argoCdToken: "",
    configRepoUrl: "",
    targetNamespace: "production",
    autoSync: false
  },
  kubernetes: {
    kubeconfigPath: "",
    clusterContext: "",
    replicas: 3
  },
  telemetry: {
    prometheusUrl: "",
    grafanaUrl: "",
    alertWebhookUrl: "",
    emailRecipient: "kteenguyen@gmail.com"
  }
};

export interface InfrastructureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
  initialConfig?: any;
  onOpenCatalog?: () => void;
}

export default function InfrastructureConfigModal({
  isOpen,
  onClose,
  onSaved,
  initialConfig,
  onOpenCatalog
}: InfrastructureConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'WORKSPACE' | 'GIT' | 'CI' | 'SECURITY' | 'DOCKER' | 'K8S' | 'TELEMETRY' | 'WEBHOOK'>('WORKSPACE');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [config, setConfig] = useState<any>(initialConfig || DEFAULT_CONFIG);
  const [testResults, setTestResults] = useState<Record<string, { status: string; latencyMs: number; details: string }>>({});
  const [testingProtocol, setTestingProtocol] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.success && data.config) {
        setConfig(data.config);
      }
    } catch (e: any) {
      console.error('Error fetching config:', e);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Đã lưu cấu hình hạ tầng thành công!');
        setTimeout(() => setSaveMessage(null), 3000);
        if (onSaved) onSaved();
      }
    } catch (e) {
      setSaveMessage('Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestProtocol = async (protocol: string, targetUrl?: string) => {
    setTestingProtocol(protocol);
    try {
      const res = await fetch('/api/infra-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protocol, targetUrl })
      });
      const data = await res.json();
      if (data.success) {
        setTestResults(prev => ({
          ...prev,
          [protocol]: {
            status: data.status,
            latencyMs: data.latencyMs,
            details: data.details
          }
        }));
      }
    } catch (e) {
      setTestResults(prev => ({
        ...prev,
        [protocol]: {
          status: 'ERROR',
          latencyMs: 0,
          details: 'Không thể kết nối đến máy chủ mục tiêu'
        }
      }));
    } finally {
      setTestingProtocol(null);
    }
  };

  const handleExportJson = () => {
    if (!config) return;
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const isFieldConfigured = (val: any) => {
    if (val === null || val === undefined) return false;
    const str = String(val).trim();
    if (str === '' || str === 'bot...' || str === 'https://api.telegram.org/bot...') return false;
    return true;
  };

  const tabKeys = ['WORKSPACE', 'GIT', 'CI', 'SECURITY', 'DOCKER', 'K8S', 'TELEMETRY'];
  const completedTabsCount = config ? tabKeys.filter(k => auditTabConfig(k, config).isConfigured).length : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B101E] border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-[#080C17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">Trung Tâm Cấu Hình Hạ Tầng</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  completedTabsCount === 7 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  {completedTabsCount === 7 ? '7/7 ĐÃ CẤU HÌNH' : `${completedTabsCount}/7 ĐÃ CẤU HÌNH`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Thiết lập tham số Workspace, Git, CI/CD và kết nối Cloud
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 bg-[#0E1526] hover:bg-slate-800 border border-slate-700 transition"
              title="Tải tệp workflow.config.json"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Tabs + Right Config Form */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Tabs */}
          <div className="w-60 border-r border-slate-800 bg-[#080C17]/80 p-3 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-1">
              {/* Tab 1: WORKSPACE */}
              <button
                onClick={() => setActiveTab('WORKSPACE')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'WORKSPACE' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">1. Workspace</span>
                  </div>
                  {auditTabConfig('WORKSPACE', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'WORKSPACE' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 2: GIT */}
              <button
                onClick={() => setActiveTab('GIT')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'GIT' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <GitBranch className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">2. Git & Xác Thực</span>
                  </div>
                  {auditTabConfig('GIT', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'GIT' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 3: CI */}
              <button
                onClick={() => setActiveTab('CI')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'CI' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <Server className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">3. Jenkins CI</span>
                  </div>
                  {auditTabConfig('CI', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'CI' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 4: SECURITY */}
              <button
                onClick={() => setActiveTab('SECURITY')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'SECURITY' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">4. Ba Cổng Bảo Mật</span>
                  </div>
                  {auditTabConfig('SECURITY', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'SECURITY' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 5: DOCKER */}
              <button
                onClick={() => setActiveTab('DOCKER')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'DOCKER' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">5. Docker & Registry</span>
                  </div>
                  {auditTabConfig('DOCKER', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'DOCKER' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 6: K8S */}
              <button
                onClick={() => setActiveTab('K8S')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'K8S' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <Cpu className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">6. GitOps & K8s</span>
                  </div>
                  {auditTabConfig('K8S', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'K8S' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 7: TELEMETRY */}
              <button
                onClick={() => setActiveTab('TELEMETRY')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'TELEMETRY' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <Radio className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">7. Giám Sát & Alert</span>
                  </div>
                  {auditTabConfig('TELEMETRY', config).isConfigured ? (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'TELEMETRY' ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'}`}>
                      ĐỦ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-500 border border-slate-800 shrink-0">
                      THIẾU
                    </span>
                  )}
                </div>
              </button>

              {/* Tab 8: WEBHOOK */}
              <button
                onClick={() => setActiveTab('WEBHOOK')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'WEBHOOK' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 truncate">
                    <Zap className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span className="truncate">8. Webhook GitHub</span>
                  </div>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold shrink-0 ${activeTab === 'WEBHOOK' ? 'bg-white/20 text-white' : 'bg-amber-950 text-amber-400 border border-amber-500/30'}`}>
                    AUTO
                  </span>
                </div>
              </button>
            </div>

            {/* Bottom Button in Sidebar: Open Catalog */}
            {onOpenCatalog && (
              <div className="pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCatalog();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-blue-300 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/30 flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Nền Tảng Khác</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Form Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#070B14] space-y-6">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs font-mono">Đang tải cấu hình hạ tầng...</span>
              </div>
            ) : fetchError || !config ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <AlertCircle className="w-8 h-8 text-amber-400" />
                <span className="text-xs text-amber-300 font-bold">{fetchError || 'Chưa nạp được cấu hình'}</span>
                <button
                  onClick={fetchConfig}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Thử Lại</span>
                </button>
              </div>
            ) : (
              <>
                {/* TAB 1: WORKSPACE */}
                {activeTab === 'WORKSPACE' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">1. Cấu Hình Thư Mục Workspace Dự Án</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Chỉ định thư mục gốc chứa source code các dự án trên máy tính của bạn (Windows, macOS, Linux).
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">
                          Đường dẫn Thư mục Gốc (Root Projects Directory)
                        </label>
                        <input
                          type="text"
                          value={config.workspace?.rootDir || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            workspace: { ...config.workspace, rootDir: e.target.value }
                          })}
                          className={`w-full bg-[#0E1526] border rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none transition ${
                            isFieldConfigured(config.workspace?.rootDir) ? 'border-slate-700 focus:border-cyan-400' : 'border-slate-800 focus:border-blue-500'
                          }`}
                          placeholder="Ví dụ: C:\Users\ADMIN\OneDrive\Documents\Work hoặc /home/user/work"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Hệ điều hành nền tảng (Platform):</label>
                          <select
                            value={config.workspace?.platform || 'windows'}
                            onChange={(e) => setConfig({
                              ...config,
                              workspace: { ...config.workspace, platform: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                          >
                            <option value="windows">Windows (NTFS / PowerShell)</option>
                            <option value="linux">Linux (Bash / systemd)</option>
                            <option value="macos">macOS (Darwin / zsh)</option>
                          </select>
                        </div>

                        <div className="flex items-center pt-6">
                          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.workspace?.autoScanSubdirectories || false}
                              onChange={(e) => setConfig({
                                ...config,
                                workspace: { ...config.workspace, autoScanSubdirectories: e.target.checked }
                              })}
                              className="rounded border-slate-700 text-blue-500 focus:ring-0"
                            />
                            <span>Tự động quét các thư mục con chứa .git</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: GIT & AUTH */}
                {activeTab === 'GIT' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">2. Cấu Hình Tài Khoản Git & Xác Thực</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Thiết lập thông tin Author cho các commit tự động và phương thức kết nối Remote.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Git User Name:</label>
                        <input
                          type="text"
                          value={config.git?.defaultUserName || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            git: { ...config.git, defaultUserName: e.target.value }
                          })}
                          className={`w-full bg-[#0E1526] border rounded-xl px-3 py-2 text-xs text-purple-300 focus:outline-none transition ${
                            isFieldConfigured(config.git?.defaultUserName) ? 'border-slate-700' : 'border-slate-800'
                          }`}
                          placeholder="Ví dụ: Ktee"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Git User Email:</label>
                        <input
                          type="email"
                          value={config.git?.defaultUserEmail || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            git: { ...config.git, defaultUserEmail: e.target.value }
                          })}
                          className={`w-full bg-[#0E1526] border rounded-xl px-3 py-2 text-xs text-purple-300 focus:outline-none transition ${
                            isFieldConfigured(config.git?.defaultUserEmail) ? 'border-slate-700' : 'border-slate-800'
                          }`}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Loại xác thực (Auth Type):</label>
                        <select
                          value={config.git?.authType || 'HTTPS'}
                          onChange={(e) => setConfig({
                            ...config,
                            git: { ...config.git, authType: e.target.value }
                          })}
                          className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                        >
                          <option value="HTTPS">HTTPS (Personal Access Token / Credential Helper)</option>
                          <option value="SSH">SSH Key (~/.ssh/id_rsa)</option>
                          <option value="GITHUB_APP">GitHub App Token</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Nhánh mặc định (Default Branch):</label>
                        <input
                          type="text"
                          value={config.git?.defaultBranch || 'main'}
                          onChange={(e) => setConfig({
                            ...config,
                            git: { ...config.git, defaultBranch: e.target.value }
                          })}
                          className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3 py-2 text-xs text-purple-300 font-mono focus:outline-none"
                          placeholder="main"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleTestProtocol('GIT')}
                        disabled={testingProtocol === 'GIT'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-300 bg-purple-950/80 border border-purple-500/40 hover:bg-purple-900 transition"
                      >
                        <Zap className={`w-3.5 h-3.5 ${testingProtocol === 'GIT' ? 'animate-spin' : ''}`} />
                        <span>Kiểm Tra Giao Thức Git CLI</span>
                      </button>

                      {testResults['GIT'] && (
                        <div className="mt-2 p-3 rounded-xl bg-[#090E1A] border border-purple-500/30 text-xs font-mono text-purple-200">
                          <span className="font-bold">Độ trễ: {testResults['GIT'].latencyMs}ms • </span>
                          <span>{testResults['GIT'].details}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: JENKINS CI */}
                {activeTab === 'CI' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">3. Cấu Hình Máy Chủ Jenkins CI Master</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Kết nối API để kích hoạt build tự động và giải quyết cây phụ thuộc (Dependency Tree).
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Jenkins Server URL:</label>
                        <input
                          type="text"
                          value={config.ci?.serverUrl || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            ci: { ...config.ci, serverUrl: e.target.value }
                          })}
                          className={`w-full bg-[#0E1526] border rounded-xl px-3.5 py-2 text-xs text-amber-300 font-mono focus:outline-none transition ${
                            isFieldConfigured(config.ci?.serverUrl) ? 'border-slate-700' : 'border-slate-800'
                          }`}
                          placeholder="Ví dụ: http://localhost:8080 hoặc https://ci.company.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Jenkins Username:</label>
                          <input
                            type="text"
                            value={config.ci?.userName || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              ci: { ...config.ci, userName: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none"
                            placeholder="admin"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Jenkins API Token:</label>
                          <input
                            type="password"
                            value={config.ci?.apiToken || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              ci: { ...config.ci, apiToken: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                            placeholder="Nhập Jenkins API Token"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Job Prefix:</label>
                        <input
                          type="text"
                          value={config.ci?.jobPrefix || 'pipeline-'}
                          onChange={(e) => setConfig({
                            ...config,
                            ci: { ...config.ci, jobPrefix: e.target.value }
                          })}
                          className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-mono focus:outline-none"
                          placeholder="pipeline-"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTestProtocol('JENKINS', config.ci?.serverUrl)}
                        disabled={testingProtocol === 'JENKINS'}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 hover:bg-amber-900 transition"
                      >
                        <Zap className={`w-3.5 h-3.5 ${testingProtocol === 'JENKINS' ? 'animate-spin' : ''}`} />
                        <span>Kiểm Tra Kết Nối Jenkins REST API</span>
                      </button>

                      {testResults['JENKINS'] && (
                        <div className="p-3 rounded-xl bg-[#090E1A] border border-amber-500/30 text-xs font-mono text-amber-200">
                          <span className="font-bold">Độ trễ: {testResults['JENKINS'].latencyMs}ms • </span>
                          <span>{testResults['JENKINS'].details}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: SECURITY GATES */}
                {activeTab === 'SECURITY' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">4. Cấu Hình 3 Cổng Bảo Mật (OWASP • SonarQube • Trivy)</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Kiểm toán an toàn mã nguồn, thư viện phụ thuộc CVE và chống rò rỉ Secret Keys.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* Cổng 1: OWASP */}
                      <div className="p-4 rounded-xl bg-[#080D1A] border border-slate-800 space-y-3">
                        <span className="text-xs font-bold text-cyan-300 block">Cổng 1: OWASP Dependency-Check (SCA)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Đường dẫn Scanner Script / CLI:</label>
                            <input
                              type="text"
                              value={config.security?.owasp?.scannerPath || ''}
                              onChange={(e) => setConfig({
                                ...config,
                                security: {
                                  ...config.security,
                                  owasp: { ...config.security.owasp, scannerPath: e.target.value }
                                }
                              })}
                              className="w-full bg-[#0E1526] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono"
                              placeholder="dependency-check.bat"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Ngưỡng chặn CVSS Score:</label>
                            <input
                              type="number"
                              step="0.1"
                              value={config.security?.owasp?.failOnCvss || 7.0}
                              onChange={(e) => setConfig({
                                ...config,
                                security: {
                                  ...config.security,
                                  owasp: { ...config.security.owasp, failOnCvss: parseFloat(e.target.value) }
                                }
                              })}
                              className="w-full bg-[#0E1526] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300"
                              placeholder="7.0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cổng 2: SonarQube */}
                      <div className="p-4 rounded-xl bg-[#080D1A] border border-slate-800 space-y-3">
                        <span className="text-xs font-bold text-blue-300 block">Cổng 2: SonarQube Clean Code & SAST</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">SonarQube Server URL:</label>
                            <input
                              type="text"
                              value={config.security?.sonarQube?.serverUrl || ''}
                              onChange={(e) => setConfig({
                                ...config,
                                security: {
                                  ...config.security,
                                  sonarQube: { ...config.security.sonarQube, serverUrl: e.target.value }
                                }
                              })}
                              className="w-full bg-[#0E1526] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-blue-300 font-mono"
                              placeholder="Ví dụ: http://localhost:9000"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">SonarQube Project Token:</label>
                            <input
                              type="password"
                              value={config.security?.sonarQube?.projectToken || ''}
                              onChange={(e) => setConfig({
                                ...config,
                                security: {
                                  ...config.security,
                                  sonarQube: { ...config.security.sonarQube, projectToken: e.target.value }
                                }
                              })}
                              className="w-full bg-[#0E1526] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-blue-300 font-mono"
                              placeholder="squ_..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cổng 3: Trivy */}
                      <div className="p-4 rounded-xl bg-[#080D1A] border border-slate-800 space-y-3">
                        <span className="text-xs font-bold text-emerald-300 block">Cổng 3: Trivy Security Scanner</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Mức độ nghiêm trọng (Severity):</label>
                            <input
                              type="text"
                              value={config.security?.trivy?.severity || 'CRITICAL,HIGH'}
                              onChange={(e) => setConfig({
                                ...config,
                                security: {
                                  ...config.security,
                                  trivy: { ...config.security.trivy, severity: e.target.value }
                                }
                              })}
                              className="w-full bg-[#0E1526] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono"
                              placeholder="CRITICAL,HIGH"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Chế độ quét (Scan Type):</label>
                            <input
                              type="text"
                              value={config.security?.trivy?.scanType || 'fs,secret'}
                              onChange={(e) => setConfig({
                                ...config,
                                security: {
                                  ...config.security,
                                  trivy: { ...config.security.trivy, scanType: e.target.value }
                                }
                              })}
                              className="w-full bg-[#0E1526] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-300 font-mono"
                              placeholder="fs,secret"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: DOCKER & REGISTRY */}
                {activeTab === 'DOCKER' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">5. Cấu Hình Docker BuildKit & Container Registry</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Đóng gói Container Standalone siêu nhẹ và push lên Docker Registry.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">Docker Registry Host URL:</label>
                        <input
                          type="text"
                          value={config.docker?.registryUrl || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            docker: { ...config.docker, registryUrl: e.target.value }
                          })}
                          className={`w-full bg-[#0E1526] border rounded-xl px-3.5 py-2 text-xs text-blue-300 font-mono focus:outline-none transition ${
                            isFieldConfigured(config.docker?.registryUrl) ? 'border-slate-700' : 'border-slate-800'
                          }`}
                          placeholder="Ví dụ: docker.io hoặc để trống"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Socket Path (Daemon Pipe):</label>
                          <input
                            type="text"
                            value={config.docker?.socketPath || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              docker: { ...config.docker, socketPath: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                            placeholder="Ví dụ: //./pipe/docker_engine hoặc /var/run/docker.sock"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Repository Namespace:</label>
                          <input
                            type="text"
                            value={config.docker?.repositoryNamespace || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              docker: { ...config.docker, repositoryNamespace: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                            placeholder="Ví dụ: username trên Docker Hub"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTestProtocol('DOCKER')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 hover:bg-blue-900 transition"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Kiểm Tra Docker Daemon & Socket</span>
                      </button>

                      {testResults['DOCKER'] && (
                        <div className="p-3 rounded-xl bg-[#090E1A] border border-blue-500/30 text-xs font-mono text-blue-200">
                          <span>{testResults['DOCKER'].details}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 6: K8S & GITOPS */}
                {activeTab === 'K8S' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">6. Cấu Hình ArgoCD GitOps & Cụm Kubernetes</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Đồng bộ GitOps tự động và kiểm tra kết nối Kubeconfig tới cụm máy chủ K8s.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">ArgoCD Server URL:</label>
                          <input
                            type="text"
                            value={config.gitops?.argoCdUrl || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              gitops: { ...config.gitops, argoCdUrl: e.target.value }
                            })}
                            className={`w-full bg-[#0E1526] border rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-mono focus:outline-none transition ${
                              isFieldConfigured(config.gitops?.argoCdUrl) ? 'border-slate-700' : 'border-slate-800'
                            }`}
                            placeholder="Ví dụ: http://localhost:8080"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">ArgoCD Auth Token:</label>
                          <input
                            type="password"
                            value={config.gitops?.argoCdToken || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              gitops: { ...config.gitops, argoCdToken: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-mono focus:outline-none"
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">GitOps Config Repo URL:</label>
                        <input
                          type="text"
                          value={config.gitops?.configRepoUrl || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            gitops: { ...config.gitops, configRepoUrl: e.target.value }
                          })}
                          className={`w-full bg-[#0E1526] border rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-mono focus:outline-none transition ${
                            isFieldConfigured(config.gitops?.configRepoUrl) ? 'border-slate-700' : 'border-slate-800'
                          }`}
                          placeholder="Ví dụ: https://github.com/your-username/k8s-manifests.git"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Kubeconfig File Path:</label>
                          <input
                            type="text"
                            value={config.kubernetes?.kubeconfigPath || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              kubernetes: { ...config.kubernetes, kubeconfigPath: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                            placeholder="Ví dụ: ~/.kube/config hoặc C:\Users\...\.kube\config"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Cluster Context:</label>
                          <input
                            type="text"
                            value={config.kubernetes?.clusterContext || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              kubernetes: { ...config.kubernetes, clusterContext: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                            placeholder="Ví dụ: docker-desktop hoặc k8s-cluster"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleTestProtocol('ARGOCD', config.gitops?.argoCdUrl)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900 transition"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Kiểm Tra ArgoCD Sync API</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestProtocol('KUBERNETES')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-300 bg-blue-950/80 border border-blue-500/40 hover:bg-blue-900 transition"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Kiểm Tra K8s Cluster Context</span>
                        </button>
                      </div>

                      {testResults['ARGOCD'] && (
                        <p className="text-xs text-cyan-200 font-mono">{testResults['ARGOCD'].details}</p>
                      )}
                      {testResults['KUBERNETES'] && (
                        <p className="text-xs text-blue-200 font-mono">{testResults['KUBERNETES'].details}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 7: TELEMETRY */}
                {activeTab === 'TELEMETRY' && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">7. Cấu Hình Giám Sát & Cảnh Báo (Telemetry & Alerts)</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Thu thập chỉ số CPU/RAM và gửi thông báo hoàn tất Pipeline qua Email, Telegram, Discord.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Prometheus URL:</label>
                          <input
                            type="text"
                            value={config.telemetry?.prometheusUrl || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              telemetry: { ...config.telemetry, prometheusUrl: e.target.value }
                            })}
                            className={`w-full bg-[#0E1526] border rounded-xl px-3.5 py-2 text-xs text-orange-300 font-mono focus:outline-none transition ${
                              isFieldConfigured(config.telemetry?.prometheusUrl) ? 'border-slate-700' : 'border-slate-800'
                            }`}
                            placeholder="http://localhost:9090"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Grafana Dashboard URL:</label>
                          <input
                            type="text"
                            value={config.telemetry?.grafanaUrl || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              telemetry: { ...config.telemetry, grafanaUrl: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-orange-300 font-mono focus:outline-none"
                            placeholder="http://localhost:3001"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Alert Webhook URL (Telegram/Slack):</label>
                          <input
                            type="text"
                            value={config.telemetry?.alertWebhookUrl || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              telemetry: { ...config.telemetry, alertWebhookUrl: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 font-mono focus:outline-none"
                            placeholder="https://api.telegram.org/bot<token>/sendMessage"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 font-bold block mb-1">Email Thông Báo Nghiệm Thu:</label>
                          <input
                            type="email"
                            value={config.telemetry?.emailRecipient || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              telemetry: { ...config.telemetry, emailRecipient: e.target.value }
                            })}
                            className="w-full bg-[#0E1526] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none"
                            placeholder="Ví dụ: email-cua-ban@gmail.com"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTestProtocol('PROMETHEUS', config.telemetry?.prometheusUrl)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-orange-300 bg-orange-950/80 border border-orange-500/40 hover:bg-orange-900 transition"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Kiểm Tra Prometheus Scrape Target</span>
                      </button>

                      {testResults['PROMETHEUS'] && (
                        <p className="text-xs text-orange-200 font-mono">{testResults['PROMETHEUS'].details}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 8: WEBHOOK FORM */}
                {activeTab === 'WEBHOOK' && (
                  <div className="space-y-5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>8. Cấu Hình Tự Động Kích Hoạt Qua GitHub Webhook</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Mỗi khi Sếp hoặc Dev thực hiện `git push`, GitHub sẽ tự động gọi Webhook để kích hoạt toàn bộ quy trình CI/CD Realtime trên màn hình.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Webhook URL Copy Card */}
                      <div className="bg-[#0D1424] border border-amber-500/30 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">Payload URL Webhook (Dán vào GitHub):</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                            HOẠT ĐỘNG 24/7
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value="https://agent.globalcode.com.vn/api/workflow/webhook"
                            className="w-full bg-[#080C17] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-200 font-mono select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('https://agent.globalcode.com.vn/api/workflow/webhook');
                              setSaveMessage('Đã sao chép URL Webhook!');
                              setTimeout(() => setSaveMessage(null), 2500);
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-md shadow-amber-500/20"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Sao Chép</span>
                          </button>
                        </div>
                      </div>

                      {/* 5-Step Setup Guide */}
                      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white flex items-center gap-2">
                            <span>Hướng Dẫn 5 Bước Cài Đặt Trên GitHub Repo:</span>
                          </h5>
                          <a
                            href="https://github.com/Kteenguyen/GBC_AI_agentic/settings/hooks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <span>Mở GitHub Webhooks</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>

                        <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                            <span>Truy cập vào <strong>GitHub Repo Settings &rarr; Webhooks &rarr; Add webhook</strong>.</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                            <span>Tại ô <strong>Payload URL</strong>, dán đường dẫn: <code className="text-amber-300 font-mono">https://agent.globalcode.com.vn/api/workflow/webhook</code></span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                            <span>Tại ô <strong>Content type</strong>, chọn: <code className="text-cyan-300 font-mono">application/json</code></span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                            <span>Tại mục <strong>Which events</strong>, chọn: <strong>Just the push event</strong>.</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                            <span>Nhấn nút màu xanh <strong>Add webhook</strong> để hoàn tất.</span>
                          </div>
                        </div>
                      </div>

                      {/* Test Trigger Button */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setTestingProtocol('WEBHOOK');
                              const res = await fetch('/api/workflow/webhook', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  ref: 'refs/heads/main',
                                  head_commit: {
                                    id: '8eb6922',
                                    message: 'Manual test from Webhook Config Tab',
                                    author: { name: 'Ktee Nguyen' }
                                  }
                                })
                              });
                              const data = await res.json();
                              setTestResults(prev => ({
                                ...prev,
                                'WEBHOOK': {
                                  status: 'CONNECTED',
                                  latencyMs: 32,
                                  details: data.message || 'Webhook đã phản hồi 200 OK thành công!'
                                }
                              }));
                            } catch (e: any) {
                              setTestResults(prev => ({
                                ...prev,
                                'WEBHOOK': {
                                  status: 'ERROR',
                                  latencyMs: 0,
                                  details: 'Lỗi gửi test Webhook'
                                }
                              }));
                            } finally {
                              setTestingProtocol(null);
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-600/20 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Gửi Thử Sự Kiện Webhook Test (Kích Hoạt Ngay)</span>
                        </button>

                        {testResults['WEBHOOK'] && (
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            {testResults['WEBHOOK'].details}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#080C17] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {saveMessage && <span className="text-xs font-bold text-emerald-400">{saveMessage}</span>}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Cấu Hình Vào workflow.config.json'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
