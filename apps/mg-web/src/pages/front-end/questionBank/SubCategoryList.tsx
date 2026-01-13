import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES } from './data';
import { Empty, Button } from 'antd';
import { ArrowLeft } from 'lucide-react';

const SubCategoryList = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();

    const selectedCategory = CATEGORIES.find(c => c.id === categoryId);

    if (!selectedCategory) {
        return (
            <div className="text-center py-12">
                <Empty description="未找到该分类" />
                <Button onClick={() => navigate('..')} className="mt-4">返回上一级</Button>
            </div>
        );
    }

    // 处理子分类点击
    const handleSubCategoryClick = (subCategoryId: string) => {
        navigate(subCategoryId);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-3">
                    <span className={`p-2 rounded-lg ${selectedCategory.color.split(' ')[0]} ${selectedCategory.color.split(' ')[1]}`}>
                        {selectedCategory.icon}
                    </span>
                    {selectedCategory.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {selectedCategory.description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCategory.subCategories.map((sub) => (
                    <div
                        key={sub.id}
                        onClick={() => handleSubCategoryClick(sub.id)}
                        className="
                            group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700
                            hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer transition-all duration-200
                        "
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:text-primary-600">
                                {sub.name}
                            </h3>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                                {sub.count} 题
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {sub.description}
                        </p>
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary-500 h-full rounded-full w-2/3 opacity-80" />
                        </div>
                        <div className="mt-2 text-xs text-gray-400 flex justify-between">
                            <span>进度</span>
                            <span>66%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryList;
