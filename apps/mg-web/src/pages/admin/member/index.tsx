import React, { useEffect, useMemo, useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, Modal, Form, Select, message, Tabs } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CrownOutlined } from '@ant-design/icons';
import { getAdminUsers } from '@/utils/adminRbac';

interface MemberPlan {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
}

const initialPlans: MemberPlan[] = [
  { id: 'plan_basic', name: '基础会员', price: 9.9, status: 'active' },
  { id: 'plan_pro', name: '高级会员', price: 29.9, status: 'active' },
];

const AdminMember: React.FC = () => {
  const [plans, setPlans] = useState<MemberPlan[]>(initialPlans);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<MemberPlan>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('plans');
  const [searchKey, setSearchKey] = useState<string>('');

  const users = useMemo(() => getAdminUsers(), []);

  type UserMembership = {
    userId: string;
    planId?: string;
    isMember: boolean;
  };

  const STORAGE_KEY = 'mg_member_user_status_v1';
  const [memberships, setMemberships] = useState<Record<string, UserMembership>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) as Record<string, UserMembership> : {};
      setMemberships(parsed);
    } catch {
      setMemberships({});
    }
  }, []);

  const saveMemberships = (next: Record<string, UserMembership>) => {
    setMemberships(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name', render: (text: string) => <Space><CrownOutlined />{text}</Space> },
    { title: '价格(¥)', dataIndex: 'price', key: 'price' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: MemberPlan['status']) => <Tag color={s === 'active' ? 'success' : 'default'}>{s === 'active' ? '启用' : '停用'}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MemberPlan) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: MemberPlan) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const next = plans.filter(p => p.id !== id);
    setPlans(next);
    message.success('已删除');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        const next = plans.map(p => (p.id === editingId ? { ...p, ...values } : p));
        setPlans(next);
      } else {
        const next: MemberPlan = {
          id: `plan_${Date.now()}`,
          name: values.name,
          price: Number(values.price),
          status: values.status as MemberPlan['status'],
        };
        setPlans([...plans, next]);
      }
      message.success('保存成功');
      setIsModalVisible(false);
    });
  };

  const planOptions = plans.filter(p => p.status === 'active').map(p => ({ label: p.name, value: p.id }));

  const filteredUsers = users.filter(u => {
    const key = searchKey.trim().toLowerCase();
    if (!key) return true;
    return (u.username.toLowerCase().includes(key) || u.name.toLowerCase().includes(key));
  });

  const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    {
      title: '会员状态',
      key: 'isMember',
      render: (_: any, record: any) => {
        const m = memberships[record.id];
        if (m?.isMember) {
          const plan = plans.find(p => p.id === m.planId);
          return <Space><Tag color="gold">已开通</Tag><Tag>{plan?.name || '未指定方案'}</Tag></Space>;
        }
        return <Tag>未开通</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => {
        const m = memberships[record.id];
        const isMember = !!m?.isMember;
        return (
          <Space>
            {!isMember && (
              <Button
                type="primary"
                onClick={() => {
                  const next = {
                    ...memberships,
                    [record.id]: {
                      userId: record.id,
                      isMember: true,
                      planId: planOptions[0]?.value,
                    }
                  };
                  saveMemberships(next);
                  message.success('已开通会员');
                }}
              >
                开启会员
              </Button>
            )}
            {isMember && (
              <>
                <Select
                  size="small"
                  style={{ width: 140 }}
                  value={m?.planId}
                  options={planOptions}
                  placeholder="选择方案"
                  onChange={(val) => {
                    const next = {
                      ...memberships,
                      [record.id]: {
                        userId: record.id,
                        isMember: true,
                        planId: val,
                      }
                    };
                    saveMemberships(next);
                    message.success('已更新方案');
                  }}
                />
                <Button
                  danger
                  onClick={() => {
                    const next = {
                      ...memberships,
                      [record.id]: {
                        userId: record.id,
                        isMember: false,
                        planId: undefined,
                      }
                    };
                    saveMemberships(next);
                    message.success('已取消会员');
                  }}
                >
                  取消会员
                </Button>
              </>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'plans', label: '会员方案' },
          { key: 'userMembers', label: '用户会员' },
        ]}
      />

      {activeTab === 'plans' && (
        <>
          <Card>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input placeholder="搜索会员方案" prefix={<SearchOutlined />} style={{ width: 240 }} />
                <Button type="primary">搜索</Button>
              </div>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增方案
              </Button>
            </div>
          </Card>
          <Card>
            <Table columns={columns} dataSource={plans} rowKey="id" />
          </Card>
        </>
      )}

      {activeTab === 'userMembers' && (
        <>
          <Card>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input
                  placeholder="搜索用户名/姓名"
                  prefix={<SearchOutlined />}
                  style={{ width: 260 }}
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                />
                <Button type="primary">搜索</Button>
              </div>
            </div>
          </Card>
          <Card>
            <Table
              columns={userColumns}
              dataSource={filteredUsers}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      )}

      <Modal
        title="会员方案"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="价格(¥)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="active">启用</Select.Option>
              <Select.Option value="inactive">停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMember;
