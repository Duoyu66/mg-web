---
id: go
title: Go 语言
slug: /backend/go
---

# Go 后端开发

## 概览

使用 Go 构建高性能、并发友好的后端服务，简洁的语法和强大的标准库。

## 核心知识

- **基础**：语法、并发模型、接口
- **框架**：Gin、Echo、Fiber
- **特性**：Goroutine、Channel、错误处理

## 基础语法

### 并发编程

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Goroutine
    go func() {
        fmt.Println("异步执行")
    }()
    
    // Channel
    ch := make(chan string)
    go func() {
        ch <- "消息"
    }()
    
    msg := <-ch
    fmt.Println(msg)
}
```

## Web 框架

### Gin

```go
package main

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    r.GET("/api/users", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{"users": []})
    })
    
    r.POST("/api/users", func(c *gin.Context) {
        var user User
        if err := c.ShouldBindJSON(&user); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusCreated, user)
    })
    
    r.Run(":3000")
}
```

### Echo

```go
package main

import (
    "github.com/labstack/echo/v4"
)

func main() {
    e := echo.New()
    
    e.GET("/api/users", getUsers)
    e.POST("/api/users", createUser)
    
    e.Start(":3000")
}

func getUsers(c echo.Context) error {
    return c.JSON(200, map[string]interface{}{
        "users": []interface{}{},
    })
}
```

## 数据库操作

### GORM

```go
import "gorm.io/gorm"

type User struct {
    ID    uint   `gorm:"primaryKey"`
    Name  string
    Email string
}

// 查询
var users []User
db.Find(&users)

// 创建
user := User{Name: "John", Email: "john@example.com"}
db.Create(&user)
```

## 学习清单

- 能使用 Go 构建 REST API
- 能处理并发和 Channel
- 能使用 GORM 操作数据库
- 能部署 Go 应用

## 推荐资源

- Go 官方文档 — https://go.dev/doc/
- Gin — https://gin-gonic.com/
- GORM — https://gorm.io/
