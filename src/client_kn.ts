// 浏览器封装：导出 streamQuestion(question)，供页面调用
import { ChatEventType, type StreamChatReq } from '@coze/api';
import { cozeChatEndpoint } from './client';

const CHAT_PROXY_URL = cozeChatEndpoint || '/api/coze-chat';

const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    if (!text) {
      return `${response.status} ${response.statusText}`;
    }
    try {
      const data = JSON.parse(text) as { error?: unknown };
      if (data && typeof data.error === 'string' && data.error.trim()) {
        return data.error;
      }
    } catch {
      // 非 JSON 文本，直接返回
      return text;
    }
    return text;
  } catch {
    return `${response.status} ${response.statusText}`;
  }
};

const parseNdjson = async function* (body: ReadableStream<Uint8Array>): AsyncGenerator<any, void, unknown> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex = buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (line) {
        try {
          yield JSON.parse(line);
        } catch {
          // 忽略不合法的 JSON 片段
        }
      }
      newlineIndex = buffer.indexOf('\n');
    }
  }

  const trailing = buffer.trim();
  if (trailing) {
    try {
      yield JSON.parse(trailing);
    } catch {
      // 忽略结尾不完整的 JSON
    }
  }
};

const createProxyStream = async (
  question: string,
  options: Partial<StreamChatReq>,
): Promise<AsyncIterable<any>> => {
  const payload: Record<string, unknown> = { question };
  if (options && Object.keys(options).length > 0) {
    payload.options = options;
  }

  const response = await fetch(CHAT_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const detail = await readErrorMessage(response);
    throw new Error(`Failed to proxy Coze chat: ${detail}`);
  }

  return parseNdjson(response.body);
};

export async function streamQuestion(
  question: string,
  options: Partial<StreamChatReq> = {}
): Promise<AsyncGenerator<string, void, unknown>> {
  const q = typeof question === 'string' ? question.trim() : '';
  if (!q) throw new Error('Question is required');
  const stream: AsyncIterable<any> = await createProxyStream(q, options);

  async function sendCompletedLog(text: string): Promise<void> {
    // 仅在开发环境上报日志，避免预览/生产因无端点报错
    if (!import.meta.env.DEV) return;
    try {
      // 优先使用 sendBeacon，避免浏览器因页面更新或空响应而取消请求
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify({ text })], { type: 'application/json' });
        navigator.sendBeacon('/__coze_log', blob);
        return;
      }
      // 回退到常规 fetch（不使用 keepalive）
      await fetch('/__coze_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
    } catch {
      // 忽略网络/日志错误
      void 0;
    }
  }

  // 仅传递“消息完成”中的纯文本答案；忽略知识回溯等非文本内容
  async function* onlyCompletedText(): AsyncGenerator<string, void, unknown> {
    for await (const evt of stream) {
      if (evt?.event !== ChatEventType.CONVERSATION_MESSAGE_COMPLETED) continue;
      const type = evt?.data?.content_type;
      const raw = evt?.data?.content;
      let text = '';

      const rawStr = typeof raw === 'string' ? raw.trim() : '';
      // 优先识别 JSON：仅当 msg_type === 'answer' 时采纳
      if (rawStr && rawStr.startsWith('{')) {
        try {
          const obj = JSON.parse(rawStr);
          if (obj?.msg_type === 'answer' && typeof obj?.content === 'string') {
            text = obj.content;
          }
        } catch {
          // ignore malformed JSON; ensure block is non-empty for lint
          void 0;
        }
      } else if (type === 'text' && rawStr) {
        // 非 JSON 的纯文本内容直接使用
        text = rawStr;
      }

      if (text && text.trim()) {
        // 将完成消息发送到终端日志端点
        sendCompletedLog(text);
        yield text;
      }
    }
  }
  return onlyCompletedText();
}
