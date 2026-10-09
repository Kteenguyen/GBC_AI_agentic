import React from 'react';
import { WorkflowNode } from '@/types/workflow';
import {
  DeveloperLogo,
  GitHubLogo,
  JenkinsLogo,
  OwaspLogo,
  SonarQubeLogo,
  TrivyLogo,
  DockerLogo,
  ArgoCDLogo,
  KubernetesLogo,
  MyAppLogo,
  PrometheusLogo,
  GrafanaLogo,
  GmailLogo,
  OfficialToolIcon
} from '@/components/BrandLogos';

export function renderOfficialLogo(
  logoType: WorkflowNode['logoType'], 
  className = "w-9 h-9", 
  nodeName?: string
): React.ReactNode {
  switch (logoType) {
    case 'DEV': 
      return nodeName && nodeName !== 'Developer' 
        ? <OfficialToolIcon toolIdOrName={nodeName} className={className} /> 
        : <DeveloperLogo className={className} />;
    case 'GITHUB': return <GitHubLogo className={className} />;
    case 'JENKINS': return <JenkinsLogo className={className} />;
    case 'OWASP': return <OwaspLogo className={className} />;
    case 'SONARQUBE': return <SonarQubeLogo className={className} />;
    case 'TRIVY': return <TrivyLogo className={className} />;
    case 'DOCKER': return <DockerLogo className={className} />;
    case 'ARGOCD': return <ArgoCDLogo className={className} />;
    case 'KUBERNETES': return <KubernetesLogo className={className} />;
    case 'MYAPP': return <MyAppLogo className={className} />;
    case 'PROMETHEUS': return <PrometheusLogo className={className} />;
    case 'GRAFANA': return <GrafanaLogo className={className} />;
    case 'GMAIL': return <GmailLogo className={className} />;
    default: return <OfficialToolIcon toolIdOrName={nodeName || logoType} className={className} />;
  }
}

export function getNodeBorderClass(
  nodeId: string, 
  status: WorkflowNode['status'], 
  selectedNodeId: string, 
  isLight: boolean
): string {
  const isSelected = selectedNodeId === nodeId;
  if (isSelected) {
    return isLight
      ? 'border-blue-600 ring-2 ring-blue-500/40 bg-blue-50/80 shadow-lg shadow-blue-500/10 scale-[1.02]'
      : 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl shadow-cyan-400/20 bg-[#13223E] scale-[1.02]';
  }
  if (status === 'RUNNING') {
    return isLight
      ? 'border-cyan-600 ring-2 ring-cyan-500/40 bg-cyan-50/70 shadow-md shadow-cyan-500/15 animate-pulse'
      : 'border-cyan-400 ring-2 ring-cyan-400/50 bg-[#0F233E] shadow-lg shadow-cyan-400/30 animate-pulse';
  }
  if (status === 'SUCCESS') {
    return isLight
      ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/50 shadow-xs'
      : 'border-emerald-500/80 ring-1 ring-emerald-500/30 bg-[#0B2320] shadow-sm shadow-emerald-500/20';
  }
  if (status === 'FAILED') {
    return isLight
      ? 'border-rose-500 ring-2 ring-rose-500/40 bg-rose-50/70 shadow-md animate-pulse'
      : 'border-rose-500 ring-2 ring-rose-500/50 bg-[#2D0D18] shadow-lg shadow-rose-500/30 animate-pulse';
  }
  return isLight
    ? 'border-slate-200 bg-white hover:border-blue-400/70 hover:shadow-md hover:-translate-y-0.5 shadow-xs'
    : 'border-slate-800/90 bg-[#0D1629] hover:border-slate-600 hover:shadow-lg hover:-translate-y-0.5 shadow-sm';
}

