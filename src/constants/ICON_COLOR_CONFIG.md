# 图标默认颜色配置指南

## 概述

本项目提供了多种方式来统一配置图标的默认颜色，支持亮色/暗色模式自动切换。

## 配置方式

### 方式一：修改全局默认颜色常量（推荐）

在 `src/constants/icons.ts` 中修改 `ICON_DEFAULT_COLOR` 常量：

```typescript
/**
 * 图标默认颜色配置
 * 修改此值可以全局更改所有图标的默认颜色
 */
export const ICON_DEFAULT_COLOR = 'text-gray-700 dark:text-gray-300' as const;
```

**可选值：**

- `'text-gray-700 dark:text-gray-300'` - 默认文本色（推荐，自动适配暗色模式）
- `'text-current'` - 继承父元素颜色
- `'text-primary-500'` - 主题色
- `'text-gray-900 dark:text-gray-100'` - 深色文本
- 任意 Tailwind 颜色类

### 方式二：使用 Icon 组件（自动应用默认颜色）

使用 `Icon` 组件会自动应用默认颜色：

```tsx
import Icon from '@/components/Icon';

// 自动使用默认颜色
<Icon name="MOON" />

// 覆盖默认颜色
<Icon name="MOON" className="text-blue-500" />
```

### 方式三：直接使用 ICONS 常量时手动添加颜色

直接使用 `ICONS` 常量时，需要手动添加颜色类名：

```tsx
import { ICONS } from '@/constants/icons';
import { ICON_DEFAULT_COLOR } from '@/constants/icons';

// 方式1：使用默认颜色常量
<ICONS.MOON className={ICON_DEFAULT_COLOR} />

// 方式2：直接指定颜色类
<ICONS.MOON className="text-gray-700 dark:text-gray-300" />

// 方式3：使用自定义颜色
<ICONS.MOON className="text-blue-500" />
```

### 方式四：全局 CSS 规则（自动继承）

全局 CSS 已经配置了图标自动继承颜色：

```css
/* src/index.css */
svg[data-lucide] {
    color: currentColor;
    stroke: currentColor;
}
```

这意味着图标会自动继承父元素的文本颜色。

## 完整示例

### 示例 1：使用 Icon 组件（推荐）

```tsx
import Icon from '@/components/Icon';

function MyComponent() {
    return (
        <div className="text-gray-700 dark:text-gray-300">
            {/* 自动使用默认颜色 */}
            <Icon name="MOON" />
            
            {/* 自定义颜色 */}
            <Icon name="SUN" className="text-yellow-500" />
            
            {/* 继承父元素颜色 */}
            <Icon name="HOME" className="text-current" />
        </div>
    );
}
```

### 示例 2：直接使用 ICONS 常量

```tsx
import { ICONS, ICON_DEFAULT_COLOR } from '@/constants/icons';

function MyComponent() {
    return (
        <div>
            {/* 使用默认颜色常量 */}
            <ICONS.MOON className={ICON_DEFAULT_COLOR} size={24} />
            
            {/* 自定义颜色 */}
            <ICONS.SUN className="text-yellow-500" size={24} />
            
            {/* 在容器中继承颜色 */}
            <div className="text-blue-500">
                <ICONS.HOME className="text-current" size={24} />
            </div>
        </div>
    );
}
```

### 示例 3：修改全局默认颜色

```typescript
// src/constants/icons.ts

// 改为使用主题色
export const ICON_DEFAULT_COLOR = 'text-primary-500' as const;

// 或改为继承父元素
export const ICON_DEFAULT_COLOR = 'text-current' as const;

// 或使用自定义颜色
export const ICON_DEFAULT_COLOR = 'text-gray-900 dark:text-white' as const;
```

## 最佳实践

1. **推荐使用 Icon 组件**：会自动应用默认颜色，代码更简洁
2. **统一修改默认颜色**：在 `ICON_DEFAULT_COLOR` 中统一配置
3. **支持暗色模式**：使用 `dark:` 前缀的 Tailwind 类
4. **按需覆盖**：需要特殊颜色时，通过 `className` 属性覆盖

## 颜色配置说明

### 当前默认配置

- **默认颜色**：`text-gray-700 dark:text-gray-300`
  - 亮色模式：深灰色 (#374151)
  - 暗色模式：浅灰色 (#d1d5db)

### 如何更改

1. 打开 `src/constants/icons.ts`
2. 找到 `ICON_DEFAULT_COLOR` 常量
3. 修改为需要的颜色类名
4. 所有使用 `Icon` 组件的图标会自动应用新颜色

## 注意事项

- 直接使用 `ICONS` 常量时，需要手动添加 `className` 属性
- 使用 `Icon` 组件时，会自动应用默认颜色
- 通过 `className` 属性可以覆盖默认颜色
- 全局 CSS 规则会确保图标继承 `currentColor`

