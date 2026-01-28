import { headers } from "next/headers";
import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getCurrentUserRoleFromCookie } from "@/lib/auth";
import { getDirectoryRule, isRoleAllowed } from "@/lib/permissions";
import { getDocsTree, loadDocBySegments, getAllDocs, getAdjacentDocs } from "@/lib/docs";
import { CodeBlock } from "@/components/CodeBlock";
import { NavTree } from "@/components/NavTree";
import "highlight.js/styles/github-dark.css";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

type DocsTree = ReturnType<typeof getDocsTree>;

function findFirstDocInNodes(nodes: DocsTree[number]["children"]): string[] | null {
  for (const node of nodes) {
    if (node.type === "file") {
      return node.pathSegments;
    }
    if (node.type === "directory") {
      const nested = findFirstDocInNodes(node.children);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

function findFirstAccessibleDoc(
  tree: DocsTree,
  role: ReturnType<typeof getCurrentUserRoleFromCookie>
): string[] | null {
  for (const dir of tree) {
    const result = findFirstDocInNodes(dir.children);
    if (result) {
      const topLevelDir = result[0];
      const dirRule = getDirectoryRule(topLevelDir);
      const doc = loadDocBySegments(result);
      if (doc) {
        const pageRoles = doc.frontmatter.roles;
        const allowed = isRoleAllowed(role, dirRule, pageRoles);
        if (allowed) {
          return result;
        }
      }
    }
  }
  return null;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// 从 markdown 内容中提取标题
// 使用与 rehype-slug 相同的 ID 生成逻辑
function extractHeadings(content: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = [];
  const lines = content.split("\n");
  let inFrontmatter = false;
  
  for (const line of lines) {
    // 跳过 frontmatter
    if (line.trim() === "---") {
      inFrontmatter = !inFrontmatter;
      continue;
    }
    if (inFrontmatter) {
      continue;
    }
    
    // 匹配标题，支持中文和英文
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      
      // 生成 ID：使用与 rehype-slug 相同的逻辑
      // rehype-slug 会保留中文字符和字母数字，移除其他特殊字符，将空格替换为连字符
      const id = text
        .trim()
        // 保留中文字符、字母、数字、连字符和空格
        .replace(/[^\u4e00-\u9fa5\w\s-]/g, "") // 移除特殊字符，保留中文、字母数字、空格和连字符
        .toLowerCase() // 将英文转换为小写（不影响中文）
        .replace(/\s+/g, "-") // 将空格替换为连字符
        .replace(/-+/g, "-") // 将多个连字符替换为单个
        .replace(/^-+|-+$/g, ""); // 移除开头和结尾的连字符
      
      headings.push({ level, text, id });
    }
  }
  
  return headings;
}

export default async function DocPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tree = getDocsTree();
  const allDocs = getAllDocs();
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? null;
  const role = getCurrentUserRoleFromCookie(cookieHeader);
  
  // 如果没有指定 slug，找到用户有权限访问的第一个文档
  let slugSegments: string[];
  if (resolvedParams.slug && resolvedParams.slug.length > 0) {
    slugSegments = resolvedParams.slug;
  } else {
    const defaultDoc = findFirstAccessibleDoc(tree, role);
    if (!defaultDoc) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">没有可访问的文档</p>
        </div>
      );
    }
    slugSegments = defaultDoc;
  }
  
  const topLevelDir = slugSegments[0];
  const dirRule = getDirectoryRule(topLevelDir);
  const doc = loadDocBySegments(slugSegments);
  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">文档不存在</p>
      </div>
    );
  }
  const pageRoles = doc.frontmatter.roles;
  const allowed = isRoleAllowed(role, dirRule, pageRoles);
  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">没有权限访问当前文档</p>
      </div>
    );
  }
  
  const headings = extractHeadings(doc.content);
  const { prev, next } = getAdjacentDocs(slugSegments, allDocs);
  const currentPath = slugSegments.join("/");
  
  // 调试：输出提取的标题
  if (process.env.NODE_ENV === "development") {
    console.log("Extracted headings:", headings);
  }
  
  return (
    <div key={currentPath} className="min-h-screen flex bg-white">
      {/* 左侧菜单 */}
      <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto fixed left-0 top-0 h-screen z-10 pointer-events-auto">
        <NavTree tree={tree} currentSegments={slugSegments} userRole={role} />
      </aside>
      
      {/* 中间内容 */}
      <main className="flex-1 ml-64 mr-80 min-h-screen relative z-0">
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
              {doc.content}
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
      <aside className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto fixed right-0 top-0 h-screen z-10">
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}


type TableOfContentsProps = {
  headings: Array<{ level: number; text: string; id: string }>;
};

function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <nav className="text-sm">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        On this page
      </h2>
      {headings.length === 0 ? (
        <p className="text-gray-400 text-xs">No headings available</p>
      ) : (
        <ul className="space-y-1">
          {headings.map((heading, index) => {
            const paddingLeft = (heading.level - 1) * 12;
            return (
              <li key={index} style={{ paddingLeft: `${paddingLeft}px` }}>
                <a
                  href={`#${heading.id}`}
                  className="text-gray-600 hover:text-gray-900 block py-1.5 transition-colors text-sm"
                  style={{
                    fontSize: heading.level === 1 ? "0.875rem" : heading.level === 2 ? "0.8125rem" : "0.75rem",
                    fontWeight: heading.level <= 2 ? "500" : "400",
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
