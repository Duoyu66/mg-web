# 图标常量使用指南

本项目使用 `lucide-react` 图标库，并提供了统一的图标常量管理。

## 使用方式

### 方式一：直接使用图标常量（推荐）

```tsx
import { ICONS } from '@/constants/icons';

function MyComponent() {
    return (
        <div>
            <ICONS.MOON size={24} />
            <ICONS.SUN size={24} className="text-yellow-500" />
            <ICONS.HOME size={20} strokeWidth={1.5} />
        </div>
    );
}
```

### 方式二：使用 getIcon 函数

```tsx
import { getIcon } from '@/constants/icons';

function MyComponent() {
    const MoonIcon = getIcon('MOON');
    const SunIcon = getIcon('SUN');
    
    return (
        <div>
            <MoonIcon size={24} />
            <SunIcon size={24} className="text-yellow-500" />
        </div>
    );
}
```

### 方式三：使用 Icon 组件（推荐用于动态图标）

```tsx
import Icon from '@/components/Icon';

function MyComponent({ iconName }: { iconName: 'MOON' | 'SUN' }) {
    return <Icon name={iconName} size={24} />;
}
```

## 可用图标常量

### 主题相关
- `ICONS.MOON` - 月亮图标（暗色模式）
- `ICONS.SUN` - 太阳图标（亮色模式）

### 导航相关
- `ICONS.HOME` - 首页
- `ICONS.MENU` - 菜单
- `ICONS.X` - 关闭
- `ICONS.CHEVRON_LEFT/RIGHT/UP/DOWN` - 方向指示
- `ICONS.ARROW_LEFT/RIGHT/UP/DOWN` - 箭头

### 搜索与操作
- `ICONS.SEARCH` - 搜索
- `ICONS.FILTER` - 筛选
- `ICONS.SORT_ASC/DESC` - 排序

### 用户相关
- `ICONS.USER` - 用户
- `ICONS.USER_PLUS` - 添加用户
- `ICONS.LOG_IN` - 登录
- `ICONS.LOG_OUT` - 退出
- `ICONS.LOCK/UNLOCK` - 锁定/解锁

### 内容操作
- `ICONS.EDIT` - 编辑
- `ICONS.TRASH` - 删除
- `ICONS.SAVE` - 保存
- `ICONS.PLUS/MINUS` - 加/减
- `ICONS.DOWNLOAD/UPLOAD` - 下载/上传
- `ICONS.SHARE` - 分享
- `ICONS.SEND` - 发送

### 媒体相关
- `ICONS.CAMERA` - 相机
- `ICONS.IMAGE` - 图片
- `ICONS.VIDEO` - 视频
- `ICONS.MUSIC` - 音乐

### 交互相关
- `ICONS.HEART` - 喜欢
- `ICONS.STAR/STAR_OFF` - 收藏
- `ICONS.THUMBS_UP/DOWN` - 点赞/点踩
- `ICONS.MESSAGE_CIRCLE` - 消息
- `ICONS.BELL` - 通知
- `ICONS.MAIL` - 邮件
- `ICONS.EYE/EYE_OFF` - 显示/隐藏

### 信息与状态
- `ICONS.CHECK` - 选中
- `ICONS.ALERT_CIRCLE` - 警告
- `ICONS.INFO` - 信息
- `ICONS.CHECK_CIRCLE` - 成功
- `ICONS.X_CIRCLE` - 错误

### 其他常用
- `ICONS.SETTINGS` - 设置
- `ICONS.PHONE` - 电话
- `ICONS.MAP_PIN` - 位置
- `ICONS.CALENDAR` - 日历
- `ICONS.CLOCK` - 时间
- `ICONS.FILE_TEXT` - 文件
- `ICONS.MORE_VERTICAL/HORIZONTAL` - 更多操作

## 添加新图标

1. 在 `src/constants/icons.ts` 中导入新图标
2. 在 `ICONS` 对象中添加新的常量
3. 使用大写字母和下划线命名，如 `NEW_ICON`

```tsx
// 导入
import { NewIcon } from 'lucide-react';

// 添加到 ICONS
export const ICONS = {
    // ... 其他图标
    NEW_ICON: NewIcon,
} as const;
```

## 最佳实践

1. **优先使用常量**：直接使用 `ICONS` 常量而不是从 `lucide-react` 导入
2. **类型安全**：使用 `IconName` 类型确保图标名称正确
3. **统一管理**：所有图标都应在 `ICONS` 常量中定义
4. **按需扩展**：根据项目需要添加常用图标到常量中

