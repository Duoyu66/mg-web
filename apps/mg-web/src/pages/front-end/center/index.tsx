import { Button, Avatar, Tabs, Card, Progress, Tag } from 'antd';
import { 
  User, 
  Settings, 
  BookOpen, 
  Trophy, 
  History, 
  Edit3, 
  Star,
  MessageSquare,
  FileText,
  Activity,
  ThumbsUp,
  Eye
} from 'lucide-react';
import { useTheme } from '@/components/context/useTheme';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import requestClient from '@/utils/requestClient';

// --- 数据定义 ---
interface FavoriteItem {
  id: number;
  title: string;
  cover: string;
  author: string;
  authorAvatar: string;
  likes: number;
  views: number;
  tags: string[];
}

const favoriteData: FavoriteItem[] = [
  {
    id: 1,
    title: '深入理解 React Hooks：构建高效、可复用的组件',
    cover: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    author: '前端大师',
    authorAvatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    likes: 125,
    views: 4500,
    tags: ['React', 'Hooks', '前端'],
  },
  {
    id: 2,
    title: 'Node.js 性能优化：从理论到实践的全面指南',
    cover: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    author: '后端小王子',
    authorAvatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
    likes: 230,
    views: 8900,
    tags: ['Node.js', '性能优化', '后端'],
  },
  {
    id: 3,
    title: '现代 CSS 布局：Flexbox 与 Grid 完全掌握',
    cover: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    author: 'UI/UX探索者',
    authorAvatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
    likes: 98,
    views: 3200,
    tags: ['CSS', 'Flexbox', 'Grid'],
  },
  {
    id: 4,
    title: 'TypeScript 类型体操：挑战高级类型编程',
    cover: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
    author: '类型大师',
    authorAvatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4',
    likes: 180,
    views: 6500,
    tags: ['TypeScript', '高级类型'],
  },
];

// --- 子组件 ---

const FavoriteCard: React.FC<{ item: FavoriteItem }> = ({ item }) => {
  return (
    <Card
      hoverable
      className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden group"
    >
      <div className="relative">
        <img src={item.cover} alt={item.title} className="w-full rounded-lg h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-2 right-2 flex gap-1">
          {item.tags.slice(0, 2).map(tag => (
            <Tag key={tag} className="text-xs bg-black/30 text-white border-none">{tag}</Tag>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-md text-gray-900 dark:text-gray-100 truncate mb-2">{item.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Avatar size={24} src={item.authorAvatar} />
            <span>{item.author}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ThumbsUp size={12} /> {item.likes}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const CapabilityRadar = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : undefined);
    
    const option = {
      backgroundColor: 'transparent',
      tooltip: {},
      radar: {
        indicator: [
          { name: '算法基础', max: 100 },
          { name: '前端工程', max: 100 },
          { name: '后端开发', max: 100 },
          { name: '系统设计', max: 100 },
          { name: '团队协作', max: 100 },
          { name: '持续学习', max: 100 }
        ],
        splitNumber: 4,
        axisName: {
          color: theme === 'dark' ? '#9ca3af' : '#4b5563'
        },
        splitLine: {
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        },
        splitArea: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      series: [
        {
          name: '能力维度',
          type: 'radar',
          data: [
            {
              value: [85, 90, 60, 70, 80, 95],
              name: '当前能力',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(59, 130, 246, 0.5)' },
                  { offset: 1, color: 'rgba(59, 130, 246, 0.1)' }
                ])
              },
              lineStyle: {
                color: '#3b82f6',
                width: 2
              },
              itemStyle: {
                color: '#3b82f6'
              }
            }
          ]
        }
      ]
    };

    chartInstance.setOption(option);

    const handleResize = () => {
      chartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.dispose();
    };
  }, [theme]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

const ProfileHeader = () => {
  const navigate = useNavigate();
  const [selectedFrame, setSelectedFrame] = useState<
    'neon' | 'gold' | 'gradient' | 'pulse' | 'cyber' | 'ocean'
  >('neon');

  return (
    <div className="relative rounded-3xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden mb-8">
      <div className="h-28 bg-gradient-to-r from-blue-400 to-purple-500"></div>
      <div className="px-8 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-10 gap-6">
          <div
            className={`
              relative rounded-2xl p-[3px]
              ${selectedFrame === 'neon' ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse' : ''}
              ${selectedFrame === 'gold' ? 'bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_18px_rgba(251,191,36,0.7)]' : ''}
              ${selectedFrame === 'gradient' ? 'bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 shadow-[0_0_18px_rgba(244,114,182,0.5)]' : ''}
              ${selectedFrame === 'pulse' ? 'bg-gradient-to-tr from-emerald-400 via-teal-400 to-sky-400 shadow-[0_0_18px_rgba(34,197,94,0.6)] animate-pulse' : ''}
              ${selectedFrame === 'cyber' ? 'bg-[conic-gradient(at_top,_#22c55e,_#0ea5e9,_#6366f1,_#22c55e)] animate-spin' : ''}
              ${selectedFrame === 'ocean' ? 'bg-gradient-to-tr from-sky-500 via-indigo-500 to-slate-900 shadow-[0_0_18px_rgba(59,130,246,0.7)]' : ''}
            `}
          >
            <div className="rounded-2xl bg-white dark:bg-gray-900 p-1">
              <Avatar 
                size={88} 
                className="border-4 border-white dark:border-gray-800 shadow-lg"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              />
            </div>
          </div>
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">张三</h1>
              <Tag color="blue" className="rounded-full px-3">Lv. 5 进阶开发者</Tag>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              全栈开发工程师 | 热爱技术，持续学习 | GitHub: @zhangsan
            </p>
          </div>
          <div className="flex flex-col gap-3 mb-2">
            <div className="flex gap-3">
              <Button icon={<Edit3 size={16} />}>编辑资料</Button>
              <Button icon={<Settings size={16} />}>设置</Button>
              <Button 
                type="primary" 
                onClick={() => navigate('/front/member')}
              >
                会员积分
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="mr-2 text-gray-600 dark:text-gray-300">头像框</span>
              <button
                type="button"
                onClick={() => setSelectedFrame('neon')}
                className={`
                  px-3 py-1 rounded-full border text-xs transition-all
                  ${selectedFrame === 'neon'
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-cyan-400 hover:text-cyan-300'}
                `}
              >
                霓虹蓝
              </button>
              <button
                type="button"
                onClick={() => setSelectedFrame('gold')}
                className={`
                  px-3 py-1 rounded-full border text-xs transition-all
                  ${selectedFrame === 'gold'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-amber-400 hover:text-amber-300'}
                `}
              >
                黄金荣誉
              </button>
              {/* ... other frame buttons ... */}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">128</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">刷题数量</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">15</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">文章发布</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">1.2k</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">获赞总数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">45</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">连续打卡</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyInformation = () => {
  const [routeProgress, setRouteProgress] = useState({
    frontend: 0,
    backend: 0,
    algorithm: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res: any = await requestClient.request({
          url: '/user/statistics',
          method: 'get',
          params: {
            trainId: '695f703a0a72603309d0bd52',
            classId: '68d8d2d905d09654417adde1',
            organizationId: '658aadeb84b5c0275b00e25c',
          },
        });
        if (res && (res.status === 0 || res.code === 0) && res.data) {
          setRouteProgress({
            frontend: res.data.frontendProgress ?? 0,
            backend: res.data.backendProgress ?? 0,
            algorithm: res.data.algorithmProgress ?? 0,
          });
        }
      } catch (e) {
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Sidebar */}
      <div className="space-y-6">
        <Card 
          title={<div className="flex items-center gap-2"><Activity size={20} className="text-blue-500" />能力分析</div>}
          className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
        >
          <CapabilityRadar />
        </Card>

        <Card 
          title={<div className="flex items-center gap-2"><Trophy size={20} className="text-yellow-500" />学习进度</div>}
          className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">前端路线图</span>
                <span className="text-gray-900 dark:text-gray-100">{routeProgress.frontend}%</span>
              </div>
              <Progress percent={routeProgress.frontend} showInfo={false} strokeColor="#1890ff" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">后端路线图</span>
                <span className="text-gray-900 dark:text-gray-100">{routeProgress.backend}%</span>
              </div>
              <Progress percent={routeProgress.backend} showInfo={false} strokeColor="#52c41a" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">算法训练</span>
                <span className="text-gray-900 dark:text-gray-100">{routeProgress.algorithm}%</span>
              </div>
              <Progress percent={routeProgress.algorithm} showInfo={false} strokeColor="#722ed1" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2">
        <Card 
          title={<div className="flex items-center gap-2"><History size={20} className="text-green-500" />最近活动</div>}
          className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {[
              { title: '完成了算法题：两数之和', time: '10分钟前', type: 'code' },
              { title: '阅读了文章：React Hooks 最佳实践', time: '2小时前', type: 'read' },
              { title: '在讨论区回复了帖子', time: '昨天', type: 'comment' },
              { title: '收藏了知识点：TypeScript 高级类型', time: '3天前', type: 'star' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 py-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                  {item.type === 'code' && <Code2Icon size={20} />}
                  {item.type === 'read' && <BookOpen size={20} />}
                  {item.type === 'comment' && <MessageSquare size={20} />}
                  {item.type === 'star' && <Star size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- 主组件 ---

const UserCenter = () => {
  const { theme } = useTheme();

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <User size={16} /> 我的信息
        </span>
      ),
      children: <MyInformation />,
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <FileText size={16} /> 我的文章
        </span>
      ),
      children: <div className="py-16 text-center text-gray-500">暂无已发表的文章</div>,
    },
    {
      key: '3',
      label: (
        <span className="flex items-center gap-2">
          <Star size={16} /> 我的收藏
        </span>
      ),
      children: (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favoriteData.map(item => (
            <FavoriteCard key={item.id} item={item} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ProfileHeader />
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-2">
          <Tabs 
            tabPosition="left" 
            items={tabItems} 
            className="user-center-tabs"
            tabBarStyle={{ minWidth: 180 }}
          />
        </div>
      </div>
    </div>
  );
};

function Code2Icon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export default UserCenter;
