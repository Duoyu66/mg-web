import requestClient from "@/utils/requestClient";

export const reqAddQuestion = (data: any) => {
    return requestClient.request({
        url: '/api/question/addQuestion',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

