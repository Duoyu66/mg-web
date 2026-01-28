"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { DirectoryNode, DocNode } from "@/lib/docs";
import type { UserRole } from "@/lib/auth";

const STORAGE_KEY = "nav-tree-expanded";

type NavTreeProps = {
  tree: DirectoryNode[];
  currentSegments: string[];
  userRole: UserRole;
  moduleTitle: string | null;
};

export function NavTree({ tree, currentSegments, userRole, moduleTitle }: NavTreeProps) {
  // 在顶层管理展开状态，确保所有层级共享
  // 服务器端和客户端都初始化为空 Set，避免 hydration 错误
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);

  // 在客户端挂载后从 sessionStorage 读取展开状态
  useEffect(() => {
    setIsHydrated(true);
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const items = JSON.parse(saved) as string[];
        setExpandedItems(new Set(items));
      }
    } catch {
      // 忽略解析错误
    }
  }, []);

  // 保存展开状态到 sessionStorage
  useEffect(() => {
    if (isHydrated && typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(expandedItems)));
      } catch {
        // 忽略存储错误
      }
    }
  }, [expandedItems, isHydrated]);

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // 如果只有一个模块，直接显示其内容，不显示模块名
  if (tree.length === 1) {
    return (
      <nav className="space-y-8 text-sm">
        {moduleTitle && (
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{moduleTitle}</h2>
          </div>
        )}
        <NavChildren 
          nodes={tree[0].children} 
          currentSegments={currentSegments}
          expandedItems={expandedItems}
          toggleExpand={toggleExpand}
          userRole={userRole}
        />
      </nav>
    );
  }
  
  // 多个模块时显示模块名
  return (
    <nav className="space-y-8 text-sm">
      {moduleTitle && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{moduleTitle}</h2>
        </div>
      )}
      {tree.map((node) => (
        <div key={node.name}>
          <p className="font-semibold mb-3 text-gray-900 text-xs uppercase tracking-wider">{node.name}</p>
          <NavChildren 
            nodes={node.children} 
            currentSegments={currentSegments}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            userRole={userRole}
          />
        </div>
      ))}
    </nav>
  );
}

type NavChildrenProps = {
  nodes: Array<DirectoryNode | DocNode>;
  currentSegments: string[];
  level?: number;
  parentKey?: string;
  expandedItems: Set<string>;
  toggleExpand: (key: string) => void;
  userRole: UserRole;
};

function NavChildren({ 
  nodes, 
  currentSegments, 
  level = 0, 
  parentKey = "",
  expandedItems,
  toggleExpand,
  userRole
}: NavChildrenProps) {

  return (
    <ul className="space-y-1">
      {nodes.map((child) => {
        if (child.type === "directory") {
          const key = parentKey ? `${parentKey}-${child.name}` : child.name;
          const isExpanded = expandedItems.has(key);
          const hasChildren = child.children.length > 0;
          
          return (
            <li key={child.name} className="mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleExpand(key);
                }}
                className="w-full flex items-center justify-between text-gray-700 hover:text-gray-900 py-1.5 px-2 rounded-md hover:bg-gray-50 transition-colors group"
                type="button"
              >
                <span className="text-gray-700 text-xs font-medium uppercase tracking-wider">{child.name}</span>
                {hasChildren && (
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              {hasChildren && isExpanded && (
                <div className="ml-2 mt-1">
                  <NavChildren 
                    nodes={child.children} 
                    currentSegments={currentSegments} 
                    level={level + 1}
                    parentKey={key}
                    expandedItems={expandedItems}
                    toggleExpand={toggleExpand}
                    userRole={userRole}
                  />
                </div>
              )}
            </li>
          );
        }
        const href = "/docs/" + child.pathSegments.join("/");
        const isActive =
          currentSegments.length === child.pathSegments.length &&
          currentSegments.every((s, idx) => s === child.pathSegments[idx]);
        const requiresVip = child.requiresVip || false;
        const isVip = userRole === "vip" || userRole === "admin";
        
        return (
          <li key={child.id}>
            {requiresVip ? (
              // 需要 VIP 的文档
              isVip ? (
                // VIP 用户：显示标识，可以正常浏览
                <Link
                  href={href}
                  className={
                    isActive
                      ? "text-gray-900 font-medium block py-1.5 px-2 rounded-md bg-gray-50 flex items-center justify-between"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 block py-1.5 px-2 rounded-md transition-colors flex items-center justify-between"
                  }
                >
                  <span>{child.title}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">VIP</span>
                </Link>
              ) : (
                // 非会员：显示标识，点击时提示
                <div
                  onClick={() => {
                    alert("您还不是会员");
                  }}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block py-1.5 px-2 rounded-md transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{child.title}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">VIP</span>
                </div>
              )
            ) : (
              // 不需要 VIP 的文档：正常显示
              <Link
                href={href}
                className={
                  isActive
                    ? "text-gray-900 font-medium block py-1.5 px-2 rounded-md bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 block py-1.5 px-2 rounded-md transition-colors"
                }
              >
                {child.title}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

