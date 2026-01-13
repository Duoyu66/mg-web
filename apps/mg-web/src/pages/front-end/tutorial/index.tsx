import React, { useMemo, useState } from 'react';
import { Input, Tag, Card, Button, Tabs } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Server, Cog, Database, Cloud, Shield, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const TutorialPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [activeKey, setActiveKey] = useState<'frontend' | 'backend' | 'ops'>('frontend');

  const data = {
    frontend: [
      { title: '基础', icon: <Code2 className="text-blue-500" />, points: ['HTML', 'CSS', 'JavaScript', 'ES6+', 'TypeScript', '浏览器原理', 'HTTP/HTTPS'] },
      { title: '框架', icon: <Code2 className="text-indigo-500" />, points: ['React', 'Vue3', 'Redux/RTK', 'Pinia', 'Next.js', 'Vite', 'Webpack'] },
      { title: '工程化', icon: <Terminal className="text-teal-500" />, points: ['Monorepo', 'ESLint', 'Prettier', 'Husky', 'CI/CD', 'Vitest', 'Playwright'] },
      { title: '性能优化', icon: <Cloud className="text-cyan-500" />, points: ['SSR/CSR', '同构渲染', '缓存策略', 'Tree Shaking', '代码分割', '图片优化'] },
      { title: '可视化', icon: <Database className="text-rose-500" />, points: ['ECharts', 'D3', 'Prism', 'Monaco Editor'] },
      { title: '跨端', icon: <Cloud className="text-emerald-500" />, points: ['PWA', 'React Native', 'Electron'] },
    ],
    backend: [
      { title: '语言与运行时', icon: <Server className="text-blue-500" />, points: ['Node.js', 'TypeScript', 'Go', 'Java'] },
      { title: '框架', icon: <Server className="text-indigo-500" />, points: ['Express', 'NestJS', 'Spring Boot'] },
      { title: '数据存储', icon: <Database className="text-amber-500" />, points: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'] },
      { title: 'ORM/访问层', icon: <Database className="text-lime-500" />, points: ['Prisma', 'TypeORM', 'Sequelize'] },
      { title: '通信与架构', icon: <Cloud className="text-cyan-500" />, points: ['REST', 'GraphQL', 'gRPC', '微服务', '消息队列', 'Kafka', 'RabbitMQ'] },
      { title: '安全与认证', icon: <Shield className="text-red-500" />, points: ['JWT', 'OAuth2', 'RBAC', 'CSRF/XSS'] },
    ],
    ops: [
      { title: '系统基础', icon: <Cog className="text-blue-500" />, points: ['Linux', 'Shell', '系统权限', '网络基础'] },
      { title: '容器与编排', icon: <Cloud className="text-indigo-500" />, points: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm'] },
      { title: '网络与网关', icon: <Server className="text-teal-500" />, points: ['Nginx', 'Ingress', 'Service Mesh'] },
      { title: 'CI/CD', icon: <Terminal className="text-amber-500" />, points: ['GitHub Actions', 'Jenkins', 'GitLab CI'] },
      { title: '可观测性', icon: <Database className="text-rose-500" />, points: ['Prometheus', 'Grafana', 'OpenTelemetry', 'ELK'] },
      { title: '安全与合规', icon: <Shield className="text-red-500" />, points: ['TLS/HTTPS', '零信任', '密钥管理', '审计'] },
    ],
  };

  const tabs = [
    { key: 'frontend', label: '前端' },
    { key: 'backend', label: '后端' },
    { key: 'ops', label: '运维' },
  ] as const;

  const filtered = useMemo(() => {
    const list = data[activeKey];
    if (!searchText) return list;
    const s = searchText.toLowerCase();
    return list
      .map(section => ({
        ...section,
        points: section.points.filter(p => p.toLowerCase().includes(s)),
      }))
      .filter(section => section.points.length > 0);
  }, [activeKey, searchText]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            教程中心
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            按领域组织的知识点清单，支持搜索与快速导航
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Tabs
            activeKey={activeKey}
            onChange={(k) => setActiveKey(k as typeof activeKey)}
            items={tabs.map(t => ({ key: t.key, label: t.label }))}
          />
          <div className="max-w-md w-full md:w-[360px]">
            <Search
              allowClear
              placeholder="搜索知识点..."
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((section) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="rounded-2xl shadow-sm hover:shadow-xl transition-all dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  title={
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                        {section.icon}
                      </div>
                      <span className="font-semibold">{section.title}</span>
                    </div>
                  }
                  extra={
                    <Button type="link" onClick={() => navigate('/front/route')}>
                      查看路线
                    </Button>
                  }
                >
                  <div className="flex flex-wrap gap-2">
                    {section.points.map((p) => (
                      <Tag key={p} color="blue" className="rounded-full">
                        {p}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TutorialPage;

