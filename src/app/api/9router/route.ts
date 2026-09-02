import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envKeys = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '')
    .split(/[\n,;]+/)
    .map(k => k.trim())
    .filter(k => k.startsWith('AIzaSy'));

  return NextResponse.json({
    status: 'ONLINE',
    gateway: '9Router Serverless Gateway Hub',
    version: '2.0.0',
    runtime: 'Vercel Serverless (24/7 Always-On)',
    total_env_keys: envKeys.length,
    openai_compatible_endpoint: '/api/9router/v1/chat/completions',
    models_supported: [
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'deepseek-r1',
      'claude-3-7-sonnet',
      'gpt-4o'
    ],
    features: [
      'Unlimited API Key Pool',
      '0ms Rate-Limit 429 Circuit Breaker',
      'Auto-Failover Token Burn Cycle',
      'Mobile-First 430px Client Support'
    ]
  });
}
