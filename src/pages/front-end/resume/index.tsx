import { useState, useRef, useEffect } from 'react';
import { Button, Input, Form, Divider, Space, Card, Tabs, message } from 'antd';
import { 
  Download, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Mail, 
  Phone, 
  Github, 
  Linkedin,
  Palette,
  Printer
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  year: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  techStack: string;
}

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: string[];
}

const initialData: ResumeData = {
  personal: {
    name: "张三",
    title: "高级前端工程师",
    email: "zhangsan@example.com",
    phone: "13800138000",
    github: "github.com/zhangsan",
    linkedin: "linkedin.com/in/zhangsan",
    summary: "拥有5年前端开发经验，擅长React、Vue生态。热衷于新技术探索，具有良好的团队协作能力和问题解决能力。",
  },
  education: [
    {
      id: '1',
      school: "某某大学",
      degree: "计算机科学与技术 本科",
      year: "2015 - 2019",
      description: "主修课程：数据结构、算法分析、计算机网络、操作系统等。在校期间获得多次奖学金。"
    }
  ],
  experience: [
    {
      id: '1',
      company: "某某科技公司",
      role: "前端开发工程师",
      year: "2021 - 至今",
      description: "负责公司核心产品的前端架构设计与开发。优化首屏加载速度，提升用户体验。带领小团队完成多个重要项目交付。"
    },
    {
      id: '2',
      company: "某某初创企业",
      role: "Web开发",
      year: "2019 - 2021",
      description: "独立负责公司官网及后台管理系统的开发。使用Vue.js重构旧系统，提升开发效率30%。"
    }
  ],
  projects: [
    {
      id: '1',
      name: "企业级SaaS管理平台",
      role: "核心开发者",
      description: "基于React + Ant Design开发的大型管理系统，支持多租户、权限管理。",
      techStack: "React, TypeScript, Redux, Ant Design"
    }
  ],
  skills: ["JavaScript/TypeScript", "React", "Vue", "Node.js", "Webpack/Vite", "Git", "Docker"]
};

const ResumeBuilder = () => {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume_data');
    return saved ? JSON.parse(saved) : initialData;
  });
  const [activeTab, setActiveTab] = useState('personal');
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('resume_data', JSON.stringify(data));
  }, [data]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personal.name}的简历`,
    onBeforePrint: async () => {
      message.loading({ content: '正在启动打印程序，请在弹窗中选择"另存为 PDF"...', key: 'print_loading', duration: 0 });
    },
    onAfterPrint: () => {
      message.success({ content: '导出操作已结束', key: 'print_loading', duration: 2 });
    },
    onPrintError: (errorLocation, error) => {
      message.error({ content: '打印启动失败，请重试', key: 'print_loading' });
      console.error('Print failed:', errorLocation, error);
    },
    pageStyle: `
      @page {
        size: auto;
        margin: 0mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const handleDownload = () => {
    const element = componentRef.current;
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${data.personal.name}的简历.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    message.loading({ content: '正在生成 PDF 文件...', key: 'download_pdf', duration: 0 });
    
    html2pdf().set(opt).from(element).save()
      .then(() => {
        message.success({ content: '下载完成', key: 'download_pdf', duration: 2 });
      })
      .catch((err: any) => {
        console.error(err);
        message.error({ content: '下载失败', key: 'download_pdf' });
      });
  };

  const updatePersonal = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), school: '', degree: '', year: '', description: '' }]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), company: '', role: '', year: '', description: '' }]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { id: Date.now().toString(), name: '', role: '', description: '', techStack: '' }]
    }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(item => item.id !== id)
    }));
  };

  const updateSkills = (value: string) => {
    setData(prev => ({
      ...prev,
      skills: value.split(',').map(s => s.trim()) // Simple CSV for now
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20 pb-10 px-4 md:px-8 flex flex-col md:flex-row gap-6">
      {/* Left Panel: Editor */}
      <div className="w-full md:w-1/3 lg:w-[400px] flex-shrink-0 flex flex-col gap-4 h-[calc(100vh-120px)] overflow-hidden">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Palette className="text-primary-500" size={20} />
            简历编辑器
          </h2>
          <div className="flex gap-2">
            <Button icon={<Printer size={16} />} onClick={handlePrint}>
              打印
            </Button>
            <Button type="primary" icon={<Download size={16} />} onClick={handleDownload}>
              下载 PDF
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            className="px-2 pt-2"
            items={[
              { key: 'personal', label: '基本', icon: <User size={14} /> },
              { key: 'experience', label: '经历', icon: <Briefcase size={14} /> },
              { key: 'projects', label: '项目', icon: <Code2 size={14} /> },
              { key: 'education', label: '教育', icon: <GraduationCap size={14} /> },
            ]}
          />
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'personal' && (
              <Form layout="vertical" className="space-y-3">
                <Form.Item label="姓名">
                  <Input value={data.personal.name} onChange={e => updatePersonal('name', e.target.value)} />
                </Form.Item>
                <Form.Item label="职位">
                  <Input value={data.personal.title} onChange={e => updatePersonal('title', e.target.value)} />
                </Form.Item>
                <Form.Item label="邮箱">
                  <Input value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
                </Form.Item>
                <Form.Item label="电话">
                  <Input value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                </Form.Item>
                <Form.Item label="Github">
                  <Input value={data.personal.github} onChange={e => updatePersonal('github', e.target.value)} />
                </Form.Item>
                <Form.Item label="LinkedIn">
                  <Input value={data.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} />
                </Form.Item>
                <Form.Item label="个人简介">
                  <Input.TextArea rows={4} value={data.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
                </Form.Item>
                <Divider>技能 (逗号分隔)</Divider>
                <Form.Item label="技能列表">
                  <Input.TextArea rows={3} value={data.skills.join(', ')} onChange={e => updateSkills(e.target.value)} />
                </Form.Item>
              </Form>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                {data.experience.map(exp => (
                  <Card key={exp.id} size="small" title={exp.company || '新经历'} extra={<Button type="text" danger icon={<Trash2 size={14} />} onClick={() => removeExperience(exp.id)} />}>
                    <Form layout="vertical" className="space-y-2">
                      <Form.Item label="公司">
                        <Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="职位">
                        <Input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="时间">
                        <Input value={exp.year} onChange={e => updateExperience(exp.id, 'year', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="描述">
                        <Input.TextArea rows={3} value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
                      </Form.Item>
                    </Form>
                  </Card>
                ))}
                <Button type="dashed" block icon={<Plus size={16} />} onClick={addExperience}>添加工作经历</Button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {data.projects.map(proj => (
                  <Card key={proj.id} size="small" title={proj.name || '新项目'} extra={<Button type="text" danger icon={<Trash2 size={14} />} onClick={() => removeProject(proj.id)} />}>
                    <Form layout="vertical" className="space-y-2">
                      <Form.Item label="项目名称">
                        <Input value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="担任角色">
                        <Input value={proj.role} onChange={e => updateProject(proj.id, 'role', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="技术栈">
                        <Input value={proj.techStack} onChange={e => updateProject(proj.id, 'techStack', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="描述">
                        <Input.TextArea rows={3} value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} />
                      </Form.Item>
                    </Form>
                  </Card>
                ))}
                <Button type="dashed" block icon={<Plus size={16} />} onClick={addProject}>添加项目经验</Button>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                {data.education.map(edu => (
                  <Card key={edu.id} size="small" title={edu.school || '新教育'} extra={<Button type="text" danger icon={<Trash2 size={14} />} onClick={() => removeEducation(edu.id)} />}>
                    <Form layout="vertical" className="space-y-2">
                      <Form.Item label="学校">
                        <Input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="学位/专业">
                        <Input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="时间">
                        <Input value={edu.year} onChange={e => updateEducation(edu.id, 'year', e.target.value)} />
                      </Form.Item>
                      <Form.Item label="描述">
                        <Input.TextArea rows={2} value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} />
                      </Form.Item>
                    </Form>
                  </Card>
                ))}
                <Button type="dashed" block icon={<Plus size={16} />} onClick={addEducation}>添加教育经历</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar bg-gray-200 dark:bg-gray-900 rounded-xl flex justify-center p-8">
        <div 
          ref={componentRef}
          className="bg-white text-gray-800 w-[210mm] min-h-[297mm] p-[15mm] shadow-lg flex flex-col gap-6"
          style={{ fontFamily: '"Microsoft YaHei", sans-serif' }}
        >
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4">
            <h1 className="text-3xl font-bold tracking-wider mb-2">{data.personal.name}</h1>
            <p className="text-lg text-gray-600 mb-3">{data.personal.title}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {data.personal.email && <div className="flex items-center gap-1"><Mail size={14} /> {data.personal.email}</div>}
              {data.personal.phone && <div className="flex items-center gap-1"><Phone size={14} /> {data.personal.phone}</div>}
              {data.personal.github && <div className="flex items-center gap-1"><Github size={14} /> {data.personal.github}</div>}
              {data.personal.linkedin && <div className="flex items-center gap-1"><Linkedin size={14} /> {data.personal.linkedin}</div>}
            </div>
          </div>

          {/* Summary */}
          {data.personal.summary && (
            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 uppercase tracking-wide text-gray-700">个人简介</h3>
              <p className="text-sm leading-relaxed text-gray-700">{data.personal.summary}</p>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 mb-2 pb-1 uppercase tracking-wide text-gray-700">专业技能</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide text-gray-700">工作经历</h3>
              <div className="flex flex-col gap-4">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-md">{exp.company}</h4>
                      <span className="text-sm text-gray-500 font-medium">{exp.year}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">{exp.role}</div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide text-gray-700">项目经验</h3>
              <div className="flex flex-col gap-4">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-md">{proj.name}</h4>
                      {proj.techStack && <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{proj.techStack}</span>}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mb-1">{proj.role}</div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h3 className="text-lg font-bold border-b border-gray-300 mb-3 pb-1 uppercase tracking-wide text-gray-700">教育背景</h3>
              <div className="flex flex-col gap-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-md">{edu.school}</h4>
                      <span className="text-sm text-gray-500 font-medium">{edu.year}</span>
                    </div>
                    <div className="text-sm text-gray-700">{edu.degree}</div>
                    {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
