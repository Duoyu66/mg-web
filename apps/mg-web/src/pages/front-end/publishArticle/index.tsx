import { useRef, useState, useEffect } from "react";
import "./article.css";
import { Button, message, Input, Segmented, Tooltip } from "antd";
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { useSendPost } from "./hooks/useSendPost";
import { ArrowLeft, Send, Edit3, Eye, LayoutTemplate, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

type MentionUser = {
  id: string;
  label: string;
};

const initialContent = "";

const mentionUsers: MentionUser[] = [
  { id: "user1", label: "用户1" },
  { id: "user2", label: "用户2" },
  { id: "user3", label: "用户3" },
];

const highlightMentionsInHtml = (html: string) => {
  if (!html || !html.includes("@")) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const mentionRegex = /@([\w\u4e00-\u9fa5]+)/g;

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text.includes("@")) return;

      let match;
      let lastIndex = 0;
      const frag = doc.createDocumentFragment();

      while ((match = mentionRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          frag.appendChild(
            doc.createTextNode(text.slice(lastIndex, match.index))
          );
        }

        const matchedText = match[1];
        const span = doc.createElement("span");
        span.textContent = `@${matchedText}`;
        span.className =
          "mg-mention text-primary-600 dark:text-primary-400 font-medium hover:underline cursor-pointer";
        frag.appendChild(span);

        lastIndex = match.index + 1 + matchedText.length;
      }

      if (lastIndex === 0) return;

      if (lastIndex < text.length) {
        frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
      }

      if (node.parentNode) {
        node.parentNode.replaceChild(frag, node);
      }

      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tag = el.tagName.toLowerCase();
      if (tag === "script" || tag === "style") return;
      const children = Array.from(el.childNodes);
      children.forEach(walk);
    }
  };

  walk(doc.body);
  return doc.body.innerHTML;
};

const PublishArticle = () => {
  const navigate = useNavigate();
  //定义 ref
  const divRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<AiEditor | null>(null);
  const [content, setContent] = useState<string>(initialContent);
  const [title, setTitle] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");

  const { mutate: publish, isPending } = useSendPost();

  // 监听窗口大小自动切换视图模式
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (viewMode === 'split') setViewMode('edit');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化检查
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //初始化 AiEditor 文档: https://www.aieditor.com.cn/docs/zh/config/toolbar.html
  useEffect(() => {
    if (divRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: "在此输入正文内容...",
        content: initialContent,
        toolbarExcludeKeys: [
          "heading",
          "font-family",
          "ai",
          "printer",
          "attachment",
        ],
        onMentionQuery: (query: string) => {
          const text = query.toLowerCase();
          return mentionUsers
            .filter((user) => user.label.toLowerCase().includes(text))
            .slice(0, 5)
            .map((user) => ({
              id: user.id,
              label: user.label,
            }));
        },
        onChange: (editor) => {
          const rawHtml = editor.getHtml();
          const html = highlightMentionsInHtml(rawHtml);
          setContent(html);
        },
      });
      editorRef.current = aiEditor;
      return () => {
        aiEditor.destroy();
        editorRef.current = null;
      };
    }
  }, []);

  const handlePublish = () => {
    const rawHtml = editorRef.current?.getHtml() ?? content;
    let finalHtml = rawHtml;

    // 如果有标题，将标题作为 h1 标签插入到内容顶部
    if (title.trim()) {
      finalHtml = `<h1 style="font-size: 2em; font-weight: bold; margin-bottom: 0.8em; color: #1a1a1a;">${title}</h1>${rawHtml}`;
    } else {
      message.warning("请输入文章标题");
      return;
    }

    if (!rawHtml || rawHtml === '<p><br></p>') {
      message.warning("请输入文章内容");
      return;
    }

    const textContent = new DOMParser().parseFromString(rawHtml, 'text/html').body.textContent || "";
    if (textContent.length > 5000) {
      message.warning("发布内容不能超过5000个字符");
      return;
    }

    publish({ title,content: finalHtml }, {
      onSuccess: () => {
        message.success("发布成功");
        navigate(-1);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col h-screen overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              type="text" 
              icon={<ArrowLeft size={20} />} 
              onClick={() => navigate(-1)}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            />
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 hidden sm:block">
              发布文章
            </h1>
          </div>

          <div className="flex items-center gap-3">
             {/* 视图切换器 - 大屏显示 */}
             <div className="hidden lg:block">
                <Segmented 
                   value={viewMode} 
                   onChange={(v) => setViewMode(v as any)}
                   options={[
                      { label: '编辑', value: 'edit', icon: <Edit3 size={14} /> },
                      { label: '分栏', value: 'split', icon: <LayoutTemplate size={14} /> },
                      { label: '预览', value: 'preview', icon: <Eye size={14} /> }
                   ]} 
                />
             </div>
             {/* 视图切换器 - 小屏显示 */}
             <div className="lg:hidden">
                <Segmented 
                   value={viewMode === 'split' ? 'edit' : viewMode} 
                   onChange={(v) => setViewMode(v as any)}
                   options={[
                      { label: '编辑', value: 'edit', icon: <Edit3 size={14} /> },
                      { label: '预览', value: 'preview', icon: <Eye size={14} /> }
                   ]} 
                />
             </div>

             <Button 
                type="primary" 
                icon={<Send size={16} />} 
                loading={isPending}
                onClick={handlePublish}
                className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:opacity-90 shadow-md px-6"
             >
                发布
             </Button>
          </div>
        </div>
      </header>

      {/* 主体内容区 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 编辑区 */}
        <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${
            viewMode === 'preview' ? 'hidden' : 'block'
        }`}>
          <div className="h-full flex flex-col max-w-5xl mx-auto w-full px-4 pt-2 overflow-hidden">
            {/* 标题输入 */}
            <Input 
               size="large" 
               placeholder="请输入文章标题..." 
               value={title}
               onChange={e => setTitle(e.target.value)}
               className="mb-4 text-2xl font-bold border-none shadow-none bg-transparent focus:shadow-none px-0 placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-900 dark:text-gray-100"
               variant="borderless"
               maxLength={50}
            />
            
            {/* 编辑器容器 */}
            <div className="flex-1 mt-1 border-t border-red bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col relative">
                <div ref={divRef} style={{ height: '100%' }} className="ai-editor-container" /> 
            </div>
          </div>
        </div>

        {/* 预览区 */}
        <div className={`flex-1 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto custom-scrollbar transition-all duration-300 ${
            viewMode === 'edit' ? 'hidden' : 'block'
        } ${viewMode === 'split' ? 'max-w-[50%]' : 'w-full'}`}>
           <div className="px-4 py-2  max-w-4xl mx-auto min-h-full bg-white dark:bg-gray-800 shadow-sm   ">
              {title ? (
                <h1 className="text-xl font-bold mb-0 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {title}
                </h1>
              ) : (
                <div className="text-xl font-bold mb-8 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-300">
                  文章标题
                </div>
              )}
              
              <div 
                 className="prose dark:prose-invert max-w-none article-content min-h-[400px]"
                 dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">文章内容预览区域...</p>' }}
              />
           </div>
        </div>
      </main>
    </div>
  );
};

export default PublishArticle;
