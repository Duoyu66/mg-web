import React, {useEffect, useMemo, useRef, useState} from 'react';

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
                                                   tocTitle = '目录',
                                                   className = '',
                                               }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

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

    // 监听滚动，高亮当前标题
    useEffect(() => {
        if (!contentRef.current || tocItems.length === 0) return;

        const handleScroll = () => {
            const headings = contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (!headings || headings.length === 0) return;

            let currentId = '';

            // 从下往上查找当前可见的标题
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i] as HTMLElement;
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    currentId = heading.id;
                    break;
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
            const offsetTop = element.offsetTop - 80; // 考虑固定头部的高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth',
            });
            setActiveId(id);
        }
    };

    // 渲染目录项
    const renderTOCItem = (item: TOCItem, index: number): React.ReactNode => {
        const isActive = activeId === item.id;
        const paddingLeft = `${(item.level - 1) * 16}px`;

        return (
            <div key={`${item.id}-${index}`}>
                <div
                    onClick={() => handleTOCClick(item.id)}
                    className={`cursor-pointer py-1 px-2 rounded transition-colors duration-200 ${
                        isActive
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    style={{paddingLeft}}
                >
                    <span className="text-sm">{item.title}</span>
                </div>
                {item.children && item.children.length > 0 && (
                    <div className="ml-2">
                        {item.children.map((child, childIndex) => renderTOCItem(child, childIndex))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`flex gap-6 ${className}`}>
            {/* 目录 */}
            {showTOC && tocItems.length > 0 && (
                <aside className="fixed top-0 w-64 flex-shrink-0">
                    <div
                        className="fixed top-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 z-10"
                        style={{
                            position: 'sticky',
                            top: '80px',
                            alignSelf: 'flex-start',
                        }}
                    >
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                            {tocTitle}
                        </h3>
                        <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
                            {tocItems.map((item, index) => renderTOCItem(item, index))}
                        </div>
                    </div>
                </aside>
            )}

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
        </div>
    );
};

export default ArticleTOC;

