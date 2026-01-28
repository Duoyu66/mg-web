"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  function enterDocsWithRole(role: UserRole | "current") {
    if (role !== "current") {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `doc-role=${encodeURIComponent(role)}; path=/; expires=${expires.toUTCString()}`;
    }
    router.push("/docs");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            木瓜文档系统
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            点击下面的按钮进入内部文档，或切换不同权限进行模拟。
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            type="button"
            onClick={() => enterDocsWithRole("current")}
          >
            使用当前权限进入
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap">
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
      </main>
    </div>
  );
}
