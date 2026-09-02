import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'all';

    const configPath = path.join(process.cwd(), 'workflow.config.json');
    let config: any = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    // 1. Generate pipeline.env
    const pipelineEnv = `# ==============================================================================
# GBC AI AGENTIC WORKFLOW - ENVIRONMENT CONFIGURATION (PIPELINE.ENV)
# Tự động sinh từ Hệ thống Bàn Điều Khiển Hạ Tầng
# ==============================================================================

# 1. WORKSPACE & GIT CONFIG
WORKSPACE_ROOT=${config.workspace?.rootDir || 'C:\\Users\\ADMIN\\OneDrive\\Documents\\Work'}
GIT_USER_NAME=${config.git?.defaultUserName || 'Ktee'}
GIT_USER_EMAIL=${config.git?.defaultUserEmail || 'kteenguyen@gmail.com'}
GIT_DEFAULT_BRANCH=${config.git?.defaultBranch || 'main'}

# 2. JENKINS CI SERVER
JENKINS_URL=${config.ci?.serverUrl || 'http://localhost:8080'}
JENKINS_USER=${config.ci?.userName || 'admin'}
JENKINS_API_TOKEN=${config.ci?.apiToken || 'your-jenkins-api-token'}
JENKINS_JOB_NAME=${config.ci?.jobPrefix || 'pipeline-'}gbc-ai-agentic

# 3. SECURITY GATES
OWASP_CVSS_FAIL_THRESHOLD=${config.security?.owasp?.failOnCvss || 7.0}
SONARQUBE_HOST_URL=${config.security?.sonarQube?.serverUrl || 'http://localhost:9000'}
SONARQUBE_TOKEN=${config.security?.sonarQube?.projectToken || 'sqp_your_token'}
TRIVY_SEVERITY=${config.security?.trivy?.severity || 'CRITICAL,HIGH'}

# 4. DOCKER & CONTAINER REGISTRY
DOCKER_REGISTRY=${config.docker?.registryUrl || 'docker.io'}
DOCKER_NAMESPACE=${config.docker?.repositoryNamespace || 'kteenguyen'}
DOCKER_IMAGE_NAME=gbc-ai-agentic
DOCKER_IMAGE_TAG=latest

# 5. ARGOCD & GITOPS
ARGOCD_SERVER=${config.gitops?.argoCdUrl || 'https://argocd.globalcode.com.vn'}
ARGOCD_AUTH_TOKEN=${config.gitops?.argoCdToken || 'your-argocd-token'}
ARGOCD_APP_NAME=gbc-agentic-production
ARGOCD_TARGET_NAMESPACE=${config.gitops?.targetNamespace || 'production'}

# 6. KUBERNETES CLUSTER
KUBE_CONTEXT=${config.kubernetes?.clusterContext || 'k8s-prod-cluster'}
KUBE_REPLICAS=${config.kubernetes?.replicas || 3}

# 7. TELEMETRY & ALERTS
PROMETHEUS_URL=${config.telemetry?.prometheusUrl || 'http://localhost:9090'}
GRAFANA_URL=${config.telemetry?.grafanaUrl || 'http://localhost:3000'}
TELEGRAM_BOT_TOKEN=bot_token_here
TELEGRAM_CHAT_ID=-100123456789
ALERT_EMAIL_RECIPIENT=${config.telemetry?.emailRecipient || 'kteenguyen@gmail.com'}
`;

    // 2. Generate docker-compose.yml
    const dockerComposeYml = `version: '3.8'

services:
  app:
    image: ${config.docker?.repositoryNamespace || 'kteenguyen'}/gbc-ai-agentic:latest
    container_name: gbc-agentic-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - devops-network

  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: devops-jenkins
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_data:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - devops-network

  sonarqube:
    image: sonarqube:lts-community
    container_name: devops-sonarqube
    restart: unless-stopped
    ports:
      - "9000:9000"
    networks:
      - devops-network

  prometheus:
    image: prom/prometheus:latest
    container_name: devops-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    networks:
      - devops-network

  grafana:
    image: grafana/grafana:latest
    container_name: devops-grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    networks:
      - devops-network

volumes:
  jenkins_data:

networks:
  devops-network:
    driver: bridge
`;

    // 3. Generate k8s-manifest.yaml
    const k8sManifestYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: gbc-agentic-deployment
  namespace: ${config.gitops?.targetNamespace || 'production'}
  labels:
    app: gbc-ai-agentic
    tier: web
spec:
  replicas: ${config.kubernetes?.replicas || 3}
  selector:
    matchLabels:
      app: gbc-ai-agentic
  template:
    metadata:
      labels:
        app: gbc-ai-agentic
    spec:
      containers:
      - name: gbc-ai-agentic
        image: ${config.docker?.repositoryNamespace || 'kteenguyen'}/gbc-ai-agentic:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: "1000m"
            memory: "1024Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: gbc-agentic-service
  namespace: ${config.gitops?.targetNamespace || 'production'}
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: gbc-ai-agentic
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gbc-agentic-ingress
  namespace: ${config.gitops?.targetNamespace || 'production'}
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - agent.globalcode.com.vn
    secretName: gbc-agentic-tls
  rules:
  - host: agent.globalcode.com.vn
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: gbc-agentic-service
            port:
              number: 80
`;

    if (format === 'env') {
      return new Response(pipelineEnv, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename="pipeline.env"'
        }
      });
    }

    if (format === 'docker') {
      return new Response(dockerComposeYml, {
        headers: {
          'Content-Type': 'text/yaml; charset=utf-8',
          'Content-Disposition': 'attachment; filename="docker-compose.yml"'
        }
      });
    }

    if (format === 'k8s') {
      return new Response(k8sManifestYaml, {
        headers: {
          'Content-Type': 'text/yaml; charset=utf-8',
          'Content-Disposition': 'attachment; filename="k8s-manifest.yaml"'
        }
      });
    }

    return NextResponse.json({
      success: true,
      manifests: {
        env: {
          filename: 'pipeline.env',
          content: pipelineEnv
        },
        docker: {
          filename: 'docker-compose.yml',
          content: dockerComposeYml
        },
        k8s: {
          filename: 'k8s-manifest.yaml',
          content: k8sManifestYaml
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
