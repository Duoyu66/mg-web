import requestClient from "@/utils/requestClient";

export const getQuestionErrorOrRecord = (data: any) => {
    return requestClient.request({
        url: '/api/question/getQuestionErrorOrRecord',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

