# ArticleTOC 文章目录组件

自动从文章 HTML 内容中提取标题并生成可点击的目录组件。

## 功能特性

- ✅ 自动提取文章中的标题（h1-h6）
- ✅ 生成层级目录结构
- ✅ 可点击跳转到对应标题位置
- ✅ 滚动时自动高亮当前标题
- ✅ 清理 Quill 编辑器样式，转换为正常样式
- ✅ 支持暗色模式
- ✅ 响应式设计

## 使用方法

```tsx
import ArticleTOC from '@/components/ArticleTOC';

function MyComponent() {
    const articleContent = `
        <h3>玩法介绍</h3>
        <p>游戏需要2名玩家一同进行冒险...</p>
        <h3>章节攻略</h3>
        <h4>1. 棚屋</h4>
        <p>剧情简介...</p>
    `;

    return (
        <ArticleTOC
            content={articleContent}
            showTOC={true}
            tocTitle="目录"
        />
    );
}
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | - | 文章 HTML 内容（必需） |
| showTOC | boolean | true | 是否显示目录 |
| tocTitle | string | '目录' | 目录标题 |
| className | string | '' | 自定义类名 |

## 样式说明

组件会自动：
1. 移除 Quill 编辑器的类名（如 `ql-align-justify`、`text_CgLK7` 等）
2. 为所有标题添加唯一 ID
3. 应用 Tailwind 的 prose 样式类
4. 支持暗色模式自动切换

## 目录结构

目录会根据标题层级自动生成嵌套结构：
- h1/h2/h3 作为一级目录
- h4/h5/h6 作为子目录

## 滚动高亮

当用户滚动页面时，目录会自动高亮当前可见的标题。

