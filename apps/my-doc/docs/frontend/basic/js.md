---
id: js
title: JavaScript
slug: /frontend/basic/js
roles: ['vip']
---

## 概览

JavaScript 是浏览器端的核心编程语言，负责交互与业务逻辑。

## 为什么学

- 决定前端开发的上限
- 面试高频：作用域/闭包、原型链、事件循环、Promise

## 核心知识

**语言机制**：类型与转换、作用域与闭包、原型与继承

**异步**：事件循环、Promise/async-await、错误处理

```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("start");
  await sleep(500);
  console.log("end");
}
```

## 学习清单

- 手写 Promise.all/节流防抖
- 能解释事件循环执行顺序
- 能做模块拆分与复用

## 推荐资源

- MDN: JavaScript — https://developer.mozilla.org/zh-CN/docs/Web/JavaScript
