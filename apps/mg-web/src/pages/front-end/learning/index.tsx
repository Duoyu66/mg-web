import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Database, 
  Map, 
  FileText, 
  PenTool, 
  CheckSquare, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import { Card } from 'antd';

const LearningHub = () => {
  const navigate = useNavigate();

  const learningModules = [
    {
      title: "算法训练",
      desc: "精选高频面试题，系统化算法学习路径",
      icon: <Code2 className="w-8 h-8 text-blue-500" />,
      path: "/front/algorithm",
      color: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "题库中心",
      desc: "海量技术题库，覆盖前端、后端及计算机基础",
      icon: <Database className="w-8 h-8 text-purple-500" />,
      path: "/front/questionBank",
      color: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "学习路线",
      desc: "从入门到精通，为你规划清晰的技术成长路径",
      icon: <Map className="w-8 h-8 text-emerald-500" />,
      path: "/front/route",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "文档管理",
      desc: "沉淀技术知识，构建个人专属知识库",
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      path: "/front/document",
      color: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "学习笔记",
      desc: "随时随地记录灵感，Markdown 实时预览",
      icon: <PenTool className="w-8 h-8 text-pink-500" />,
      path: "/front/note",
      color: "bg-pink-50 dark:bg-pink-900/20",
      textColor: "text-pink-600 dark:text-pink-400"
    },
    {
      title: "待办事项",
      desc: "高效管理学习计划，通过 GTD 提升效率",
      icon: <CheckSquare className="w-8 h-8 text-cyan-500" />,
      path: "/front/todo",
      color: "bg-cyan-50 dark:bg-cyan-900/20",
      textColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      title: "刷题闯关",
      desc: "游戏化刷题体验，在挑战中提升技术实力",
      icon: <BrainCircuit className="w-8 h-8 text-indigo-500" />,
      path: "/question/nav",
      color: "bg-indigo-50 dark:bg-indigo-900/20",
      textColor: "text-indigo-600 dark:text-indigo-400"
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
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6">
            开启你的技术学习之旅
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            系统化的学习路径，高效的练习工具，助你构建完整的技术知识体系。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningModules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                onClick={() => navigate(module.path)}
                className="group h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 opacity-10 ${module.color.replace('bg-', 'bg-')}`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${module.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {module.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {module.title}
                  </h3>
                  
                  <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                    {module.desc}
                  </p>
                  
                  <div className={`flex items-center text-sm font-medium ${module.textColor} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300`}>
                    立即开始 <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
