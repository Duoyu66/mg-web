---
id: django
title: Django
slug: /backend/framework/django
---

# Django 框架

## 概览

Django 是 Python 最流行的全栈 Web 框架，功能完善，开箱即用。

## 核心特性

- **ORM**：强大的数据库抽象层
- **Admin**：自动生成管理后台
- **认证系统**：用户认证和权限管理
- **模板系统**：视图模板渲染

## 项目结构

```
myproject/
  manage.py
  myproject/
    settings.py
    urls.py
    wsgi.py
  app/
    models.py
    views.py
    urls.py
```

## 模型定义

```python
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users'
```

## 视图和路由

```python
from django.http import JsonResponse
from django.views import View

class UserListView(View):
    def get(self, request):
        users = User.objects.all()
        return JsonResponse({'users': list(users.values())})
    
    def post(self, request):
        data = json.loads(request.body)
        user = User.objects.create(**data)
        return JsonResponse({'id': user.id, **data})
```

## 学习清单

- 能使用 Django 构建 Web 应用
- 能使用 Django ORM 操作数据库
- 能使用 Django Admin
- 能部署 Django 应用

## 推荐资源

- Django 官方文档 — https://www.djangoproject.com/
