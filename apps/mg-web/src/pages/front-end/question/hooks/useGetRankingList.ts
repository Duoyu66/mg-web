import {useQuery} from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useGetRankingList = () => {
    const {data, isLoading, ...rest} = useQuery({
        queryKey: ['/api/question/getRankingList'],
        queryFn: () => requestClient.request({
            url: '/api/question/getRankingList',
            method: 'post',
            headers: {'content-type': 'application/json'},
        })
    })
    return {data, isLoading, ...rest}
}

