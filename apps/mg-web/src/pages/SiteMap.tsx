import React from 'react';
import { Card, Typography, List, Tag, Space } from 'antd';
import { Link } from 'react-router-dom';
import { 
  HomeOutlined, 
  LoginOutlined, 
  FormOutlined, 
  CodeOutlined, 
  BookOutlined, 
  DashboardOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface RouteItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: RouteItem[];
  isExternal?: boolean; // For demonstration if we had external links
}

const siteRoutes: RouteItem[] = [
  {
    title: '基础页面',
    path: '/',
    children: [
      { title: '官网首页', path: '/', icon: <HomeOutlined /> },
      { title: '登录', path: '/login', icon: <LoginOutlined /> },
      { title: '注册', path: '/register', icon: <FormOutlined /> },
      { title: '发布文章', path: '/publishArticle', icon: <FormOutlined /> },
      { title: '代码编辑器', path: '/codeEdit', icon: <CodeOutlined /> },
    ]
  },
  {
    title: '刷题系统 (/question)',
    path: '/question',
    children: [
      { title: '入口', path: '/question/nav' },
      { title: '主页', path: '/question/questionHome' },
      // ExamPage usually requires state, so linking directly might redirect or show empty
    ]
  },
  {
    title: '前台功能 (/front)',
    path: '/front',
    children: [
      { title: '主页', path: '/front/home', icon: <HomeOutlined /> },
      { title: '学习路线', path: '/front/route', icon: <BookOutlined /> },
      { title: '算法', path: '/front/algorithm' },
      { title: '题库', path: '/front/questionBank' },
      { title: '消息中心', path: '/front/message' },
      { title: '快捷导航', path: '/front/nav' },
      { title: '功能大全', path: '/front/feature', icon: <AppstoreOutlined /> },
      { title: '教程', path: '/front/tutorial' },
      { title: '测试', path: '/front/test' },
      { title: '面试公司', path: '/front/company' },
      { title: '简历制作', path: '/front/resume' },
      { title: '学习排行榜', path: '/front/rank' },
      { title: '文档管理', path: '/front/document' },
      { title: '笔记', path: '/front/note' },
      { title: '代办事项', path: '/front/todo' },
      { title: '留言板', path: '/front/board' },
      { title: '会员积分', path: '/front/member' },
      { title: '会员价格', path: '/front/price' },
      { title: '个人中心', path: '/front/center' },
      { title: '充值中心', path: '/front/recharge' },
      { title: '真实简历列表', path: '/front/realResume' },
      { title: '名企面经', path: '/front/companyInterview' },
    ]
  },
  {
    title: '后台管理 (/front/admin)',
    path: '/front/admin',
    children: [
      { title: '控制台', path: '/front/admin', icon: <DashboardOutlined /> },
      { title: '面试公司管理', path: '/front/admin/company' },
      { title: '题库管理', path: '/front/admin/question' },
      { title: '文章管理', path: '/front/admin/article' },
      { title: '会员管理', path: '/front/admin/member' },
      { title: '创作中心', path: '/front/admin/creator' },
      { title: '收入分析', path: '/front/admin/revenue' },
      { title: '用户管理', path: '/front/admin/user' },
      { title: '角色管理', path: '/front/admin/system/roles' },
      { title: '用户角色分配', path: '/front/admin/system/user-roles' },
    ]
  }
];

const SiteMap = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <Title level={2}>网站地图 / 页面导航</Title>
          <Text type="secondary">包含本系统所有页面的快速跳转入口</Text>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {siteRoutes.map((section, index) => (
            <Card key={index} title={section.title} className="shadow-sm hover:shadow-md transition-shadow">
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6 }}
                dataSource={section.children}
                renderItem={item => (
                  <List.Item>
                    <Link to={item.path}>
                      <Card 
                        hoverable 
                        size="small"
                        className="text-center h-full flex flex-col justify-center items-center border-gray-200"
                        bodyStyle={{ padding: '12px' }}
                      >
                        <Space direction="vertical" size="small">
                          {item.icon && <span className="text-xl text-primary-500">{item.icon}</span>}
                          <span className="font-medium text-gray-700">{item.title}</span>
                          <Tag color="blue" className="mr-0 text-xs scale-90">{item.path}</Tag>
                        </Space>
                      </Card>
                    </Link>
                  </List.Item>
                )}
              />
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
};

export default SiteMap;
