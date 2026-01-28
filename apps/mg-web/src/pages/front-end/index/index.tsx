import { useState } from "react";
import { BookMarked, BookOpen, Code, Music } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/layoutPage/footer";
import { useNavigate } from "react-router-dom";

const heroCtas = [
  { label: "免费下载", sub: "适配 macOS", type: "primary" as const },
  {
    label: "查看全部功能",
    sub: "滚动、手势、自定义动作",
    type: "ghost" as const,
  },
];

const coreFeatures = [
  {
    icon: <Code className="w-6 h-6 text-indigo-500" />,
    title: "触控板级多指手势",
    desc: "按住鼠标键 4 或 5，再拖动或滚动，即可完成桌面、全屏 App 切换、Launchpad、任务视图等操作，就像在触控板上用三指或四指轻扫一样自然。",
    tag: "手势映射",
  },
  {
    icon: <Music className="w-6 h-6 text-emerald-500" />,
    title: "顺滑滚动和平滑度模式",
    desc: "在“平滑度：高、常规、关”之间切换，获得从极致丝滑到系统原生的不同滚动体验，并保留动量和弹跳等细节。",
    tag: "滚动体验",
  },
  {
    icon: <BookMarked className="w-6 h-6 text-sky-500" />,
    title: "只改变鼠标，不动触控板",
    desc: "独立配置鼠标的滚动方向和增强效果，完全不影响触控板或妙控鼠标的原有设置，想开就开、想关就关。",
    tag: "无侵入",
  },
];

const gestureShowcase = [
  {
    title: "按住鼠标键 4 + 上移",
    highlight: "查看所有已打开窗口、桌面和全屏 App",
    body: "操作方式就像在触控板上用四指向上轻扫一样，一下子看清当前所有空间，快速切换工作区。",
  },
  {
    title: "按住鼠标键 4 + 上下滚动",
    highlight: "在桌面与“启动台”之间来回切换",
    body: "向上滚动显示桌面，向下滚动打开 Launchpad，对应触控板上展开和合拢拇指与三指的手势。",
  },
  {
    title: "按住鼠标键 5 + 拖动或滚轮",
    highlight: "在页面间前进/后退、缩放以及 360° 导航",
    body: "左右拖动在浏览器和邮件中前进后退，上下滚轮放大缩小，任意方向拖动在 Excel、Affinity Photo 等专业应用中自由拖拽画布。",
  },
];

const smoothModes = [
  {
    name: "平滑度：高",
    desc: "滚动体验会变得无与伦比地丝滑，就像在使用触控板一样。页面末尾轻微的弹跳和基于动量的动画，让滚动过程充满动感，同时依然响应迅速且易于控制，适合长距离滚动。",
    icon: <Music className="w-4 h-4 text-indigo-400" />,
  },
  {
    name: "平滑度：常规",
    desc: "实现高速响应的滚动效果，仿佛用手指直接推动页面。带有短暂的动量动画，滚动感受与 Chrome 等现代浏览器或 Windows 应用中的自然滚动相似。",
    icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
  },
  {
    name: "平滑度：关",
    desc: "滚动行为与 macOS 默认状态一致，不添加额外动画，但滚轮每转动一格都滚动固定行数，而非几个像素，导航更具一致性和舒适感，适用于多系统和旧版本 macOS。",
    icon: <BookMarked className="w-4 h-4 text-slate-300" />,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [activeSmoothMode, setActiveSmoothMode] = useState(smoothModes[0].name);

  const activeSmooth =
    smoothModes.find((mode) => mode.name === activeSmoothMode) ??
    smoothModes[0];

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, #dbeafe 0%, transparent 55%), radial-gradient(circle at 100% 0%, #dbeafe 0%, transparent 55%), linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        paddingTop: "96px",
      }}
    >
      <main className="mx-auto max-w-6xl px-6 pb-20 space-y-24">
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center"
        >
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>Mac Mouse Fix · 让你的鼠标拥有触控板的全部本领</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900">
                Mac 用触控板最厉害。
                <span className="block bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  时代变了。
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 max-w-xl">
                Mac Mouse Fix 可以将苹果触控板拥有的所有功能（甚至更多）赋予给你那只精准且符合人体工学设计的第三方鼠标，并让你所有的交互就像在触控板上一样丝滑又自然。
              </p>
              <p className="text-xs md:text-sm text-slate-500 max-w-xl">
                注意：要完整体验以上触控板功能，你的第三方鼠标需要至少 5 个物理按键（左键、右键、中键及两个侧边键）。按键数不足时仍可使用核心功能，但部分操作便捷性会有所降低。
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {heroCtas.map((cta) => (
                <button
                  key={cta.label}
                  onClick={() => {
                    if (cta.type === "primary") {
                      window.open("https://macmousefix.com/zh-Hans/", "_blank");
                    } else {
                      const el = document.getElementById("features");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }
                  }}
                  className={[
                    "inline-flex flex-col items-start justify-center rounded-2xl px-5 py-3 text-sm md:text-base font-semibold shadow-sm transition transform hover:-translate-y-0.5",
                    cta.type === "primary"
                      ? "bg-indigo-500 text-white shadow-indigo-500/30 hover:bg-indigo-400"
                      : "bg-white/80 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span>{cta.label}</span>
                  <span className="text-[11px] font-normal opacity-80">
                    {cta.sub}
                  </span>
                </button>
              ))}
              <button
                onClick={() => navigate("/front/home")}
                className="inline-flex items-center gap-1 rounded-full bg-transparent px-3 py-2 text-xs font-medium text-slate-600 hover:text-indigo-600"
              >
                或继续浏览木瓜其他产品
                <span aria-hidden>→</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-6 text-[11px] md:text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>标准五键鼠标均可使用，更多按键可解锁自定义动作</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>不会影响触控板或妙控鼠标设置，可独立调整滚动方向</span>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/15 via-sky-400/10 to-emerald-400/15 blur-2xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-medium text-slate-500">
                  Mac Mouse Fix · 手势预览
                </span>
              </div>
              <div className="p-6 space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                  className="rounded-2xl bg-slate-900 text-slate-50 px-4 py-3 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      手势示例
                    </p>
                    <p className="text-sm font-semibold">
                      按住鼠标键 4 然后拖动鼠标向上
                    </p>
                    <p className="text-[11px] text-slate-300">
                      查看所有已打开窗口、应用程序和桌面的概览，就像四指向上轻扫一样。
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                    <Code className="w-5 h-5 text-indigo-400" />
                  </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    <p className="font-medium text-slate-800 mb-1">
                      键 4 + 上滚
                    </p>
                    <p>显示桌面，清空视觉噪音，对应触控板上展开拇指与三指。</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    <p className="font-medium text-slate-800 mb-1">
                      键 4 + 下滚
                    </p>
                    <p>打开“启动台”，快速启动常用应用，对应拇指与三指合拢。</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    <p className="font-medium text-slate-800 mb-1">
                      键 5 + 左右拖动
                    </p>
                    <p>在 Safari 等浏览器中前进或后退页面，就像双指左右轻扫。</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 }}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    <p className="font-medium text-slate-800 mb-1">
                      键 5 + 滚轮缩放
                    </p>
                    <p>在网页或 PDF 中放大缩小内容，对应双指捏合或张开。</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          id="features"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-indigo-500">
                核心功能
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
                将触控板的强大手势完整搬到你的鼠标上
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                在应用内通过在触控板上滑动手指完成的任何手势操作，使用 Mac
                Mouse Fix 同样可以轻松实现，只需按住额外按键，再移动或滚动你的鼠标即可。
              </p>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              无需费心调试，你选择的所有选项都会带来出色的使用体验；如果你更习惯
              macOS 的原生滚动方式，也可以随时关闭所有增强功能。
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: index * 0.06,
                }}
                className="group rounded-2xl border border-slate-200 bg-white/90 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-200 p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 flex-1">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start"
        >
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span>手势一览</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              按住一个按键，把你最常用的系统动作串联起来
            </h2>
            <p className="text-sm md:text-base text-slate-600 max-w-xl">
              在访达中预览文件、在 Safari 中预览网页、在词典中查单词，或在全屏
              App 与桌面之间移动，这些在触控板上用三指或四指就能完成的操作，现在都可以通过鼠标键
              4 和 5 轻松触发。
            </p>
            <div className="space-y-4">
              {gestureShowcase.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                    delay: index * 0.06,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 flex flex-col gap-1.5"
                >
                  <p className="text-[11px] font-medium text-indigo-600">
                    {item.title}
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.highlight}
                  </p>
                  <p className="text-xs md:text-sm text-slate-600">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-900 text-slate-50 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                  平滑度模式
                </p>
                <p className="mt-1 text-lg font-semibold">
                  选择一种滚动手感，看看效果
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-[11px]">
              {smoothModes.map((mode) => (
                <button
                  key={mode.name}
                  onClick={() => setActiveSmoothMode(mode.name)}
                  className={[
                    "flex-1 rounded-full px-3 py-1.5 border text-xs transition-colors",
                    activeSmoothMode === mode.name
                      ? "bg-slate-50 text-slate-900 border-slate-100"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {mode.name}
                </button>
              ))}
            </div>
            <motion.div
              key={activeSmooth.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex gap-3 rounded-2xl bg-slate-800/90 px-3.5 py-3"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900/70">
                {activeSmooth.icon}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-50">
                  {activeSmooth.name}
                </p>
                <p className="text-[11px] text-slate-300">{activeSmooth.desc}</p>
              </div>
            </motion.div>
            <p className="text-[11px] text-slate-400">
              如果你更习惯 macOS 的原生滚动方式，Mac Mouse Fix
              提供的每一项滚动增强功能都可以关闭，只保留手势和按键映射。
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl border border-slate-200 bg-white/90 px-6 py-7 md:px-8 md:py-9 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-indigo-500">
              立即体验
            </p>
            <h2 className="mt-2 text-xl md:text-2xl font-bold text-slate-900">
              让你的鼠标和触控板一样好用，而不是二选一
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-600 max-w-xl">
              只需几分钟完成配置，你就能在浏览网页、阅读文档、写作和开发中感受到细微却持续的提升——几乎所有你在触控板上能想到的操作，都可以在鼠标上完成。
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 min-w-[220px]">
            <button
              onClick={() =>
                window.open("https://macmousefix.com/zh-Hans/", "_blank")
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-md shadow-indigo-400/30 hover:bg-indigo-400 transition"
            >
              <span>前往 Mac Mouse Fix 下载页面</span>
              <span aria-hidden>↗</span>
            </button>
            <button
              onClick={() => navigate("/front/home")}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              继续浏览木瓜编程其他功能
              <span aria-hidden>→</span>
            </button>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
