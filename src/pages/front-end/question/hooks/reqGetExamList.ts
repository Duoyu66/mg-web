import requestClient from "@/utils/requestClient";

export const reqGetExamList = (data: any) => {
    return requestClient.request({
        url: '/api/question/getQuestionExam',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

