import requestClient from "@/utils/requestClient";

export const reqLvInfo = (data: any) => {
    return requestClient.request({
        url: '/api/lv/getLvInfo',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

