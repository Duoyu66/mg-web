import React, { useMemo, useState } from 'react';
import { Button, Card, Select, Space, Table, Tag, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getAdminRoleById, getAdminRoles, getAdminUsers, saveAdminUsers } from '@/utils/adminRbac';

const AdminUserRolesPage: React.FC = () => {
  const [users, setUsers] = useState(() => getAdminUsers());
  const [roles, setRoles] = useState(() => getAdminRoles());

  const roleOptions = useMemo(
    () => roles.map(r => ({ label: r.name, value: r.id })),
    [roles]
  );

  const reload = () => {
    setUsers(getAdminUsers());
    setRoles(getAdminRoles());
    message.success('已刷新');
  };

  const updateUserRole = (userId: string, roleId: string) => {
    const next = users.map(u => (u.id === userId ? { ...u, roleId } : u));
    setUsers(next);
    saveAdminUsers(next);
    message.success('已更新角色');
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (v: string, record: { name: string }) => (
        <div>
          <div style={{ fontWeight: 600 }}>{v}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.name}</div>
        </div>
      ),
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
      title: '当前角色',
      key: 'role',
      render: (_: unknown, record: { roleId: string }) => {
        const role = getAdminRoleById(record.roleId);
        return role ? <Tag color="purple">{role.name}</Tag> : <Tag color="default">未分配</Tag>;
      },
    },
    {
      title: '分配角色',
      key: 'assign',
      render: (_: unknown, record: { id: string; roleId: string }) => (
        <Select
          value={record.roleId}
          style={{ width: 220 }}
          options={roleOptions}
          onChange={(value) => updateUserRole(record.id, value)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">用户角色分配</div>
            <div className="text-gray-500 text-sm mt-1">为不同用户绑定自定义角色</div>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={reload}>
              刷新
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Table rowKey="id" columns={columns} dataSource={users} pagination={false} />
      </Card>
    </div>
  );
};

export default AdminUserRolesPage;

