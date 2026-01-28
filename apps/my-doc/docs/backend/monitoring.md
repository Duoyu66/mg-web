---
id: monitoring
title: 监控与日志
slug: /backend/monitoring
---

# 监控与日志

## 概览

建立完善的监控和日志体系，及时发现问题并追踪系统状态。

## 核心知识

- **监控指标**：CPU、内存、磁盘、网络
- **日志管理**：结构化日志、日志聚合、日志分析
- **告警系统**：阈值告警、异常检测、通知机制

## 应用监控

### 性能监控

```javascript
const prometheus = require('prom-client')

// 创建指标
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP 请求耗时',
  buckets: [0.1, 0.5, 1, 2, 5],
})

// 记录指标
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000
    httpRequestDuration.observe(duration)
  })
  next()
})
```

## 日志管理

### 结构化日志

```javascript
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})

// 使用
logger.info('用户登录', { userId: 123, ip: '192.168.1.1' })
logger.error('数据库连接失败', { error: err.message })
```

### ELK Stack

```javascript
// 发送日志到 Elasticsearch
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

async function logToElasticsearch(level, message, metadata) {
  await client.index({
    index: 'app-logs',
    body: {
      timestamp: new Date(),
      level,
      message,
      ...metadata,
    },
  })
}
```

## 错误追踪

### Sentry

```javascript
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
})

// 捕获异常
try {
  // 代码
} catch (error) {
  Sentry.captureException(error)
}
```

## 健康检查

```javascript
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }
  res.json(health)
})
```

## 学习清单

- 能配置应用监控和指标收集
- 能实现结构化日志和日志聚合
- 能设置告警和错误追踪
- 能分析监控数据定位问题

## 推荐资源

- Prometheus — https://prometheus.io/
- ELK Stack — https://www.elastic.co/what-is/elk-stack
- Sentry — https://sentry.io/
