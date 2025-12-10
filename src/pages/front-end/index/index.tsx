import { useEffect, useState } from "react";
import { BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss } from "lucide-react";

const webSites = [
  {
    title: "木瓜一块八",
    url: "https://www.pawpaw18.cn/",
    description: "这是一段描述",
    icon: <Rss />,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  },
  {
    title: "学习后台",
    url: "https://stu.pawpaw18.cn/",
    description: "这是一段描述",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800",
    icon: <BookOpen />,
  },
  {
    title: "音乐盒",
    url: "https://stu.pawpaw18.cn/",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    description: "这是一段描述",
    icon: <Music />,
  },
  {
    title: "刷题平台",
    url: "https://stu.pawpaw18.cn/",
    description: "这是一段描述",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    icon: <MessageCircleQuestionMark />,
  },
  {
    title: "木瓜编程",
    url: "https://stu.pawpaw18.cn/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    description: "这是一段描述",
    icon: <Code />,
  },
  {
    title: "语雀知识库",
    url: "https://stu.pawpaw18.cn/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    description: "这是一段描述",
    icon: <BookMarked />,
  },
];

const doubaoUrl = "https://www.doubao.com/download/desktop?ug_apk_token=dkR31";

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        scrollBehavior: "smooth",
        paddingTop: "96px", // 预留顶部空间
      }}
    >
      <div className="mx-auto max-w-6xl px-6 pb-16 space-y-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-500">豆包桌面版</p>
            <h1 className="text-4xl font-bold leading-tight mt-2 text-indigo-900">高效创作与协作，从这里开始</h1>
            <p className="text-gray-600 mt-2">
              下载安装豆包桌面端，体验更流畅的 AI 创作与知识管理。
            </p>
          </div>
          <a
            href={doubaoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition"
          >
            立即下载
          </a>
        </header>

        {/* 锚点导航 */}
        <div className="flex flex-wrap justify-center gap-3 rounded-full bg-white shadow-lg shadow-indigo-200/50 border border-indigo-100 px-4 py-3 sticky top-6 z-30 backdrop-blur-md">
       <a >首页</a>
          {webSites.map((item, idx) => (
            <a
              key={idx}
              href={`#section-${idx}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(`section-${idx}`);
              }}
              className="px-3 py-1 text-sm font-medium text-indigo-700 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition"
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* 模块列表 */}
        <div className="grid gap-8">
          {webSites.map((item, idx) => (
            <section
              id={`section-${idx}`}
              key={idx}
              className={`group overflow-hidden rounded-2xl bg-white border border-indigo-100 shadow-xl shadow-indigo-100/50 transition-all duration-500 ${
                ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ scrollMarginTop: "120px" }}
            >
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-indigo-600">
                  {item.icon}
                  <span className="text-sm">{item.url.replace(/^https?:\/\//, "")}</span>
                </div>
                <h3 className="text-2xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
                <div className="flex justify-end">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-300/50 hover:bg-indigo-400 transition"
                  >
                    立即前往
                  </a>
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="text-sm text-gray-400">
          豆包桌面版下载：{doubaoUrl}
        </footer>
      </div>
    </div>
  );
}