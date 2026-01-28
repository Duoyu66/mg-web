---
id: vite
title: Vite
slug: /frontend/vite
---

# Vite 详解

## 概览

Vite 是新一代前端构建工具，提供极速的开发体验和高效的构建能力。

## 核心特性

- **极速 HMR**：基于 ESM 的快速热更新
- **按需编译**：只编译当前请求的模块
- **开箱即用**：内置 TypeScript、CSS 预处理器支持
- **优化的构建**：基于 Rollup 的生产构建

## 快速开始

### 创建项目

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

## 插件系统

### 常用插件

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 环境变量

```typescript
// .env
VITE_API_URL=https://api.example.com

// 使用
const apiUrl = import.meta.env.VITE_API_URL
```

## 学习清单

- 能使用 Vite 创建和配置项目
- 能配置路径别名和代理
- 能使用环境变量
- 能优化构建配置

## 推荐资源

- Vite 官方文档 — https://vite.dev/
