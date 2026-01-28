---
id: auth
title: 认证授权
slug: /backend/advanced/auth
---

# 认证与授权

## 概览

实现安全的用户认证和权限控制，保护应用和数据安全。

## 核心知识

- **认证方式**：JWT、Session、OAuth
- **授权模型**：RBAC、ABAC
- **安全实践**：密码加密、CSRF 防护、XSS 防护

## JWT 认证

### Token 生成

```javascript
const jwt = require('jsonwebtoken')

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
)
```

### Token 验证

```javascript
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

## OAuth 2.0

### 授权流程

```
1. 用户点击"使用 Google 登录"
2. 重定向到 Google 授权页面
3. 用户授权后，Google 返回授权码
4. 后端用授权码换取 Access Token
5. 使用 Access Token 获取用户信息
```

### 实现示例

```javascript
// 授权端点
app.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${CLIENT_ID}&
    redirect_uri=${REDIRECT_URI}&
    response_type=code&
    scope=email profile`
  res.redirect(authUrl)
})

// 回调处理
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: JSON.stringify({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })
  const tokens = await tokenResponse.json()
  // 使用 tokens.access_token 获取用户信息
})
```

## 权限控制

### RBAC (基于角色)

```javascript
const roles = {
  admin: ['read', 'write', 'delete'],
  user: ['read'],
  guest: [],
}

function checkPermission(userRole, action) {
  return roles[userRole]?.includes(action)
}
```

### 中间件实现

```javascript
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.sendStatus(401)
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.sendStatus(403)
    }
    
    next()
  }
}

// 使用
app.delete('/api/users/:id', requireRole('admin'), deleteUser)
```

## 密码安全

### 密码加密

```javascript
const bcrypt = require('bcrypt')

// 加密
const saltRounds = 10
const hashedPassword = await bcrypt.hash(password, saltRounds)

// 验证
const isValid = await bcrypt.compare(password, hashedPassword)
```

## 学习清单

- 能实现 JWT 认证
- 能集成 OAuth 登录
- 能实现基于角色的权限控制
- 能处理密码加密和安全存储

## 推荐资源

- JWT.io — https://jwt.io/
- OAuth 2.0 — https://oauth.net/2/
- OWASP — https://owasp.org/
