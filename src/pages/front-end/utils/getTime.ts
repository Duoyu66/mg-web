export const getTime = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 5 && hours < 12) {
        return "清晨的阳光洒在窗台，希望今天一切顺利！";
    } else if (hours >= 12 && hours < 18) {
        return "下午好,累了就休息一会儿。";
    } else if (hours >= 18 && hours < 22) {
        return "放松一下，享受夜晚的宁静吧。";
    } else {
        return "夜深了，今晚有个甜美的梦境，明天醒来元气满满。";
    }
};
export const getDays = (inputDate:any) => {
    // 创建一个日期对象表示输入日期
    const input:any = new Date(inputDate);
    // 创建一个日期对象表示今天
    const today:any = new Date();

    // 计算两个日期的时间差（以毫秒为单位）
    const timeDiff = today - input;

    // 将时间差从毫秒转换为天数
    return Math.abs(Math.floor(timeDiff / (1000 * 60 * 60 * 24)));
};
