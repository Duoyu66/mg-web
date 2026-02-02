import { useState, useMemo } from "react";
import { Input, Button, Tag, Badge, Empty, Segmented } from "antd";
import { Search, ThumbsUp, Play, FileText, Sparkles, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  tag: string;
  difficulty: "简单" | "中等" | "困难";
  isMustSolve: boolean;
}

interface Topic {
  name: string;
  count: number;
}

// 算法主题列表（移到组件外部）
const topics: Topic[] = [
    { name: "必刷题", count: 16 },
    { name: "前端(JS/TS)", count: 1 },
    { name: "栈", count: 1 },
    { name: "二叉树", count: 2 },
    { name: "最小生成树", count: 1 },
    { name: "哈希表", count: 1 },
    { name: "字符串", count: 2 },
    { name: "数组", count: 2 },
    { name: "双向链表", count: 1 },
    { name: "计数排序", count: 1 },
    { name: "后缀数组", count: 1 },
    { name: "概率与统计", count: 1 },
    { name: "滚动哈希", count: 1 },
    { name: "归并排序", count: 1 },
    { name: "单调队列", count: 1 },
    { name: "脑筋急转弯", count: 1 },
    { name: "队列", count: 1 },
    { name: "最短路", count: 1 },
    { name: "字符串匹配", count: 1 },
    { name: "拓扑排序", count: 1 },
    { name: "递归", count: 3 },
    { name: "数论", count: 1 },
    { name: "分治", count: 1 },
    { name: "字典树", count: 1 },
    { name: "并查集", count: 1 },
    { name: "有序集合", count: 1 },
    { name: "单调栈", count: 1 },
    { name: "枚举", count: 1 },
    { name: "计数", count: 1 },
    { name: "链表", count: 2 },
    { name: "回溯", count: 4 },
    { name: "滑动窗口", count: 2 },
    { name: "堆(优先队列)", count: 1 },
    { name: "图", count: 1 },
    { name: "模拟", count: 1 },
    { name: "前缀和", count: 1 },
    { name: "广度优先搜索", count: 2 },
    { name: "双指针", count: 1 },
    { name: "位运算", count: 2 },
    { name: "矩阵", count: 1 },
    { name: "贪心", count: 1 },
    { name: "树", count: 1 },
    { name: "二分查找", count: 2 },
    { name: "深度优先搜索", count: 1 },
    { name: "快速选择", count: 1 },
    { name: "排序", count: 1 },
    { name: "数学", count: 1 },
    { name: "扫描线", count: 1 },
    { name: "设计", count: 1 },
    { name: "随机化", count: 1 },
    { name: "数据流", count: 1 },
    { name: "博弈", count: 1 },
    { name: "动态规划", count: 6 },
];

// 题目列表数据（移到组件外部）
const problems: Problem[] = [
    {
      id: "1",
      title: "完全平方数",
      tag: "动态规划",
      difficulty: "中等",
      isMustSolve: false,
    },
    {
      id: "2",
      title: "采药",
      tag: "动态规划",
      difficulty: "简单",
      isMustSolve: true,
    },
    {
      id: "3",
      title: "乘积最大子数组",
      tag: "动态规划",
      difficulty: "简单",
      isMustSolve: false,
    },
    {
      id: "4",
      title: "打家劫舍",
      tag: "动态规划",
      difficulty: "简单",
      isMustSolve: false,
    },
    {
      id: "5",
      title: "不同路径",
      tag: "动态规划",
      difficulty: "简单",
      isMustSolve: true,
    },
    {
      id: "6",
      title: "爬楼梯",
      tag: "动态规划",
      difficulty: "简单",
      isMustSolve: false,
    },
];

const Algorithm = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("动态规划");
  const [viewFilter, setViewFilter] = useState<"all" | "must">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"全部" | "简单" | "中等" | "困难">("全部");
  const navigate = useNavigate();

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesTopic = problem.tag === selectedTopic;
      const matchesSearch =
        !searchText ||
        problem.title.toLowerCase().includes(searchText.toLowerCase()) ||
        problem.tag.toLowerCase().includes(searchText.toLowerCase());
      const matchesView = viewFilter === "all" ? true : problem.isMustSolve;
      const matchesDifficulty =
        difficultyFilter === "全部" ? true : problem.difficulty === difficultyFilter;
      return matchesTopic && matchesSearch && matchesView && matchesDifficulty;
    });
  }, [selectedTopic, searchText, viewFilter, difficultyFilter]);

  const topicStats = useMemo(() => {
    const list = problems.filter((problem) => problem.tag === selectedTopic);
    const mustCount = list.filter((problem) => problem.isMustSolve).length;
    const easyCount = list.filter((problem) => problem.difficulty === "简单").length;
    const mediumCount = list.filter((problem) => problem.difficulty === "中等").length;
    const hardCount = list.filter((problem) => problem.difficulty === "困难").length;
    return {
      total: list.length,
      must: mustCount,
      easy: easyCount,
      medium: mediumCount,
      hard: hardCount,
    };
  }, [selectedTopic]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "简单":
        return "success";
      case "中等":
        return "warning";
      case "困难":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10 relative overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-800/80 bg-white/95 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-900/90 px-6 py-6 sm:px-8 sm:py-8 shadow-lg dark:shadow-[0_18px_60px_rgba(15,23,42,0.9)]">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-cyan-300/20 dark:bg-cyan-500/20 blur-3xl" />
            <div className="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-violet-300/25 dark:bg-violet-500/25 blur-3xl" />
          </div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 text-cyan-300 ring-1 ring-cyan-500/30 px-3 py-1 text-xs font-medium dark:bg-slate-900/80 dark:text-cyan-300 dark:ring-cyan-500/30 bg-slate-100 text-cyan-700 ring-cyan-200">
                <Sparkles className="h-3.5 w-3.5 text-yellow-500 dark:text-yellow-400" />
                前端 · 算法训练营
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                刷题练功房
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                覆盖基础、进阶与高频面试题，配合必刷标签与难度维度，你可以按图索骥，
                像经营项目一样经营自己的算法能力。
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-900/70">
                  <ThumbsUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                  高频题目精炼整理
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-900/70">
                  <Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  必刷清单驱动练习
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-900/70">
                  <Target className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                  按主题拆解知识图谱
                </span>
              </div>
            </div>
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-300/15 via-transparent to-violet-300/10 blur-xl dark:from-cyan-500/15 dark:to-violet-500/10" />
              <div className="relative rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-lg dark:border-slate-700/80 dark:bg-slate-950/80 dark:shadow-[0_18px_50px_rgba(15,23,42,0.9)]">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>题库搜索</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    Ctrl + K
                  </span>
                </div>
                <Input
                  size="large"
                  placeholder="搜索题目、标签..."
                  prefix={<Search className="w-4 h-4 text-slate-400" />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm hover:border-cyan-400 focus:border-cyan-500 focus:ring-0 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-cyan-500/70 dark:focus:border-cyan-500/90"
                  allowClear
                />
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col rounded-xl bg-slate-50 px-2 py-2 dark:bg-slate-900/80">
                    <span className="text-[10px] text-slate-500 dark:text-slate-500">当前主题</span>
                    <span className="mt-1 text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {topicStats.total} 道
                    </span>
                  </div>
                  <div className="flex flex-col rounded-xl bg-slate-50 px-2 py-2 dark:bg-slate-900/80">
                    <span className="text-[10px] text-slate-500 dark:text-slate-500">必刷题</span>
                    <span className="mt-1 text-xs font-semibold text-amber-500 dark:text-amber-300">
                      {topicStats.must}
                    </span>
                  </div>
                  <div className="flex flex-col rounded-xl bg-slate-50 px-2 py-2 dark:bg-slate-900/80">
                    <span className="text-[10px] text-slate-500 dark:text-slate-500">难度分布</span>
                    <span className="mt-1 text-[11px] text-slate-700 dark:text-slate-300">
                      E{topicStats.easy} · M{topicStats.medium} · H{topicStats.hard}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                  知识图谱
                </h3>
              </div>
              <div className="space-y-1 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {topics.map((topic) => (
                  <button
                    key={topic.name}
                    onClick={() => setSelectedTopic(topic.name)}
                    className={`group w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-between relative overflow-hidden ${
                      selectedTopic === topic.name
                        ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    {selectedTopic === topic.name && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    <span className="relative z-10 pl-2">{topic.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                        selectedTopic === topic.name
                          ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                      }`}
                    >
                      {topic.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-500/80 via-sky-500 to-blue-500 text-slate-950 flex items-center justify-center shadow-[0_12px_30px_rgba(8,47,73,0.7)]">
                  <span className="text-xs font-semibold">DP</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {selectedTopic}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    当前条件下共 {filteredProblems.length} 道题目
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
                <Segmented
                  size="small"
                  value={viewFilter}
                  onChange={(v) => setViewFilter(v as "all" | "must")}
                  options={[
                    { label: "全部题目", value: "all" },
                    { label: "只看必刷", value: "must" },
                  ]}
                  className="bg-white text-[11px] text-slate-700 border border-gray-200 dark:bg-slate-900/80 dark:text-slate-200 dark:border-slate-700/80"
                />
                <div className="inline-flex items-center gap-1 rounded-2xl bg-white px-2 py-1 text-[11px] text-slate-600 border border-gray-200 dark:bg-slate-900/80 dark:text-slate-300 dark:border-slate-700/80">
                  <span className="mr-1 text-slate-500 dark:text-slate-400">难度</span>
                  {(["全部", "简单", "中等", "困难"] as const).map((level) => {
                    const isActive = difficultyFilter === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficultyFilter(level)}
                        className={[
                          "rounded-xl px-2 py-0.5 transition-all",
                          isActive
                            ? "bg-slate-900 text-slate-50 shadow-sm dark:bg-slate-50 dark:text-slate-900"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800",
                        ].join(" ")}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <motion.div 
              layout 
              className="grid gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProblems.map((problem, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={problem.id}
                    className="group relative rounded-2xl p-5 border bg-white shadow-sm border-gray-200 hover:border-cyan-300 hover:shadow-md dark:bg-slate-900/80 dark:border-slate-800/80 dark:shadow-[0_18px_40px_rgba(15,23,42,0.9)] dark:hover:border-cyan-500/60 dark:hover:shadow-[0_22px_60px_rgba(8,47,73,0.95)] transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-xs font-mono text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {index + 1}
                          </span>
                          <h3 className="font-semibold text-sm sm:text-base text-slate-900 group-hover:text-cyan-600 dark:text-slate-50 dark:group-hover:text-cyan-400 transition-colors">
                            {problem.title}
                          </h3>
                          {problem.isMustSolve && (
                            <Tag
                              color="gold"
                              className="flex items-center gap-1 rounded-full px-2 border-0 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                            >
                              <Trophy className="w-3 h-3" />
                              必刷
                            </Tag>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pl-9">
                          <Tag className="rounded-md border-0 bg-cyan-50 text-cyan-700 px-2 py-0.5 m-0 dark:bg-cyan-500/10 dark:text-cyan-300">
                            #{problem.tag}
                          </Tag>
                          <Tag 
                            color={getDifficultyColor(problem.difficulty)}
                            className="rounded-md m-0 px-2 py-0.5"
                          >
                            {problem.difficulty}
                          </Tag>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-9 md:pl-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {problem.isMustSolve ? (
                          <>
                            <Button
                              type="text"
                              size="small"
                              className="text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-300"
                              onClick={() => console.log("取消必刷", problem.id)}
                            >
                              取消必刷
                            </Button>
                            <Button
                              size="middle"
                              className="rounded-xl border border-slate-200 text-slate-700 hover:border-cyan-400 hover:text-cyan-600 bg-white dark:border-slate-600 dark:text-slate-100 dark:hover:border-cyan-400 dark:hover:text-cyan-300 dark:bg-slate-900/80"
                              icon={<Play className="w-4 h-4" />}
                              onClick={() =>
                                console.log("动画演示", problem.id)
                              }
                            >
                              演示
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="text"
                            size="small"
                            className="text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-300"
                            onClick={() => console.log("设为必刷", problem.id)}
                          >
                            设为必刷
                          </Button>
                        )}
                        <Button
                          type="primary"
                          size="middle"
                          className="rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500 hover:from-cyan-400 hover:to-sky-400 shadow-[0_14px_40px_rgba(8,47,73,0.9)] border-0"
                          icon={<FileText className="w-4 h-4" />}
                          onClick={() => {
                            navigate(`/front/articleDetail/1998194863023136770`);
                          }}
                        >
                          查看题解
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProblems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_18px_50px_rgba(15,23,42,0.9)]"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-slate-500 dark:text-slate-400">
                      暂无相关题目，尝试切换难度或主题再试试看。
                    </span>
                  }
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Algorithm;
