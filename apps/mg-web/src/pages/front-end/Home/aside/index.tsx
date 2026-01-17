import React from 'react';
import { Button, Skeleton } from "antd";
import { useMemo } from "react";

interface AsideProps {
  isLoading: boolean;
  records: any[]; // Define a more specific type if available
}

const Aside: React.FC<AsideProps> = ({ isLoading, records }) => {
  return (
    <div className="w-80 flex-shrink-0 space-y-4">
      {/* 热门话题 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          热门话题
        </h3>
        <div className="space-y-2">
          <a
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            # 考研经验分享
          </a>
          <a
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            # 大学生活攻略
          </a>
          <a
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            # 编程学习路线
          </a>
          <a
            href="#"
            className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            # 实习面试技巧
          </a>
        </div>
      </div>

      {/* 援助推荐 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          援助推荐
        </h3>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton.Avatar active size="default" />
                <div className="flex-1">
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "80%" }}
                  />
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "60%", marginTop: 8 }}
                  />
                </div>
              </div>
            ))
          ) : (
            useMemo(() => {
              return Array.from(new Map(records.map(item => [item.userId, item])).values())
                .filter(item => item.userId !== "currentUserId") // 过滤掉当前用户
                .slice(0, 3) // 只显示前3个
                .map((item, index) => {
                  const frameIndex = index % 4;
                  const frameClass =
                    frameIndex === 0
                      ? 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-pulse'
                      : frameIndex === 1
                      ? 'bg-gradient-to-tr from-yellow-300 via-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.7)]'
                      : frameIndex === 2
                      ? 'bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-500 shadow-[0_0_10px_rgba(244,114,182,0.5)]'
                      : 'bg-[conic-gradient(at_top,_#22c55e,_#0ea5e9,_#6366f1,_#22c55e)] animate-spin';

                  return (
                    <div key={item.userId} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full p-[2px] ${frameClass}`}>
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                          <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={item.avatar}
                            alt={item.nickname}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {item.nickname}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {item.signature || "暂无签名"}
                        </div>
                      </div>
                      <Button size="small" className="flex-shrink-0">
                        关注
                      </Button>
                    </div>
                  );
                });
            }, [records, isLoading])
          )}
        </div>
      </div>
    </div>
  );
};

export default Aside;
