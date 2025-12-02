import {Outlet, useLocation} from 'react-router-dom';
import {useTheme} from "@/component/context/useTheme";
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Header from "./header";
import Footer from "./footer";

const LayoutPage = () => {
    const location = useLocation();
    const {theme: currentTheme} = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 确保 dark 类与主题状态同步
    useEffect(() => {
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
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

    return (
        <div
            className="w-full min-h-[100vh] dark:bg-gray-900 transition-colors duration-300 flex flex-col justify-start items-center overflow-x-hidden">
            <Header/>
            <div className="border w-[100%] max-w-[1200px] min-h-[calc(100vh - 150px)] pt-[70px] relative"
                 ref={containerRef}>
                <div
                    key={location.pathname}
                    className={isAnimating ? 'animate-route-enter' : 'opacity-0 scale-[0.98]'}
                    style={{
                        willChange: 'opacity, transform',
                        transformOrigin: 'top center',
                    }}
                >
                    <Outlet/>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default LayoutPage;