import { useRef, useState, useEffect } from "react";
import "./article.css";
import { Button, message } from "antd";
import { AiEditor } from "aieditor";
import "aieditor/dist/style.css";
import { useSendPost } from "./hooks/useSendPost";

type MentionUser = {
  id: string;
  label: string;
};

const initialContent = "写点什么~";

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
  //定义 ref
  const divRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<AiEditor | null>(null);
  const [content, setContent] = useState<string>(initialContent);

  const { mutate: publish, isPending } = useSendPost();

  //初始化 AiEditor 文档: https://www.aieditor.com.cn/docs/zh/config/toolbar.html

  useEffect(() => {
    if (divRef.current) {
      const aiEditor = new AiEditor({
        element: divRef.current,
        placeholder: "点击输入内容...",
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
    const html = editorRef.current?.getHtml() ?? content;
    setContent(html);
    
    publish({ content: html }, {
      onSuccess: () => {
        message.success("发布成功");
      }
    });
  };
  return (
    <div className="flex  w-[100vw] h-[100vh] mx-auto ">
      <div className="w-1/2 h-full relative">
        <div ref={divRef} style={{ height: "600px" }} />
        <div className="mt-4">
          <Button type="primary" onClick={handlePublish} loading={isPending}>
            确认发布
          </Button>
        </div>
      </div>
      <div className="w-1/2   dark:border-gray-600  overflow-auto min-h-[500px]">
        <div
          className="prose dark:prose-invert max-w-none article-content p-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default PublishArticle;
