const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let workDir = process.env.WORK_ROOT;
if (!workDir || !fs.existsSync(workDir)) {
  const parent = path.resolve(process.cwd(), '..');
  if (fs.existsSync(parent) && path.basename(parent).toLowerCase() === 'work') {
    workDir = parent;
  } else if (fs.existsSync('C:\\Users\\ADMIN\\OneDrive\\Documents\\Work')) {
    workDir = 'C:\\Users\\ADMIN\\OneDrive\\Documents\\Work';
  } else {
    workDir = process.cwd();
  }
}

console.log('Work Dir:', workDir);

const IGNORED_NAMES = new Set([
  '.git', '.agents', '.claude', '.gemini', '.github', '.vscode', '.idea',
  'node_modules', 'dist', 'build', '.next', 'out', 'bin', 'Data', 'CV', 'VAT', 'Báo giá', 'contract'
]);

const entries = fs.readdirSync(workDir, { withFileTypes: true });
const projects = [];

for (const entry of entries) {
  if (entry.isDirectory()) {
    if (entry.name.startsWith('.') || IGNORED_NAMES.has(entry.name)) continue;
    
    const projPath = path.join(workDir, entry.name);
    const gitPath = path.join(projPath, '.git');
    const isGit = fs.existsSync(gitPath);
    
    let branch = 'main';
    let remoteUrl = 'Chưa cấu hình';
    let repoName = 'Chưa liên kết';
    let gitUserName = 'Kteenguyen';
    let gitUserEmail = 'nguyenkhoatai2003@gmail.com';
    let lastCommitHash = 'HEAD';
    let lastCommitMsg = 'Chưa có commit';
    let lastCommitAuthor = 'Kteenguyen';
    let lastCommitTime = 'Chưa có dữ liệu';

    if (isGit) {
      try {
        branch = execSync('git branch --show-current', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'main';
      } catch (e) {}
      try {
        remoteUrl = execSync('git config --get remote.origin.url', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Chưa cấu hình';
        if (remoteUrl && remoteUrl !== 'Chưa cấu hình') {
          const match = remoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/i);
          if (match) repoName = match[1];
        }
      } catch (e) {}
      try {
        gitUserName = execSync('git config user.name', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Kteenguyen';
      } catch (e) {}
      try {
        gitUserEmail = execSync('git config user.email', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'nguyenkhoatai2003@gmail.com';
      } catch (e) {}
      try {
        lastCommitHash = execSync('git log -1 --format="%h"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'HEAD';
        lastCommitMsg = execSync('git log -1 --format="%s"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Commit gần nhất';
        lastCommitAuthor = execSync('git log -1 --format="%an"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || gitUserName;
        lastCommitTime = execSync('git log -1 --format="%cr"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Gần đây';
      } catch (e) {}
    }

    projects.push({
      name: entry.name,
      isGit,
      branch,
      repoName,
      lastCommitHash,
      lastCommitMsg
    });
  }
}

console.log('Real Projects Found (' + projects.length + '):', JSON.stringify(projects, null, 2));
