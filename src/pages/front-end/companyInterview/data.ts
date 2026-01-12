export interface InterviewExp {
  id: string;
  companyName: string;
  logo: string;
  color: string;
  title: string;
  position: string;
  level: string;
  tags: string[];
  date: string;
  views: number;
  likes: number;
  author: string;
  avatar: string;
  difficulty: '简单' | '中等' | '困难';
  summary: string;
  content: string;
  accessType: 'normal' | 'free_limited' | 'vip';
}

export const interviewExperiences: InterviewExp[] = [
  {
    id: '1',
    companyName: '阿里巴巴',
    logo: 'A',
    color: '#ff6a00',
    title: '阿里淘系前端一面+二面+HR面面经，已Offer',
    position: '前端开发工程师',
    level: 'P6',
    tags: ['React', '性能优化', '微前端'],
    date: '2023-11-15',
    views: 1250,
    likes: 45,
    author: '前端小哥',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    difficulty: '困难',
    summary: '主要考察了项目难点、React 原理、Webpack 配置以及一些手写代码题。',
    accessType: 'free_limited',
    content: `## 一面 (电话面 45min)
1. 自我介绍
2. 项目中遇到的最大难点是什么？如何解决的？
3. React Fiber 架构的理解，解决了什么问题？
4. React Hooks 的原理，为什么不能在循环和判断中使用？
5. HTTP 缓存策略，强缓存和协商缓存的区别。
6. 手写一个防抖函数。

## 二面 (视频面 60min)
1. 深挖项目细节，微前端方案选型。
2. Webpack 构建流程，Loader 和 Plugin 的区别。
3. 性能优化做过哪些工作？指标有哪些？
4. 浏览器渲染原理，回流和重绘。
5. 手写 Promise.all。
6. 算法题：最长无重复子串。

## HR面 (20min)
1. 为什么离职？
2. 职业规划。
3. 期望薪资。
`
  },
  {
    id: '2',
    companyName: '字节跳动',
    logo: 'B',
    color: '#3d7eff',
    title: '字节抖音前端三轮技术面，挂在三面',
    position: '资深前端开发',
    level: '2-1',
    tags: ['Vue3', '音视频', '计算机网络'],
    date: '2023-12-01',
    views: 3400,
    likes: 120,
    author: '代码搬运工',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    difficulty: '困难',
    summary: '字节面试非常注重算法和计算机基础，三面考察了系统设计。',
    accessType: 'vip',
    content: '...'
  },
  {
    id: '3',
    companyName: '腾讯',
    logo: 'T',
    color: '#0052d9',
    title: '腾讯WXG前端一面凉经',
    position: '前端开发',
    level: 'T8',
    tags: ['Node.js', '小程序', '网络安全'],
    date: '2023-10-20',
    views: 890,
    likes: 12,
    author: 'CoderX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
    difficulty: '中等',
    summary: '问了很多网络相关的底层知识，TCP/IP，HTTPS握手过程等。',
    accessType: 'normal',
    content: '...'
  },
  {
    id: '4',
    companyName: '美团',
    logo: 'M',
    color: '#ffc300',
    title: '美团到店前端二面面经',
    position: '前端工程师',
    level: 'L7',
    tags: ['React Native', '跨端', '工程化'],
    date: '2023-11-28',
    views: 1560,
    likes: 56,
    author: 'MeiTuTuan',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
    difficulty: '中等',
    summary: '主要聊了跨端方案的优劣对比，以及在美团的实践。',
    accessType: 'vip',
    content: '...'
  },
  {
    id: '5',
    companyName: '京东',
    logo: 'J',
    color: '#e1251b',
    title: '京东零售前端一面面经',
    position: '前端开发',
    level: 'T4',
    tags: ['Vue2', 'Vue3', '源码'],
    date: '2023-12-05',
    views: 670,
    likes: 23,
    author: 'JD_Dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    difficulty: '简单',
    summary: '比较常规的八股文，Vue 双向绑定原理，NextTick 原理等。',
    accessType: 'normal',
    content: '...'
  },
    {
    id: '6',
    companyName: '快手',
    logo: 'K',
    color: '#ff4d4f',
    title: '快手主站前端一面+二面',
    position: '高级前端',
    level: 'K3A',
    tags: ['WebGL', '图形学', 'Canvas'],
    date: '2023-12-10',
    views: 2100,
    likes: 88,
    author: 'GraphicsGeek',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    difficulty: '困难',
    summary: '因为岗位涉及图形学，问了很多矩阵变换、Shader 相关的知识。',
    accessType: 'vip',
    content: '...'
  }
];
