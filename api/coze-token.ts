import type { VercelRequest, VercelResponse } from '@vercel/node';

import { hasJwtConfig, requestCozeAccessToken } from '../server/createJwtToken';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  if (!hasJwtConfig()) {
    res.status(500).json({ error: 'JWT environment variables are not configured' });
    return;
  }

  try {
    const token = await requestCozeAccessToken();
    res.status(200).json(token);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch Coze JWT token', error);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
}
