//按照时间随机背景
export const bgUrl=(arr:string[])=>{
    const now = new Date();
    const hours = now.getHours();
    console.log("时间是",hours)
    // const hours = 2
    // console.log(hours); // 输出当前的小时数（0-23）
    //0 1 2 3   4 5 6 7    8 9 10 11    12 13 14 15   16 17 18 19    20 21 22 23
    //1 2 3 4   2 4 3 1    3 1 4  2      4  3  2  1    2  4  1  3    1  2  3  4
    // 1:0 ,7,9,15,18,20
    // 2:1,4,11,14,16,21
    // 3:2,6,8,13,19,22
    // 4:2,6,8,13,19,22
    const bg1Arr=[0 ,7,9,15,18,20]
    const bg2Arr=[1,4,11,14,16,21]
    const bg3Arr=[2,6,8,13,19,22]
    const bg4Arr=[3,5,10,12,17,23]
    if (bg1Arr.includes(hours)){
        return `url(${arr[0]}) no-repeat center / 100% 125%`

    }else if (bg2Arr.includes(hours)){
       return `url(${arr[1]}) no-repeat center / 100% 120%`
    }else if (bg3Arr.includes(hours)){
        return `url(${arr[2]}) no-repeat center / 100% 130%`
    } else{
        return `url(${arr[3]}) no-repeat center / 100% 125%`
    }


}
