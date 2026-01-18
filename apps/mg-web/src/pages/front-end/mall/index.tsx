import React, { useState } from 'react';
import { Card, Button, Tag, Tabs, message, Modal, Image } from 'antd';
import { ShoppingBag, Gift, Coins, Trophy, Clock } from 'lucide-react';

// Mock Data
const PRODUCTS = [
    {
        id: 1,
        name: 'VIP 月卡兑换券',
        price: 500,
        image: 'https://pawpaw-img.oss-cn-beijing.aliyuncs.com/vip/VIP%282%29.svg',
        description: '兑换一个月 VIP 会员权益',
        type: 'virtual',
        stock: 999
    },
    {
        id: 2,
        name: 'SVIP 季卡兑换券',
        price: 1500,
        image: 'https://pawpaw-img.oss-cn-beijing.aliyuncs.com/vip/svip.svg',
        description: '兑换三个月 SVIP 会员权益',
        type: 'virtual',
        stock: 500
    },
    {
        id: 3,
        name: '木瓜定制鼠标垫',
        price: 2000,
        image: 'https://img.pawpaw18.cn/user-img/mousepad_mock.jpg', // Placeholder
        description: '超大号防滑鼠标垫，程序员专用',
        type: 'physical',
        stock: 50
    },
    {
        id: 4,
        name: '机械键盘键帽套装',
        price: 5000,
        image: 'https://img.pawpaw18.cn/user-img/keycaps_mock.jpg', // Placeholder
        description: 'PBT热升华键帽，木瓜主题配色',
        type: 'physical',
        stock: 20
    }
];

const MallPage: React.FC = () => {
    // Mock user coins - in real app, get from context or API
    const [userCoins, setUserCoins] = useState(1250); 
    const [activeTab, setActiveTab] = useState('all');

    const handleRedeem = (product: any) => {
        if (userCoins < product.price) {
            message.error('木瓜币不足，无法兑换');
            return;
        }

        Modal.confirm({
            title: '确认兑换',
            content: `确定消耗 ${product.price} 木瓜币兑换 "${product.name}" 吗？`,
            onOk: () => {
                // Mock API call
                setTimeout(() => {
                    setUserCoins(prev => prev - product.price);
                    message.success('兑换成功！请在"我的物品"中查看');
                }, 500);
            }
        });
    };

    const filteredProducts = activeTab === 'all' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.type === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <ShoppingBag className="text-blue-500" size={32} />
                            木瓜商城
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            使用木瓜币兑换精美礼品和会员权益
                        </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 px-6 py-4 rounded-xl flex items-center gap-4 border border-amber-100 dark:border-amber-800">
                        <div className="p-3 bg-amber-100 dark:bg-amber-800 rounded-full">
                            <Coins className="text-amber-600 dark:text-amber-400" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">当前余额</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                                {userCoins} <span className="text-sm font-normal">木瓜币</span>
                            </p>
                        </div>
                        <Button type="primary" className="ml-4 bg-amber-500 hover:bg-amber-600 border-none">
                            赚取更多
                        </Button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[600px]">
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        className="px-6 pt-4"
                        items={[
                            { key: 'all', label: '全部商品', icon: <Gift size={16} /> },
                            { key: 'virtual', label: '虚拟权益', icon: <Trophy size={16} /> },
                            { key: 'physical', label: '实物周边', icon: <ShoppingBag size={16} /> },
                        ]}
                    />
                    
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <Card 
                                key={product.id}
                                hoverable
                                cover={
                                    <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                                        <img 
                                            alt={product.name} 
                                            src={product.image} 
                                            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-110"
                                            // Add error fallback if needed
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=No+Image';
                                            }}
                                        />
                                    </div>
                                }
                                className="overflow-hidden border-gray-100 dark:border-gray-700 dark:bg-gray-800"
                                bodyStyle={{ padding: '1.5rem' }}
                            >
                                <div className="mb-2">
                                    <Tag color={product.type === 'virtual' ? 'blue' : 'purple'}>
                                        {product.type === 'virtual' ? '虚拟权益' : '实物周边'}
                                    </Tag>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                                    {product.description}
                                </p>
                                
                                <div className="flex items-end justify-between mt-4">
                                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xl">
                                        <Coins size={18} />
                                        {product.price}
                                    </div>
                                    <Button 
                                        type="primary"
                                        disabled={userCoins < product.price || product.stock <= 0}
                                        onClick={() => handleRedeem(product)}
                                    >
                                        {product.stock <= 0 ? '已售罄' : '立即兑换'}
                                    </Button>
                                </div>
                                <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    剩余库存: {product.stock}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MallPage;
