import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/components/context/useTheme";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Footer from "./footer";
import Header from "./header";
import { getRouteMeta } from "@/utils/routeUtils";
import FriendshipLinks from "./friendshipLinks";

const LayoutPage = () => {
  const location = useLocation();
  const { theme: currentTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 确保 dark 类与主题状态同步
  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currentTheme]);

  useLayoutEffect(() => {
    // 确保布局计算完成后再开始动画
    setIsAnimating(false);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });
    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  // 在需要 Affix 的页面（如 /front/nav）禁用路由过渡动画的 transform，避免影响 Affix 的定位
  const isNavPage = location.pathname.startsWith("/front/nav");
  const contentClassName = isNavPage
    ? ""
    : isAnimating
    ? "animate-route-enter"
    : "opacity-0 scale-[0.98]";
  const contentStyle = isNavPage
    ? undefined
    : ({
        willChange: "opacity, transform",
        transformOrigin: "top center",
      } as const);

  return (
    <div className="w-full min-h-[100vh] dark:bg-gray-900 transition-colors duration-300 flex flex-col justify-start items-center overflow-x-hidden">
      <Header />
      <div
        className={`border w-[100%] max-w-[1200px] min-h-[calc(100vh - 150px)] relative mt-[70px]`}
        ref={containerRef}
      >
        <div
          key={location.pathname}
          className={contentClassName}
          style={contentStyle}
        >
          <Outlet />
        </div>
      </div>
      {/* 友情链接 */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 px-6   bg-white dark:bg-gray-800 p-2 rounded-r-2xl flex items-center justify-center">
        <FriendshipLinks />
      </div>
      {/* footer */}
      {(() => {
        const routeMeta = getRouteMeta(location.pathname);
        const showFooter = routeMeta?.showFooter !== false; // 默认显示，只有明确设置为 false 时才隐藏
        return showFooter ? <Footer /> : null;
      })()}
    </div>
  );
};

export default LayoutPage;
