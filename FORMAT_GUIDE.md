# 代码格式化指南

本项目已配置完整的代码格式化和代码检查工具，参考了 nove-admin 项目的最佳实践。

## 可用命令

### 格式化命令
```bash
# 格式化所有代码文件
npm run format

# 检查代码格式（不修改文件）
npm run format:check
```

### 代码检查命令
```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# TypeScript 类型检查
npm run typecheck
```

### 构建命令
```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 配置文件

### .prettierrc
Prettier 格式化规则配置：
- 不使用分号
- 使用单引号
- 2 空格缩进
- 行宽 100 字符
- ES5 尾随逗号
- LF 换行符

### .editorconfig
编辑器通用配置，确保所有编辑器使用相同的基础设置。

### eslint.config.js
ESLint 代码检查规则，包含：
- JavaScript/JSX 规则
- TypeScript/TSX 规则
- React Hooks 规则
- React Refresh 规则

## VSCode 集成

建议在 `.vscode/settings.json` 中添加以下配置：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

这样每次保存文件时会自动格式化代码。

## 提交前检查

建议在提交代码前运行：

```bash
npm run format
npm run lint
npm run typecheck
npm run build
```

确保所有检查都通过。
