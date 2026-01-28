---
id: git
title: Git 版本控制
slug: /frontend/git
---

# Git 版本控制

## 概览

掌握 Git 版本控制，高效协作和代码管理。

## 核心知识

- **基础操作**：add、commit、push、pull
- **分支管理**：branch、merge、rebase
- **协作流程**：PR、Code Review、冲突解决

## 基础命令

### 初始化与提交

```bash
# 初始化仓库
git init

# 添加文件
git add .

# 提交
git commit -m "feat: 添加新功能"

# 推送到远程
git push origin main
```

### 分支操作

```bash
# 创建分支
git branch feature/new-feature

# 切换分支
git checkout feature/new-feature

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature
```

## 协作流程

### Pull Request

1. 创建功能分支
2. 开发并提交
3. 推送到远程
4. 创建 Pull Request
5. Code Review
6. 合并到主分支

### 冲突解决

```bash
# 拉取最新代码
git pull origin main

# 解决冲突后
git add .
git commit -m "fix: 解决合并冲突"
git push
```

## 学习清单

- 能使用 Git 管理代码版本
- 能处理分支合并和冲突
- 能参与团队协作流程
- 能使用 Git 高级功能

## 推荐资源

- Git 官方文档 — https://git-scm.com/doc
- GitHub Docs — https://docs.github.com/
