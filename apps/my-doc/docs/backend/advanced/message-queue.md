---
id: message-queue
title: 消息队列
slug: /backend/advanced/message-queue
---

# 消息队列

## 概览

使用消息队列实现异步处理、解耦服务、提升系统可靠性和扩展性。

## 核心知识

- **消息队列**：RabbitMQ、Kafka、Redis Streams
- **使用场景**：异步任务、事件驱动、削峰填谷
- **模式**：发布订阅、工作队列、路由

## RabbitMQ

### 基础概念

- **Producer**：消息生产者
- **Consumer**：消息消费者
- **Queue**：消息队列
- **Exchange**：交换机
- **Binding**：绑定关系

### 工作队列

```javascript
// 生产者
const amqp = require('amqplib')

async function sendMessage() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  
  const queue = 'tasks'
  await channel.assertQueue(queue, { durable: true })
  
  channel.sendToQueue(queue, Buffer.from('任务数据'), {
    persistent: true
  })
}

// 消费者
async function consumeMessage() {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  
  const queue = 'tasks'
  await channel.assertQueue(queue, { durable: true })
  
  channel.consume(queue, (msg) => {
    if (msg) {
      console.log('收到消息:', msg.content.toString())
      channel.ack(msg)
    }
  })
}
```

## Apache Kafka

### 基础概念

- **Topic**：主题
- **Partition**：分区
- **Producer**：生产者
- **Consumer**：消费者
- **Consumer Group**：消费者组

### 使用示例

```javascript
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
})

// 生产者
const producer = kafka.producer()
await producer.connect()
await producer.send({
  topic: 'user-events',
  messages: [
    { value: JSON.stringify({ userId: 1, action: 'login' }) }
  ]
})

// 消费者
const consumer = kafka.consumer({ groupId: 'my-group' })
await consumer.connect()
await consumer.subscribe({ topic: 'user-events' })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const data = JSON.parse(message.value.toString())
    console.log('处理消息:', data)
  }
})
```

## Redis Streams

```javascript
const redis = require('redis')
const client = redis.createClient()

// 添加消息
await client.xAdd('events', '*', {
  type: 'user_created',
  userId: '123',
  data: JSON.stringify({ name: 'John' })
})

// 消费消息
const messages = await client.xRead(
  { key: 'events', id: '0' },
  { COUNT: 10, BLOCK: 1000 }
)
```

## 使用场景

### 异步任务处理

```javascript
// 发送邮件任务
await queue.send('email', {
  to: 'user@example.com',
  subject: '欢迎',
  body: '欢迎注册'
})
```

### 事件驱动

```javascript
// 用户注册事件
await eventBus.publish('user.created', {
  userId: user.id,
  email: user.email
})
```

## 学习清单

- 能使用 RabbitMQ 处理异步任务
- 能使用 Kafka 构建事件流
- 能选择合适的消息队列方案
- 能处理消息失败和重试

## 推荐资源

- RabbitMQ — https://www.rabbitmq.com/
- Apache Kafka — https://kafka.apache.org/
- Redis Streams — https://redis.io/docs/data-types/streams/
