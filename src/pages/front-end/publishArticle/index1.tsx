import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState, useEffect } from "react";
import "./article.css";
import { Button, Spin, message } from "antd";
import { uploadOssFile } from "@/pages/front-end/utils/UploadOss";

type TinyMCEEditor = {
  getContent: () => string;
};

const PublishArticle = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = useState("<p>请输入文章内容</p>");
  const [loading, setLoading] = useState(true);
  const languageUrl = "https://cdn.jsdelivr.net/npm/tinymce@6/langs/zh_CN.js";

  useEffect(() => {
    // 在组件加载时手动设置编辑器语言
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.ui.registry.addContextToolbar("textSelection", {
        items: "bold italic | link",
        position: "bottom",
      });
    }
  }, []);

  return (
    <Spin
      spinning={loading}
      tip="编辑器加载中..."
      wrapperClassName="w-full h-full"
      className="flex items-center justify-center min-h-[100vh]"
    >
      <div className="flex gap-4 w-[100vw] h-[100vh] mx-auto ">
        <div className="w-1/2 h-full relative">
          <Editor
            apiKey="1675407wy1e3fwoi4glhtsgt0tmi16m1u7zl3bhu1lf3qa5e"
            onInit={(_evt, editor) => {
              editorRef.current = editor;
              setLoading(false);
            }}
            initialValue={content}
            onEditorChange={(value) => setContent(value)}
            init={{
              codesample_languages: [
                { text: "HTML/XML", value: "markup" },
                { text: "JavaScript", value: "javascript" },
                { text: "CSS", value: "css" },
                { text: "PHP", value: "php" },
                { text: "Ruby", value: "ruby" },
                { text: "Python", value: "python" },
                { text: "Java", value: "java" },
                { text: "C", value: "c" },
                { text: "C#", value: "csharp" },
                { text: "C++", value: "cpp" },
              ],
              language: "zh_CN",
              language_url: languageUrl,
              plugins: [
                "codesample",
                "code",
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "codesample code undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              // 配置图片上传到OSS
              images_upload_handler: async (
                blobInfo: { blob: () => Blob; filename: () => string },
                progress: (percent: number) => void
              ) => {
                try {
                  progress(0);
                  const blob = blobInfo.blob();
                  const file = new File([blob], blobInfo.filename(), {
                    type: blob.type,
                  });
                  const url = await uploadOssFile(file, "articles/images/");
                  progress(100);
                  message.success("图片上传成功");
                  return url;
                } catch (error) {
                  message.error("图片上传失败，请重试");
                  throw error;
                }
              },
              paste_data_images: true,
              automatic_uploads: true,
              // 新增配置解决光标问题
              body_class: "editor-body",
              // 禁止阻止输入的关键特性
              fix_list_elements: true,
              remove_trailing_brs: true,
              forced_root_block: "p", // 强制父元素为p标签
              force_br_newlines: false, // 禁止换行符会替换掉br
              force_p_newlines: false, // 禁止换行符会替换掉p
              // 其他增强输入体验的配置
              plugins: [
                "textpattern", "table", "lists", "media", "fullscreen", "autolink", "link", "searchreplace"
              ]
            }}
          />
          <div className="mt-4">
            <Button type="primary">确认发布</Button>
          </div>
        </div>
        <div className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-md overflow-auto min-h-[500px]">
          <div
            className="prose dark:prose-invert max-w-none article-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </Spin>
  );
};

export default PublishArticle;
