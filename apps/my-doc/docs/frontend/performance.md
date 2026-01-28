---
id: performance
title: 性能优化
slug: /frontend/performance
---

# 前端性能优化

## 概览

通过代码分割、懒加载、缓存等策略，提升应用加载速度与运行性能。

## 核心知识

- **加载优化**：代码分割、懒加载、预加载
- **运行时优化**：虚拟滚动、防抖节流、Memo 化
- **资源优化**：图片压缩、CDN、HTTP/2
- **监控分析**：性能指标、Lighthouse、Web Vitals

## 加载优化

### 代码分割

```javascript
// 路由级别分割
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))

// 组件级别分割
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### 预加载关键资源

```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="prefetch" href="/next-page.html">
```

## 运行时优化

### React 性能优化

```javascript
// Memo 化组件
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* 渲染逻辑 */}</div>
})

// useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// useCallback 缓存函数
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### 虚拟滚动

```javascript
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }) {
  const parentRef = useRef()
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })
  
  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map((virtualItem) => (
        <div key={virtualItem.key} style={{ height: virtualItem.size }}>
          {items[virtualItem.index]}
        </div>
      ))}
    </div>
  )
}
```

## 资源优化

### 图片优化

```javascript
// Next.js Image 组件
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="描述"
  loading="lazy"
  placeholder="blur"
/>
```

### 字体优化

```css
/* 字体显示策略 */
@font-face {
  font-family: 'Custom';
  font-display: swap; /* 或 optional */
  src: url('/font.woff2') format('woff2');
}
```

## 性能指标

### Core Web Vitals

- **LCP (Largest Contentful Paint)**：最大内容绘制 < 2.5s
- **FID (First Input Delay)**：首次输入延迟 < 100ms
- **CLS (Cumulative Layout Shift)**：累积布局偏移 < 0.1

### 监控工具

```javascript
// Web Vitals 监控
import { onCLS, onFID, onLCP } from 'web-vitals'

onCLS(console.log)
onFID(console.log)
onLCP(console.log)
```

## 学习清单

- 能使用代码分割优化首屏加载
- 能定位并修复性能瓶颈
- 能优化图片和字体加载
- 能监控 Core Web Vitals

## 推荐资源

- Web.dev Performance — https://web.dev/performance
- React Performance — https://react.dev/learn/render-and-commit
