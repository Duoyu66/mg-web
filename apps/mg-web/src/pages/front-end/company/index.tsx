import React, { useEffect, useState, useRef } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Row, 
  Col, 
  Statistic, 
  Modal, 
  Form, 
  DatePicker, 
  message, 
  Empty,
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  GlobalOutlined, 
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { CompanyService } from './service';
import { Company, CompanyStatus } from './types';
import { useGetCompanyList } from './hooks/useGetCompanyList';
import dayjs from 'dayjs';

const { Meta } = Card;
const { Option } = Select;

const CompanyList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Use the hook
  const {
    data,
    isLoading,
    refetch
  } = useGetCompanyList({
    name: searchText,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  // Stats Logic - Simplified since we only have partial data
  const totalCompanies = data?.list?.reduce((acc, group) => acc + (group.companies?.length || 0), 0) || 0;

  const handleAddCompany = async (values: any) => {
    try {
      await CompanyService.addCompany({
        name: values.name,
        website: values.website,
        status: CompanyStatus.ToApply, // Default status
        location: values.location,
        salaryRange: values.salaryRange,
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      });
      message.success('添加成功');
      setIsModalVisible(false);
      form.resetFields();
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['/company/list'] });
    } catch (error) {
      message.error('添加失败');
    }
  };

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.Offer: return 'success';
      case CompanyStatus.Rejected: return 'error';
      case CompanyStatus.ToApply: return 'default';
      case CompanyStatus.Applied: return 'processing';
      default: return 'warning'; // Interviewing
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="总投递公司" value={totalCompanies} prefix={<GlobalOutlined />} />
          </Card>
          {/* Placeholder stats as we don't have full data */}
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="面试中" value={'-'} styles={{ content: { color: '#faad14' } }} />
          </Card>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="已拿Offer" value={'-'} styles={{ content: { color: '#3f8600' } }} />
          </Card>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="已结束/挂" value={'-'} styles={{ content: { color: '#cf1322' } }} />
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex gap-4 flex-1 w-full sm:w-auto">
            <Input 
              placeholder="搜索公司名称..." 
              prefix={<SearchOutlined className="text-gray-400" />} 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="max-w-xs"
            />
            <Select 
              defaultValue="all" 
              style={{ width: 150 }} 
              onChange={setStatusFilter}
            >
              <Option value="all">所有状态</Option>
              {Object.values(CompanyStatus).map(status => (
                <Option key={status} value={status}>{status}</Option>
              ))}
            </Select>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsModalVisible(true)}
            size="large"
          >
            添加公司
          </Button>
        </div>

        {/* Company Grid */}
        <Spin spinning={isLoading}>
          {data?.list?.length ? (
            <div className="space-y-8">
              {data.list.map((group) => (
                <div key={group.level}>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 px-3 py-1 rounded-lg mr-2">
                      P{group.level}
                    </span>
                    <span className="text-sm font-normal text-gray-500">级别</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {group.companies.map((item) => {
                      const company: Company = {
                        id: item.id,
                        name: item.title,
                        logo: item.logo || undefined,
                        website: item.recruitmentUrl,
                        status: CompanyStatus.ToApply,
                        viewCount: 0,
                        recordCount: 0,
                        lastUpdated: item.updateTime || item.createTime,
                        location: '未知',
                        salaryRange: '面议',
                        tags: [item.scale].filter(Boolean),
                      };

                      return (
                        <Card
                          key={company.id}
                          hoverable
                          className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl rounded-xl overflow-hidden group"
                          bodyStyle={{ padding: '12px' }}
                          onClick={() => navigate(`/front/company/${company.id}`)}
                        >
                          <div className="absolute top-0 right-0 p-0">
                            <Tag color={getStatusColor(company.status)} className="m-1 mr-2 scale-75 origin-top-right rounded-md">
                              {company.status}
                            </Tag>
                          </div>
                          
                          <div className="flex flex-col items-center mb-2 mt-1">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-2 border border-gray-100 group-hover:border-primary-200 transition-colors">
                              {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-lg font-bold text-gray-300">{company.name.charAt(0)}</span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-0.5 truncate w-full text-center px-1">{company.name}</h3>
                          </div>

                          <div className="flex flex-wrap gap-1 justify-center min-h-[20px]">
                            {company.tags?.slice(0, 2).map((tag, idx) => (
                              <Tag key={idx} className="text-[10px] px-1 py-0 bg-gray-50 dark:bg-gray-700 mr-0 scale-90">
                                {tag}
                              </Tag>
                            ))}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && <Empty description="暂无相关公司" className="py-20" />
          )}
        </Spin>

        {/* Add Company Modal */}
        <Modal
          title="添加新面试公司"
          open={isModalVisible}
          onOk={() => form.submit()}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical" onFinish={handleAddCompany}>
            <Form.Item name="name" label="公司名称" rules={[{ required: true, message: '请输入公司名称' }]}>
              <Input placeholder="例如：字节跳动" />
            </Form.Item>
            <Form.Item name="website" label="官网链接">
              <Input placeholder="https://..." />
            </Form.Item>
            <Form.Item name="location" label="工作地点">
              <Input placeholder="例如：北京" />
            </Form.Item>
            <Form.Item name="salaryRange" label="薪资范围">
              <Input placeholder="例如：25k-40k" />
            </Form.Item>
            <Form.Item name="tags" label="标签">
              <Input placeholder="使用逗号分隔，例如：大厂,双休" />
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default CompanyList;
