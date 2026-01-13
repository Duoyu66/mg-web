import {useMutation} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useSubmitFinalScore = () => {
    return useMutation({
        mutationKey: ['/api/question/getFinalScore'],
        mutationFn: (payload: any) => requestClient.request({
            url: '/api/question/getFinalScore',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: payload
        })
    })
}

