import React, { useRef, useMemo } from 'react';
import { Button, Tag, Divider, Space, Typography, Empty } from 'antd';
import { 
  DownloadOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  GithubOutlined, 
  EnvironmentOutlined,
  UserOutlined,
  TrophyOutlined,
  ProjectOutlined,
  BookOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeList } from './data';

const { Title, Text, Paragraph } = Typography;

const ResumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  const resume = useMemo(() => resumeList.find(r => r.id === id), [id]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: resume ? `${resume.name}-${resume.role}-${resume.years}` : '简历',
  });

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Empty description="未找到该简历" />
        <Button className="mt-4" onClick={() => navigate('/front/realResume')}>返回列表</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Action Bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-sm sticky top-4 z-50 border border-white/20"
        >
          <div className="flex items-center gap-4">
            <Button 
              icon={<LeftOutlined />} 
              onClick={() => navigate('/front/realResume')}
              className="dark:text-gray-300 dark:hover:text-white"
            >
              返回列表
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block"></div>
            <Title level={4} className="!mb-0 dark:!text-white hidden md:block">简历预览</Title>
          </div>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            size="large"
            onClick={() => handlePrint()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
          >
            下载 / 打印
          </Button>
        </motion.div>

        {/* Resume Container */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", damping: 20 }}
          className="relative"
        >
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl -z-10 transform scale-95 translate-y-4 rounded-[3rem]"></div>
            
            <div 
            ref={componentRef} 
            className="bg-white p-10 md:p-16 shadow-2xl rounded-sm min-h-[1123px] text-gray-800"
            style={{ width: '100%', fontFamily: '"Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", sans-serif' }}
            >
            {/* Header */}
            <div className="flex justify-between items-start mb-10 border-b-2 border-gray-100 pb-8">
                <div className="flex-1 pr-8">
                <Title level={1} className="!mb-2 !text-4xl tracking-tight text-gray-900">{resume.name}</Title>
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-xl text-blue-600 font-medium">{resume.role}</span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                    <span className="text-lg text-gray-500">{resume.years}经验</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-gray-600">
                    <Space className="hover:text-blue-600 transition-colors cursor-default">
                    <PhoneOutlined /> {resume.phone}
                    </Space>
                    <Space className="hover:text-blue-600 transition-colors cursor-default">
                    <MailOutlined /> {resume.email}
                    </Space>
                    <Space className="hover:text-blue-600 transition-colors cursor-default">
                    <EnvironmentOutlined /> {resume.location}
                    </Space>
                    <Space className="hover:text-blue-600 transition-colors cursor-default">
                    <GithubOutlined /> {resume.github}
                    </Space>
                </div>
                </div>
                
                <div className="hidden md:flex w-28 h-36 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 items-center justify-center text-gray-300 rounded-lg shadow-inner">
                    <span className="text-5xl font-bold text-gray-300/50 select-none">{resume.name[0]}</span>
                </div>
            </div>

            {/* Education */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <BookOutlined className="text-xl" />
                </div>
                <Title level={3} className="!mb-0 !text-xl font-bold text-gray-800">教育背景</Title>
                </div>
                
                {resume.education.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 p-4 rounded-lg border border-gray-100/50 hover:bg-blue-50/30 transition-colors">
                    <div className="mb-2 md:mb-0">
                    <Title level={5} className="!mb-1 font-bold">{edu.school}</Title>
                    <div className="flex gap-3 text-gray-600 text-sm">
                        <span className="font-medium">{edu.major}</span>
                        <span className="text-gray-300">|</span>
                        <span>{edu.degree}</span>
                    </div>
                    </div>
                    <Tag className="w-fit m-0 border-0 bg-white text-gray-500 shadow-sm px-3 py-1">
                    {edu.time}
                    </Tag>
                </div>
                ))}
            </div>

            {/* Skills */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <TrophyOutlined className="text-xl" />
                </div>
                <Title level={3} className="!mb-0 !text-xl font-bold text-gray-800">专业技能</Title>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                {resume.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium border border-gray-200">
                    {skill}
                    </span>
                ))}
                </div>
                
                <div className="space-y-2">
                {resume.skillsDesc.map((desc, index) => (
                    <div key={index} className="flex gap-3 text-gray-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                    <span>{desc}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Work Experience */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <ProjectOutlined className="text-xl" />
                </div>
                <Title level={3} className="!mb-0 !text-xl font-bold text-gray-800">工作经历</Title>
                </div>
                
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
                {resume.workExperience.map((work, index) => (
                    <div key={index} className="relative pl-10">
                    <div className="absolute left-[13px] top-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                        <Title level={5} className="!mb-0 !text-lg font-bold">{work.company}</Title>
                        <span className="text-gray-500 text-sm font-medium">{work.time}</span>
                    </div>
                    <Text strong className="block mb-3 text-blue-600">{work.role}</Text>
                    
                    <div className="space-y-1.5 text-gray-700">
                        {work.desc.map((d, i) => (
                        <div key={i} className="leading-relaxed text-sm text-justify">
                             • {d}
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Projects */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <ProjectOutlined className="text-xl" />
                </div>
                <Title level={3} className="!mb-0 !text-xl font-bold text-gray-800">项目经验</Title>
                </div>

                <div className="grid gap-6">
                {resume.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50/50 rounded-xl p-5 border border-gray-100">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                        <Title level={5} className="!mb-0 !text-base font-bold">{project.name}</Title>
                        <Tag color="cyan" className="m-0 border-0">{project.tech}</Tag>
                    </div>
                    
                    <div className="mb-3 text-sm text-gray-600 bg-white p-3 rounded border border-gray-100">
                        <span className="font-bold text-gray-800">项目描述：</span>
                        {project.desc}
                    </div>
                    
                    <div className="text-sm text-gray-700">
                        <div className="font-bold text-gray-800 mb-1">主要职责：</div>
                        <ul className="list-none space-y-1 pl-1">
                        {project.role.map((r, i) => (
                            <li key={i} className="flex gap-2">
                            <span className="text-gray-400 mt-1">▹</span>
                            <span>{r}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Self Evaluation */}
            <div>
                <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <UserOutlined className="text-xl" />
                </div>
                <Title level={3} className="!mb-0 !text-xl font-bold text-gray-800">自我评价</Title>
                </div>
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 text-gray-700 leading-7 text-justify">
                {resume.intro}
                </div>
            </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeDetailPage;
