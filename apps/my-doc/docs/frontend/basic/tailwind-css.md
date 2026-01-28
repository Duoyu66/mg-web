---
id: tailwind-css
title: Tailwind CSS
slug: /frontend/basic/tailwind-css
---

# Tailwind CSS 详解

## 概览

Tailwind CSS 是一个实用优先的 CSS 框架，通过原子类快速构建现代 UI，提升开发效率。

## 核心知识

- **实用类系统**：间距、颜色、排版、布局的原子类
- **响应式设计**：移动优先的断点系统
- **状态变体**：hover、focus、active 等交互状态
- **自定义配置**：主题定制、插件扩展

## 基础用法

### 布局

```html
<div class="flex items-center justify-between p-4">
  <h1 class="text-2xl font-bold">标题</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded">按钮</button>
</div>
```

### 响应式

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 响应式网格 -->
</div>
```

### 状态变体

```html
<button class="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
  按钮
</button>
```

## 高级特性

### 自定义主题

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#3b82f6',
      },
    },
  },
}
```

### 插件系统

```js
const plugin = require('tailwindcss/plugin')

module.exports = {
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
      })
    }),
  ],
}
```

## 最佳实践

1. **使用 @apply 提取重复样式**
2. **利用 JIT 模式减少 CSS 体积**
3. **结合组件库使用**
4. **合理使用自定义类**

## 学习清单

- 能使用 Tailwind 快速构建页面
- 能配置自定义主题
- 能编写 Tailwind 插件
- 能优化生产环境 CSS 体积

## 推荐资源

- Tailwind CSS 官方文档 — https://tailwindcss.com/
- Tailwind UI — https://tailwindui.com/
