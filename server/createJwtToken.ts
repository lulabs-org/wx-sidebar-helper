import { COZE_CN_BASE_URL, getJWTToken } from '@coze/api';
import type { JWTToken, JWTScope } from '@coze/api';

export interface JwtTokenConfig {
  appId: string;
  keyId: string;
  privateKey: string;
  aud: string;
  baseURL: string;
  durationSeconds?: number;
  scope?: JWTScope;
  sessionName?: string;
  accountId?: string;
}

const REQUIRED_ENV_KEYS = ['COZE_JWT_APP_ID', 'COZE_JWT_KEY_ID', 'COZE_JWT_PRIVATE_KEY'] as const;

const normalizePrivateKey = (key: string): string => key.replace(/\\n/g, '\n').trim();

const parseScope = (scope?: string): JWTScope | undefined => {
  if (!scope) return undefined;
  try {
    return JSON.parse(scope) as JWTScope;
  } catch (error) {
    throw new Error('Invalid COZE_JWT_SCOPE, must be valid JSON string');
  }
};

const missingEnvMessage = (env: Record<string, string | undefined>): string => {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !env[key]);
  return `Missing required JWT env variables: ${missing.join(', ')}`;
};

export const hasJwtConfig = (env: Record<string, string | undefined> = process.env): boolean =>
  REQUIRED_ENV_KEYS.every((key) => Boolean(env[key]));

export const resolveJwtConfig = (env: Record<string, string | undefined> = process.env): JwtTokenConfig => {
  if (!hasJwtConfig(env)) {
    throw new Error(missingEnvMessage(env));
  }

  const baseURL = env.COZE_JWT_BASE_URL || env.VITE_COZE_API_BASE_URL || COZE_CN_BASE_URL;
  const aud =
    env.COZE_JWT_AUD ||
    (() => {
      try {
        return new URL(baseURL).host;
      } catch {
        return 'api.coze.cn';
      }
    })();

  const duration = env.COZE_JWT_DURATION ? Number.parseInt(env.COZE_JWT_DURATION, 10) : undefined;

  return {
    appId: env.COZE_JWT_APP_ID as string,
    keyId: env.COZE_JWT_KEY_ID as string,
    privateKey: normalizePrivateKey(env.COZE_JWT_PRIVATE_KEY as string),
    aud,
    baseURL,
    durationSeconds: Number.isFinite(duration) ? duration : undefined,
    scope: parseScope(env.COZE_JWT_SCOPE),
    sessionName: env.COZE_JWT_SESSION_NAME,
    accountId: env.COZE_JWT_ACCOUNT_ID,
  };
};

export const requestCozeAccessToken = async (
  env: Record<string, string | undefined> = process.env,
): Promise<JWTToken> => {
  const config = resolveJwtConfig(env);

  return getJWTToken({
    baseURL: config.baseURL,
    appId: config.appId,
    aud: config.aud,
    keyid: config.keyId,
    privateKey: config.privateKey,
    durationSeconds: config.durationSeconds,
    scope: config.scope,
    sessionName: config.sessionName,
    accountId: config.accountId,
  });
};
