---
id: java
title: Java / Spring Boot
slug: /backend/basic/java
---

# Java / Spring Boot 后端开发

## 概览

使用 Spring Boot 构建企业级 Java 应用，强大的生态和成熟的实践。

## 核心知识

- **框架**：Spring Boot、Spring MVC、Spring Data
- **特性**：依赖注入、AOP、事务管理
- **生态**：Maven/Gradle、JPA、微服务支持

## Spring Boot 基础

### 项目结构

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
```

### REST Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }
    
    @PostMapping
    public User createUser(@RequestBody UserCreateDto dto) {
        return userService.create(dto);
    }
}
```

## 数据访问

### Spring Data JPA

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
}

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByName(String name);
    Optional<User> findByEmail(String email);
}
```

### 服务层

```java
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    public User create(UserCreateDto dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        return userRepository.save(user);
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
    show-sql: true
```

## 学习清单

- 能使用 Spring Boot 构建 REST API
- 能使用 JPA 操作数据库
- 能处理依赖注入和事务
- 能部署 Spring Boot 应用

## 推荐资源

- Spring Boot 官方文档 — https://spring.io/projects/spring-boot
- Spring Data JPA — https://spring.io/projects/spring-data-jpa
