import { useRef, useState, useEffect } from "react";
import "./article.css";
import { Button, message } from "antd";
import {AiEditor} from "aieditor";
import "aieditor/dist/style.css"



const initialContent = "AiEditor 是一个面向 AI 的开源富文本编辑器。 ";

const PublishArticle = () => {    //定义 ref
    const divRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<AiEditor | null>(null);
    const [content, setContent] = useState<string>(initialContent);

    //初始化 AiEditor 文档: https://www.aieditor.com.cn/docs/zh/config/toolbar.html

    useEffect(() => {
        if (divRef.current) {
            const aiEditor = new AiEditor({
                element: divRef.current,
                placeholder: "点击输入内容...",
                content: initialContent,
                toolbarExcludeKeys: ["heading", "font-family",  "ai","printer","attachment"],
                onChange: (editor) => {
                    const html = editor.getHtml();
                    setContent(html);
                }
            })
            editorRef.current = aiEditor;
            return ()=>{
                aiEditor.destroy();
                editorRef.current = null;
            }
        }
    }, [])

    const handlePublish = () => {
        const html = editorRef.current?.getHtml() ?? content;
        setContent(html);
        message.success("内容已收集");
        // 此处可调用发布接口或进一步处理 html
        console.log("发布内容:", html);
    }
  return (
      <div className="flex  w-[100vw] h-[100vh] mx-auto ">
        <div className="w-1/2 h-full relative">
        <div ref={divRef} style={{height: "600px"}} />
          <div className="mt-4">
            <Button type="primary" onClick={handlePublish}>确认发布</Button>
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
