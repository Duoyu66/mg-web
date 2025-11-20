import {Outlet, useLocation, Link} from 'react-router-dom';
import {Button} from "antd";
import {useTheme} from "@/component/context/useTheme";

const LayoutPage = () => {
    const location = useLocation();
    const {toggleTheme, theme: currentTheme} = useTheme();
    return (
        <div className=" w-[100vw] min-h-[100vh] dark:bg-gray-900 transition-colors duration-300 flex flex-col justify-start items-center ">
            <div className="w-[100%] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] sticky top-0 left-0 h-[60px]  flex justify-center items-center bg-white dark:bg-gray-800 transition-colors duration-300 z-50">
                <ul className="flex [&_li]:mr-4">
                    <li>
                        <Link
                            to="/front/home"
                            className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                location.pathname.includes('/front-end/home') ? 'text-primary-500 font-semibold' : ''
                            }`}
                        >
                            主页
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/front/algorithm"
                            className={`px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                location.pathname === '/front-end' ? 'text-primary-500 font-semibold' : ''
                            }`}
                        >
                            算法
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/front/questionBank"
                            className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            题库
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/front/message"
                            className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            消息
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/front/nav"
                            className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            快捷导航
                        </Link>
                    </li>
                </ul>
                <Button onClick={toggleTheme} className="">
                    {currentTheme === 'dark' ? '切到亮' : '切到暗'}
                </Button>
            </div>
            <div className=" border w-[100%] max-[1200px] pt-2">
                <Outlet />
            </div>
        </div>
    );
};

export default LayoutPage;