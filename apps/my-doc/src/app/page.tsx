"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/auth";
import type { DirectoryNode, DocNode } from "@/lib/docs";

type DocsTreeResponse = {
  tree: DirectoryNode[];
};

// 获取模块下的所有文档
function getAllDocsFromModule(module: DirectoryNode): DocNode[] {
  const docs: DocNode[] = [];
  
  function traverse(nodes: Array<DirectoryNode | DocNode>) {
    for (const node of nodes) {
      if (node.type === "file") {
        docs.push(node);
      } else if (node.type === "directory") {
        traverse(node.children);
      }
    }
  }
  
  traverse(module.children);
  return docs;
}

// 从 cookie 获取用户角色
function getUserRoleFromCookie(): UserRole {
  if (typeof window === "undefined") return "guest";
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "doc-role") {
      const role = decodeURIComponent(value) as UserRole;
      if (role === "basic" || role === "vip" || role === "admin") {
        return role;
      }
    }
  }
  return "guest";
}

export default function Home() {
  const router = useRouter();
  const [docsTree, setDocsTree] = useState<DirectoryNode[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(() => getUserRoleFromCookie());

  useEffect(() => {
    // 获取文档树
    fetch("/api/docs-tree")
      .then((res) => res.json())
      .then((data: DocsTreeResponse) => {
        setDocsTree(data.tree);
      })
      .catch((error) => {
        console.error("Failed to fetch docs tree:", error);
      });
  }, []);

  function enterDocsWithRole(role: UserRole | "current") {
    if (role !== "current") {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `doc-role=${encodeURIComponent(role)}; path=/; expires=${expires.toUTCString()}`;
      setUserRole(role);
    }
    // 所有按钮都跳转到文档页面
    router.push("/docs");
  }

  const selectedModuleNode = docsTree.find((node) => node.name === selectedModule);
  const moduleDocs = selectedModuleNode ? getAllDocsFromModule(selectedModuleNode) : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-start py-32 px-16 bg-white dark:bg-black">
        <Image
          className="dark:invert mb-8"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-2">
              木瓜文档系统
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              选择模块查看文档，或切换不同权限进行模拟。
            </p>
          </div>

          {/* 模块列表 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-zinc-50">选择模块</h2>
            <div className="flex flex-wrap gap-3">
              {docsTree.map((module) => (
                <button
                  key={module.name}
                  type="button"
                  onClick={() => setSelectedModule(module.name)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedModule === module.name
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {module.name}
                </button>
              ))}
            </div>
          </div>

          {/* 文档列表 */}
          {selectedModule && moduleDocs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-zinc-50">
                {selectedModule} 模块文档
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {moduleDocs.map((doc) => {
                  const href = "/docs/" + doc.pathSegments.join("/");
                  const isVip = userRole === "vip" || userRole === "admin";
                  const canAccess = !doc.requiresVip || isVip;
                  
                  return (
                    <Link
                      key={doc.id}
                      href={canAccess ? href : "#"}
                      onClick={(e) => {
                        if (!canAccess) {
                          e.preventDefault();
                          alert("您还不是会员");
                        }
                      }}
                      className={`block p-4 rounded-lg border transition-colors ${
                        canAccess
                          ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          : "bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{doc.title}</span>
                        {doc.requiresVip && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            VIP
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 权限切换 */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-zinc-50">权限模拟</h2>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
                type="button"
                onClick={() => enterDocsWithRole("current")}
              >
                使用当前权限进入
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => enterDocsWithRole("guest")}
                className="flex h-10 items-center justify-center rounded-full border border-gray-300 px-4 text-gray-800 hover:bg-gray-100 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                模拟访客查看文档
              </button>
              <button
                type="button"
                onClick={() => enterDocsWithRole("basic")}
                className="flex h-10 items-center justify-center rounded-full border border-gray-300 px-4 text-gray-800 hover:bg-gray-100 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                模拟基础用户查看文档
              </button>
              <button
                type="button"
                onClick={() => enterDocsWithRole("vip")}
                className="flex h-10 items-center justify-center rounded-full border border-gray-300 px-4 text-gray-800 hover:bg-gray-100 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                模拟 VIP 用户查看文档
              </button>
              <button
                type="button"
                onClick={() => enterDocsWithRole("admin")}
                className="flex h-10 items-center justify-center rounded-full border border-gray-300 px-4 text-gray-800 hover:bg-gray-100 dark:text-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
              >
                模拟管理员查看文档
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
