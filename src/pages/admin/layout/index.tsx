import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, theme } from 'antd';
import { 
  DesktopOutlined, 
  PieChartOutlined, 
  FileOutlined, 
  TeamOutlined, 
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BankOutlined,
  BookOutlined,
  ReadOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

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
}

const menuConfig: MenuConfigItem[] = [
  { key: '/front/admin', label: '控制台', icon: <PieChartOutlined />, path: '/front/admin' },
  { key: '/front/admin/company', label: '面试公司管理', icon: <BankOutlined />, path: '/front/admin/company' },
  { key: '/front/admin/question', label: '题库管理', icon: <BookOutlined />, path: '/front/admin/question' },
  { key: '/front/admin/article', label: '文章管理', icon: <ReadOutlined />, path: '/front/admin/article' },
  { key: '/front/admin/user', label: '用户管理', icon: <UserOutlined />, path: '/front/admin/user' },
  { key: '/front/home', label: '返回前台', icon: <HomeOutlined />, path: '/front/home' },
];

function generateMenuItems(items: MenuConfigItem[]): MenuItem[] {
  return items.map(item => {
    if (item.children) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: generateMenuItems(item.children),
      } as MenuItem;
    }
    return {
      key: item.key,
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
  const navigate = useNavigate();
  const location = useLocation();

  const items = generateMenuItems(menuConfig);
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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ height: 32, margin: 16, background: '#e6f7ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1890ff', fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap' }}>
           {collapsed ? 'MG' : 'MG 后台管理'}
        </div>
        <Menu 
            theme="light" 
            defaultSelectedKeys={[location.pathname]} 
            selectedKeys={[location.pathname]}
            mode="inline" 
            items={items} 
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, boxShadow: '0 1px 4px rgba(0,21,41,.08)', zIndex: 1 }}>
           <div className="px-4">
             {/* Header Content Left */}
             <span className="text-lg font-bold" style={{ color: '#1890ff' }}>MG 编程管理系统</span>
           </div>
           <div>
             <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
             <span className="ml-2">管理员</span>
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
            <Outlet />
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
