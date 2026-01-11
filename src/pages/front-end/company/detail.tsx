import React, { useEffect, useState } from 'react';
import { 
  useParams, 
  useNavigate 
} from 'react-router-dom';
import { 
  Button, 
  Card, 
  Tag, 
  Timeline, 
  Spin, 
  message, 
  Empty, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Descriptions,
  Popconfirm,
  Space
} from 'antd';
import { 
  ArrowLeftOutlined, 
  PlusOutlined, 
  ClockCircleOutlined, 
  EyeOutlined,
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  SyncOutlined,
  DeleteOutlined,
  LinkOutlined,
  EditOutlined
} from '@ant-design/icons';
import { CompanyService } from './service';
import { Company, CompanyStatus, InterviewRecord } from './types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [records, setRecords] = useState<InterviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InterviewRecord | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [companyData, recordsData] = await Promise.all([
        CompanyService.getCompanyById(id),
        CompanyService.getRecordsByCompanyId(id)
      ]);
      
      if (companyData) {
        setCompany(companyData);
        setRecords(recordsData);
        // Increment view count
        CompanyService.incrementViewCount(id);
      } else {
        message.error('未找到该公司');
        navigate('/front/company');
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: InterviewRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (!company) return;
    try {
      const recordData = {
        companyId: company.id,
        round: values.round,
        date: values.date.format('YYYY-MM-DD'),
        format: values.format,
        interviewer: values.interviewer,
        questions: values.questions,
        answers: values.answers,
        result: values.result,
        feedback: values.feedback,
      };

      if (editingRecord) {
        await CompanyService.updateRecord(editingRecord.id, recordData);
        message.success('记录更新成功');
      } else {
        await CompanyService.addRecord(recordData);
        message.success('记录添加成功');
      }
      
      // Update company status based on the latest record result
      // Logic: If updating, we should probably re-evaluate status based on the *latest* record by date
      // But for simplicity, we'll keep the existing logic that assumes the user is editing/adding relevant info
      
      let newStatus = company.status;
      if (values.result === '通过') {
        if (values.round.includes('一')) newStatus = CompanyStatus.Interview2;
        if (values.round.includes('二')) newStatus = CompanyStatus.Interview3;
        if (values.round.includes('三')) newStatus = CompanyStatus.Offer; 
        if (values.round === 'HR面') newStatus = CompanyStatus.Offer;
      } else if (values.result === '未通过') {
        newStatus = CompanyStatus.Rejected;
      } else {
        // Pending
        if (values.round.includes('一')) newStatus = CompanyStatus.Interview1;
        else if (values.round.includes('二')) newStatus = CompanyStatus.Interview2;
      }
      
      if (newStatus !== company.status) {
          await CompanyService.updateCompany(company.id, { status: newStatus });
      }

      if (saveAndAddMode) {
          form.resetFields();
          setEditingRecord(null);
          message.success('已保存，请继续添加');
      } else {
          setIsModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
      }
      
      fetchData(); // Refresh data
    } catch (error) {
      message.error(editingRecord ? '更新失败' : '添加失败');
    }
  };
  
  const handleDeleteRecord = async (recordId: string) => {
      try {
          await CompanyService.deleteRecord(recordId);
          message.success('删除成功');
          fetchData();
      } catch (error) {
          message.error('删除失败');
      }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case '通过': return <CheckCircleOutlined className="text-green-500" />;
      case '未通过': return <CloseCircleOutlined className="text-red-500" />;
      default: return <SyncOutlined spin className="text-blue-500" />;
    }
  };

  const getResultColor = (result: string) => {
      switch (result) {
          case '通过': return 'green';
          case '未通过': return 'red';
          default: return 'blue';
      }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
  if (!company) return null;

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/front/company')}>返回列表</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            添加面试记录
          </Button>
        </div>

        {/* Company Header Card */}
        <Card className="shadow-md rounded-xl border-t-4 border-t-primary-500">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
               {company.logo ? (
                 <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
               ) : (
                 <span className="text-3xl font-bold text-gray-400">{company.name.charAt(0)}</span>
               )}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    {company.name}
                    <Tag color="blue" className="text-sm font-normal">{company.status}</Tag>
                  </h1>
                  <div className="flex gap-4 mt-2 text-gray-500 text-sm">
                    {company.website && (
                        <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary-500">
                            <LinkOutlined /> 官网
                        </a>
                    )}
                    <span className="flex items-center gap-1"><ClockCircleOutlined /> 更新于 {dayjs(company.lastUpdated).format('YYYY-MM-DD HH:mm')}</span>
                    <span className="flex items-center gap-1"><EyeOutlined /> {company.viewCount} 次浏览</span>
                  </div>
                </div>
              </div>
              
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} size="small" bordered>
                <Descriptions.Item label="工作地点">{company.location || '-'}</Descriptions.Item>
                <Descriptions.Item label="薪资范围">{company.salaryRange || '-'}</Descriptions.Item>
                <Descriptions.Item label="标签">
                  {company.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>

        {/* Timeline Section */}
        <Card title="面试时间轴" className="shadow-md rounded-xl">
          {records.length > 0 ? (
            <Timeline 
              mode="alternate" 
              className="mt-4"
              items={records.map(record => ({
                key: record.id,
                label: record.date,
                dot: getResultIcon(record.result),
                color: getResultColor(record.result),
                children: (
                  <Card 
                    size="small" 
                    className="mb-4 hover:shadow-sm border-l-4" 
                    style={{ borderLeftColor: getResultColor(record.result) === 'green' ? '#52c41a' : getResultColor(record.result) === 'red' ? '#ff4d4f' : '#1890ff' }}
                    title={
                        <div className="flex justify-between items-center">
                            <span>{record.round} - {record.format}</span>
                            <Space>
                                <Button 
                                  type="text" 
                                  icon={<EditOutlined />} 
                                  size="small" 
                                  onClick={() => showEditModal(record)}
                                />
                                <Popconfirm title="确定删除这条记录吗？" onConfirm={() => handleDeleteRecord(record.id)}>
                                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                                </Popconfirm>
                            </Space>
                        </div>
                    }
                  >
                    {record.interviewer && <p className="text-gray-500 mb-2">面试官: {record.interviewer}</p>}
                    
                    {record.questions && (
                      <div className="mb-3">
                        <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">面试问题:</div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm whitespace-pre-wrap">
                          {record.questions}
                        </div>
                      </div>
                    )}
                    
                    {record.answers && (
                      <div className="mb-3">
                        <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">我的回答/复盘:</div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                          {record.answers}
                        </div>
                      </div>
                    )}
                    
                    {record.feedback && (
                       <div className="mt-2 text-sm text-gray-500">
                           <span className="font-bold">反馈/备注:</span> {record.feedback}
                       </div>
                    )}
                  </Card>
                )
              }))}
            />
          ) : (
            <Empty description="暂无面试记录，快去添加一条吧！" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>

        {/* Add/Edit Record Modal */}
        <Modal
          title={editingRecord ? "编辑面试记录" : "添加面试记录"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setEditingRecord(null);
            form.resetFields();
          }}
          width={700}
          footer={[
            <Button key="cancel" onClick={() => {
                setIsModalVisible(false);
                setEditingRecord(null);
                form.resetFields();
            }}>
                取消
            </Button>,
            !editingRecord && (
                <Button 
                    key="saveAndAdd" 
                    onClick={() => {
                        setSaveAndAddMode(true);
                        form.submit();
                    }}
                >
                    保存并添加下一条
                </Button>
            ),
            <Button 
                key="submit" 
                type="primary" 
                onClick={() => {
                    setSaveAndAddMode(false);
                    form.submit();
                }}
            >
                确定
            </Button>
          ]}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
                <Form.Item name="round" label="面试轮次" rules={[{ required: true }]}>
                  <Select placeholder="选择轮次">
                    <Option value="一面">一面</Option>
                    <Option value="二面">二面</Option>
                    <Option value="三面">三面</Option>
                    <Option value="HR面">HR面</Option>
                    <Option value="笔试">笔试</Option>
                    <Option value="加面">加面</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="date" label="面试日期" rules={[{ required: true }]}>
                  <DatePicker className="w-full" />
                </Form.Item>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Form.Item name="format" label="面试形式" initialValue="视频">
                  <Select>
                    <Option value="视频">视频</Option>
                    <Option value="电话">电话</Option>
                    <Option value="现场">现场</Option>
                    <Option value="笔试">笔试</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="result" label="面试结果" initialValue="等待中">
                  <Select>
                    <Option value="等待中">等待中</Option>
                    <Option value="通过">通过</Option>
                    <Option value="未通过">未通过</Option>
                  </Select>
                </Form.Item>
            </div>

            <Form.Item name="interviewer" label="面试官信息">
              <Input placeholder="例如：技术总监" />
            </Form.Item>

            <Form.Item name="questions" label="面试问题记录">
              <TextArea rows={4} placeholder="记录被问到的问题..." />
            </Form.Item>

            <Form.Item name="answers" label="回答/复盘">
              <TextArea rows={4} placeholder="记录你的回答或事后复盘..." />
            </Form.Item>
            
            <Form.Item name="feedback" label="备注/反馈">
              <Input placeholder="面试官的反馈或其他备注" />
            </Form.Item>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default CompanyDetail;
