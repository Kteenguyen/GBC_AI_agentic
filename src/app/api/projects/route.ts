import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const WORK_DIR = 'C:\\Users\\ADMIN\\OneDrive\\Documents\\Work';

export interface LocalProjectInfo {
  id: string;
  name: string;
  path: string;
  isGitRepo: boolean;
  branch: string;
  remoteUrl: string;
  repoName: string;
  gitUserName: string;
  gitUserEmail: string;
  lastCommitHash: string;
  lastCommitMsg: string;
  lastCommitAuthor: string;
  lastCommitTime: string;
  hasUncommittedChanges: boolean;
  uncommittedCount: number;
}

export async function GET() {
  try {
    const projects: LocalProjectInfo[] = [];

    if (!fs.existsSync(WORK_DIR)) {
      return NextResponse.json({ projects: [], error: 'Work directory not found' });
    }

    const entries = fs.readdirSync(WORK_DIR, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projPath = path.join(WORK_DIR, entry.name);
        const gitPath = path.join(projPath, '.git');
        const isGit = fs.existsSync(gitPath);

        let branch = 'main';
        let remoteUrl = 'Chưa cấu hình';
        let repoName = 'Chưa liên kết';
        let gitUserName = 'Chưa cấu hình';
        let gitUserEmail = 'Chưa cấu hình';
        let lastCommitHash = 'HEAD';
        let lastCommitMsg = 'Chưa có commit';
        let lastCommitAuthor = 'Chưa cấu hình';
        let lastCommitTime = 'Chưa có dữ liệu';
        let hasUncommittedChanges = false;
        let uncommittedCount = 0;

        if (isGit) {
          try {
            // 1. Current Branch
            try {
              branch = execSync('git branch --show-current', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'main';
            } catch (e) {
              branch = 'main';
            }

            // 2. Remote Origin URL
            try {
              const remoteOut = execSync('git config --get remote.origin.url', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim();
              if (remoteOut) {
                remoteUrl = remoteOut;
                // Extract owner/repo from https or ssh
                const cleanUrl = remoteOut.replace(/\.git$/, '');
                const urlParts = cleanUrl.split('/');
                if (urlParts.length >= 2) {
                  repoName = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
                } else {
                  repoName = remoteOut;
                }
              }
            } catch (e) {
              remoteUrl = 'Chưa cấu hình';
              repoName = 'Chưa liên kết';
            }

            // 3. User Name & Email
            try {
              const nameOut = execSync('git config user.name', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim();
              if (nameOut) gitUserName = nameOut;
            } catch (e) {
              gitUserName = 'Chưa cấu hình';
            }

            try {
              const emailOut = execSync('git config user.email', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim();
              if (emailOut) gitUserEmail = emailOut;
            } catch (e) {
              gitUserEmail = 'Chưa cấu hình';
            }

            // 4. Last Commit
            try {
              const logOut = execSync('git log -1 --pretty=format:"%h||%s||%an||%cr"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim();
              if (logOut) {
                const parts = logOut.split('||');
                lastCommitHash = parts[0] || 'HEAD';
                lastCommitMsg = parts[1] || 'Commit';
                lastCommitAuthor = parts[2] || gitUserName;
                lastCommitTime = parts[3] || 'Vừa xong';
              }
            } catch (e) {
              lastCommitHash = 'HEAD';
              lastCommitMsg = 'Chưa có commit';
            }

            // 5. Uncommitted Status
            try {
              const statusOut = execSync('git status --porcelain', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim();
              if (statusOut) {
                const lines = statusOut.split('\n').filter(l => l.trim().length > 0);
                hasUncommittedChanges = lines.length > 0;
                uncommittedCount = lines.length;
              }
            } catch (e) {
              hasUncommittedChanges = false;
              uncommittedCount = 0;
            }
          } catch (e) {
            // Non-critical git read fallback
          }
        }

        projects.push({
          id: entry.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: entry.name,
          path: projPath,
          isGitRepo: isGit,
          branch,
          remoteUrl,
          repoName,
          gitUserName,
          gitUserEmail,
          lastCommitHash,
          lastCommitMsg,
          lastCommitAuthor,
          lastCommitTime,
          hasUncommittedChanges,
          uncommittedCount
        });
      }
    }

    // Sort active Workflow first, then others alphabetically
    projects.sort((a, b) => {
      if (a.name === 'Workflow') return -1;
      if (b.name === 'Workflow') return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({
      success: true,
      total: projects.length,
      activeWorkspace: 'Workflow',
      projects
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
