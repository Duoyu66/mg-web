import { useState } from 'react';
import { Send, Settings, X, MessageCircle, Reply, AtSign, Heart, BellRing, MoreVertical, Smile, Image as ImageIcon } from 'lucide-react';
import { Button } from 'antd';

interface MessageItem {
    id: string;
    avatar: string;
    name: string;
    content: string;
    time: string;
    unread: boolean;
    type?: string;
}

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    active?: boolean;
}

const Message = () => {
    const [activeNav, setActiveNav] = useState('my-messages');
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [inputContent, setInputContent] = useState('');
    const maxLength = 500;

    const navItems: NavItem[] = [
        { id: 'my-messages', label: '我的消息', icon: <MessageCircle className="w-4 h-4" />, badge: 1, active: true },
        { id: 'replies', label: '回复我的', icon: <Reply className="w-4 h-4" /> },
        { id: 'mentions', label: '@ 我的', icon: <AtSign className="w-4 h-4" /> },
        { id: 'likes', label: '收到的赞', icon: <Heart className="w-4 h-4" /> },
        { id: 'system', label: '系统通知', icon: <BellRing className="w-4 h-4" /> },
    ];

    const messages: MessageItem[] = [
        {
            id: '1',
            avatar: 'https://via.placeholder.com/40',
            name: '哔哩哔哩智能机',
            content: '[有新通知]登录操作通知',
            time: '刚刚',
            unread: true,
            type: 'system'
        },
        {
            id: '2',
            avatar: 'https://via.placeholder.com/40',
            name: '哔哩哔哩公益',
            content: '请大好人回家看看!还送表...',
            time: '10分钟前',
            unread: false
        },
        {
            id: '3',
            avatar: 'https://via.placeholder.com/40',
            name: '洛天依',
            content: '[自动回复]你好呀,我是虚...',
            time: '30分钟前',
            unread: false
        },
        {
            id: '4',
            avatar: 'https://via.placeholder.com/40',
            name: '阿白的金手指厨房',
            content: '[自动回复]视频中出现的厨...',
            time: '1小时前',
            unread: false
        },
        {
            id: '5',
            avatar: 'https://via.placeholder.com/40',
            name: '潜艇伟伟迷',
            content: 'up主我是你的粉丝,新植...',
            time: '2小时前',
            unread: false
        },
        {
            id: '6',
            avatar: 'https://via.placeholder.com/40',
            name: '左程云',
            content: '[自动回复]感谢关注!我正...',
            time: '3小时前',
            unread: false
        },
        {
            id: '7',
            avatar: 'https://via.placeholder.com/40',
            name: '尚硅谷',
            content: '视频上线提醒',
            time: '5小时前',
            unread: false
        },
        {
            id: '8',
            avatar: 'https://via.placeholder.com/40',
            name: '薛同学不想学',
            content: '嗯转行了[tv笑哭]',
            time: '1天前',
            unread: false
        },
    ];

    const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('删除消息', id);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
            {/* 左侧导航栏 */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                {/* 标题 */}
                <div className="flex justify-start items-center h-[50px] border-b border-red-200 dark:border-gray-700 ">
                        <Send className=" text-primary-500" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">消息中心</h2>
                </div>

                {/* 导航列表 */}
                <div className="flex-1 overflow-y-auto py-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative ${
                                item.active || activeNav === item.id
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${
                                item.active || activeNav === item.id
                                    ? 'bg-primary-500'
                                    : 'bg-gray-400 dark:bg-gray-500'
                            }`} />
                            {item.icon}
                            <span className="flex-1 text-sm">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <span className="w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* 底部设置 */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">消息设置</span>
                    </button>
                </div>
            </div>

            {/* 右侧主内容区 */}
            <div className="flex-1 flex">
                {/* 消息列表 */}
                <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    {/* 顶部栏 */}
                    <div className="p-4 border-b h-[50px] border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {navItems.find(item => item.id === activeNav)?.label || '我的消息'}
                        </h3>
                    </div>

                    {/* 最近消息列表 */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            最近消息
                        </div>
                        <div className="space-y-1 px-2">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => setSelectedMessage(message.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors relative group ${
                                        selectedMessage === message.id
                                            ? 'bg-primary-50 dark:bg-primary-900/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src='https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg'
                                            alt={message.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                                            }}
                                        />
                                        {message.unread && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {message.name}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
                                                {message.time}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                            {message.content}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteMessage(message.id, e)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                                    >
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 聊天内容区 */}
                <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col">
                    {selectedMessage ? (
                        <>
                            {/* 顶部头部 */}
                            <div className="h-[50px] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {messages.find(m => m.id === selectedMessage)?.name || '用户'}
                                    </span>
                                </div>
                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* 聊天内容区 */}
                            <div className="flex-1 overflow-y-auto px-4 py-4">
                                {/* 提示信息 */}
                                <div className="text-center mb-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        对方主动回复或关注你前,最多发送1条消息
                                    </p>
                                </div>

                                {/* 用户发送的消息 */}
                                <div className="flex items-end justify-end gap-2 mb-4">
                                    <div className="max-w-[70%]">
                                        <div className="bg-primary-500 text-white rounded-lg px-4 py-2 text-sm">
                                            {messages.find(m => m.id === selectedMessage)?.content || 'up主我是你的粉丝,新植物什么时候上卡槽啊?'}
                                        </div>
                                    </div>
                                    <img
                                        src="https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg"
                                        alt="我的头像"
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* 底部输入区 */}
                            <div className="border-t border-gray-200 dark:border-gray-700 ">
                                <div className="relative dark:border-gray-600  bg-white dark:bg-gray-700">
                                    {/* 顶部图标 */}
                                    <div className="absolute top-1 left-2 z-10 flex items-center gap-1">
                                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                                            <ImageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                                            <Smile className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>

                                    {/* 输入框 */}
                                    <textarea
                                        value={inputContent}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= maxLength) {
                                                setInputContent(value);
                                            }
                                        }}
                                        placeholder="请输入消息内容"
                                        className="w-full px-3 pt-8 pb-12 border-0 rounded-lg resize-none focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-100 bg-white"
                                        rows={5}
                                        style={{ minHeight: '120px' }}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = `${Math.max(target.scrollHeight, 120)}px`;
                                        }}
                                    />

                                    {/* 底部字符计数和发送按钮 */}
                                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                            {inputContent.length}/{maxLength}
                                        </span>
                                        <Button
                                            type="primary"
                                            disabled={!inputContent.trim()}
                                            className={`!rounded-md ${!inputContent.trim() ? '!bg-gray-300 !border-gray-300 dark:!bg-gray-600 dark:!border-gray-600' : ''}`}
                                            onClick={() => {
                                                if (inputContent.trim()) {
                                                    console.log('发送消息:', inputContent);
                                                    setInputContent('');
                                                }
                                            }}
                                        >
                                            发送
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center max-w-md px-6">
                                {/* 空状态插图 */}
                                <div className="mb-6 flex items-center justify-center">
                                    <div className="relative">
                                        {/* 左侧角色 - 长头发，惊讶表情 */}
                                        <div className="absolute left-0 top-0">
                                            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 relative">
                                                <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                                                <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                                            </div>
                                            {/* 思考气泡 */}
                                            <div className="absolute -top-8 -left-4 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                                                <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-blue-400"></div>
                                                <div className="absolute top-2 right-1 w-1 h-1 rounded-full bg-blue-400"></div>
                                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"></div>
                                            </div>
                                        </div>
                                        {/* 右侧角色 - 短头发，睡觉 */}
                                        <div className="absolute right-0 top-0">
                                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 relative">
                                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-green-200 dark:bg-green-800 rounded-full"></div>
                                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-green-600 dark:bg-green-400 rounded-full"></div>
                                            </div>
                                            {/* Z Z 符号 */}
                                            <div className="absolute -top-6 right-2 text-blue-400 dark:text-blue-500 font-bold text-xs">
                                                Z Z
                                            </div>
                                        </div>
                                        {/* 曲线 */}
                                        <svg width="200" height="100" className="opacity-30">
                                            <path
                                                d="M 20 80 Q 100 40 180 80"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                className="text-blue-300 dark:text-blue-700"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                                    快找小伙伴聊天吧(゜-゜)つロ
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                    选择左侧的消息开始对话
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
