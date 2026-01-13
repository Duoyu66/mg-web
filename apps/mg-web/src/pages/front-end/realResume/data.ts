export interface Resume {
  id: string;
  name: string;
  role: string;
  years: string;
  tags: string[];
  intro: string;
  phone: string;
  email: string;
  location: string;
  github: string;
  education: { school: string; time: string; major: string; degree: string }[];
  skills: string[];
  skillsDesc: string[];
  workExperience: { company: string; time: string; role: string; desc: string[] }[];
  projects: { name: string; tech: string; desc: string; role: string[] }[];
}

export const resumeList: Resume[] = [
  {
    id: '1',
    name: '张三',
    role: '前端开发工程师',
    years: '2年',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    intro: '热爱编程，对新技术保持敏感，具备良好的代码规范和文档编写习惯。',
    phone: '138-0013-8000',
    email: 'zhangsan@example.com',
    location: '北京·朝阳',
    github: 'github.com/zhangsan',
    education: [
      { school: '某某理工大学', time: '2018.09 - 2022.06', major: '软件工程', degree: '本科' }
    ],
    skills: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Vue3', 'Node.js', 'Webpack'],
    skillsDesc: [
      '熟练掌握 React 全家桶，深入理解 Hooks 原理及虚拟 DOM 机制。',
      '熟悉 Vue3 + Vite 开发模式，有大型后台管理系统开发经验。',
      '掌握 TypeScript 类型系统，能够编写类型安全的代码。',
      '了解 Node.js 服务端开发，使用过 NestJS/Express 框架。'
    ],
    workExperience: [
      {
        company: '某某互联网科技公司',
        time: '2022.07 - 至今',
        role: '前端开发工程师',
        desc: [
          '负责公司核心 SaaS 平台的前端重构工作，将技术栈从 jQuery 迁移至 React + TS。',
          '设计并封装通用组件库，包含 30+ 业务组件，提升团队开发效率 40%。',
          '优化首屏加载速度，通过路由懒加载、图片压缩等手段，将 FCP 从 1.8s 降低至 0.8s。'
        ]
      }
    ],
    projects: [
      {
        name: '企业级低代码搭建平台',
        tech: 'React + TypeScript + DnD',
        desc: '一款面向非技术人员的页面搭建工具，通过拖拽组件快速生成营销页面。',
        role: [
          '设计组件Schema协议，实现组件属性的可视化配置。',
          '使用 React-DnD 实现画布区的自由拖拽与嵌套布局。'
        ]
      }
    ]
  },
  {
    id: '2',
    name: '李四',
    role: 'Java后端开发工程师',
    years: '3年',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    intro: '专注于高并发系统设计，熟悉微服务架构。',
    phone: '139-1234-5678',
    email: 'lisi@example.com',
    location: '上海·浦东',
    github: 'github.com/lisi',
    education: [
      { school: '某某科技大学', time: '2017.09 - 2021.06', major: '计算机科学与技术', degree: '本科' }
    ],
    skills: ['Java', 'Spring Boot', 'Spring Cloud', 'MyBatis', 'MySQL', 'Redis', 'Docker'],
    skillsDesc: [
      '精通 Java 核心技术，熟悉 JVM 调优。',
      '熟练使用 Spring Boot/Cloud 构建微服务架构。',
      '熟悉 MySQL 数据库设计与优化，了解 Redis 缓存策略。',
      '了解 Docker/K8s 容器化部署。'
    ],
    workExperience: [
      {
        company: '某知名电商公司',
        time: '2021.07 - 至今',
        role: 'Java开发工程师',
        desc: [
          '参与电商交易系统的核心链路开发，负责订单模块和支付模块。',
          '针对双11大促进行系统压测与优化，支撑 TPS 达到 5000+。',
          '引入 Redis 缓存热点数据，降低数据库压力 60%。'
        ]
      }
    ],
    projects: [
      {
        name: '分布式电商交易系统',
        tech: 'Spring Cloud + Nacos + RocketMQ',
        desc: '基于微服务架构的电商交易平台，包含商品、订单、支付、库存等模块。',
        role: [
          '负责订单状态机的设计与实现，确保订单状态流转的正确性。',
          '使用 RocketMQ 实现分布式事务，保证数据一致性。'
        ]
      }
    ]
  },
  {
    id: '3',
    name: '王五',
    role: '全栈开发工程师',
    years: '5年',
    tags: ['Node.js', 'React', 'Go', 'DevOps'],
    intro: '追求极致的全栈工程师，喜欢折腾各种新技术。',
    phone: '136-6666-8888',
    email: 'wangwu@example.com',
    location: '深圳·南山',
    github: 'github.com/wangwu',
    education: [
      { school: '某某大学', time: '2015.09 - 2019.06', major: '通信工程', degree: '本科' }
    ],
    skills: ['JavaScript', 'Go', 'Python', 'React', 'Node.js', 'Linux', 'AWS'],
    skillsDesc: [
      '具备扎实的前端基础，熟练使用 React/Vue 进行复杂应用开发。',
      '熟悉 Node.js 和 Go 语言，能够独立开发高性能后端服务。',
      '熟悉 Linux 运维和 CI/CD 流程，能够搭建自动化部署流水线。'
    ],
    workExperience: [
      {
        company: '某初创科技公司',
        time: '2019.07 - 至今',
        role: '高级全栈工程师',
        desc: [
          '作为核心成员从0到1搭建公司技术架构，涵盖前端、后端及运维。',
          '主导研发协作平台的开发，集成代码托管、任务管理、文档协作等功能。',
          '负责团队技术选型与培训，制定代码规范与开发流程。'
        ]
      }
    ],
    projects: [
      {
        name: '研发协作平台',
        tech: 'React + NestJS + PostgreSQL',
        desc: '一站式研发管理平台，提升团队协作效率。',
        role: [
          '基于 NestJS 搭建微服务后端，使用 gRPC 进行服务间通信。',
          '前端采用 React + Ant Design Pro，实现复杂的权限管理与数据展示。'
        ]
      }
    ]
  },
    {
    id: '4',
    name: '赵六',
    role: 'UI/UX 设计师',
    years: '4年',
    tags: ['Figma', 'Sketch', 'Adobe XD', 'User Research'],
    intro: '注重用户体验，擅长简洁、直观的界面设计。',
    phone: '137-7777-9999',
    email: 'zhaoliu@example.com',
    location: '杭州·西湖',
    github: 'dribbble.com/zhaoliu',
    education: [
      { school: '某某美术学院', time: '2016.09 - 2020.06', major: '视觉传达设计', degree: '本科' }
    ],
    skills: ['Figma', 'Sketch', 'Photoshop', 'Illustrator', 'Principle', 'HTML/CSS'],
    skillsDesc: [
      '精通 Figma/Sketch 等界面设计工具，具备构建 Design System 的能力。',
      '熟悉用户研究方法，能够进行用户访谈、可用性测试等。',
      '了解前端基础知识，能够与开发人员高效沟通。'
    ],
    workExperience: [
      {
        company: '某知名互联网金融公司',
        time: '2020.07 - 至今',
        role: '高级UI设计师',
        desc: [
          '负责公司核心 App 的 UI/UX 设计，提升用户留存率 20%。',
          '主导设计规范的制定与落地，统一全线产品的视觉风格。',
          '参与新产品的概念设计与原型验证，快速迭代产品方案。'
        ]
      }
    ],
    projects: [
      {
        name: '金融理财 App 改版',
        tech: 'Figma + Principle',
        desc: '对现有 App 进行全面改版，提升视觉体验与操作流畅度。',
        role: [
          '进行竞品分析与用户调研，确定改版方向。',
          '输出高保真设计稿与交互动效，配合开发还原设计细节。'
        ]
      }
    ]
  },
    {
    id: '5',
    name: '孙七',
    role: '测试开发工程师',
    years: '3年',
    tags: ['Python', 'Selenium', 'JMeter', 'CI/CD'],
    intro: '致力于提升软件质量，擅长自动化测试与性能测试。',
    phone: '135-5555-2222',
    email: 'sunqi@example.com',
    location: '成都·高新',
    github: 'github.com/sunqi',
    education: [
      { school: '某某电子科技大学', time: '2017.09 - 2021.06', major: '软件测试', degree: '本科' }
    ],
    skills: ['Python', 'Java', 'Selenium', 'Appium', 'JMeter', 'Jenkins', 'MySQL'],
    skillsDesc: [
      '熟练使用 Python/Java 编写自动化测试脚本。',
      '熟悉 Selenium/Appium 等自动化测试框架。',
      '掌握 JMeter 进行性能测试与分析。',
      '熟悉 CI/CD 流程，能够配置 Jenkins 自动化构建任务。'
    ],
    workExperience: [
      {
        company: '某大型软件外包公司',
        time: '2021.07 - 至今',
        role: '测试开发工程师',
        desc: [
          '负责多个项目的自动化测试工作，覆盖 Web、App、API 等端。',
          '搭建自动化测试平台，支持用例管理、定时执行、报告生成等功能。',
          '参与性能测试，发现并定位多个系统性能瓶颈。'
        ]
      }
    ],
    projects: [
      {
        name: '自动化测试平台',
        tech: 'Django + Vue + Selenium',
        desc: '一站式自动化测试管理平台，提升测试效率。',
        role: [
          '负责后端接口开发与测试引擎封装。',
          '集成 Jenkins 实现测试任务的自动触发与执行。'
        ]
      }
    ]
  }
];
