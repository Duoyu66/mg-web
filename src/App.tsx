import {Routes, Route, Navigate} from 'react-router-dom';
import routes from '@/router/index';
import type {ReactElement} from 'react';
import './index.css'
interface RouteConfig {
    path: string;
    component?: React.ComponentType;
    redirect?: string;
    title?: string;
    children?: RouteConfig[];
}

function App() {
    // 递归解析路由组件
    const generateRoutes = (routesConfig: RouteConfig[], parentPath: string = ''): ReactElement[] => {
        return routesConfig.map((route: RouteConfig) => {
            const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
            
            // 处理重定向
            if (route.redirect) {
                return (
                    <Route 
                        key={route.path || fullPath} 
                        path={route.path} 
                        element={<Navigate to={route.redirect} replace />} 
                    />
                );
            }
            
            // 确保 component 存在
            if (!route.component) {
                return null;
            }
            
            const Component = route.component;
            
            // 处理有子路由的情况
            if (route.children && route.children.length > 0) {
                return (
                    <Route key={route.path || fullPath} path={route.path} element={<Component />}>
                        {generateRoutes(route.children, fullPath)}
                    </Route>
                );
            }
            
            // 普通路由
            return (
                <Route 
                    key={route.path || fullPath} 
                    path={route.path} 
                    element={<Component />} 
                />
            );
        }).filter(Boolean) as ReactElement[];
    };

    return (
        <Routes>
            {generateRoutes(routes)}
        </Routes>
    );
}

export default App
