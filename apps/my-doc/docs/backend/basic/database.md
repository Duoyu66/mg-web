---
id: database
title: 数据库
slug: /backend/basic/database
---

# 数据库技术

## 概览

掌握关系型和非关系型数据库，根据场景选择合适的数据存储方案。

## 核心知识

- **关系型数据库**：MySQL、PostgreSQL
- **NoSQL**：MongoDB、Redis
- **数据库设计**：范式、索引、查询优化

## 关系型数据库

### MySQL

```sql
-- 创建表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 查询
SELECT * FROM users WHERE email = 'user@example.com';

-- 索引
CREATE INDEX idx_email ON users(email);
```

### PostgreSQL

```sql
-- 创建表
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- JSON 查询
SELECT * FROM users WHERE metadata->>'role' = 'admin';
```

## NoSQL 数据库

### MongoDB

```javascript
// 连接
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')

// 查询
const users = await db.collection('users').find({}).toArray()

// 插入
await db.collection('users').insertOne({
  name: 'John',
  email: 'john@example.com',
  tags: ['developer', 'nodejs']
})
```

### Redis

```javascript
const redis = require('redis')
const client = redis.createClient()

// 字符串
await client.set('key', 'value')
const value = await client.get('key')

// 哈希
await client.hSet('user:1', 'name', 'John')
const name = await client.hGet('user:1', 'name')

// 列表
await client.lPush('tasks', 'task1')
const task = await client.rPop('tasks')
```

## 数据库设计

### 范式化

- **第一范式**：每个字段都是原子值
- **第二范式**：消除部分依赖
- **第三范式**：消除传递依赖

### 索引策略

```sql
-- 单列索引
CREATE INDEX idx_name ON users(name);

-- 复合索引
CREATE INDEX idx_name_email ON users(name, email);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);
```

## 查询优化

### 执行计划

```sql
-- MySQL
EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';

-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'user@example.com';
```

### 优化技巧

1. **使用索引**：为常用查询字段创建索引
2. **避免 SELECT ***：只查询需要的字段
3. **使用 LIMIT**：限制返回结果数量
4. **JOIN 优化**：使用合适的 JOIN 类型

## 学习清单

- 能设计数据库表结构
- 能编写高效的 SQL 查询
- 能使用 MongoDB 和 Redis
- 能优化数据库性能

## 推荐资源

- MySQL 官方文档 — https://dev.mysql.com/doc/
- PostgreSQL — https://www.postgresql.org/docs/
- MongoDB — https://www.mongodb.com/docs/
- Redis — https://redis.io/docs/
