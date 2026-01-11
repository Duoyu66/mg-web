import React, { useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, Modal, Form, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user' | 'editor';
  status: 'active' | 'disabled';
  lastLogin: string;
}

const mockUsers: User[] = [
  { id: '1', username: 'admin', name: '管理员', role: 'admin', status: 'active', lastLogin: '2023-10-27 10:00:00' },
  { id: '2', username: 'zhangsan', name: '张三', role: 'user', status: 'active', lastLogin: '2023-10-26 15:30:00' },
  { id: '3', username: 'lisi', name: '李四', role: 'user', status: 'disabled', lastLogin: '2023-10-20 09:15:00' },
];

const AdminUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

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
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = role === 'admin' ? 'geekblue' : 'green';
        if (role === 'editor') color = 'volcano';
        return (
          <Tag color={color} key={role}>
            {role.toUpperCase()}
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
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: User) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk: () => {
        setUsers(users.filter(user => user.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      // Mock save
      message.success('保存成功');
      setIsModalVisible(false);
    });
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
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="editor">编辑</Select.Option>
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
