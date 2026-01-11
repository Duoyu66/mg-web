import React, { useState } from 'react';
import { 
  Layout, 
  Card, 
  Input, 
  Button, 
  Typography, 
  Tag, 
  Space, 
  Divider, 
  Empty, 
  Tooltip,
  Modal,
  Form,
  Select,
  message
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  SaveOutlined, 
  BookOutlined,
  TagOutlined,
  MoreOutlined,
  FileMarkdownOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Editor from '@monaco-editor/react';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  language: string;
}

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'React Hooks 学习笔记',
    content: '# React Hooks\n\n- useState\n- useEffect\n- useContext\n\n```javascript\nconst [count, setCount] = useState(0);\n```',
    tags: ['React', 'Frontend'],
    updatedAt: dayjs().subtract(1, 'day').toISOString(),
    language: 'markdown'
  },
  {
    id: '2',
    title: '算法刷题计划',
    content: '## 每日一题\n\n1. 两数之和\n2. 链表反转\n3. 二叉树遍历',
    tags: ['Algorithm', 'Plan'],
    updatedAt: dayjs().subtract(2, 'day').toISOString(),
    language: 'markdown'
  }
];

const NotePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initialNotes[0].id);
  const [searchText, setSearchText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  
  // Create Modal State
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  const activeNote = notes.find(n => n.id === selectedNoteId);

  const handleNoteSelect = (id: string) => {
    if (editing && activeNote?.id !== id) {
      Modal.confirm({
        title: '未保存的更改',
        content: '您有未保存的更改，确定要切换笔记吗？',
        onOk: () => {
          setEditing(false);
          setSelectedNoteId(id);
        }
      });
    } else {
      setSelectedNoteId(id);
      setEditing(false);
    }
  };

  const handleEdit = () => {
    if (activeNote) {
      setEditContent(activeNote.content);
      setEditTitle(activeNote.title);
      setEditing(true);
    }
  };

  const handleSave = () => {
    if (activeNote) {
      const updatedNotes = notes.map(n => 
        n.id === activeNote.id 
          ? { ...n, content: editContent, title: editTitle, updatedAt: dayjs().toISOString() } 
          : n
      );
      setNotes(updatedNotes);
      setEditing(false);
      message.success('保存成功');
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条笔记吗？此操作不可恢复。',
      okType: 'danger',
      onOk: () => {
        const newNotes = notes.filter(n => n.id !== id);
        setNotes(newNotes);
        if (selectedNoteId === id) {
          setSelectedNoteId(newNotes.length > 0 ? newNotes[0].id : null);
          setEditing(false);
        }
        message.success('已删除');
      }
    });
  };

  const handleCreate = (values: any) => {
    const newNote: Note = {
      id: dayjs().valueOf().toString(),
      title: values.title,
      content: '# New Note\nStart writing...',
      tags: values.tags || [],
      updatedAt: dayjs().toISOString(),
      language: 'markdown'
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    message.success('创建成功');
    
    // Auto switch to edit mode
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditing(true);
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchText.toLowerCase()) || 
    note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} style={{ margin: 0 }} className="flex items-center gap-2">
              <BookOutlined className="text-primary-500" />
              我的笔记
            </Title>
            <Button 
              type="primary" 
              shape="circle" 
              icon={<PlusOutlined />} 
              onClick={() => setIsCreateModalVisible(true)}
            />
          </div>
          <Input 
            prefix={<SearchOutlined className="text-gray-400" />} 
            placeholder="搜索笔记..." 
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="rounded-full bg-gray-50 border-gray-200"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(item => (
              <div 
                key={item.id}
                onClick={() => handleNoteSelect(item.id)}
                className={`cursor-pointer p-4 border-b border-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedNoteId === item.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-primary-500' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <Text strong className="truncate flex-1 text-gray-800 dark:text-gray-200">{item.title}</Text>
                  <Text type="secondary" className="text-xs ml-2 whitespace-nowrap">
                    {dayjs(item.updatedAt).format('MM-DD')}
                  </Text>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <Tag key={tag} className="mr-0 text-[10px] px-1 bg-white border-gray-200 text-gray-500">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Empty description="暂无笔记" className="mt-10" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">
        {activeNote ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center px-6 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4 flex-1">
                {editing ? (
                  <Input 
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="text-lg font-bold border-none shadow-none p-0 focus:shadow-none bg-transparent"
                    placeholder="笔记标题"
                  />
                ) : (
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 m-0 truncate">
                    {activeNote.title}
                  </h1>
                )}
              </div>
              <Space>
                {editing ? (
                  <>
                    <Button onClick={() => setEditing(false)}>取消</Button>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
                  </>
                ) : (
                  <>
                    <Button icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(activeNote.id)} />
                  </>
                )}
              </Space>
            </div>

            {/* Editor/Preview Area */}
            <div className="flex-1 overflow-hidden relative">
              {editing ? (
                <Editor
                  height="100%"
                  defaultLanguage="markdown"
                  value={editContent}
                  onChange={(value) => setEditContent(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'off',
                    wordWrap: 'on',
                    padding: { top: 20, bottom: 20 }
                  }}
                />
              ) : (
                <div className="h-full overflow-y-auto p-8 prose prose-blue max-w-none dark:prose-invert">
                  <div className="mb-4 flex gap-2">
                    {activeNote.tags.map(tag => (
                      <Tag key={tag} color="blue">{tag}</Tag>
                    ))}
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                       最后更新: {dayjs(activeNote.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                  </div>
                  <Divider className="my-4" />
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeNote.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <FileMarkdownOutlined style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }} />
            <p>选择或创建一个笔记开始写作</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        title="新建笔记"
        open={isCreateModalVisible}
        onOk={() => createForm.submit()}
        onCancel={() => setIsCreateModalVisible(false)}
      >
        <Form form={createForm} onFinish={handleCreate} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="笔记标题" />
          </Form.Item>
          <Form.Item name="tags" label="标签">
            <Select mode="tags" placeholder="输入标签" style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotePage;
