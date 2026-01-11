import React, { useState } from 'react';
import { Table, Tag, Space, Button, Card, Input, message, Tabs } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from '@ant-design/icons';

interface Question {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  createTime: string;
}

const mockQuestions: Question[] = [
  { id: '1', title: '两数之和', difficulty: 'easy', category: '数组', createTime: '2023-10-01' },
  { id: '2', title: '全排列', difficulty: 'medium', category: '回溯', createTime: '2023-10-05' },
  { id: '3', title: '接雨水', difficulty: 'hard', category: '动态规划', createTime: '2023-10-10' },
];

const AdminQuestion: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);

  const columns = [
    {
      title: '题目名称',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Space><BookOutlined />{text}</Space>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff: string) => {
        const color = diff === 'easy' ? 'green' : diff === 'medium' ? 'orange' : 'red';
        const text = diff === 'easy' ? '简单' : diff === 'medium' ? '中等' : '困难';
        return <Tag color={color}>{text}</Tag>;
      },
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
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Input placeholder="搜索题目" prefix={<SearchOutlined />} style={{ width: 200 }} />
            <Button type="primary">搜索</Button>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            添加题目
          </Button>
        </div>
        
        <Tabs defaultActiveKey="1" items={[
            { key: '1', label: '全部题目', children: <Table columns={columns} dataSource={questions} rowKey="id" /> },
            { key: '2', label: '审核中', children: <div className="p-4 text-center text-gray-500">暂无待审核题目</div> },
            { key: '3', label: '已回收', children: <div className="p-4 text-center text-gray-500">回收站为空</div> },
        ]} />
      </Card>
    </div>
  );
};

export default AdminQuestion;
