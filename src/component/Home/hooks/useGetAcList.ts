import { useQuery } from "@tanstack/react-query";
import requestClient from "../../../utils/requestClient";
let url = '/manage/talk/about/activity/page'
export const useGetAcList =(params:any)=>{
    const {data,isLoading,...rest} = useQuery({
        queryKey:[url,params],
        queryFn:()=>{
        return    requestClient.request({
                   method: 'POST',url,
                data:
                    params
                
            })
        }
    })
    const acData = data?.data?.list
    return {
        isLoading,
        data,
        acData,
        ...rest
    }

}