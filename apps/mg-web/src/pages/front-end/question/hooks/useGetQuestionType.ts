import {useQuery} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useGetQuestionType = (params: any) => {
    const {data, isLoading, ...rest} = useQuery({
        queryKey: ['/api/question/getUserQuestionInfo', params],
        queryFn: () => requestClient.request({
            url: '/api/question/getUserQuestionInfo',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: params
        })
    })
    return {data, isLoading, ...rest}
}

