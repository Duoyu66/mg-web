---
id: cache
title: 缓存策略
slug: /backend/advanced/cache
---

# 缓存策略

## 概览

通过合理的缓存策略提升系统性能，减少数据库压力。

## 核心知识

- **缓存类型**：内存缓存、分布式缓存、CDN
- **缓存策略**：Cache-Aside、Write-Through、Write-Back
- **缓存失效**：TTL、主动失效、缓存预热

## 缓存策略

### Cache-Aside (旁路缓存)

```javascript
async function getUser(userId) {
  // 1. 先查缓存
  let user = await cache.get(`user:${userId}`)
  
  if (user) {
    return user
  }
  
  // 2. 缓存未命中，查数据库
  user = await db.query('SELECT * FROM users WHERE id = ?', [userId])
  
  // 3. 写入缓存
  await cache.set(`user:${userId}`, user, 3600) // TTL 1小时
  
  return user
}
```

### Write-Through (写透)

```javascript
async function updateUser(userId, data) {
  // 1. 更新数据库
  const user = await db.update('users', data, { id: userId })
  
  // 2. 更新缓存
  await cache.set(`user:${userId}`, user, 3600)
  
  return user
}
```

### Write-Back (写回)

```javascript
async function updateUser(userId, data) {
  // 1. 先更新缓存
  await cache.set(`user:${userId}`, data, 3600)
  
  // 2. 异步更新数据库
  setImmediate(() => {
    db.update('users', data, { id: userId })
  })
  
  return data
}
```

## Redis 缓存

### 基础操作

```javascript
const redis = require('redis')
const client = redis.createClient()

// 设置缓存
await client.set('key', 'value', { EX: 3600 }) // 1小时过期

// 获取缓存
const value = await client.get('key')

// 删除缓存
await client.del('key')

// 批量操作
await client.mSet({ key1: 'value1', key2: 'value2' })
```

### 缓存模式

```javascript
// 缓存穿透防护
async function getUserSafe(userId) {
  const cacheKey = `user:${userId}`
  
  // 检查缓存
  let user = await client.get(cacheKey)
  if (user) {
    return JSON.parse(user)
  }
  
  // 检查布隆过滤器或设置空值缓存
  const exists = await bloomFilter.exists(userId)
  if (!exists) {
    await client.set(cacheKey, JSON.stringify(null), { EX: 60 })
    return null
  }
  
  // 查询数据库
  user = await db.query('SELECT * FROM users WHERE id = ?', [userId])
  
  if (user) {
    await client.set(cacheKey, JSON.stringify(user), { EX: 3600 })
  } else {
    // 防止缓存穿透，缓存空值
    await client.set(cacheKey, JSON.stringify(null), { EX: 60 })
  }
  
  return user
}
```

## 缓存失效

### TTL 策略

```javascript
// 设置过期时间
await cache.set('key', 'value', { EX: 3600 }) // 秒
await cache.set('key', 'value', { PX: 3600000 }) // 毫秒
```

### 主动失效

```javascript
// 用户更新时删除缓存
async function updateUser(userId, data) {
  await db.update('users', data, { id: userId })
  await cache.del(`user:${userId}`)
  await cache.del('users:list') // 列表缓存也要删除
}
```

## 学习清单

- 能选择合适的缓存策略
- 能使用 Redis 实现缓存
- 能处理缓存穿透和雪崩
- 能设计缓存失效机制

## 推荐资源

- Redis 官方文档 — https://redis.io/docs/
- 缓存设计模式 — https://aws.amazon.com/caching/
