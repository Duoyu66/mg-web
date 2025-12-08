import requestClient from "@/utils/requestClient";

export const reqGetQuestionType = (data: any) => {
    return requestClient.request({
        url: '/api/question/getUserQuestionInfo',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

