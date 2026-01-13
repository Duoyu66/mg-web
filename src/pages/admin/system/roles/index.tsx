import React, { useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Space, Table, Tag, Tree, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { getAdminPermissionTree, getAdminRoles, listAdminPermissionKeys, saveAdminRoles } from '@/utils/adminRbac';

type RoleFormValues = {
  name: string;
  description?: string;
};

const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState(() => getAdminRoles());
  const [open, setOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [checkedPermissionKeys, setCheckedPermissionKeys] = useState<string[]>([]);
  const [form] = Form.useForm<RoleFormValues>();

  const allPermissionKeys = useMemo(() => new Set(listAdminPermissionKeys()), []);
  const treeData = useMemo(() => getAdminPermissionTree() as unknown as DataNode[], []);

  const closeModal = () => {
    setOpen(false);
    setEditingRoleId(null);
    setCheckedPermissionKeys([]);
    form.resetFields();
  };

  const openCreate = () => {
    setOpen(true);
    setEditingRoleId(null);
    setCheckedPermissionKeys([]);
    form.resetFields();
  };

  const openEdit = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    setOpen(true);
    setEditingRoleId(roleId);
    form.setFieldsValue({ name: role.name, description: role.description });
    setCheckedPermissionKeys(role.permissions);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    const normalizedPermissions = checkedPermissionKeys.filter(k => allPermissionKeys.has(k));

    if (normalizedPermissions.length === 0) {
      message.error('请至少选择 1 个菜单权限');
      return;
    }

    const nextRoles = [...roles];
    if (editingRoleId) {
      const index = nextRoles.findIndex(r => r.id === editingRoleId);
      if (index >= 0) {
        nextRoles[index] = {
          ...nextRoles[index],
          name: values.name,
          description: values.description,
          permissions: normalizedPermissions,
        };
      }
    } else {
      nextRoles.push({
        id: `role_${Date.now()}`,
        name: values.name,
        description: values.description,
        permissions: normalizedPermissions,
      });
    }

    setRoles(nextRoles);
    saveAdminRoles(nextRoles);
    message.success('保存成功');
    closeModal();
  };

  const handleDelete = (roleId: string) => {
    if (roleId === 'role_super_admin') {
      message.warning('超级管理员角色不可删除');
      return;
    }
    const next = roles.filter(r => r.id !== roleId);
    setRoles(next);
    saveAdminRoles(next);
    message.success('删除成功');
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: { id: string }) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{name}</span>
          {record.id === 'role_super_admin' ? <Tag color="gold">内置</Tag> : null}
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (v: string | undefined) => v || <span style={{ color: '#999' }}>—</span>,
    },
    {
      title: '权限数量',
      key: 'permissionCount',
      render: (_: unknown, record: { permissions: string[] }) => (
        <Tag color="purple">{record.permissions.length}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: { id: string }) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record.id)}>
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={record.id === 'role_super_admin'}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold">角色管理</div>
            <div className="text-gray-500 text-sm mt-1">为不同角色配置可见菜单与可访问页面</div>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新建角色
          </Button>
        </div>
      </Card>

      <Card>
        <Table rowKey="id" columns={columns} dataSource={roles} pagination={false} />
      </Card>

      <Modal
        title={editingRoleId ? '编辑角色' : '新建角色'}
        open={open}
        onOk={handleSave}
        onCancel={closeModal}
        okText="保存"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="例如：内容运营、客服、审核员" />
          </Form.Item>
          <Form.Item name="description" label="角色描述">
            <Input placeholder="可选，描述角色用途" />
          </Form.Item>
          <Form.Item label="菜单权限">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <Tree
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedPermissionKeys}
                onCheck={(checked) => {
                  const next = Array.isArray(checked) ? (checked as string[]) : ((checked as any).checked as string[]);
                  setCheckedPermissionKeys(next);
                }}
                treeData={treeData}
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRolesPage;

