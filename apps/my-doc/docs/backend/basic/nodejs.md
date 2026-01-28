---
id: nodejs
title: Node.js
slug: /backend/basic/nodejs
---

# Node.js 后端开发

## 概览

使用 JavaScript 构建高性能服务器应用，统一前后端技术栈。

## 核心知识

- **基础**：模块系统、事件循环、异步编程
- **框架**：Express、Koa、Fastify、NestJS
- **生态**：npm、中间件、数据库驱动

## 基础概念

### 模块系统

```javascript
// CommonJS
const fs = require('fs')
module.exports = { myFunction }

// ES Modules
import fs from 'fs'
export { myFunction }
```

### 事件循环

```javascript
// 异步执行顺序
console.log('1')
setTimeout(() => console.log('2'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('4')
// 输出: 1, 4, 3, 2
```

## Web 框架

### Express.js

```javascript
const express = require('express')
const app = express()

app.use(express.json())

app.get('/api/users', (req, res) => {
  res.json({ users: [] })
})

app.post('/api/users', (req, res) => {
  const { name } = req.body
  res.status(201).json({ id: 1, name })
})

app.listen(3000)
```

### Koa.js

```javascript
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  await next()
  ctx.body = { message: 'Hello' }
})

app.listen(3000)
```

### NestJS

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common'

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return []
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return { id: 1, ...createUserDto }
  }
}
```

## 数据库操作

### MongoDB (Mongoose)

```javascript
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
})

const User = mongoose.model('User', userSchema)

// 查询
const users = await User.find({})

// 创建
const user = await User.create({ name: 'John', email: 'john@example.com' })
```

### PostgreSQL (pg)

```javascript
const { Pool } = require('pg')
const pool = new Pool()

const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
```

## 中间件

### 认证中间件

```javascript
const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  
  if (!token) {
    return res.sendStatus(401)
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
```

## 学习清单

- 能使用 Express/Koa 构建 REST API
- 能处理异步操作和错误
- 能连接数据库进行 CRUD
- 能部署 Node.js 应用

## 推荐资源

- Node.js 官方文档 — https://nodejs.org/
- Express.js — https://expressjs.com/
- NestJS — https://nestjs.com/
