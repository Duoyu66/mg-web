import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tag, Button } from 'antd';
import { frontendRoadmap, backendRoadmap, RoadmapNode } from './data';
import Learning from './Learning';
import { ChevronRight } from 'lucide-react';

const staticQuestions = [
  {
    id: 'q1',
    title: '关于 JavaScript 闭包，下面说法正确的是？',
    difficulty: 'simple',
    type: '1',
    items: [
      { optionName: 'A', optionValue: '闭包只能在全局作用域中创建' },
      { optionName: 'B', optionValue: '闭包可以访问其外层函数作用域中的变量' },
      { optionName: 'C', optionValue: '闭包无法访问函数参数' },
      { optionName: 'D', optionValue: '闭包在函数执行完毕后会立刻被销毁' },
    ],
  },
  {
    id: 'q2',
    title: '下面哪个不是 React 中常见的 Hook？',
    difficulty: 'simple',
    type: '1',
    items: [
      { optionName: 'A', optionValue: 'useState' },
      { optionName: 'B', optionValue: 'useEffect' },
      { optionName: 'C', optionValue: 'useClass' },
      { optionName: 'D', optionValue: 'useMemo' },
    ],
  },
  {
    id: 'q3',
    title: '关于 HTTP 状态码 200、301、404、500 的说法，正确的是？',
    difficulty: 'medium',
    type: '1',
    items: [
      { optionName: 'A', optionValue: '200 表示客户端请求语法错误' },
      { optionName: 'B', optionValue: '301 表示永久重定向' },
      { optionName: 'C', optionValue: '404 表示服务器内部错误' },
      { optionName: 'D', optionValue: '500 表示资源已被永久移动' },
    ],
  },
  {
    id: 'q4',
    title: '关于 CSS Flex 布局，下面说法正确的是？',
    difficulty: 'medium',
    type: '1',
    items: [
      { optionName: 'A', optionValue: 'flex-direction 只能取 row 和 column' },
      { optionName: 'B', optionValue: 'justify-content 控制交叉轴对齐方式' },
      { optionName: 'C', optionValue: 'align-items 控制主轴对齐方式' },
      { optionName: 'D', optionValue: 'flex: 1 表示元素可以按剩余空间等比拉伸' },
    ],
  },
  {
    id: 'q5',
    title: '在 TypeScript 中，关于 any、unknown、never 的说法，正确的是？',
    difficulty: 'medium',
    type: '1',
    items: [
      { optionName: 'A', optionValue: 'any 比 unknown 更安全' },
      { optionName: 'B', optionValue: 'unknown 不能被赋值给其他类型' },
      { optionName: 'C', optionValue: 'never 通常用于表示不会返回的函数' },
      { optionName: 'D', optionValue: 'never 可以赋值给任何类型' },
    ],
  },
  {
    id: 'q6',
    title: '下面哪一项不是常见的前端性能优化手段？',
    difficulty: 'simple',
    type: '1',
    items: [
      { optionName: 'A', optionValue: '资源压缩与合并' },
      { optionName: 'B', optionValue: '使用 CDN 加速静态资源' },
      { optionName: 'C', optionValue: '在主线程中执行大量同步计算' },
      { optionName: 'D', optionValue: '按需加载路由和组件' },
    ],
  },
  {
    id: 'q7',
    title: '关于浏览器本地存储，下面说法正确的是？',
    difficulty: 'simple',
    type: '1',
    items: [
      { optionName: 'A', optionValue: 'localStorage 只能在会话期间生效' },
      { optionName: 'B', optionValue: 'sessionStorage 在浏览器关闭后会被清空' },
      { optionName: 'C', optionValue: 'cookie 不能设置过期时间' },
      { optionName: 'D', optionValue: 'localStorage 会自动在每次请求时携带到服务器' },
    ],
  },
  {
    id: 'q8',
    title: '关于 Git 工作流，下面说法正确的是？',
    difficulty: 'medium',
    type: '1',
    items: [
      { optionName: 'A', optionValue: 'git clone 用于提交本地修改' },
      { optionName: 'B', optionValue: 'git pull 等价于 fetch 加 merge' },
      { optionName: 'C', optionValue: 'git branch 会删除本地分支' },
      { optionName: 'D', optionValue: 'git checkout 不能切换到远程分支' },
    ],
  },
  {
    id: 'q9',
    title: '关于 Node.js 事件循环，下面说法正确的是？',
    difficulty: 'hard',
    type: '1',
    items: [
      { optionName: 'A', optionValue: '所有代码都在同一个线程执行' },
      { optionName: 'B', optionValue: 'setTimeout 回调一定先于 Promise 回调执行' },
      { optionName: 'C', optionValue: 'I/O 操作通常由线程池或内核负责' },
      { optionName: 'D', optionValue: '事件循环只包含一个阶段' },
    ],
  },
  {
    id: 'q10',
    title: '关于前端工程化，下面说法正确的是？',
    difficulty: 'hard',
    type: '1',
    items: [
      { optionName: 'A', optionValue: '打包工具无法进行代码分割' },
      { optionName: 'B', optionValue: 'Tree Shaking 可以删除未使用的代码' },
      { optionName: 'C', optionValue: '构建产物不需要区分环境配置' },
      { optionName: 'D', optionValue: '所有资源都应该打包进同一个 bundle 中' },
    ],
  },
];

const RoadmapList = ({ nodes, track }: { nodes: RoadmapNode[], track: 'frontend' | 'backend' }) => {
  const navigate = useNavigate();

  const handlePractice = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    navigate('/question/roadmap-exam', {
      state: {
        questionList: staticQuestions,
        title: `${track === 'frontend' ? '前端' : '后端'} · ${title} 练习`,
      },
    });
  };

  return (
    <div className="space-y-6">
      {nodes.sort((a, b) => a.order - b.order).map((node, index) => (
        <div 
          key={node.id}
          className="group relative flex gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate(`/front/route/${track}/${node.id}`)}
        >
          {/* Connector Line */}
          {index !== nodes.length - 1 && (
            <div className="absolute left-[2.25rem] top-[4.5rem] bottom-[-1.5rem] w-0.5 bg-gray-200 dark:bg-gray-700 group-hover:bg-primary-200 transition-colors" />
          )}

          <div className="flex-shrink-0 z-10">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900">
              {React.createElement(node.icon, { size: 24 })}
            </div>
          </div>

          <div className="flex-grow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-500 transition-colors">
                {node.title}
              </h3>
              <div className="flex flex-col items-end text-gray-400 group-hover:text-blue-500 transition-all">
                <div className="flex items-center group-hover:translate-x-1 transition-transform">
                  <span className="text-sm mr-1">开始学习</span>
                  <ChevronRight size={16} />
                </div>
                <Button
                  type="link"
                  size="small"
                  className="mt-1 p-0 text-xs"
                  onClick={(e) => handlePractice(e, node.title)}
                >
                  题目练习（10题）
                </Button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {node.description}
            </p>

            <div className="flex items-center gap-3">
              {node.type === 'milestone' && (
                <Tag color="blue">里程碑</Tag>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <span className={`w-2 h-2 rounded-full ${node.status === 'completed' ? 'bg-green-500' : node.status === 'learning' ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                {node.status === 'completed' ? '已完成' : node.status === 'learning' ? '进行中' : '未开始'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RoadmapPage = () => {
  const [activeTab, setActiveTab] = useState('frontend');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            开发者学习路线
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            从入门到精通，系统化的学习路径。包含知识点详解、优质资源推荐与实战练习。
          </p>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          size="large"
          className="mb-8"
          items={[
            {
              key: 'frontend',
              label: '前端开发',
              children: <RoadmapList nodes={frontendRoadmap} track="frontend" />
            },
            {
              key: 'backend',
              label: '后端开发',
              children: <RoadmapList nodes={backendRoadmap} track="backend" />
            }
          ]}
        />

        <div className="mt-12">
          <Learning />
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
