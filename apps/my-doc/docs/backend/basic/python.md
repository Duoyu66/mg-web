---
id: python
title: Python 后端
slug: /backend/basic/python
---

# Python 后端开发

## 概览

使用 Python 构建 Web 应用和 API，快速开发、易于维护。

## 核心知识

- **框架**：FastAPI、Django、Flask
- **异步**：asyncio、异步数据库驱动
- **生态**：ORM、认证、部署

## Web 框架

### FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class UserCreate(BaseModel):
    name: str
    email: str

@app.get("/api/users")
async def get_users():
    return {"users": []}

@app.post("/api/users")
async def create_user(user: UserCreate):
    return {"id": 1, **user.dict()}
```

### Django

```python
from django.http import JsonResponse
from django.views import View

class UserListView(View):
    def get(self, request):
        return JsonResponse({"users": []})
    
    def post(self, request):
        data = json.loads(request.body)
        return JsonResponse({"id": 1, **data})
```

## 数据库 ORM

### SQLAlchemy

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)

# 查询
users = session.query(User).all()

# 创建
user = User(name='John', email='john@example.com')
session.add(user)
session.commit()
```

### Django ORM

```python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

# 查询
users = User.objects.all()

# 创建
user = User.objects.create(name='John', email='john@example.com')
```

## 异步编程

### asyncio

```python
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return {"data": "result"}

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

## 学习清单

- 能使用 FastAPI/Django 构建 API
- 能使用 ORM 操作数据库
- 能处理异步请求
- 能部署 Python 应用

## 推荐资源

- FastAPI — https://fastapi.tiangolo.com/
- Django — https://www.djangoproject.com/
- Python 官方文档 — https://docs.python.org/
