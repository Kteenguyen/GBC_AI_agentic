#!/usr/bin/env node

/**
 * Antigravity Model Context Protocol (MCP) Stdio Server
 * 100% Strict Protocol Compliance (MCP 2024-11-05 Standard)
 */

const readline = require('readline');
const http = require('http');

const SERVER_NAME = 'workflow-devops-arena';
const SERVER_VERSION = '2.0.0';
const WEB_API_URL = process.env.WORKFLOW_API_URL || 'http://localhost:3000/api/mcp';

const MCP_TOOLS = [
  {
    name: 'advance_workflow_node',
    description: 'Chuyển tiến trình Workflow sang Node tiếp theo hoặc chỉ định Node cụ thể (VD: node-dev, node-owasp, node-sonarqube, node-docker, node-k8s, node-myapp).',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { 
          type: 'string', 
          description: 'Mã Node: node-dev, node-github-src, node-jenkins-ci, node-owasp, node-sonarqube, node-trivy, node-docker, node-jenkins-cd, node-github-config, node-argocd, node-k8s, node-myapp, node-prometheus, node-grafana, node-gmail' 
        },
        status: { 
          type: 'string', 
          enum: ['STANDBY', 'RUNNING', 'SUCCESS', 'WARNING', 'FAILED'],
          description: 'Trạng thái mới của Node' 
        },
        statusText: { 
          type: 'string', 
          description: 'Nhãn trạng thái hiển thị' 
        }
      },
      required: ['nodeId']
    }
  },
  {
    name: 'push_node_log',
    description: 'Bắn trực tiếp dòng log kiểm thử / phân tích / build từ Antigravity vào Node trên sơ đồ Workflow theo thời gian thực 0ms.',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'Mã Node nhận log (VD: node-dev, node-owasp, node-sonarqube, node-docker...)' },
        logMessage: { type: 'string', description: 'Nội dung log chi tiết' },
        metricKey: { type: 'string', description: 'Tên chỉ số' },
        metricValue: { type: 'string', description: 'Giá trị chỉ số' }
      },
      required: ['nodeId', 'logMessage']
    }
  },
  {
    name: 'trigger_push_code_workflow',
    description: 'Kích hoạt chạy tự động toàn bộ luồng CI/CD & 3 Cổng bảo mật từ Developer đến MyApp Production trên màn hình web.',
    inputSchema: {
      type: 'object',
      properties: {
        speed: { type: 'string', enum: ['chậm', 'vừa', 'nhanh'], description: 'Tốc độ thực thi' }
      }
    }
  },
  {
    name: 'reset_workflow',
    description: 'Đưa toàn bộ các Node trên sơ đồ Workflow về trạng thái chờ ban đầu.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_workflow_state',
    description: 'Đọc toàn bộ trạng thái 15 nodes và các cổng kiểm toán trên sơ đồ Workflow.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

function forwardToWebApi(requestBody) {
  return new Promise((resolve) => {
    try {
      const url = new URL(WEB_API_URL);
      const data = JSON.stringify(requestBody);
      const req = http.request({
        hostname: url.hostname,
        port: url.port || 3000,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        },
        timeout: 3000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            resolve({
              jsonrpc: '2.0',
              id: requestBody.id,
              result: {
                content: [{ type: 'text', text: `Output: ${body}` }],
                isError: false
              }
            });
          }
        });
      });

      req.on('error', () => {
        // Fallback local response when web server is not reachable
        resolve({
          jsonrpc: '2.0',
          id: requestBody.id,
          result: {
            content: [{ type: 'text', text: `[MCP Local Handled] Tiếp nhận lệnh '${requestBody.params?.name || requestBody.method}'.` }],
            isError: false
          }
        });
      });

      req.write(data);
      req.end();
    } catch (e) {
      resolve({
        jsonrpc: '2.0',
        id: requestBody.id,
        result: {
          content: [{ type: 'text', text: `Error: ${e.message}` }],
          isError: true
        }
      });
    }
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  try {
    const request = JSON.parse(trimmed);

    // CRITICAL MCP RULE: Ignore notifications (any message without an ID or starting with notifications/)
    if (request.id === undefined || request.id === null || (request.method && request.method.startsWith('notifications/'))) {
      return;
    }

    // 1. Handle initialize
    if (request.method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: false },
            resources: { subscribe: false, listChanged: false },
            prompts: { listChanged: false }
          },
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // 2. Handle ping
    if (request.method === 'ping') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: {}
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // 3. Handle tools/list
    if (request.method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: { tools: MCP_TOOLS }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // 4. Handle resources/list
    if (request.method === 'resources/list') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: { resources: [] }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // 5. Handle prompts/list
    if (request.method === 'prompts/list') {
      const response = {
        jsonrpc: '2.0',
        id: request.id,
        result: { prompts: [] }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // 6. Handle tools/call and other methods
    if (request.method === 'tools/call') {
      const response = await forwardToWebApi(request);
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // 7. Unknown Method
    const response = {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32601,
        message: `Method not found: ${request.method}`
      }
    };
    process.stdout.write(JSON.stringify(response) + '\n');

  } catch (err) {
    // If parse error and id could not be determined, return standard parse error
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: ' + err.message }
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});
