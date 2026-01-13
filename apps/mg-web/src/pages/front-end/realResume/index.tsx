import React, { useState } from 'react';
import { Input, Card, Tag, Typography, Button, Empty, Avatar } from 'antd';
import { SearchOutlined, UserOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeList } from './data';

const { Title, Text, Paragraph } = Typography;

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
      stiffness: 100
    }
  }
};

const ResumeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const filteredList = resumeList.filter(resume => 
    resume.name.includes(searchText) || 
    resume.role.includes(searchText) || 
    resume.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12 transition-colors duration-300">
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <Title level={1} className="dark:!text-white !mb-0 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                真实大厂简历库
              </span>
            </Title>
            <Text className="text-gray-500 dark:text-gray-400 text-lg md:text-xl block max-w-2xl mx-auto">
              汇集各领域优秀简历模板，参考真实案例，助你快速斩获心仪 Offer
            </Text>
          </div>
          
          <motion.div 
            className="max-w-xl mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Input 
              size="large" 
              placeholder="搜索职位、技能或姓名..." 
              prefix={<SearchOutlined className="text-gray-400 text-lg mr-2" />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="h-14 rounded-full shadow-lg border-0 hover:shadow-xl focus:shadow-xl transition-all text-lg px-6 dark:bg-gray-800 dark:text-white"
            />
          </motion.div>
        </motion.div>

        {/* List Grid */}
        {filteredList.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredList.map((resume, index) => (
              <motion.div 
                key={resume.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card
                  hoverable
                  className="h-full rounded-2xl overflow-hidden border-0 shadow-md hover:shadow-2xl transition-shadow duration-300 dark:bg-gray-800 group"
                  onClick={() => navigate(`/front/realResume/${resume.id}`)}
                  bodyStyle={{ padding: 0 }}
                >
                  <div className={`h-32 relative p-6 bg-gradient-to-br ${
                    index % 3 === 0 ? 'from-blue-500 to-indigo-600' :
                    index % 3 === 1 ? 'from-emerald-500 to-teal-600' :
                    'from-violet-500 to-purple-600'
                  }`}>
                    <div className="absolute -bottom-8 left-6">
                      <Avatar 
                        size={72} 
                        icon={<UserOutlined />} 
                        className="bg-white text-gray-800 border-4 border-white dark:border-gray-800 shadow-lg text-2xl font-bold"
                      >
                        {resume.name[0]}
                      </Avatar>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Tag className="m-0 bg-white/20 border-0 text-white backdrop-blur-sm px-3 py-1 text-sm font-medium">
                        {resume.years}
                      </Tag>
                    </div>
                  </div>
                  
                  <div className="pt-10 px-6 pb-6">
                    <div className="mb-4">
                      <div className="flex items-baseline justify-between mb-1">
                        <Title level={4} className="!mb-0 dark:!text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {resume.name}
                        </Title>
                      </div>
                      <Text className="text-gray-500 dark:text-gray-400 font-medium block">{resume.role}</Text>
                    </div>
                    
                    <Paragraph 
                      className="text-gray-500 dark:text-gray-400 text-sm mb-4 h-10 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed"
                      ellipsis={{ rows: 2 }}
                    >
                      {resume.intro}
                    </Paragraph>

                    <div className="flex flex-wrap gap-2 mb-6 h-16 content-start overflow-hidden">
                      {resume.tags.slice(0, 4).map(tag => (
                        <Tag key={tag} className="bg-gray-100 dark:bg-gray-700 border-none text-gray-600 dark:text-gray-300 px-2 py-1 m-0">
                          {tag}
                        </Tag>
                      ))}
                      {resume.tags.length > 4 && (
                        <Tag className="bg-gray-50 dark:bg-gray-700/50 border-none text-xs px-2 py-1 m-0">
                          +{resume.tags.length - 4}
                        </Tag>
                      )}
                    </div>

                    <Button 
                      type="primary" 
                      ghost 
                      block 
                      size="large"
                      className="rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 font-medium flex items-center justify-center gap-2"
                    >
                      查看详情 <RightOutlined className="text-xs" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={<span className="text-gray-500 dark:text-gray-400">未找到匹配的简历</span>} 
            className="py-20" 
          />
        )}

      </div>
    </div>
  );
};

export default ResumeListPage;
