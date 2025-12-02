import React from 'react';
import {ICONS, ICON_DEFAULT_PROPS, type IconName} from '@/constants/icons';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    /**
     * 图标名称，从 ICONS 常量中选择
     */
    name: IconName;
    /**
     * 图标大小，默认 24
     */
    size?: number | string;
    /**
     * 描边宽度，默认 2
     */
    strokeWidth?: number;
    /**
     * 自定义类名
     * 如果提供，会与默认类名合并（默认类名在前）
     * 如需完全覆盖，可以使用 className 中的同名类覆盖
     */
    className?: string;
}

/**
 * 简单的类名合并工具
 * 将多个类名字符串合并，去除重复和空值
 */
function mergeClassNames(...classes: (string | undefined | null)[]): string {
    return classes
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * 统一的图标组件
 * 基于 lucide-react，提供统一的配置和样式管理
 */
const Icon: React.FC<IconProps> = ({
    name,
    size = ICON_DEFAULT_PROPS.size,
    strokeWidth = ICON_DEFAULT_PROPS.strokeWidth,
    className,
    ...props
}) => {
    const IconComponent = ICONS[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in ICONS constant`);
        return null;
    }

    // 合并默认类名和自定义类名
    // 默认类名在前，用户的类名在后，这样可以覆盖默认样式
    const finalClassName = mergeClassNames(ICON_DEFAULT_PROPS.className, className);

    return (
        <IconComponent
            size={size}
            strokeWidth={strokeWidth}
            className={finalClassName}
            {...props}
        />
    );
};

export default Icon;

