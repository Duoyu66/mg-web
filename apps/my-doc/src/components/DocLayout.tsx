"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { NavTree } from "@/components/NavTree";
import { CodeBlock } from "@/components/CodeBlock";
import React from "react";
import type { DirectoryNode, DocNode } from "@/lib/docs";
import type { UserRole } from "@/lib/auth";
import "highlight.js/styles/github-dark.css";

type DocLayoutProps = {
  initialModuleTree: DirectoryNode[];
  initialSegments: string[];
  userRole: UserRole;
  docContent: string;
  headings: Array<{ level: number; text: string; id: string }>;
  prev: DocNode | null;
  next: DocNode | null;
  moduleTitle: string | null;
};

export function DocLayout({
  initialModuleTree,
  initialSegments,
  userRole,
  docContent,
  headings: serverHeadings,
  prev,
  next,
  moduleTitle,
}: DocLayoutProps) {
  const pathname = usePathname();
  const STORAGE_KEY = "doc_module_id";
  const TREE_STORAGE_KEY = "doc_module_tree";
  
  // 获取当前模块标识（前两个路径段）
  const getModuleId = (segments: string[]) => {
    if (segments.length < 2) return null;
    return `${segments[0]}/${segments[1]}`;
  };
  
  const currentModuleId = getModuleId(initialSegments);
  
  // 从 sessionStorage 读取保存的模块标识和模块树
  // 服务器端和客户端都使用 initialModuleTree，避免 hydration 错误
  const [moduleTree, setModuleTree] = useState<DirectoryNode[]>(initialModuleTree);
  const [isHydrated, setIsHydrated] = useState(false);

  // 在客户端挂载后从 sessionStorage 读取模块树
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window === "undefined") return;
    
    const savedModuleId = sessionStorage.getItem(STORAGE_KEY);
    const savedTree = sessionStorage.getItem(TREE_STORAGE_KEY);
    
    // 如果 sessionStorage 中已经有保存的模块树，使用保存的模块树（固定显示初始模块的菜单）
    if (savedModuleId && savedTree) {
      try {
        const parsedTree = JSON.parse(savedTree);
        // 验证解析的树是否有效
        if (Array.isArray(parsedTree) && parsedTree.length > 0) {
          setModuleTree(parsedTree);
          return;
        }
      } catch {
        // 如果解析失败，继续使用当前模块树
      }
    }
    
    // 首次进入或保存的模块树无效：保存当前模块标识和模块树
    if (currentModuleId && !savedModuleId) {
      sessionStorage.setItem(STORAGE_KEY, currentModuleId);
      sessionStorage.setItem(TREE_STORAGE_KEY, JSON.stringify(initialModuleTree));
    }
  }, [currentModuleId, initialModuleTree]);
  
  // 从路径中提取当前 segments
  const currentSegments = pathname.startsWith("/docs/")
    ? pathname.replace("/docs/", "").split("/").filter(Boolean)
    : initialSegments;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 顶部栏 */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b border-gray-200 bg-white z-20 flex items-center px-4">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-gray-700 transition-colors">
          文档
        </Link>
      </header>
      
      <div className="flex mt-14">
        {/* 左侧菜单 */}
        <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-10 pointer-events-auto">
          <NavTree tree={moduleTree} currentSegments={currentSegments} userRole={userRole} moduleTitle={moduleTitle} />
        </aside>
        
        {/* 中间内容 */}
        <main className="flex-1 ml-64 mr-80 min-h-[calc(100vh-3.5rem)] relative z-0">
          <div className="max-w-3xl mx-auto px-16 py-12">
            <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:scroll-mt-20 prose-p:text-gray-700 prose-p:leading-7 prose-a:text-gray-700 prose-a:no-underline hover:prose-a:text-gray-900 hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-transparent prose-pre:p-0 prose-pre:my-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "wrap",
                      properties: {
                        className: ["anchor"],
                      },
                    },
                  ],
                  rehypeHighlight,
                ]}
                components={{
                  h1: ({ children, id }) => {
                    return (
                      <h1 id={id} className="text-4xl font-bold mt-8 mb-4 text-gray-900 scroll-mt-20">
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ children, id }) => {
                    return (
                      <h2 id={id} className="text-3xl font-semibold mt-8 mb-4 text-gray-900 scroll-mt-20 border-b border-gray-200 pb-2">
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children, id }) => {
                    return (
                      <h3 id={id} className="text-2xl font-semibold mt-6 mb-3 text-gray-900 scroll-mt-20">
                        {children}
                      </h3>
                    );
                  },
                  h4: ({ children, id }) => {
                    return (
                      <h4 id={id} className="text-xl font-semibold mt-4 mb-2 text-gray-900 scroll-mt-20">
                        {children}
                      </h4>
                    );
                  },
                  h5: ({ children, id }) => {
                    return (
                      <h5 id={id} className="text-lg font-semibold mt-4 mb-2 text-gray-900 scroll-mt-20">
                        {children}
                      </h5>
                    );
                  },
                  h6: ({ children, id }) => {
                    return (
                      <h6 id={id} className="text-base font-semibold mt-4 mb-2 text-gray-900 scroll-mt-20">
                        {children}
                      </h6>
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code: (props: any) => {
                    const { children, className } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    
                    if (isInline) {
                      return (
                        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      );
                    }
                    
                    return (
                      <code className={className}>
                        {children}
                      </code>
                    );
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pre: (props: any) => {
                    const { children } = props;
                    const childrenArray = React.Children.toArray(children);
                    const codeElement = childrenArray[0] as React.ReactElement<{ children?: React.ReactNode; className?: string }> | undefined;
                    const className = codeElement?.props?.className;
                    
                    if (className && className.includes("language-")) {
                      return (
                        <CodeBlock className={className}>
                          {codeElement?.props?.children}
                        </CodeBlock>
                      );
                    }
                    
                    return <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>;
                  },
                  a: ({ href, children }) => {
                    const isExternal = href?.startsWith("http");
                    return (
                      <Link
                        href={href || "#"}
                        className="text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        {children}
                        {isExternal && (
                          <svg className="inline-block w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </Link>
                    );
                  },
                  ul: ({ children }) => {
                    return <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">{children}</ul>;
                  },
                  ol: ({ children }) => {
                    return <ol className="list-decimal list-inside my-4 space-y-2 text-gray-700">{children}</ol>;
                  },
                  li: ({ children }) => {
                    return <li className="ml-4">{children}</li>;
                  },
                  blockquote: ({ children }) => {
                    return (
                      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">
                        {children}
                      </blockquote>
                    );
                  },
                  table: ({ children }) => {
                    return (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                          {children}
                        </table>
                      </div>
                    );
                  },
                  thead: ({ children }) => {
                    return <thead className="bg-gray-50">{children}</thead>;
                  },
                  th: ({ children }) => {
                    return (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {children}
                      </th>
                    );
                  },
                  td: ({ children }) => {
                    return <td className="px-4 py-3 text-sm text-gray-700 border-t border-gray-200">{children}</td>;
                  },
                }}
              >
                {docContent}
              </ReactMarkdown>
            </article>
            
            {/* 上一个/下一个导航 */}
            <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
              {prev ? (
                <Link
                  href={"/docs/" + prev.pathSegments.join("/")}
                  className="flex flex-col group hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm text-gray-500 mb-1">Previous</span>
                  <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div></div>
              )}
              {next ? (
                <Link
                  href={"/docs/" + next.pathSegments.join("/")}
                  className="flex flex-col items-end group hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm text-gray-500 mb-1">Next</span>
                  <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </main>
        
        {/* 右侧目录 */}
        <aside className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto fixed right-0 top-14 h-[calc(100vh-3.5rem)] z-10">
          <TableOfContents headings={serverHeadings} />
        </aside>
      </div>
    </div>
  );
}

type TableOfContentsProps = {
  headings: Array<{ level: number; text: string; id: string }>;
};

function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    if (headings.length === 0) return;
    
    const observerOptions = {
      root: null,
      rootMargin: "-80px 0% -80% 0%", // 考虑顶部栏高度
      threshold: 0,
    };
    
    const observer = new IntersectionObserver((entries) => {
      // 找到所有进入视口的标题，选择最接近顶部的那个
      const intersectingEntries = entries.filter(entry => entry.isIntersecting);
      if (intersectingEntries.length > 0) {
        // 按位置排序，选择最接近顶部的
        intersectingEntries.sort((a, b) => {
          const aTop = a.boundingClientRect.top;
          const bTop = b.boundingClientRect.top;
          return aTop - bTop;
        });
        setActiveId(intersectingEntries[0].target.id);
      }
    }, observerOptions);
    
    // 观察所有标题元素
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });
  
    observerRef.current = observer;
  
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);
  
  return (
    <nav className="text-sm">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        目录
      </h2>
      {headings.length === 0 ? (
        <p className="text-gray-400 text-xs">No headings available</p>
      ) : (
        <ul className="space-y-1">
          {headings.map((heading, index) => {
            const paddingLeft = (heading.level - 1) * 12;
            const isActive = activeId === heading.id;
            return (
              <li key={index} style={{ paddingLeft: `${paddingLeft}px` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // 立即设置高亮
                    setActiveId(heading.id);
                    const element = document.getElementById(heading.id);
                    if (element) {
                      const headerOffset = 80; // 顶部栏高度
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      // 立即跳转，不使用平滑滚动
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "auto",
                      });
                      // 更新 URL hash
                      window.history.pushState(null, "", `#${heading.id}`);
                    }
                  }}
                  className={`block py-1.5 transition-colors text-sm cursor-pointer ${
                    isActive
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  style={{
                    fontSize: heading.level === 1 ? "0.875rem" : heading.level === 2 ? "0.8125rem" : "0.75rem",
                    fontWeight: isActive ? "600" : heading.level <= 2 ? "500" : "400",
                  }}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
