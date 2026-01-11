import React, { useEffect, useState } from 'react';
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
import { CompanyService } from './service';
import { Company, CompanyStatus } from './types';
import dayjs from 'dayjs';

const { Meta } = Card;
const { Option } = Select;

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await CompanyService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      message.error('获取公司列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter Logic
  const filteredCompanies = companies.filter((company) => {
    const matchName = company.name.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchName && matchStatus;
  });

  // Stats Logic
  const stats = {
    total: companies.length,
    offer: companies.filter(c => c.status === CompanyStatus.Offer).length,
    interviewing: companies.filter(c => [CompanyStatus.Interview1, CompanyStatus.Interview2, CompanyStatus.Interview3].includes(c.status)).length,
    rejected: companies.filter(c => c.status === CompanyStatus.Rejected).length,
  };

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
      fetchCompanies();
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
            <Statistic title="总投递公司" value={stats.total} prefix={<GlobalOutlined />} />
          </Card>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="面试中" value={stats.interviewing} styles={{ content: { color: '#faad14' } }} />
          </Card>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="已拿Offer" value={stats.offer} styles={{ content: { color: '#3f8600' } }} />
          </Card>
          <Card variant="borderless" className="shadow-sm">
            <Statistic title="已结束/挂" value={stats.rejected} styles={{ content: { color: '#cf1322' } }} />
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
        <Spin spinning={loading}>
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCompanies.map(company => (
                <Card
                  key={company.id}
                  hoverable
                  className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl rounded-xl overflow-hidden group"
                  bodyStyle={{ padding: '12px' }}
                  actions={[
                    <div key="view" className="text-gray-400 text-[10px] flex justify-center items-center gap-1">
                      <EyeOutlined /> {company.viewCount}
                    </div>,
                    <div key="records" className="text-gray-400 text-[10px] flex justify-center items-center gap-1">
                      <FileTextOutlined /> {company.recordCount || 0}
                    </div>,
                    <div key="date" className="text-gray-400 text-[10px] flex justify-center items-center gap-1">
                      <ClockCircleOutlined /> {dayjs(company.lastUpdated).format('MM-DD')}
                    </div>
                  ]}
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
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-gray-400 text-[10px] hover:text-primary-500 hover:underline transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      官网直达
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center min-h-[20px]">
                    {company.tags?.slice(0, 2).map((tag, idx) => (
                      <Tag key={idx} variant="borderless" className="text-[10px] px-1 py-0 bg-gray-50 dark:bg-gray-700 mr-0 scale-90">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Empty description="暂无相关公司" className="py-20" />
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
