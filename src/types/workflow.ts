import { WorkflowPort } from './workflowGraph';

export interface LocalProject {
  id: string;
  name: string;
  path: string;
  isGitRepo: boolean;
  branch: string;
  remoteUrl: string;
  repoName: string;
  gitUserName: string;
  gitUserEmail: string;
  lastCommitHash: string;
  lastCommitMsg: string;
  lastCommitAuthor: string;
  lastCommitTime: string;
  hasUncommittedChanges: boolean;
  uncommittedCount: number;
}

export interface WorkflowNode {
  id: string;
  name: string;
  subLabel?: string;
  category: 'DEV' | 'CI' | 'SECURITY' | 'BUILD' | 'CD' | 'GITOPS' | 'DEPLOY' | 'MONITOR' | 'ALERT';
  box: 'CI_BOX' | 'CD_BOX' | 'EXTERNAL';
  badge?: string;
  status: 'STANDBY' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED';
  statusText: string;
  stepNumber?: number;
  logoType: 'DEV' | 'GITHUB' | 'JENKINS' | 'OWASP' | 'SONARQUBE' | 'TRIVY' | 'DOCKER' | 'ARGOCD' | 'KUBERNETES' | 'MYAPP' | 'PROMETHEUS' | 'GRAFANA' | 'GMAIL';
  logs: string[];
  metrics?: Record<string, string>;
  actionLabel?: string;
  actionType?: string;
  details: {
    title: string;
    gateName?: string;
    description: string;
    inputArtifact?: string;
    outputArtifact?: string;
  };
}

export interface ModalArtifactState {
  isOpen: boolean;
  title: string;
  artifactName: string;
  format: 'JSON' | 'CODE' | 'YAML' | 'XML';
  content: string;
  sourceNodeName: string;
}
