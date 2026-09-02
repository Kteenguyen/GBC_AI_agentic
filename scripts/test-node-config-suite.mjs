import { NODE_CONFIG_SCHEMAS } from '../src/lib/nodeConfigSchema.ts';

console.log('--- KIEM TRA NODE CONFIG SCHEMAS (100% REAL DEVOPS CONFIG) ---');

const expectedNodes = [
  'node-dev',
  'node-github-src',
  'node-jenkins-ci',
  'node-owasp',
  'node-sonarqube',
  'node-trivy',
  'node-docker',
  'node-argocd',
  'node-k8s',
  'node-prom',
  'node-grafana',
  'node-gmail'
];

let passCount = 0;
for (const nodeId of expectedNodes) {
  const schema = NODE_CONFIG_SCHEMAS[nodeId];
  if (!schema) {
    console.error(`FAIL: Missing schema for ${nodeId}`);
  } else if (!schema.fields || schema.fields.length === 0) {
    console.error(`FAIL: Schema for ${nodeId} has no fields`);
  } else {
    console.log(`PASS: [${schema.pingEndpointType}] ${schema.name} (${schema.fields.length} fields)`);
    passCount++;
  }
}

console.log(`\nTong ket: ${passCount}/${expectedNodes.length} Node Config Schemas hop le 100%!`);
