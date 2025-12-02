import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {Button} from "antd";
import {useTheme} from "@/component/context/useTheme";
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {MenuItemType} from "@/component/layoutPage/type";

const LayoutPage = () => {
    const location = useLocation();
    const {toggleTheme, theme: currentTheme} = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()

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
    const menuData: MenuItemType[] = [
        {
            id: '1',
            title: '首页',
            path: '/front/home'
        },
        {
            id: '2',
            title: '算法',
            path: '/front/algorithm'
        },
        {
            id: '3',
            title: '题库',
            path: '/front/questionBank'
        },
        {
            id: '4',
            title: '消息',
            path: '/front/message'
        },
        {
            id: '5',
            title: '快捷导航',
            path: '/front/nav',
        },

    ]
    return (
        <div
            className="w-full min-h-[100vh] dark:bg-gray-900 transition-colors duration-300 flex flex-col justify-start items-center overflow-x-hidden ">
            <div
                className="w-[100%] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)]  fixed top-0 left-0 h-[60px]  flex justify-center items-center bg-white dark:bg-gray-800 transition-colors duration-300 z-50">
                <ul className="flex [&_li]:mr-4">
                    {
                        menuData.map((item: MenuItemType) => {
                            return <li
                                className={`relative  mx-2  cursor-pointer  rounded-3xl  hover:ease-linear  dark:hover:bg-gray-700  ${
                                    location.pathname.includes(item.path) ? ' font-bold' : ''
                                }`} key={item.id} onClick={() => navigate(item.path)}>{item.title}

                                {location.pathname.includes(item.path) && <span
                                    className="absolute bottom-[1px] left-[50%] translate-x-[-50%] rounded-2xl opacity-80 bg-primary-500 dark:bg-red-500 inline-block w-[90%] h-[8px]"></span>}
                            </li>
                        })
                    }
                </ul>
                <Button onClick={toggleTheme} className="">
                    {currentTheme === 'dark' ? '切到亮' : '切到暗'}
                </Button>
            </div>
            <div className="border w-[100%] max-w-[1200px] pt-[70px] relative" ref={containerRef}>
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
        </div>
    );
};

export default LayoutPage;