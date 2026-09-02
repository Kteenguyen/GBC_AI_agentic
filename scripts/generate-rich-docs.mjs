import fs from 'fs';
import path from 'path';

console.log('--- GENERATING ENRICHED 100% VIETNAMESE ACCENTED TECHNICAL DOCS ---');

const DOC_ACCORDION_GROUPS = [
  {
    key: 'OVERVIEW',
    title: 'TỔNG QUAN (OVERVIEW)',
    docIds: ['00-project-blueprint-and-workflow-architecture']
  },
  {
    key: 'AI_SQUAD',
    title: 'AI AGENT SQUAD & 9ROUTER',
    docIds: ['09-ai-squad-and-9router-architecture']
  },
  {
    key: 'GIT_CI',
    title: 'GIT & CI / CD PIPELINE',
    docIds: ['01-workspace-git-setup', '02-jenkins-ci-setup']
  },
  {
    key: 'DEVSECOPS',
    title: 'BẢO MẬT & DEVSECOPS',
    docIds: ['03-owasp-dependency-check-setup', '04-sonarqube-quality-gate-setup', '05-trivy-security-scanner-setup']
  },
  {
    key: 'DOCKER_K8S',
    title: 'DOCKER & KUBERNETES GITOPS',
    docIds: ['06-docker-buildkit-registry-setup', '07-argocd-kubernetes-gitops-setup']
  },
  {
    key: 'MONITORING',
    title: 'GIÁM SÁT & OBSERVABILITY',
    docIds: ['08-prometheus-grafana-alert-setup']
  },
  {
    key: 'FAQ_TROUBLESHOOTING',
    title: 'CÂU HỎI THƯỜNG GẶP & FAQ',
    docIds: ['10-faq-and-troubleshooting-guide']
  }
];

console.log('Accordion groups defined:', DOC_ACCORDION_GROUPS.length);
