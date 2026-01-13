import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from './data';

const CategoryList = () => {
    const navigate = useNavigate();

    // 处理分类点击
    const handleCategoryClick = (categoryId: string) => {
        navigate(categoryId);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">题库分类</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    选择你感兴趣的技术领域，开始你的刷题之旅。我们提供了全面的技术栈题目，帮助你提升技能。
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((category) => (
                    <div 
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`
                            group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300
                            bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
                            hover:shadow-xl hover:-translate-y-1
                        `}
                    >
                        <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-3xl
                            transition-transform duration-300 group-hover:scale-110
                            ${category.color}
                        `}>
                            {category.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-primary-600 transition-colors">
                            {category.name}
                        </h3>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                            {category.description}
                        </p>
                        
                        <div className="flex items-center text-sm font-medium text-gray-400 group-hover:text-primary-600 transition-colors">
                            <span>浏览题库</span>
                            <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                        
                        {/* 装饰背景 */}
                        <div className={`
                            absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 
                            transition-transform duration-500 group-hover:scale-150
                            ${category.color.split(' ')[0].replace('bg-', 'bg-current text-')}
                        `} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
