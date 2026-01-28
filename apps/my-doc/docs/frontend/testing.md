---
id: testing
title: 测试框架
slug: /frontend/testing
---

# 前端测试详解

## 概览

建立可靠的测试体系，保障代码质量与重构信心。

## 核心知识

- **单元测试**：组件、工具函数、Hook 的独立测试
- **集成测试**：组件交互、用户流程测试
- **E2E 测试**：端到端用户场景验证
- **测试工具**：Jest、Vitest、React Testing Library、Playwright

## 测试框架

### Jest / Vitest

```javascript
import { describe, it, expect } from 'vitest'

describe('工具函数', () => {
  it('应该正确计算', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

### React Testing Library

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

test('按钮点击事件', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>点击</Button>)
  
  fireEvent.click(screen.getByText('点击'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Playwright E2E

```javascript
import { test, expect } from '@playwright/test'

test('用户登录流程', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#username', 'user')
  await page.fill('#password', 'pass')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

## 测试策略

### 测试金字塔

```
    /\
   /E2E\     少量端到端测试
  /------\
 /Integration\  适量集成测试
/------------\
/   Unit      \  大量单元测试
```

### 测试原则

1. **测试用户行为，而非实现细节**
2. **优先测试关键路径**
3. **保持测试独立和可重复**
4. **使用描述性的测试名称**

## 学习清单

- 能编写组件单元测试
- 能测试异步逻辑和 Hook
- 能编写 E2E 测试
- 能配置测试覆盖率

## 推荐资源

- React Testing Library — https://testing-library.com/react
- Vitest — https://vitest.dev/
- Playwright — https://playwright.dev/
