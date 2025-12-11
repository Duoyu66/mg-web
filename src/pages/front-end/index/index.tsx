import { useEffect, useState, useRef } from "react";
import { BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss } from "lucide-react";
import Footer from "@/components/layoutPage/footer";

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
  const [activeIndex, setActiveIndex] = useState(-1); // -1 表示首页，0+ 表示对应的 section
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 监听滚动，更新高亮项
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observers: IntersectionObserver[] = [];

    // 监听首页
    const topBox = document.getElementById("topBox");
    if (topBox) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(-1);
          }
        });
      }, observerOptions);
      observer.observe(topBox);
      observers.push(observer);
    }

    // 监听各个 section
    webSites.forEach((_, idx) => {
      const section = document.getElementById(`section-${idx}`);
      if (section) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(idx);
            }
          });
        }, observerOptions);
        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // 更新指示器位置
  useEffect(() => {
    if (!indicatorRef.current) return;
    
    const targetIndex = activeIndex === -1 ? 0 : activeIndex + 1; // 首页是第一个，所以 +1
    const targetRef = navRefs.current[targetIndex];
    
    if (targetRef) {
      const container = targetRef.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetRef.getBoundingClientRect();
        const left = targetRect.left - containerRect.left;
        const width = targetRef.offsetWidth;
        
        indicatorRef.current.style.transform = `translateX(${left}px)`;
        indicatorRef.current.style.width = `${width}px`;
      }
    }
  }, [activeIndex, ready]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
    id="topBox"
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
        <div className="relative flex bg-gradient-to-br from-[rgba(235,237,240,0.85)] via-[rgba(233,236,238,0.81)] to-[rgba(254,254,255,0.87)] flex-wrap justify-center gap-3 rounded-full shadow-lg shadow-indigo-200/50 border border-indigo-100 px-4 py-3 sticky top-6 z-30 backdrop-blur-md">
          {/* 滑动背景指示器 */}
          <div
            ref={indicatorRef}
            className="absolute top-3 bottom-3 bg-indigo-100 rounded-full transition-all duration-300 ease-out"
            style={{
              left: 0,
              width: 0,
              opacity: activeIndex >= -1 ? 1 : 0,
            }}
          />
          
          <a
            ref={(el) => {
              navRefs.current[0] = el;
            }}
            onClick={(e) => {
              e.preventDefault();
              scrollTo("topBox");
            }}
            className={`relative z-10 cursor-pointer px-3 py-1 text-sm font-medium rounded-full transition ${
              activeIndex === -1
                ? "text-indigo-700 font-semibold"
                : "text-indigo-700 hover:text-indigo-500"
            }`}
          >
            首页
          </a>
          {webSites.map((item, idx) => (
            <a
              key={idx}
              ref={(el) => {
                navRefs.current[idx + 1] = el;
              }}
              href={`#section-${idx}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(`section-${idx}`);
              }}
              className={`relative z-10 px-3 py-1 text-sm font-medium rounded-full transition ${
                activeIndex === idx
                  ? "text-indigo-700 font-semibold"
                  : "text-indigo-700 hover:text-indigo-500"
              }`}
            >
              {item.title}
            </a>
          ))}
        </div>

        {/* 模块列表 */}
        <div className="grid gap-12">
          {webSites.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <section
                id={`section-${idx}`}
                key={idx}
                className={`group overflow-hidden rounded-2xl bg-white border border-indigo-100 shadow-xl shadow-indigo-100/50 transition-all duration-500 ${
                  ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ scrollMarginTop: "120px" }}
              >
                <div className={`flex flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"}`}>
                  {/* 图片区域 */}
                  <div
                    className={`w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center flex-shrink-0 ${
                      isEven ? "md:rounded-l-2xl" : "md:rounded-r-2xl"
                    }`}
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {/* 内容区域 */}
                  <div className="w-full md:w-1/2 p-8 space-y-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-indigo-600">
                      {item.icon}
                      <span className="text-sm">{item.url.replace(/^https?:\/\//, "")}</span>
                    </div>
                    <h3 className="text-3xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                    <div className="flex justify-start pt-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-md shadow-indigo-300/50 hover:bg-indigo-400 transition"
                      >
                        立即前往
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

 
      </div>
      <Footer/>
    </div>
  );
}