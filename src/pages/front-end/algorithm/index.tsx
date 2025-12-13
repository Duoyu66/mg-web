import { useState, useMemo } from "react";
import { Input, Button, Tag, Badge } from "antd";
import { Search, ThumbsUp, Play, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        return "green";
      case "中等":
        return "orange";
      case "困难":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 搜索栏 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <Input
            size="large"
            placeholder="搜索题目或标签..."
            prefix={<Search className="w-5 h-5 text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
            allowClear
          />
        </div>

        <div className="flex gap-6">
          {/* 左侧主题列表 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                算法主题
              </h3>
              <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {topics.map((topic) => (
                  <button
                    key={topic.name}
                    onClick={() => setSelectedTopic(topic.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between ${
                      selectedTopic === topic.name
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span>{topic.name}</span>
                    <Badge
                      count={topic.count}
                      style={{
                        backgroundColor:
                          selectedTopic === topic.name
                            ? "var(--color-primary-600)"
                            : "#d1d5db",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧题目列表 */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  #{selectedTopic}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  共 {filteredProblems.length} 道题目
                </p>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredProblems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-400 dark:text-gray-500 text-sm font-mono">
                            {index + 1}
                          </span>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {problem.title}
                          </h3>
                          {problem.isMustSolve && (
                            <Tag
                              color="primary"
                              className="flex items-center gap-1"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              必刷题
                            </Tag>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-8">
                          <Tag color="blue">#{problem.tag}</Tag>
                          <Tag color={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                          </Tag>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {problem.isMustSolve ? (
                          <>
                            <Button
                              size="small"
                              onClick={() => console.log("取消必刷", problem.id)}
                            >
                              取消必刷
                            </Button>
                            <Button
                              size="small"
                              icon={<Play className="w-4 h-4" />}
                              onClick={() =>
                                console.log("动画演示", problem.id)
                              }
                            >
                              动画演示
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="small"
                            onClick={() => console.log("设为必刷", problem.id)}
                          >
                            设为必刷
                          </Button>
                        )}
                        <Button
                          size="small"
                          type="primary"
                          icon={<FileText className="w-4 h-4" />}
                          onClick={() => {
                            navigate(`/front/articleDetail/1998194863023136770`);
                          }}
                        >
                          题解
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProblems.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  暂无相关题目
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Algorithm;
