import { useQuery } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

const API_URL = "/api/company/getExperience";

export interface InterviewExperienceDetailResponse {
  id: string;
  title: string;
  companyId: string;
  content: string;
  job: string; // "前端"
  exp_time: string | null;
  userId: string | null;
  vip: string; // "free"
  createTime: string;
  updateTime: string;
  
  // Optional fields that might be enriched or are missing from current API response
  companyName?: string; 
  logo?: string;
  color?: string;
  level?: string;
  tags?: string[];
  views?: number;
  likes?: number;
  author?: string;
  avatar?: string;
  difficulty?: '简单' | '中等' | '困难';
}

export const useGetInterviewExperienceDetail = (id: string) => {
  return useQuery<InterviewExperienceDetailResponse>({
    queryKey: [API_URL, id],
    queryFn: async () => {
      const response: any = await requestClient.request({
        url: API_URL,
        method: "get",
        params: { id },
      });
      return response.data;
    },
    enabled: !!id,
  });
};
