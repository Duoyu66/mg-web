import { Outlet, Link, useLocation, matchPath } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES } from './data';

const QuestionBankLayout = () => {
    const location = useLocation();

    // 解析路径参数

    // 假设基础路径是 /front/questionBank
    const basePath = '/front/questionBank';

    // 尝试匹配二级路径: /front/questionBank/:categoryId
    const categoryMatch = matchPath(`${basePath}/:categoryId`, location.pathname);
    // 尝试匹配三级路径: /front/questionBank/:categoryId/:subCategoryId
    const subCategoryMatch = matchPath(`${basePath}/:categoryId/:subCategoryId`, location.pathname);
    // 尝试匹配四级路径: /front/questionBank/:categoryId/:subCategoryId/:questionId
    const questionMatch = matchPath(`${basePath}/:categoryId/:subCategoryId/:questionId`, location.pathname);

    const categoryId = categoryMatch?.params.categoryId || subCategoryMatch?.params.categoryId || questionMatch?.params.categoryId;
    const subCategoryId = subCategoryMatch?.params.subCategoryId || questionMatch?.params.subCategoryId;
    const questionId = questionMatch?.params.questionId;

    // 查找当前分类和子分类信息
    const currentCategory = categoryId ? CATEGORIES.find(c => c.id === categoryId) : null;
    const currentSubCategory = subCategoryId && currentCategory
        ? currentCategory.subCategories.find(s => s.id === subCategoryId)
        : null;

    // 生成面包屑项
    const breadcrumbItems = [
        {
            title: <Link to={basePath} className="hover:text-primary-600">题库首页</Link>
        }
    ];

    if (currentCategory) {
        breadcrumbItems.push({
            title: subCategoryId ? (
                <Link to={`${basePath}/${currentCategory.id}`} className="hover:text-primary-600">
                    {currentCategory.name}
                </Link>
            ) : (
                <span className="font-bold text-gray-800">{currentCategory.name}</span>
            )
        });
    }

    if (currentSubCategory) {
        breadcrumbItems.push({
            title: questionId ? (
                <Link to={`${basePath}/${currentCategory?.id}/${currentSubCategory.id}`} className="hover:text-primary-600">
                    {currentSubCategory.name}
                </Link>
            ) : (
                <span className="font-bold text-gray-800">{currentSubCategory.name}</span>
            )
        });
    }

    if (questionId) {
        breadcrumbItems.push({
            title: <span className="font-bold text-gray-800">题目详情</span>
        });
    }

    // 判断是否显示返回按钮（非首页）
    const showBackButton = !!categoryId;
    const backPath = questionId
        ? `${basePath}/${categoryId}/${subCategoryId}`
        : subCategoryId
            ? `${basePath}/${categoryId}`
            : basePath;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 面包屑导航 */}
                <div className="mb-6 flex items-center">
                    {showBackButton && (
                        <Link to={backPath} className="mr-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300">
                            <ArrowLeft size={16} />
                        </Link>
                    )}
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* 内容区域 */}
                <Outlet />
            </div>
        </div>
    );
};

export default QuestionBankLayout;
