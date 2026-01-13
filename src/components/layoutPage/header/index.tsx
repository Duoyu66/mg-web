import { useLocation, useNavigate } from "react-router-dom";
import { Badge, Button, Input, Tooltip, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/components/context/useTheme";
import type { MenuItemType } from "@/components/layoutPage/type";
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  PenLine, 
  Code2, 
  Terminal,
  UserCircle2,
  ChevronDown,
  LogOut,
  Wallet,
  Coins,
} from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toggleTheme, theme: currentTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    // 监听滚动以改变头部样式
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuData: MenuItemType[] = [
        { id: "1", title: "首页", path: "/front/home" },
        { id: "2", title: "算法", path: "/front/algorithm" },
        { id: "3", title: "题库", path: "/front/questionBank" },
        { id: "5", title: "快捷导航", path: "/front/nav" },
        { id: "6", title: "测试", path: "/front/test" },
        { 
            id: "more", 
            title: "更多", 
            path: "",
            children: [
                { id: "7", title: "面试公司", path: "/front/company" },
                { id: "8", title: "简历制作模板", path: "/front/resume" },
                { id: "9", title: "学习排行榜", path: "/front/rank" },
                { id: "10", title: "学习路线", path: "/front/route" },
                { id: "11", title: "文档管理", path: "/front/document" },
                { id: "12", title: "个人中心", path: "/front/center" },
                { id: "14", title: "笔记", path: "/front/note" },
                { id: "15", title: "代办", path: "/front/todo" },
                { id: "16", title: "留言板", path: "/front/board" },
                { id: "17", title: "会员价格", path: "/front/price" },
                { id: "17", title: "充值", path: "/front/recharge" },
                { id: "18", title: "真实简历", path: "/front/realResume" },
                { id: "19", title: "名企面经", path: "/front/companyInterview" },
            ]
        },
        { id: "13", title: "管理后台", path: "/front/admin" },
    
    ];

    const goIndex = () => navigate("/");
    const goLogin = () => navigate("/login");

    // Mock User Info
    const userInfo = {
        nickname: "木瓜一块八",
        id: "888888",
        balance: 12580.00,
        coins: 2450,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'info',
            label: (
                <div className="flex flex-col px-1 py-1 cursor-default min-w-[120px]">
                    <span className="font-bold text-base text-gray-800 dark:text-gray-100">{userInfo.nickname}</span>
                    <span className="text-xs text-gray-400 mt-1">ID: {userInfo.id}</span>
                </div>
            ),
        },
        { type: 'divider' },
        {
            key: 'balance',
            icon: <Wallet size={16} className="text-blue-500" />,
            label: (
                <div className="flex justify-between items-center w-full gap-4">
                    <span>余额</span>
                    <span className="font-mono font-bold">¥{userInfo.balance.toLocaleString()}</span>
                </div>
            ),
            onClick: () => navigate('/front/recharge')
        },
        {
            key: 'coins',
            icon: <Coins size={16} className="text-amber-500" />,
            label: (
                <div className="flex justify-between items-center w-full gap-4">
                    <span>木瓜币</span>
                    <span className="font-mono font-bold">{userInfo.coins}</span>
                </div>
            ),
        },
        { type: 'divider' },
        {
            key: 'logout',
            danger: true,
            icon: <LogOut size={16} />,
            label: '退出登录',
            onClick: () => {
                // handle logout
                navigate('/login');
            }
        },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
                scrolled 
                    ? "h-[60px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-gray-200/50 dark:border-gray-700/50 shadow-sm" 
                    : "h-[64px] bg-white dark:bg-gray-900 border-transparent"
            }`}
        >
            <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo Section */}
                <div 
                    className="flex items-center gap-3 cursor-pointer group" 
                    onClick={goIndex}
                >
                    <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-amber-300 to-orange-500 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                        <span className="text-white font-bold text-lg leading-none font-mono">mg</span>
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">
                        木瓜编程
                    </span>
                </div>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center mx-8">
                    <ul className="flex items-center gap-1">
                        {menuData.map((item) => {
                            if (item.children) {
                                const dropdownItems: MenuProps['items'] = item.children.map(child => ({
                                    key: child.id,
                                    label: child.title,
                                    onClick: () => navigate(child.path)
                                }));

                                const isChildActive = item.children.some(child => location.pathname.includes(child.path));

                                return (
                                    <li key={item.id}>
                                        <Dropdown menu={{ items: dropdownItems }} placement="bottom" arrow>
                                            <div
                                                className={`
                                                    relative px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-300 flex items-center gap-1
                                                    ${isChildActive
                                                        ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10" 
                                                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }
                                                `}
                                            >
                                                {item.title}
                                                <ChevronDown size={14} />
                                            </div>
                                        </Dropdown>
                                    </li>
                                );
                            }

                            const isActive = location.pathname.includes(item.path);
                            return (
                                <li key={item.id}>
                                    <div
                                        onClick={() => navigate(item.path)}
                                        className={`
                                            relative px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all duration-300
                                            ${isActive 
                                                ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10" 
                                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            }
                                        `}
                                    >
                                        {item.title}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="hidden lg:block relative group">
                        <Input
                            placeholder="搜索文章/题目..."
                            prefix={<Search size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors" />}
                            className="w-[180px] focus:w-[240px] transition-all duration-300 rounded-full bg-gray-100 dark:bg-gray-800 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-900"
                            variant="borderless"
                            onPressEnter={(e) => console.log("Search:", e.currentTarget.value)}
                        />
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-3 ml-2">
                        <Tooltip title="切换主题">
                            <Button 
                                type="text" 
                                shape="circle" 
                                icon={currentTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />} 
                                onClick={toggleTheme}
                                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            />
                        </Tooltip>

                        <Tooltip title="发布文章">
                            <Button 
                                type="text" 
                                shape="circle" 
                                icon={<PenLine size={18} />} 
                                onClick={() => navigate("/publishArticle")}
                                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            />
                        </Tooltip>

                        <Tooltip title="消息通知">
                            <Badge count={5} size="small" offset={[-5, 5]}>
                                <Button 
                                    type="text" 
                                    shape="circle" 
                                    icon={<Bell size={18} />} 
                                    onClick={() => navigate("/front/message")}
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                />
                            </Badge>
                        </Tooltip>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-2">
                        <Button 
                            className="flex items-center gap-1 rounded-full border-primary-500 text-primary-500 hover:text-primary-600 hover:border-primary-600"
                            icon={<Terminal size={16} />}
                            onClick={() => navigate("/question/nav")}
                        >
                            刷题
                        </Button>
                        <Button 
                            className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-none hover:bg-gray-200 dark:hover:bg-gray-700"
                            icon={<Code2 size={16} />}
                            onClick={() => navigate('/codeEdit')}
                        >
                            LeetCode
                        </Button>
                        {/* Login Button (Shown when not logged in - Logic can be added) */}
                        {/* <Button 
                            type="primary" 
                            className="rounded-full px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 border-none shadow-md shadow-primary-500/20"
                            icon={<UserCircle2 size={16} />}
                            onClick={goLogin}
                        >
                            登录
                        </Button> */}

                        {/* User Profile Dropdown */}
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow trigger={['click']}>
                            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 pl-2 pr-3 py-1.5 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group">
                                <Avatar 
                                    src={userInfo.avatar} 
                                    size="default" 
                                    className="border-2 border-white dark:border-gray-700 shadow-sm group-hover:scale-105 transition-transform"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {userInfo.nickname}
                                </span>
                                <ChevronDown size={14} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
