import { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  MessageCircle,
  Reply,
  AtSign,
  Heart,
  BellRing,
  MoreVertical,
  Users,
  Search,
} from "lucide-react";
import { Button, Input, Modal } from "antd";
import EmojiPicker from "@/components/EmojiPicker";

interface MessageItem {
  id: string;
  avatar: string;
  name: string;
  content: string;
  time: string;
  unread: boolean;
  type?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  type: "sent" | "received";
}

interface ChatHistory {
  [userId: string]: ChatMessage[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  active?: boolean;
}

interface Contact {
  id: string;
  avatar: string;
  name: string;
  status?: "online" | "offline";
}

interface NewFriend {
  id: string;
  avatar: string;
  name: string;
  username?: string;
  bio?: string;
}

const Message = () => {
  const [activeNav, setActiveNav] = useState("my-messages");
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [inputContent, setInputContent] = useState("");
  const [activeTab, setActiveTab] = useState<"system" | "friends" | "contacts">("system");
  const [friendSearchText, setFriendSearchText] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [newFriendSearchText, setNewFriendSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<NewFriend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());
  
  // 系统消息列表（按类型分类）
  const [systemMessages] = useState<{
    "my-messages": MessageItem[];
    "replies": MessageItem[];
    "mentions": MessageItem[];
    "likes": MessageItem[];
    "system": MessageItem[];
  }>({
    "my-messages": [
      {
        id: "sys-1",
        avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
        name: "系统消息",
        content: "您有一条新消息",
        time: "刚刚",
        unread: true,
        type: "system",
      },
    ],
    "replies": [],
    "mentions": [],
    "likes": [],
    "system": [
      {
        id: "sys-2",
        avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
        name: "哔哩哔哩智能机",
        content: "[有新通知]登录操作通知",
        time: "刚刚",
        unread: true,
        type: "system",
      },
    ],
  });

  // 好友消息列表（用户之间的聊天消息）
  const [friendMessages, setFriendMessages] = useState<MessageItem[]>([
    {
      id: "friend-1",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "哔哩哔哩公益",
      content: "请大好人回家看看!还送表...",
      time: "10分钟前",
      unread: false,
    },
    {
      id: "friend-2",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "洛天依",
      content: "[自动回复]你好呀,我是虚...",
      time: "30分钟前",
      unread: false,
    },
    {
      id: "friend-3",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "阿白的金手指厨房",
      content: "[自动回复]视频中出现的厨...",
      time: "1小时前",
      unread: false,
    },
    {
      id: "friend-4",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "潜艇伟伟迷",
      content: "up主我是你的粉丝,新植...",
      time: "2小时前",
      unread: false,
    },
    {
      id: "friend-5",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "左程云",
      content: "[自动回复]感谢关注!我正...",
      time: "3小时前",
      unread: false,
    },
    {
      id: "friend-6",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "尚硅谷",
      content: "视频上线提醒",
      time: "5小时前",
      unread: false,
    },
    {
      id: "friend-7",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "薛同学不想学",
      content: "嗯转行了[tv笑哭]",
      time: "1天前",
      unread: false,
    },
    {
      id: "friend-8",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "test测试的",
      content: "嗯转行了[tv笑哭]",
      time: "1天前",
      unread: false,
    },
    {
      id: "friend-9",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "test测试的2",
      content: "嗯转行了[tv笑哭]",
      time: "1天前",
      unread: false,
    },
  ]);

  // 聊天历史记录，按用户ID存储
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    "friend-4": [
      {
        id: "chat-1",
        content: "up主我是你的粉丝,新植物什么时候上卡槽啊?",
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        type: "received",
      },
    ],
  });

  // 联系人列表
  const [contacts] = useState<Contact[]>([
    {
      id: "contact-1",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "张三",
      status: "online",
    },
    {
      id: "contact-2",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "李四",
      status: "offline",
    },
    {
      id: "contact-3",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "王五",
      status: "online",
    },
    {
      id: "contact-4",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "赵六",
      status: "offline",
    },
    {
      id: "contact-5",
      avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
      name: "钱七",
      status: "online",
    },
  ]);

  const maxLength = 500;
  const chatContentRef = useRef<HTMLDivElement>(null);
  const myAvatar =
    "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg";

  // 系统消息导航项
  const systemNavItems: NavItem[] = [
    {
      id: "my-messages",
      label: "我的消息",
      icon: <MessageCircle className="w-4 h-4" />,
      badge: systemMessages["my-messages"].filter((m) => m.unread).length,
      active: true,
    },
    {
      id: "replies",
      label: "回复我的",
      icon: <Reply className="w-4 h-4" />,
      badge: systemMessages["replies"].filter((m) => m.unread).length,
    },
    {
      id: "mentions",
      label: "@ 我的",
      icon: <AtSign className="w-4 h-4" />,
      badge: systemMessages["mentions"].filter((m) => m.unread).length,
    },
    {
      id: "likes",
      label: "收到的赞",
      icon: <Heart className="w-4 h-4" />,
      badge: systemMessages["likes"].filter((m) => m.unread).length,
    },
    {
      id: "system",
      label: "系统通知",
      icon: <BellRing className="w-4 h-4" />,
      badge: systemMessages["system"].filter((m) => m.unread).length,
    },
  ];

  // 获取当前显示的消息列表
  const getCurrentMessages = (): MessageItem[] => {
    if (activeTab === "system") {
      return systemMessages[activeNav as keyof typeof systemMessages] || [];
    } else {
      return friendMessages;
    }
  };

  // 搜索好友（包括现有好友和新好友）
  const searchFriends = () => {
    if (!friendSearchText.trim()) {
      return {
        existingFriends: friendMessages,
        newFriends: [],
      };
    }

    const searchLower = friendSearchText.toLowerCase().trim();
    
    // 搜索现有好友消息列表
    const existingFriends = friendMessages.filter(
      (friend) =>
        friend.name.toLowerCase().includes(searchLower) ||
        friend.content.toLowerCase().includes(searchLower)
    );

    // 搜索新好友（在联系人列表中但不在好友消息列表中）
    const existingFriendIds = new Set(friendMessages.map((f) => f.id));
    const newFriends = contacts.filter(
      (contact) =>
        !existingFriendIds.has(contact.id) &&
        (contact.name.toLowerCase().includes(searchLower))
    );

    return {
      existingFriends,
      newFriends,
    };
  };

  const { existingFriends, newFriends } = searchFriends();

  // 处理搜索输入变化
  useEffect(() => {
    if (!isSearchModalOpen) {
      setSearchResults([]);
      return;
    }

    if (!newFriendSearchText.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const searchLower = newFriendSearchText.toLowerCase().trim();
      
      // 模拟搜索结果（实际应该调用API）
      // 这里过滤掉已经在联系人列表中的用户
      const existingContactIds = new Set(contacts.map((c) => c.id));
      const mockResults: NewFriend[] = [
        {
          id: "new-1",
          avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
          name: "新朋友1",
          username: "newfriend1",
          bio: "这是一个新朋友",
        },
        {
          id: "new-2",
          avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
          name: "新朋友2",
          username: "newfriend2",
          bio: "这是另一个新朋友",
        },
        {
          id: "new-3",
          avatar: "https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg",
          name: "新朋友3",
          username: "newfriend3",
          bio: "又一个新朋友",
        },
      ].filter(
        (user) =>
          !existingContactIds.has(user.id) &&
          (user.name.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower))
      );

      setSearchResults(mockResults);
    }, 300); // 防抖

    return () => clearTimeout(timer);
  }, [newFriendSearchText, isSearchModalOpen, contacts]);

  // 发送好友申请
  const handleSendFriendRequest = (friendId: string) => {
    setPendingRequests((prev) => new Set(prev).add(friendId));
    // 这里应该调用API发送好友申请
    console.log("发送好友申请:", friendId);
  };

  // 打开搜索弹窗
  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
    setNewFriendSearchText("");
    setSearchResults([]);
  };

  // 关闭搜索弹窗
  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setNewFriendSearchText("");
    setSearchResults([]);
  };

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  // 格式化聊天时间
  const formatChatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (msgDate.getTime() === today.getTime()) {
      // 今天：显示时间
      return `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    } else if (msgDate.getTime() === today.getTime() - 86400000) {
      // 昨天
      return `昨天 ${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`;
    } else {
      // 更早：显示日期和时间
      return `${date.getMonth() + 1}-${date.getDate()} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
  };

  // 获取当前聊天的消息列表
  const getCurrentChatMessages = (): ChatMessage[] => {
    if (!selectedMessage) return [];
    return chatHistory[selectedMessage] || [];
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!inputContent.trim() || !selectedMessage) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      content: inputContent.trim(),
      timestamp: Date.now(),
      type: "sent",
    };

    // 更新聊天历史
    setChatHistory((prev) => ({
      ...prev,
      [selectedMessage]: [...(prev[selectedMessage] || []), newMessage],
    }));

    // 更新好友消息列表中的最后一条消息和时间
    setFriendMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === selectedMessage) {
          const shortContent =
            newMessage.content.length > 15
              ? newMessage.content.substring(0, 15) + "..."
              : newMessage.content;
          return {
            ...msg,
            content: shortContent,
            time: formatTime(newMessage.timestamp),
            unread: false,
          };
        }
        return msg;
      })
    );

    // 清空输入框
    setInputContent("");

    // 滚动到底部
    setTimeout(() => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
      }
    }, 100);
  };

  // 处理换行显示
  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  // 自动滚动到底部
  useEffect(() => {
    if (chatContentRef.current && selectedMessage) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [selectedMessage, chatHistory]);

  const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("删除消息", id);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputContent((prev) => {
      const newContent = prev + emoji;
      if (newContent.length <= maxLength) {
        return newContent;
      }
      return prev;
    });
  };

  // 处理回车键发送（Ctrl+Enter 换行）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理点击联系人
  const handleContactClick = (contact: Contact) => {
    // 检查该联系人是否已经在好友消息列表中
    const existingMessage = friendMessages.find((msg) => msg.id === contact.id);
    
    if (!existingMessage) {
      // 如果不在消息列表中，添加到好友消息列表
      const newMessage: MessageItem = {
        id: contact.id,
        avatar: contact.avatar,
        name: contact.name,
        content: "",
        time: "刚刚",
        unread: false,
      };
      setFriendMessages((prev) => [newMessage, ...prev]);
    }
    
    // 切换到好友消息标签并选中该联系人
    setActiveTab("friends");
    setSelectedMessage(contact.id);
    setInputContent("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧导航栏 - 只在系统消息标签下显示 */}
        {activeTab === "system" && (
          <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            {/* 标题 */}
            <div className="flex justify-start items-center h-[50px] border-b border-red-200 dark:border-gray-700 ">
              <Send className=" text-primary-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                消息中心
              </h2>
            </div>

            {/* 导航列表 */}
            <div className="flex-1 overflow-y-auto py-2">
              {systemNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 cursor-pointer px-4 py-3 text-left transition-colors relative ${
                    item.active || activeNav === item.id
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.active || activeNav === item.id
                        ? "bg-primary-500"
                        : "bg-gray-400 dark:bg-gray-500"
                    }`}
                  />
                  {item.icon}
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      {/* 右侧主内容区 */}
      <div className="flex-1 flex">
        {/* 消息列表/联系人列表 */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* 顶部栏 */}
          <div className="p-4 border-b h-[50px] border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {activeTab === "system"
                ? systemNavItems.find((item) => item.id === activeNav)?.label || "我的消息"
                : activeTab === "friends"
                ? "好友消息"
                : "联系人"}
            </h3>
            {activeTab === "contacts" && (
              <button
                onClick={handleOpenSearchModal}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="搜索新朋友"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>

          {/* 好友消息搜索框 */}
          {activeTab === "friends" && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <Input
                placeholder="搜索好友..."
                prefix={<Search className="w-4 h-4 text-gray-400" />}
                value={friendSearchText}
                onChange={(e) => setFriendSearchText(e.target.value)}
                allowClear
                className="w-full"
              />
            </div>
          )}

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "contacts" ? (
              <>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  我的好友 ({contacts.length})
                </div>
                <div className="space-y-1 px-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactClick(contact)}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={contact.avatar || "https://via.placeholder.com/48"}
                          alt={contact.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/48";
                          }}
                        />
                        {contact.status === "online" && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {contact.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.status === "online" ? "在线" : "离线"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : activeTab === "friends" ? (
              <>
                {/* 现有好友搜索结果 */}
                {existingFriends.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {friendSearchText ? `搜索结果 (${existingFriends.length})` : "最近消息"}
                    </div>
                    <div className="space-y-1 px-2">
                      {existingFriends.map((message) => (
                        <div
                          key={message.id}
                          onClick={() => {
                            setSelectedMessage(message.id);
                            setInputContent("");
                          }}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors relative group ${
                            selectedMessage === message.id
                              ? "bg-primary-50 dark:bg-primary-900/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={message.avatar || "https://via.placeholder.com/48"}
                              alt={message.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/48";
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
                                {(() => {
                                  const chatMsgs = chatHistory[message.id];
                                  if (chatMsgs && chatMsgs.length > 0) {
                                    const lastMsg = chatMsgs[chatMsgs.length - 1];
                                    return formatTime(lastMsg.timestamp);
                                  }
                                  return message.time;
                                })()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                              {(() => {
                                const chatMsgs = chatHistory[message.id];
                                if (chatMsgs && chatMsgs.length > 0) {
                                  const lastMsg = chatMsgs[chatMsgs.length - 1];
                                  const preview =
                                    lastMsg.content.length > 15
                                      ? lastMsg.content.substring(0, 15) + "..."
                                      : lastMsg.content;
                                  return preview;
                                }
                                return message.content;
                              })()}
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
                  </>
                )}

                {/* 新好友搜索结果 */}
                {newFriends.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                      新好友 ({newFriends.length})
                    </div>
                    <div className="space-y-1 px-2">
                      {newFriends.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => handleContactClick(contact)}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="relative flex-shrink-0">
                            <img
                              src={contact.avatar || "https://via.placeholder.com/48"}
                              alt={contact.name}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://via.placeholder.com/48";
                              }}
                            />
                            {contact.status === "online" && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {contact.name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {contact.status === "online" ? "在线" : "离线"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* 无搜索结果提示 */}
                {friendSearchText && existingFriends.length === 0 && newFriends.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      未找到相关好友
                    </p>
                  </div>
                )}

                {/* 无搜索文本时显示所有好友消息 */}
                {!friendSearchText && existingFriends.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 px-4">
                    <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      暂无好友消息
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  系统消息
                </div>
                <div className="space-y-1 px-2">
                  {getCurrentMessages().map((message) => (
                <div
                  key={message.id}
                  onClick={() => {
                    setSelectedMessage(message.id);
                    setInputContent(""); // 切换会话时清空输入框

                    // 如果该用户没有聊天历史，初始化第一条消息（显示原始消息内容）
                    if (
                      !chatHistory[message.id] ||
                      chatHistory[message.id].length === 0
                    ) {
                      // 保留原始消息作为第一条接收消息（如果需要）
                      // 这里可以根据需要决定是否自动添加
                    }
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors relative group ${
                    selectedMessage === message.id
                      ? "bg-primary-50 dark:bg-primary-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={message.avatar || "https://via.placeholder.com/48"}
                      alt={message.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/48";
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
                        {(() => {
                          // 如果有聊天历史，显示最后一条消息的时间
                          const chatMsgs = chatHistory[message.id];
                          if (chatMsgs && chatMsgs.length > 0) {
                            const lastMsg = chatMsgs[chatMsgs.length - 1];
                            return formatTime(lastMsg.timestamp);
                          }
                          return message.time;
                        })()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                      {(() => {
                        // 如果有聊天历史，显示最后一条消息的预览
                        const chatMsgs = chatHistory[message.id];
                        if (chatMsgs && chatMsgs.length > 0) {
                          const lastMsg = chatMsgs[chatMsgs.length - 1];
                          const preview =
                            lastMsg.content.length > 15
                              ? lastMsg.content.substring(0, 15) + "..."
                              : lastMsg.content;
                          return preview;
                        }
                        return message.content;
                      })()}
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
              </>
            )}
          </div>
        </div>

        {/* 聊天内容区 */}
        <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col relative">
          {selectedMessage ? (
            <>
              {/* 顶部头部 */}
              <div className="h-[50px] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {(activeTab === "friends" ? friendMessages : getCurrentMessages()).find(
                      (m) => m.id === selectedMessage
                    )?.name || "用户"}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* 聊天内容区 */}
              <div
                ref={chatContentRef}
                className="flex-1 overflow-y-auto px-4 py-4"
              >
                {/* 提示信息 */}
                {getCurrentChatMessages().length === 0 && (
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      对方主动回复或关注你前,最多发送1条消息
                    </p>
                  </div>
                )}

                {/* 聊天消息列表 */}
                <div className="space-y-4">
                  {getCurrentChatMessages().map((msg) => {
                    const selectedMsg = (activeTab === "friends" ? friendMessages : getCurrentMessages()).find(
                      (m) => m.id === selectedMessage
                    );
                    const isSent = msg.type === "sent";

                    return (
                      <div
                        key={msg.id}
                        className={`flex  items-start gap-2  ${
                          isSent ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isSent && (
                          <img
                            src={
                              selectedMsg?.avatar ||
                              "https://via.placeholder.com/32"
                            }
                            alt={selectedMsg?.name || "用户"}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/32";
                            }}
                          />
                        )}
                        <div
                          className={`max-w-[70%] flex flex-col ${
                            isSent ? "items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                              isSent
                                ? "bg-primary-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {formatContent(msg.content)}
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-1">
                            {formatChatTime(msg.timestamp)}
                          </span>
                        </div>
                        {isSent && (
                          <img
                            src={myAvatar}
                            alt="我的头像"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/32";
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 底部输入区 */}
              <div className="border-t border-gray-200 dark:border-gray-700 ">
                <div className="relative dark:border-gray-600  bg-white dark:bg-gray-700">
                  {/* 顶部图标 */}
                  <div className="absolute top-1 left-2 z-10 flex items-center gap-1 cursor-pointer">
                    {/* <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                                            <ImageIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </button> */}
                    <EmojiPicker onSelect={handleEmojiSelect} />
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
                    onKeyDown={handleKeyDown}
                    placeholder="请输入消息内容"
                    className="w-full px-3 pt-9 pb-12 border-0 rounded-lg resize-none focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-100 bg-white"
                    rows={5}
                    style={{ minHeight: "120px" }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${Math.max(
                        target.scrollHeight,
                        120
                      )}px`;
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
                      className={`!rounded-md ${
                        !inputContent.trim()
                          ? "!bg-gray-300 !border-gray-300 dark:!bg-gray-600 dark:!border-gray-600"
                          : ""
                      }`}
                      onClick={handleSendMessage}
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

      {/* 底部 TabBar */}
      <div className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex">
        <button
          onClick={() => {
            setActiveTab("system");
            setActiveNav("my-messages");
            setSelectedMessage(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            activeTab === "system"
              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <BellRing className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">系统消息</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("friends");
            setSelectedMessage(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            activeTab === "friends"
              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">好友消息</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("contacts");
            setSelectedMessage(null);
          }}
          className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
            activeTab === "contacts"
              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs font-medium">联系人</span>
        </button>
      </div>

      {/* 搜索新朋友弹窗 */}
      <Modal
        title="搜索新朋友"
        open={isSearchModalOpen}
        onCancel={handleCloseSearchModal}
        footer={null}
        width={500}
        className="dark:[&_.ant-modal-content]:bg-gray-800 dark:[&_.ant-modal-header]:bg-gray-800 dark:[&_.ant-modal-title]:text-gray-100"
      >
        <div className="space-y-4">
          {/* 搜索框 */}
          <Input
            placeholder="搜索用户名或昵称..."
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            value={newFriendSearchText}
            onChange={(e) => setNewFriendSearchText(e.target.value)}
            allowClear
            size="large"
            className="w-full"
          />

          {/* 搜索结果列表 */}
          <div className="max-h-[400px] overflow-y-auto">
            {newFriendSearchText && searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  未找到相关用户
                </p>
              </div>
            ) : newFriendSearchText && searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={user.avatar || "https://via.placeholder.com/48"}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/48";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                      </div>
                      {user.username && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </div>
                      )}
                      {user.bio && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {user.bio}
                        </div>
                      )}
                    </div>
                    <Button
                      type={pendingRequests.has(user.id) ? "default" : "primary"}
                      size="small"
                      disabled={pendingRequests.has(user.id)}
                      onClick={() => handleSendFriendRequest(user.id)}
                    >
                      {pendingRequests.has(user.id) ? "已申请" : "发送申请"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  输入用户名或昵称搜索新朋友
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Message;
