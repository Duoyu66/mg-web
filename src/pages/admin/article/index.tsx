import React, { useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';

interface Article {
  id: string;
  title: string;
  author: string;
  views: number;
  status: 'published' | 'draft';
  createTime: string;
}

const mockArticles: Article[] = [
  { id: '1', title: 'React 18 新特性解析', author: '张三', views: 1200, status: 'published', createTime: '2023-10-15' },
  { id: '2', title: 'TypeScript 高级用法', author: '李四', views: 850, status: 'published', createTime: '2023-10-20' },
  { id: '3', title: '前端性能优化指南', author: '王五', views: 0, status: 'draft', createTime: '2023-10-25' },
];

const AdminArticle: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Space><FileTextOutlined />{text}</Space>,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'success' : 'default'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Input placeholder="搜索文章标题" prefix={<SearchOutlined />} style={{ width: 200 }} />
            <Button type="primary">搜索</Button>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            发布文章
          </Button>
        </div>
      </Card>

      <Card>
        <Table columns={columns} dataSource={articles} rowKey="id" />
      </Card>
    </div>
  );
};

export default AdminArticle;
