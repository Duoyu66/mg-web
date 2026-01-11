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
  row: number;
  col: number;
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
    row: 1,
    col: 2,
    next: ['js'],
    type: 'milestone',
    status: 'completed'
  },
  {
    id: 'js',
    title: 'JavaScript',
    description: 'Web 的编程语言，实现交互和动态功能',
    icon: FileCode2,
    row: 2,
    col: 2,
    next: ['ts', 'react', 'vue'],
    type: 'milestone',
    status: 'learning'
  },
  {
    id: 'ts',
    title: 'TypeScript',
    description: 'JavaScript 的超集，提供静态类型检查',
    icon: Braces,
    row: 3,
    col: 2,
    next: ['build-tools'],
    status: 'pending'
  },
  {
    id: 'react',
    title: 'React',
    description: '用于构建用户界面的 JavaScript 库',
    icon: Code2,
    row: 3,
    col: 1,
    next: ['state-management'],
    status: 'pending'
  },
  {
    id: 'vue',
    title: 'Vue.js',
    description: '渐进式 JavaScript 框架',
    icon: Palette,
    row: 3,
    col: 3,
    next: ['state-management'],
    status: 'pending'
  },
  {
    id: 'state-management',
    title: '状态管理',
    description: 'Redux, MobX, Pinia, Zustand',
    icon: Box,
    row: 4,
    col: 2,
    next: ['build-tools'],
    status: 'pending'
  },
  {
    id: 'build-tools',
    title: '构建工具',
    description: 'Webpack, Vite, Rollup',
    icon: HammerIcon,
    row: 5,
    col: 2,
    next: ['nextjs'],
    status: 'pending'
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    description: 'React 框架，支持 SSR 和 SSG',
    icon: Globe,
    row: 6,
    col: 2,
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
    row: 1,
    col: 2,
    next: ['db'],
    type: 'milestone',
    status: 'completed'
  },
  {
    id: 'db',
    title: '数据库',
    description: 'MySQL, PostgreSQL, MongoDB',
    icon: Database,
    row: 2,
    col: 2,
    next: ['api'],
    type: 'milestone',
    status: 'learning'
  },
  {
    id: 'api',
    title: 'API 设计',
    description: 'RESTful, GraphQL, gRPC',
    icon: Server,
    row: 3,
    col: 2,
    next: ['auth', 'cache'],
    status: 'pending'
  },
  {
    id: 'auth',
    title: '认证与授权',
    description: 'JWT, OAuth2, SSO',
    icon: ShieldCheck,
    row: 4,
    col: 1,
    next: ['mq'],
    status: 'pending'
  },
  {
    id: 'cache',
    title: '缓存',
    description: 'Redis, Memcached',
    icon: Cpu,
    row: 4,
    col: 3,
    next: ['mq'],
    status: 'pending'
  },
  {
    id: 'mq',
    title: '消息队列',
    description: 'RabbitMQ, Kafka, RocketMQ',
    icon: GitBranch,
    row: 5,
    col: 2,
    next: ['microservices'],
    status: 'pending'
  },
  {
    id: 'microservices',
    title: '微服务架构',
    description: 'Spring Cloud, Dubbo, Service Mesh',
    icon: Cloud,
    row: 6,
    col: 2,
    next: ['devops'],
    status: 'pending'
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Docker, Kubernetes, CI/CD',
    icon: Container,
    row: 7,
    col: 2,
    next: [],
    type: 'milestone',
    status: 'pending'
  }
];

// Helper component for icon used above that wasn't imported
function HammerIcon(props: any) {
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
