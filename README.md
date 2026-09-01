# 🌐 Antigravity Open Workflow Engine (DevOps & CI/CD Security Canvas)

Hệ thống điều phối quy trình phát triển và kiểm toán an ninh tự động mã nguồn mở (Open Source), hỗ trợ chạy đa nền tảng (**Windows, macOS, Linux, Docker**) và tích hợp kết nối giao thức hạ tầng thực tế 100%.

---

## 🚀 Tính Năng Chính
1. **Sơ Đồ Visual Workflow 2 Khối Chuẩn Chỉ**:
   - **Khối ①: Jenkins CI & 3 Cổng Bảo Mật** (Developer ➔ GitHub ➔ Jenkins CI [deps tree] ➔ OWASP Dependency-Check ➔ SonarQube Clean Code ➔ Trivy Filesystem/Secrets ➔ Docker BuildKit).
   - **Khối ②: Jenkins CD & GitOps Deploy** (Jenkins CD ➔ Config Repo ➔ ArgoCD ➔ Kubernetes Cluster ➔ MyApp Live Production; Loop Giám sát: Prometheus ➔ Grafana ➔ Gmail/Telegram Alerts).
2. **Trung Tâm Cấu Hình Hạ Tầng Toàn Diện (`workflow.config.json`)**:
   - Cho phép người dùng tùy chỉnh thư mục Workspace, tài khoản Git, địa chỉ máy chủ Jenkins, SonarQube, Docker Registry, ArgoCD, Kubernetes Kubeconfig và Prometheus.
   - Nút **Kiểm tra kết nối giao thức (Protocol Test)** đo đạc độ trễ mạng thực tế (Latency ms) tới từng thành phần hạ tầng.
3. **Đồng Bộ Tự Động Toàn Bộ Dự Án Trên Máy**:
   - Tự động quét và hiển thị toàn bộ repositories có trên máy tính kèm nhánh Git, mã Commit SHA, và đường dẫn Remote Origin thật.
4. **Tích Hợp Giao Thức Model Context Protocol (MCP 2.0)**:
   - Cho phép các AI Coding Agents (như Antigravity) điều khiển sơ đồ, chuyển trạng thái node và bắn trực tiếp nhật ký kiểm thử theo thời gian thực 0ms.

---

## 📦 Hướng Dẫn Cài Đặt & Chạy Trên Mọi Máy Tính

### 1. Yêu Cầu Hệ Thống:
- Node.js >= 18.x
- Git CLI installed

### 2. Cài Đặt & Chạy Cục Bộ:
```bash
# Clone repository
git clone https://github.com/Kteenguyen/antigravity-workflow-arena.git
cd antigravity-workflow-arena

# Cài đặt dependencies
npm install

# Khởi chạy giao diện Web
npm run dev
```
👉 Truy cập: `http://localhost:3000`

---

## ⚙️ Cấu Trúc File Cấu Hình Hạ Tầng (`workflow.config.json`)

```json
{
  "version": "1.0.0",
  "workspace": {
    "rootDir": "C:\\Users\\ADMIN\\OneDrive\\Documents\\Work",
    "autoScanSubdirectories": true
  },
  "git": {
    "defaultUserName": "Ktee",
    "defaultUserEmail": "nguyenkhoatai2003@gmail.com",
    "authType": "HTTPS"
  },
  "ci": {
    "provider": "Jenkins CI",
    "serverUrl": "http://localhost:8080",
    "userName": "admin"
  },
  "security": {
    "owasp": { "failOnCvss": 7.0 },
    "sonarQube": { "serverUrl": "https://sonarqube.globalcode.vn" },
    "trivy": { "scanType": "fs,secret" }
  },
  "docker": {
    "registryUrl": "registry.globalcode.vn"
  },
  "gitops": {
    "argoCdUrl": "https://argocd.globalcode.vn",
    "configRepoUrl": "https://github.com/Kteenguyen/k8s-gitops-manifests.git"
  },
  "kubernetes": {
    "kubeconfigPath": "~/.kube/config",
    "replicas": 3
  },
  "telemetry": {
    "prometheusUrl": "http://localhost:9090",
    "grafanaUrl": "http://localhost:3001"
  }
}
```

---

## 📄 Giấy Phép
Phát hành theo giấy phép **MIT Open Source License**. Tự do sử dụng, tùy biến và triển khai trong môi trường cá nhân hoặc doanh nghiệp.
