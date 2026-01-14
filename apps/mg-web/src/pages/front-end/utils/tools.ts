//获取时间字符串
export const timeAgo = (dateString: string) => {
    const date: any = new Date(dateString);
    const now: any = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // 1. 处理 "刚刚"、"x分钟前"、"x小时前"、"x天前"
    if (diffInSeconds < 60) {
        return "刚刚";
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}小时前`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}天前`;
    }

    // 2. 超过 7 天，检查是否同年
    const isCurrentYear = date.getFullYear() === now.getFullYear();

    // 3. 如果是今年，去掉年份；否1则保留年份
    const formatTimeWithoutSeconds = (dateStr: string) => {
        return dateStr.split(":").slice(0, 2).join(":");
    };

    if (isCurrentYear) {
        // 今年：显示 MM-DD HH:mm
        return formatTimeWithoutSeconds(
            dateString.split("-").slice(1).join("-")
        );
    } else {
        // 非今年：显示 YYYY-MM-DD HH:mm
        return formatTimeWithoutSeconds(dateString);
    }
};

//分割url
export const  splitURL=(url:string)=> {
    // 使用正则表达式来分割URL
    const regex = /^(https?:\/\/[^/]+\/)(.*\/)?([^/]+)$/;
    const matches = url.match(regex);

    if (matches) {
        const prefix = matches[1];  // 前缀
        const path = matches[2] || '';  // 路径（可选）
        const filename = matches[3];  // 文件名

        return {
            prefix,
            path,
            filename
        };
    } else {
        throw new Error("URL格式不正确");
    }
}

//计算rate星星
export const computedStar = (value: number) => {
let difficulty =''
    if (value <= 2) {
        difficulty = 'easy';
    } else if (value > 2 && value <= 4) {
        difficulty = 'middle';
    } else if (value > 4) {
        difficulty = 'hard';
    }
    return  difficulty ;
};

/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
export const coinChange = (coins: number[], amount: number): string => {
    const lvMap: any = {
        1: "️⭐️",
        4: "🌙",
        16: "🌞",
        64: "👑"
    }
    // dp数组存储达到每个金额所需的最小硬币数
    const dp = new Array(amount + 1).fill(Infinity);
    // coinUsed数组存储达到每个金额最后使用的硬币
    const coinUsed = new Array(amount + 1).fill(-1);

    dp[0] =0 ; // 凑出总额0需要0枚硬币

    for (const coin of coins) {
        for (let j = coin; j <= amount; j++) {
            if (dp[j - coin] + 1 < dp[j]) {
                dp[j] = dp[j - coin] + 1;
                coinUsed[j] = coin; // 记录最后使用的硬币
            }
        }
    }

    // 如果没有解，返回空数组
    if (dp[amount] === Infinity) {
        return "";
    }

    // 回溯找出使用的硬币
    const result: number[] = [];
    let remaining = amount;
    while (remaining > 0) {
        const coin = coinUsed[remaining];
        result.push(coin);
        remaining -= coin;
    }
    let res = "";
    for (let i = 0; i < result.length; i++) {
        res+=lvMap[result[i]];
    }
    return res;
};
