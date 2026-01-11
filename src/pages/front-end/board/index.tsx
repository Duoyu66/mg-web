import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, message, Tooltip } from 'antd';
import { SendOutlined, PauseCircleOutlined, PlayCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTheme } from '@/components/context/useTheme';

// 模拟数据生成器
const generateMockData = (count: number) => {
  const messages = [
    "这个网站做得太棒了！🚀", "前端技术栈是 React 吗？", "求更算法题解！📚", "打卡滴滴滴", "界面很现代化，喜欢！❤️",
    "有人一起组队刷题吗？", "UI 设计师加鸡腿 🍗", "加油加油！💪", "希望能出更多视频教程", "不仅好用，还好看",
    "每日一题，坚持就是胜利", "Bug 报修在哪里？", "这个弹幕效果不错", "React 19 什么时候出？", "Tailwind CSS 真香",
    "后端是用什么写的？", "服务器在哪买的？", "求源码学习", "大佬带带我", "萌新报到",
    "今天也是充满希望的一天", "代码写得真整洁", "色彩搭配很舒服", "有点像 B 站", "希望能加上即时通讯",
    "这里的学习氛围真好", "有没有 Java 的路线图？", "Python 爬虫教程有吗？", "Docker 部署教程求更", "微服务架构怎么学？"
  ];
  
  const colors = [
    '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', 
    '#52c41a', '#f5222d', '#eb2f96', '#fa8c16', '#a0d911'
  ];

  return Array.from({ length: count }).map((_, index) => ({
    id: `msg-${index}`,
    content: messages[Math.floor(Math.random() * messages.length)] + (Math.random() > 0.8 ? ' 🔥' : ''),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
    color: colors[Math.floor(Math.random() * colors.length)],
    top: Math.floor(Math.random() * 80) + 5 + '%', // 随机高度 5% - 85%
    duration: Math.floor(Math.random() * 10) + 15 + 's', // 随机时长 15s - 25s
    delay: Math.floor(Math.random() * 20) + 's', // 随机延迟 0s - 20s
    size: Math.random() > 0.8 ? 'large' : 'normal'
  }));
};

interface BarrageItem {
  id: string;
  content: string;
  avatar: string;
  color: string;
  top: string;
  duration: string;
  delay: string;
  size: string;
}

const BarrageBoard = () => {
  const { theme } = useTheme();
  const [barrages, setBarrages] = useState<BarrageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  
  // 初始化数据
  useEffect(() => {
    setBarrages(generateMockData(100));
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) {
      message.warning('请输入留言内容');
      return;
    }
    
    const newBarrage: BarrageItem = {
      id: `new-${Date.now()}`,
      content: inputValue,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      color: '#1890ff',
      top: Math.floor(Math.random() * 80) + 5 + '%',
      duration: '15s',
      delay: '0s',
      size: 'large'
    };
    
    setBarrages(prev => [...prev, newBarrage]);
    setInputValue('');
    message.success('留言发送成功！');
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-3xl animate-pulse"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
         <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-pink-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 标题区域 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2 drop-shadow-sm">
          留言板
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          留下你的足迹，分享你的想法 ✨
        </p>
      </div>

      {/* 弹幕区域 */}
      <div className={`absolute inset-0 z-0 ${isPaused ? 'paused' : ''}`}>
        {barrages.map((item) => (
          <div
            key={item.id}
            className={`absolute flex items-center gap-2 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm border border-white/20 hover:z-50 hover:scale-105 transition-transform cursor-pointer
              ${item.size === 'large' ? 'text-lg font-medium' : 'text-base'}
            `}
            style={{
              top: item.top,
              left: '100%',
              backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.7)',
              color: theme === 'dark' ? '#fff' : '#333',
              animation: `moveLeft ${item.duration} linear infinite`,
              animationDelay: item.delay,
              animationPlayState: isPaused ? 'paused' : 'running',
              whiteSpace: 'nowrap',
              willChange: 'transform'
            }}
          >
            <Avatar src={item.avatar} size="small" style={{ border: `2px solid ${item.color}` }} />
            <span style={{ color: item.size === 'large' ? item.color : 'inherit' }}>{item.content}</span>
          </div>
        ))}
      </div>

      {/* 底部操作区 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-20">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4">
           <Tooltip title={isPaused ? "继续滚动" : "暂停滚动"}>
            <Button 
              shape="circle" 
              icon={isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />} 
              size="large"
              onClick={() => setIsPaused(!isPaused)}
              className="flex-shrink-0"
            />
          </Tooltip>
          
          <div className="flex-1 relative">
            <Input 
              size="large" 
              placeholder="说点什么吧..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onPressEnter={handleSend}
              maxLength={50}
              className="rounded-xl border-gray-300 dark:border-gray-600 bg-transparent hover:bg-white dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-700"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </div>

          <Button 
            type="primary" 
            size="large" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            className="rounded-xl px-8 bg-gradient-to-r from-blue-500 to-purple-600 border-none shadow-lg hover:shadow-blue-500/30"
          >
            发送
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes moveLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-150vw); }
        }
        .paused {
          pointer-events: auto !important;
        }
        .paused * {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};

export default BarrageBoard;
