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

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  path?: string,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    path,
  } as MenuItem;
}

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuItem[] = [
    getItem('控制台', '/front/admin', <PieChartOutlined />, '/front/admin'),
    getItem('面试公司管理', '/front/admin/company', <BankOutlined />, '/front/admin/company'),
    getItem('题库管理', '/front/admin/question', <BookOutlined />, '/front/admin/question'),
    getItem('文章管理', '/front/admin/article', <ReadOutlined />, '/front/admin/article'),
    getItem('用户管理', '/front/admin/user', <UserOutlined />, '/front/admin/user'),
    getItem('返回前台', '/front/home', <HomeOutlined />, '/front/home'),
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const selectedKey = items.find(item => location.pathname.startsWith(item.path || ''))?.key || location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
           {collapsed ? 'MG' : 'MG Admin'}
        </div>
        <Menu 
            theme="dark" 
            defaultSelectedKeys={[location.pathname]} 
            selectedKeys={[location.pathname]}
            mode="inline" 
            items={items} 
            onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
           <div className="px-4">
             {/* Header Content Left */}
             <span className="text-lg font-bold">后台管理系统</span>
           </div>
           <div>
             <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
             <span className="ml-2">Admin</span>
           </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Admin' }, { title: 'Current Page' }]} />
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
          MG Code ©{new Date().getFullYear()} Created by MG
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
