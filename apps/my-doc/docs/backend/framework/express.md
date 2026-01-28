---
id: express
title: Express.js
slug: /backend/framework/express
---

# Express.js 框架

## 概览

Express 是 Node.js 最流行的 Web 框架，简洁灵活，生态丰富。

## 核心特性

- **路由系统**：RESTful API 路由
- **中间件**：请求处理管道
- **模板引擎**：视图渲染支持
- **静态文件**：静态资源服务

## 基础使用

### 创建应用

```javascript
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

### 路由定义

```javascript
app.get('/api/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/api/users', (req, res) => {
  const { name, email } = req.body
  res.status(201).json({ id: 1, name, email })
})

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  res.json({ id, ...req.body })
})

app.delete('/api/users/:id', (req, res) => {
  res.status(204).send()
})
```

## 中间件

### 自定义中间件

```javascript
function logger(req, res, next) {
  console.log(`${req.method} ${req.path}`)
  next()
}

app.use(logger)
```

### 错误处理

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})
```

## 学习清单

- 能使用 Express 构建 REST API
- 能编写和使用中间件
- 能处理错误和异常
- 能部署 Express 应用

## 推荐资源

- Express.js 官方文档 — https://expressjs.com/
