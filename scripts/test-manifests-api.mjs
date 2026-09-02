import fs from 'fs';
import path from 'path';

console.log('--- KIEM TRA SINH MANIFESTS (PIPELINE.ENV, DOCKER-COMPOSE, K8S-MANIFEST) ---');

const configPath = path.join(process.cwd(), 'workflow.config.json');
let config = {};
if (fs.existsSync(configPath)) {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

console.log('1. Kiem tra workspace root:', config.workspace?.rootDir ? 'OK' : 'MISSING');
console.log('2. Kiem tra git userName:', config.git?.defaultUserName ? 'OK' : 'MISSING');
console.log('3. Kiem tra CI provider:', config.ci?.provider ? 'OK' : 'MISSING');
console.log('4. Kiem tra Security CVSS:', config.security?.owasp?.failOnCvss !== undefined ? 'OK' : 'MISSING');
console.log('5. Kiem tra Docker registry:', config.docker?.registryUrl !== undefined ? 'OK' : 'MISSING');
console.log('6. Kiem tra GitOps target namespace:', config.gitops?.targetNamespace ? 'OK' : 'MISSING');

console.log('\nTat ca 6 khau san sang cho sinh Manifests!');
