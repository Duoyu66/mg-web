import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { CompanyService } from '@/pages/front-end/company/service';
import { Company, CompanyStatus } from '@/pages/front-end/company/types';
import dayjs from 'dayjs';

const { Option } = Select;

const AdminCompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await CompanyService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAdd = () => {
    setEditingCompany(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Company) => {
    setEditingCompany(record);
    form.setFieldsValue({
        ...record,
        tags: record.tags ? record.tags.join(',') : ''
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
      try {
          await CompanyService.deleteCompany(id);
          message.success('删除成功');
          fetchCompanies();
      } catch (error) {
          message.error('删除失败');
      }
  };

  const handleSubmit = async (values: any) => {
    try {
        const companyData = {
            ...values,
            tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
        };

        if (editingCompany) {
            await CompanyService.updateCompany(editingCompany.id, companyData);
            message.success('更新成功');
        } else {
            await CompanyService.addCompany({
                ...companyData,
                status: CompanyStatus.ToApply
            });
            message.success('添加成功');
        }
        setIsModalVisible(false);
        fetchCompanies();
    } catch (error) {
        message.error('操作失败');
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string, record: Company) => (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#f0f0f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {logo ? <img src={logo} alt={record.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : record.name.charAt(0)}
          </div>
      )
    },
    {
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
          let color = 'default';
          if (status === 'Offer') color = 'green';
          if (status === '已拒绝/挂') color = 'red';
          if (status.includes('面')) color = 'blue';
          return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '记录数',
      dataIndex: 'recordCount',
      key: 'recordCount',
      render: (count: number) => count || 0
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Company) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
             <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input 
            prefix={<SearchOutlined />} 
            placeholder="搜索公司..." 
            style={{ width: 200 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加公司</Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredCompanies} 
        rowKey="id" 
        loading={loading}
      />

      <Modal
        title={editingCompany ? "编辑公司" : "添加公司"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="公司名称" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="website" label="官网">
                <Input />
            </Form.Item>
            <Form.Item name="location" label="地点">
                <Input />
            </Form.Item>
            <Form.Item name="salaryRange" label="薪资范围">
                <Input />
            </Form.Item>
            <Form.Item name="tags" label="标签 (逗号分隔)">
                <Input />
            </Form.Item>
            {editingCompany && (
                <Form.Item name="status" label="状态">
                    <Select>
                        {Object.values(CompanyStatus).map(s => (
                            <Option key={s} value={s}>{s}</Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCompanyList;
