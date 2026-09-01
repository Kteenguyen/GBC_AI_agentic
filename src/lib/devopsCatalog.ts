export interface DevOpsToolDefinition {
  id: string;
  name: string;
  category: 'CI' | 'SECURITY' | 'BUILD' | 'GITOPS' | 'DEPLOY' | 'MONITOR' | 'ALERT';
  license: string;
  description: string;
  defaultPort?: number;
  configFields: {
    key: string;
    label: string;
    type: 'text' | 'password' | 'number' | 'boolean';
    placeholder: string;
    required: boolean;
    defaultValue?: string | number | boolean;
  }[];
  docsUrl: string;
  tags: string[];
}

export const OPEN_SOURCE_DEVOPS_CATALOG: DevOpsToolDefinition[] = [
  // 1. CI / Pipeline Engines
  {
    id: 'jenkins-ci',
    name: 'Jenkins CI Master',
    category: 'CI',
    license: 'Open Source (MIT)',
    description: 'Máy chủ tự động hóa CI/CD mã nguồn mở số 1 thế giới, hỗ trợ hơn 1800 plugins.',
    defaultPort: 8080,
    configFields: [
      { key: 'serverUrl', label: 'Jenkins Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:8080', required: true },
      { key: 'userName', label: 'Admin Username', type: 'text', placeholder: 'Ví dụ: admin', required: true },
      { key: 'apiToken', label: 'API Token', type: 'password', placeholder: 'Nhập Jenkins API Token', required: true },
      { key: 'jobPrefix', label: 'Job Name Prefix', type: 'text', placeholder: 'Ví dụ: pipeline-', required: false, defaultValue: 'pipeline-' }
    ],
    docsUrl: 'https://www.jenkins.io/doc/',
    tags: ['ci', 'pipeline', 'java', 'automation']
  },
  {
    id: 'woodpecker-ci',
    name: 'Woodpecker CI',
    category: 'CI',
    license: 'Open Source (Apache 2.0)',
    description: 'CI Server container-native cực nhẹ, khởi động trong 1 giây, hoàn toàn miễn phí.',
    defaultPort: 8000,
    configFields: [
      { key: 'serverUrl', label: 'Woodpecker Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:8000', required: true },
      { key: 'apiToken', label: 'Woodpecker Token', type: 'password', placeholder: 'Nhập User Token', required: true }
    ],
    docsUrl: 'https://woodpecker-ci.org/',
    tags: ['ci', 'container', 'go', 'lightweight']
  },
  {
    id: 'drone-ci',
    name: 'Drone CI by Harness',
    category: 'CI',
    license: 'Open Source (Apache 2.0)',
    description: 'Hệ thống CI/CD tự phục vụ dựa trên Docker Container, cấu hình qua file YAML đơn giản.',
    defaultPort: 8080,
    configFields: [
      { key: 'serverUrl', label: 'Drone Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:8080', required: true },
      { key: 'apiToken', label: 'Personal Access Token', type: 'password', placeholder: 'Nhập Drone Token', required: true }
    ],
    docsUrl: 'https://drone.io/',
    tags: ['ci', 'docker', 'yaml']
  },
  {
    id: 'act-local-runner',
    name: 'Act — Local GitHub Actions',
    category: 'CI',
    license: 'Open Source (MIT)',
    description: 'Chạy trực tiếp GitHub Actions workflows ngay trên máy cục bộ bằng Docker, 0 tốn credits.',
    configFields: [
      { key: 'workflowPath', label: 'Workflow File Path', type: 'text', placeholder: 'Ví dụ: .github/workflows/ci.yml', required: true, defaultValue: '.github/workflows/ci.yml' },
      { key: 'dockerSocket', label: 'Docker Daemon Socket', type: 'text', placeholder: 'Ví dụ: //./pipe/docker_engine hoặc /var/run/docker.sock', required: true }
    ],
    docsUrl: 'https://github.com/nektos/act',
    tags: ['ci', 'github-actions', 'local-runner']
  },
  {
    id: 'gitea-actions',
    name: 'Gitea Actions',
    category: 'CI',
    license: 'Open Source (MIT)',
    description: 'Nền tảng Git server tự host tích hợp sẵn engine chạy CI/CD tương thích chuẩn GitHub Actions.',
    defaultPort: 3000,
    configFields: [
      { key: 'serverUrl', label: 'Gitea Instance URL', type: 'text', placeholder: 'Ví dụ: http://localhost:3000', required: true },
      { key: 'token', label: 'Gitea Access Token', type: 'password', placeholder: 'Nhập Gitea Token', required: true }
    ],
    docsUrl: 'https://docs.gitea.com/usage/actions/overview',
    tags: ['git', 'ci', 'self-hosted']
  },

  // 2. Security & Quality Gates
  {
    id: 'sonarqube-oss',
    name: 'SonarQube Community Edition',
    category: 'SECURITY',
    license: 'Open Source (LGPLv3)',
    description: 'Phân tích tĩnh mã nguồn (SAST), phát hiện Bugs, Vulnerabilities, Code Smells và chặn Quality Gate.',
    defaultPort: 9000,
    configFields: [
      { key: 'serverUrl', label: 'SonarQube Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:9000', required: true },
      { key: 'projectToken', label: 'Project Analysis Token', type: 'password', placeholder: 'Nhập Sonar Token (squ_...)', required: true },
      { key: 'qualityGateRequired', label: 'Quality Gate Bắt Buộc', type: 'text', placeholder: 'PASSED', required: false, defaultValue: 'PASSED' }
    ],
    docsUrl: 'https://docs.sonarsource.com/sonarqube/latest/',
    tags: ['security', 'sast', 'clean-code', 'quality-gate']
  },
  {
    id: 'owasp-dep-check',
    name: 'OWASP Dependency-Check',
    category: 'SECURITY',
    license: 'Open Source (Apache 2.0)',
    description: 'Kiểm toán thành phần phần mềm (SCA), quét thư viện bên thứ 3 chống lỗ hổng CVE.',
    configFields: [
      { key: 'failOnCvss', label: 'Ngưỡng Chặn CVSS Score (1-10)', type: 'number', placeholder: '7', required: true, defaultValue: 7 },
      { key: 'nvdApiKey', label: 'NVD API Key (Tùy chọn)', type: 'password', placeholder: 'Nhập NVD API Key để tăng tốc độ quét', required: false }
    ],
    docsUrl: 'https://jeremylong.github.io/DependencyCheck/',
    tags: ['security', 'sca', 'cve', 'owasp']
  },
  {
    id: 'trivy-scanner',
    name: 'Trivy Security Scanner',
    category: 'SECURITY',
    license: 'Open Source (Apache 2.0)',
    description: 'Quét toàn diện Container Image, Filesystem, Git Repository, Secrets (.env) và Kubernetes manifests.',
    configFields: [
      { key: 'severity', label: 'Mức Độ Cảnh Báo', type: 'text', placeholder: 'CRITICAL,HIGH', required: true, defaultValue: 'CRITICAL,HIGH' },
      { key: 'scanType', label: 'Loại Quét', type: 'text', placeholder: 'fs,secret,config', required: true, defaultValue: 'fs,secret,config' }
    ],
    docsUrl: 'https://aquasecurity.github.io/trivy/',
    tags: ['security', 'trivy', 'secrets', 'container-scan']
  },
  {
    id: 'semgrep-oss',
    name: 'Semgrep OSS',
    category: 'SECURITY',
    license: 'Open Source (LGPLv2.1)',
    description: 'Công cụ quét mã nguồn bảo mật siêu tốc, tìm kiếm các lỗi logic và lỗ hổng OWASP Top 10.',
    configFields: [
      { key: 'ruleset', label: 'Ruleset Chính', type: 'text', placeholder: 'p/default hoặc p/security-audit', required: true, defaultValue: 'p/default' }
    ],
    docsUrl: 'https://semgrep.dev/docs/',
    tags: ['security', 'sast', 'rules', 'fast']
  },
  {
    id: 'gitleaks-scanner',
    name: 'Gitleaks Secret Auditor',
    category: 'SECURITY',
    license: 'Open Source (MIT)',
    description: 'Chuyên gia rà soát lịch sử commit Git và working tree chống rò rỉ Passwords, API Keys, SSH Keys.',
    configFields: [
      { key: 'redact', label: 'Tự Động Che Secret Trong Log', type: 'boolean', placeholder: 'true', required: false, defaultValue: true }
    ],
    docsUrl: 'https://github.com/gitleaks/gitleaks',
    tags: ['security', 'secrets', 'git-audit']
  },

  // 3. Container & Registry
  {
    id: 'docker-buildkit',
    name: 'Docker Engine & BuildKit',
    category: 'BUILD',
    license: 'Open Source (Apache 2.0)',
    description: 'Bộ công cụ đóng gói container tiêu chuẩn thế giới với BuildKit cache song song cực nhanh.',
    configFields: [
      { key: 'socketPath', label: 'Docker Daemon Socket', type: 'text', placeholder: 'Ví dụ: //./pipe/docker_engine hoặc /var/run/docker.sock', required: true },
      { key: 'registryUrl', label: 'Container Registry Host', type: 'text', placeholder: 'Ví dụ: docker.io hoặc để trống', required: false },
      { key: 'repositoryNamespace', label: 'Namespace / Username', type: 'text', placeholder: 'Ví dụ: username trên Docker Hub', required: false }
    ],
    docsUrl: 'https://docs.docker.com/build/buildkit/',
    tags: ['docker', 'buildkit', 'containers']
  },
  {
    id: 'harbor-registry',
    name: 'Harbor Cloud Native Registry',
    category: 'BUILD',
    license: 'Open Source (Apache 2.0)',
    description: 'Hệ thống lưu trữ Container Registry mã nguồn mở của CNCF tích hợp sẵn quét bảo mật và ký số.',
    defaultPort: 443,
    configFields: [
      { key: 'serverUrl', label: 'Harbor Registry URL', type: 'text', placeholder: 'Ví dụ: https://harbor.local', required: true },
      { key: 'projectName', label: 'Harbor Project / Namespace', type: 'text', placeholder: 'Ví dụ: devops-core', required: true },
      { key: 'robotAccount', label: 'Robot Account Name', type: 'text', placeholder: 'Ví dụ: robot$build-runner', required: true },
      { key: 'robotSecret', label: 'Robot Secret Token', type: 'password', placeholder: 'Nhập Harbor Robot Secret', required: true }
    ],
    docsUrl: 'https://goharbor.io/docs/',
    tags: ['registry', 'cncf', 'security', 'enterprise']
  },
  {
    id: 'podman-engine',
    name: 'Podman (Rootless Containers)',
    category: 'BUILD',
    license: 'Open Source (Apache 2.0)',
    description: 'Công cụ chạy và đóng gói container không cần Daemon (Daemonless) và bảo mật không cần Root.',
    configFields: [
      { key: 'socketUrl', label: 'Podman Service Socket', type: 'text', placeholder: 'Ví dụ: unix:///run/user/1000/podman/podman.sock', required: true }
    ],
    docsUrl: 'https://podman.io/',
    tags: ['podman', 'rootless', 'containers', 'linux']
  },

  // 4. GitOps & Deployment
  {
    id: 'argocd-gitops',
    name: 'ArgoCD GitOps Controller',
    category: 'GITOPS',
    license: 'Open Source (Apache 2.0)',
    description: 'Công cụ đồng bộ GitOps số 1 cho Kubernetes, tự động kéo trạng thái từ Git xuống cụm K8s.',
    defaultPort: 8080,
    configFields: [
      { key: 'serverUrl', label: 'ArgoCD Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:8080', required: true },
      { key: 'apiToken', label: 'ArgoCD Auth Token (JWT)', type: 'password', placeholder: 'Nhập ArgoCD Token', required: true },
      { key: 'configRepoUrl', label: 'GitOps Config Repo URL', type: 'text', placeholder: 'Ví dụ: https://github.com/your-username/k8s-manifests.git', required: true },
      { key: 'targetNamespace', label: 'Target K8s Namespace', type: 'text', placeholder: 'production', required: false, defaultValue: 'production' }
    ],
    docsUrl: 'https://argo-cd.readthedocs.io/',
    tags: ['gitops', 'argocd', 'k8s', 'cncf']
  },
  {
    id: 'coolify-paas',
    name: 'Coolify Self-Hosted PaaS',
    category: 'DEPLOY',
    license: 'Open Source (Apache 2.0)',
    description: 'Giải pháp thay thế Heroku / Vercel tự host mã nguồn mở miễn phí, deploy ứng dụng qua Git push.',
    defaultPort: 8000,
    configFields: [
      { key: 'serverUrl', label: 'Coolify Instance URL', type: 'text', placeholder: 'Ví dụ: http://localhost:8000', required: true },
      { key: 'apiToken', label: 'Bearer API Token', type: 'password', placeholder: 'Nhập Coolify API Token', required: true }
    ],
    docsUrl: 'https://coolify.io/docs/',
    tags: ['paas', 'self-hosted', 'deploy', 'vercel-alternative']
  },
  {
    id: 'portainer-ce',
    name: 'Portainer Community Edition',
    category: 'DEPLOY',
    license: 'Open Source (zlib)',
    description: 'Giao diện quản lý trực quan cho Docker, Docker Swarm và cụm máy chủ Kubernetes.',
    defaultPort: 9000,
    configFields: [
      { key: 'serverUrl', label: 'Portainer Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:9000', required: true },
      { key: 'apiKey', label: 'Portainer API Key', type: 'password', placeholder: 'Nhập Portainer Access Key', required: true }
    ],
    docsUrl: 'https://docs.portainer.io/',
    tags: ['portainer', 'docker-gui', 'management']
  },
  {
    id: 'k3s-kubernetes',
    name: 'K3s Lightweight Kubernetes',
    category: 'DEPLOY',
    license: 'Open Source (Apache 2.0)',
    description: 'Bản phân phối Kubernetes siêu nhẹ của Rancher, tối ưu hóa cho môi trường Edge và máy cá nhân.',
    configFields: [
      { key: 'kubeconfigPath', label: 'Kubeconfig File Path', type: 'text', placeholder: 'Ví dụ: ~/.kube/config hoặc C:\\Users\\...\\.kube\\config', required: true },
      { key: 'clusterContext', label: 'Cluster Context Name', type: 'text', placeholder: 'default', required: false, defaultValue: 'default' }
    ],
    docsUrl: 'https://docs.k3s.io/',
    tags: ['kubernetes', 'k3s', 'lightweight', 'rancher']
  },

  // 5. Telemetry & Monitoring
  {
    id: 'prometheus-tsdb',
    name: 'Prometheus Time-Series DB',
    category: 'MONITOR',
    license: 'Open Source (Apache 2.0)',
    description: 'Hệ thống thu thập số liệu giám sát và phát hiện cảnh báo thời gian thực tiêu chuẩn CNCF.',
    defaultPort: 9090,
    configFields: [
      { key: 'serverUrl', label: 'Prometheus Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:9090', required: true },
      { key: 'scrapeInterval', label: 'Tần Suất Scrape (Giây)', type: 'number', placeholder: '15', required: false, defaultValue: 15 }
    ],
    docsUrl: 'https://prometheus.io/docs/',
    tags: ['metrics', 'prometheus', 'monitoring', 'cncf']
  },
  {
    id: 'grafana-oss',
    name: 'Grafana OSS Dashboards',
    category: 'MONITOR',
    license: 'Open Source (AGPLv3)',
    description: 'Nền tảng trực quan hóa số liệu hạ tầng, biểu đồ phân tích thời gian thực và quản trị Dashboard.',
    defaultPort: 3000,
    configFields: [
      { key: 'serverUrl', label: 'Grafana Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:3000', required: true },
      { key: 'apiToken', label: 'Grafana Service Account Token', type: 'password', placeholder: 'Nhập Grafana Token (glsa_...)', required: true }
    ],
    docsUrl: 'https://grafana.com/docs/',
    tags: ['grafana', 'dashboards', 'telemetry']
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma',
    category: 'MONITOR',
    license: 'Open Source (MIT)',
    description: 'Công cụ giám sát Uptime dịch vụ HTTP/TCP/Ping tự host đẹp mắt và có Status Page công khai.',
    defaultPort: 3001,
    configFields: [
      { key: 'serverUrl', label: 'Uptime Kuma Server URL', type: 'text', placeholder: 'Ví dụ: http://localhost:3001', required: true }
    ],
    docsUrl: 'https://github.com/louislam/uptime-kuma',
    tags: ['uptime', 'healthcheck', 'status-page']
  },

  // 6. Notifications & Alerts
  {
    id: 'telegram-bot-alert',
    name: 'Telegram Bot Notification Webhook',
    category: 'ALERT',
    license: 'Free Tier',
    description: 'Gửi thông báo tiến độ Pipeline, trạng thái Deploy và lỗi bảo mật tức thì về nhóm chat Telegram.',
    configFields: [
      { key: 'botToken', label: 'Telegram Bot Token', type: 'password', placeholder: 'Ví dụ: 123456789:ABCdefGHIjklMNOpqr', required: true },
      { key: 'chatId', label: 'Group / Channel Chat ID', type: 'text', placeholder: 'Ví dụ: -100123456789 hoặc @your_channel', required: true }
    ],
    docsUrl: 'https://core.telegram.org/bots/api',
    tags: ['telegram', 'bot', 'notifications', 'instant']
  },
  {
    id: 'discord-webhook-alert',
    name: 'Discord Webhook Dispatcher',
    category: 'ALERT',
    license: 'Free Tier',
    description: 'Bắn tin nhắn embed màu sắc trực quan về kênh Discord của đội ngũ kỹ thuật khi có commit mới.',
    configFields: [
      { key: 'webhookUrl', label: 'Discord Webhook URL', type: 'password', placeholder: 'Ví dụ: https://discord.com/api/webhooks/...', required: true }
    ],
    docsUrl: 'https://discord.com/developers/docs/resources/webhook',
    tags: ['discord', 'webhook', 'team-chat']
  },
  {
    id: 'gmail-smtp-alert',
    name: 'Gmail & SMTP Dispatcher',
    category: 'ALERT',
    license: 'Free Tier',
    description: 'Gửi email báo cáo nghiệm thu tự động gửi Sếp và khách hàng ngay khi hoàn tất Deploy.',
    configFields: [
      { key: 'recipientEmail', label: 'Email Nhận Thông Báo', type: 'text', placeholder: 'Ví dụ: email-cua-ban@gmail.com', required: true },
      { key: 'smtpServer', label: 'SMTP Server (Tùy chọn)', type: 'text', placeholder: 'smtp.gmail.com', required: false, defaultValue: 'smtp.gmail.com' }
    ],
    docsUrl: 'https://support.google.com/mail/answer/7126229',
    tags: ['email', 'smtp', 'gmail', 'report']
  }
];
