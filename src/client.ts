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
const DEFAULT_CHAT_ENDPOINT = "/api/coze-chat";

// 后端代理地址：统一通过服务端完成 JWT 签发与转发
export const cozeChatEndpoint = import.meta.env.VITE_COZE_CHAT_URL || DEFAULT_CHAT_ENDPOINT;

// 工具函数
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
