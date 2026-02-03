import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, Modal, Form, Select, message, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { AdminUser } from '@/utils/adminRbac';
import { getAdminUsers } from '@/utils/adminRbac';

type OrderCurrency = 'CNY' | 'COINS';
type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type OrderType = 'vip' | 'mall' | 'article';

interface AdminOrder {
  id: string;
  orderNo: string;
  productName: string;
  amount: number;
  currency: OrderCurrency;
  status: OrderStatus;
  createTime: string;
  type: OrderType;
  userId: string;
}

interface OrderFormValues {
  orderNo: string;
  productName: string;
  amount: number;
  currency: OrderCurrency;
  status: OrderStatus;
  createTime: dayjs.Dayjs;
  type: OrderType;
  userId: string;
}

const STORAGE_KEY = 'mg_admin_orders_v1';

const AdminOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);
  const [form] = Form.useForm<OrderFormValues>();

  const users = useMemo<AdminUser[]>(() => getAdminUsers(), []);

  const userMap = useMemo(() => {
    const map = new Map<string, AdminUser>();
    users.forEach(u => map.set(u.id, u));
    return map;
  }, [users]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as AdminOrder[]) : [];
      setOrders(parsed);
    } catch {
      setOrders([]);
    }
  }, []);

  const saveOrders = (next: AdminOrder[]) => {
    setOrders(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AdminOrder) => {
    setEditingOrder(record);
    form.setFieldsValue({
      orderNo: record.orderNo,
      productName: record.productName,
      amount: record.amount,
      currency: record.currency,
      status: record.status,
      type: record.type,
      userId: record.userId,
      createTime: dayjs(record.createTime),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const next = orders.filter(o => o.id !== id);
    saveOrders(next);
    message.success('已删除订单');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const base: AdminOrder = {
        id: editingOrder ? editingOrder.id : `order_${Date.now()}`,
        orderNo: values.orderNo,
        productName: values.productName,
        amount: Number(values.amount),
        currency: values.currency,
        status: values.status,
        type: values.type,
        userId: values.userId,
        createTime: values.createTime ? values.createTime.format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      if (editingOrder) {
        const next = orders.map(o => (o.id === editingOrder.id ? base : o));
        saveOrders(next);
        message.success('订单已更新');
      } else {
        const next = [base, ...orders];
        saveOrders(next);
        message.success('订单已创建');
      }
      setIsModalVisible(false);
      setEditingOrder(null);
    });
  };

  const filteredOrders = useMemo(() => {
    const key = searchText.trim().toLowerCase();
    if (!key) return orders;
    return orders.filter(o => {
      const user = userMap.get(o.userId);
      const userText = user ? `${user.name}${user.username}`.toLowerCase() : '';
      return (
        o.productName.toLowerCase().includes(key) ||
        o.orderNo.toLowerCase().includes(key) ||
        userText.includes(key)
      );
    });
  }, [orders, searchText, userMap]);

  const columns: ColumnsType<AdminOrder> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => (
        <Space>
          <ShoppingOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '用户',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: string) => {
        const user = userMap.get(userId);
        if (!user) {
          return <Tag>未知用户</Tag>;
        }
        return (
          <Space>
            <Tag color="blue">{user.name}</Tag>
            <span>{user.username}</span>
          </Space>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: OrderType) => {
        if (type === 'vip') {
          return <Tag color="gold">会员服务</Tag>;
        }
        if (type === 'mall') {
          return <Tag color="blue">商城兑换</Tag>;
        }
        if (type === 'article') {
          return <Tag color="cyan">付费文章</Tag>;
        }
        return <Tag>其他</Tag>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (_: number, record: AdminOrder) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {record.currency === 'CNY' ? '¥' : ''}
          {record.amount}
          {record.currency === 'COINS' ? ' 木瓜币' : ''}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus) => {
        if (status === 'completed') {
          return <Tag color="success">已完成</Tag>;
        }
        if (status === 'pending') {
          return <Tag color="processing">处理中</Tag>;
        }
        if (status === 'failed') {
          return <Tag color="error">失败</Tag>;
        }
        if (status === 'refunded') {
          return <Tag>已退款</Tag>;
        }
        return <Tag>未知</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AdminOrder) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const userOptions = users.map(u => ({
    label: `${u.name} (${u.username})`,
    value: u.id,
  }));

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Input
              placeholder="搜索订单号 / 商品名称 / 用户"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 320 }}
            />
            <Button type="primary" onClick={() => setSearchText(searchText)}>
              搜索
            </Button>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建订单
          </Button>
        </div>
      </Card>

      <Card>
        <Table<AdminOrder> columns={columns} dataSource={filteredOrders} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingOrder ? '编辑订单' : '新建订单'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingOrder(null);
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="orderNo" label="订单号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="productName" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="用户" rules={[{ required: true }]}>
            <Select placeholder="选择用户" options={userOptions} />
          </Form.Item>
          <Form.Item name="type" label="订单类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="vip">会员服务</Select.Option>
              <Select.Option value="mall">商城兑换</Select.Option>
              <Select.Option value="article">付费文章</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="currency" label="货币类型" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="CNY">人民币</Select.Option>
              <Select.Option value="COINS">木瓜币</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="订单状态" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="completed">已完成</Select.Option>
              <Select.Option value="pending">处理中</Select.Option>
              <Select.Option value="failed">失败</Select.Option>
              <Select.Option value="refunded">已退款</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="createTime" label="创建时间" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrderPage;

