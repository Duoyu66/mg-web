import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import {
  MessageCircle,
  MessageCircleMore,
  Eye,
  ThumbsUp,
  Bookmark,
  RefreshCcw,
} from "lucide-react";
import { Button, Skeleton, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import CommentInput from "@/components/mgInput";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-java";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

import { useGetPostList, Post, PostListResponse } from "./hooks/useGetPostList";

// https://img.pawpaw18.cn/user-img/987b1688d3754e4d88371c7f93bb5654.jpg
type MentionOption = {
  value: string;
  label?: string;
  realValue?: string;
};

import Aside from "./aside";
import VipIcon from "@/components/vipIcon";

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"recommend" | "follow">("recommend");

  const queryParams = useMemo(
    () =>
      activeTab === "recommend"
        ? { type: "recommend" }
        : { type: "follow" },
    [activeTab]
  );

  const queryKey = useMemo(
    () => ["/api/post/getAll", queryParams] as const,
    [queryParams]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetPostList(queryParams);

  // 跟踪哪个帖子的评论区域是展开的
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  // 每个帖子的评论内容
  const [commentTexts, setCommentTexts] = useState<Map<string, string>>(new Map());
  // 每个帖子的提及用户搜索文本
  const [mentionSearchTexts, setMentionSearchTexts] = useState<Map<string, string>>(new Map());
  // 每个帖子已选择的提及用户
  const [selectedMentions, setSelectedMentions] = useState<Map<string, Set<string>>>(new Map());

  // 模拟用户列表（实际应该从API获取）
  const mentionOptions: MentionOption[] = [
    { value: "user1", label: "用户1" },
    { value: "user2", label: "用户2" },
    { value: "user3", label: "用户3" },
  ];

  const records = useMemo(() => {
    return data?.pages.flatMap((page) => page.list || []) || [];
  }, [data]);

  // 格式化时间
  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    const time = date.getTime();
    const now = Date.now();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return `${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleRefresh = () => {
    refetch();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // 处理点赞
  const handleThumb = (id: string) => {
    queryClient.setQueryData<InfiniteData<PostListResponse>>(queryKey, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map(page => ({
          ...page,
          list: page.list.map(item => {
            if (item.id === id) {
              return {
                ...item,
                hasThumb: !item.hasThumb,
                likeCount: (item.hasThumb ? item.likeCount - 1 : item.likeCount + 1)
              };
            }
            return item;
          })
        }))
      };
    });
  };

  // 处理收藏
  const handleFavour = (id: string) => {
    queryClient.setQueryData<InfiniteData<PostListResponse>>(queryKey, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map(page => ({
          ...page,
          list: page.list.map(item => {
            if (item.id === id) {
              return {
                ...item,
                hasFavour: !item.hasFavour,
              };
            }
            return item;
          })
        }))
      };
    });
  };

  // 跟踪每个帖子是否展开
  const [expandedPosts, setExpandedPosts] = useState<Map<string, boolean>>(
    new Map()
  );
  // 跟踪每个帖子是否超过指定高度
  const [overflowsMap, setOverflowsMap] = useState<Map<string, boolean>>(
    new Map()
  );
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const MAX_CONTENT_HEIGHT = 300; // 最大显示高度
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, []);
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>(
      ".rich-text pre code"
    );
    blocks.forEach((block) => {
      const className = block.className || "";
      if (!/\blanguage-/.test(className)) {
        block.classList.add("language-java");
      }
      Prism.highlightElement(block);
    });
  }, [records]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 监听滚动，接近底部时自动加载
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        !isFetchingNextPage &&
        hasNextPage &&
        scrollTop + clientHeight >= scrollHeight - 200
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isFetchingNextPage, hasNextPage, loadMore]);

  // 检测内容是否超过指定高度
  useEffect(() => {
    const checkOverflow = () => {
      const newOverflowsMap = new Map<string, boolean>();
      contentRefs.current.forEach((ref, id) => {
        if (ref) {
          const actualHeight = ref.scrollHeight;
          newOverflowsMap.set(id, actualHeight > MAX_CONTENT_HEIGHT);
        }
      });
      setOverflowsMap(newOverflowsMap);
    };

    // 延迟检查，确保DOM已渲染
    const timer = setTimeout(checkOverflow, 100);
    checkOverflow();

    return () => clearTimeout(timer);
  }, [records]);


  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 pt-0">
        <div className="flex gap-6">
          {/* 主内容区 */}
          <div className="flex-1  bg-white min-w-0 ">
            <div
              className="sticky z-40 bg-gray-50 dark:bg-gray-900 pt-3"
              style={{
                top: "var(--app-header-height, 64px)",
                transition: "top 300ms"
              }}
            >
              <div
                className={`flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 rounded-tl-xl rounded-tr-xl transition-shadow duration-300 ${scrolled ? "shadow-[0_2px_6px_-1px_rgba(0,0,0,0.05)]" : ""
                  }`}
              >
                <div className="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("recommend")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === "recommend"
                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      }`}
                  >
                    推荐
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("follow")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === "follow"
                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      }`}
                  >
                    关注
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>刷新</span>
                </button>
              </div>
            </div>

            {/* 帖子列表 */}
            <div className="">
              {records.map((item, index) => {
                const frameIndex = index % 4;
                const frameClass = ' dark:border-gray-700'
                // frameIndex === 0
                //   ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_16px_rgba(59,130,246,0.6)] animate-pulse'
                //   : frameIndex === 1
                //   ? 'bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_14px_rgba(251,191,36,0.7)]'
                //   : frameIndex === 2
                //   ? 'bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 shadow-[0_0_14px_rgba(244,114,182,0.5)]'
                //   : 'bg-[conic-gradient(at_top,_#22c55e,_#0ea5e9,_#6366f1,_#22c55e)]';

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800  p-5 transition-shadow cursor-pointer"
                    onClick={() =>
                      navigate(`/front/articleDetail/${item.id}`, {
                        state: { article: item },
                      })
                    }
                  >
                    {/* 用户信息 */}
                    <div className="flex items-start gap-3 mb-4">
                      <Popover
                        placement="rightTop"
                        mouseEnterDelay={0.25}
                        mouseLeaveDelay={0.2}
                        arrow={false}
                        overlayInnerStyle={{ padding: 0 }}
                        overlayClassName="user-hover-card"
                        content={
                         <div className="w-80 bg-white z-1 dark:bg-gray-900 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="relative h-12 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500">
                           
                            </div>

                            <div className="relative z-99 bg-white pt-8 px-4 pb-3  z-10 mt-[-15px] rounded-tl-xl  rounded-tr-xl">
                             <div className="absolute z-1 flex justify-center items-center left-4 border p-1 top-[-20px] w-13 h-13 rounded-full border-[3px] border-white dark:border-gray-900 overflow-hidden bg-white dark:bg-gray-900">
                                <img
                                  className="w-10  h-10   rounded-full object-cover"
                                  src={item.avatar}
                                  alt={item.nickname}
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-semibold  text-gray-900 dark:text-gray-100 truncate flex items-center gap-1">
                                    <span
                                      style={
                                        item.vipType === 'svip'
                                          ? {
                                              color: 'transparent',
                                              backgroundImage:
                                                'linear-gradient(90deg, rgb(0, 215, 60) 0%, rgb(0, 194, 255) 33.3333%, rgb(234, 101, 148) 66.6667%, rgb(157, 59, 255) 100%)',
                                              display: 'inline-block',
                                              backgroundClip: 'text',
                                              WebkitBackgroundClip: 'text',
                                            }
                                          : undefined
                                      }
                                    >
                                      {item.nickname}
                                    </span>
                                    <VipIcon type={item.vipType || 'free'} />
                                    
                                  </span>
                                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                                    LV.1
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 grid grid-cols-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col gap-1">
                                  <span>粉丝</span>
                                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                    0
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1 border-l border-r border-gray-100 dark:border-gray-700">
                                  <span>帖子</span>
                                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                    0
                                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span>获赞</span>
                                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                    {item.likeCount ?? 0}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                                {item.school && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800">
                                    <span className="mr-1">📚</span>
                                    {item.school}
                                  </span>
                                )}
                                {item.signature && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 max-w-[9rem] truncate">
                                    <span className="mr-1">💼</span>
                                    {item.signature}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3 bg-white dark:bg-gray-900">
                              <Button
                                size="small"
                                className="flex-1 border-gray-300 dark:border-gray-700"
                              >
                                私信
                              </Button>
                              <Button
                                size="small"
                                type="primary"
                                className="flex-1 !rounded-full bg-emerald-500 hover:bg-emerald-600 border-none"
                              >
                                关注
                              </Button>
                            </div>
                          </div>
                        }
                      >
                        <div
                          className={`w-12 h-12 rounded-full p-[2px] flex-shrink-0 ${frameClass} cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/front/userProfile/${item.userId}`);
                          }}
                        >
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                            <img
                              className="w-10 h-10 rounded-full object-cover"
                              src={item.avatar}
                              alt={item.nickname}
                            />
                          </div>
                        </div>
                      </Popover>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-semibold flex items-center text-gray-900 dark:text-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/front/userProfile/${item.userId}`);
                            }}
                          >
                            <span
                              style={
                                item.vipType === 'svip'
                                  ? {
                                      color: 'transparent',
                                      backgroundImage:
                                        'linear-gradient(90deg, rgb(0, 215, 60) 0%, rgb(0, 194, 255) 33.3333%, rgb(234, 101, 148) 66.6667%, rgb(157, 59, 255) 100%)',
                                      display: 'inline-block',
                                      backgroundClip: 'text',
                                      WebkitBackgroundClip: 'text',
                                    }
                                  : undefined
                              }
                            >
                              {item.nickname}
                            </span>
                            <VipIcon type={item.vipType || 'free'} />
                          </span>
                          {item.school && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.school}
                            </span>
                          )}
                        </div>
                        {item.signature && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {item.signature}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2">
                          <span>{formatTime(item.createTime)}</span>
                          {item.ipAddress && (
                            <span>· IP属地：{item.ipAddress}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 标签 */}
                    {item.tags && item.tags?.length > 0 && (
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

                    {/* 标题 */}
                    {item.title &&
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {item.title}
                      </div>
                    }
                    {/* 内容 */}
                    <div className="mb-4 relative">
                      <div
                        ref={(el) => {
                          if (el) {
                            contentRefs.current.set(item.id, el);
                          } else {
                            contentRefs.current.delete(item.id);
                          }
                        }}
                        className={`rich-text text-gray-800 dark:text-gray-200 leading-relaxed transition-all duration-300 ${!expandedPosts.get(item.id) &&
                            overflowsMap.get(item.id)
                            ? "max-h-[300px] overflow-hidden"
                            : ""
                          }`}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      {!expandedPosts.get(item.id) &&
                        overflowsMap.get(item.id) && (
                          <div className="relative -mt-4">
                            {/* 模糊遮罩层 */}
                            <div
                              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none dark:hidden"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 1))",
                              }}
                            />
                            <div
                              className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none hidden dark:block"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(31, 41, 55, 0), rgba(31, 41, 55, 0.7), rgba(31, 41, 55, 1))",
                              }}
                            />
                            {/* 查看更多按钮 */}
                            <div className="relative pt-6 flex justify-center ">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newMap = new Map(expandedPosts);
                                  newMap.set(item.id, true);
                                  setExpandedPosts(newMap);
                                }}
                                className=" cursor-pointer text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                              >
                                查看更多
                              </button>
                            </div>
                          </div>
                        )}
                    </div>


                    {/* 操作栏 */}
                    <div
                      className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleThumb(item.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${item.hasThumb
                              ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                          <ThumbsUp
                            className={`w-4 h-4 ${item.hasThumb ? "fill-current" : ""
                              }`}
                          />
                          <span className="text-sm">{item.likeCount}</span>
                        </button>
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedComments);
                            if (newExpanded.has(item.id)) {
                              newExpanded.delete(item.id);
                            } else {
                              newExpanded.add(item.id);
                            }
                            setExpandedComments(newExpanded);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{item.commentCount}</span>
                        </button>
                        <button
                          onClick={() => handleFavour(item.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${item.hasFavour
                              ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${item.hasFavour ? "fill-current" : ""
                              }`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{item.view}</span>
                      </div>
                    </div>

                    {/* 评论区域 - 展开时显示 */}
                    {expandedComments.has(item.id) && (
                      <div
                        className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 评论列表标题 */}
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {item.commentCount} 个评论
                          </h4>
                          <div className="flex items-center gap-2">
                            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded">
                              全部评论
                            </button>
                            <button className="text-sm text-primary-600 dark:text-primary-400 px-2 py-1 rounded bg-primary-50 dark:bg-primary-900/30">
                              最热
                            </button>
                            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded">
                              最新
                            </button>
                          </div>
                        </div>

                        {/* 评论输入框 */}
                        <div className="mb-4">
                          <CommentInput
                            value={commentTexts.get(item.id) || ""}
                            onChange={(val) => {
                              const newTexts = new Map(commentTexts);
                              newTexts.set(item.id, val);
                              setCommentTexts(newTexts);
                            }}
                            onSubmit={() => {
                              const commentText = commentTexts.get(item.id) || "";
                              if (!commentText.trim()) {
                                return;
                              }
                              // TODO: 发送评论逻辑
                              console.log("发送评论", item.id, commentText);
                              // 清空评论内容
                              const newTexts = new Map(commentTexts);
                              newTexts.set(item.id, "");
                              setCommentTexts(newTexts);
                              // 清空已选择的提及
                              const newMentions = new Map(selectedMentions);
                              newMentions.set(item.id, new Set());
                              setSelectedMentions(newMentions);
                            }}
                            mentionUsers={mentionSearchTexts.get(item.id)
                              ? mentionOptions.filter((user) =>
                                (user.label || user.value)
                                  .toLowerCase()
                                  .includes(mentionSearchTexts.get(item.id)!.toLowerCase())
                              )
                              : []}
                            onSelectMention={(option) => {
                              const selectedLabel = option.label || option.value || "";
                              if (selectedLabel) {
                                const newMentions = new Map(selectedMentions);
                                const currentMentions = newMentions.get(item.id) || new Set<string>();
                                currentMentions.add(selectedLabel);
                                newMentions.set(item.id, currentMentions);
                                setSelectedMentions(newMentions);
                              }
                            }}
                            onSearchMention={(text) => {
                              const newSearchTexts = new Map(mentionSearchTexts);
                              newSearchTexts.set(item.id, text);
                              setMentionSearchTexts(newSearchTexts);
                            }}
                            placeholder="快来和大家讨论吧~ 输入 @ 可以提及用户"
                            isSubmitDisabled={!commentTexts.get(item.id)?.trim()}
                          />
                        </div>

                        {/* 评论列表 */}
                        <div className="space-y-4">
                          {item.commentCount > 0 ? (
                            // 示例评论
                            <div className="flex items-start gap-3">
                              <img
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                src="https://img.pawpaw18.cn/user-img/default-avatar.jpg"
                                alt="评论者头像"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                    用户昵称
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    今天 15:03
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                  这是一条示例评论内容...
                                </p>
                                <div className="flex items-center gap-4">
                                  <button className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-xs">0</span>
                                  </button>
                                  <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    回复
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                              暂无评论，快来抢沙发吧~
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 加载状态 / 没有更多 */}
              {(isFetchingNextPage || isLoading) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
                  <Skeleton
                    avatar={{ size: 48, shape: "circle" }}
                    title={{ width: "30%" }}
                    paragraph={{ rows: 3, width: ["100%", "80%", "60%"] }}
                    active
                  />
                </div>
              )}
              {!hasNextPage && records.length > 0 && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                  <span>暂时没有更多了</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Aside isLoading={isLoading} records={records} />
          </div>


        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              type="primary"
              className="!h-10 !rounded-full shadow-lg"
              icon={<MessageCircleMore className="w-4 h-4" />}
              onClick={() => navigate("/publishArticle")}
            >
              分享你的学习心得
            </Button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Home;
