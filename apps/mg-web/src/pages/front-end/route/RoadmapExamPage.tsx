import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Radio, Space, Tag, message, Typography, Empty, Segmented, Progress } from 'antd';
import { LeftOutlined, RightOutlined, UnorderedListOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

const { Title, Text } = Typography;

const RoadmapExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questionList = [], title = '练习' } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [viewMode, setViewMode] = useState<'single' | 'list'>('single');
  
  useEffect(() => {
    Prism.highlightAll();
  }, [currentIndex, viewMode, questionList]);

  if (!questionList || questionList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Empty description="暂无题目数据" >
            <Button type="primary" onClick={() => navigate(-1)}>返回</Button>
        </Empty>
      </div>
    );
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const currentQuestion = questionList[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalCount = questionList.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  const QuestionCard = ({ question, index, showNumber = true }: { question: any, index: number, showNumber?: boolean }) => {
    return (
      <Card
        className="mb-4 shadow-sm border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
        title={
          <div className="flex flex-col gap-2 whitespace-normal">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {showNumber && (
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
                    {index + 1}
                  </span>
                )}
                <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                  {question.title || question.questionName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag
                  color={
                    question.difficulty === 'simple'
                      ? 'green'
                      : question.difficulty === 'hard'
                      ? 'red'
                      : 'orange'
                  }
                  className="text-xs px-2 py-0.5 rounded-full"
                >
                  {question.difficulty === 'simple' ? '简单' : question.difficulty === 'hard' ? '困难' : '中等'}
                </Tag>
                <Tag className="text-xs px-2 py-0.5 rounded-full">
                  {question.type === '1' ? '单选题' : '多选题'}
                </Tag>
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-1">
          <Radio.Group 
            className="w-full" 
            value={answers[question.id]} 
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          >
            <Space direction="vertical" className="w-full">
              {question.items?.map((item: any) => (
                <Radio 
                    key={item.optionName} 
                    value={item.optionName}
                    className="w-full px-3 py-2 sm:py-3 border border-gray-200/80 dark:border-gray-800 rounded-xl hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors flex items-start gap-2"
                >
                  <span className="font-semibold mr-1 mt-0.5 text-gray-700 dark:text-gray-200">
                    {item.optionName}.
                  </span>
                  <span className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {item.optionValue}
                  </span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className=" mx-auto   ">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-2 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur h-14">
          <div className="flex items-center gap-3">
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => navigate(-1)}
              className="px-0 text-gray-600 dark:text-gray-200"
            >
              返回
            </Button>
            <div className="flex flex-col">
              <Title level={4} className="m-0 !text-gray-900 dark:!text-gray-100">
                {title}
              </Title>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300 text-sm">视图模式</span>
            <Segmented
              value={viewMode}
              onChange={(val) => setViewMode(val as 'single' | 'list')}
              options={[
                { label: '单题', value: 'single', icon: <FileTextOutlined /> },
                { label: '列表', value: 'list', icon: <UnorderedListOutlined /> },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
          <div
            className="p-4    border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 lg:sticky lg:top-14 self-start flex flex-col"
            style={{ height: 'calc(100vh - 56px)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <Text strong className="text-gray-800 dark:text-gray-100">
                答题卡
              </Text>
              <span className="text-xs text-gray-400">
                共 {totalCount} 题
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                当前
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                已答
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                未答
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {questionList.map((q: any, idx: number) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = currentIndex === idx;

                return (
                  <Button
                    key={q.id}
                    type={isCurrent ? 'primary' : isAnswered ? 'default' : 'text'}
                    size="small"
                    className={`!rounded-full ${
                      isAnswered && !isCurrent ? 'border border-green-500 text-green-600 bg-green-50' : ''
                    } ${
                      !isAnswered && !isCurrent
                        ? 'text-gray-500 hover:border-gray-300'
                        : ''
                    }`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      if (viewMode === 'list') {
                        document.getElementById(`q-${idx}`)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {idx + 1}
                  </Button>
                );
              })}
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>完成度</span>
                <span>
                  {answeredCount}/{totalCount}
                </span>
              </div>
              <Progress
                percent={progress}
                size="small"
                strokeColor={{ from: '#34d399', to: '#3b82f6' }}
              />
            </div>

            <div className="mt-auto pt-4">
              <Button
                type="primary"
                block
                size="large"
                onClick={() => message.success('提交成功（演示）')}
              >
                提交试卷
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {viewMode === 'single' ? (
              <div className="space-y-6">
                <QuestionCard question={currentQuestion} index={currentIndex} />
                <div className="flex justify-between">
                  <Button
                    size="large"
                    icon={<LeftOutlined />}
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                  >
                    上一题
                  </Button>
                  <Button
                    size="large"
                    type="primary"
                    icon={<RightOutlined />}
                    disabled={currentIndex === questionList.length - 1}
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    iconPosition="end"
                  >
                    下一题
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="space-y-5">
                  {questionList.map((q: any, idx: number) => (
                    <div key={q.id} id={`q-${idx}`}>
                      <QuestionCard question={q} index={idx} />
                    </div>
                  ))}
                  <div className="flex justify-center mt-4">
                    <Button
                      type="default"
                      size="large"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      回到顶部
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapExamPage;
