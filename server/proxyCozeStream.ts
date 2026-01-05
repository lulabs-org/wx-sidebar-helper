import type { IncomingMessage, ServerResponse } from 'http';

import { CozeAPI, COZE_CN_BASE_URL, RoleType, type StreamChatReq } from '@coze/api';

import { hasJwtConfig, requestCozeAccessToken } from './createJwtToken';

export interface CozeChatProxyPayload {
  question: string;
  options?: Partial<StreamChatReq>;
}

export class CozeProxyError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'CozeProxyError';
    this.statusCode = statusCode;
  }
}

const readBody = async (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer | string) => {
      data += typeof chunk === 'string' ? chunk : chunk.toString();
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

export const parseProxyPayload = async (req: IncomingMessage): Promise<CozeChatProxyPayload> => {
  const raw = await readBody(req);
  if (!raw) return {} as CozeChatProxyPayload;
  try {
    return JSON.parse(raw) as CozeChatProxyPayload;
  } catch {
    throw new CozeProxyError('Invalid JSON body', 400);
  }
};

const resolveBotId = (): string => {
  const finalBotId = process.env.VITE_COZE_BOT_ID || process.env.COZE_BOT_ID;
  if (!finalBotId) {
    throw new CozeProxyError('COZE bot id is not configured', 500);
  }
  return finalBotId;
};

const resolveUserId = (): string => {
  return process.env.VITE_COZE_USER_ID || 'web-user';
};

const resolveBaseURL = (): string => {
  return process.env.VITE_COZE_API_BASE_URL || process.env.COZE_JWT_BASE_URL || COZE_CN_BASE_URL;
};

const ensureAccessToken = async (): Promise<string> => {
  if (!hasJwtConfig()) {
    throw new CozeProxyError('JWT environment variables are not configured', 500);
  }
  const token = await requestCozeAccessToken();
  if (!token.access_token) {
    throw new CozeProxyError('Failed to resolve access token', 500);
  }
  return token.access_token;
};

export const createCozeChatStream = async (
  payload: CozeChatProxyPayload,
): Promise<AsyncIterable<any>> => {
  const question = typeof payload?.question === 'string' ? payload.question.trim() : '';
  if (!question) {
    throw new CozeProxyError('Question is required', 400);
  }

  const accessToken = await ensureAccessToken();
  const botId = resolveBotId();
  const userId = resolveUserId();
  const baseURL = resolveBaseURL();

  const client = new CozeAPI({
    token: accessToken,
    baseURL,
  });

  const { bot_id: _omitBot, user_id: _omitUser, ...restOptions } = payload?.options || {};

  const requestPayload: StreamChatReq = {
    bot_id: botId,
    user_id: userId,
    additional_messages: [
      {
        role: RoleType.User,
        content: question,
        content_type: 'text',
        type: 'question',
      },
    ],
    ...restOptions,
  };

  return client.chat.stream(requestPayload);
};

export const streamAsNdjson = async (
  stream: AsyncIterable<any>,
  res: ServerResponse,
): Promise<void> => {
  if (!res.headersSent) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Transfer-Encoding', 'chunked');
  }

  for await (const event of stream) {
    if (res.writableEnded || res.destroyed) break;
    res.write(`${JSON.stringify(event)}\n`);
    const maybeFlush = (res as ServerResponse & { flush?: () => void }).flush;
    if (typeof maybeFlush === 'function') {
      maybeFlush.call(res);
    }
  }

  if (!res.writableEnded) {
    res.end();
  }
};
