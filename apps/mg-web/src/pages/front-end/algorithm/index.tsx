import { useState, useMemo } from "react";
import { Input, Button, Tag, Badge, Empty } from "antd";
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
  const navigate = useNavigate();

  // 根据选中的主题和搜索文本过滤题目
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesTopic = problem.tag === selectedTopic;
      const matchesSearch =
        !searchText ||
        problem.title.toLowerCase().includes(searchText.toLowerCase()) ||
        problem.tag.toLowerCase().includes(searchText.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [selectedTopic, searchText]);

  // 获取难度标签颜色
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 顶部 Header 区域 */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="text-yellow-500 fill-yellow-500" />
              算法训练营
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              精选高频面试题，助你攻克算法难关
            </p>
          </div>
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Input
              size="large"
              placeholder="搜索题目、标签..."
              prefix={<Search className="w-5 h-5 text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 transition-all rounded-xl shadow-sm"
              allowClear
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧主题列表 */}
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

          {/* 右侧题目列表 */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedTopic}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    收录 {filteredProblems.length} 道精选题目
                  </p>
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
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 text-xs font-mono text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </span>
                          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                          <Tag className="rounded-md border-0 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 m-0">
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
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => console.log("取消必刷", problem.id)}
                            >
                              取消必刷
                            </Button>
                            <Button
                              size="middle"
                              className="rounded-xl border-blue-200 text-blue-600 hover:border-blue-400 hover:text-blue-500"
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
                            onClick={() => console.log("设为必刷", problem.id)}
                          >
                            设为必刷
                          </Button>
                        )}
                        <Button
                          type="primary"
                          size="middle"
                          className="rounded-xl bg-blue-600 hover:bg-blue-500 shadow-blue-200 dark:shadow-none shadow-lg"
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
                className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description={
                    <span className="text-gray-500 dark:text-gray-400">
                      暂无相关题目，换个关键词试试？
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
