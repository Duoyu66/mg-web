import React, { useState, useMemo } from 'react';
import { Input, Tag, Avatar, Button, Tooltip, Empty, Divider, Modal, Switch } from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  LikeOutlined, 
  MessageOutlined, 
  FireOutlined,
  CalendarOutlined,
  UserOutlined,
  ArrowRightOutlined,
  LockOutlined,
  FieldTimeOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewExperiences, InterviewExp } from './data';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
};

const CompanyInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isVip, setIsVip] = useState(false); // Mock VIP status

  // 提取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    interviewExperiences.forEach(exp => exp.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, []);

  // 过滤数据
  const filteredData = useMemo(() => {
    return interviewExperiences.filter(item => {
      const matchSearch = 
        item.title.toLowerCase().includes(searchText.toLowerCase()) || 
        item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchText.toLowerCase());
      
      const matchTag = selectedTag ? item.tags.includes(selectedTag) : true;
      
      return matchSearch && matchTag;
    });
  }, [searchText, selectedTag]);

  const getAccessBadge = (type: 'normal' | 'free_limited' | 'vip') => {
    switch (type) {
      case 'vip':
        return <Tag color="gold" icon={<LockOutlined />}>会员专享</Tag>;
      case 'free_limited':
        return <Tag color="cyan" icon={<FieldTimeOutlined />}>限时免费</Tag>;
      default:
        return null;
    }
  };

  const handleCardClick = (item: InterviewExp) => {
    if (item.accessType === 'vip' && !isVip) {
      Modal.confirm({
        title: '会员专享内容',
        icon: <CrownOutlined style={{ color: '#FFD700' }} />,
        content: '该面经为会员专享内容，请升级会员后查看。',
        okText: '去升级',
        cancelText: '再想想',
        onOk: () => navigate('/front/recharge'),
      });
      return;
    }
    navigate(`/front/companyInterview/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="fixed top-24 right-6 z-50">
        <Tooltip title="点击切换 VIP 状态以测试功能">
          <Switch 
            checkedChildren="VIP" 
            unCheckedChildren="普通" 
            checked={isVip} 
            onChange={setIsVip} 
          />
        </Tooltip>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            名企前端面经
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            汇集互联网大厂真实面试经验，助你从容应对每一场面试挑战。
          </p>
          
          <div className="max-w-xl mx-auto mb-6">
            <Search
              placeholder="搜索公司、职位或关键词..."
              allowClear
              enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
              size="large"
              onChange={(e) => setSearchText(e.target.value)}
              className="shadow-lg rounded-lg overflow-hidden"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Tag 
              color={selectedTag === null ? 'blue' : 'default'} 
              className="cursor-pointer px-3 py-1 text-sm rounded-full border-0 hover:scale-105 transition-transform"
              onClick={() => setSelectedTag(null)}
            >
              全部
            </Tag>
            {allTags.map(tag => (
              <Tag
                key={tag}
                color={selectedTag === tag ? 'blue' : 'default'}
                className="cursor-pointer px-3 py-1 text-sm rounded-full border-0 hover:scale-105 transition-transform"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {filteredData.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredData.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layoutId={item.id}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                >
                  {/* Top Color Bar */}
                  <div className="h-2 w-full" style={{ backgroundColor: item.color }} />
                  
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md transform group-hover:rotate-12 transition-transform duration-300"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 m-0 leading-tight">
                            {item.companyName}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.position} · {item.level}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Tag color={
                          item.difficulty === '简单' ? 'green' : 
                          item.difficulty === '中等' ? 'orange' : 'red'
                        }>
                          {item.difficulty}
                        </Tag>
                        {getAccessBadge(item.accessType)}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 
                      className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                      onClick={() => handleCardClick(item)}
                    >
                      {item.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
                      {item.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Divider className="my-3 dark:border-gray-700" />

                    {/* Footer */}
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Avatar src={item.avatar} size="small" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Tooltip title="阅读量">
                          <span className="flex items-center gap-1">
                            <EyeOutlined /> {item.views}
                          </span>
                        </Tooltip>
                        <Tooltip title="点赞">
                          <span className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                            <LikeOutlined /> {item.likes}
                          </span>
                        </Tooltip>
                        <span className="text-gray-300 dark:text-gray-600">|</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                     {/* Can add a "Read More" button here if needed, but the whole card is clickable or title is clickable */}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <Empty description="暂无相关面经" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CompanyInterviewPage;
