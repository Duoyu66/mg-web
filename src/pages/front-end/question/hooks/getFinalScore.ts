import requestClient from "@/utils/requestClient";

export const getFinalScore = (data: any) => {
    return requestClient.request({
        url: '/api/question/getFinalScore',
        method: 'post',
        headers: {'content-type': 'application/json'},
        data
    })
}

