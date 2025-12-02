import {useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import {getRouteMeta} from "@/utils/routeUtils";

const Footer = () => {
    const location = useLocation();

    // 获取当前路由的 meta 信息
    const currentRouteMeta = useMemo(() => {
        return getRouteMeta(location.pathname);
    }, [location.pathname]);

    return (
        <div className="border w-full h-[200px]">
            拿到当前路由的meta信息: {currentRouteMeta ? JSON.stringify(currentRouteMeta, null, 2) : '暂无meta信息'}
            我是底部信息栏
        </div>
    );
};

export default Footer;

