import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, Tabs, Tooltip, message, Empty } from 'antd';
import { 
    ChevronLeft, 
    Share2, 
    Bookmark, 
    Flag, 
    CheckCircle2,
    Copy,
    ThumbsUp,
    MessageSquare,
    Eye
} from 'lucide-react';
import { MOCK_QUESTIONS } from './data';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QuestionDetail = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('description');
    const [isBookmarked, setIsBookmarked] = useState(false);

    const question = MOCK_QUESTIONS.find(q => q.id === questionId);

    // 如果找不到题目
    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Empty description="题目不存在" />
                <Button onClick={() => navigate('..')} className="mt-4">返回列表</Button>
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        message.success('链接已复制到剪贴板');
    };

    // Markdown 代码高亮组件
    const CodeBlock = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in duration-300">
            {/* 顶部工具栏 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span className="text-gray-400">#{question.id}</span>
                        {question.title}
                    </h1>
                    <Tag color={
                        question.difficulty === '简单' ? 'green' : 
                        question.difficulty === '中等' ? 'orange' : 'red'
                    }>
                        {question.difficulty}
                    </Tag>
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip title="收藏">
                        <Button 
                            type="text" 
                            icon={<Bookmark size={18} className={isBookmarked ? "fill-yellow-400 text-yellow-400" : ""} />} 
                            onClick={() => setIsBookmarked(!isBookmarked)}
                        />
                    </Tooltip>
                    <Tooltip title="分享">
                        <Button type="text" icon={<Share2 size={18} />} onClick={handleCopy} />
                    </Tooltip>
                    <Tooltip title="反馈">
                        <Button type="text" icon={<Flag size={18} />} />
                    </Tooltip>
                </div>
            </div>

            {/* 主体内容区 */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="px-6 pt-4 border-b border-gray-100 dark:border-gray-700">
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        items={[
                            { key: 'description', label: '题目描述', icon: <Flag size={14} /> },
                            { key: 'solution', label: '题解', icon: <CheckCircle2 size={14} /> },
                            { key: 'comments', label: '评论', icon: <MessageSquare size={14} /> },
                        ]}
                    />
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto">
                        {activeTab === 'description' && (
                            <div className="prose dark:prose-invert max-w-none">
                                <div className="flex gap-2 mb-6">
                                    {question.tags.map(tag => (
                                        <Tag key={tag} className="mr-0 bg-gray-100 dark:bg-gray-700 border-none text-gray-600 dark:text-gray-300 px-3 py-1">
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                                <ReactMarkdown components={CodeBlock}>
                                    {question.content || '暂无详细描述'}
                                </ReactMarkdown>
                            </div>
                        )}
                        {activeTab === 'solution' && (
                            <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown components={CodeBlock}>
                                    {question.answer || '暂无参考题解'}
                                </ReactMarkdown>
                            </div>
                        )}
                        {activeTab === 'comments' && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <MessageSquare size={48} className="mb-4 opacity-30" />
                                <p className="text-lg">评论区暂未开放</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/30 text-sm text-gray-500">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><ThumbsUp size={14} /> 128 人点赞</span>
                        <span className="flex items-center gap-1.5"><Eye size={14} /> 1.2k 次浏览</span>
                    </div>
                    <div>
                        通过率：{question.passRate}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetail;
