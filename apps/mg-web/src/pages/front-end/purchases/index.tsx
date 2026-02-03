import React, { useState } from 'react';
import { Table, Tag, Card, Tabs, Button, Typography, Space, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ShoppingBag, Calendar, Package, CreditCard, Clock, FileText } from 'lucide-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export interface Order {
    id: string;
    productName: string;
    amount: number;
    currency: 'CNY' | 'COINS';
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    createTime: string;
    type: 'vip' | 'mall' | 'article';
    orderNo: string;
}

// Mock Data
const MOCK_ORDERS: Order[] = [
    {
        id: '1',
        orderNo: 'ORD202403150001',
        productName: 'VIP 月度会员',
        amount: 68,
        currency: 'CNY',
        status: 'completed',
        createTime: '2024-03-15 10:30:00',
        type: 'vip'
    },
    {
        id: '2',
        orderNo: 'ORD202403100023',
        productName: '木瓜定制鼠标垫',
        amount: 2000,
        currency: 'COINS',
        status: 'pending',
        createTime: '2024-03-10 14:20:00',
        type: 'mall'
    },
    {
        id: '3',
        orderNo: 'ORD202403050012',
        productName: '高级算法面试通关指南',
        amount: 29,
        currency: 'CNY',
        status: 'completed',
        createTime: '2024-03-05 09:15:00',
        type: 'article'
    },
    {
        id: '4',
        orderNo: 'ORD202402280056',
        productName: 'VIP 月度会员',
        amount: 68,
        currency: 'CNY',
        status: 'completed',
        createTime: '2024-02-28 10:30:00',
        type: 'vip'
    },
    {
        id: '5',
        orderNo: 'ORD202402200008',
        productName: '机械键盘键帽套装',
        amount: 5000,
        currency: 'COINS',
        status: 'completed',
        createTime: '2024-02-20 16:45:00',
        type: 'mall'
    }
];

const PurchasesPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');

    const columns: ColumnsType<Order> = [
        {
            title: '订单信息',
            dataIndex: 'productName',
            key: 'productName',
            render: (text, record) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{text}</span>
                    <span className="text-xs text-gray-500">订单号: {record.orderNo}</span>
                </div>
            ),
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const config = {
                    vip: { color: 'gold', text: '会员服务', icon: <CreditCard size={14} /> },
                    mall: { color: 'blue', text: '商城兑换', icon: <Package size={14} /> },
                    article: { color: 'cyan', text: '付费文章', icon: <FileText size={14} /> },
                }[type as string] || { color: 'default', text: '其他', icon: null };
                
                return (
                    <Tag color={config.color} className="flex items-center gap-1 w-fit">
                        {config.icon}
                        {config.text}
                    </Tag>
                );
            }
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => (
                <span className={`font-mono font-bold ${record.currency === 'COINS' ? 'text-amber-500' : 'text-gray-900 dark:text-gray-100'}`}>
                    {record.currency === 'CNY' ? '¥' : ''}{amount}{record.currency === 'COINS' ? ' 木瓜币' : ''}
                </span>
            ),
        },
        {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (time) => (
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar size={14} />
                    {dayjs(time).format('YYYY-MM-DD HH:mm')}
                </div>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const config = {
                    completed: { color: 'success', text: '已完成' },
                    pending: { color: 'processing', text: '处理中' },
                    failed: { color: 'error', text: '失败' },
                    refunded: { color: 'default', text: '已退款' },
                }[status as string];
                
                return <Tag color={config?.color}>{config?.text}</Tag>;
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size="small">查看详情</Button>
                    {record.status === 'pending' && <Button type="link" size="small" danger>取消</Button>}
                </Space>
            ),
        },
    ];

    const filteredData = activeTab === 'all' 
        ? MOCK_ORDERS 
        : MOCK_ORDERS.filter(order => order.type === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <ShoppingBag className="text-green-500" size={32} />
                        我的购买
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        查看您的所有订单历史、会员订阅和商城兑换记录
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm min-h-[600px] p-6">
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        items={[
                            { key: 'all', label: '全部订单', icon: <ShoppingBag size={16} /> },
                            { key: 'vip', label: '会员服务', icon: <CreditCard size={16} /> },
                            { key: 'mall', label: '商城兑换', icon: <Package size={16} /> },
                            { key: 'article', label: '付费内容', icon: <FileText size={16} /> },
                        ]}
                    />
                    
                    <Table 
                        columns={columns} 
                        dataSource={filteredData} 
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        className="mt-4"
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PurchasesPage;
