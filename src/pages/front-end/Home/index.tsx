import { useEffect, useState, useCallback } from "react";
import {
  MessageCircle,
  MessageCircleMore,
  Eye,
  ThumbsUp,
  Bookmark,
} from "lucide-react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

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

interface BestComment {
  id: string;
  plainTextDescription: string;
  user: {
    id: string;
    userName: string;
  };
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
  bestComment?: BestComment;
  createTime: number;
}
// https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg
const Home = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([
    {
      id: "1998194863023136770",
      content: "day20\n时间飞快，加油加油",
      category: "交流",
      thumbNum: 1,
      favourNum: 0,
      commentNum: 0,
      viewNum: 2,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1991159903175094274",
        userName: "一百天冲刺春招",
        userAvatar:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/Q3auHgzwzM6odzChK7V31kTgSGrVu1o8UTB1oJPoPdY8V7RCsXstOOEQ8z3ymYX77XsfpBGONkFu95gticRjwFQ/132",
        userProfile: "关注我，监督我，一起进步",
        score: 229,
        scoreLevel: 3,
        userRole: "user",
      },
      createTime: 1765241754000,
    },
    {
      id: "1998102222889623554",
      content:
        "DAY3\nlist1.recite 50 English words\nlist2.learn C and game\nlist3.learning stm32 more！\nlisr4.learing advanced math\nlist5.English grammer",
      category: "交流",
      tags: ["学习打卡"],
      thumbNum: 3,
      favourNum: 1,
      commentNum: 1,
      viewNum: 16,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1997480094800642049",
        userName: "鱼友6628",
        school: "中北大学",
        direction: "游戏开发",
        score: 37,
        scoreLevel: 2,
        userRole: "user",
      },
      bestComment: {
        id: "1998104797064011777",
        plainTextDescription:
          "连续三天坚持学习计划真不容易！看到你覆盖了这么多领域，这种多元化的努力特别值得点赞，继续突破自己吧！",
        user: {
          id: "1983770924322050049",
          userName: "加油鸭",
        },
      },
      createTime: 1765219667000,
    },
    {
      id: "1998085888336273409",
      content:
        "Day 306\n✅ 今天做了：\n1. 单词打卡400。\n2.memento设计模式课后习题。\n⏰ 明天计划：\n📚 今日感悟：\n今日完成的任务有点少，还需加油，卡在关于深浅拷贝那了，mementor角色关于向originator提供的引用类型不能直接返回引用而因该返回clone对象，涉及深浅拷贝需要了解一下。\n做好自己的事情，无意义的事情少做。",
      category: "交流",
      tags: ["学习打卡"],
      thumbNum: 2,
      favourNum: 1,
      commentNum: 1,
      viewNum: 12,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1839282799054090242",
        userName: "丘陵",
        userAvatar:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/DeicoSkvyuptklM7eam23NG8bqUEsB76qrNkew2a28Opb0Itia1WSticXuzxCSoOD2H8ONoI8N5z527U1GsUhenbs8y9FlCShMksKibT05vclSA/132",
        userProfile: "越努力，越幸运。",
        school: "南昌交通学院",
        direction: "Java后端",
        score: 2867,
        scoreLevel: 6,
        userRole: "vip",
      },
      bestComment: {
        id: "1998088549701853185",
        plainTextDescription:
          "坚持306天打卡真的超有毅力！400单词+设计模式练习已经很棒了，深浅拷贝的问题明天一定能突破~",
        user: {
          id: "1983770924322050049",
          userName: "加油鸭",
        },
      },
      createTime: 1765215773000,
    },
    {
      id: "1998060759539589122",
      content:
        "Day 7\n10:21 - 11:46 计算机网络笔记（运输层） \n12:52 - 13:17 操作系统学习",
      category: "交流",
      tags: ["训练营打卡"],
      thumbNum: 1,
      favourNum: 0,
      commentNum: 0,
      viewNum: 9,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1840054904554328066",
        userName: "pilrin",
        userAvatar:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELD6L7XVn7BaCKO0gNlzbbiazOcUiaqJsWMwSKREFQx8jO2kUYSDcOoKl0l3Jia18qdIFiatTgiaKrXHumex7du04xYLsz2F4QA2wjBmkZyP92CwqA/132",
        score: 370,
        scoreLevel: 3,
        userRole: "vip",
      },
      createTime: 1765209781000,
    },
    {
      id: "1998059211153547266",
      content:
        "Day 40\n✅ 今天做了：\n1. 面试题√\n2. Java技术核心卷1√\n3. 智能云图库√\n4. 运动减肥√\n\n⏰ 明天计划：\n1. 智能云图库\n2. Java技术核心卷1\n3. 面试题\n4. 运动减肥",
      category: "交流",
      tags: ["学习打卡"],
      thumbNum: 2,
      favourNum: 1,
      commentNum: 1,
      viewNum: 17,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1877283446951194625",
        userName: "X",
        userAvatar:
          "https://pic.code-nav.cn/user_avatar/1877283446951194625/eTtCcXg86gMlgyR0.webp",
        school: "宁波大学科学技术学院",
        direction: "Java后端",
        score: 521,
        scoreLevel: 4,
        userRole: "vip",
      },
      bestComment: {
        id: "1998062869849120769",
        plainTextDescription:
          "40天的坚持太棒了！每天进步一点点，技术、健康和面试准备都在稳步推进，为你点赞！",
        user: {
          id: "1983770924322050049",
          userName: "加油鸭",
        },
      },
      createTime: 1765209412000,
    },
    {
      id: "1998056457903349761",
      content:
        "Day 8\n✅ 今天做了：\n力扣：\n53. 最大子数组和 - 寻找具有最大和的连续子数组\n11. 盛最多水的容器 - 使用双指针处理数组\n283. 移动零 - 保持相对顺序将所有零移到末尾\n88. 合并两个有序数组 - 原地合并两个有序数组\n14. 最长公共前缀\n复习Java集合\n⏰ 明天计划：\n复习队列和数组\n复习Java并发\n📚 今日感悟：",
      category: "交流",
      tags: ["训练营打卡"],
      thumbNum: 2,
      favourNum: 1,
      commentNum: 1,
      viewNum: 12,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1824705191980900354",
        userName: "Boring",
        score: 183,
        scoreLevel: 2,
        userRole: "vip",
      },
      bestComment: {
        id: "1998059961850077186",
        plainTextDescription:
          "坚持刷题第8天啦！看到你攻克了这么多经典题目，还认真复习Java知识，这份自律真的很棒。继续保持这种节奏，进步会越来越明显！",
        user: {
          id: "1983770924322050049",
          userName: "加油鸭",
        },
      },
      createTime: 1765208756000,
    },
    {
      id: "1998044787046948865",
      content:
        "Day 53\n✅ 今天做了：\n1、学习 Java 并发，包括相关并发类，展开学习了CompletableFuture\n2、学习了 MySQL InnoDB 引擎的特点：插入缓冲、两次写、自适应哈希索引、异步 IO、临近页刷新等内容\n\n⏰ 明天计划：\n1、继续学习 Java 并发知识\n2、开始学习 InnoDB 中的文件相关知识\n\n📚 今日感悟：\n目前在技术学习中，对知识的分类，有两种感触较深的区分。\n一种是基础知识类的。例如 MySQL 里面的各种细节，MyBatis 源码里面的各种实现，Java 并发的底层实现等。\n一种是思想类的。例如《代码整洁之道》，《整洁架构之道》 这种书，也包括设计模式这种知识。\n\n前者会略微枯燥，但是学完后很踏实，是较为重要的基础。\n后者学起来会更有意思，但是需要足够的实践经验，才能够真正内化，否则学完总感觉有点心虚。\n\n当然，无论如何，知识都不是一遍就能学会的，都要反复看，积攒实践经验后再回过头来看才能越学越深。\n正所谓'学而时习之，不亦说乎？'，掌握了方法，并且有足够的兴趣，那的确是很快乐的。",
      category: "交流",
      tags: ["训练营打卡"],
      thumbNum: 4,
      favourNum: 1,
      commentNum: 1,
      viewNum: 21,
      hasThumb: false,
      hasFavour: false,
      user: {
        id: "1977293509899653121",
        userName: "竹叶",
        userAvatar:
          "https://thirdwx.qlogo.cn/mmopen/vi_32/SALWIf8deQ75T8PXFaQol6OS6eIxDvnGgkqWy9rAtjJcExCzGyNcJhFMSWh2ZoJ29OHHDD6e5tqNjHE2qMvbfg/132",
        userProfile: "真正的大师，永远怀着一颗学徒的心",
        school: "老鱼大学",
        direction: "Java后端",
        score: 520,
        scoreLevel: 4,
        userRole: "vip",
      },
      bestComment: {
        id: "1998048394710425602",
        plainTextDescription:
          "每天坚持学习这么多干货真不容易！你对知识的分类和思考很深刻，这种持续积累的态度一定会带来质的飞跃~",
        user: {
          id: "1983770924322050049",
          userName: "加油鸭",
        },
      },
      createTime: 1765205973000,
    },
  ]);

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

  // 处理点赞
  const handleThumb = (id: string) => {
    setRecords(
      records.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            hasThumb: !item.hasThumb,
            thumbNum: item.hasThumb ? item.thumbNum - 1 : item.thumbNum + 1,
          };
        }
        return item;
      })
    );
  };

  // 处理收藏
  const handleFavour = (id: string) => {
    setRecords(
      records.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            hasFavour: !item.hasFavour,
            favourNum: item.hasFavour ? item.favourNum - 1 : item.favourNum + 1,
          };
        }
        return item;
      })
    );
  };

  // 处理内容换行
  const formatContent = (content: string) => {
    return content.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 模拟接口获取更多帖子
  const fetchMoreRecords = async (nextPage: number) => {
    // 模拟接口耗时
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 只模拟 3 页数据，之后为空
    if (nextPage > 3) {
      return [];
    }

    const now = Date.now();
    return Array.from({ length: 5 }).map((_, idx) => ({
      id: `${nextPage}-${idx}-${now}`,
      content: `虚拟帖子第 ${nextPage} 页，第 ${
        idx + 1
      } 条\n这是模拟加载的内容。`,
      category: "交流",
      tags: idx % 2 === 0 ? ["学习打卡"] : [],
      thumbNum: Math.floor(Math.random() * 20),
      favourNum: Math.floor(Math.random() * 10),
      commentNum: Math.floor(Math.random() * 5),
      viewNum: Math.floor(Math.random() * 100),
      hasThumb: false,
      hasFavour: false,
      user: {
        id: `mock-user-${idx}`,
        userName: `虚拟用户${idx + 1}`,
        userAvatar:
          "https://img.pawpaw18.cn/user-img/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.svg",
        userProfile: "这里是虚拟数据",
        userRole: idx % 3 === 0 ? "vip" : "user",
      },
      bestComment:
        idx % 2 === 0
          ? {
              id: `mock-comment-${idx}`,
              plainTextDescription:
                "这是一个示例最佳评论，用于演示虚拟列表加载。",
              user: { id: "bot", userName: "智能助手" },
            }
          : undefined,
      createTime: now - idx * 1000 * 60,
    }));
  };

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const list = await fetchMoreRecords(nextPage);
    if (list.length === 0) {
      setHasMore(false);
    } else {
      setRecords((prev) => [...prev, ...list]);
      setPage(nextPage);
    }
    setLoadingMore(false);
  }, [loadingMore, hasMore, page]);

  // 监听滚动，接近底部时自动加载
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        !loadingMore &&
        hasMore &&
        scrollTop + clientHeight >= scrollHeight - 200
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loadingMore, hasMore, loadMore]);

  // 初始加载时确保有数据
  useEffect(() => {
    if (records.length === 0) {
      loadMore();
    }
  }, [records.length, loadMore]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* 主内容区 */}
          <div className="flex-1 min-w-0">
            {/* 发布区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                  我
                </div>
                <Button
                  type="primary"
                  className="flex-1 !h-10 !rounded-full"
                  onClick={() => console.log("发布")}
                >
                  分享你的学习心得...
                </Button>
              </div>
            </div>

            {/* 帖子列表 */}
            <div className="space-y-4">
              {records.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/front/articleDetail/${item.id}`)}
                >
                  {/* 用户信息 */}
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      src={item.user.userAvatar}
                      alt={item.user.userName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.user.userName}
                        </span>
                        {item.user.userRole !== "vip" && (
                          <span className="px-2 py-0.5 text-xs bg-gradient-primary text-white rounded-full">
                            VIP
                          </span>
                        )}
                        {item.user.school && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.user.school}
                          </span>
                        )}
                      </div>
                      {item.user.userProfile && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {item.user.userProfile}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatTime(item.createTime)}
                      </div>
                    </div>
                  </div>

                  {/* 标签 */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 内容 */}
                  <div className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap leading-relaxed">
                    {formatContent(item.content)}
                  </div>

                  {/* 最佳评论 */}
                  {item.bestComment && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 border-l-4 border-primary-500">
                      <div className="flex flex-wrap items-center gap-1">
                        <MessageCircleMore
                          size={14}
                          className="w-4 h-4 text-gray-500  inline-block"
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          木小瓜智能助手：
                        </span>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {item.bestComment.plainTextDescription}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 操作栏 */}
                  <div
                    className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleThumb(item.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                          item.hasThumb
                            ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${
                            item.hasThumb ? "fill-current" : ""
                          }`}
                        />
                        <span className="text-sm">{item.thumbNum}</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{item.commentNum}</span>
                      </button>
                      <button
                        onClick={() => handleFavour(item.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                          item.hasFavour
                            ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            item.hasFavour ? "fill-current" : ""
                          }`}
                        />
                        <span className="text-sm">{item.favourNum}</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{item.viewNum}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* 加载状态 / 没有更多 */}
              <div className="text-center text-sm text-gray-500 py-4">
                {loadingMore && hasMore && <span>加载中...</span>}
                {!hasMore && <span>暂时没有更多了</span>}
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* 热门话题 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                热门话题
              </h3>
              <div className="space-y-2">
                {[
                  "学习打卡",
                  "训练营打卡",
                  "Java后端",
                  "算法刷题",
                  "求职面试",
                ].map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      #{topic}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 1000)}+
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 推荐用户 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                推荐关注
              </h3>
              <div className="space-y-3">
                {records.slice(0, 3).map((item) => (
                  <div key={item.user.id} className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={item.user.userAvatar}
                      alt={item.user.userName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {item.user.userName}
                      </div>
                      {item.user.userProfile && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.user.userProfile}
                        </div>
                      )}
                    </div>
                    <Button
                      size="small"
                      type="primary"
                      className="!rounded-full"
                    >
                      关注
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* 统计信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                社区数据
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>今日发帖</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    1,234
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>在线用户</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    5,678
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>总用户数</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    12,345
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
