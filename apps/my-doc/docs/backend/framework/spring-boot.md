---
id: spring-boot
title: Spring Boot
slug: /backend/framework/spring-boot
---

# Spring Boot 框架

## 概览

Spring Boot 是 Java 企业级应用开发的首选框架，约定优于配置，快速开发。

## 核心特性

- **自动配置**：零配置启动
- **起步依赖**：依赖管理简化
- **内嵌服务器**：Tomcat/Jetty 内置
- **生产就绪**：监控、健康检查

## 项目结构

```
src/
  main/
    java/
      com/example/
        Application.java
        controller/
        service/
        repository/
        model/
    resources/
      application.yml
```

## REST API

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserCreateDto dto) {
        User user = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
}
```

## 配置管理

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: user
    password: pass
  
  jpa:
    hibernate:
      ddl-auto: update
```

## 学习清单

- 能使用 Spring Boot 构建 REST API
- 能使用 Spring Data JPA
- 能配置和管理应用
- 能部署 Spring Boot 应用

## 推荐资源

- Spring Boot 官方文档 — https://spring.io/projects/spring-boot
