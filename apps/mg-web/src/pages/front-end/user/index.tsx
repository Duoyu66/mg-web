import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MessageCircle, 
  Plus, 
  MoreHorizontal, 
  MapPin, 
  User as UserIcon,
  ThumbsUp,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button, Tabs, Tag } from 'antd';
import VipIcon from "@/components/vipIcon";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('posts');

  // 模拟用户数据
  const userInfo = {
    id: id || '2012180952399720448',
    nickname: 'LINK333',
    avatar: 'https://img.pawpaw18.cn/user-img/c431098cc1f94b1595ac8024d16b73a7.jpg',
    vipType: 'svip',
    gender: 'female',
    school: '西安电子科技大学',
    year: '2025',
    direction: 'Java',
    ipLocation: '江苏',
    bio: '暂未填写个人简介',
    stats: {
      likes: 2384,
      fans: 498,
      following: 0,
      views: 5471
    }
  };

  // 模拟帖子数据
  const posts = [
    {
      id: '1',
      title: '前端高频面试题：为什么 sessionStorage 在不同 Tab 页不共享？',
      content: '这是一个非常经典的前端面试题，也是实际开发中容易产生误解的地方。简单直接的回答是：这是由 W3C 标准明确设计的。sessionStorage 的设计初衷就是为了“隔离”，而不是“共享”。以下是详细的深度解析，帮助你彻底理解...',
      time: '01-23 16:37',
      school: '西安电子科技大学',
      direction: 'Java',
      views: 144,
      likes: 0,
      comments: 0,
      stars: 3,
      user: userInfo
    }
  ];

  const items = [
    {
      key: 'posts',
      label: `发布(${posts.length})`,
      children: (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <img src={post.user.avatar} alt={post.user.nickname} className="w-6 h-6 rounded-full" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{post.user.nickname}</span>
                <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded">LV.7</span>
                <VipIcon type="svip" />
                <span className="text-xs text-gray-500">{post.time}</span>
                <span className="text-xs text-gray-500">{post.school}</span>
                <span className="text-xs text-gray-500">{post.direction}</span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
                {post.content} <span className="text-primary-600 cursor-pointer">查看更多</span>
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <Tag color="blue">查看3道真题和解析</Tag>
              </div>

              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1"><UserIcon size={14} /> {post.views}</span>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-primary-600"><ThumbsUp size={14} /> 点赞</span>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-primary-600"><MessageSquare size={14} /> 评论</span>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-primary-600"><Star size={14} /> {post.stars}</span>
                  <span className="flex items-center gap-1 cursor-pointer hover:text-primary-600">分享</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'comments',
      label: '评论',
      children: <div className="text-center py-8 text-gray-500">暂无评论</div>,
    },
    {
      key: 'questions',
      label: '刷题',
      children: <div className="text-center py-8 text-gray-500">暂无刷题记录</div>,
    },
    {
      key: 'favorites',
      label: '收藏',
      children: <div className="text-center py-8 text-gray-500">暂无收藏</div>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8">
      {/* 顶部背景图 */}
      <div className="h-48 w-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        {/* 个人信息卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 头像 */}
            <div className="flex-shrink-0 relative">
              <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-gray-800 -mt-12 md:-mt-16 relative z-10">
                <img 
                  src={userInfo.avatar} 
                  alt={userInfo.nickname} 
                  className="w-full h-full rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                />
              </div>
            </div>
            
            {/* 信息主体 */}
            <div className="flex-1 pt-2 md:pt-0">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userInfo.nickname}</h1>
                    <VipIcon type={userInfo.vipType} />
                    <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">高级领航者</span>
                  </div>
                  
                  {/* 数据统计 */}
                  <div className="flex items-center gap-8 mb-4 md:hidden">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">获赞</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{userInfo.stats.likes}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">粉丝</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{userInfo.stats.fans}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">关注</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{userInfo.stats.following}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">看过TA</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">{userInfo.stats.views}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag icon={userInfo.gender === 'female' ? <span className="mr-1">♀</span> : <span className="mr-1">♂</span>}>
                      {userInfo.gender === 'female' ? '女' : '男'}
                    </Tag>
                    <Tag>{userInfo.school}</Tag>
                    <Tag>{userInfo.year}</Tag>
                    <Tag>{userInfo.direction}</Tag>
                    <Tag icon={<MapPin size={12} className="mr-1 inline" />}>IP属地：{userInfo.ipLocation}</Tag>
                  </div>
                  
                  <div className="text-gray-500 text-sm">
                    {userInfo.bio}
                  </div>
                </div>

                {/* 右侧数据统计(桌面端)和按钮 */}
                <div className="flex flex-col items-end gap-4">
                  <div className="hidden md:flex items-center gap-8 bg-gray-50 dark:bg-gray-700/50 px-6 py-3 rounded-lg">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">获赞</div>
                      <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{userInfo.stats.likes}</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">粉丝</div>
                      <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{userInfo.stats.fans}</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">关注</div>
                      <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{userInfo.stats.following}</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">看过TA</div>
                      <div className="font-bold text-xl text-gray-900 dark:text-gray-100">{userInfo.stats.views}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button>私信</Button>
                    <Button type="primary" className="bg-emerald-500 hover:bg-emerald-600 border-none">关注</Button>
                    <Button icon={<MoreHorizontal size={16} />}></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* 左侧内容区 */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <Tabs defaultActiveKey="posts" items={items} onChange={setActiveTab} />
            </div>
          </div>

          {/* 右侧侧边栏 */}
          <div className="w-80 hidden lg:block space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">创作者周榜</h3>
                <span className="text-xs text-gray-500 cursor-pointer">更多 &gt;</span>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 3 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item}`} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">用户{item}</div>
                      <div className="text-xs text-gray-500 truncate">某大学 Java</div>
                    </div>
                    <div className="text-xs text-red-500 font-medium">10W+ 🔥</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 侧边悬浮工具栏 */}
            <div className="fixed right-6 bottom-32 flex flex-col gap-3">
               {/* 这里可以放返回顶部等按钮 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
