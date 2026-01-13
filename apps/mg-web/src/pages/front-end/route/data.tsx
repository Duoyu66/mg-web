import React from 'react';
import { 
  FileCode2, 
  Palette, 
  Braces, 
  Globe, 
  Box, 
  Cpu, 
  Database, 
  Server, 
  Cloud, 
  ShieldCheck, 
  Layout, 
  Terminal, 
  GitBranch, 
  Container, 
  Code2
} from 'lucide-react';

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  order: number;
  next?: string[];
  type?: 'default' | 'milestone' | 'choice';
  status?: 'pending' | 'learning' | 'completed';
}

export const frontendRoadmap: RoadmapNode[] = [
  {
    id: 'html-css',
    title: 'HTML & CSS',
    description: 'Web 开发的基础，构建网页结构和样式',
    icon: Layout,
    order: 1,
    next: ['js'],
    type: 'milestone',
    status: 'completed'
  },
  {
    id: 'js',
    title: 'JavaScript',
    description: 'Web 的编程语言，实现交互和动态功能',
    icon: FileCode2,
    order: 2,
    next: ['ts', 'react', 'vue'],
    type: 'milestone',
    status: 'learning'
  },
  {
    id: 'ts',
    title: 'TypeScript',
    description: 'JavaScript 的超集，提供静态类型检查',
    icon: Braces,
    order: 3,
    next: ['build-tools'],
    status: 'pending'
  },
  {
    id: 'react',
    title: 'React',
    description: '用于构建用户界面的 JavaScript 库',
    icon: Code2,
    order: 4,
    next: ['state-management'],
    status: 'pending'
  },
  {
    id: 'vue',
    title: 'Vue.js',
    description: '渐进式 JavaScript 框架',
    icon: Palette,
    order: 5,
    next: ['state-management'],
    status: 'pending'
  },
  {
    id: 'state-management',
    title: '状态管理',
    description: 'Redux, MobX, Pinia, Zustand',
    icon: Box,
    order: 6,
    next: ['build-tools'],
    status: 'pending'
  },
  {
    id: 'build-tools',
    title: '构建工具',
    description: 'Webpack, Vite, Rollup',
    icon: HammerIcon,
    order: 7,
    next: ['nextjs'],
    status: 'pending'
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    description: 'React 框架，支持 SSR 和 SSG',
    icon: Globe,
    order: 8,
    next: [],
    type: 'milestone',
    status: 'pending'
  }
];

export const backendRoadmap: RoadmapNode[] = [
  {
    id: 'lang',
    title: '编程语言',
    description: 'Java, Go, Python, Node.js',
    icon: Terminal,
    order: 1,
    next: ['db'],
    type: 'milestone',
    status: 'completed'
  },
  {
    id: 'db',
    title: '数据库',
    description: 'MySQL, PostgreSQL, MongoDB',
    icon: Database,
    order: 2,
    next: ['api'],
    type: 'milestone',
    status: 'learning'
  },
  {
    id: 'api',
    title: 'API 设计',
    description: 'RESTful, GraphQL, gRPC',
    icon: Server,
    order: 3,
    next: ['auth', 'cache'],
    status: 'pending'
  },
  {
    id: 'auth',
    title: '认证与授权',
    description: 'JWT, OAuth2, SSO',
    icon: ShieldCheck,
    order: 4,
    next: ['mq'],
    status: 'pending'
  },
  {
    id: 'cache',
    title: '缓存',
    description: 'Redis, Memcached',
    icon: Cpu,
    order: 5,
    next: ['mq'],
    status: 'pending'
  },
  {
    id: 'mq',
    title: '消息队列',
    description: 'RabbitMQ, Kafka, RocketMQ',
    icon: GitBranch,
    order: 6,
    next: ['microservices'],
    status: 'pending'
  },
  {
    id: 'microservices',
    title: '微服务架构',
    description: 'Spring Cloud, Dubbo, Service Mesh',
    icon: Cloud,
    order: 7,
    next: ['devops'],
    status: 'pending'
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Docker, Kubernetes, CI/CD',
    icon: Container,
    order: 8,
    next: [],
    type: 'milestone',
    status: 'pending'
  }
];

export interface RoadmapDoc {
  id: string;
  title: string;
  summary: string;
  why: string[];
  core: { title: string; points: string[] }[];
  checklist: string[];
  resources: { title: string; url: string }[];
  content?: string;
}

export const ROADMAP_DOCS: Record<string, RoadmapDoc> = {
  'html-css': {
    id: 'html-css',
    title: 'HTML & CSS',
    summary: '掌握语义化结构、布局与响应式，能独立还原常见页面。',
    why: [
      '所有前端能力都建立在结构与样式之上',
      '面试高频：BFC、Flex/Grid、响应式、层叠与优先级'
    ],
    core: [
      { title: 'HTML 基础', points: ['语义化标签', '表单与可访问性', 'SEO 基础'] },
      { title: 'CSS 核心', points: ['盒模型与层叠', 'Flex/Grid 布局', '响应式与媒体查询'] }
    ],
    checklist: ['能还原 3 个中等复杂度页面', '能写出 Flex/Grid 两套布局', '能处理移动端适配'],
    resources: [
      { title: 'MDN: HTML', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML' },
      { title: 'MDN: CSS', url: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS' }
    ]
  },
  js: {
    id: 'js',
    title: 'JavaScript',
    summary: '掌握语言机制、异步模型与工程化写法，能写出可维护业务逻辑。',
    why: [
      '浏览器端核心编程语言，决定上限',
      '面试高频：作用域/闭包、原型链、事件循环、Promise'
    ],
    core: [
      { title: '语言机制', points: ['类型与转换', '作用域与闭包', '原型与继承'] },
      { title: '异步', points: ['事件循环', 'Promise/async-await', '错误处理'] }
    ],
    checklist: ['手写 Promise.all/节流防抖', '能解释事件循环执行顺序', '能做模块拆分与复用'],
    resources: [
      { title: 'MDN: JavaScript', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript' }
    ],
    content: [
      '## 概览',
      '',
      'JavaScript 是浏览器端的核心编程语言，负责交互与业务逻辑。',
      '',
      '## 为什么学',
      '- 决定前端开发的上限',
      '- 面试高频：作用域/闭包、原型链、事件循环、Promise',
      '',
      '## 核心知识',
      '**语言机制**：类型与转换、作用域与闭包、原型与继承',
      '',
      '**异步**：事件循环、Promise/async-await、错误处理',
      '',
      '```js',
      'function sleep(ms) {',
      '  return new Promise(resolve => setTimeout(resolve, ms));',
      '}',
      '',
      'async function run() {',
      '  console.log(\"start\");',
      '  await sleep(500);',
      '  console.log(\"end\");',
      '}',
      '```',
      '',
      '## 学习清单',
      '- 手写 Promise.all/节流防抖',
      '- 能解释事件循环执行顺序',
      '- 能做模块拆分与复用',
      '',
      '## 推荐资源',
      '- [MDN: JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)'
    ].join('\n')
  },
  ts: {
    id: 'ts',
    title: 'TypeScript',
    summary: '用类型系统约束边界，提升可维护性与协作效率。',
    why: ['大型项目必备', '减少线上低级错误'],
    core: [
      { title: '类型系统', points: ['泛型', '联合/交叉', '类型收窄'] },
      { title: '工程实践', points: ['类型建模', '类型与运行时分离', '声明文件与第三方库类型'] }
    ],
    checklist: ['能为接口层建模', '能写 3 个常用泛型工具类型', '能解决常见类型报错'],
    resources: [
      { title: 'TypeScript 官网', url: 'https://www.typescriptlang.org/' }
    ]
  },
  react: {
    id: 'react',
    title: 'React',
    summary: '掌握组件化、Hooks 与性能优化，能独立实现中型页面与状态流。',
    why: ['生态成熟、岗位多', '面试高频：Hooks、渲染机制、性能优化'],
    core: [
      { title: '基础', points: ['组件与 JSX', 'Hooks', '受控/非受控'] },
      { title: '进阶', points: ['状态管理', '性能优化', '路由与数据请求'] }
    ],
    checklist: ['能拆出可复用组件', '能定位重复渲染', '能写自定义 Hook'],
    resources: [
      { title: 'React 官方文档', url: 'https://react.dev/' }
    ]
  },
  vue: {
    id: 'vue',
    title: 'Vue.js',
    summary: '掌握响应式原理与组件通信，能独立实现常见业务页面。',
    why: ['国内生态强', '面试高频：响应式、diff、组件通信'],
    core: [
      { title: '基础', points: ['模板语法', '响应式', '组件通信'] },
      { title: '进阶', points: ['组合式 API', '性能优化', '路由与状态管理'] }
    ],
    checklist: ['能实现常见表单/列表页面', '能写组合式复用逻辑', '能处理组件通信'],
    resources: [
      { title: 'Vue 官方文档', url: 'https://vuejs.org/' }
    ]
  },
  'state-management': {
    id: 'state-management',
    title: '状态管理',
    summary: '建立清晰的数据流与边界，避免状态失控。',
    why: ['复杂业务需要统一数据流', '可测试、可维护'],
    core: [
      { title: '思维模型', points: ['单向数据流', '状态分层', '副作用管理'] },
      { title: '工具', points: ['Redux/RTK', 'Zustand', 'Pinia'] }
    ],
    checklist: ['能把页面状态与全局状态拆开', '能处理异步请求与缓存', '能写可复用 store'],
    resources: [
      { title: 'Zustand', url: 'https://github.com/pmndrs/zustand' }
    ]
  },
  'build-tools': {
    id: 'build-tools',
    title: '构建工具',
    summary: '理解现代前端工程化：模块、打包、开发服务器与性能。',
    why: ['排查构建问题必备', '优化首屏与包体积'],
    core: [
      { title: '基础', points: ['模块规范', '打包产物', '开发服务器'] },
      { title: '优化', points: ['代码分割', '缓存与压缩', '分析与体积优化'] }
    ],
    checklist: ['能解释 Vite 与 Webpack 差异', '能做一次基础性能优化', '能读懂构建日志'],
    resources: [
      { title: 'Vite', url: 'https://vite.dev/' }
    ]
  },
  nextjs: {
    id: 'nextjs',
    title: 'Next.js',
    summary: '掌握 SSR/SSG 与路由/数据获取，构建完整产品级应用。',
    why: ['全栈/中大型项目常用', 'SEO 与性能能力强'],
    core: [
      { title: '渲染模式', points: ['CSR/SSR/SSG', '缓存与增量静态生成'] },
      { title: '工程实践', points: ['路由与布局', '数据获取', '部署'] }
    ],
    checklist: ['能做一个带鉴权的后台', '能做静态站点与增量更新', '能部署上线'],
    resources: [
      { title: 'Next.js', url: 'https://nextjs.org/' }
    ]
  },
  lang: {
    id: 'lang',
    title: '编程语言',
    summary: '选择一门主语言并打牢基础，形成稳定的编码与调试能力。',
    why: ['决定你解决问题的“工具箱”', '面试与工作都会围绕语言能力展开'],
    core: [
      { title: '必备能力', points: ['语法与标准库', '数据结构与复杂度', '调试与测试'] },
      { title: '进阶方向', points: ['并发模型', '性能分析', '工程与规范'] }
    ],
    checklist: ['能完成常见 CRUD 服务', '能定位 3 类常见线上问题', '能写基础单测并通过 CI'],
    resources: [
      { title: 'The Rust Book（示例：写作与工程化参考）', url: 'https://doc.rust-lang.org/book/' }
    ]
  },
  db: {
    id: 'db',
    title: '数据库',
    summary: '理解关系型/非关系型选择、索引与事务，能设计可扩展的数据模型。',
    why: ['性能与稳定性根源在数据层', '面试高频：索引、事务隔离级别、慢查询'],
    core: [
      { title: '关系型核心', points: ['表设计与范式', '索引与执行计划', '事务与锁'] },
      { title: '扩展能力', points: ['读写分离', '分库分表', '备份与恢复'] }
    ],
    checklist: ['能写出合理索引', '能分析慢查询', '能解释事务隔离与锁'],
    resources: [
      { title: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
      { title: 'MySQL Docs', url: 'https://dev.mysql.com/doc/' }
    ]
  },
  api: {
    id: 'api',
    title: 'API 设计',
    summary: '掌握 REST 设计、版本与错误模型，能定义清晰、可演进的接口。',
    why: ['决定前后端协作效率', '影响可维护性与可测试性'],
    core: [
      { title: 'REST 基础', points: ['资源建模', 'HTTP 方法与状态码', '幂等与分页'] },
      { title: '工程化', points: ['统一错误码', '接口文档与 Mock', 'OpenAPI/SDK 生成'] }
    ],
    checklist: ['能设计列表/详情/搜索接口', '能统一错误返回', '能写 OpenAPI 并生成类型'],
    resources: [
      { title: 'HTTP Semantics (RFC 9110)', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
      { title: 'OpenAPI', url: 'https://www.openapis.org/' }
    ]
  },
  auth: {
    id: 'auth',
    title: '认证与授权',
    summary: '理解身份认证与权限控制，能实现安全、可扩展的登录体系。',
    why: ['所有业务都需要安全边界', '面试高频：JWT、OAuth2、权限模型'],
    core: [
      { title: '认证', points: ['Session/Cookie', 'JWT', '刷新 Token 方案'] },
      { title: '授权', points: ['RBAC', 'ABAC', '权限缓存与一致性'] }
    ],
    checklist: ['能实现登录与刷新 Token', '能做 RBAC 权限校验', '能处理登出与吊销'],
    resources: [
      { title: 'OAuth 2.0', url: 'https://oauth.net/2/' }
    ]
  },
  cache: {
    id: 'cache',
    title: '缓存',
    summary: '通过缓存提升性能，并理解一致性与失效策略带来的复杂度。',
    why: ['性能优化常用手段', '面试高频：缓存击穿/雪崩/穿透'],
    core: [
      { title: '策略', points: ['TTL 与失效', '预热与淘汰', '多级缓存'] },
      { title: '一致性', points: ['缓存与 DB 一致性', '延迟双删', '消息驱动更新'] }
    ],
    checklist: ['能处理穿透/击穿/雪崩', '能选用合适缓存粒度', '能设计一致性方案'],
    resources: [
      { title: 'Redis', url: 'https://redis.io/docs/latest/' }
    ]
  },
  mq: {
    id: 'mq',
    title: '消息队列',
    summary: '用异步化、削峰与解耦提升系统吞吐，并处理可靠投递。',
    why: ['高并发场景必备', '面试高频：重复消费、顺序、事务消息'],
    core: [
      { title: '模型', points: ['发布订阅', '消费者组', '顺序与分区'] },
      { title: '可靠性', points: ['至少一次/至多一次', '重试与死信', '幂等与去重'] }
    ],
    checklist: ['能处理重复消费', '能设计重试/死信', '能做链路追踪与监控'],
    resources: [
      { title: 'Kafka', url: 'https://kafka.apache.org/documentation/' }
    ]
  },
  microservices: {
    id: 'microservices',
    title: '微服务架构',
    summary: '拆分服务与治理能力，控制复杂度并保障可观测与稳定性。',
    why: ['大型系统常见形态', '面试高频：服务治理、限流熔断、分布式事务'],
    core: [
      { title: '治理', points: ['注册发现', '配置中心', '限流熔断'] },
      { title: '可观测', points: ['日志/指标/链路', '告警', '灰度发布'] }
    ],
    checklist: ['能设计服务边界', '能做基础治理能力', '能搭建可观测体系'],
    resources: [
      { title: 'OpenTelemetry', url: 'https://opentelemetry.io/' }
    ]
  },
  devops: {
    id: 'devops',
    title: 'DevOps',
    summary: '通过容器化与流水线提升交付效率，形成可重复、可回滚的发布体系。',
    why: ['上线与稳定性是工程的终点', '面试高频：Docker、CI/CD、K8s'],
    core: [
      { title: '容器化', points: ['Dockerfile', '镜像分层', '安全与体积优化'] },
      { title: '交付', points: ['CI/CD 流水线', '灰度/回滚', '环境隔离'] }
    ],
    checklist: ['能写出可用 Dockerfile', '能搭建基础 CI/CD', '能做回滚与发布策略'],
    resources: [
      { title: 'Docker Docs', url: 'https://docs.docker.com/' },
      { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/' }
    ]
  }
};

function HammerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
      <path d="M17.64 15 22 10.64" />
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V2.75A.75.75 0 0 0 18 2h-5.45c-.85 0-1.65.33-2.25.93l-1.25 1.25a3.5 3.5 0 0 0-.06 4.89c.03.03.06.06.09.09L15 15" />
    </svg>
  );
}
