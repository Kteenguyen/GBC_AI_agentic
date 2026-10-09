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
      ? 'border-blue-600 ring-2 ring-blue-500/30 bg-blue-50/70 shadow-md'
      : 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 shadow-xl bg-[#111C33]';
  }
  if (status === 'RUNNING') {
    return isLight
      ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/60 animate-pulse'
      : 'border-cyan-400 ring-2 ring-cyan-400/40 bg-[#0E1B30] animate-pulse';
  }
  return isLight
    ? 'border-[#E2DDD5] bg-white hover:border-blue-400 shadow-xs'
    : 'border-slate-800 bg-[#0C1222] hover:border-slate-600';
}
