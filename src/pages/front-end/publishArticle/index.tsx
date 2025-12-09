import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import "./article.css";
import { Button, Spin, message } from "antd";
import { uploadOssFile } from "@/pages/front-end/utils/UploadOss";
type TinyMCEEditor = {
  getContent: () => string;
};
const PublishArticle = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = useState(
    "<p>这是初始内容，开始编辑吧。</p>"
  );
  const [loading, setLoading] = useState(true);
  const languageUrl =
    "https://cdn.jsdelivr.net/npm/tinymce@6/langs/zh_CN.js";

  return (
    <Spin
      spinning={loading}
      tip="编辑器加载中..."
      wrapperClassName="w-full h-full"
      className="flex items-center justify-center min-h-[100vh]"
    >
      <div className="flex gap-4 w-[100vw] h-[100vh] mx-auto p-2">
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
                // 显示上传进度（TinyMCE会自动处理）
                progress(0);
                
                const blob = blobInfo.blob();
                // 转成带文件名的 File，确保 ali-oss 接收正确类型
                const file = new File([blob], blobInfo.filename(), {
                  type: blob.type,
                });

                // 上传到OSS
                const url = await uploadOssFile(
                  file,
                  "articles/images/"
                );
                
                progress(100);
                message.success('图片上传成功');
                
                // 返回OSS的URL
                return url;
              } catch (error) {
                message.error('图片上传失败，请重试');
                throw error;
              }
            },
            // 允许粘贴图片
            paste_data_images: true,
            // 自动上传粘贴的图片
            automatic_uploads: true,
          }}
        />
        <div className="mt-4">
          <Button type="primary">确认发布</Button>
        </div>
      </div>
      <div className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-md  overflow-auto min-h-[500px]">
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
