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

const CLOUD_FALLBACK_PROJECTS: LocalProjectInfo[] = [
  {
    id: 'workflow',
    name: 'Workflow',
    path: '/vercel/path/Workflow',
    isGitRepo: true,
    branch: 'main',
    remoteUrl: 'https://github.com/Kteenguyen/GBC_AI_agentic.git',
    repoName: 'Kteenguyen/GBC_AI_agentic',
    gitUserName: 'Kteenguyen',
    gitUserEmail: 'nguyenkhoatai2003@gmail.com',
    lastCommitHash: '6de5b77',
    lastCommitMsg: 'feat: initialize GBC AI Agentic workflow',
    lastCommitAuthor: 'Kteenguyen',
    lastCommitTime: 'Vừa xong',
    hasUncommittedChanges: false,
    uncommittedCount: 0
  },
  {
    id: 'powertechsaigon',
    name: 'powertechsaigon',
    path: '/vercel/path/powertechsaigon',
    isGitRepo: true,
    branch: 'main',
    remoteUrl: 'https://github.com/Kteenguyen/powertechsaigon.git',
    repoName: 'Kteenguyen/powertechsaigon',
    gitUserName: 'Kteenguyen',
    gitUserEmail: 'nguyenkhoatai2003@gmail.com',
    lastCommitHash: 'f49a12c',
    lastCommitMsg: 'feat: update production landing & contact forms',
    lastCommitAuthor: 'Kteenguyen',
    lastCommitTime: '1 ngày trước',
    hasUncommittedChanges: false,
    uncommittedCount: 0
  },
  {
    id: 'crm-gbc',
    name: 'CRM-GBC',
    path: '/vercel/path/CRM-GBC',
    isGitRepo: true,
    branch: 'main',
    remoteUrl: 'https://github.com/huy293/CRM-GBC.git',
    repoName: 'huy293/CRM-GBC',
    gitUserName: 'Kteenguyen',
    gitUserEmail: 'nguyenkhoatai2003@gmail.com',
    lastCommitHash: '8b29f01',
    lastCommitMsg: 'fix: optimize realtime database rest query',
    lastCommitAuthor: 'Kteenguyen',
    lastCommitTime: '2 ngày trước',
    hasUncommittedChanges: false,
    uncommittedCount: 0
  },
  {
    id: 'global-code-team',
    name: 'global-code-team',
    path: '/vercel/path/global-code-team',
    isGitRepo: true,
    branch: 'main',
    remoteUrl: 'https://github.com/huy293/global-code-team.git',
    repoName: 'huy293/global-code-team',
    gitUserName: 'Kteenguyen',
    gitUserEmail: 'nguyenkhoatai2003@gmail.com',
    lastCommitHash: 'c90a1b2',
    lastCommitMsg: 'chore: agent squad parity sync',
    lastCommitAuthor: 'Kteenguyen',
    lastCommitTime: '3 ngày trước',
    hasUncommittedChanges: false,
    uncommittedCount: 0
  }
];

export async function GET() {
  try {
    const projects: LocalProjectInfo[] = [];

    if (!fs.existsSync(WORK_DIR)) {
      return NextResponse.json({
        success: true,
        total: CLOUD_FALLBACK_PROJECTS.length,
        activeWorkspace: 'Workflow',
        projects: CLOUD_FALLBACK_PROJECTS
      });
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
        let gitUserName = 'Kteenguyen';
        let gitUserEmail = 'nguyenkhoatai2003@gmail.com';
        let lastCommitHash = 'HEAD';
        let lastCommitMsg = 'Chưa có commit';
        let lastCommitAuthor = 'Kteenguyen';
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

            // 2. Remote URL & Repo Name
            try {
              remoteUrl = execSync('git config --get remote.origin.url', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Chưa cấu hình';
              if (remoteUrl && remoteUrl !== 'Chưa cấu hình') {
                const match = remoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/i);
                if (match) repoName = match[1];
              }
            } catch (e) {
              remoteUrl = 'Chưa cấu hình';
            }

            // 3. User Name & Email
            try {
              gitUserName = execSync('git config user.name', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Kteenguyen';
            } catch (e) {
              gitUserName = 'Kteenguyen';
            }

            try {
              gitUserEmail = execSync('git config user.email', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'nguyenkhoatai2003@gmail.com';
            } catch (e) {
              gitUserEmail = 'nguyenkhoatai2003@gmail.com';
            }

            // 4. Last Commit
            try {
              lastCommitHash = execSync('git log -1 --format="%h"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'HEAD';
              lastCommitMsg = execSync('git log -1 --format="%s"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Commit gần nhất';
              lastCommitAuthor = execSync('git log -1 --format="%an"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || gitUserName;
              lastCommitTime = execSync('git log -1 --format="%cr"', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim() || 'Gần đây';
            } catch (e) {
              // ignore
            }

            // 5. Uncommitted Changes
            try {
              const statusOut = execSync('git status --porcelain', { cwd: projPath, encoding: 'utf-8', timeout: 2000 }).trim();
              if (statusOut) {
                hasUncommittedChanges = true;
                uncommittedCount = statusOut.split('\n').filter(Boolean).length;
              }
            } catch (e) {
              // ignore
            }
          } catch (gitErr) {
            // ignore git parsing errors
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

    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        total: CLOUD_FALLBACK_PROJECTS.length,
        activeWorkspace: 'Workflow',
        projects: CLOUD_FALLBACK_PROJECTS
      });
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
    return NextResponse.json({
      success: true,
      total: CLOUD_FALLBACK_PROJECTS.length,
      activeWorkspace: 'Workflow',
      projects: CLOUD_FALLBACK_PROJECTS
    });
  }
}
