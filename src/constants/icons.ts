/**
 * 全局图标常量配置
 * 统一管理 lucide-react 图标，便于维护和复用
 *
 * 使用方式：
 * 1. 直接使用常量：import { ICONS } from '@/constants/icons'; <ICONS.MOON />
 * 2. 使用 Icon 组件：import Icon from '@/components/Icon'; <Icon name="MOON" />
 * 
 * 默认颜色：
 * - 所有图标默认使用 text-gray-700 dark:text-gray-300
 * - 可通过 className 属性自定义颜色
 * - 全局 CSS 也会为图标设置 currentColor 继承
 */
import {
    AlertCircle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Bell,
    Calendar,
    Camera,
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    Download,
    Edit,
    Eye,
    EyeOff,
    FileText,
    Filter,
    Heart,
    Home,
    Image,
    Info,
    Lock,
    LogIn,
    LogOut,
    type LucideIcon,
    Mail,
    MapPin,
    Menu,
    MessageCircle,
    Minus,
    Moon,
    MoreHorizontal,
    MoreVertical,
    Music,
    Phone,
    Plus,
    Save,
    Search,
    Send,
    Settings,
    Share2,
    SortAsc,
    SortDesc,
    Star,
    StarOff,
    Sun,
    ThumbsDown,
    ThumbsUp,
    Trash2,
    Unlock,
    Upload,
    User,
    UserPlus,
    Video,
    X as XIcon,
    XCircle,
} from 'lucide-react';

/**
 * 常用图标常量映射
 * 使用大写字母命名，符合常量命名规范
 *
 * @example
 * // 方式一：直接使用常量（会自动应用默认颜色）
 * import { ICONS } from '@/constants/icons';
 * <ICONS.MOON size={24} className="text-blue-500" />
 *
 * // 方式二：使用 getIcon 函数
 * import { getIcon } from '@/constants/icons';
 * const MoonIcon = getIcon('MOON');
 * <MoonIcon size={24} className="text-blue-500" />
 */
export const ICONS = {
    // 主题相关
    MOON: Moon,
    SUN: Sun,

    // 导航相关
    HOME: Home,
    MENU: Menu,
    X: XIcon,
    CHEVRON_LEFT: ChevronLeft,
    CHEVRON_RIGHT: ChevronRight,
    CHEVRON_UP: ChevronUp,
    CHEVRON_DOWN: ChevronDown,
    ARROW_LEFT: ArrowLeft,
    ARROW_RIGHT: ArrowRight,
    ARROW_UP: ArrowUp,
    ARROW_DOWN: ArrowDown,

    // 搜索与操作
    SEARCH: Search,
    FILTER: Filter,
    SORT_ASC: SortAsc,
    SORT_DESC: SortDesc,

    // 用户相关
    USER: User,
    USER_PLUS: UserPlus,
    LOG_IN: LogIn,
    LOG_OUT: LogOut,
    LOCK: Lock,
    UNLOCK: Unlock,

    // 内容操作
    EDIT: Edit,
    TRASH: Trash2,
    SAVE: Save,
    PLUS: Plus,
    MINUS: Minus,
    DOWNLOAD: Download,
    UPLOAD: Upload,
    SHARE: Share2,
    SEND: Send,

    // 媒体相关
    CAMERA: Camera,
    IMAGE: Image,
    VIDEO: Video,
    MUSIC: Music,

    // 交互相关
    HEART: Heart,
    STAR: Star,
    STAR_OFF: StarOff,
    THUMBS_UP: ThumbsUp,
    THUMBS_DOWN: ThumbsDown,
    MESSAGE_CIRCLE: MessageCircle,
    BELL: Bell,
    MAIL: Mail,
    EYE: Eye,
    EYE_OFF: EyeOff,

    // 信息与状态
    CHECK: Check,
    ALERT_CIRCLE: AlertCircle,
    INFO: Info,
    CHECK_CIRCLE: CheckCircle,
    X_CIRCLE: XCircle,

    // 其他常用
    SETTINGS: Settings,
    PHONE: Phone,
    MAP_PIN: MapPin,
    CALENDAR: Calendar,
    CLOCK: Clock,
    FILE_TEXT: FileText,
    MORE_VERTICAL: MoreVertical,
    MORE_HORIZONTAL: MoreHorizontal,
} as const;

/**
 * 图标默认颜色配置
 * 修改此值可以全局更改所有图标的默认颜色
 * 
 * 可选值：
 * - 'text-gray-700 dark:text-gray-300' - 默认文本色（推荐）
 * - 'text-current' - 继承父元素颜色
 * - 'text-primary-500' - 主题色
 * - 任意 Tailwind 颜色类
 */
export const ICON_DEFAULT_COLOR = 'text-gray-700 dark:text-gray-300' as const;

/**
 * 图标默认属性配置
 */
export const ICON_DEFAULT_PROPS = {
    size: 24,
    strokeWidth: 2,
    /**
     * 默认颜色类名
     * 默认使用文本颜色（继承父元素），会自动适配暗色模式
     * 如需自定义颜色，可以传入 className 覆盖
     * 
     * 常用颜色类：
     * - text-gray-700 dark:text-gray-300 (默认文本色)
     * - text-primary-500 (主题色)
     * - text-current (继承父元素颜色)
     */
    className: ICON_DEFAULT_COLOR,
} as const;

/**
 * 获取图标组件
 * @param iconName 图标名称
 * @returns LucideIcon 组件
 *
 * @example
 * const MoonIcon = getIcon('MOON');
 * <MoonIcon size={24} className="text-blue-500" />
 */
export function getIcon(iconName: keyof typeof ICONS): LucideIcon {
    return ICONS[iconName];
}


/**
 * 图标名称类型
 * 可用于 TypeScript 类型检查，确保使用的图标名称存在于 ICONS 常量中
 */
export type IconName = keyof typeof ICONS;
