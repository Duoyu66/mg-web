import React, { createContext, useLayoutEffect, useState } from 'react';

export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // 初始化时从 localStorage 读取，避免闪烁
        if (typeof window !== 'undefined') {
            const savedTheme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';
            // 立即设置 dark 类，在渲染前
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return savedTheme;
        }
        return 'light';
    });

    useLayoutEffect(() => {
        // 确保在渲染前设置 dark 类
        const savedTheme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';
        setTheme(savedTheme);
        // 为 Tailwind CSS 添加/移除 dark 类
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // 同时保留 data-theme 属性（如果需要）
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            // 切换 Tailwind CSS 的 dark 类
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            document.documentElement.setAttribute('data-theme', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
