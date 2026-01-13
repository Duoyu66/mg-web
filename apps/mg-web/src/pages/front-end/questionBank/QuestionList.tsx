import { useState } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import { Input, Button, Tag, Empty } from 'antd';
import { Search } from 'lucide-react';
import { CATEGORIES, MOCK_QUESTIONS } from './data';

const QuestionList = () => {
    const { categoryId, subCategoryId } = useParams<{ categoryId: string; subCategoryId: string }>();
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    const selectedCategory = CATEGORIES.find(c => c.id === categoryId);
    const selectedSubCategory = selectedCategory?.subCategories.find(s => s.id === subCategoryId);

    const handleQuestionClick = (questionId: string) => {
        navigate(questionId);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                        {selectedSubCategory?.name || '未知分类'} 题目列表
                    </h2>
                    <p className="text-sm text-gray-500">
                        共 {selectedSubCategory?.count || 0} 道题目
                    </p>
                </div>
                <div className="w-full md:w-64">
                    <Input 
                        prefix={<Search size={16} className="text-gray-400" />}
                        placeholder="搜索题目..." 
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="rounded-full"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {MOCK_QUESTIONS.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {MOCK_QUESTIONS.map((question) => (
                            <div 
                                key={question.id}
                                onClick={() => handleQuestionClick(question.id)}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-primary-600 transition-colors">
                                            {question.title}
                                        </h3>
                                        <Tag 
                                            color={
                                                question.difficulty === '简单' ? 'green' : 
                                                question.difficulty === '中等' ? 'orange' : 'red'
                                            }
                                            className="mr-0"
                                        >
                                            {question.difficulty}
                                        </Tag>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        {question.tags.map(tag => (
                                            <span key={tag} className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                                                #{tag}
                                            </span>
                                        ))}
                                        <span className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
                                        <span>通过率 {question.passRate}</span>
                                    </div>
                                </div>
                                <Button type="primary" size="small" ghost className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    开始挑战
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description="暂无题目" className="py-12" />
                )}
            </div>
        </div>
    );
};

export default QuestionList;
