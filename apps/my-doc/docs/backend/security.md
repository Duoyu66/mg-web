---
id: security
title: 安全防护
slug: /backend/security
---

# 后端安全防护

## 概览

建立完善的安全防护体系，保护应用和数据安全。

## 核心知识

- **常见攻击**：SQL 注入、XSS、CSRF、DDoS
- **防护措施**：输入验证、输出编码、HTTPS、限流
- **安全实践**：密码策略、会话管理、日志审计

## SQL 注入防护

### 使用参数化查询

```javascript
// ❌ 错误：拼接 SQL
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ 正确：参数化查询
const query = 'SELECT * FROM users WHERE id = ?'
db.query(query, [userId])
```

## XSS 防护

### 输出编码

```javascript
// 使用模板引擎的自动转义
app.set('view engine', 'ejs')

// 手动转义
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
```

## CSRF 防护

### Token 验证

```javascript
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

app.use(csrfProtection)

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() })
})

app.post('/process', csrfProtection, (req, res) => {
  // 处理表单
})
```

## 限流防护

```javascript
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 限制 100 次请求
})

app.use('/api/', limiter)
```

## HTTPS

```javascript
const https = require('https')
const fs = require('fs')

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}

https.createServer(options, app).listen(443)
```

## 学习清单

- 能防护常见 Web 攻击
- 能实现输入验证和输出编码
- 能配置 HTTPS 和限流
- 能建立安全审计机制

## 推荐资源

- OWASP Top 10 — https://owasp.org/www-project-top-ten/
- Web Security — https://web.dev/secure/
