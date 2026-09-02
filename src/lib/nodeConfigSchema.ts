export interface ConfigFieldDef {
  key: string;
  label: string;
  type: 'text' | 'password' | 'number' | 'select' | 'boolean' | 'textarea';
  placeholder?: string;
  defaultValue?: any;
  description: string;
  options?: { value: string; label: string }[];
  category: 'AUTH' | 'SERVER' | 'POLICY' | 'OUTPUT';
  required?: boolean;
}

export interface NodeConfigSchema {
  nodeId: string;
  name: string;
  category: string;
  description: string;
  docUrl: string;
  pingEndpointType: 'JENKINS' | 'SONAR' | 'DOCKER' | 'ARGOCD' | 'K8S' | 'PROMETHEUS' | 'GRAFANA' | 'TELEGRAM' | 'GITHUB' | 'GENERIC_HTTP';
  fields: ConfigFieldDef[];
}

export const NODE_CONFIG_SCHEMAS: Record<string, NodeConfigSchema> = {
  'node-dev': {
    nodeId: 'node-dev',
    name: 'Developer & Workspace Root',
    category: 'Môi Trường & Tác Vụ Lập Trình',
    description: 'Cấu hình thư mục làm việc cục bộ và tài khoản phát triển của lập trình viên.',
    docUrl: 'https://git-scm.com/docs/git-config',
    pingEndpointType: 'GENERIC_HTTP',
    fields: [
      { key: 'rootDir', label: 'Đường dẫn thư mục gốc (Root Directory)', type: 'text', placeholder: 'C:\\Users\\ADMIN\\OneDrive\\Documents\\Work', description: 'Thư mục chứa các dự án mã nguồn trên máy tính', category: 'SERVER', required: true },
      { key: 'defaultUserName', label: 'Tên Lập Trình Viên (Git User Name)', type: 'text', placeholder: 'Ktee', description: 'Tên tác giả commit mã nguồn', category: 'AUTH', required: true },
      { key: 'defaultUserEmail', label: 'Email Lập Trình Viên (Git User Email)', type: 'text', placeholder: 'kteenguyen@gmail.com', description: 'Email gắn kèm chữ ký commit', category: 'AUTH', required: true },
      { key: 'autoCommitOnStagePass', label: 'Tự động Commit khi khâu đạt', type: 'boolean', defaultValue: false, description: 'Tự động tạo commit Git khi vượt qua cổng kiểm thử', category: 'POLICY' }
    ]
  },
  'node-github-src': {
    nodeId: 'node-github-src',
    name: 'GitHub Source Repository',
    category: 'Kho Mã Nguồn Chính Thức (SSOT)',
    description: 'Kho lưu trữ Git trên GitHub / GitLab, quản lý mã nguồn, webhook và nhánh chính.',
    docUrl: 'https://docs.github.com/en/rest',
    pingEndpointType: 'GITHUB',
    fields: [
      { key: 'remoteUrl', label: 'Git Remote Repository URL', type: 'text', placeholder: 'https://github.com/Kteenguyen/GBC_AI_agentic.git', description: 'URL kho lưu trữ Git từ xa', category: 'SERVER', required: true },
      { key: 'defaultBranch', label: 'Nhánh làm việc chính (Default Branch)', type: 'text', placeholder: 'main', defaultValue: 'main', description: 'Nhánh kích hoạt pipeline CI/CD', category: 'SERVER', required: true },
      { key: 'authType', label: 'Phương thức xác thực', type: 'select', defaultValue: 'HTTPS', options: [{ value: 'HTTPS', label: 'HTTPS (Token)' }, { value: 'SSH', label: 'SSH Key' }], description: 'Giao thức kết nối kho mã nguồn', category: 'AUTH' },
      { key: 'personalAccessToken', label: 'GitHub Personal Access Token (PAT)', type: 'password', placeholder: 'ghp_...', description: 'Token có quyền repo và workflow', category: 'AUTH' },
      { key: 'webhookSecret', label: 'Webhook Secret Token', type: 'password', placeholder: 'whsec_...', description: 'Khóa bí mật xác thực webhook push event', category: 'AUTH' }
    ]
  },
  'node-jenkins-ci': {
    nodeId: 'node-jenkins-ci',
    name: 'Jenkins CI Master Server',
    category: 'Tự Động Hóa Build & Pipeline',
    description: 'Máy chủ Jenkins điều phối việc biên dịch mã nguồn, chạy kiểm thử và phân phối artifacts.',
    docUrl: 'https://www.jenkins.io/doc/book/using/remote-access-api/',
    pingEndpointType: 'JENKINS',
    fields: [
      { key: 'serverUrl', label: 'Jenkins Server URL', type: 'text', placeholder: 'http://localhost:8080', description: 'Địa chỉ máy chủ Jenkins CI đang chạy', category: 'SERVER', required: true },
      { key: 'userName', label: 'Jenkins Admin / API Username', type: 'text', placeholder: 'admin', description: 'Tên tài khoản quản trị Jenkins', category: 'AUTH', required: true },
      { key: 'apiToken', label: 'Jenkins API Token / Password', type: 'password', placeholder: '11a8b9c...', description: 'API Token sinh từ phần User Configure trong Jenkins', category: 'AUTH', required: true },
      { key: 'jobName', label: 'Tên Job / Pipeline Name', type: 'text', placeholder: 'pipeline-gbc-ai-agentic', description: 'Tên dự án Pipeline trong Jenkins Dashboard', category: 'SERVER', required: true },
      { key: 'branchSpecifier', label: 'Mẫu Nhánh (Branch Specifier)', type: 'text', placeholder: '*/main', defaultValue: '*/main', description: 'Nhánh Git được chỉ định build', category: 'POLICY' },
      { key: 'crumbIssuer', label: 'Bật bảo vệ CSRF Crumb Issuer', type: 'boolean', defaultValue: true, description: 'Yêu cầu Jenkins Crumb Token khi gửi REST POST request', category: 'POLICY' }
    ]
  },
  'node-owasp': {
    nodeId: 'node-owasp',
    name: 'OWASP Dependency-Check',
    category: 'Cổng Bảo Mật ①: Thư Viện Phụ Thuộc',
    description: 'Quét toàn bộ cây phụ thuộc npm / maven / pip để phát hiện lỗ hổng đã công bố (CVE).',
    docUrl: 'https://jeremylong.github.io/DependencyCheck/',
    pingEndpointType: 'GENERIC_HTTP',
    fields: [
      { key: 'enabled', label: 'Kích hoạt cổng OWASP Gate', type: 'boolean', defaultValue: true, description: 'Bật kiểm tra lỗ hổng phụ thuộc trước khi build', category: 'POLICY' },
      { key: 'scannerPath', label: 'Đường dẫn Binary Scanner', type: 'text', placeholder: 'dependency-check.bat hoặc dependency-check.sh', description: 'Đường dẫn CLI của OWASP Dependency-Check trên máy chủ', category: 'SERVER' },
      { key: 'failOnCvss', label: 'Ngưỡng điểm CVSS chặn Pipeline (Fail Threshold)', type: 'number', placeholder: '7.0', defaultValue: 7.0, description: 'Điểm CVSS từ ngưỡng này trở lên sẽ đánh dấu cổng FAIL (0 - 10)', category: 'POLICY', required: true },
      { key: 'suppressionFile', label: 'Đường dẫn File Bỏ Qua (Suppression XML)', type: 'text', placeholder: 'owasp-suppressions.xml', description: 'File quy định bỏ qua các cảnh báo dương tính giả', category: 'POLICY' }
    ]
  },
  'node-sonarqube': {
    nodeId: 'node-sonarqube',
    name: 'SonarQube Quality Gate',
    category: 'Cổng Bảo Mật ②: Chất Lượng Mã Nguồn',
    description: 'Phân tích tĩnh mã nguồn (SAST), phát hiện Bug, Code Smell, Security Hotspots và độ phủ test.',
    docUrl: 'https://docs.sonarsource.com/sonarqube/latest/',
    pingEndpointType: 'SONAR',
    fields: [
      { key: 'enabled', label: 'Kích hoạt cổng SonarQube Gate', type: 'boolean', defaultValue: true, description: 'Yêu cầu đạt Quality Gate Grade A trước khi đóng gói', category: 'POLICY' },
      { key: 'serverUrl', label: 'SonarQube Server URL', type: 'text', placeholder: 'http://localhost:9000', description: 'URL máy chủ SonarQube', category: 'SERVER', required: true },
      { key: 'projectKey', label: 'SonarQube Project Key', type: 'text', placeholder: 'gbc-ai-agentic-workflow', description: 'Mã định danh duy nhất của dự án trong SonarQube', category: 'SERVER', required: true },
      { key: 'projectToken', label: 'SonarQube User / Project Token', type: 'password', placeholder: 'sqp_...', description: 'Token xác thực quyền phân tích SonarQube', category: 'AUTH', required: true },
      { key: 'qualityGateRequired', label: 'Ngưỡng Đạt Chất Lượng', type: 'select', defaultValue: 'PASSED', options: [{ value: 'PASSED', label: 'Grade A (Strict Passed)' }, { value: 'WARNING_OK', label: 'Chấp nhận Cảnh báo nhẹ' }], description: 'Điều kiện vượt qua cổng', category: 'POLICY' }
    ]
  },
  'node-trivy': {
    nodeId: 'node-trivy',
    name: 'Trivy Vulnerability Scanner',
    category: 'Cổng Bảo Mật ③: Quét Filesystem & OS CVE',
    description: 'Công cụ quét toàn diện lỗ hổng bảo mật tệp tin, biến môi trường bị lộ và gói phần mềm OS.',
    docUrl: 'https://aquasecurity.github.io/trivy/',
    pingEndpointType: 'GENERIC_HTTP',
    fields: [
      { key: 'enabled', label: 'Kích hoạt cổng Trivy Security Gate', type: 'boolean', defaultValue: true, description: 'Bật quét trước khi đẩy image lên registry', category: 'POLICY' },
      { key: 'scanType', label: 'Chế độ quét (Scan Type)', type: 'select', defaultValue: 'fs,secret', options: [{ value: 'fs,secret', label: 'Filesystem & Secrets' }, { value: 'image', label: 'Docker Image Scan' }, { value: 'config,vuln', label: 'Misconfiguration & Vulns' }], description: 'Đối tượng cần Trivy quét', category: 'POLICY' },
      { key: 'severity', label: 'Mức độ nghiêm trọng chặn build (Severity)', type: 'text', placeholder: 'CRITICAL,HIGH', defaultValue: 'CRITICAL,HIGH', description: 'Danh sách các mức độ vi phạm (CRITICAL, HIGH, MEDIUM)', category: 'POLICY', required: true },
      { key: 'ignoreUnfixed', label: 'Bỏ qua lỗ hổng chưa có bản vá (Ignore Unfixed)', type: 'boolean', defaultValue: true, description: 'Không chặn build nếu lỗ hổng chưa có bản vá chính thức', category: 'POLICY' }
    ]
  },
  'node-docker': {
    nodeId: 'node-docker',
    name: 'Docker Build & Container Registry',
    category: 'Đóng Gói & Quản Lý Image',
    description: 'Xây dựng Container Image đa tầng (Multi-stage) và đẩy lên Private / Public Container Registry.',
    docUrl: 'https://docs.docker.com/engine/reference/commandline/build/',
    pingEndpointType: 'DOCKER',
    fields: [
      { key: 'socketPath', label: 'Docker Engine Socket Path', type: 'text', placeholder: '//./pipe/docker_engine hoặc /var/run/docker.sock', description: 'Đường dẫn kết nối Docker Daemon trên hệ điều hành', category: 'SERVER', required: true },
      { key: 'registryUrl', label: 'Container Registry URL', type: 'text', placeholder: 'docker.io hoặc ghcr.io', defaultValue: 'docker.io', description: 'Máy chủ lưu trữ Docker Registry', category: 'SERVER', required: true },
      { key: 'repositoryNamespace', label: 'Tài khoản / Namespace Registry', type: 'text', placeholder: 'kteenguyen', description: 'Tên tổ chức hoặc người dùng sở hữu repository', category: 'AUTH', required: true },
      { key: 'imageName', label: 'Tên Image (Repository Name)', type: 'text', placeholder: 'gbc-ai-agentic', defaultValue: 'gbc-ai-agentic', description: 'Tên hình ảnh ứng dụng', category: 'SERVER', required: true },
      { key: 'authUsername', label: 'Registry Username', type: 'text', placeholder: 'kteenguyen', description: 'Tên đăng nhập Docker Registry', category: 'AUTH' },
      { key: 'authToken', label: 'Registry Access Token / Password', type: 'password', placeholder: 'dckr_pat_...', description: 'Mật khẩu hoặc Token đẩy Docker Image', category: 'AUTH' },
      { key: 'tagFormat', label: 'Mẫu Đánh Tag Tự Động (Tag Pattern)', type: 'text', placeholder: 'sha-${GIT_COMMIT}', defaultValue: 'v1.0.${BUILD_NUMBER}', description: 'Quy tắc sinh version tag cho container', category: 'POLICY' }
    ]
  },
  'node-argocd': {
    nodeId: 'node-argocd',
    name: 'ArgoCD GitOps Controller',
    category: 'Điều Phối Triển Khai GitOps',
    description: 'Bộ điều khiển đồng bộ trạng thái thực tế của Kubernetes theo đúng khai báo trong Git Repo.',
    docUrl: 'https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/',
    pingEndpointType: 'ARGOCD',
    fields: [
      { key: 'argoCdUrl', label: 'ArgoCD Server URL', type: 'text', placeholder: 'https://argocd.globalcode.com.vn', description: 'URL máy chủ ArgoCD Web/API', category: 'SERVER', required: true },
      { key: 'argoCdToken', label: 'ArgoCD Auth Token / Admin Password', type: 'password', placeholder: 'eyJhbGci...', description: 'Token xác thực REST API ArgoCD', category: 'AUTH', required: true },
      { key: 'appName', label: 'Tên Application trong ArgoCD', type: 'text', placeholder: 'gbc-agentic-production', defaultValue: 'gbc-agentic-production', description: 'Tên ứng dụng được quản lý trong ArgoCD', category: 'SERVER', required: true },
      { key: 'configRepoUrl', label: 'GitOps Manifest Repository URL', type: 'text', placeholder: 'https://github.com/Kteenguyen/k8s-manifests.git', description: 'Kho Git chứa các file YAML triển khai Kubernetes', category: 'SERVER', required: true },
      { key: 'targetNamespace', label: 'Kubernetes Target Namespace', type: 'text', placeholder: 'production', defaultValue: 'production', description: 'Namespace triển khai trên cụm K8s', category: 'POLICY', required: true },
      { key: 'autoSync', label: 'Tự động Đồng Bộ (Auto-Sync & Self-Heal)', type: 'boolean', defaultValue: true, description: 'Tự động áp dụng thay đổi khi phát hiện lệch cấu hình', category: 'POLICY' }
    ]
  },
  'node-k8s': {
    nodeId: 'node-k8s',
    name: 'Kubernetes Production Cluster',
    category: 'Hạ Tầng Cụm Máy Chủ Vận Hành',
    description: 'Cụm máy chủ điều phối container, quản lý Pods, Ingress, cân bằng tải và tự phục hồi.',
    docUrl: 'https://kubernetes.io/docs/reference/kubectl/',
    pingEndpointType: 'K8S',
    fields: [
      { key: 'kubeconfigPath', label: 'Đường dẫn tệp Kubeconfig Cụm', type: 'text', placeholder: 'C:\\Users\\ADMIN\\.kube\\config', description: 'File cấu hình chứng chỉ truy cập cụm Kubernetes', category: 'SERVER', required: true },
      { key: 'clusterContext', label: 'Cluster Context Name', type: 'text', placeholder: 'k8s-globalcode-prod', description: 'Tên ngữ cảnh cụm máy chủ trong kubeconfig', category: 'AUTH', required: true },
      { key: 'replicas', label: 'Số lượng Pod Replicas', type: 'number', placeholder: '3', defaultValue: 3, description: 'Số bản sao container chạy song song bảo đảm sẵn sàng cao', category: 'POLICY', required: true },
      { key: 'ingressDomain', label: 'Tên Miền Ingress Domain', type: 'text', placeholder: 'agent.globalcode.com.vn', defaultValue: 'agent.globalcode.com.vn', description: 'Địa chỉ tên miền đón lưu lượng truy cập thực tế', category: 'SERVER' },
      { key: 'healthCheckProbe', label: 'Healthcheck Endpoint Probe', type: 'text', placeholder: '/api/health', defaultValue: '/api/health', description: 'Đường dẫn kiểm tra độ sống của Pod (Liveness Probe)', category: 'POLICY' }
    ]
  },
  'node-prom': {
    nodeId: 'node-prom',
    name: 'Prometheus Metrics & Scrape Target',
    category: 'Giám Sát Thông Số Hệ Thống',
    description: 'Thu thập thông số tài nguyên CPU, RAM, thời gian phản hồi và lưu lượng truy cập.',
    docUrl: 'https://prometheus.io/docs/prometheus/latest/getting_started/',
    pingEndpointType: 'PROMETHEUS',
    fields: [
      { key: 'prometheusUrl', label: 'Prometheus Server URL / Pushgateway', type: 'text', placeholder: 'http://localhost:9090', description: 'URL máy chủ Prometheus thu thập chỉ số', category: 'SERVER', required: true },
      { key: 'scrapeInterval', label: 'Tần Suất Quét Chỉ Số (Scrape Interval)', type: 'text', placeholder: '15s', defaultValue: '15s', description: 'Chu kỳ lấy mẫu chỉ số từ ứng dụng', category: 'POLICY' },
      { key: 'metricsPath', label: 'Đường Dẫn Export Chỉ Số (Metrics Path)', type: 'text', placeholder: '/api/metrics', defaultValue: '/api/metrics', description: 'Endpoint cung cấp dữ liệu định dạng Prometheus', category: 'SERVER' },
      { key: 'cpuThresholdPercent', label: 'Ngưỡng Báo Động CPU (%)', type: 'number', placeholder: '85', defaultValue: 85, description: 'Kích hoạt cảnh báo khi CPU vượt quá ngưỡng', category: 'POLICY' }
    ]
  },
  'node-grafana': {
    nodeId: 'node-grafana',
    name: 'Grafana Dashboard Visualizer',
    category: 'Trực Quan Hóa Bảng Điều Khiển',
    description: 'Hiển thị biểu đồ realtime về SLA, lượng request, trạng thái lỗi 5xx và sức khỏe cụm.',
    docUrl: 'https://grafana.com/docs/grafana/latest/dashboards/',
    pingEndpointType: 'GRAFANA',
    fields: [
      { key: 'grafanaUrl', label: 'Grafana Server URL', type: 'text', placeholder: 'http://localhost:3000', description: 'URL máy chủ Grafana Dashboard', category: 'SERVER', required: true },
      { key: 'apiKey', label: 'Grafana API Key / Service Account Token', type: 'password', placeholder: 'glsa_...', description: 'Token xác thực truy cập Grafana REST API', category: 'AUTH' },
      { key: 'dashboardUid', label: 'Dashboard UID Chỉ Định', type: 'text', placeholder: 'devops-squad-live', defaultValue: 'devops-squad-live', description: 'Mã UID của bảng điều khiển trực quan', category: 'SERVER' }
    ]
  },
  'node-gmail': {
    nodeId: 'node-gmail',
    name: 'Telegram & Email Realtime Alerts',
    category: 'Hệ Thống Cảnh Báo Đa Kênh',
    description: 'Phát thông báo tức thì đến Telegram Bot, Email và Slack khi Pipeline có sự cố hoặc deploy thành công.',
    docUrl: 'https://core.telegram.org/bots/api',
    pingEndpointType: 'TELEGRAM',
    fields: [
      { key: 'telegramBotToken', label: 'Telegram Bot API Token', type: 'password', placeholder: '123456789:ABCdef...', description: 'Token của Bot Telegram tạo từ @BotFather', category: 'AUTH', required: true },
      { key: 'telegramChatId', label: 'Telegram Target Chat ID / Channel ID', type: 'text', placeholder: '-100123456789', description: 'ID của nhóm hoặc kênh nhận thông báo', category: 'AUTH', required: true },
      { key: 'emailRecipient', label: 'Email Người Nhận Khẩn Cấp', type: 'text', placeholder: 'kteenguyen@gmail.com', defaultValue: 'kteenguyen@gmail.com', description: 'Hòm thư nhận email báo cáo sự cố', category: 'SERVER', required: true },
      { key: 'slackWebhookUrl', label: 'Slack Webhook URL (Tùy chọn)', type: 'text', placeholder: 'https://hooks.slack.com/services/...', description: 'URL gửi tin nhắn tự động vào kênh Slack', category: 'SERVER' }
    ]
  }
};
