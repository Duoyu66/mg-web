import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { AdminUser as AdminUserType, getAdminRoleById, getAdminRoles, getAdminUsers, saveAdminUsers, setCurrentAdminUserId } from '@/utils/adminRbac';

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<AdminUserType[]>(() => getAdminUsers());
  const [roles, setRoles] = useState(() => getAdminRoles());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setUsers(getAdminUsers());
    setRoles(getAdminRoles());
  }, []);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <Space><UserOutlined />{text}</Space>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: string) => {
        const role = getAdminRoleById(roleId);
        if (!role) {
          return <Tag color="default">未分配</Tag>;
        }
        return (
          <Tag color="geekblue">
            {role.name}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AdminUserType) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" onClick={() => handleSetCurrent(record.id)}>设为当前登录</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: AdminUserType) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk: () => {
        const next = users.filter(user => user.id !== id);
        setUsers(next);
        saveAdminUsers(next);
        message.success('删除成功');
      },
    });
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingId) {
        const next = users.map(user => (user.id === editingId ? { ...user, ...values } : user));
        setUsers(next);
        saveAdminUsers(next);
      } else {
        const next: AdminUserType = {
          id: `user_${Date.now()}`,
          username: values.username,
          name: values.name,
          roleId: values.roleId,
          status: values.status,
          lastLogin: new Date().toISOString(),
        };
        const all = [...users, next];
        setUsers(all);
        saveAdminUsers(all);
      }
      message.success('保存成功');
      setIsModalVisible(false);
    });
  };

  const handleSetCurrent = (id: string) => {
    setCurrentAdminUserId(id);
    message.success('已切换当前登录用户');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Input placeholder="搜索用户名/姓名" prefix={<SearchOutlined />} style={{ width: 200 }} />
            <Button type="primary">搜索</Button>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加用户
          </Button>
        </div>
      </Card>

      <Card>
        <Table columns={columns} dataSource={users} rowKey="id" />
      </Card>

      <Modal
        title="用户信息"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roleId" label="角色" rules={[{ required: true }]}>
            <Select>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
             <Select>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="disabled">禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUser;
