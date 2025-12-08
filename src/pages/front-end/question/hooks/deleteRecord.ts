import requestClient from "@/utils/requestClient";

export const deleteRecord = (data: any) => {
    return requestClient.request({
        url: '/api/question/deleteRecord',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

