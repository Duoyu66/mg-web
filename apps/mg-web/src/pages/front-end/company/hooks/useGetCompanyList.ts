import { useQuery } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";
import { Company, CompanyStatus } from "../types";

// API Endpoint
const API_URL = "/api/company/list";

// Request Parameters Interface
export interface CompanyListParams {
  name?: string; // For search
  status?: string; // For filtering
  [key: string]: any;
}

// API Response Item Structure
interface ApiCompanyItem {
  level: number;
  companies: Array<{
    id: string;
    title: string;
    scale: string;
    logo: string | null;
    recruitmentUrl: string;
    level: number;
    createTime: string;
    updateTime: string;
  }>;
}

// Response Interface
export interface CompanyListResponse {
  list: ApiCompanyItem[];
}

export const useGetCompanyList = (
  params: CompanyListParams = {}
) => {
  return useQuery<CompanyListResponse>({
    queryKey: [API_URL, params],
    queryFn: async () => {
      const response: any = await requestClient.request({
        url: API_URL,
        method: "get",
        headers: { "content-type": "application/json" },
        params: params,
      });
      return { list: response.data || [] } as CompanyListResponse;
    },
  });
};
