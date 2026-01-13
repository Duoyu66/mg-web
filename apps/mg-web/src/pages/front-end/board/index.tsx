import React, { useState, useEffect, useRef, memo } from 'react';
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
    top: Math.floor(Math.random() * 85) + 5 + '%', // 随机高度 5% - 90%
    duration: Math.floor(Math.random() * 10) + 20 + 's', // 增加时长到 20s - 30s，减慢速度
    delay: Math.random() * 5 + 's', // 初始随机延迟减少，避免长时间空白
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

// 单个弹幕组件，使用 memo 避免不必要的重渲染
const BarrageItemComponent = memo(({ item, isPaused, theme, onAnimationEnd }: { 
  item: BarrageItem; 
  isPaused: boolean; 
  theme: string;
  onAnimationEnd: (id: string) => void;
}) => {
  return (
    <div
      className={`absolute flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 cursor-pointer select-none
        ${item.size === 'large' ? 'text-lg font-medium' : 'text-base'}
      `}
      style={{
        top: item.top,
        left: '100%',
        backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)', // 提高不透明度，移除 backdrop-blur
        color: theme === 'dark' ? '#fff' : '#333',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // 简化阴影
        animation: `moveLeft ${item.duration} linear forwards`, // 使用 forwards 保持状态
        animationDelay: item.delay,
        animationPlayState: isPaused ? 'paused' : 'running',
        whiteSpace: 'nowrap',
        willChange: 'transform',
        transform: 'translateZ(0)', // 开启硬件加速
      }}
      onAnimationEnd={() => onAnimationEnd(item.id)}
    >
      <Avatar src={item.avatar} size="small" style={{ border: `2px solid ${item.color}` }} />
      <span style={{ color: item.size === 'large' ? item.color : 'inherit' }}>{item.content}</span>
    </div>
  );
});

const BarrageBoard = () => {
  const { theme } = useTheme();
  // 活跃的弹幕（在屏幕上渲染的）
  const [activeBarrages, setActiveBarrages] = useState<BarrageItem[]>([]);
  // 等待队列（还未上场的）
  const waitingQueue = useRef<BarrageItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  
  // 弹幕动画结束回调，从活跃列表中移除
  const handleAnimationEnd = React.useCallback((id: string) => {
      setActiveBarrages(prev => prev.filter(item => item.id !== id));
  }, []);

  // 初始化数据
  useEffect(() => {
    // 初始生成一批数据放入等待队列
    waitingQueue.current = generateMockData(50);
    // 立即取出一部分显示，避免开始时空白
    const initialBatch = waitingQueue.current.splice(0, 15);
    setActiveBarrages(initialBatch);
  }, []);

  // 定时器不断补充弹幕
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) return;
      
      setActiveBarrages(prev => {
        // 内存保护：如果数量过多，强制清理最早的
        if (prev.length > 60) {
            return prev.slice(prev.length - 60);
        }

        // 如果活跃弹幕足够多，暂不补充
        if (prev.length >= 30) {
            return prev;
        }

        // 随机补充 1-3 个
        const countToAdd = Math.floor(Math.random() * 3) + 1;
        
        // 如果队列空了，重新生成一批
        if (waitingQueue.current.length < 5) {
             waitingQueue.current = [...waitingQueue.current, ...generateMockData(20)];
        }

        const nextBatch = waitingQueue.current.splice(0, countToAdd).map(item => ({
            ...item,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // 更强的唯一 ID
            delay: '0s'
        }));
        
        if (nextBatch.length > 0) {
            return [...prev, ...nextBatch];
        }
        return prev;
      });
    }, 1500); // 每 1.5 秒检查补充一次

    return () => clearInterval(interval);
  }, [isPaused]);

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
      top: Math.floor(Math.random() * 80) + 10 + '%',
      duration: '20s',
      delay: '0s',
      size: 'large'
    };
    
    // 发送的弹幕直接加入活跃列表
    setActiveBarrages(prev => [...prev, newBarrage]);
    setInputValue('');
    message.success('留言发送成功！');
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 背景装饰 - 静态化，移除 animate-pulse 减少重绘 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-3xl"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-400/5 blur-3xl"></div>
         <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-pink-400/5 blur-3xl"></div>
      </div>

      {/* 标题区域 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none select-none">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-2 drop-shadow-sm">
          留言板
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          留下你的足迹，分享你的想法 ✨
        </p>
      </div>

      {/* 弹幕区域 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {activeBarrages.map((item) => (
          <BarrageItemComponent 
            key={item.id} 
            item={item} 
            isPaused={isPaused} 
            theme={theme}
            onAnimationEnd={handleAnimationEnd}
          />
        ))}
      </div>

      {/* 左右渐变遮罩 */}
      <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10 pointer-events-none" />

      {/* 底部操作区 */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-20">
        <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center gap-4 transition-colors duration-300">
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
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-150vw, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default BarrageBoard;
