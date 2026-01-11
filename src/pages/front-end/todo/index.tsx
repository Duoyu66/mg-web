import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Avatar, 
  Progress, 
  Dropdown, 
  MenuProps, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  message, 
  Tooltip 
} from 'antd';
import { 
  PlusOutlined, 
  MoreOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  ArrowRightOutlined,
  ArrowLeftOutlined,
  FlagOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Meta } = Card;
const { Option } = Select;

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'high' | 'medium' | 'low';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee?: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: '设计新版首页 UI',
    description: '参考 Modern Dashboard 设计风格，包含深色模式支持。',
    status: 'todo',
    priority: 'high',
    dueDate: dayjs().add(2, 'day').toISOString(),
    assignee: 'Alice'
  },
  {
    id: '2',
    title: '修复登录页 Bug',
    description: '移动端布局错乱问题修复。',
    status: 'in_progress',
    priority: 'medium',
    dueDate: dayjs().add(1, 'day').toISOString(),
    assignee: 'Bob'
  },
  {
    id: '3',
    title: '完成 API 文档',
    description: '更新 Swagger 文档，补充错误码说明。',
    status: 'done',
    priority: 'low',
    dueDate: dayjs().subtract(1, 'day').toISOString(),
    assignee: 'Charlie'
  }
];

const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'blue'
};

const statusMap = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成'
};

const TodoPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  const handleCreate = (values: any) => {
    const newTask: Task = {
      id: editingTask ? editingTask.id : dayjs().valueOf().toString(),
      title: values.title,
      description: values.description,
      status: values.status || 'todo',
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate.toISOString() : dayjs().toISOString(),
      assignee: values.assignee
    };

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? newTask : t));
      message.success('任务已更新');
    } else {
      setTasks([...tasks, newTask]);
      message.success('任务已创建');
    }
    setIsModalVisible(false);
    setEditingTask(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '删除任务',
      content: '确定要删除这个任务吗？',
      okType: 'danger',
      onOk: () => {
        setTasks(tasks.filter(t => t.id !== id));
        message.success('任务已删除');
      }
    });
  };

  const moveTask = (task: Task, direction: 'forward' | 'backward') => {
    let newStatus: TaskStatus = task.status;
    if (direction === 'forward') {
      if (task.status === 'todo') newStatus = 'in_progress';
      else if (task.status === 'in_progress') newStatus = 'done';
    } else {
      if (task.status === 'done') newStatus = 'in_progress';
      else if (task.status === 'in_progress') newStatus = 'todo';
    }
    
    if (newStatus !== task.status) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: dayjs(task.dueDate)
    });
    setIsModalVisible(true);
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card 
      className="mb-4 shadow-sm hover:shadow-md transition-all duration-300 border-t-4"
      style={{ borderTopColor: priorityColors[task.priority] }}
      size="small"
      actions={[
        task.status !== 'todo' && (
          <Tooltip title="后退">
            <ArrowLeftOutlined key="back" onClick={() => moveTask(task, 'backward')} />
          </Tooltip>
        ),
        <Tooltip title="编辑">
          <EditOutlined key="edit" onClick={() => openEditModal(task)} />
        </Tooltip>,
        <Tooltip title="删除">
          <DeleteOutlined key="delete" className="text-red-500" onClick={() => handleDelete(task.id)} />
        </Tooltip>,
        task.status !== 'done' && (
          <Tooltip title="前进">
            <ArrowRightOutlined key="forward" onClick={() => moveTask(task, 'forward')} />
          </Tooltip>
        ),
      ].filter(Boolean)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-800 m-0 truncate flex-1" title={task.title}>{task.title}</h4>
        <Tag color={priorityColors[task.priority]} className="mr-0 ml-2 text-xs">
          {task.priority.toUpperCase()}
        </Tag>
      </div>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2 min-h-[40px]">{task.description}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <ClockCircleOutlined />
          <span>{dayjs(task.dueDate).format('MM-DD')}</span>
        </div>
        {task.assignee && (
           <Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="small">
             {task.assignee[0]}
           </Avatar>
        )}
      </div>
    </Card>
  );

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-hidden bg-gray-50 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold m-0 flex items-center gap-2">
            <CheckCircleOutlined className="text-primary-500" />
            任务看板
          </h2>
          <p className="text-gray-500 mt-1">管理您的日常待办事项</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingTask(null);
          form.resetFields();
          setIsModalVisible(true);
        }}>
          新建任务
        </Button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {/* Todo Column */}
        <div className="flex-1 min-w-[300px] bg-gray-100/50 rounded-xl p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-gray-700 m-0">待办 (Todo)</h3>
            <Tag color="default">{tasks.filter(t => t.status === 'todo').length}</Tag>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.filter(t => t.status === 'todo').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="flex-1 min-w-[300px] bg-blue-50/50 rounded-xl p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-blue-700 m-0">进行中 (In Progress)</h3>
            <Tag color="blue">{tasks.filter(t => t.status === 'in_progress').length}</Tag>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.filter(t => t.status === 'in_progress').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="flex-1 min-w-[300px] bg-green-50/50 rounded-xl p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-green-700 m-0">已完成 (Done)</h3>
            <Tag color="green">{tasks.filter(t => t.status === 'done').length}</Tag>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {tasks.filter(t => t.status === 'done').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      <Modal
        title={editingTask ? "编辑任务" : "新建任务"}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical" initialValues={{ priority: 'medium', status: 'todo' }}>
          <Form.Item name="title" label="任务标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="输入任务标题" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="任务详情..." />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="priority" label="优先级">
              <Select>
                <Option value="high"><Tag color="red">High</Tag></Option>
                <Option value="medium"><Tag color="orange">Medium</Tag></Option>
                <Option value="low"><Tag color="blue">Low</Tag></Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Select>
                <Option value="todo">待办</Option>
                <Option value="in_progress">进行中</Option>
                <Option value="done">已完成</Option>
              </Select>
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <Form.Item name="dueDate" label="截止日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="assignee" label="负责人">
              <Input placeholder="负责人姓名" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoPage;
