import {useQuery} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useGetExamList = (params: any) => {
    const {data, isLoading, ...rest} = useQuery({
        queryKey: ['/api/question/getQuestionExam', params],
        queryFn: () => requestClient.request({
            url: '/api/question/getQuestionExam',
            method: 'post',
            headers: {'content-type': 'application/json'},
            data: params
        })
    })
    return {data, isLoading, ...rest}
}

