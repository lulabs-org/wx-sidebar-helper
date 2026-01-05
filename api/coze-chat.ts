import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  CozeProxyError,
  createCozeChatStream,
  parseProxyPayload,
  streamAsNdjson,
  type CozeChatProxyPayload,
} from '../server/proxyCozeStream';

const getPayload = async (req: VercelRequest): Promise<CozeChatProxyPayload> => {
  const body = req.body;
  if (!body) {
    return parseProxyPayload(req);
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      throw new CozeProxyError('Invalid JSON body', 400);
    }
  }
  return body;
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const payload = await getPayload(req);
    const stream = await createCozeChatStream(payload);
    await streamAsNdjson(stream, res);
  } catch (error) {
    const status = error instanceof CozeProxyError ? error.statusCode : 500;
    const message = (error as Error).message || 'Unexpected error';
    if (res.headersSent) {
      res.end();
      return;
    }
    res.status(status).json({ error: message });
  }
}
