import { useState } from "react";
import {
  BookMarked,
  BookOpen,
  Code2,
  LineChart,
  BriefcaseBusiness,
  Compass,
  Rss,
  MessageCircleQuestionMark,
  Rocket,
  Sparkles,
  Users,
  GraduationCap,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/layoutPage/footer";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/context/useTheme";

const personas = [
  "自学入门",
  "准备校招 / 秋招",
  "在职系统进阶",
  "跨专业转前端",
];

const heroModes = [
  {
    id: "learn",
    label: "学习模式",
    desc: "专注路线与知识体系，把零散知识点拼接成清晰的知识树。",
  },
  {
    id: "practice",
    label: "刷题模式",
    desc: "以题目驱动练习，错题自动沉淀到记录中，形成个人薄弱点地图。",
  },
  {
    id: "career",
    label: "求职模式",
    desc: "围绕目标岗位梳理项目、简历和面经，把能力翻译成拿 Offer 的筹码。",
  },
];

const heroStats = [
  {
    label: "前端与算法题目",
    value: "1500+",
    icon: <MessageCircleQuestionMark className="w-4 h-4 text-cyan-400" />,
  },
  {
    label: "实战学习路线",
    value: "20+",
    icon: <Compass className="w-4 h-4 text-violet-400" />,
  },
  {
    label: "真实简历和面经",
    value: "300+",
    icon: <BriefcaseBusiness className="w-4 h-4 text-emerald-400" />,
  },
];

const modules = [
  {
    icon: <Code2 className="w-5 h-5 text-cyan-300" />,
    title: "刷题练功房",
    desc: "覆盖基础、进阶与高频面试题，配合错题本和模拟考试，持续打磨基本功。",
    tag: "题库 · 模拟面试",
  },
  {
    icon: <GraduationCap className="w-5 h-5 text-violet-300" />,
    title: "路线学习场景",
    desc: "围绕真实项目拆解知识树，从入门到进阶，每一个阶段都有明确“下一步”。",
    tag: "路线 · 课程",
  },
  {
    icon: <BriefcaseBusiness className="w-5 h-5 text-amber-300" />,
    title: "求职冲刺空间",
    desc: "真实简历、名企面经、项目陈述模板集中管理，把能力翻译成面试官听得懂的语言。",
    tag: "简历 · 面经",
  },
  {
    icon: <LineChart className="w-5 h-5 text-pink-300" />,
    title: "成长数据面板",
    desc: "学习时长、刷题曲线和路线完成度以图表呈现，你能看到自己是如何一点点进步的。",
    tag: "统计 · 复盘",
  },
  {
    icon: <Users className="w-5 h-5 text-sky-300" />,
    title: "个人知识宇宙",
    desc: "笔记、Todo、看板和文档集中在一处，形成属于你的长期知识库和成长记录。",
    tag: "知识 · 效率",
  },
  {
    icon: <BookOpen className="w-5 h-5 text-emerald-300" />,
    title: "学习资料中枢",
    desc: "常用文档、路线文档和项目说明统一管理，不再在浏览器标签页之间反复找回。",
    tag: "文档 · 中心",
  },
];

const phases = [
  {
    label: "Phase 01",
    title: "打基础 · 夯实核心技能",
    desc: "用路线和题目把 HTML/CSS/JS 和工程化基础打牢，避免“只会写 Demo、不敢写项目”。",
  },
  {
    label: "Phase 02",
    title: "进框架 · 上手真实项目",
    desc: "以 React 及周边生态为主线，练习状态管理、路由、性能优化等工程实践。",
  },
  {
    label: "Phase 03",
    title: "做作品 · 讲得出故事",
    desc: "通过项目和复盘文档沉淀自己的技术故事，为简历和面试积累谈资。",
  },
  {
    label: "Phase 04",
    title: "冲面试 · 拿到 Offer",
    desc: "高频题强化、面试记录与错题回看结合，让每一次面试反馈都能转化成进步。",
  },
];

const ecosystemSites = [
  {
    title: "木瓜一块八",
    url: "https://www.pawpaw18.cn/",
    description: "记录路线设计、实战项目和成长故事的内容站点。",
    icon: <Rss className="w-5 h-5 text-sky-300" />,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
  },
  {
    title: "学习后台",
    url: "https://stu.pawpaw18.cn/",
    description: "课程、路线、题库和学习数据的中控台，一站式管理你的学习资产。",
    image:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&auto=format&fit=crop&q=80",
    icon: <BookOpen className="w-5 h-5 text-violet-300" />,
  },
  {
    title: "刷题平台",
    url: "https://stu.pawpaw18.cn/",
    image:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80",
    description: "前端、算法与综合题库集中练习的场所，用数据记录每一次刷题。",
    icon: <MessageCircleQuestionMark className="w-5 h-5 text-emerald-300" />,
  },
  {
    title: "木瓜编程",
    url: "https://stu.pawpaw18.cn/",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
    description: "集学习、刷题、求职于一体的编程学习空间，是这套生态的主舞台。",
    icon: <Code2 className="w-5 h-5 text-cyan-300" />,
  },
  {
    title: "语雀知识库",
    url: "https://stu.pawpaw18.cn/",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&auto=format&fit=crop&q=80",
    description: "沉淀长文档、技术笔记和项目复盘的知识仓库，为长期成长提供“记忆宫殿”。",
    icon: <BookMarked className="w-5 h-5 text-amber-300" />,
  },
];

const weeklyRhythm = [
  {
    label: "周一 · 对齐节奏",
    desc: "回看上周记录，给本周定一个小目标，只要能完成就算赢。",
  },
  {
    label: "周三 · 稍微拉一把",
    desc: "抽 40 分钟刷题或推进路线一小节，避免整周“空白”。",
  },
  {
    label: "周五 · 轻松收尾",
    desc: "整理这一周学到的一点东西，写进笔记或项目备忘。",
  },
  {
    label: "周末 · 深呼吸",
    desc: "挑一个更大的块：做一次项目迭代，或者系统复盘一次错题。",
  },
];

const neonParticles = [
  {
    top: "12%",
    left: "14%",
    size: 10,
    color: "rgba(56,189,248,0.95)",
    delay: 0,
  },
  {
    top: "26%",
    left: "78%",
    size: 12,
    color: "rgba(129,140,248,0.95)",
    delay: 0.5,
  },
  {
    top: "42%",
    left: "20%",
    size: 8,
    color: "rgba(52,211,153,0.9)",
    delay: 1,
  },
  {
    top: "58%",
    left: "64%",
    size: 11,
    color: "rgba(56,189,248,0.95)",
    delay: 1.5,
  },
  {
    top: "73%",
    left: "32%",
    size: 9,
    color: "rgba(129,140,248,0.95)",
    delay: 2,
  },
  {
    top: "84%",
    left: "82%",
    size: 10,
    color: "rgba(45,212,191,0.9)",
    delay: 2.4,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { theme: currentTheme, toggleTheme } = useTheme();
  const [activeModeId, setActiveModeId] = useState(heroModes[0].id);
  const activeMode =
    heroModes.find((mode) => mode.id === activeModeId) ?? heroModes[0];
  const isDark = currentTheme === "dark";

  return (
    <div
      className={[
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900",
      ].join(" ")}
    >
      <div className="relative overflow-hidden">
        <div
          className={[
            "pointer-events-none absolute inset-0 -z-10",
            isDark
              ? "bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.1),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(129,140,248,0.35),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.18),transparent_55%)]"
              : "bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.14),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(129,140,248,0.18),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(45,212,191,0.16),transparent_55%)]",
          ].join(" ")}
        />
        <div
          className={[
            "pointer-events-none absolute inset-0 -z-10",
            isDark
              ? "bg-[linear-gradient(to_bottom,#020617,transparent_30%,transparent_70%,#020617)]"
              : "bg-[linear-gradient(to_bottom,#eef2ff,transparent_30%,transparent_70%,#e0f2fe)]",
          ].join(" ")}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -inset-x-48 top-1/3 h-56 bg-gradient-to-r from-cyan-500/0 via-cyan-400/35 to-violet-500/0 blur-3xl"
            animate={{ x: ["-20%", "20%", "-20%"] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-20 opacity-30">
          <motion.div
            className="h-full w-full bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:60px_60px]"
            animate={{
              x: [-16, 16, -16],
              y: [-8, 8, -8],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="absolute right-6 top-6 z-20">
          <button
            type="button"
            onClick={toggleTheme}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition",
              currentTheme === "dark"
                ? "bg-slate-900/90 text-slate-100 border border-slate-700 hover:bg-slate-800"
                : "bg-white/95 text-slate-900 border border-slate-200 hover:bg-slate-100",
            ].join(" ")}
          >
            {currentTheme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>切换浅色</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-slate-700" />
                <span>切换深色</span>
              </>
            )}
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10">
          {neonParticles.map((particle, index) => (
            <motion.span
              key={index}
              className="absolute rounded-full opacity-70 blur-[1px] mix-blend-screen shadow-[0_0_30px_rgba(56,189,248,0.65)]"
              style={{
                top: particle.top,
                left: particle.left,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
              }}
              animate={{
                y: [-10, 12, -10],
                x: [0, 8, 0],
              }}
              transition={{
                duration: 10 + index * 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-24 px-6 pt-24 pb-28 lg:pt-28">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="relative [perspective:1600px]">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                className={[
                  "relative overflow-hidden rounded-[32px] px-6 py-6 backdrop-blur lg:px-10 lg:py-8",
                  isDark
                    ? "border border-slate-800 bg-slate-950/80 shadow-[0_30px_80px_rgba(15,23,42,0.9)]"
                    : "border border-slate-200 bg-white/90 shadow-[0_30px_80px_rgba(15,23,42,0.15)]",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="h-full w-full bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_90%_0%,rgba(129,140,248,0.35),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.25),transparent_55%)]" />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_140deg_at_20%_0%,rgba(56,189,248,0.18),transparent_40%,rgba(129,140,248,0.3),transparent_75%,rgba(34,197,94,0.18))] opacity-60" />
                <motion.div
                  className="pointer-events-none absolute inset-x-0 -top-32 h-40 bg-gradient-to-b from-cyan-400/0 via-cyan-400/16 to-transparent"
                  animate={{ y: ["-10%", "140%"] }}
                  transition={{
                    duration: 14,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />
                <div className="pointer-events-none absolute inset-0">
                  {[
                    { top: "18%", left: "14%" },
                    { top: "32%", left: "82%" },
                    { top: "64%", left: "22%" },
                    { top: "78%", left: "70%" },
                  ].map((p, index) => (
                    <motion.span
                      key={index}
                      className="absolute h-2 w-2 rounded-full bg-cyan-400/80 blur-[1px] mix-blend-screen shadow-[0_0_26px_rgba(56,189,248,0.95)]"
                      style={{ top: p.top, left: p.left }}
                      animate={{
                        y: [-10, 10, -10],
                        x: [0, 6, 0],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 7 + index * 1.5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-stretch">
                  <div className="flex-1 space-y-7">
                    <div
                      className={[
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors",
                        isDark
                          ? "bg-slate-950/80 text-sky-300 ring-sky-500/40"
                          : "bg-white/95 text-sky-600 ring-sky-300/60 shadow-sm",
                      ].join(" ")}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>木瓜生态 · 前端学习与求职的一体化成长操作系统</span>
                    </div>
                    <div className="space-y-5">
                      <h1
                        className={[
                          "text-[32px] font-semibold leading-tight tracking-tight sm:text-[38px] lg:text-[44px]",
                          isDark ? "text-slate-50" : "text-slate-900",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "block",
                            isDark ? "text-slate-200" : "text-slate-700",
                          ].join(" ")}
                        >
                          把前端学习、刷题、项目和简历
                        </span>
                        <motion.span
                          className="mt-2 inline-flex items-center gap-3 bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent"
                          style={{ backgroundSize: "200% 200%" }}
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                          }}
                        >
                          收进一块「木瓜成长宇宙」里。
                          <Sparkles
                            className={[
                              "h-5 w-5",
                              isDark ? "text-cyan-300" : "text-sky-400",
                            ].join(" ")}
                          />
                        </motion.span>
                      </h1>
                      <p
                        className={[
                          "max-w-xl text-sm leading-relaxed sm:text-base",
                          isDark ? "text-slate-300" : "text-slate-600",
                        ].join(" ")}
                      >
                        从系统路线到题库练习，从项目落地到简历与面经，所有环节都在同一条时间线上向前推进，让你能真正看到自己从零到拿 Offer 的完整轨迹。
                      </p>
                      <div
                        className={[
                          "mt-3 grid gap-3 text-[11px] sm:grid-cols-3",
                          isDark ? "text-slate-300" : "text-slate-600",
                        ].join(" ")}
                      >
                        {[
                          "今天只需要完成一个小节，就能在数据面板上看到进度往前推。",
                          "老错题不会消失，它们会被拉回到练功房里，等你真正吃透。",
                          "项目的每一次小更新，都可以同步到你的简历草稿和面试记录里。",
                        ].map((text) => (
                          <div
                            key={text}
                            className={[
                              "flex items-start gap-2 rounded-2xl p-3 ring-1 transition-colors",
                              isDark
                                ? "bg-slate-950/70 ring-slate-800/80"
                                : "bg-white/95 ring-slate-200 shadow-sm",
                            ].join(" ")}
                          >
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className={[
                        "flex flex-wrap gap-2 text-[11px]",
                        isDark ? "text-slate-300" : "text-slate-600",
                      ].join(" ")}
                    >
                      {personas.map((p) => (
                        <motion.span
                          key={p}
                          whileHover={{ y: -2, scale: 1.04 }}
                          className={[
                            "inline-flex items-center gap-1 rounded-full px-3 py-1 ring-1 text-[11px] transition-colors",
                            isDark
                              ? "bg-slate-950/80 text-slate-200 ring-slate-700"
                              : "bg-white/95 text-slate-700 ring-slate-200 shadow-sm",
                          ].join(" ")}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          <span>{p}</span>
                        </motion.span>
                      ))}
                    </div>
                      <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => navigate("/front/home")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:-translate-y-0.5 hover:bg-sky-400"
                      >
                        <Rocket className="h-4 w-4" />
                        <span>立即进入学习空间</span>
                      </button>
                      <button
                        onClick={() => navigate("/front/route")}
                        className={[
                          "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-medium ring-1 transition hover:-translate-y-0.5",
                          isDark
                            ? "bg-slate-950/80 text-slate-100 ring-slate-700 hover:bg-slate-900"
                            : "bg-white/95 text-slate-900 ring-slate-200 shadow-sm hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <Compass className="h-4 w-4 text-sky-300" />
                        <span>浏览前端学习路线</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] ring-1 transition-colors",
                          isDark
                            ? "bg-slate-950/80 text-slate-300 ring-slate-800"
                            : "bg-white/95 text-slate-600 ring-slate-200 shadow-sm",
                        ].join(" ")}
                      >
                        <span className="h-1 w-1 rounded-full bg-cyan-400" />
                        <span>切换模式，预想你今天想要的节奏</span>
                      </div>
                      <div
                        className={[
                          "flex flex-wrap gap-2 text-[11px]",
                          isDark ? "text-slate-300" : "text-slate-600",
                        ].join(" ")}
                      >
                        {heroModes.map((mode) => (
                          <motion.button
                            key={mode.id}
                            type="button"
                            whileHover={{ y: -2, scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveModeId(mode.id)}
                            className={[
                              "inline-flex items-center gap-1 rounded-full px-3 py-1 ring-1 text-[11px] transition",
                              activeModeId === mode.id
                                ? isDark
                                  ? "bg-cyan-500/20 text-cyan-200 ring-cyan-400"
                                  : "bg-cyan-500/10 text-cyan-600 ring-cyan-300"
                                : isDark
                                  ? "bg-slate-950/70 text-slate-300 ring-slate-700 hover:bg-slate-900"
                                  : "bg-white/95 text-slate-600 ring-slate-200 hover:bg-slate-50 shadow-sm",
                            ].join(" ")}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span>{mode.label}</span>
                          </motion.button>
                        ))}
                      </div>
                      <p
                        className={[
                          "max-w-xl text-[11px] leading-relaxed sm:text-xs",
                          isDark ? "text-slate-300" : "text-slate-600",
                        ].join(" ")}
                      >
                        {activeMode.desc}
                      </p>
                    </div>
                  </div>
                  <div className="relative w-full max-w-sm space-y-4 lg:w-auto">
                    <motion.div
                      className="pointer-events-none absolute -right-8 -top-10 h-20 w-20 rounded-full border border-cyan-400/50 bg-cyan-400/15 shadow-[0_0_50px_rgba(56,189,248,0.75)]"
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="absolute inset-4 rounded-full border border-cyan-300/60" />
                    </motion.div>
                    <motion.div
                      animate={{ y: [-10, 8, -10] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={[
                        "relative overflow-hidden rounded-3xl border px-5 py-4 shadow-[0_0_80px_rgba(56,189,248,0.35)] transition-colors",
                        isDark
                          ? "border-sky-500/40 bg-slate-950/80"
                          : "border-sky-300/50 bg-white/95 shadow-[0_0_80px_rgba(56,189,248,0.28)]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Rocket className="h-3.5 w-3.5 text-sky-300" />
                          <span>今日路线快照 · 示例</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-4 text-[11px]">
                        <div className="rounded-2xl bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-violet-500/10 px-4 py-3 ring-1 ring-sky-500/40">
                          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
                            当前阶段 · React 进阶
                          </p>
                          <p
                            className={[
                              "mt-1 text-sm font-semibold",
                              isDark ? "text-slate-50" : "text-slate-900",
                            ].join(" ")}
                          >
                            完成「组件通信与状态管理」章节，刷题 12 题，推进一个项目模块。
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div
                            className={[
                              "rounded-xl px-3 py-2 ring-1 transition-colors",
                              isDark
                                ? "bg-slate-900/80 ring-slate-800"
                                : "bg-white/95 ring-slate-200 shadow-sm",
                            ].join(" ")}
                          >
                            <p
                              className={[
                                "text-[11px]",
                                isDark ? "text-slate-400" : "text-slate-500",
                              ].join(" ")}
                            >
                              今日刷题
                            </p>
                            <p
                              className={[
                                "mt-1 text-lg font-semibold",
                                isDark ? "text-slate-50" : "text-slate-900",
                              ].join(" ")}
                            >
                              12
                            </p>
                          </div>
                          <div
                            className={[
                              "rounded-xl px-3 py-2 ring-1 transition-colors",
                              isDark
                                ? "bg-slate-900/80 ring-slate-800"
                                : "bg-white/95 ring-slate-200 shadow-sm",
                            ].join(" ")}
                          >
                            <p
                              className={[
                                "text-[11px]",
                                isDark ? "text-slate-400" : "text-slate-500",
                              ].join(" ")}
                            >
                              路线进度
                            </p>
                            <p
                              className={[
                                "mt-1 text-lg font-semibold",
                                isDark ? "text-slate-50" : "text-slate-900",
                              ].join(" ")}
                            >
                              38%
                            </p>
                          </div>
                          <div
                            className={[
                              "rounded-xl px-3 py-2 ring-1 transition-colors",
                              isDark
                                ? "bg-slate-900/80 ring-slate-800"
                                : "bg-white/95 ring-slate-200 shadow-sm",
                            ].join(" ")}
                          >
                            <p
                              className={[
                                "text-[11px]",
                                isDark ? "text-slate-400" : "text-slate-500",
                              ].join(" ")}
                            >
                              连续打卡
                            </p>
                            <p
                              className={[
                                "mt-1 text-lg font-semibold",
                                isDark ? "text-slate-50" : "text-slate-900",
                              ].join(" ")}
                            >
                              9 天
                            </p>
                          </div>
                        </div>
                        <p
                          className={[
                            "text-[11px]",
                            isDark ? "text-slate-400" : "text-slate-500",
                          ].join(" ")}
                        >
                          实际使用中，这些数据会由平台自动统计并同步到路线和简历模块里，形成你独有的“成长轨迹图”。
                        </p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 24, scale: 0.94 }}
                      whileInView={{ opacity: 0.96, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                      className="flex gap-3"
                    >
                      <div
                        className={[
                          "flex-1 rounded-2xl border px-3 py-3 shadow-[0_0_40px_rgba(139,92,246,0.45)] transition-colors",
                          isDark
                            ? "border-violet-500/40 bg-slate-950/80"
                            : "border-violet-300/60 bg-white/95 shadow-[0_0_40px_rgba(129,140,248,0.25)]",
                        ].join(" ")}
                      >
                        <p
                          className={[
                            "text-[11px] font-medium",
                            isDark ? "text-violet-200" : "text-violet-500",
                          ].join(" ")}
                        >
                          面试倒计时 · 示例
                        </p>
                        <p
                          className={[
                            "mt-1 text-sm font-semibold",
                            isDark ? "text-slate-50" : "text-slate-900",
                          ].join(" ")}
                        >
                          还有 18 天 · 前端工程师
                        </p>
                        <p
                          className={[
                            "mt-1 text-[11px]",
                            isDark ? "text-slate-400" : "text-slate-500",
                          ].join(" ")}
                        >
                          今日建议刷题 8 题，整理一段项目陈述。
                        </p>
                      </div>
                      <div
                        className={[
                          "w-[120px] rounded-2xl border px-3 py-3 text-[11px] shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-colors",
                          isDark
                            ? "border-emerald-500/40 bg-slate-950/80"
                            : "border-emerald-300/60 bg-white/95 shadow-[0_0_40px_rgba(45,212,191,0.35)]",
                        ].join(" ")}
                      >
                        <p
                          className={[
                            "text-lg font-semibold",
                            isDark ? "text-emerald-300" : "text-emerald-500",
                          ].join(" ")}
                        >
                          本周学习
                        </p>
                        <p
                          className={[
                            "mt-1 text-lg font-semibold",
                            isDark ? "text-slate-50" : "text-slate-900",
                          ].join(" ")}
                        >
                          16.5 h
                        </p>
                        <p
                          className={[
                            "mt-1 text-[11px]",
                            isDark ? "text-slate-400" : "text-slate-500",
                          ].join(" ")}
                        >
                          最近 7 天保持连续打卡。
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div
              className={[
                "grid gap-3 text-xs sm:grid-cols-3",
                isDark ? "text-slate-300" : "text-slate-600",
              ].join(" ")}
            >
              {heroStats.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -6, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-3 py-2 ring-1 transition-colors",
                    isDark
                      ? "bg-slate-950/80 ring-slate-800"
                      : "bg-white/95 ring-slate-200 shadow-sm",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                      isDark ? "bg-slate-900/80" : "bg-slate-100",
                    ].join(" ")}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={[
                        "text-sm font-semibold",
                        isDark ? "text-slate-50" : "text-slate-900",
                      ].join(" ")}
                    >
                      {item.value}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  成长轨道
                </p>
                <h2
                  className={[
                    "mt-2 text-2xl font-semibold sm:text-3xl",
                    isDark ? "text-slate-50" : "text-slate-900",
                  ].join(" ")}
                >
                  把前端学习拆成四个阶段，一段一段解锁。
                </h2>
                <p
                  className={[
                    "mt-2 max-w-2xl text-sm leading-relaxed sm:text-base",
                    isDark ? "text-slate-300" : "text-slate-600",
                  ].join(" ")}
                >
                  不需要一次性写完“全年学习计划”，你只需要在当前阶段看清下一步要做什么，其余交给时间和节奏。
                </p>
              </div>
              <p
                className={[
                  "max-w-md text-xs sm:text-sm",
                  isDark ? "text-slate-400" : "text-slate-500",
                ].join(" ")}
              >
                这条轨道会在真实使用中与你的路线进度和刷题记录联动，呈现出一条专属于你的成长曲线。
              </p>
            </div>
            <div
              className={[
                "relative overflow-hidden rounded-3xl p-6 transition-colors",
                isDark
                  ? "border border-slate-800 bg-slate-950/80 shadow-[0_24px_80px_rgba(15,23,42,0.95)]"
                  : "border border-slate-200 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.16)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(139,92,246,0.18),transparent_55%)] opacity-80" />
              <div className="pointer-events-none absolute inset-0">
                {[
                  { top: "16%", left: "8%" },
                  { top: "34%", left: "72%" },
                  { top: "52%", left: "18%" },
                  { top: "76%", left: "52%" },
                  { top: "86%", left: "88%" },
                ].map((p, index) => (
                  <motion.span
                    key={index}
                    className="absolute h-2 w-2 rounded-full bg-cyan-400/80 blur-[1px] mix-blend-screen shadow-[0_0_26px_rgba(56,189,248,0.95)]"
                    style={{ top: p.top, left: p.left }}
                    animate={{
                      y: [-10, 10, -10],
                      x: [0, 4, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 6 + index * 1.2,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="relative space-y-6">
                <div className="relative h-1 rounded-full bg-slate-900/80">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400"
                    style={{ width: "66%" }}
                    animate={{ x: ["0%", "8%", "0%"] }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  />
                  <div className="absolute -top-1 left-0 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
                  <div className="absolute -top-1 left-1/3 h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
                  <div className="absolute -top-1 left-2/3 h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(139,92,246,0.9)]" />
                  <div className="absolute -top-1 right-0 h-3 w-3 rounded-full bg-slate-600" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  {phases.map((phase, index) => (
                    <motion.div
                      key={phase.label}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.06,
                      }}
                      className={[
                        "flex flex-col gap-2 rounded-2xl border p-4 shadow-[0_0_24px_rgba(15,23,42,0.9)] backdrop-blur-sm transition-colors",
                        isDark
                          ? "border-slate-800/80 bg-slate-950/80"
                          : "border-slate-200 bg-slate-50",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "text-[11px] font-medium",
                          isDark ? "text-sky-300" : "text-sky-600",
                        ].join(" ")}
                      >
                        {phase.label}
                      </span>
                      <span
                        className={[
                          "text-sm font-semibold",
                          isDark ? "text-slate-50" : "text-slate-900",
                        ].join(" ")}
                      >
                        {phase.title}
                      </span>
                      <span
                        className={[
                          "text-[11px] leading-relaxed",
                          isDark ? "text-slate-300" : "text-slate-600",
                        ].join(" ")}
                      >
                        {phase.desc}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  核心模块
                </p>
                <h2
                  className={[
                    "mt-2 text-2xl font-semibold sm:text-3xl",
                    isDark ? "text-slate-50" : "text-slate-900",
                  ].join(" ")}
                >
                  一套模块，把“学、练、记、求职、复盘”串起来。
                </h2>
                <p
                  className={[
                    "mt-2 max-w-2xl text-sm leading-relaxed sm:text-base",
                    isDark ? "text-slate-300" : "text-slate-600",
                  ].join(" ")}
                >
                  每个模块都有独立入口，同时又和题库、路线、简历和数据面板互通，尽量减少信息割裂和重复操作。
                </p>
              </div>
            </div>
            <div
              className={[
                "relative overflow-hidden rounded-3xl p-5 transition-colors",
                isDark
                  ? "border border-slate-800 bg-slate-950/80 shadow-[0_24px_80px_rgba(15,23,42,0.95)]"
                  : "border border-slate-200 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.12)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.2),transparent_55%)] opacity-70" />
              <div className="pointer-events-none absolute inset-0">
                {[
                  { top: "14%", left: "18%" },
                  { top: "30%", left: "82%" },
                  { top: "48%", left: "10%" },
                  { top: "66%", left: "56%" },
                  { top: "80%", left: "86%" },
                  { top: "88%", left: "32%" },
                ].map((p, index) => (
                  <motion.span
                    key={index}
                    className="absolute h-2 w-2 rounded-full bg-sky-400/80 blur-[1px] mix-blend-screen shadow-[0_0_26px_rgba(56,189,248,0.95)]"
                    style={{ top: p.top, left: p.left }}
                    animate={{
                      y: [-10, 10, -10],
                      x: [0, -5, 0],
                      opacity: [0.45, 1, 0.45],
                    }}
                    transition={{
                      duration: 7 + index,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="relative grid gap-5 md:grid-cols-3">
                {modules.map((module, index) => (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      duration: 0.45,
                      ease: "easeOut",
                      delay: index * 0.05,
                    }}
                    className={[
                      "group flex flex-col gap-3 rounded-2xl border p-5 ring-1 ring-transparent backdrop-blur-sm transition-all duration-200 hover:border-cyan-500/70 hover:ring-cyan-500/40",
                      isDark
                        ? "border-slate-800/80 bg-slate-950/90 shadow-[0_0_30px_rgba(15,23,42,0.9)]"
                        : "border-slate-200 bg-slate-50 shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={[
                          "flex h-9 w-9 items-center justify-center rounded-xl",
                          isDark ? "bg-slate-900/80" : "bg-slate-100",
                        ].join(" ")}
                      >
                        {module.icon}
                      </div>
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[11px]",
                          isDark
                            ? "bg-cyan-500/10 text-cyan-300"
                            : "bg-cyan-50 text-cyan-600",
                        ].join(" ")}
                      >
                        {module.tag}
                      </span>
                    </div>
                    <h3
                      className={[
                        "text-sm font-semibold",
                        isDark ? "text-slate-50" : "text-slate-900",
                      ].join(" ")}
                    >
                      {module.title}
                    </h3>
                    <p
                      className={[
                        "flex-1 text-[11px] leading-relaxed sm:text-xs",
                        isDark ? "text-slate-300" : "text-slate-600",
                      ].join(" ")}
                    >
                      {module.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative space-y-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  木瓜生态矩阵
                </p>
                <h2
                  className={[
                    "mt-2 text-2xl font-semibold sm:text-3xl",
                    isDark ? "text-slate-50" : "text-slate-900",
                  ].join(" ")}
                >
                  不只是一个网站，而是一整套互联的学习宇宙。
                </h2>
              </div>
              <p
                className={[
                  "max-w-md text-xs sm:text-sm",
                  isDark ? "text-slate-400" : "text-slate-500",
                ].join(" ")}
              >
                官网负责表达愿景和节奏，其他站点负责日常学习与内容承载，它们共同组成你的“前端成长宇宙飞船”。
              </p>
            </div>
            <div className="relative -mx-6 overflow-x-auto px-1 py-1 scrollbar-hide">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.2),transparent_55%)] opacity-70" />
              <div className="pointer-events-none absolute inset-0">
                {[
                  { top: "18%", left: "12%" },
                  { top: "32%", left: "72%" },
                  { top: "56%", left: "26%" },
                  { top: "70%", left: "86%" },
                ].map((p, index) => (
                  <motion.span
                    key={index}
                    className="absolute h-2 w-2 rounded-full bg-cyan-300/80 blur-[1px] mix-blend-screen shadow-[0_0_24px_rgba(56,189,248,0.95)]"
                    style={{ top: p.top, left: p.left }}
                    animate={{
                      y: [-8, 8, -8],
                      x: [0, 5, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 7 + index * 1.3,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <div className="flex min-w-full gap-4 px-5 pb-2">
                {ecosystemSites.map((item, index) => (
                  <motion.button
                    key={item.title}
                    type="button"
                    onClick={() => window.open(item.url, "_blank")}
                    whileHover={{ y: -6, rotate: -0.5 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={[
                      "relative flex h-60 w-[260px] flex-shrink-0 flex-col overflow-hidden rounded-3xl border text-left transition-colors",
                      isDark
                        ? "border-slate-800 bg-slate-900/90 shadow-[0_18px_45px_rgba(15,23,42,0.9)]"
                        : "border-slate-200 bg-slate-50 shadow-[0_12px_32px_rgba(15,23,42,0.14)]",
                    ].join(" ")}
                    style={{ transformOrigin: index % 2 === 0 ? "center top" : "center bottom" }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div
                      className={[
                        "absolute inset-0 bg-gradient-to-t to-transparent",
                        isDark
                          ? "from-slate-950 via-slate-950/80"
                          : "from-slate-900/35 via-slate-900/10",
                      ].join(" ")}
                    />
                    <div
                      className={[
                        "relative mt-3 flex items-center gap-2 px-4 text-[11px]",
                        isDark ? "text-slate-200" : "text-slate-100",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-lg",
                          isDark ? "bg-slate-950/80" : "bg-slate-900/90",
                        ].join(" ")}
                      >
                        {item.icon}
                      </div>
                      <span>木瓜生态 · 互联站点</span>
                    </div>
                    <div className="relative mt-auto space-y-1 px-4 pb-4 pt-10 text-slate-50">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-[11px] text-slate-200">
                        {item.description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  适合谁 · 如何用
                </p>
                <h2
                  className={[
                    "mt-2 text-2xl font-semibold sm:text-3xl",
                    isDark ? "text-slate-50" : "text-slate-900",
                  ].join(" ")}
                >
                  三类典型用户，都能在这里找到自己的节奏。
                </h2>
              </div>
              <p
                className={[
                  "max-w-md text-xs sm:text-sm",
                  isDark ? "text-slate-400" : "text-slate-500",
                ].join(" ")}
              >
                不论你是完全自学、准备校招，还是在职想系统补课，都可以把这里当成一个长期的“成长操作台”，而不是一次性刷完就关掉的工具。
              </p>
            </div>
            <div
              className={[
                "relative overflow-hidden rounded-3xl p-5 transition-colors",
                isDark
                  ? "border border-slate-800 bg-slate-950/80 shadow-[0_24px_80px_rgba(15,23,42,0.95)]"
                  : "border border-slate-200 bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.12)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.18),transparent_55%)] opacity-70" />
              <div className="relative grid gap-6 md:grid-cols-[0.9fr,1.1fr]">
                <div className="space-y-4">
                  <p
                    className={[
                      "text-[11px] leading-relaxed sm:text-xs",
                      isDark ? "text-slate-300" : "text-slate-600",
                    ].join(" ")}
                  >
                    可以把你自己简单套进一个角色，然后按角色建议的节奏和入口来用整套生态，而不是一下子什么都点一点。
                  </p>
                  <div className="space-y-3">
                    {["路线学习", "刷题练功房", "项目与简历", "知识库与复盘"].map(
                      (text) => (
                        <div
                          key={text}
                          className={[
                            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] ring-1 transition-colors",
                            isDark
                              ? "bg-slate-950/80 text-slate-200 ring-slate-700"
                              : "bg-white/95 text-slate-700 ring-slate-200 shadow-sm",
                          ].join(" ")}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          <span>{text}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      title: "完全自学 · 从零起步",
                      desc: "先把基础路线走通，再用题库查缺补漏，最后接项目和长文档。",
                    },
                    {
                      title: "准备校招 / 秋招",
                      desc: "锁定框架与工程化路线，同时开启高频题库和简历面板联动。",
                    },
                    {
                      title: "在职进阶 / 转前端",
                      desc: "从真实工作问题出发，把解法沉淀到项目与知识库，再拆成题目反复练。",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.06,
                      }}
                      className={[
                        "relative flex gap-3 rounded-2xl p-3 ring-1 transition-colors",
                        isDark
                          ? "bg-slate-950/85 ring-slate-800/80"
                          : "bg-slate-50 ring-slate-200 shadow-sm",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[11px]",
                          isDark
                            ? "bg-slate-900 text-cyan-300"
                            : "bg-slate-100 text-cyan-600",
                        ].join(" ")}
                      >
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <p
                          className={[
                            "text-[11px] font-medium",
                            isDark ? "text-slate-100" : "text-slate-900",
                          ].join(" ")}
                        >
                          {item.title}
                        </p>
                        <p
                          className={[
                            "text-[11px] leading-relaxed sm:text-xs",
                            isDark ? "text-slate-300" : "text-slate-600",
                          ].join(" ")}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  一周节奏示例
                </p>
                <h2
                  className={[
                    "mt-2 text-2xl font-semibold sm:text-3xl",
                    isDark ? "text-slate-50" : "text-slate-900",
                  ].join(" ")}
                >
                  不需要天天爆肝，用一周的节奏把成长拉出来。
                </h2>
              </div>
              <p
                className={[
                  "max-w-md text-xs sm:text-sm",
                  isDark ? "text-slate-400" : "text-slate-500",
                ].join(" ")}
              >
                你可以照搬这套节奏，也可以在实际使用中慢慢改成属于自己的版本。关键是：让“学习、刷题、项目和复盘”在一周内都有露面。
              </p>
            </div>
            <div
              className={[
                "relative overflow-hidden rounded-3xl p-6 transition-colors",
                isDark
                  ? "border border-slate-800 bg-slate-950/85 shadow-[0_24px_80px_rgba(15,23,42,0.95)]"
                  : "border border-slate-200 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.16)]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.24),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.2),transparent_55%)] opacity-80" />
              <div className="relative space-y-6">
                <div
                  className={[
                    "relative mx-auto flex max-w-xl items-center justify-between text-[11px]",
                    isDark ? "text-slate-300" : "text-slate-600",
                  ].join(" ")}
                >
                  {weeklyRhythm.map((item, index) => (
                    <div key={item.label} className="flex flex-col items-center gap-2">
                      <div
                        className={[
                          "relative flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold",
                          isDark
                            ? "bg-slate-900 text-cyan-300"
                            : "bg-slate-100 text-cyan-600",
                        ].join(" ")}
                      >
                        {index + 1}
                        <div className="absolute inset-0 rounded-full border border-cyan-400/40" />
                      </div>
                      <span className="text-center">{item.label}</span>
                    </div>
                  ))}
                  <div className="pointer-events-none absolute left-0 right-0 top-4 h-px -z-10 bg-gradient-to-r from-cyan-400/0 via-cyan-400/60 to-violet-400/0" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  {weeklyRhythm.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.05,
                      }}
                      className={[
                        "rounded-2xl p-3 text-[11px] leading-relaxed sm:text-xs transition-colors",
                        isDark
                          ? "bg-slate-950/85 text-slate-300"
                          : "bg-slate-50 text-slate-600 shadow-sm",
                      ].join(" ")}
                    >
                      <p>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={[
              "relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-violet-500/20 px-6 py-7 sm:px-8 sm:py-9 border transition-colors",
              isDark
                ? "border-slate-800 shadow-[0_25px_60px_rgba(8,47,73,0.9)]"
                : "border-slate-200 shadow-[0_16px_40px_rgba(15,23,42,0.16)]",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(129,140,248,0.22),transparent_55%)] opacity-80" />
            <div className="pointer-events-none absolute inset-0">
              {[
                { top: "18%", left: "78%" },
                { top: "38%", left: "64%" },
                { top: "62%", left: "86%" },
              ].map((p, index) => (
                <motion.span
                  key={index}
                  className="absolute h-2 w-2 rounded-full bg-cyan-100/90 blur-[1px] mix-blend-screen shadow-[0_0_26px_rgba(125,211,252,0.95)]"
                  style={{ top: p.top, left: p.left }}
                  animate={{
                    y: [-8, 8, -8],
                    x: [0, -4, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 6 + index * 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p
                  className={[
                    "text-xs uppercase tracking-[0.25em]",
                    isDark ? "text-cyan-100" : "text-sky-600",
                  ].join(" ")}
                >
                  现在上船
                </p>
                <h2
                  className={[
                    "mt-2 text-xl font-semibold sm:text-2xl",
                    isDark ? "text-slate-50" : "text-slate-900",
                  ].join(" ")}
                >
                  把前端学习，变成一段可视化、有节奏、可以被回看的旅程。
                </h2>
                <p
                  className={[
                    "mt-2 max-w-xl text-sm leading-relaxed sm:text-base",
                    isDark ? "text-slate-100/80" : "text-slate-700",
                  ].join(" ")}
                >
                  打开木瓜生态，从今天的一次小动作开始：规划一条路线、选择一套题、写下第一篇笔记。酷炫的界面只是开始，更重要的是你在这里留下的每一段努力。
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-3 min-w-[220px]">
                <button
                  onClick={() => navigate("/front/home")}
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5",
                    isDark
                      ? "bg-slate-950/90 text-cyan-100 shadow-lg shadow-slate-950/80 ring-1 ring-slate-800 hover:bg-slate-900"
                      : "bg-sky-500 text-white shadow-md shadow-sky-500/40 ring-0 hover:bg-sky-400",
                  ].join(" ")}
                >
                  <span>进入学习控制台</span>
                  <span aria-hidden>↗</span>
                </button>
                <button
                  onClick={() => navigate("/front/learning")}
                  className={[
                    "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition",
                    isDark
                      ? "bg-slate-900/80 text-slate-100 ring-1 ring-slate-700 hover:bg-slate-900"
                      : "bg-white text-slate-900 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50",
                  ].join(" ")}
                >
                  探索学习中心
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </motion.section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
