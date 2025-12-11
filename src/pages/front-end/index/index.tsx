import { useEffect, useState, useRef, useCallback } from "react";
import { BookMarked, BookOpen, Code, MessageCircleQuestionMark, Music, Rss } from "lucide-react";
import Footer from "@/components/layoutPage/footer";
import { useNavigate } from "react-router-dom";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const isManualScrollingRef = useRef(false);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // 滚动检测 - 使用防抖避免频繁更新
  useEffect(() => {
    let rafId: number | null = null;
    let lastActiveIndex = -1;

    const updateActiveIndex = () => {
      // 如果正在手动滚动，完全跳过自动检测
      if (isManualScrollingRef.current) {
        return;
      }

      const sections = webSites.map((_, idx) =>
        document.getElementById(`section-${idx}`)
      );
      const topBox = document.getElementById("topBox");
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.3;

      let newActiveIndex = -1;
      let minDistance = Infinity;

      // 检查首页
      if (topBox) {
        const rect = topBox.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
          newActiveIndex = -1;
        } else if (rect.top < viewportHeight && rect.bottom > 0) {
          const distance = Math.abs(rect.top - triggerPoint);
          if (distance < minDistance) {
            minDistance = distance;
            newActiveIndex = -1;
          }
        }
      }

      // 检查各个 section
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
            newActiveIndex = i;
            break; // 找到精确匹配，直接返回
          } else if (rect.top < viewportHeight && rect.bottom > 0) {
            const distance = Math.abs(rect.top - triggerPoint);
            if (distance < minDistance) {
              minDistance = distance;
              newActiveIndex = i;
            }
          }
        }
      }

      // 只在索引变化时更新，避免不必要的重渲染
      // 再次检查手动滚动标志，防止在检查过程中被设置
      if (!isManualScrollingRef.current && newActiveIndex !== lastActiveIndex) {
        lastActiveIndex = newActiveIndex;
        setActiveIndex(newActiveIndex);
      }
    };

    const handleScroll = () => {
      // 如果正在手动滚动（点击导航），跳过自动检测
      if (isManualScrollingRef.current) {
        return;
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateActiveIndex);
    };

    // 初始检查（只在非手动滚动时）
    if (!isManualScrollingRef.current) {
      updateActiveIndex();
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
      if (!isManualScrollingRef.current) {
        updateActiveIndex();
      }
    }, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveIndex);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // 指示器位置更新 - 快速丝滑平移
  useEffect(() => {
    if (!ready || !indicatorRef.current) return;

    const updateIndicator = () => {
      const targetIndex = activeIndex === -1 ? 0 : activeIndex + 1;
      const targetRef = navRefs.current[targetIndex];

      if (!targetRef || !indicatorRef.current) {
        return;
      }

      const container = targetRef.parentElement;
      if (!container) return;

      // 使用 getBoundingClientRect 获取精确位置
      const containerRect = container.getBoundingClientRect();
      const targetRect = targetRef.getBoundingClientRect();

      const left = targetRect.left - containerRect.left;
      const width = targetRef.offsetWidth;

      // 直接更新，使用 CSS transition 实现平滑动画
      if (indicatorRef.current) {
        // 如果正在手动滚动，使用更快的过渡时间
        const transitionDuration = isManualScrollingRef.current ? "0.2s" : "0.25s";
        indicatorRef.current.style.transition = `transform ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1), width ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`;
        indicatorRef.current.style.transform = `translateX(${left}px)`;
        indicatorRef.current.style.width = `${width}px`;
        indicatorRef.current.style.opacity = "1";
      }
    };

    // 立即更新，不等待任何延迟，确保快速响应
    updateIndicator();
  }, [activeIndex, ready]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
  
    // 锁定自动滚动检测
    isManualScrollingRef.current = true;
  
    // 立即更新 activeIndex 使指示器秒到位
    let targetIndex = -1;
    if (id === "topBox") {
      targetIndex = -1;
    } else {
      const match = id.match(/^section-(\d+)$/);
      if (match) targetIndex = parseInt(match[1], 10);
    }
    setActiveIndex(targetIndex);
  
    const rect = el.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    const navHeight = navContainerRef.current?.offsetHeight ?? 0;
    const end = id === "topBox" ? 0 : Math.max(absoluteTop - navHeight - 24, 0);
    const start = window.scrollY;
    const distance = end - start;
  
    const duration = Math.min(Math.max(Math.abs(distance) / 1.6, 450), 1100);
    const startTime = performance.now();
  
    function animateScroll(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
  
      // easeInOutCubic（比 smooth 更稳定）
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  
      window.scrollTo(0, start + distance * eased);
  
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        setTimeout(() => {
          isManualScrollingRef.current = false;
        }, 200);
      }
    }
  
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(animateScroll);
  }, []);
  

  return (
    <div
      id="topBox"
      className="min-h-screen text-gray-900"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        paddingTop: "96px",
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
          <span
            onClick={() => {
              navigate('/front/home')
            }}
            className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 transition"
          >
            立即下载
          </span>
        </header>

        {/* Anchor Navigation */}
        <div ref={navContainerRef} className="relative flex bg-gradient-to-br from-[rgba(235,237,240,0.85)] via-[rgba(233,236,238,0.81)] to-[rgba(254,254,255,0.87)] flex-wrap justify-center gap-3 rounded-full shadow-lg shadow-indigo-200/50 border border-indigo-100 px-4 py-3 sticky top-6 z-30 backdrop-blur-md">
          {/* 滑动背景指示器 */}
          <div
            ref={indicatorRef}
            className="absolute top-3 bottom-3 bg-indigo-100 rounded-full pointer-events-none"
            style={{
              left: 0,
              width: 0,
              opacity: 0,
              transform: "translateX(0px)",
              transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s ease-out",
              willChange: "transform, width",
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

        {/* Modules List */}
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
                  {/* Image Section */}
                  <div
                    className={`w-full md:w-1/2 h-64 md:h-auto bg-cover bg-center flex-shrink-0 ${
                      isEven ? "md:rounded-l-2xl" : "md:rounded-r-2xl"
                    }`}
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  {/* Content Section */}
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
      <Footer />
    </div>
  );
}
