import requestClient from "@/utils/requestClient";

export const addRecordOrError = (data: any) => {
    return requestClient.request({
        url: '/api/question/addRecordOrError',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

