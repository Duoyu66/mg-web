import { useQuery } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

// API Endpoint
const API_URL = "/api/company/experiences";

// Request Parameters Interface
export interface InterviewExperienceListParams {
  companyId: string;
}

// API Response Item Structure
export interface InterviewExperience {
  id: string;
  title: string;
  vip: string; // 'free' | 'vip'
  createTime: string;
}

export const useGetInterviewExperienceList = (
  params: InterviewExperienceListParams
) => {
  return useQuery<InterviewExperience[]>({
    queryKey: [API_URL, params],
    queryFn: async () => {
      const response: any = await requestClient.request({
        url: API_URL,
        method: "get",
        params: params,
      });
      return response.data || [];
    },
    enabled: !!params.companyId,
  });
};
