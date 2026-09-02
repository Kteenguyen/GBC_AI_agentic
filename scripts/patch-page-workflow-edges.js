const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'page.tsx');
let fileContent = fs.readFileSync(filePath, 'utf8');

// 1. Add imports if not present
if (!fileContent.includes('WorkflowConnectionCanvas')) {
  const importAnchor = "import { WorkflowActorSidebar } from '@/components/WorkflowActorSidebar';";
  const newImports = `${importAnchor}
import WorkflowConnectionCanvas from '@/components/WorkflowConnectionCanvas';
import WorkflowNodePortHandle from '@/components/WorkflowNodePortHandle';
import { WorkflowEdge, WorkflowPort, Point } from '@/types/workflowGraph';
import { DEFAULT_INITIAL_EDGES } from '@/lib/workflowGraphEngine';`;
  fileContent = fileContent.replace(importAnchor, newImports);
}

// 2. Add useCallback to React import if needed
if (!fileContent.includes('useCallback')) {
  fileContent = fileContent.replace("import React, { useState, useEffect, useRef }", "import React, { useState, useEffect, useRef, useCallback }");
}

// 3. Add graph states and handlers inside WorkflowPage
const stateAnchor = "  const [isActorSidebarOpen, setIsActorSidebarOpen] = useState<boolean>(true);";
const newGraphStates = `${stateAnchor}

  // Interactive Connection Graph & Bezier Edges State
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [workflowEdges, setWorkflowEdges] = useState<WorkflowEdge[]>(DEFAULT_INITIAL_EDGES);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const [activeConnectingPort, setActiveConnectingPort] = useState<{ nodeId: string; port: WorkflowPort; startPoint: Point } | null>(null);
  const [cursorPos, setCursorPos] = useState<Point | null>(null);

  const updateNodePositions = useCallback(() => {
    if (!canvasContainerRef.current) return;
    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    const nodeElements = canvasContainerRef.current.querySelectorAll('[data-workflow-node-id]');
    
    const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};
    nodeElements.forEach((el) => {
      const nodeId = el.getAttribute('data-workflow-node-id');
      if (nodeId) {
        const rect = el.getBoundingClientRect();
        positions[nodeId] = {
          x: rect.left - containerRect.left + (canvasContainerRef.current ? canvasContainerRef.current.scrollLeft : 0),
          y: rect.top - containerRect.top + (canvasContainerRef.current ? canvasContainerRef.current.scrollTop : 0),
          width: rect.width,
          height: rect.height
        };
      }
    });
    setNodePositions(positions);
  }, []);

  useEffect(() => {
    updateNodePositions();
    const timer = setTimeout(updateNodePositions, 150);
    const handleResize = () => updateNodePositions();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [nodes, activePipelineToolIds, isActorSidebarOpen, updateNodePositions]);

  const handleStartConnect = (nodeId: string, port: WorkflowPort, e: React.MouseEvent) => {
    if (!canvasContainerRef.current) return;
    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    const startPoint = {
      x: e.clientX - containerRect.left + canvasContainerRef.current.scrollLeft,
      y: e.clientY - containerRect.top + canvasContainerRef.current.scrollTop
    };
    setActiveConnectingPort({ nodeId, port, startPoint });
    setCursorPos(startPoint);
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!activeConnectingPort || !canvasContainerRef.current) return;
    const containerRect = canvasContainerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - containerRect.left + canvasContainerRef.current.scrollLeft,
      y: e.clientY - containerRect.top + canvasContainerRef.current.scrollTop
    });
  };

  const handleFinishConnect = async (targetNodeId: string, targetPort: WorkflowPort) => {
    if (!activeConnectingPort) return;
    const sourceNodeId = activeConnectingPort.nodeId;
    const sourcePort = activeConnectingPort.port;

    setActiveConnectingPort(null);
    setCursorPos(null);

    if (sourceNodeId === targetNodeId) {
      alert('Không thể tự kết nối Node vào chính nó (Self-loop rejected)!');
      return;
    }

    try {
      const res = await fetch('/api/workflow/edges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceNodeId,
          sourcePort,
          targetNodeId,
          targetPort,
          label: 'pipeline link'
        })
      });
      const data = await res.json();
      if (data.success && data.edge) {
        setWorkflowEdges(prev => [...prev, data.edge]);
      } else {
        alert(data.error || 'Lỗi khi tạo đường nối mũi tên');
      }
    } catch (err) {
      console.error('Lỗi API tạo đường nối:', err);
    }
  };

  const handleRemoveEdge = async (edgeId: string) => {
    try {
      const res = await fetch(\`/api/workflow/edges?id=\${edgeId}\`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setWorkflowEdges(prev => prev.filter(e => e.id !== edgeId));
      }
    } catch (err) {
      console.error('Lỗi API gỡ đường nối:', err);
    }
  };

  const handleResetWorkflowEdges = async () => {
    try {
      const res = await fetch('/api/workflow/graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESET' })
      });
      const data = await res.json();
      if (data.success && data.edges) {
        setWorkflowEdges(data.edges);
      }
    } catch (err) {
      console.error('Lỗi khôi phục đường nối:', err);
    }
  };`;

if (!fileContent.includes('workflowEdges')) {
  fileContent = fileContent.replace(stateAnchor, newGraphStates);
}

// 4. Update the Canvas Container Ref and overlay
const canvasAnchor = `<div className={\`hidden md:block w-full rounded-3xl p-6 sm:p-8 shadow-xl overflow-x-auto relative border transition \${
                  isLight
                    ? 'bg-white border-[#E2DDD5]'
                    : 'bg-[#090E1A] border-[#1E293B]'
                }\`}>`;

const newCanvasContainer = `<div 
                  ref={canvasContainerRef}
                  onMouseMove={handleMouseMoveCanvas}
                  onMouseUp={() => {
                    if (activeConnectingPort) {
                      setActiveConnectingPort(null);
                      setCursorPos(null);
                    }
                  }}
                  className={\`hidden md:block w-full rounded-3xl p-6 sm:p-8 shadow-xl overflow-x-auto relative border transition \${
                  isLight
                    ? 'bg-white border-[#E2DDD5]'
                    : 'bg-[#090E1A] border-[#1E293B]'
                }\`}>
                  {/* Interactive Dynamic Bezier SVG Connection Canvas */}
                  <WorkflowConnectionCanvas
                    containerRef={canvasContainerRef}
                    edges={workflowEdges}
                    nodePositions={nodePositions}
                    activeConnectingPort={activeConnectingPort}
                    cursorPos={cursorPos}
                    onRemoveEdge={handleRemoveEdge}
                    isRunningPipeline={isRunningAll}
                    theme={theme}
                  />`;

if (fileContent.includes(canvasAnchor)) {
  fileContent = fileContent.replace(canvasAnchor, newCanvasContainer);
}

// 5. Add data-workflow-node-id and WorkflowNodePortHandle to Developer Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-dev')}\n                    className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 \${getNodeBorder('node-dev', nodes.find(n => n.id === 'node-dev')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-dev"\n                    onClick={() => setSelectedNodeId('node-dev')}\n                    className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 \${getNodeBorder('node-dev', nodes.find(n => n.id === 'node-dev')?.status || 'STANDBY')}\`}`
);

// Inject Handle for node-dev
if (!fileContent.includes('nodeId="node-dev"')) {
  fileContent = fileContent.replace(
    `<span className={\`text-[10px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>push code</span>\n                  </div>`,
    `<span className={\`text-[10px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>push code</span>\n                    <WorkflowNodePortHandle nodeId="node-dev" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                  </div>`
  );
}

// 6. GitHub Source Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-github-src')}\n                    className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 \${getNodeBorder('node-github-src', nodes.find(n => n.id === 'node-github-src')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-github-src"\n                    onClick={() => setSelectedNodeId('node-github-src')}\n                    className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 \${getNodeBorder('node-github-src', nodes.find(n => n.id === 'node-github-src')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-github-src"')) {
  fileContent = fileContent.replace(
    `<span className={\`text-[10px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>source repo</span>\n                  </div>`,
    `<span className={\`text-[10px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>source repo</span>\n                    <WorkflowNodePortHandle nodeId="node-github-src" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                  </div>`
  );
}

// 7. Jenkins CI Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-jenkins-ci')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-jenkins-ci', nodes.find(n => n.id === 'node-jenkins-ci')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-jenkins-ci"\n                      onClick={() => setSelectedNodeId('node-jenkins-ci')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-jenkins-ci', nodes.find(n => n.id === 'node-jenkins-ci')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-jenkins-ci"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-jenkins-ci')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-jenkins-ci')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-jenkins-ci" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 8. OWASP Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-owasp')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-owasp', nodes.find(n => n.id === 'node-owasp')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-owasp"\n                      onClick={() => setSelectedNodeId('node-owasp')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-owasp', nodes.find(n => n.id === 'node-owasp')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-owasp"')) {
  fileContent = fileContent.replace(
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>cổng 1</span>\n                    </div>`,
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>cổng 1</span>\n                      <WorkflowNodePortHandle nodeId="node-owasp" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 9. SonarQube Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-sonarqube')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-sonarqube', nodes.find(n => n.id === 'node-sonarqube')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-sonarqube"\n                      onClick={() => setSelectedNodeId('node-sonarqube')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-sonarqube', nodes.find(n => n.id === 'node-sonarqube')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-sonarqube"')) {
  fileContent = fileContent.replace(
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>cổng 2</span>\n                    </div>`,
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>cổng 2</span>\n                      <WorkflowNodePortHandle nodeId="node-sonarqube" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 10. Docker Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-docker')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-docker', nodes.find(n => n.id === 'node-docker')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-docker"\n                      onClick={() => setSelectedNodeId('node-docker')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-docker', nodes.find(n => n.id === 'node-docker')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-docker"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-docker')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-docker')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-docker" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 11. Trivy Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-trivy')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-trivy', nodes.find(n => n.id === 'node-trivy')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-trivy"\n                      onClick={() => setSelectedNodeId('node-trivy')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-trivy', nodes.find(n => n.id === 'node-trivy')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-trivy"')) {
  fileContent = fileContent.replace(
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>cổng 3</span>\n                    </div>`,
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>cổng 3</span>\n                      <WorkflowNodePortHandle nodeId="node-trivy" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 12. Jenkins CD Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-jenkins-cd')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-jenkins-cd', nodes.find(n => n.id === 'node-jenkins-cd')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-jenkins-cd"\n                      onClick={() => setSelectedNodeId('node-jenkins-cd')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-jenkins-cd', nodes.find(n => n.id === 'node-jenkins-cd')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-jenkins-cd"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-jenkins-cd')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-jenkins-cd')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-jenkins-cd" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 13. GitHub Config Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-github-config')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-github-config', nodes.find(n => n.id === 'node-github-config')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-github-config"\n                      onClick={() => setSelectedNodeId('node-github-config')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-github-config', nodes.find(n => n.id === 'node-github-config')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-github-config"')) {
  fileContent = fileContent.replace(
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>config repo</span>\n                    </div>`,
    `<span className={\`text-[9.5px] font-mono \${isLight ? 'text-slate-500' : 'text-slate-400'}\`}>config repo</span>\n                      <WorkflowNodePortHandle nodeId="node-github-config" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 14. ArgoCD Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-argocd')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-argocd', nodes.find(n => n.id === 'node-argocd')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-argocd"\n                      onClick={() => setSelectedNodeId('node-argocd')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-argocd', nodes.find(n => n.id === 'node-argocd')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-argocd"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-argocd')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-argocd')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-argocd" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 15. Kubernetes Cluster Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-k8s')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-k8s', nodes.find(n => n.id === 'node-k8s')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-k8s"\n                      onClick={() => setSelectedNodeId('node-k8s')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-k8s', nodes.find(n => n.id === 'node-k8s')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-k8s"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-k8s')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-k8s')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-k8s" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 16. Prometheus Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-prom')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-prom', nodes.find(n => n.id === 'node-prom')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-prom"\n                      onClick={() => setSelectedNodeId('node-prom')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-prom', nodes.find(n => n.id === 'node-prom')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-prom"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-prom')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-prom')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-prom" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 17. Grafana Dashboard Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-grafana')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-grafana', nodes.find(n => n.id === 'node-grafana')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-grafana"\n                      onClick={() => setSelectedNodeId('node-grafana')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-grafana', nodes.find(n => n.id === 'node-grafana')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-grafana"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-grafana')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-grafana')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-grafana" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

// 18. Gmail Alert Node
fileContent = fileContent.replace(
  `onClick={() => setSelectedNodeId('node-gmail')}\n                      className={\`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-gmail', nodes.find(n => n.id === 'node-gmail')?.status || 'STANDBY')}\`}`,
  `data-workflow-node-id="node-gmail"\n                      onClick={() => setSelectedNodeId('node-gmail')}\n                      className={\`group relative p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all \${getNodeBorder('node-gmail', nodes.find(n => n.id === 'node-gmail')?.status || 'STANDBY')}\`}`
);

if (!fileContent.includes('nodeId="node-gmail"')) {
  fileContent = fileContent.replace(
    `{nodes.find(n => n.id === 'node-gmail')?.statusText}\n                      </span>\n                    </div>`,
    `{nodes.find(n => n.id === 'node-gmail')?.statusText}\n                      </span>\n                      <WorkflowNodePortHandle nodeId="node-gmail" onStartConnect={handleStartConnect} onFinishConnect={handleFinishConnect} isConnecting={!!activeConnectingPort} theme={theme} />\n                    </div>`
  );
}

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Successfully patched page.tsx with interactive dynamic arrow engine!');
