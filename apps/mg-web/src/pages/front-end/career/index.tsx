import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  MessageSquare, 
  Building2, 
  LayoutTemplate, 
  Briefcase,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const CareerHub = () => {
  const navigate = useNavigate();

  const careerModules = [
    {
      title: "真实简历库",
      desc: "查阅优秀工程师的真实简历案例，获取撰写灵感",
      icon: <FileCheck className="w-8 h-8 text-blue-500" />,
      path: "/front/realResume",
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "名企面经",
      desc: "一线大厂面试真题与经验分享，助你从容应对",
      icon: <MessageSquare className="w-8 h-8 text-purple-500" />,
      path: "/front/companyInterview",
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "面试公司",
      desc: "了解心仪公司的面试流程、薪资待遇与评价",
      icon: <Building2 className="w-8 h-8 text-emerald-500" />,
      path: "/front/company",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "简历模板",
      desc: "专业的简历制作模板，让你的简历脱颖而出",
      icon: <LayoutTemplate className="w-8 h-8 text-orange-500" />,
      path: "/front/resume",
      color: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Career Development
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            助力你的
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mx-2">
              职业发展
            </span>
            之路
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            从简历优化到面试准备，我们提供全方位的求职辅助工具与资源，帮助你斩获心仪 Offer。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {careerModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                onClick={() => navigate(module.path)}
                className="group h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col md:flex-row items-start gap-6"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-150 opacity-10 ${module.color.replace('bg-', 'bg-')}`} />
                
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {module.icon}
                </div>
                
                <div className="flex-1 relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {module.desc}
                  </p>
                  
                  <div className={`flex items-center text-sm font-medium ${module.textColor} group-hover:underline underline-offset-4`}>
                    立即查看 <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部横幅 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-blue-900 dark:to-purple-900 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <TrendingUp className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                准备好开启职业生涯的新篇章了吗？
              </h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                查漏补缺，有的放矢。立即开始你的求职准备，让每一次面试都充满信心。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerHub;
