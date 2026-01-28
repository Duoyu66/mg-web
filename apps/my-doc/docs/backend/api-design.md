---
id: api-design
title: API 设计
slug: /backend/api-design
---

# API 设计

## 概览

设计清晰、易用、可扩展的 API，提升前后端协作效率。

## 核心知识

- **REST API**：资源设计、HTTP 方法、状态码
- **GraphQL**：查询语言、Schema 设计
- **API 文档**：OpenAPI/Swagger、版本控制

## REST API

### 资源设计

```
GET    /api/users          # 获取用户列表
GET    /api/users/:id      # 获取单个用户
POST   /api/users          # 创建用户
PUT    /api/users/:id      # 更新用户
DELETE /api/users/:id      # 删除用户
```

### HTTP 状态码

- **200 OK**：成功
- **201 Created**：创建成功
- **400 Bad Request**：请求错误
- **401 Unauthorized**：未认证
- **403 Forbidden**：无权限
- **404 Not Found**：资源不存在
- **500 Internal Server Error**：服务器错误

### 响应格式

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John"
  },
  "message": "操作成功"
}
```

## GraphQL

### Schema 定义

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User!
}
```

### 查询示例

```graphql
query {
  users {
    id
    name
    posts {
      title
    }
  }
}

mutation {
  createUser(name: "John", email: "john@example.com") {
    id
    name
  }
}
```

## API 文档

### OpenAPI / Swagger

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0

paths:
  /api/users:
    get:
      summary: 获取用户列表
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

## 版本控制

### URL 版本

```
/api/v1/users
/api/v2/users
```

### Header 版本

```
Accept: application/vnd.api+json;version=1
```

## 学习清单

- 能设计 RESTful API
- 能使用 GraphQL
- 能编写 API 文档
- 能处理 API 版本控制

## 推荐资源

- REST API 设计指南 — https://restfulapi.net/
- GraphQL — https://graphql.org/
- OpenAPI — https://www.openapis.org/
