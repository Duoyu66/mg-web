---
id: webpack
title: Webpack
slug: /frontend/advanced/webpack
---

# Webpack 详解

## 概览

Webpack 是一个模块打包器，将前端资源打包成浏览器可用的静态文件。

## 核心概念

- **Entry**：入口文件
- **Output**：输出配置
- **Loader**：文件转换器
- **Plugin**：插件系统
- **Module**：模块系统

## 基础配置

### webpack.config.js

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
}
```

## Loader

### 处理 CSS

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    },
  ],
}
```

### 处理图片

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      type: 'asset/resource',
    },
  ],
}
```

## 代码分割

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
}
```

## 学习清单

- 能配置 Webpack 打包项目
- 能使用 Loader 处理不同文件类型
- 能实现代码分割和懒加载
- 能优化打包体积和速度

## 推荐资源

- Webpack 官方文档 — https://webpack.js.org/
