import React from 'react';
import { Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { MenuItemType } from '@/components/layoutPage/type';
import { motion } from 'framer-motion';

const FeaturePage: React.FC = () => {
  const navigate = useNavigate();

  const baseItems: MenuItemType[] = [
    { id: '3', title: '题库', path: '/front/questionBank' },
    { id: '5', title: '快捷导航', path: '/front/nav' },
    { id: '6', title: '测试', path: '/front/test' },
  ];

  const moreItems: MenuItemType[] = [
    { id: '7', title: '面试公司', path: '/front/company' },
    { id: '8', title: '简历制作模板', path: '/front/resume' },
    { id: '9', title: '学习排行榜', path: '/front/rank' },
    { id: '10', title: '学习路线', path: '/front/route' },
    { id: '11', title: '文档管理', path: '/front/document' },
    { id: '12', title: '个人中心', path: '/front/center' },
    { id: '14', title: '笔记', path: '/front/note' },
    { id: '15', title: '代办', path: '/front/todo' },
    { id: '16', title: '留言板', path: '/front/board' },
    { id: '17', title: '会员价格', path: '/front/price' },
    { id: '17-2', title: '充值', path: '/front/recharge' },
    { id: '18', title: '真实简历', path: '/front/realResume' },
    { id: '19', title: '名企面经', path: '/front/companyInterview' },
    { id: '20', title: '教程', path: '/front/tutorial' },
  ];

  const features: MenuItemType[] = [...baseItems, ...moreItems];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            功能大全
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            常用功能入口汇总，点击卡片快速进入对应页面
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(item.path)}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 p-5 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </span>
                <Tag color="blue" className="rounded-full">
                  快速入口
                </Tag>
              </div>
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {item.path}
              </div>
              <div className="mt-4">
                <Button type="primary" className="rounded-full" onClick={() => navigate(item.path)}>
                  进入
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturePage;
