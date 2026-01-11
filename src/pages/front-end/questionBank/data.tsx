import { 
    Globe, 
    Server, 
    Cloud, 
    Bug 
} from 'lucide-react';
import React from 'react';

// 模拟数据结构
export interface SubCategory {
    id: string;
    name: string;
    description: string;
    count: number;
}

export interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    subCategories: SubCategory[];
}

export interface Question {
    id: string;
    title: string;
    difficulty: '简单' | '中等' | '困难';
    tags: string[];
    passRate: string;
    content?: string; // 题目内容（Markdown）
    answer?: string; // 参考答案（Markdown）
    codeSnippet?: string; // 初始代码片段
}

// 模拟数据
export const CATEGORIES: Category[] = [
    {
        id: 'frontend',
        name: '前端开发',
        icon: <Globe size={40} />,
        color: 'bg-blue-50 text-blue-600 border-blue-200',
        description: 'HTML, CSS, JavaScript, React, Vue 等前端技术栈',
        subCategories: [
            { id: 'js', name: 'JavaScript', description: 'JS 基础、ES6+、异步编程等', count: 128 },
            { id: 'css', name: 'CSS & Layout', description: '布局、动画、预处理器等', count: 85 },
            { id: 'react', name: 'React', description: 'Hooks, Components, State Management', count: 64 },
            { id: 'vue', name: 'Vue', description: 'Vue 3, Composition API, Pinia', count: 52 },
            { id: 'ts', name: 'TypeScript', description: '类型系统、泛型、装饰器', count: 45 },
        ]
    },
    {
        id: 'backend',
        name: '后端开发',
        icon: <Server size={40} />,
        color: 'bg-green-50 text-green-600 border-green-200',
        description: 'Java, Python, Go, Node.js 等服务端开发技术',
        subCategories: [
            { id: 'java', name: 'Java', description: 'Java SE, JVM, Concurrency', count: 156 },
            { id: 'spring', name: 'Spring Boot', description: 'Spring MVC, Data, Security', count: 98 },
            { id: 'go', name: 'Go', description: 'Goroutines, Channels, Interfaces', count: 42 },
            { id: 'python', name: 'Python', description: 'Django, Flask, FastAPI', count: 67 },
        ]
    },
    {
        id: 'devops',
        name: '运维部署',
        icon: <Cloud size={40} />,
        color: 'bg-purple-50 text-purple-600 border-purple-200',
        description: 'Docker, K8s, CI/CD, Linux 系统管理',
        subCategories: [
            { id: 'linux', name: 'Linux', description: 'Shell, Permissions, System', count: 88 },
            { id: 'docker', name: 'Docker', description: 'Containers, Images, Compose', count: 45 },
            { id: 'k8s', name: 'Kubernetes', description: 'Pods, Services, Deployments', count: 32 },
            { id: 'nginx', name: 'Nginx', description: 'Configuration, Load Balancing', count: 24 },
        ]
    },
    {
        id: 'test',
        name: '测试质量',
        icon: <Bug size={40} />,
        color: 'bg-orange-50 text-orange-600 border-orange-200',
        description: '单元测试, 自动化测试, 性能测试',
        subCategories: [
            { id: 'unit', name: '单元测试', description: 'Jest, JUnit, Mocking', count: 36 },
            { id: 'e2e', name: 'E2E测试', description: 'Cypress, Selenium, Playwright', count: 28 },
            { id: 'performance', name: '性能测试', description: 'JMeter, LoadRunner', count: 15 },
        ]
    },
];

// 模拟题目数据
export const MOCK_QUESTIONS: Question[] = [
    { 
        id: '1', 
        title: '实现一个防抖函数 debounce', 
        difficulty: '中等', 
        tags: ['JavaScript', '手写题'], 
        passRate: '45%',
        content: `
### 题目描述

实现一个防抖函数 \`debounce\`，该函数接收两个参数：
1. \`fn\`：需要防抖执行的函数
2. \`delay\`：延迟执行的时间（毫秒）

当调用返回的函数时，如果距离上次调用时间少于 \`delay\`，则不执行 \`fn\`，并重新开始计时。只有当距离上次调用时间超过 \`delay\` 后，才会执行 \`fn\`。

### 示例

\`\`\`javascript
const log = debounce(() => console.log('Hello'), 1000);

log(); // 不输出
log(); // 不输出
// 1秒后输出 'Hello'
\`\`\`
        `,
        codeSnippet: `function debounce(fn, delay) {
  // 请在此处编写代码
}`,
        answer: `
### 参考答案

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}
\`\`\`

### 解析

1. **闭包**：利用闭包保存 \`timer\` 变量。
2. **清除定时器**：每次调用时，如果 \`timer\` 存在，说明上一次调用还在等待执行，需要清除它，重新计时。
3. **上下文绑定**：使用 \`apply\` 确保 \`fn\` 执行时的 \`this\` 指向正确。
        `
    },
    { 
        id: '2', 
        title: 'React Fiber 架构原理', 
        difficulty: '困难', 
        tags: ['React', '源码分析'], 
        passRate: '20%',
        content: `
### 题目描述

请简述 React Fiber 架构的主要设计思想，以及它解决了什么问题？

### 关键点
- 栈调和（Stack Reconciler）的问题
- 什么是 Fiber 节点
- 双缓存机制（Double Buffering）
- 时间切片（Time Slicing）
        `,
        answer: `
### 参考答案

React Fiber 是 React 16 引入的新的协调引擎。

#### 1. 解决的问题
在 React 15 及之前，更新过程是同步的（Stack Reconciler）。一旦开始更新，就会递归遍历组件树，直到更新完成。如果组件树很大，这个过程会占用主线程很长时间，导致页面掉帧、卡顿，无法响应用户的输入。

#### 2. 核心思想
Fiber 将更新任务分解为一个个小的任务单元（Fiber Node）。在执行完一个单元后，会检查剩余时间。如果时间不够，就暂停当前任务，将控制权交还给浏览器，让浏览器去处理优先级更高的任务（如渲染、用户输入）。等浏览器空闲了，再恢复执行。

#### 3. 关键机制
- **Fiber 节点**：虚拟 DOM 的升级版，包含了组件信息、副作用链表等。
- **链表结构**：Fiber 节点之间通过 \`return\` (父)、\`child\` (子)、\`sibling\` (兄) 指针连接，使得遍历可以中断和恢复。
- **双缓存**：在内存中构建一棵新的 Fiber 树（workInProgress tree），构建完成后，直接替换旧的树（current tree），减少渲染次数。
        `
    },
    { id: '3', title: 'CSS 实现水平垂直居中', difficulty: '简单', tags: ['CSS', '布局'], passRate: '85%' },
    { id: '4', title: 'Java 线程池参数详解', difficulty: '中等', tags: ['Java', '并发'], passRate: '50%' },
    { id: '5', title: 'TCP 三次握手过程', difficulty: '中等', tags: ['网络', '协议'], passRate: '60%' },
    { id: '6', title: 'Docker 镜像构建优化', difficulty: '困难', tags: ['Docker', '最佳实践'], passRate: '30%' },
    { id: '7', title: 'Vue 3 响应式原理', difficulty: '中等', tags: ['Vue', '源码'], passRate: '55%' },
    { id: '8', title: '两数之和', difficulty: '简单', tags: ['算法', '数组'], passRate: '90%' },
];
