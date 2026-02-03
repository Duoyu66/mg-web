import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, Modal, Form, Select, message, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ReconciliationOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { AdminUser } from '@/utils/adminRbac';
import { getAdminUsers } from '@/utils/adminRbac';

type BillCurrency = 'CNY' | 'COINS';
type BillStatus = 'unpaid' | 'paid' | 'overdue';
type BillCategory = 'vip' | 'mall' | 'article' | 'other';

interface AdminBill {
  id: string;
  billNo: string;
  userId: string;
  amount: number;
  currency: BillCurrency;
  category: BillCategory;
  period: string;
  status: BillStatus;
  createTime: string;
}

interface BillFormValues {
  billNo: string;
  userId: string;
  amount: number;
  currency: BillCurrency;
  category: BillCategory;
  period: string;
  status: BillStatus;
  createTime: dayjs.Dayjs;
}

const STORAGE_KEY = 'mg_admin_bills_v1';

const AdminBillPage: React.FC = () => {
  const [bills, setBills] = useState<AdminBill[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState<AdminBill | null>(null);
  const [form] = Form.useForm<BillFormValues>();

  const users = useMemo<AdminUser[]>(() => getAdminUsers(), []);

  const userMap = useMemo(() => {
    const map = new Map<string, AdminUser>();
    users.forEach(u => map.set(u.id, u));
    return map;
  }, [users]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as AdminBill[]) : [];
      setBills(parsed);
    } catch {
      setBills([]);
    }
  }, []);

  const saveBills = (next: AdminBill[]) => {
    setBills(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAdd = () => {
    setEditingBill(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: AdminBill) => {
    setEditingBill(record);
    form.setFieldsValue({
      billNo: record.billNo,
      userId: record.userId,
      amount: record.amount,
      currency: record.currency,
      category: record.category,
      period: record.period,
      status: record.status,
      createTime: dayjs(record.createTime),
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const next = bills.filter(b => b.id !== id);
    saveBills(next);
    message.success('已删除账单');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const base: AdminBill = {
        id: editingBill ? editingBill.id : `bill_${Date.now()}`,
        billNo: values.billNo,
        userId: values.userId,
        amount: Number(values.amount),
        currency: values.currency,
        category: values.category,
        period: values.period,
        status: values.status,
        createTime: values.createTime ? values.createTime.format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      if (editingBill) {
        const next = bills.map(b => (b.id === editingBill.id ? base : b));
        saveBills(next);
        message.success('账单已更新');
      } else {
        const next = [base, ...bills];
        saveBills(next);
        message.success('账单已创建');
      }
      setIsModalVisible(false);
      setEditingBill(null);
    });
  };

  const filteredBills = useMemo(() => {
    const key = searchText.trim().toLowerCase();
    if (!key) return bills;
    return bills.filter(b => {
      const user = userMap.get(b.userId);
      const userText = user ? `${user.name}${user.username}`.toLowerCase() : '';
      return (
        b.billNo.toLowerCase().includes(key) ||
        b.period.toLowerCase().includes(key) ||
        userText.includes(key)
      );
    });
  }, [bills, searchText, userMap]);

  const columns: ColumnsType<AdminBill> = [
    {
      title: '账单号',
      dataIndex: 'billNo',
      key: 'billNo',
      render: (text: string) => (
        <Space>
          <ReconciliationOutlined />
          <span>{text}</span>
        </Space>
      ),
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
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: BillCategory) => {
        if (category === 'vip') {
          return <Tag color="gold">会员</Tag>;
        }
        if (category === 'mall') {
          return <Tag color="blue">商城</Tag>;
        }
        if (category === 'article') {
          return <Tag color="cyan">付费内容</Tag>;
        }
        return <Tag>其他</Tag>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (_: number, record: AdminBill) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {record.currency === 'CNY' ? '¥' : ''}
          {record.amount}
          {record.currency === 'COINS' ? ' 木瓜币' : ''}
        </span>
      ),
    },
    {
      title: '账单周期',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: BillStatus) => {
        if (status === 'paid') {
          return <Tag color="success">已支付</Tag>;
        }
        if (status === 'unpaid') {
          return <Tag color="warning">待支付</Tag>;
        }
        if (status === 'overdue') {
          return <Tag color="error">已逾期</Tag>;
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
      render: (_: any, record: AdminBill) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status !== 'paid' && (
            <Button
              type="link"
              onClick={() => {
                const next = bills.map(b =>
                  b.id === record.id ? { ...b, status: 'paid' as BillStatus } : b
                );
                saveBills(next);
                message.success('标记为已支付');
              }}
            >
              标记已支付
            </Button>
          )}
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
              placeholder="搜索账单号 / 周期 / 用户"
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
            新建账单
          </Button>
        </div>
      </Card>

      <Card>
        <Table<AdminBill> columns={columns} dataSource={filteredBills} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingBill ? '编辑账单' : '新建账单'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingBill(null);
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="billNo" label="账单号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="userId" label="用户" rules={[{ required: true }]}>
            <Select placeholder="选择用户" options={userOptions} />
          </Form.Item>
          <Form.Item name="category" label="账单分类" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="vip">会员</Select.Option>
              <Select.Option value="mall">商城</Select.Option>
              <Select.Option value="article">付费内容</Select.Option>
              <Select.Option value="other">其他</Select.Option>
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
          <Form.Item name="period" label="账单周期" rules={[{ required: true }]}>
            <Input placeholder="例如：2024-03" />
          </Form.Item>
          <Form.Item name="status" label="账单状态" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="unpaid">待支付</Select.Option>
              <Select.Option value="paid">已支付</Select.Option>
              <Select.Option value="overdue">已逾期</Select.Option>
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

export default AdminBillPage;

