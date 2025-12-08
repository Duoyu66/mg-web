import {useQuery} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useGetQuestionErrorOrRecord = (params: any) => {
    const {data, isLoading, ...rest} = useQuery({
        queryKey: ['/api/question/getQuestionErrorOrRecord', params],
        queryFn: () => requestClient.request({
            url: '/api/question/getQuestionErrorOrRecord',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: params
        })
    })
    return {data, isLoading, ...rest}
}

