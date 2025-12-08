import {useMutation} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useDeleteRecord = () => {
    return useMutation({
        mutationKey: ['/api/question/deleteRecord'],
        mutationFn: (payload: any) => requestClient.request({
            url: '/api/question/deleteRecord',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: payload
        })
    })
}

