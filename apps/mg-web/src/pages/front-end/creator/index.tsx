import { useState } from "react";
import { Button, Empty, Tabs, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import {
  Flag,
  Flame,
  PenSquare,
  Settings2,
  FileText,
  MessageSquare,
  ImageIcon,
  LayoutPanelTop,
} from "lucide-react";

type CreatorMenuKey =
  | "activity"
  | "incentive"
  | "create_dynamic"
  | "create_article"
  | "create_series"
  | "manage_content";

const sideMenu = [
  {
    groupKey: "activity",
    icon: <Flag className="w-4 h-4" />,
    label: "活动中心",
    items: [
      { key: "activity", label: "活动列表" },
    ],
  },
  {
    groupKey: "incentive",
    icon: <Flame className="w-4 h-4" />,
    label: "创作激励",
    items: [
      { key: "incentive", label: "成长等级" },
    ],
  },
  {
    groupKey: "create",
    icon: <PenSquare className="w-4 h-4" />,
    label: "创作",
    items: [
      { key: "create_dynamic", label: "发动态" },
      { key: "create_article", label: "写文章" },
      { key: "create_series", label: "创作专栏" },
    ],
  },
  {
    groupKey: "manage",
    icon: <Settings2 className="w-4 h-4" />,
    label: "管理",
    items: [{ key: "manage_content", label: "内容管理" }],
  },
] as const;

const contentTabs = [
  { key: "dynamic", label: "动态", icon: <MessageSquare className="w-4 h-4" /> },
  { key: "article", label: "帖子", icon: <FileText className="w-4 h-4" /> },
  { key: "series", label: "专栏", icon: <LayoutPanelTop className="w-4 h-4" /> },
  { key: "media", label: "图文", icon: <ImageIcon className="w-4 h-4" /> },
] as const;

const filterTabs = [
  { key: "all", label: "全部" },
  { key: "published", label: "已发布" },
  { key: "reviewing", label: "审核中" },
  { key: "draft", label: "草稿箱" },
] as const;

const CreatorCenter = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<CreatorMenuKey>("manage_content");
  const [activeContentTab, setActiveContentTab] = useState<string>("dynamic");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleQuickCreate = () => {
    navigate("/publishArticle");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              创作中心
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              统一管理你的动态、帖子和专栏创作数据。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  总发布内容
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  0
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  总阅读量
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  0
                </div>
              </div>
            </div>
            <Button
              type="primary"
              className="rounded-full px-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 border-none shadow-md shadow-primary-500/20"
              onClick={handleQuickCreate}
            >
              立即写文章
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="w-60 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-3">
              <div className="space-y-1">
                {sideMenu.map((group) => (
                  <div key={group.groupKey}>
                    <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-2">
                      <span className="mr-2 text-gray-400">{group.icon}</span>
                      <span>{group.label}</span>
                    </div>
                    <div className="mb-1">
                      {group.items.map((item) => {
                        const isActive = activeMenu === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() =>
                              setActiveMenu(item.key as CreatorMenuKey)
                            }
                            className={[
                              "w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
                              isActive
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                            ].join(" ")}
                          >
                            <span className="truncate">{item.label}</span>
                            {item.key === "manage_content" && (
                              <Badge
                                count={0}
                                size="small"
                                overflowCount={99}
                                className="site-badge-count"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="border-b border-gray-100 dark:border-gray-700 px-4 pt-3">
                <Tabs
                  activeKey={activeContentTab}
                  onChange={(key) => setActiveContentTab(key)}
                  items={contentTabs.map((tab) => ({
                    key: tab.key,
                    label: (
                      <div className="flex items-center gap-1.5">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                    ),
                  }))}
                />
              </div>

              <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-2">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    {filterTabs.map((tab) => {
                      const isActive = activeFilter === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActiveFilter(tab.key)}
                          className={[
                            "px-3 py-1 rounded-full transition-colors",
                            isActive
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700",
                          ].join(" ")}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="ml-auto text-gray-400 dark:text-gray-500">
                    共 0 条内容
                  </div>
                </div>
              </div>

              <div className="px-6 py-10 flex flex-col items-center justify-center text-center min-h-[320px]">
                <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                  <PenSquare className="w-10 h-10 text-amber-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  还没有内容
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  在这里可以统一管理你发布的动态、帖子和专栏。
                </p>
                <Button type="primary" onClick={handleQuickCreate}>
                  立即开始创作
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatorCenter;

