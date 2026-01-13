import routes from '@/router/index';

// 定义路由配置类型
interface RouteConfig {
    path: string;
    component?: React.ComponentType;
    redirect?: string;
    title?: string;
    meta?: Record<string, unknown>;
    children?: RouteConfig[];
}

/**
 * 根据当前路径从路由配置中查找对应的 meta 信息
 * @param currentPath 当前路径，如 '/front/home'
 * @returns 返回匹配的路由的 meta 信息，如果没有找到则返回 null
 */
export function getRouteMeta(currentPath: string): Record<string, unknown> | null {
    // 递归查找路由配置
    function findRouteMeta(routesConfig: RouteConfig[], path: string, parentPath: string = ''): Record<string, unknown> | null {
        // 标准化当前路径
        const normalizedCurrentPath = path.replace(/\/$/, '');
        
        for (const route of routesConfig) {
            // 构建完整路径
            let fullPath: string;
            if (parentPath) {
                // 如果父路径以 / 结尾或子路径以 / 开头，需要处理
                if (route.path.startsWith('/')) {
                    fullPath = route.path;
                } else {
                    fullPath = `${parentPath}/${route.path}`;
                }
            } else {
                fullPath = route.path;
            }
            
            // 标准化完整路径
            let normalizedFullPath = fullPath.replace(/\/$/, '');
            if (!normalizedFullPath.startsWith('/')) {
                normalizedFullPath = '/' + normalizedFullPath;
            }
            
            // 如果有子路由，先查找子路由（优先匹配更深层的路由）
            if (route.children && route.children.length > 0) {
                // 检查当前路径是否以当前路由路径开头（说明可能是子路由）
                if (normalizedCurrentPath === normalizedFullPath || normalizedCurrentPath.startsWith(normalizedFullPath + '/')) {
                    const childResult = findRouteMeta(route.children, path, normalizedFullPath);
                    if (childResult) {
                        return childResult;
                    }
                }
            }
            
            // 精确匹配当前路由
            if (normalizedFullPath === normalizedCurrentPath) {
                if (route.meta) {
                    return route.meta;
                }
            }
        }
        return null;
    }
    
    return findRouteMeta(routes, currentPath);
}

/**
 * 根据当前路径从路由配置中查找对应的 title
 * @param currentPath 当前路径，如 '/front/home'
 * @returns 返回匹配的路由的 title，如果没有找到则返回 null
 */
export function getRouteTitle(currentPath: string): string | null {
    function findRouteTitle(routesConfig: RouteConfig[], path: string, parentPath: string = ''): string | null {
        for (const route of routesConfig) {
            let fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
            
            if (parentPath === '' && route.path.startsWith('/')) {
                fullPath = route.path;
            }
            
            const normalizedFullPath = fullPath.replace(/\/$/, '');
            const normalizedCurrentPath = path.replace(/\/$/, '');
            
            if (normalizedFullPath === normalizedCurrentPath || normalizedCurrentPath.startsWith(normalizedFullPath + '/')) {
                if (route.children && route.children.length > 0) {
                    const childResult = findRouteTitle(route.children, path, normalizedFullPath);
                    if (childResult) {
                        return childResult;
                    }
                }
                
                if (route.title) {
                    return route.title;
                }
            }
        }
        return null;
    }
    
    return findRouteTitle(routes, currentPath);
}

