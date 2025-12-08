import {useMutation} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useAddQuestion = () => {
    return useMutation({
        mutationKey: ['/api/question/addQuestion'],
        mutationFn: (payload: any) => requestClient.request({
            url: '/api/question/addQuestion',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: payload
        })
    })
}

