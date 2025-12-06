/*
 * @Author: 杨仕明 shiming.y@qq.com
 * @Date: 2025-10-25 15:18:51
 * @LastEditors: 杨仕明 shiming.y@qq.com
 * @LastEditTime: 2025-10-25 15:19:12
 * @FilePath: /trae_hackathon/src/client.js
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { CozeAPI, COZE_CN_BASE_URL } from "@coze/api";

type TokenPayload = {
  access_token?: string;
  token?: string;
  expires_in?: number;
};

const baseURL = import.meta.env.VITE_COZE_API_BASE_URL || COZE_CN_BASE_URL;
const tokenEndpoint = import.meta.env.VITE_COZE_JWT_TOKEN_URL || "/api/coze-token";

let cachedToken: { value: string; expiresAt: number } | null = null;

const fetchBrowserToken = async (): Promise<string> => {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.value;

  const response = await fetch(tokenEndpoint, {
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Coze token: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as TokenPayload;
  const token = payload.access_token || payload.token;
  if (!token) {
    throw new Error("JWT token endpoint did not return access_token");
  }

  const ttl = typeof payload.expires_in === "number" ? payload.expires_in * 1000 : 0;
  cachedToken = {
    value: token,
    expiresAt: ttl ? Date.now() + ttl - 5_000 : Date.now() + 5 * 60_000,
  };
  return token;
};

// 创建 Coze API 客户端（使用后台获取的 JWT OAuth 访问令牌）
export const client = new CozeAPI({
  token: fetchBrowserToken,
  baseURL,
});

// 机器人 ID
export const botId = import.meta.env.VITE_COZE_BOT_ID;

// 工具函数
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// 用户 ID（用于会话标识），可在 .env 设置 VITE_COZE_USER_ID
export const userId = import.meta.env.VITE_COZE_USER_ID || "web-user";
