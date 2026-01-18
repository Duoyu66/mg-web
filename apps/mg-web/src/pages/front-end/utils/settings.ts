

// 使用常量而不是重复URL
export const ICON_URLS = {
    VIP: 'https://pawpaw-img.oss-cn-beijing.aliyuncs.com/vip/VIP%282%29.svg',
    SVIP: 'https://pawpaw-img.oss-cn-beijing.aliyuncs.com/vip/svip.svg',
    DIAMOND: 'https://pawpaw-img.oss-cn-beijing.aliyuncs.com/vip/svip%281%29.svg',
    FREE: '' as const
} as const;

export const diamondIcon = ICON_URLS.DIAMOND;