import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  Clock,
  SquareStack,
} from "lucide-react";
import { message } from "antd";
import CommentInput from "@/components/mgInput";

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

// 解析HTML内容并生成目录（不更新状态，只返回结果）
const parseHtmlContent = (htmlContent: string) => {
  // 创建临时DOM来解析HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const tocItems: Array<{ id: string; text: string; level: number }> = [];
  
  // 查找所有标题标签 (h1-h6) 和加粗的段落（可能是标题）
  const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6, p strong");
  
  headings.forEach((heading, index) => {
    const tagName = heading.tagName.toLowerCase();
    let level = 1;
    
    if (tagName.startsWith("h")) {
      level = parseInt(tagName.charAt(1));
    } else if (tagName === "strong" && heading.parentElement?.tagName === "P") {
      // 加粗的段落作为二级标题
      level = 2;
    }
    
    const text = heading.textContent?.trim() || "";
    if (text) {
      const id = `heading-${index}`;
      heading.setAttribute("id", id);
      tocItems.push({ id, text, level });
    }
  });
  
  return { html: doc.body.innerHTML, toc: tocItems };
};

// 解析文章内容（兼容旧格式和HTML格式，不更新状态）
const parseContent = (content: string) => {
  // 检查是否是HTML格式
  if (content.includes("<p>") || content.includes("<h") || content.includes("<blockquote>")) {
    const parsedHtml = parseHtmlContent(content);
    return { type: "html", html: parsedHtml.html, toc: parsedHtml.toc };
  }
  
  // 旧格式解析
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

  return { type: "sections", sections, toc: [] };
};

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Record | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [sortType, setSortType] = useState<"all" | "hot" | "new" | "floor">(
    "all"
  );
  const [activeTab, setActiveTab] = useState<"comments" | "related">(
    "comments"
  );
  type MentionOption = {
    value: string;
    label?: string;
  };

  const [mentionUsers, setMentionUsers] = useState<MentionOption[]>([]);
  const [mentionSearchText, setMentionSearchText] = useState("");
  // 记录用户通过组件选择的提及（用于验证）
  const [selectedMentions, setSelectedMentions] = useState<Set<string>>(
    new Set()
  );
  // 目录相关
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeTocId, setActiveTocId] = useState<string>("");
  const commentsRef = useRef<HTMLDivElement>(null);

  // 模拟可@的用户列表（实际应该从API获取）
  useEffect(() => {
    // 这里应该调用API获取可@的用户列表
    // 暂时使用模拟数据，包括文章作者和评论用户
    // value 用于 Mentions 插入文本，所以用 label；真实 ID 用 realValue 存储
    const mockUsers: MentionOption[] = [
      { value: "123", label: "竹叶" },
      { value: "12322", label: "赵睿" },
      { value: "1232", label: "用户A" },
      { value: "sdfss", label: "智能助手" },
      { value: "sdf", label: "管理员" },
      { value: "ssfd", label: "开发者" },
      { value: "sdfsa", label: "测试用户" },
    ];
    setMentionUsers(mockUsers);
  }, []);

  const mentionOptions: MentionOption[] = (mentionUsers || []) as MentionOption[];

  const filteredMentionUsers = mentionSearchText
    ? mentionOptions.filter((user: MentionOption) => {
        const label = String(user?.label || user?.value || "");
        const displayValue = String(user?.value || "");
        const text = mentionSearchText.toLowerCase();
        return (
          label.toLowerCase().includes(text) ||
          displayValue.toLowerCase().includes(text)
        );
      })
    : mentionUsers || [];

  const extractValue = (user: MentionOption): string =>
    (user?.value as string) || "";
  const extractLabel = (user: MentionOption): string =>
    (user?.label as string) || (user?.value as string) || "";

  // 获取所有有效的用户 value(label)/realValue(id) 和 label 映射（用于验证与收集）
  const validUserValues = mentionOptions.map((user) => extractValue(user));
  const validUserLabels = mentionOptions.map((user) => extractLabel(user));
  const validUserValuesSet = new Set(validUserValues);
  const validUserLabelsSet = new Set(validUserLabels);
  // 创建 value(id) 到 label 的映射
  const valueToLabelMap = new Map<string, string>(
    mentionOptions.map((user) => [extractValue(user), extractLabel(user)])
  );
  // 创建 label 到 value(id) 的映射
  const labelToValueMap = new Map<string, string>(
    mentionOptions.map((user) => [extractLabel(user), extractValue(user)])
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
      content: `<h3>一、Websocket基础</h3>
<h4>连接建立流程:</h4>
<pre class="language-markup"><code>Client                      Server
  |                           |
  |------ HTTP Upgrade ------&gt;|  // 发起升级请求
  |                           |
  |&lt;---- 101 Switching -------|  // 服务器同意升级
  |                           |
  |&lt;===== WebSocket =========&gt;|  // 建立全双工连接</code></pre>
<h4>&nbsp;二、Spring WebSocket核心组件</h4>
<h5>1.WebSocketHandler</h5>
<pre class="language-java"><code>@Component
public class MessageWebSocketHandler extends TextWebSocketHandler {
    // 连接建立时
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getUserId(session);
        sessions.put(userId, session);
    }
    
    // 处理消息
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // 处理接收到的消息
    }
    
    // 连接关闭时
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(getUserId(session));
    }
}
</code></pre>
<h5>2.WebSocketConfigurer</h5>
<pre class="language-java"><code>@Component
public class MessageWebSocketHandler extends TextWebSocketHandler {
    // 连接建立时
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userId = getUserId(session);
        sessions.put(userId, session);
    }
    
    // 处理消息
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // 处理接收到的消息
    }
    
    // 连接关闭时
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(getUserId(session));
    }
}
</code></pre>
<h3>三、会话管理</h3>
<h4>Session存储</h4>
<pre class="language-java"><code>public class MessageWebSocketHandler {
    // 使用线程安全的Map存储会话
    private final Map&lt;String, WebSocketSession&gt; sessions = 
        new ConcurrentHashMap&lt;&gt;();
        
    // 发送消息
    public void sendMessage(String userId, String message) {
        WebSocketSession session = sessions.get(userId);
        if (session != null &amp;&amp; session.isOpen()) {
            session.sendMessage(new TextMessage(message));
        }
    }
}
</code></pre>
<h4>心跳检测</h4>
<pre class="language-java"><code>@Configuration
public class WebSocketConfig {
    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {
        ServletServerContainerFactoryBean container = 
            new ServletServerContainerFactoryBean();
        // 设置消息大小限制
        container.setMaxTextMessageBufferSize(8192);
        // 设置心跳超时时间
        container.setMaxSessionIdleTimeout(60000L);
        return container;
    }
}
</code></pre>
<h3>&nbsp;四、消息类型</h3>
<h4>1.TextMessage</h4>
<pre class="language-java"><code>// 发送文本消息
session.sendMessage(new TextMessage("Hello"));

// 接收文本消息
@Override
protected void handleTextMessage(WebSocketSession session, 
                               TextMessage message) {
    String payload = message.getPayload();
}
</code></pre>
<h4>2.BinaryMessage</h4>
<h4>&nbsp;</h4>
<pre class="language-java"><code>// 发送二进制消息
byte[] bytes = ...;
session.sendMessage(new BinaryMessage(bytes));

// 接收二进制消息
@Override
protected void handleBinaryMessage(WebSocketSession session, 
                                 BinaryMessage message) {
    byte[] payload = message.getPayload().array();
}
</code></pre>
<h3>五、安全处理</h3>
<h4>握手拦截</h4>
<pre class="language-java"><code>public class WebSocketInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(...) {
        // 验证token
        String token = request.getHeaders().get("token").get(0);
        if (!isValidToken(token)) {
            return false; // 拒绝连接
        }
        return true;
    }
}
</code></pre>
<h4>异常处理</h4>
<pre class="language-java"><code>@Override
public void handleTransportError(WebSocketSession session, 
                               Throwable exception) {
    log.error("WebSocket传输错误", exception);
    if (session.isOpen()) {
        session.close();
    }
}
</code></pre>
<h3>六、lSTOMP支持</h3>
<h4>Spring也支持STOMP协议</h4>
<pre class="language-java"><code>@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");  // 广播消息前缀
        config.setApplicationDestinationPrefixes("/app"); // 应用前缀
    }
}
</code></pre>
<h3>七、最佳实践</h3>
<h4>错误处理</h4>
<pre class="language-java"><code>try {
    session.sendMessage(new TextMessage(message));
} catch (IOException e) {
    log.error("发送消息失败", e);
    sessions.remove(userId);
}
</code></pre>
<h4>消息序列化</h4>
<pre class="language-java"><code>// 发送JSON消息
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(messageObject);
session.sendMessage(new TextMessage(json));
</code></pre>
<h4>连接状态检查</h4>
<pre class="language-java"><code>public void sendMessage(String userId, String message) {
    WebSocketSession session = sessions.get(userId);
    if (session != null &amp;&amp; session.isOpen()) {
        try {
            session.sendMessage(new TextMessage(message));
        } catch (IOException e) {
            log.error("发送失败", e);
            closeSession(session);
        }
    }
}
</code></pre>
<p>PS:这些是Spring WebSocket的主要知识点，在实际应用中要根据具体需求选择合适的实现方式。</p>`,
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

  // 使用useMemo缓存解析结果，避免重复解析和无限循环
  const parsedContent = useMemo(() => {
    if (!article?.content) return null;
    return parseContent(article.content);
  }, [article?.content]);

  // 解析文章内容并更新目录（只在解析结果变化时执行）
  useEffect(() => {
    if (parsedContent?.toc && parsedContent.toc.length > 0) {
      setToc(parsedContent.toc);
    } else {
      setToc([]);
    }
  }, [parsedContent?.toc]);

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


  // 滚动到评论区域
  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // 预留顶部空间
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveTocId(id);
    }
  };

  // 监听滚动，更新当前激活的目录项
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // 偏移量
      
      // 检查每个标题位置
      for (let i = toc.length - 1; i >= 0; i--) {
        const element = document.getElementById(toc[i].id);
        if (element) {
          const elementTop = element.offsetTop;
          if (scrollPosition >= elementTop) {
            setActiveTocId(toc[i].id);
            break;
          }
        }
      }
    };

    if (toc.length > 0) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [toc]);

  // 解析评论内容，只高亮有效的 @ 用户名
  const renderCommentContent = (content: string): ReactNode => {
    // 匹配 @ 用户名，支持中英文、数字、下划线等字符
    // 格式：@用户名 或 @用户名后面跟其他字符
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
      
      const matchedText = match[1];
      let foundUsername = "";
      let usernameEndIndex = match.index + 1 + matchedText.length;

      // 尝试找到最长的有效用户名匹配
      // 例如：如果内容是 "@竹叶你好"，而用户列表中有 "竹叶"
      // 我们应该只匹配 "竹叶" 而不是 "竹叶你好"
      for (let i = matchedText.length; i > 0; i--) {
        const candidate = matchedText.slice(0, i);
        const isValidMention =
          selectedMentions.has(candidate) ||
          validUserLabelsSet.has(candidate) ||
          validUserValuesSet.has(candidate) ||
          labelToValueMap.has(candidate) ||
          valueToLabelMap.has(candidate);

        if (isValidMention) {
          foundUsername = candidate;
          usernameEndIndex = match.index + 1 + candidate.length;
          break;
        }
      }

      if (foundUsername) {
        // 找到有效的 @ 提及，高亮显示
        parts.push(
          <span
            key={`mention-${keyIndex++}-${match.index}`}
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer"
          >
            @{foundUsername}
          </span>
        );
        // 如果匹配的文本比找到的用户名长，说明后面还有字符，需要作为普通文本添加
        if (matchedText.length > foundUsername.length) {
          const remainingText = matchedText.slice(foundUsername.length);
          parts.push(remainingText);
          lastIndex = match.index + 1 + matchedText.length;
        } else {
          lastIndex = usernameEndIndex;
        }
      } else {
        // 无效的 @ 提及当作普通文本显示
        parts.push(`@${matchedText}`);
        lastIndex = mentionRegex.lastIndex;
      }
    }

    // 添加剩余的文本
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : content;
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    // 验证 @ 提及的用户，收集有效的 @ 提及（不阻断流程）
    const validation = validateMentions(commentText);
    
    // 收集所有有效的 @ 的人员的 value 到数组中（无效的会被忽略）
  const mentionedUserValues = validation.validMentions.map(
    (m) => labelToValueMap.get(m.value) || m.value
  );

    console.log("收集到的评论内容:", commentText);
    console.log("所有有效的 @ 的人员的 value 数组:", mentionedUserValues);
    console.log("所有有效的 @ 的人员的详细信息:", validation.validMentions);
    if (validation.invalidMentions.length > 0) {
      console.log("无效的 @ 提及（将作为普通文本处理）:", validation.invalidMentions);
    }

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

  if (!article || !parsedContent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        加载中...
      </div>
    );
  }

  // 左侧操作栏组件 - 定位在内容区域左侧外，距离内容区域左边约2rem
  const LeftActionBar = () => (
    <div 
      className="fixed top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-4"
      style={{ 
        left: 'clamp(1rem, calc((100vw - 80rem) / 2 - 2rem), calc(50vw - 40rem - 2rem))'
      }}
    >
      <button
        onClick={handleThumb}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
          article.hasThumb
            ? "bg-primary-600 text-white"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30"
        }`}
        title="点赞"
      >
        <ThumbsUp
          className={`w-5 h-5 ${
            article.hasThumb ? "fill-current" : ""
          }`}
        />
      </button>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        {article.thumbNum}
      </div>
      <button
        onClick={scrollToComments}
        className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 flex items-center justify-center transition-all shadow-lg"
        title="评论"
      >
        <MessageCircle className="w-5 h-5" />
      </button>
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        {article.commentNum}
      </div>
    </div>
  );

  // 右侧目录组件 - 定位在内容区域右侧外，与侧边栏占位对齐
  const RightToc = () => {
    if (toc.length === 0) return null;
    
    // 计算位置：主容器 max-w-7xl (80rem) 居中，目录应该在内容区域右侧外
    // 主容器右边距 = (100vw - 80rem) / 2
    // 目录应该在主容器右侧外，距离主容器右边约 1rem
    const getRightPosition = () => {
      if (typeof window === 'undefined') return '1rem';
      const viewportWidth = window.innerWidth;
      const maxContentWidth = 1280; // 80rem = 1280px
      const rightPadding = 16; // 1rem = 16px (主容器的右边padding)
      
      if (viewportWidth <= maxContentWidth) {
        // 小屏幕时，目录紧贴视口右边，减去右边padding
        return `${rightPadding}px`;
      }
      
      // 大屏幕时，计算内容区域右边界的位置
      // 主容器居中后的左边距 = (100vw - 1280px) / 2
      // 内容区域右边界 = 左边距 + 1280px - 16px (右边padding)
      // 目录的 right = 视口宽度 - 内容区域右边界
      const leftMargin = (viewportWidth - maxContentWidth) / 2;
      const contentRightEdge = leftMargin + maxContentWidth - rightPadding;
      const rightPosition = viewportWidth - contentRightEdge;
      
      return `${rightPosition}px`;
    };

    return (
      <div 
        className="fixed top-16 z-[9998] w-80"
        style={{ 
          right: getRightPosition()
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            目录
          </h3>
          <div className="space-y-1">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeTocId === item.id
                    ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border-l-2 border-primary-600 dark:border-primary-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 使用 Portal 将 fixed 元素渲染到 body，避免受父容器 transform 影响 */}
      {typeof document !== 'undefined' && createPortal(<LeftActionBar />, document.body)}
      {typeof document !== 'undefined' && createPortal(<RightToc />, document.body)}

      {/* 主容器 */}
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
              <div className="text-gray-800 dark:text-gray-200 mb-6 prose prose-gray dark:prose-invert max-w-none">
                {parsedContent.type === "html" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: parsedContent.html || "" }}
                    className="article-content"
                  />
                ) : (
                  parsedContent.sections?.map((section, index) => (
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
                  ))
                )}
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

            </div>

            {/* 评论区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6" ref={commentsRef}>
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
                <CommentInput
                  value={commentText}
                  onChange={(val) => setCommentText(val)}
                  onSubmit={handleSubmitComment}
                  mentionUsers={filteredMentionUsers}
                  onSelectMention={(option) => {
                    // option.value 是真实ID，option.label 是显示名称
                    const selectedLabel = option.label || option.value || "";
                    if (selectedLabel) {
                      setSelectedMentions((prev) => new Set(prev).add(selectedLabel));
                      console.log("用户通过组件选择了:", selectedLabel, "真实ID:", option.value);
                    }
                  }}
                  onSearchMention={(text) => {
                    setMentionSearchText(text);
                  }}
                  isSubmitDisabled={!commentText.trim()}
                  avatarUrl="https://img.pawpaw18.cn/user-img/default-avatar.jpg"
                />
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

          {/* 侧边栏占位 - 保持布局 */}
          <div className="w-80 flex-shrink-0"></div>
        </div>
        </div>
      </div>
    </>
  );
}