import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { TechnicalDocGuide } from '@/types';

export const dynamic = 'force-dynamic';

interface DocMetadata {
  id: string;
  order: number;
  filename: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
}

const DOC_METADATA_LIST: DocMetadata[] = [
  {
    id: '01-workspace-git-setup',
    order: 1,
    filename: '01-workspace-git-setup.md',
    title: 'Huong Dan Cau Hinh Workspace Cuc Bo va Tai Khoan Git SSH/HTTPS',
    category: 'Workspace & Version Control',
    description: 'Thiet lap moi truong phat trien cuc bo, cau hinh Git global, xac thuc khoa SSH Ed25519 va Personal Access Token HTTPS, quy chuan Branching Strategy va kiem tra ket noi.',
    tags: ['Git', 'SSH', 'Ed25519', 'HTTPS', 'PAT', 'Workspace', 'Branching']
  },
  {
    id: '02-jenkins-ci-setup',
    order: 2,
    filename: '02-jenkins-ci-setup.md',
    title: 'Huong Dan Cai Dat Jenkins CI Server, Tao API Token va Pipeline Master Job',
    category: 'CI/CD Automation',
    description: 'Trien khai Jenkins CI Server qua Docker Compose, cau hinh User API Token, quan ly Credentials Vault va xay dung Declarative Jenkinsfile Pipeline Master Job.',
    tags: ['Jenkins', 'CI/CD', 'Pipeline', 'Jenkinsfile', 'Docker', 'API Token', 'Webhook']
  },
  {
    id: '03-owasp-dependency-check-setup',
    order: 3,
    filename: '03-owasp-dependency-check-setup.md',
    title: 'Huong Dan Tich Hop OWASP Dependency-Check va Thiet Lap Nguong Chan CVSS Score',
    category: 'Security & Vulnerability Scanning',
    description: 'Tich hop cong cu Software Composition Analysis OWASP Dependency-Check, cau hinh NVD NIST API Key, thiet lap nguong failOnCVSS 7.0 va tao tap tin suppressions.xml.',
    tags: ['OWASP', 'Dependency-Check', 'SCA', 'CVSS', 'CVE', 'NVD', 'Fail-Fast']
  },
  {
    id: '04-sonarqube-quality-gate-setup',
    order: 4,
    filename: '04-sonarqube-quality-gate-setup.md',
    title: 'Huong Dan Cai Dat SonarQube, Tao Project Token va Kich Hoat Quality Gate Grade A',
    category: 'Code Quality & Static Analysis',
    description: 'Trien khai SonarQube Server voi PostgreSQL, tao Project Token xac thuc, cau hinh sonar-project.properties va thiet lap cac tieu chi Quality Gate Grade A nghiem ngat.',
    tags: ['SonarQube', 'Static Analysis', 'Quality Gate', 'Coverage', 'LCOV', 'Clean Code']
  },
  {
    id: '05-trivy-security-scanner-setup',
    order: 5,
    filename: '05-trivy-security-scanner-setup.md',
    title: 'Huong Dan Cau Hinh Trivy Quet Lo Hong Filesystem, OS Packages va Secrets Trong .env',
    category: 'DevSecOps & Secret Scanning',
    description: 'Cau hinh Aqua Security Trivy quet toan dien Filesystem, Image Containers, OS Packages va phat hien lo lot API Keys/Secrets trong file .env voi dinh dang SARIF.',
    tags: ['Trivy', 'Aqua Security', 'Secret Scanning', 'Vulnerabilities', 'Container Security', 'SARIF']
  },
  {
    id: '06-docker-buildkit-registry-setup',
    order: 6,
    filename: '06-docker-buildkit-registry-setup.md',
    title: 'Huong Dan Ket Noi Docker Daemon Socket va Private Container Registry',
    category: 'Containerization & Registry',
    description: 'Kich hoat Docker BuildKit engine, cau hinh ket noi Unix Socket / mTLS TCP Port 2376, xac thuc Private Registry va xay dung Multi-stage Dockerfile toi uu cache mount.',
    tags: ['Docker', 'BuildKit', 'Container Registry', 'Harbor', 'mTLS', 'Multi-stage']
  },
  {
    id: '07-argocd-kubernetes-gitops-setup',
    order: 7,
    filename: '07-argocd-kubernetes-gitops-setup.md',
    title: 'Huong Dan Cau Hinh ArgoCD GitOps Controller va Nap File Kubeconfig Cum K8s',
    category: 'GitOps & Kubernetes Deployment',
    description: 'Cai dat ArgoCD GitOps Controller tren Kubernetes, ket noi GitOps Repository qua SSH/Token, nap external K8s cluster qua Kubeconfig va thiet lap Application Self-Heal.',
    tags: ['ArgoCD', 'GitOps', 'Kubernetes', 'Kubeconfig', 'Continuous Delivery', 'Self-Heal']
  },
  {
    id: '08-prometheus-grafana-alert-setup',
    order: 8,
    filename: '08-prometheus-grafana-alert-setup.md',
    title: 'Huong Dan Cau Hinh Scrape Targets Prometheus, Grafana Dashboard va Alertmanager',
    category: 'Monitoring & Observability',
    description: 'Trien khai Prometheus TSDB, Grafana va Alertmanager, cau hinh Scrape Targets Node Exporter/App Metrics, PromQL Alert Rules va kenh dispatch thong bao Telegram/Webhook.',
    tags: ['Prometheus', 'Grafana', 'Alertmanager', 'Monitoring', 'PromQL', 'Observability', 'Node Exporter']
  }
];

/**
 * GET /api/docs
 * Lay danh sach tat ca 8 tai lieu huong dan ky thuat hoac tai lieu chi tiet theo id
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('id');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase().trim();

    const guidesDir = path.join(process.cwd(), 'docs', 'guides');

    // Doc noi dung tu cac tap tin markdown tren dia
    const docs: TechnicalDocGuide[] = DOC_METADATA_LIST.map((meta) => {
      const filePath = path.join(guidesDir, meta.filename);
      let content = '';

      if (fs.existsSync(filePath)) {
        try {
          content = fs.readFileSync(filePath, 'utf-8');
        } catch (readErr: any) {
          content = `[ERROR] Khong the doc tap tin ${meta.filename}: ${readErr?.message}`;
        }
      } else {
        content = `# ${meta.title}\n\n[WARNING] Tap tin ${meta.filename} chua ton tai tren he thong.`;
      }

      return {
        id: meta.id,
        title: meta.title,
        category: meta.category,
        description: meta.description,
        filename: meta.filename,
        content,
        order: meta.order,
        tags: meta.tags,
        updatedAt: new Date().toISOString()
      };
    });

    // 1. Truong hop tim theo ID cu the
    if (docId) {
      const matchedDoc = docs.find((d) => d.id === docId || d.filename === docId);
      if (!matchedDoc) {
        return NextResponse.json(
          {
            success: false,
            error: `Khong tim thay tai lieu voi ID: ${docId}`,
            availableIds: DOC_METADATA_LIST.map((m) => m.id)
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: matchedDoc
      });
    }

    // 2. Loc theo Category neu co
    let filteredDocs = docs;
    if (category) {
      filteredDocs = filteredDocs.filter(
        (d) => d.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 3. Tim kiem theo tu khoa search neu co
    if (search) {
      filteredDocs = filteredDocs.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          d.description.toLowerCase().includes(search) ||
          d.tags?.some((t) => t.toLowerCase().includes(search)) ||
          d.content.toLowerCase().includes(search)
      );
    }

    // Sap xep theo thu tu order tang dan (1 -> 8)
    filteredDocs.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      count: filteredDocs.length,
      total: docs.length,
      data: filteredDocs
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Loi may chu noi bo khi xu ly API Docs'
      },
      { status: 500 }
    );
  }
}
