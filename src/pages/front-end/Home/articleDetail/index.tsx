import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  Bookmark,
  Share2,
  MoreVertical,
  MessageCircle,
  CheckCircle2,
  Clock,
  SquareStack,
  Image as ImageIcon,
  Smile,
  ArrowUpDown,
} from "lucide-react";
import { Button, Mentions, message } from "antd";
import type { MentionsProps } from "antd/es/mentions";
import EmojiPicker from "@/components/EmojiPicker";
import "./mentions.css";

interface User {
  id: string;
  userName: string;
  userAvatar?: string;
  userProfile?: string;
  school?: string;
  direction?: string;
  userRole?: string;
  score?: number;
  scoreLevel?: number;
}

interface Record {
  id: string;
  content: string;
  category: string;
  tags?: string[];
  thumbNum: number;
  favourNum: number;
  commentNum: number;
  viewNum: number;
  hasThumb: boolean;
  hasFavour: boolean;
  user: User;
  createTime: number;
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    userName: string;
    userAvatar?: string;
  };
  createTime: number;
  thumbNum: number;
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Record | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sortType, setSortType] = useState<"all" | "hot" | "new" | "floor">(
    "all"
  );
  const [activeTab, setActiveTab] = useState<"comments" | "related">(
    "comments"
  );
  const [mentionUsers, setMentionUsers] = useState<
    MentionsProps["options"]
  >([]);
  const [mentionSearchText, setMentionSearchText] = useState("");
  // 记录用户通过组件选择的提及（用于验证）
  const [selectedMentions, setSelectedMentions] = useState<Set<string>>(
    new Set()
  );

  // 模拟可@的用户列表（实际应该从API获取）
  useEffect(() => {
    // 这里应该调用API获取可@的用户列表
    // 暂时使用模拟数据，包括文章作者和评论用户
    const mockUsers: MentionsProps["options"] = [
      { value: "123", label: "竹叶" },
      { value: "1232", label: "用户A" },
      { value: "sdfss", label: "智能助手" },
      { value: "sdf", label: "管理员" },
      { value: "ssfd", label: "开发者" },
      { value: "sdfsa", label: "测试用户" },
    ];
    setMentionUsers(mockUsers);
  }, []);

  // 根据搜索文本过滤用户列表
  const filteredMentionUsers = mentionSearchText
    ? (mentionUsers || []).filter((user) =>
        String(user?.value || "")
          .toLowerCase()
          .includes(mentionSearchText.toLowerCase())
      )
    : mentionUsers || [];

  // 获取所有有效的用户 value 和 label 映射（用于验证）
  const validUserValues = (mentionUsers || []).map(
    (user) => user?.value as string
  );
  const validUserLabels = (mentionUsers || []).map(
    (user) => user?.label as string
  );
  // 创建 value 到 label 的映射
  const valueToLabelMap = new Map(
    (mentionUsers || []).map((user) => [
      user?.value as string,
      user?.label as string,
    ])
  );
  // 创建 label 到 value 的映射
  const labelToValueMap = new Map(
    (mentionUsers || []).map((user) => [
      user?.label as string,
      user?.value as string,
    ])
  );

  // 验证评论内容中的 @ 提及是否都是通过组件选择的
  const validateMentions = (content: string): {
    isValid: boolean;
    invalidMentions: string[];
    validMentions: Array<{ value: string; label: string }>;
  } => {
    const mentionRegex = /@([\w\u4e00-\u9fa5]+)/g;
    const mentionedUsers: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentionedUsers.push(match[1]);
    }

    const validMentions: Array<{ value: string; label: string }> = [];
    const invalidMentions: string[] = [];

    mentionedUsers.forEach((mention) => {
      // 检查是否是通过组件选择的（在 selectedMentions 中）
      // 或者是否是有效的用户 label（作为备选方案）
      let isValid = false;
      let mentionValue = "";
      let mentionLabel = "";

      // 方法1：检查是否在已选择的提及中（最可靠）
      if (selectedMentions.has(mention)) {
        isValid = true;
        // 从映射中获取对应的 value 和 label
        if (validUserLabels.includes(mention)) {
          mentionValue = labelToValueMap.get(mention) || mention;
          mentionLabel = mention;
        } else if (validUserValues.includes(mention)) {
          mentionValue = mention;
          mentionLabel = valueToLabelMap.get(mention) || mention;
        }
      }
      // 方法2：检查是否是有效的用户 label（允许通过组件选择但未记录的情况）
      else if (validUserLabels.includes(mention)) {
        // 如果用户列表中有这个 label，认为是有效的（可能是通过组件选择的）
        isValid = true;
        mentionValue = labelToValueMap.get(mention) || mention;
        mentionLabel = mention;
      }
      // 方法3：检查是否是有效的用户 value
      else if (validUserValues.includes(mention)) {
        isValid = true;
        mentionValue = mention;
        mentionLabel = valueToLabelMap.get(mention) || mention;
      }

      if (isValid && mentionValue && mentionLabel) {
        validMentions.push({ value: mentionValue, label: mentionLabel });
      } else {
        // 既不在已选择列表中，也不是有效的用户，说明是手动输入的无效提及
        invalidMentions.push(mention);
      }
    });

    return {
      isValid: invalidMentions.length === 0,
      invalidMentions,
      validMentions,
    };
  };

  // 模拟获取文章数据
  useEffect(() => {
    // 这里应该根据 id 调用 API 获取文章详情
    // 暂时使用模拟数据
    const mockArticle: Record = {
      id: id || "",
      content: `Day 49

今天做了:
学习 MySQL 中 InnoDB 引擎的插入缓冲功能。
学习 Java 并发中的 ConcurrentHashMap.
学习其它并发知识。

明天计划:
继续学习 MySQL 中的 InnoDB 引擎。
学习 Java 并发知识

今日感悟:
永远对知识保持敬畏之心。`,
      category: "交流",
      tags: ["训练营打卡"],
      thumbNum: 3,
      favourNum: 1,
      commentNum: 1,
      viewNum: 12,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1839282799054090242",
        userName: "竹叶",
        userAvatar:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/DeicoSkvyuptklM7eam23NG8bqUEsB76qrNkew2a28Opb0Itia1WSticXuzxCSoOD2H8ONoI8N5z527U1GsUhenbs8y9FlCShMksKibT05vclSA/132",
        direction: "Java后端",
        userRole: "vip",
        score: 2867,
        scoreLevel: 6,
      },
      createTime: Date.now() - 2 * 60 * 60 * 1000,
    };
    setArticle(mockArticle);

    // 模拟评论数据
    const mockComments: Comment[] = [
      {
        id: "1",
        content: "很棒的学习记录！",
        user: {
          id: "2",
          userName: "用户A",
          userAvatar: "https://img.pawpaw18.cn/user-img/default-avatar.jpg",
        },
        createTime: Date.now() - 30 * 60 * 1000,
        thumbNum: 5,
      },
    ];
    setComments(mockComments);
  }, [id]);

  // 解析文章内容
  const parseContent = (content: string) => {
    const lines = content.split("\n");
    const sections: {
      type: "title" | "today" | "tomorrow" | "reflection" | "text";
      content: string[];
    }[] = [];

    let currentSection: {
      type: "title" | "today" | "tomorrow" | "reflection" | "text";
      content: string[];
    } | null = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("Day ")) {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "title", content: [trimmed] };
      } else if (
        trimmed.includes("今天做了:") ||
        trimmed.includes("今天做了：")
      ) {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "today", content: [] };
      } else if (
        trimmed.includes("明天计划:") ||
        trimmed.includes("明天计划：")
      ) {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "tomorrow", content: [] };
      } else if (
        trimmed.includes("今日感悟:") ||
        trimmed.includes("今日感悟：")
      ) {
        if (currentSection) sections.push(currentSection);
        currentSection = { type: "reflection", content: [] };
      } else if (trimmed && currentSection) {
        currentSection.content.push(trimmed);
      }
    });
    if (currentSection) sections.push(currentSection);

    return sections;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    const date = new Date(timestamp);
    return `${date.getMonth() + 1}-${date.getDate()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleThumb = () => {
    if (article) {
      setArticle({
        ...article,
        hasThumb: !article.hasThumb,
        thumbNum: article.hasThumb
          ? article.thumbNum - 1
          : article.thumbNum + 1,
      });
    }
  };

  const handleFavour = () => {
    if (article) {
      setArticle({
        ...article,
        hasFavour: !article.hasFavour,
        favourNum: article.hasFavour
          ? article.favourNum - 1
          : article.favourNum + 1,
      });
    }
  };

  // 解析评论内容，高亮 @ 的用户名
  const renderCommentContent = (content: string): ReactNode => {
    // 匹配 @ 用户名，支持中英文、数字、下划线等字符
    // 格式：@用户名 或 @用户名后面跟空格、标点等
    const mentionRegex = /@([\w\u4e00-\u9fa5]+)/g;
    const parts: (string | ReactNode)[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = mentionRegex.exec(content)) !== null) {
      // 添加 @ 之前的文本
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      // 添加高亮的 @ 用户名
      const username = match[1];
      parts.push(
        <span
          key={`mention-${keyIndex++}-${match.index}`}
          className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer"
        >
          @{username}
        </span>
      );
      lastIndex = mentionRegex.lastIndex;
    }

    // 添加剩余的文本
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : content;
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    // 验证 @ 提及的用户是否有效
    const validation = validateMentions(commentText);
    if (!validation.isValid) {
      message.warning(
        `以下用户提及无效，请通过 @ 选择用户：${validation.invalidMentions
          .map((m) => `@${m}`)
          .join(", ")}`
      );
      return;
    }

    // 收集所有 @ 的人员的 value 到数组中
    const mentionedUserValues = validation.validMentions.map((m) => m.value);

    console.log("收集到的评论内容:", commentText);
    console.log("所有 @ 的人员的 value 数组:", mentionedUserValues);
    console.log("所有 @ 的人员的详细信息:", validation.validMentions);

    // 这里应该调用 API 提交评论
    // 提交数据格式：
    // {
    //   content: commentText,  // 评论内容（包含 @label）
    //   mentionedUserIds: mentionedUserValues,  // @ 的人员的 value 数组
    // }
    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      user: {
        id: "current-user",
        userName: "我",
        userAvatar: "https://img.pawpaw18.cn/user-img/default-avatar.jpg",
      },
      createTime: Date.now(),
      thumbNum: 0,
    };
    setComments([...comments, newComment]);
    setCommentText("");
    // 清空已选择的提及记录
    setSelectedMentions(new Set());
    message.success("评论发布成功！");
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        加载中...
      </div>
    );
  }

  const contentSections = parseContent(article.content);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 主内容区 */}
          <div className="flex-1 min-w-0">
            {/* 文章内容 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
              {/* 用户信息 */}
              <div className="flex items-start gap-3 mb-6">
                <img
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  src={
                    article.user.userAvatar ||
                    "https://img.pawpaw18.cn/user-img/default-avatar.jpg"
                  }
                  alt={article.user.userName}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {article.user.userName}
                    </span>
                    {article.user.userRole === "vip" && (
                      <span className="px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full font-medium">
                        VIP
                      </span>
                    )}
                    {article.user.direction && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {article.user.direction}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    {formatTime(article.createTime)}
                  </div>
                </div>
              </div>

              {/* 文章内容 */}
              <div className="text-gray-800 dark:text-gray-200 mb-6">
                {contentSections.map((section, index) => (
                  <div key={index} className="mb-4">
                    {section.type === "title" && (
                      <h1 className="text-2xl font-bold mb-4">
                        {section.content[0]}
                      </h1>
                    )}
                    {section.type === "today" && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="font-semibold">今天做了:</span>
                        </div>
                        <div className="ml-7 space-y-1">
                          {section.content.map((line, i) => (
                            <div
                              key={i}
                              className="text-gray-600 dark:text-gray-400"
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.type === "tomorrow" && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                          <Clock className="w-5 h-5 text-red-500" />
                          <span className="font-semibold">明天计划:</span>
                        </div>
                        <div className="ml-7 space-y-1">
                          {section.content.map((line, i) => (
                            <div
                              key={i}
                              className="text-gray-600 dark:text-gray-400"
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.type === "reflection" && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                          <SquareStack className="w-5 h-5 text-blue-500" />
                          <span className="font-semibold">今日感悟:</span>
                        </div>
                        <div className="ml-7">
                          {section.content.map((line, i) => (
                            <div
                              key={i}
                              className="text-gray-600 dark:text-gray-400"
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex gap-2 mb-6">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 操作栏 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleThumb}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      article.hasThumb
                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <ThumbsUp
                      className={`w-5 h-5 ${
                        article.hasThumb ? "fill-current" : ""
                      }`}
                    />
                    <span>{article.thumbNum}</span>
                  </button>
                  <button
                    onClick={handleFavour}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      article.hasFavour
                        ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        article.hasFavour ? "fill-current" : ""
                      }`}
                    />
                    <span>{article.favourNum}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>分享</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                    <span>操作</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 评论区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* 标签页 */}
              <div className="flex items-center gap-4 mb-4 border-b border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeTab === "comments"
                      ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  评论
                </button>
                <button
                  onClick={() => setActiveTab("related")}
                  className={`pb-3 px-2 font-medium transition-colors ${
                    activeTab === "related"
                      ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  相关内容
                </button>
                <div className="flex-1"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {comments.length}个评论
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortType("all")}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      sortType === "all"
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    全部评论
                  </button>
                  <button
                    onClick={() => setSortType("hot")}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      sortType === "hot"
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    最热
                  </button>
                  <button
                    onClick={() => setSortType("new")}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      sortType === "new"
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    最新
                  </button>
                  <button
                    onClick={() => setSortType("floor")}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      sortType === "floor"
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    楼层
                  </button>
                </div>
              </div>

              {/* 评论输入框 */}
              <div className="mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    src="https://img.pawpaw18.cn/user-img/default-avatar.jpg"
                    alt="我的头像"
                  />
                  <div className="flex-1">
                    <Mentions
                      value={commentText}
                      onChange={(value) => setCommentText(value)}
                      placeholder="快来和大家讨论吧~ 输入 @ 可以提及用户"
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      className="mb-2 comment-mentions"
                      options={filteredMentionUsers}
                      prefix="@"
                      split=""
                      filterOption={false}
                      onSelect={(option) => {
                        // 当用户通过组件选择时，记录到 selectedMentions 中
                        // option.value 是用户ID，option.label 是显示名称
                        // Mentions 组件会插入 label 到文本中
                        const selectedLabel =
                          (option as { label?: string })?.label ||
                          (option as { value?: string })?.value ||
                          "";
                        if (selectedLabel) {
                          setSelectedMentions((prev) =>
                            new Set(prev).add(selectedLabel)
                          );
                          console.log("用户通过组件选择了:", selectedLabel);
                        }
                      }}
                      onSearch={(text) => {
                        // 更新搜索文本，触发用户列表过滤
                        setMentionSearchText(text);
                        // 这里也可以调用API动态搜索用户
                        // 例如：fetchUsers(text).then(setMentionUsers);
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                          <Smile className="w-4 h-4" />
                          <span className="text-sm">表情</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm">图片</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <ArrowUpDown className="w-4 h-4" />
                          <span className="text-sm">切换</span>
                        </button>
                      </div>
                      <Button
                        type="primary"
                        onClick={handleSubmitComment}
                        disabled={!commentText.trim()}
                      >
                        发布
                      </Button>
                    </div>
                    {showEmojiPicker && (
                      <div className="mt-2">
                        <EmojiPicker
                          onSelect={(emoji: string) => {
                            setCommentText((prev) => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 评论列表 */}
              {activeTab === "comments" && (
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      暂无评论，快来发表第一条评论吧~
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <img
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          src={
                            comment.user.userAvatar ||
                            "https://img.pawpaw18.cn/user-img/default-avatar.jpg"
                          }
                          alt={comment.user.userName}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {comment.user.userName}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {formatTime(comment.createTime)}
                            </span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 mb-2">
                            {renderCommentContent(comment.content)}
                          </div>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">
                                {comment.thumbNum}
                              </span>
                            </button>
                            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              回复
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "related" && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  暂无相关内容
                </div>
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* 热门话题 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  热门话题
                </h3>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                  更多&gt;
                </button>
              </div>
              <div className="space-y-2">
                {[
                  { name: "学习打卡", views: 2179 },
                  { name: "求职", views: 449 },
                  { name: "交流", views: 196 },
                  { name: "训练营打卡", views: 154 },
                  { name: "Java", views: 114 },
                  { name: "面经", views: 83 },
                  { name: "简历", views: 76 },
                  { name: "提问", views: 75 },
                  { name: "职场", views: 74 },
                  { name: "AI", views: 65 },
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      #{topic.name}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-3 h-3" />
                      <span>{topic.views}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 广告 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg shadow-sm p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">
                      MOCK INTERVIEW
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                      1v1 模拟面试
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    面多多 Offer多多
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    针对性预测面试题
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    详细复盘报告
                  </p>
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded">
                    新品限时福利
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
