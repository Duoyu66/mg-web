import {useLocation, useNavigate} from 'react-router-dom';
import {Divider, Switch} from "antd";
import {useTheme} from "@/component/context/useTheme";
import type {MenuItemType} from "@/component/layoutPage/type";
import {ICONS} from "@/constants/icons";
import { Button } from 'antd';
const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {toggleTheme, theme: currentTheme} = useTheme();
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
        }, {
            id: '6',
            title: '测试',
            path: '/front/test',
        },
 
    ];

    const goIndex = () => {
        navigate('/');
    };
    const goLogin = () => {
        navigate('/login');
    }
    return (
        <div
            className="w-[100%] pl-[15%] pr-[25px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] fixed top-0 left-0 h-[60px] flex justify-start items-center bg-white dark:bg-gray-800 transition-colors duration-300 z-50">
            <span className=" cursor-pointer mr-[80px] flex justify-center items-center" onClick={goIndex}>
                <div
                    className="w-[32px] h-[32px] border border-amber-200 rounded-md bg-amber-200 flex justify-center items-center text-white font-bold mr-1">
                    mg
                </div>
                木瓜编程</span>
            <ul className="flex [&_li]:mr-4">
                {
                    menuData.map((item: MenuItemType) => {
                        return (
                            <li
                                className={`relative mx-2 cursor-pointer rounded-3xl hover:ease-linear ${
                                    location.pathname.includes(item.path) ? ' font-bold' : ''
                                }`}
                                key={item.id}
                                onClick={() => navigate(item.path)}
                            >
                                {item.title}
                                {location.pathname.includes(item.path) && (
                                    <span
                                        className="absolute bottom-[1px] left-[50%] translate-x-[-50%] rounded-2xl opacity-85 bg-primary-500 dark:bg-green-500 inline-block w-[85%] h-[8px]"
                                    />
                                )}
                            </li>
                        );
                    })
                }
            </ul>
            <div className="flex gap-2 justify-end items-center ml-auto">
                <Switch
                    onClick={toggleTheme}
                    checkedChildren={
                        <ICONS.SUN size={16} className="text-white"/>
                    }
                    unCheckedChildren={
                        <ICONS.MOON size={16} className="text-white"/>
                    }
                    checked={currentTheme !== 'dark'}
                />
                <Divider orientation="vertical"/>
                <span>发布</span>
                <Button onClick={()=>navigate('/question/nav')}>刷题</Button>
                <span className="cursor-pointer" onClick={goLogin}>登录/注册</span>
            </div>
        </div>
    );
};

export default Header;
