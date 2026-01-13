import {useMutation} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useAddRecordOrError = () => {
    return useMutation({
        mutationKey: ['/api/question/addRecordOrError'],
        mutationFn: (payload: any) => requestClient.request({
            url: '/api/question/addRecordOrError',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: payload
        })
    })
}

