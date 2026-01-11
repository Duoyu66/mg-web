import { Button, Avatar, Tabs, Card, Progress, Tag, List } from 'antd';
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
  Activity
} from 'lucide-react';
import { useTheme } from '@/components/context/useTheme';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

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

const UserCenter = () => {
  const { theme } = useTheme();

  const renderContent = () => {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Profile Header */}
          <div className="relative rounded-3xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden mb-8">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 gap-6">
                <Avatar 
                  size={128} 
                  className="border-4 border-white dark:border-gray-800 shadow-lg"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                />
                <div className="flex-1 mb-2">
                  <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">张三</h1>
                    <Tag color="blue" className="rounded-full px-3">Lv. 5 进阶开发者</Tag>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    全栈开发工程师 | 热爱技术，持续学习 | GitHub: @zhangsan
                  </p>
                </div>
                <div className="flex gap-3 mb-2">
                  <Button icon={<Edit3 size={16} />}>编辑资料</Button>
                  <Button icon={<Settings size={16} />}>设置</Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* Capability Radar */}
              <Card 
                title={<div className="flex items-center gap-2"><Activity size={20} className="text-blue-500" />能力分析</div>}
                className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              >
                <CapabilityRadar />
              </Card>

              {/* Learning Progress */}
              <Card 
                title={<div className="flex items-center gap-2"><Trophy size={20} className="text-yellow-500" />学习进度</div>}
                className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">前端路线图</span>
                      <span className="text-gray-900 dark:text-gray-100">75%</span>
                    </div>
                    <Progress percent={75} showInfo={false} strokeColor="#1890ff" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">后端路线图</span>
                      <span className="text-gray-900 dark:text-gray-100">30%</span>
                    </div>
                    <Progress percent={30} showInfo={false} strokeColor="#52c41a" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-300">算法训练</span>
                      <span className="text-gray-900 dark:text-gray-100">45%</span>
                    </div>
                    <Progress percent={45} showInfo={false} strokeColor="#722ed1" />
                  </div>
                </div>
              </Card>

              {/* Achievements */}
              <Card 
                title={<div className="flex items-center gap-2"><Star size={20} className="text-orange-500" />我的成就</div>}
                className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 flex items-center justify-center text-white font-bold text-xs">
                        徽章
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">成就名称</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 min-h-[500px]">
                <Tabs
                  items={[
                    {
                      key: '1',
                      label: <span className="flex items-center gap-2"><History size={16} />最近活动</span>,
                      children: (
                        <List
                          itemLayout="horizontal"
                          dataSource={[
                            { title: '完成了算法题：两数之和', time: '10分钟前', type: 'code' },
                            { title: '阅读了文章：React Hooks 最佳实践', time: '2小时前', type: 'read' },
                            { title: '在讨论区回复了帖子', time: '昨天', type: 'comment' },
                            { title: '收藏了知识点：TypeScript 高级类型', time: '3天前', type: 'star' },
                          ]}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                                    {item.type === 'code' && <Code2Icon size={20} />}
                                    {item.type === 'read' && <BookOpen size={20} />}
                                    {item.type === 'comment' && <MessageSquare size={20} />}
                                    {item.type === 'star' && <Star size={20} />}
                                  </div>
                                }
                                title={<a href="#" className="text-gray-900 dark:text-gray-100">{item.title}</a>}
                                description={<span className="text-gray-500 dark:text-gray-400">{item.time}</span>}
                              />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                    {
                      key: '2',
                      label: <span className="flex items-center gap-2"><FileText size={16} />我的文章</span>,
                      children: <div className="py-8 text-center text-gray-500">暂无文章</div>,
                    },
                    {
                      key: '3',
                      label: <span className="flex items-center gap-2"><Star size={16} />收藏夹</span>,
                      children: <div className="py-8 text-center text-gray-500">暂无收藏</div>,
                    },
                  ]}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
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
