import { NextRequest, NextResponse } from 'next/server';
import { emitRealtimeUpdate } from '@/lib/data';

// MCP (Model Context Protocol) Tools Definition for Pure Workflow Canvas
const MCP_TOOLS = [
  {
    name: 'advance_workflow_node',
    description: 'Chuyển tiến trình Workflow sang Node tiếp theo hoặc chỉ định Node cụ thể (VD: node-owasp, node-sonarqube, node-docker, node-k8s, node-myapp).',
    inputSchema: {
      type: 'object',
      properties: {
        nodeId: { 
          type: 'string', 
          description: 'Mã định danh của Node: node-dev, node-github-src, node-jenkins-ci, node-owasp, node-sonarqube, node-trivy, node-docker, node-jenkins-cd, node-github-config, node-argocd, node-k8s, node-myapp, node-prometheus, node-grafana, node-gmail' 
        },
        status: { 
          type: 'string', 
          enum: ['STANDBY', 'RUNNING', 'SUCCESS', 'WARNING', 'FAILED'],
          description: 'Trạng thái mới của Node' 
        },
        statusText: { 
          type: 'string', 
          description: 'Nhãn trạng thái hiển thị (VD: sạch, đạt, đang chạy, thành công, live online)' 
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
        nodeId: { type: 'string', description: 'Mã Node nhận log (VD: node-owasp, node-sonarqube, node-docker...)' },
        logMessage: { type: 'string', description: 'Nội dung log chi tiết' },
        metricKey: { type: 'string', description: 'Tên chỉ số (nếu có, VD: Quality Gate, CVEs)' },
        metricValue: { type: 'string', description: 'Giá trị chỉ số (nếu có, VD: PASSED (Grade A), 0 CVE)' }
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    // 1. Handshake & Initialize
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: { listChanged: false } },
          serverInfo: {
            name: 'antigravity-devops-workflow-mcp',
            version: '2.0.0'
          }
        }
      });
    }

    // 2. List Available Tools
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: { tools: MCP_TOOLS }
      });
    }

    // 3. Execute Tool Call
    if (method === 'tools/call') {
      const { name, arguments: args } = params || {};

      switch (name) {
        case 'advance_workflow_node': {
          const payload = {
            nodeId: args.nodeId,
            status: args.status || 'SUCCESS',
            statusText: args.statusText || 'thành công',
            timestamp: Date.now()
          };
          emitRealtimeUpdate('gcm_workflow_node_advanced', payload);

          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `[SUCCESS] [MCP] Đã chuyển tiến trình Workflow sang Node: [${args.nodeId}] với trạng thái: ${payload.statusText}!`
                }
              ],
              isError: false
            }
          });
        }

        case 'push_node_log': {
          const payload = {
            nodeId: args.nodeId,
            logMessage: `[${new Date().toLocaleTimeString('vi-VN')}] ${args.logMessage}`,
            metricKey: args.metricKey,
            metricValue: args.metricValue,
            timestamp: Date.now()
          };
          emitRealtimeUpdate('gcm_workflow_log_added', payload);

          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `[LOG] [MCP] Đã ghi log thành công vào Node [${args.nodeId}]: "${args.logMessage}"`
                }
              ],
              isError: false
            }
          });
        }

        case 'trigger_push_code_workflow': {
          emitRealtimeUpdate('gcm_workflow_trigger_run', { speed: args.speed || 'vừa' });
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `[TRIGGER] [MCP] Đã kích hoạt chạy toàn bộ luồng Workflow CI/CD trên màn hình Web!`
                }
              ],
              isError: false
            }
          });
        }

        case 'reset_workflow': {
          emitRealtimeUpdate('gcm_workflow_reset', { timestamp: Date.now() });
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: `[RESET] [MCP] Đã reset sơ đồ Workflow về trạng thái ban đầu.`
                }
              ],
              isError: false
            }
          });
        }

        case 'get_workflow_state': {
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    server: 'antigravity-devops-workflow-mcp',
                    status: 'ONLINE',
                    activeGates: ['OWASP', 'SonarQube', 'Trivy'],
                    liveEndpoint: 'http://localhost:3000'
                  }, null, 2)
                }
              ],
              isError: false
            }
          });
        }

        default:
          return NextResponse.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Tool '${name}' not found on Workflow MCP Server.`
            }
          });
      }
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid JSON-RPC Request' }
    });

  } catch (err: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32000, message: err.message || 'Internal Server Error' }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'antigravity-devops-workflow-mcp',
    version: '2.0.0',
    protocolVersion: '2024-11-05',
    status: 'ACTIVE_CONNECTED',
    toolsCount: MCP_TOOLS.length,
    description: 'Model Context Protocol (MCP) Server for Pure DevOps & Antigravity Workflow Canvas'
  });
}
