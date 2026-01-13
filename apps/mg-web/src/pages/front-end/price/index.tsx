import React from 'react';
import { Button, Card, Tag } from 'antd';
import { Check, X, Crown, Zap, Star } from 'lucide-react';

const PricePage: React.FC = () => {
    const plans = [
        {
            id: 'ordinary',
            title: '普通用户',
            price: '免费',
            period: '永久',
            icon: <Star className="w-8 h-8 text-gray-400" />,
            description: '适合刚开始学习的编程新手',
            features: [
                { name: '基础题库访问', included: true },
                { name: '10万+题库', included: true },
                        { name: '独家付费文章阅读', included: true },
                { name: '社区讨论区访问', included: true },
                { name: '广告展示', included: true },
                { name: 'VIP 专属题目', included: false },
                { name: '视频题解', included: false },
                { name: '简历修改服务', included: false },
                { name: '1对1 模拟面试', included: false },
            ],
            buttonText: '当前方案',
            buttonVariant: 'default' as const,
            borderColor: 'border-gray-200',
            headerColor: 'bg-gray-50',
        },
        {
            id: 'platinum',
            title: '月度会员',
            price: '¥49',
            period: '/月',
            icon: <Zap className="w-8 h-8 text-blue-500" />,
            description: '适合致力于提升技能的开发者',
            isPopular: true,
            features: [
                           { name: '有效期-1个月', included: true },
                { name: '全站题库无限制', included: true },
                        { name: '独家付费文章阅读', included: true },
                { name: '无限次代码提交', included: true },
                { name: '优先社区支持', included: true },
                { name: '免广告体验', included: true },
                { name: 'VIP 专属题目', included: true },
                { name: '高清视频题解', included: true },
                { name: '简历修改服务', included: false },
                { name: '1对1 模拟面试', included: false },
            ],
            buttonText: '立即订阅',
            buttonVariant: 'primary' as const,
            borderColor: 'border-blue-200',
            headerColor: 'bg-blue-50',
        },
        {
            id: 'supreme',
            title: '年度会员',
            price: '¥199',
            period: '/年',
            icon: <Crown className="w-8 h-8 text-amber-500" />,
            description: '全方位的求职面试辅导服务',
            features: [
                     { name: '有效期-永久', included: true },
                { name: '全站题库无限制', included: true },
                  { name: '独家付费文章阅读', included: true },
                { name: '无限次代码提交', included: true },
                { name: 'VIP 专属客服', included: true },
                { name: '免广告体验', included: true },
                { name: 'VIP 专属题目', included: true },
                { name: '高清视频题解', included: true },
                { name: '资深导师简历修改', included: true },
                { name: '专家 1对1 模拟面试', included: true },
            ],
            buttonText: '联系咨询',
            buttonVariant: 'gold' as const,
            borderColor: 'border-amber-200',
            headerColor: 'bg-amber-50',
        }
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        选择适合您的<span className="text-blue-600">会员计划</span>
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        无论您是编程初学者还是寻求职业突破的资深开发者，我们都有适合您的方案。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className={`relative flex flex-col rounded-2xl border ${plan.borderColor} bg-white dark:bg-gray-800 shadow-xl transition-transform hover:scale-105 duration-300`}
                        >
                            {plan.isPopular && (
                                <div className="absolute top-0 right-0 z-10 pointer-events-none">
                                    <div className="translate-x-6 -translate-y-3 rotate-45 bg-blue-600 text-white text-xs font-bold px-8 py-1 shadow-md">
                                        热门推荐
                                    </div>
                                </div>
                            )}

                            <div className={`p-8 rounded-t-2xl ${plan.headerColor} dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700`}>
                                <div className="flex justify-between items-start">
                                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-sm">
                                        {plan.icon}
                                    </div>
                                    {plan.isPopular && (
                                        <Tag color="blue" className="rounded-full px-3 py-1 mr-0">
                                            最受欢迎
                                        </Tag>
                                    )}
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                                    {plan.title}
                                </h3>
                                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
                                    {plan.description}
                                </p>
                                <div className="mt-6 flex items-baseline">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                        {plan.price}
                                    </span>
                                    <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
                                        {plan.period}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-8">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {feature.included ? (
                                                    <Check className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <X className="h-5 w-5 text-gray-300" />
                                                )}
                                            </div>
                                            <p className={`ml-3 text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600 line-through'}`}>
                                                {feature.name}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <Button 
                                    type={plan.buttonVariant === 'primary' ? 'primary' : 'default'}
                                    className={`w-full h-12 text-lg font-medium rounded-xl ${
                                        plan.buttonVariant === 'gold' 
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none hover:from-amber-500 hover:to-amber-700' 
                                            : ''
                                    }`}
                                    size="large"
                                    block
                                >
                                    {plan.buttonText}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricePage;
