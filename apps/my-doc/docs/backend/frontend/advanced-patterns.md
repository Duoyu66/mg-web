---
id: advanced-patterns
title: 高级设计模式
slug: /frontend/advanced-patterns
roles: ["vip"]
---

## 概览

深入学习前端高级设计模式与架构实践，提升代码质量与可维护性。本内容为 VIP 专享。

## 核心知识

### 1. 设计模式

#### 单例模式（Singleton）

确保一个类只有一个实例，并提供全局访问点。

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    return this;
  }
}

const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true
```

#### 观察者模式（Observer）

定义对象间一对多的依赖关系，当一个对象状态改变时，所有依赖它的对象都会收到通知。

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log('Received:', data);
  }
}
```

### 2. 架构模式

#### MVC（Model-View-Controller）

分离业务逻辑、数据和用户界面。

- **Model**：数据层，处理业务逻辑
- **View**：视图层，展示数据
- **Controller**：控制层，处理用户输入

#### MVVM（Model-View-ViewModel）

通过数据绑定实现视图和模型的自动同步。

### 3. 性能优化

#### 虚拟滚动

只渲染可见区域的列表项，大幅提升长列表性能。

```javascript
function VirtualList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight),
    items.length
  );
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div 
            key={startIndex + index}
            style={{ 
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 学习清单

- 能实现常见设计模式
- 能设计可扩展的组件架构
- 能优化大型应用的性能
- 能应用架构模式解决复杂问题

## 推荐资源

- Design Patterns — https://refactoring.guru/design-patterns
- JavaScript Design Patterns — https://www.patterns.dev/
