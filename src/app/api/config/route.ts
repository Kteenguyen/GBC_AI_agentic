import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'workflow.config.json');

export async function GET() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return NextResponse.json({ success: false, error: 'Config file not found' }, { status: 404 });
    }
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(raw);

    // Auto-detect OS platform and adjust workspace root if running on macOS or Linux
    const isDarwin = process.platform === 'darwin';
    const isLinux = process.platform === 'linux';
    if ((isDarwin || isLinux) && config.workspace) {
      config.workspace.platform = isDarwin ? 'macos' : 'linux';
      if (config.workspace.rootDir?.startsWith('C:\\') || config.workspace.rootDir?.startsWith('C:/')) {
        config.workspace.rootDir = process.env.WORKFLOW_ROOT || process.cwd();
      }
    }

    return NextResponse.json({ 
      success: true, 
      config, 
      filePath: CONFIG_FILE, 
      platform: process.platform 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { config } = body;

    if (!config) {
      return NextResponse.json({ success: false, error: 'Missing config payload' }, { status: 400 });
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Đã lưu cấu hình hạ tầng vào workflow.config.json thành công!',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
