import { useQuery, useMutation } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

//获取转向练习类型
export const reqGetQuestionType = (data:any) => {
    return requestClient.request({
        url:'/api/question/getUserQuestionInfo',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useGetQuestionType = (params:any) => {
    const { data, isLoading, ...rest } = useQuery({
        queryKey: ['/api/question/getUserQuestionInfo', params],
        queryFn: () => requestClient.request({
            url:'/api/question/getUserQuestionInfo',
            method:'post',
            headers:{'content-type':'application/json'},
            data: params
        })
    })
    return { data, isLoading, ...rest }
}
//获取模拟考试题目
export const reqGetExamList = (data:any) => {
    return requestClient.request({
        url:'/api/question/getQuestionExam',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useGetExamList = (params:any) => {
    const { data, isLoading, ...rest } = useQuery({
        queryKey: ['/api/question/getQuestionExam', params],
        queryFn: () => requestClient.request({
            url:'/api/question/getQuestionExam',
            method:'post',
            headers:{'content-type':'application/json'},
            data: params
        })
    })
    return { data, isLoading, ...rest }
}
//交卷接口
export const getFinalScore = (data:any) => {
    return requestClient.request({
        url:'/api/question/getFinalScore',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useSubmitFinalScore = () => {
    return useMutation({
        mutationKey: ['/api/question/getFinalScore'],
        mutationFn: (payload:any) => requestClient.request({
            url:'/api/question/getFinalScore',
            method:'post',
            headers:{'content-type':'application/json'},
            data: payload
        })
    })
}
//获取排行榜
export const getRankingList = () => {
    return requestClient.request({
        url:'/api/question/getRankingList',
        method:'post',
        headers:{'content-type':'application/json'},
    })
}
export const useGetRankingList = () => {
    const { data, isLoading, ...rest } = useQuery({
        queryKey: ['/api/question/getRankingList'],
        queryFn: () => requestClient.request({
            url:'/api/question/getRankingList',
            method:'post',
            headers:{'content-type':'application/json'},
        })
    })
    return { data, isLoading, ...rest }
}
//添加收藏
export const addRecordOrError = (data:any) => {
    return requestClient.request({
        url:'/api/question/addRecordOrError',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useAddRecordOrError = () => {
    return useMutation({
        mutationKey: ['/api/question/addRecordOrError'],
        mutationFn: (payload:any) => requestClient.request({
            url:'/api/question/addRecordOrError',
            method:'post',
            headers:{'content-type':'application/json'},
            data: payload
        })
    })
}
//删除收藏
export const deleteRecord = (data:any) => {
    return requestClient.request({
        url:'/api/question/deleteRecord',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useDeleteRecord = () => {
    return useMutation({
        mutationKey: ['/api/question/deleteRecord'],
        mutationFn: (payload:any) => requestClient.request({
            url:'/api/question/deleteRecord',
            method:'post',
            headers:{'content-type':'application/json'},
            data: payload
        })
    })
}
//获取收藏、错题记录
export const getQuestionErrorOrRecord = (data:any) => {
    return requestClient.request({
        url:'/api/question/getQuestionErrorOrRecord',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useGetQuestionErrorOrRecord = (params:any) => {
    const { data, isLoading, ...rest } = useQuery({
        queryKey: ['/api/question/getQuestionErrorOrRecord', params],
        queryFn: () => requestClient.request({
            url:'/api/question/getQuestionErrorOrRecord',
            method:'post',
            headers:{'content-type':'application/json'},
            data: params
        })
    })
    return { data, isLoading, ...rest }
}
//后台添加题目
export const reqAddQuestion = (data:any) => {
    return requestClient.request({
        url:'/api/question/addQuestion',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const useAddQuestion = () => {
    return useMutation({
        mutationKey: ['/api/question/addQuestion'],
        mutationFn: (payload:any) => requestClient.request({
            url:'/api/question/addQuestion',
            method:'post',
            headers:{'content-type':'application/json'},
            data: payload
        })
    })
}
// 等级系统
export const reqLvInfo = (data:any) => {
    return requestClient.request({
        url:'/api/lv/getLvInfo',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
export const reqAddLvExp = (data:any) => {
    return requestClient.request({
        url:'/api/lv/addExp',
        method:'post',
        headers:{'content-type':'application/json'},
        data
    })
}
