import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeftFromLine, ArrowRightFromLine, BookmarkMinus} from "lucide-react";

export interface TOCItem {
    id: string;
    title: string;
    level: number;
    children?: TOCItem[];
}

export interface ArticleTOCProps {
    /**
     * 文章 HTML 内容
     */
    content: string;
    /**
     * 是否显示目录
     */
    showTOC?: boolean;
    /**
     * 目录标题
     */
    tocTitle?: string;
    /**
     * 自定义类名
     */
    className?: string;
}

/**
 * 文章目录组件
 * 自动从文章内容中提取标题并生成可点击的目录
 */
const ArticleTOC: React.FC<ArticleTOCProps> = ({
                                                   content,
                                                   showTOC = true,
                                                   tocTitle = '文章目录',
                                                   className = '',
                                               }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [tocCollapsed, setTocCollapsed] = useState(false);
    const isScrollingRef = useRef<boolean>(false);
    const targetIdRef = useRef<string>('');

    // 清理 Quill 样式类，转换为正常样式
    const cleanedContent = useMemo(() => {
        if (!content) return '';

        // 移除 Quill 的类名，保留内容
        let cleaned = content
            // 移除 Quill 的类名
            .replace(/class="ql-align-justify"/g, 'style="text-align: justify;"')
            .replace(/class="text_CgLK7"/g, '')
            .replace(/data-text="true"/g, '')
            // 处理其他 Quill 类名
            .replace(/class="[^"]*ql-[^"]*"/g, '');

        // 为所有标题添加 ID
        const titleRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>/gi;
        let titleIndex = 0;

        cleaned = cleaned.replace(titleRegex, (_match, tag, titleText) => {
            titleIndex++;
            const id = `heading-${titleIndex}`;
            const cleanTitle = titleText.replace(/<[^>]+>/g, '').trim();
            return `<${tag} id="${id}" data-title="${cleanTitle}">${titleText}</${tag}>`;
        });

        return cleaned;
    }, [content]);

    // 提取目录结构
    useEffect(() => {
        if (!cleanedContent) {
            setTocItems([]);
            return;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanedContent, 'text/html');
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

        const items: TOCItem[] = [];
        const stack: TOCItem[] = [];

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName.charAt(1));
            const id = heading.id || `heading-${items.length + 1}`;
            const title = heading.textContent?.trim() || '';

            if (!title) return;

            const item: TOCItem = {
                id,
                title,
                level,
            };

            // 构建层级结构
            while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            if (stack.length === 0) {
                items.push(item);
            } else {
                const parent = stack[stack.length - 1];
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(item);
            }

            stack.push(item);
        });

        setTocItems(items);
    }, [cleanedContent]);

    // 初始化：如果还没有高亮的标题，且存在目录项，则高亮第一个标题
    useEffect(() => {
        if (tocItems.length > 0 && !activeId) {
            const firstTopLevelItem = tocItems[0];
            if (firstTopLevelItem && firstTopLevelItem.id) {
                setActiveId(firstTopLevelItem.id);
            }
        }
    }, [tocItems, activeId]);

    // 监听滚动，高亮当前标题（与点击滚动保持一致的偏移）
    useEffect(() => {
        if (!contentRef.current || tocItems.length === 0) return;

        const handleScroll = () => {
            // 如果正在手动滚动（点击目录项触发），检查是否到达目标位置
            if (isScrollingRef.current && targetIdRef.current) {
                const targetElement = document.getElementById(targetIdRef.current);
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const targetTop = rect.top + window.scrollY;
                    const currentScroll = window.scrollY + 80; // 考虑固定头部
                    const distance = Math.abs(targetTop - currentScroll);

                    // 如果已经接近目标位置（误差小于 50px），认为滚动完成
                    if (distance < 50) {
                        isScrollingRef.current = false;
                        targetIdRef.current = '';
                    } else {
                        // 还在滚动中，保持目标 ID 不变，不更新高亮
                        return;
                    }
                }
            }

            const headings = contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (!headings || headings.length === 0) return;

            // 检查是否滚动到底部
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            const distanceToBottom = documentHeight - (scrollTop + windowHeight);
            // 距离底部小于 150px 时认为到底部，或者最后一个标题已经在视口上方
            const isNearBottom = distanceToBottom <= 150;

            let currentId = '';

            if (isNearBottom && headings.length > 0) {
                // 如果接近底部，直接高亮最后一个标题
                const lastHeading = headings[headings.length - 1] as HTMLElement;
                if (lastHeading && lastHeading.id) {
                    currentId = lastHeading.id;
                }
            }

            // 如果还没找到，或者不在底部，使用正常逻辑查找
            if (!currentId) {
                const scrollPosition = window.scrollY + 90; // 当前滚动位置 + 轻微偏移

                for (let i = 0; i < headings.length; i++) {
                    const heading = headings[i] as HTMLElement;
                    const rect = heading.getBoundingClientRect();
                    const headingTop = rect.top + window.scrollY;

                    if (headingTop <= scrollPosition) {
                        currentId = heading.id;
                    } else {
                        break;
                    }
                }
            }

            if (currentId) {
                setActiveId(currentId);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 初始检查

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [tocItems]);

    // 点击目录项，滚动到对应位置
    const handleTOCClick = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // 立即设置目标 ID 和高亮，避免经过中间标题
            setActiveId(id);
            isScrollingRef.current = true;
            targetIdRef.current = id;

            const rect = element.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            const offsetTop = absoluteTop - 80; // 考虑固定头部的高度

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });

            // 设置一个超时，确保即使检测失败也能恢复滚动监听
            setTimeout(() => {
                isScrollingRef.current = false;
                targetIdRef.current = '';
            }, 2000); // 2秒后自动恢复，防止卡住
        }
    };

    // 渲染目录项
    const renderTOCItem = (item: TOCItem, index: number): React.ReactNode => {
        const isActive = activeId === item.id;
        const paddingLeft = `${(item.level - 1) * 8}px`;

        return (
            <div key={`${item.id}-${index}`}>
                <div
                    onClick={() => handleTOCClick(item.id)}
                    className={`cursor-pointer py-1 px-2 rounded transition-all duration-200 ${
                        isActive
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 font-bold'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{paddingLeft}}
                >
                    <span className="text-sm">{item.title}</span>
                </div>
                {item.children && item.children.length > 0 && (
                    <div className="ml-2 hover:text-primary-100 dark:text-primary-600">
                        {item.children.map((child, childIndex) => renderTOCItem(child, childIndex))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`flex gap-6 ${className}`}>
            {/* 文章内容 */}
            <div className="flex-1 min-w-0">
                <div
                    ref={contentRef}
                    className="article-content
                        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900 dark:[&_h1]:text-gray-100
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-gray-900 dark:[&_h2]:text-gray-100
                        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4 [&_h3]:text-gray-900 dark:[&_h3]:text-gray-100
                        [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:text-gray-900 dark:[&_h4]:text-gray-100
                        [&_h5]:text-base [&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-2 [&_h5]:text-gray-900 dark:[&_h5]:text-gray-100
                        [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:mt-4 [&_h6]:mb-2 [&_h6]:text-gray-900 dark:[&_h6]:text-gray-100
                        [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-700 dark:[&_p]:text-gray-300
                        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-700 dark:[&_ul]:text-gray-300
                        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-gray-700 dark:[&_ol]:text-gray-300
                        [&_li]:mb-2 [&_li]:text-gray-700 dark:[&_li]:text-gray-300
                        [&_strong]:font-bold [&_strong]:text-gray-900 dark:[&_strong]:text-gray-100
                        [&_a]:text-primary-600 dark:[&_a]:text-primary-400 [&_a]:hover:underline
                        [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                        [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
                        [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 dark:[&_blockquote]:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:italic
                        [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4"
                    dangerouslySetInnerHTML={{__html: cleanedContent}}
                />
            </div>
            {/* 目录：展开时占据左侧宽度，隐藏时释放宽度 */}
            {showTOC && tocItems.length > 0 && !tocCollapsed && (
                <div className="w-64 flex-shrink-0">
                    {/* 占位，保持布局 */}
                </div>
            )}

            {/* 使用 Portal 将目录渲染到 body，完全脱离父元素的 transform 影响 */}
            {showTOC && tocItems.length > 0 && createPortal(
                !tocCollapsed ? (
                    <div
                        className="fixed top-20 right-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 z-50"
                        style={{
                            maxHeight: 'calc(100vh - 100px)',
                            width: '256px',
                        }}
                    >
                        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex justify-between items-center">
                            <div className="flex items-center">
                                <BookmarkMinus size={20} className="mr-1"/>
                                {tocTitle}
                            </div>
                            <button
                                type="button"
                                onClick={() => setTocCollapsed(true)}
                                className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                <ArrowLeftFromLine size={16}/>
                            </button>
                        </h3>
                        <div
                            className="space-y-1 overflow-y-auto overscroll-contain"
                            style={{maxHeight: 'calc(100vh - 200px)'}}
                        >
                            {tocItems.map((item, index) => renderTOCItem(item, index))}
                        </div>
                    </div>
                ) : (
                    <div className="fixed top-20 left-10 z-50">
                        <button
                            type="button"
                            onClick={() => setTocCollapsed(false)}
                            className="bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="展开目录"
                        >
                            <ArrowRightFromLine size={16}/>
                        </button>
                    </div>
                ),
                document.body
            )}

        </div>
    );
};

export default ArticleTOC;