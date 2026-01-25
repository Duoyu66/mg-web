import { Button, Avatar, Tabs, Card, Progress, Tag, Tooltip, Empty, Pagination, Select, Input } from 'antd';
import { 
  User, 
  Settings, 
  Edit3, 
  Copy,
  Github,
  Code2,
  Share2,
  Calendar,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { useTheme } from '@/components/context/useTheme';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requestClient from '@/utils/requestClient';
import dayjs from 'dayjs';

// --- Mock Data ---
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
];

// --- Sub-components ---

interface UserInfo {
  id: string;
  username: string;
  email: string;
  nickName: string;
  avatar: string;
  vipType: string;
  signature:string;
}

const UserInfoCard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUserInfo(JSON.parse(userStr));
      }
    } catch (e) {
      console.error('Failed to parse user info', e);
    }
  }, []);

  const userId = userInfo?.id || '-';
  const nickname = userInfo?.nickName || '-';
  const avatar = userInfo?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
  const isSvip = userInfo?.vipType === 'svip';
  const signature = userInfo?.signature||'-'
  
  const handleCopyId = () => {
    if (userId !== '-') {
      navigator.clipboard.writeText(userId);
      // You might want to add a message.success here if you import message from antd
    }
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <span className="text-gray-900 dark:text-gray-100 font-medium">个人信息</span>
        <div className="flex gap-3 text-gray-500">
          <Tooltip title="编辑资料">
            <Edit3 size={18} className="cursor-pointer hover:text-blue-500 transition-colors" />
          </Tooltip>
          <Tooltip title="设置">
            <Settings size={18} className="cursor-pointer hover:text-blue-500 transition-colors" />
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar 
            size={100} 
            src={avatar}
            className={`border-4 ${isSvip ? 'border-amber-400' : 'border-white dark:border-gray-700'} shadow-md`}
          />
          {isSvip && (
             <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white dark:border-gray-800 font-bold">
               SVIP
             </div>
          )}
        </div>
        
        <h2 className={`text-2xl font-bold mb-2 ${isSvip ? 'text-amber-500' : 'text-gray-900 dark:text-gray-100'}`}>
          {nickname}
        </h2>
    
        <div className="mb-4">
          <Tag color="gold" className="px-3 py-1 rounded-full text-sm font-bold border-none bg-yellow-400 text-yellow-900">
            Lv1
          </Tag>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">    {signature}</p>

        <div className="flex items-center gap-2 text-gray-400 text-xs bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full">
          <span>ID: {userId}</span>
          <Copy 
            size={12} 
            className="cursor-pointer hover:text-blue-500 transition-colors"
            onClick={handleCopyId}
          />
        </div>
      </div>
    </Card>
  );
};









const ActivityCalendar = () => {
  // Generate mock data for the grid
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  // Create a 7x52 grid approximation (simple version)
  const renderGrid = () => {
    const weeks = 52;
    const days = 7;
    const grid = [];

    for (let w = 0; w < weeks; w++) {
      const weekCol = [];
      for (let d = 0; d < days; d++) {
        // Randomly assign activity level for visual effect
        const active = Math.random() > 0.9;
        const level = active ? Math.ceil(Math.random() * 3) : 0;
        
        let bgColor = 'bg-gray-100 dark:bg-gray-700';
        if (level === 1) bgColor = 'bg-green-200 dark:bg-green-900';
        if (level === 2) bgColor = 'bg-green-400 dark:bg-green-700';
        if (level === 3) bgColor = 'bg-green-600 dark:bg-green-500';

        weekCol.push(
          <div 
            key={`${w}-${d}`} 
            className={`w-2.5 h-2.5 rounded-sm ${bgColor} hover:ring-1 ring-gray-400 transition-all`}
            title={`No contributions on this day`}
          ></div>
        );
      }
      grid.push(<div key={w} className="flex flex-col gap-1">{weekCol}</div>);
    }
    return grid;
  };

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl mt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
          {dayjs().year()} 年共发布文章 0 篇，累计天数：0 天
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>不活跃</span>
          <div className="flex gap-0.5">
            <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-green-200 dark:bg-green-900 rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-green-400 dark:bg-green-700 rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-500 rounded-sm"></div>
          </div>
          <span>活跃</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1 min-w-max">
          {renderGrid()}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          {months.map(m => <span key={m}>{m}</span>)}
        </div>
      </div>
    </Card>
  );
};

const ContentTabs = () => {
  const items = [
    { key: '1', label: '题目收藏' },
    { key: '2', label: '回答收藏' },
    { key: '3', label: '刷题记录' },
    { key: '4', label: '我的回答' },
    { key: '5', label: '创建题目' },
  ];

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl mt-4 min-h-[400px]">
      <Tabs 
        defaultActiveKey="1" 
        items={items.map(item => ({
          ...item,
          children: (
            <div className="mt-4">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  搜索题目 <ChevronRight size={14} />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  标记 <ChevronRight size={14} />
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                  会员专属 <ChevronRight size={14} />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300 shrink-0">标签</span>
                  <Select 
                    placeholder="可选 10 个标签，支持搜索" 
                    mode="multiple"
                    className="w-full max-w-md"
                    suffixIcon={<Search size={14} />}
                    variant="filled"
                  />
                </div>
              </div>

              {/* Empty State */}
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <Empty description="暂无收藏列表，快去收藏吧~" />
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8 border-t border-gray-100 dark:border-gray-700 pt-4">
                <span className="text-sm text-gray-500">总共 0 条</span>
                <Pagination 
                  simple 
                  defaultCurrent={1} 
                  total={0} 
                  className="ml-auto"
                />
                <Select defaultValue="20" className="ml-2 w-24" variant="borderless">
                  <Select.Option value="20">20 条/页</Select.Option>
                  <Select.Option value="50">50 条/页</Select.Option>
                </Select>
              </div>
            </div>
          )
        }))} 
        tabBarStyle={{ marginBottom: 0 }}
      />
    </Card>
  );
};

// --- Main Component ---

const UserCenter = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <UserInfoCard />
          </div>

          {/* Right Content (9 cols) */}
          <div className="lg:col-span-9">
  
            
            <ActivityCalendar />
            <ContentTabs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCenter;
