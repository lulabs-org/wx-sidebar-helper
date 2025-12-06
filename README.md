# 微信侧边栏助手

基于 React + Vite 的微信侧边栏插件，接入了 [Coze](https://www.coze.cn) Bot。项目默认使用官方文档（[Node.js Access Token 指南](https://www.coze.cn/open/docs/developer_guides/nodejs_access_token)）推荐的 **JWT OAuth** 鉴权，通过私有服务端获取短期 Access Token，浏览器仅保存临时令牌，避免 PAT 过期或泄露。

## 开发

```bash
npm install
npm run dev
```

运行 `npm run dev` 时，Vite Dev Server 会本地模拟 `/api/coze-token` 接口，使用同一套私钥环境变量获取 JWT Token；在 Vercel 等生产环境下，`api/coze-token.ts` 会作为 Serverless Function 提供相同能力。

## Coze 鉴权

1. 进入 [扣子开放平台 OAuth 应用](https://www.coze.cn/open/oauth/apps)（海外环境使用 `coze.com`），新建 **JWT 应用**，记录 `App ID`、`Key ID`、`Audience` 并上传公钥。
2. 将生成的私钥保存为环境变量 `COZE_JWT_PRIVATE_KEY`（注意换行需要写成 `\n`）。
3. 在部署环境（本地、Vercel、服务器）配置以下变量：

```
COZE_JWT_APP_ID=<App ID>
COZE_JWT_KEY_ID=<Key ID>
COZE_JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# 可选：覆盖默认值
COZE_JWT_BASE_URL=https://api.coze.cn
COZE_JWT_AUD=api.coze.cn
COZE_JWT_DURATION=900
COZE_JWT_SCOPE={"account_permission":{"permission_list":["Bot.Read"]}}
COZE_JWT_SESSION_NAME=web-sidebar
COZE_JWT_ACCOUNT_ID=<Enterprise Account ID>
```

前端仍旧需要配置 Bot/用户信息（存放在 `.env`，交由 Vite 注入）：

```
VITE_COZE_BOT_ID=xxxxxxxxx
VITE_COZE_USER_ID=web-user
VITE_COZE_API_BASE_URL=https://api.coze.cn
# 如需自定义 token 接口（默认 /api/coze-token）
VITE_COZE_JWT_TOKEN_URL=/api/coze-token
```

## 构建

```bash
npm run build
npm run preview
```

## 其它命令

- `npm run test:coze`：使用 `src/client_kn_test.ts` 在 Node 环境下调通流式接口
- `npm run lint` / `npm run typecheck`
