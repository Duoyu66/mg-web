import {useLocation, useNavigate} from 'react-router-dom';
import {Button, Divider, Switch} from "antd";
import {useTheme} from "@/component/context/useTheme";
import type {MenuItemType} from "@/component/layoutPage/type";
import {ICONS} from "@/constants/icons";

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
        },
    ];

    const goIndex = () => {
        navigate('/');
    };

    return (
        <div
            className="w-[100%] pl-[150px] pr-[25px] shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1)] fixed top-0 left-0 h-[60px] flex justify-start items-center bg-white dark:bg-gray-800 transition-colors duration-300 z-50">
            <span className="border cursor-pointer mr-[80px]" onClick={goIndex}>木瓜编程</span>
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
                                        className="absolute bottom-[1px] left-[50%] translate-x-[-50%] rounded-2xl opacity-80 bg-primary-500 dark:bg-green-500 inline-block w-[90%] h-[8px]"
                                    />
                                )}
                            </li>
                        );
                    })
                }
            </ul>
            <div className="flex gap-2 justify-end items-center ml-auto">
                {/*<span onClick={toggleTheme}*/}
                {/*      className="cursor-pointer flex justify-center items-center w-[24px] h-[24px] hover:text-primary-500 transition-colors duration-300 z-50">*/}
                {/*    {currentTheme === 'dark' ? (*/}
                {/*        <ICONS.SUN className={ICON_DEFAULT_COLOR}/>*/}
                {/*    ) : (*/}
                {/*        <ICONS.MOON className={ICON_DEFAULT_COLOR}/>*/}
                {/*    )}*/}
                {/*</span>*/}
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
                <Button>发布</Button>
                <Button>登录/注册</Button>
            </div>
        </div>
    );
};

export default Header;