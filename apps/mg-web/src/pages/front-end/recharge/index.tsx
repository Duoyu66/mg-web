import React, { useState } from 'react';
import { Card, Button, InputNumber, Radio, message, List, Tag, Typography, Divider } from 'antd';
import { 
  PayCircleOutlined, 
  WechatOutlined, 
  AlipayCircleOutlined, 
  CreditCardOutlined, 
  HistoryOutlined,
  ThunderboltOutlined,
  CheckCircleFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const RechargePage: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('wechat');
  const [loading, setLoading] = useState<boolean>(false);

  // Mock data
  const balance = 12580.00;
  const recentRecords = [
    { id: 1, amount: 100, method: '微信支付', time: '2023-10-24 14:30', status: 'success' },
    { id: 2, amount: 500, method: '支付宝', time: '2023-10-20 09:15', status: 'success' },
    { id: 3, amount: 50, method: '微信支付', time: '2023-10-15 18:45', status: 'success' },
  ];

  const predefinedAmounts = [10, 50, 100, 200, 500, 1000];

  const handleRecharge = () => {
    const finalAmount = customAmount || amount;
    if (!finalAmount || finalAmount <= 0) {
      message.warning('请输入有效的充值金额');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success(`成功充值 ¥${finalAmount}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center md:text-left space-y-2">
          <Title level={2} className="!mb-0 dark:!text-white flex items-center justify-center md:justify-start gap-3">
            <span className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <PayCircleOutlined />
            </span>
            充值中心
          </Title>
          <Text className="text-gray-500 dark:text-gray-400">安全、快捷的账户充值服务，支持多种支付方式</Text>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Recharge Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl transform transition-all hover:scale-[1.01]">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-blue-100 text-sm font-medium mb-1">当前账户余额</div>
                <div className="text-5xl font-bold mb-4 tracking-tight">
                  ¥ {balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex gap-3">
                  <Tag className="bg-white/20 border-none text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    普通会员
                  </Tag>
                  <Tag className="bg-white/20 border-none text-white px-3 py-1 rounded-full backdrop-blur-sm">
                    积分: 2450
                  </Tag>
                </div>
              </div>
            </div>

            {/* Amount Selection */}
            <Card 
              variant="borderless" 
              className="rounded-2xl shadow-sm dark:bg-gray-800"
              title={<span className="text-lg font-bold dark:text-white">选择充值金额</span>}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {predefinedAmounts.map((amt) => (
                  <div
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount(null);
                    }}
                    className={`
                      cursor-pointer relative p-4 rounded-xl border-2 text-center transition-all duration-200
                      ${amount === amt && customAmount === null
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 dark:text-gray-300 bg-white dark:bg-gray-800'}
                    `}
                  >
                    {amount === amt && customAmount === null && (
                      <div className="absolute -top-2 -right-2 text-blue-500 bg-white dark:bg-gray-800 rounded-full">
                        <CheckCircleFilled className="text-xl" />
                      </div>
                    )}
                    <div className="text-2xl font-bold">¥{amt}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">售价 ¥{amt}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                <Text className="dark:text-gray-300 font-medium whitespace-nowrap">自定义金额：</Text>
                <InputNumber
                  min={1}
                  max={100000}
                  prefix="¥"
                  size="large"
                  className="w-full md:w-64"
                  placeholder="输入金额"
                  value={customAmount}
                  onChange={(val) => {
                    setCustomAmount(val);
                    if (val) setAmount(0);
                  }}
                />
              </div>
            </Card>

            {/* Payment Method */}
            <Card 
              variant="borderless" 
              className="rounded-2xl shadow-sm dark:bg-gray-800"
              title={<span className="text-lg font-bold dark:text-white">支付方式</span>}
            >
              <Radio.Group 
                value={paymentMethod} 
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full flex flex-col gap-3"
              >
                {[
                  { value: 'wechat', icon: <WechatOutlined className="text-green-500 text-2xl" />, label: '微信支付', desc: '推荐使用，安全快捷' },
                  { value: 'alipay', icon: <AlipayCircleOutlined className="text-blue-500 text-2xl" />, label: '支付宝', desc: '数亿用户的选择' },
                  { value: 'card', icon: <CreditCardOutlined className="text-indigo-500 text-2xl" />, label: '银行卡', desc: '支持储蓄卡/信用卡' },
                ].map((item) => (
                  <label 
                    key={item.value}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                      ${paymentMethod === item.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <Radio value={item.value} className="mr-0" />
                      {item.icon}
                      <div>
                        <div className="font-bold text-gray-800 dark:text-gray-200">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </Radio.Group>

              <Divider className="my-6 dark:border-gray-700" />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <Text className="text-gray-500 dark:text-gray-400">支付金额</Text>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    ¥ {(customAmount || amount).toLocaleString()}
                  </div>
                </div>
                <Button 
                  type="primary" 
                  size="large" 
                  className="w-full md:w-48 h-12 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:shadow-lg hover:scale-105 transition-all"
                  icon={<ThunderboltOutlined />}
                  loading={loading}
                  onClick={handleRecharge}
                >
                  立即充值
                </Button>
              </div>
            </Card>

          </div>

          {/* Right Column: Info & History */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Recharge Instructions */}
            <Card 
              variant="borderless" 
              className="rounded-2xl shadow-sm dark:bg-gray-800"
              title={<span className="font-bold dark:text-white">充值说明</span>}
            >
              <ul className="list-disc list-inside space-y-2 text-gray-500 dark:text-gray-400 text-sm">
                <li>单笔充值最低 10 元，最高 50,000 元。</li>
                <li>充值成功后，资金将实时到账。</li>
                <li>若遇到支付问题，请联系客服支持。</li>
                <li>充值余额可用于购买课程、会员服务等。</li>
                <li>为了您的资金安全，请勿向他人透露支付密码。</li>
              </ul>
            </Card>

            {/* Recent History */}
            <Card 
              variant="borderless" 
              className="rounded-2xl shadow-sm dark:bg-gray-800"
              title={
                <div className="flex items-center gap-2">
                  <HistoryOutlined className="text-gray-400" />
                  <span className="font-bold dark:text-white">最近记录</span>
                </div>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={recentRecords}
                renderItem={(item) => (
                  <List.Item className="!px-0 dark:border-gray-700">
                    <List.Item.Meta
                      avatar={
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${item.method.includes('微信') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}
                        `}>
                          {item.method.includes('微信') ? <WechatOutlined /> : <AlipayCircleOutlined />}
                        </div>
                      }
                      title={<span className="font-medium dark:text-gray-200">充值 ¥{item.amount}</span>}
                      description={<span className="text-xs text-gray-400">{item.time}</span>}
                    />
                    <Tag color="success" className="rounded-full px-2">成功</Tag>
                  </List.Item>
                )}
              />
              <Button type="link" block className="mt-2 text-gray-500 hover:text-blue-600">
                查看全部记录
              </Button>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;
