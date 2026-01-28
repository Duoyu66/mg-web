"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/auth";

type Book = {
  id: string;
  title: string;
  description?: string;
  cover?: string;
  category: string;
  documentCount: number;
};

type BooksResponse = {
  books: Book[];
};

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
  const [books, setBooks] = useState<Book[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(() => getUserRoleFromCookie());

  useEffect(() => {
    // 获取所有书籍
    fetch("/api/books")
      .then((res) => res.json())
      .then((data: BooksResponse) => {
        setBooks(data.books);
      })
      .catch((error) => {
        console.error("Failed to fetch books:", error);
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

  function enterBook(bookId: string) {
    router.push(`/books/${bookId}`);
  }

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
              选择书籍开始学习，每本书都是独立完整的学习路径。
            </p>
          </div>

          {/* 书籍列表 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-zinc-50">所有书籍</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => enterBook(book.id)}
                  className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  {book.cover ? (
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{book.title}</span>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">📚</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    {book.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {book.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {book.documentCount} 个文档
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
