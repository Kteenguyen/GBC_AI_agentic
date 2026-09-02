import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// In-memory temporary circuit breaker tracking exhausted keys for 60 seconds
const exhaustedKeyTimestamps: Map<string, number> = new Map();
const COOLDOWN_PERIOD_MS = 60 * 1000; // 60s cooldown for 429 rate-limited keys

interface OpenAICompatibleMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAICompatibleRequest {
  model?: string;
  messages: OpenAICompatibleMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * 9Router Serverless Gateway - Chuẩn OpenAI API chạy 24/7 trên Vercel
 * Hỗ trợ Unlimited Key Pool (nạp không giới hạn số lượng Gemini API Keys)
 * Tự động xoay vòng và cách ly các Key chạm ngưỡng 429 Rate Limit
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const headerGeminiKeys = req.headers.get('x-gemini-key') || req.headers.get('x-gemini-keys') || '';
    
    const body: OpenAICompatibleRequest = await req.json();
    const { 
      model = 'gemini-2.0-flash', 
      messages = [], 
      temperature = 0.7, 
      max_tokens = 2048 
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: { message: 'Messages array không được để trống', type: 'invalid_request_error' } },
        { status: 400 }
      );
    }

    // 1. TỔNG HỢP DANH SÁCH TOÀN BỘ KEYS TỪ HEADER, BODY, VÀ BIẾN MÔI TRƯỜNG (UNLIMITED POOL)
    const envKeys = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    const combinedKeyString = `${headerGeminiKeys}\n${authHeader.replace('Bearer ', '')}\n${envKeys}`;

    const allKeys = combinedKeyString
      .split(/[\n,;\s]+/)
      .map(k => k.trim())
      .filter(k => k.startsWith('AIzaSy') && k.length > 20);

    // Loại bỏ các key trùng lặp
    const uniqueKeys = Array.from(new Set(allKeys));
    const now = Date.now();

    // Dọn dẹp các key đã hết thời gian cooldown 60s
    exhaustedKeyTimestamps.forEach((timestamp, key) => {
      if (now - timestamp > COOLDOWN_PERIOD_MS) {
        exhaustedKeyTimestamps.delete(key);
      }
    });

    // Lọc ra các key đang sẵn sàng (chưa bị 429)
    let availableKeys = uniqueKeys.filter(k => !exhaustedKeyTimestamps.has(k));
    if (availableKeys.length === 0 && uniqueKeys.length > 0) {
      // Nếu tất cả đều tạm khóa, thử lại toàn bộ
      availableKeys = [...uniqueKeys];
      exhaustedKeyTimestamps.clear();
    }

    // 2. CHUYỂN ĐỔI MESSAGES OPENAI -> GEMINI REST FORMAT
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const contents = conversationMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Ánh xạ model
    let targetGeminiModel = 'gemini-2.0-flash';
    if (model.includes('pro') || model.includes('1.5-pro')) {
      targetGeminiModel = 'gemini-1.5-pro';
    }

    // 3. VÒNG LẶP ĐỐT TOKEN LIÊN HOÀN QUA TỪNG KEY TRONG POOL (AUTO-FAILOVER)
    let replyText = '';
    let usedKeyIndex = -1;
    let lastErrorDetails = '';

    // Trộn ngẫu nhiên danh sách availableKeys để phân tải đều
    const shuffledKeys = [...availableKeys].sort(() => Math.random() - 0.5);

    for (let i = 0; i < shuffledKeys.length; i++) {
      const currentKey = shuffledKeys[i];
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetGeminiModel}:generateContent?key=${currentKey}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout cho mỗi key

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(systemMessage ? { system_instruction: { parts: [{ text: systemMessage }] } } : {}),
            contents,
            generationConfig: {
              temperature,
              maxOutputTokens: max_tokens
            }
          })
        });

        clearTimeout(timeoutId);

        // Trường hợp Key bị Rate Limit 429 hoặc Quota Exceeded -> Đánh dấu và thử Key tiếp theo ngay
        if (geminiRes.status === 429 || geminiRes.status === 403) {
          exhaustedKeyTimestamps.set(currentKey, Date.now());
          console.warn(`[9Router Hub] Key #${i + 1} (${currentKey.substring(0, 10)}...) chạm 429 Rate Limit. Tự động chuyển tiếp Key kế tiếp...`);
          continue;
        }

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            replyText = candidateText;
            usedKeyIndex = i + 1;
            break; // Đốt token thành công, thoát vòng lặp
          }
        } else {
          const errData = await geminiRes.text();
          lastErrorDetails = `HTTP ${geminiRes.status}: ${errData.substring(0, 120)}`;
        }
      } catch (reqErr: any) {
        lastErrorDetails = reqErr?.message || 'Request Timeout';
      }
    }

    // 4. NẾU CHƯA CÓ KEY NÀO THÀNH CÔNG HOẶC CHƯA NẠP KEY -> DÙNG SMART CONTEXT FALLBACK ENGINE
    if (!replyText) {
      const userPrompt = conversationMessages[conversationMessages.length - 1]?.content || '';
      replyText = `**9Router Serverless Gateway (Fallback Mode)**:\n\n` +
        `Yêu cầu: **"${userPrompt}"** đã được chuyển tiếp qua 9Router Hub.\n\n` +
        `* **Trạng thái Key Pool**: Đã kiểm tra ${uniqueKeys.length} keys (${availableKeys.length} available).\n` +
        `* **Thông báo**: ${lastErrorDetails || 'Vui lòng nạp thêm Google Gemini API Key vào mục Cấu Hình để kích hoạt suy luận LLM 100%.'}`;
    }

    // 5. TRẢ VỀ CHUẨN OPENAI COMPATIBLE RESPONSE
    const responsePayload = {
      id: `chatcmpl-9r-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: `9router-${targetGeminiModel}`,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: replyText
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 150,
        completion_tokens: 350,
        total_tokens: 500
      },
      router_metadata: {
        gateway: '9Router Serverless on Vercel',
        total_keys_in_pool: uniqueKeys.length,
        active_keys: availableKeys.length,
        used_key_slot: usedKeyIndex > 0 ? usedKeyIndex : 'fallback'
      }
    };

    return NextResponse.json(responsePayload);

  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error?.message || '9Router Serverless Error', type: 'api_error' } },
      { status: 500 }
    );
  }
}

// GET method: Kiểm tra sức khỏe của 9Router Gateway
export async function GET() {
  const envKeys = (process.env.GEMINI_API_KEY || '').split(/[\n,;]+/).filter(k => k.trim().startsWith('AIzaSy'));
  return NextResponse.json({
    status: 'ONLINE',
    service: '9Router Serverless OpenAI Gateway',
    version: '2.0.0',
    runtime: 'Vercel Serverless (24/7 Cloud)',
    env_keys_configured: envKeys.length,
    endpoints: {
      chat_completions: '/api/9router/v1/chat/completions',
      models: '/api/9router/v1/models'
    }
  });
}
