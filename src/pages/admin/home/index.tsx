import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, UserOutlined, BankOutlined, FileTextOutlined } from '@ant-design/icons';
import { CompanyService } from '@/pages/front-end/company/service';
import { Company } from '@/pages/front-end/company/types';

const AdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const data = await CompanyService.getAllCompanies();
        setCompanies(data);
    } finally {
        setLoading(false);
    }
  };

  const columns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => <Tag color="blue">{status}</Tag>
    },
    {
        title: '浏览量',
        dataIndex: 'viewCount',
        key: 'viewCount',
    },
    {
        title: '更新时间',
        dataIndex: 'lastUpdated',
        key: 'lastUpdated',
        render: (text: string) => text ? new Date(text).toLocaleDateString() : '-'
    }
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="总公司数"
              value={companies.length}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="面试记录总数"
              value={companies.reduce((acc, curr) => acc + (curr.recordCount || 0), 0)}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="活跃用户"
              value={1}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>最近更新公司</h3>
          <Table 
            dataSource={companies.slice(0, 5)} 
            columns={columns} 
            rowKey="id" 
            pagination={false}
            loading={loading}
          />
      </div>
    </div>
  );
};

export default AdminDashboard;
