import requestClient from "@/utils/requestClient";

export const reqAddLvExp = (data: any) => {
    return requestClient.request({
        url: '/api/lv/addUserExp',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

