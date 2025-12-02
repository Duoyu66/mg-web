import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {Button} from "antd";
import {useTheme} from "@/component/context/useTheme";
import {useLayoutEffect, useRef, useState} from 'react';
import type {MenuItemType} from "@/component/layoutPage/type";

const LayoutPage = () => {
    const location = useLocation();
    const {toggleTheme, theme: currentTheme} = useTheme();
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate()
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
                                    className="absolute bottom-[1px] left-[50%] translate-x-[-50%] rounded-2xl opacity-80 bg-primary-500 inline-block w-[90%] h-[8px]"></span>}
                            </li>
                        })
                    }
                    {/*<li>*/}
                    {/*    <Link*/}
                    {/*        to="/front/home"*/}
                    {/*        className={`px-4 py-2 rounded font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${*/}
                    {/*            location.pathname.includes('/front/home') ? 'text-primary-500 ' : ''*/}
                    {/*        }`}*/}
                    {/*    >*/}
                    {/*        主页*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <Link*/}
                    {/*        to="/front/algorithm"*/}
                    {/*        className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${*/}
                    {/*            location.pathname.includes('/front/algorithm') ? 'text-primary-500 ' : ''*/}
                    {/*        }`}*/}
                    {/*    >*/}
                    {/*        算法*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <Link*/}
                    {/*        to="/front/questionBank"*/}
                    {/*        className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${*/}
                    {/*            location.pathname.includes('/front/questionBank') ? 'text-primary-500 ' : ''*/}
                    {/*        }`}*/}
                    {/*    >*/}
                    {/*        题库*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <Link*/}
                    {/*        to="/front/message"*/}
                    {/*        className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${*/}
                    {/*            location.pathname.includes('/front/message') ? 'text-primary-500 ' : ''*/}
                    {/*        }`}*/}
                    {/*    >*/}
                    {/*        消息*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
                    {/*<li>*/}
                    {/*    <Link*/}
                    {/*        to="/front/nav"*/}
                    {/*        className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${*/}
                    {/*            location.pathname.includes('/front/nav') ? 'text-primary-500 ' : ''*/}
                    {/*        }`}*/}
                    {/*    >*/}
                    {/*        快捷导航*/}
                    {/*    </Link>*/}
                    {/*</li>*/}
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