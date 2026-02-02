import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, theme, Select, Space, Tag, Result, Button } from 'antd';
import { PieChartOutlined, UserOutlined, BankOutlined, BookOutlined, ReadOutlined, HomeOutlined, SettingOutlined, CrownOutlined, EditOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/context/useTheme';
import { canAccessAdminPath, getAdminRoleById, getAdminRoles, getAdminUsers, getCurrentAdminUser, setCurrentAdminUserId } from '@/utils/adminRbac';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode;
  path?: string;
};

interface MenuConfigItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuConfigItem[];
  permissionKey?: string;
}

const menuConfig: MenuConfigItem[] = [
  { key: '/front/admin', label: '控制台', icon: <PieChartOutlined />, path: '/front/admin', permissionKey: '/front/admin' },
  { key: '/front/admin/company', label: '面试公司管理', icon: <BankOutlined />, path: '/front/admin/company', permissionKey: '/front/admin/company' },
  { key: '/front/admin/question', label: '题库管理', icon: <BookOutlined />, path: '/front/admin/question', permissionKey: '/front/admin/question' },
  { key: '/front/admin/article', label: '文章管理', icon: <ReadOutlined />, path: '/front/admin/article', permissionKey: '/front/admin/article' },
  { key: '/front/admin/member', label: '会员管理', icon: <CrownOutlined />, path: '/front/admin/member', permissionKey: '/front/admin/member' },
  { key: '/front/admin/creator', label: '创作中心', icon: <EditOutlined />, path: '/front/admin/creator', permissionKey: '/front/admin/creator' },
  { key: '/front/admin/user', label: '用户管理', icon: <UserOutlined />, path: '/front/admin/user', permissionKey: '/front/admin/user' },
  {
    key: '/front/admin/system',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      { key: '/front/admin/system/roles', label: '角色管理', path: '/front/admin/system/roles', permissionKey: '/front/admin/system/roles' },
      { key: '/front/admin/system/user-roles', label: '用户角色分配', path: '/front/admin/system/user-roles', permissionKey: '/front/admin/system/user-roles' },
    ],
  },
  { key: '/front/home', label: '返回前台', icon: <HomeOutlined />, path: '/front/home' },
];

function generateMenuItems(items: MenuConfigItem[]): MenuItem[] {
  return items.map(item => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: generateMenuItems(item.children),
      } as MenuItem;
    }
    return {
      key: item.path || item.key,
      icon: item.icon,
      label: item.label,
      path: item.path,
    } as MenuItem;
  });
}

function generateBreadcrumbMap(items: MenuConfigItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  const traverse = (nodes: MenuConfigItem[]) => {
    nodes.forEach(node => {
      if (node.path) {
        map[node.path] = node.label;
      } else if (node.key) {
        map[node.key] = node.label;
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  };
  traverse(items);
  return map;
}

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { theme: currentTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState(() => getAdminUsers());
  const [roles, setRoles] = useState(() => getAdminRoles());
  const currentUser = useMemo(() => getCurrentAdminUser(), [users]);
  const currentRole = useMemo(() => (currentUser ? getAdminRoleById(currentUser.roleId) : undefined), [currentUser]);

  useEffect(() => {
    setUsers(getAdminUsers());
    setRoles(getAdminRoles());
  }, [location.pathname]);

  const filterMenuByRole = (nodes: MenuConfigItem[]): MenuConfigItem[] => {
    return nodes
      .map((node) => {
        if (node.children && node.children.length > 0) {
          const nextChildren = filterMenuByRole(node.children);
          if (nextChildren.length === 0) return null;
          return { ...node, children: nextChildren };
        }
        if (!node.permissionKey) return node;
        if (!currentRole) return node;
        return currentRole.permissions.includes(node.permissionKey) ? node : null;
      })
      .filter(Boolean) as MenuConfigItem[];
  };

  const filteredMenuConfig = useMemo(() => {
    if (!currentRole) return menuConfig;
    return filterMenuByRole(menuConfig);
  }, [currentRole]);

  const items = generateMenuItems(filteredMenuConfig);
  const breadcrumbNameMap = generateBreadcrumbMap(menuConfig);

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = [
    { title: '后台管理' },
    ...pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      if (breadcrumbNameMap[url]) {
         return { title: breadcrumbNameMap[url] };
      }
      return null;
    }).filter(item => item !== null) as { title: string }[]
  ];
  
  // Ensure we at least have the dashboard if we are at root admin
  if (location.pathname === '/front/admin' && breadcrumbItems.length === 1) {
      breadcrumbItems.push({ title: '控制台' });
  }

  const canAccess = canAccessAdminPath(location.pathname, currentRole);
  const defaultEntry = currentRole?.permissions?.[0] || '/front/home';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        theme={currentTheme === 'dark' ? 'dark' : 'light'} 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        style={{ borderRight: currentTheme === 'dark' ? 'none' : '1px solid #f0f0f0' }}
      >
        <div style={{ 
            height: 32, 
            margin: 16, 
            background: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#e6f7ff', 
            borderRadius: 6, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: currentTheme === 'dark' ? '#fff' : '#1890ff', 
            fontWeight: 'bold', 
            overflow: 'hidden', 
            whiteSpace: 'nowrap' 
        }}>
           {collapsed ? 'MG' : 'MG 后台管理'}
        </div>
        <Menu 
            theme={currentTheme === 'dark' ? 'dark' : 'light'}
            defaultSelectedKeys={[location.pathname]} 
            selectedKeys={[location.pathname]}
            mode="inline" 
            items={items} 
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, boxShadow: currentTheme === 'dark' ? '0 1px 4px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,21,41,.08)', zIndex: 1 }}>
           <div className="px-4">
             <span className="text-lg font-bold" style={{ color: currentTheme === 'dark' ? '#fff' : '#1890ff' }}>MG 编程管理系统</span>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 8 }}>
             <Space align="center" size="small">
               <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
               <div className={currentTheme === 'dark' ? 'text-white' : ''}>
                 <div style={{ fontSize: 14 }}>{currentUser?.name || '未登录'}</div>
                 {currentRole && (
                   <Tag color="purple" style={{ marginTop: 2 }}>
                     {currentRole.name}
                   </Tag>
                 )}
               </div>
             </Space>
             <Select
               size="small"
               value={currentUser?.id}
               style={{ width: 160 }}
               onChange={(value) => {
                 setCurrentAdminUserId(value);
                 setUsers(getAdminUsers());
               }}
               options={users.map(u => ({
                 label: `${u.name} (${u.username})`,
                 value: u.id,
               }))}
             />
           </div>
        </Header>
        <Content style={{ margin: '0 16px', overflow: 'hidden' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {canAccess ? (
              <Outlet />
            ) : (
              <Result
                status="403"
                title="没有权限"
                subTitle="当前用户无权访问该页面，请联系管理员或切换角色。"
                extra={
                  <Button type="primary" onClick={() => navigate(defaultEntry)}>
                    返回可访问页面
                  </Button>
                }
              />
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          MG编程 ©{new Date().getFullYear()} 由 MG 制作
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
