import requestClient from "@/utils/requestClient";

export const getRankingList = () => {
    return requestClient.request({
        url: '/api/question/getRankingList',
        method: 'post',
        headers: {'content-type': 'application/json'},
    })
}

