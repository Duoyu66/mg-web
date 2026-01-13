import { useQuery } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useGetLvInfo = (params: any) => {
  return useQuery({
    queryKey: ["/api/lv/getLvInfo", params],
    queryFn: () =>
      requestClient.request({
        url: "/api/lv/getLvInfo",
        method: "post",
        headers: { "content-type": "application/json" },
        data: params,
      }),
    enabled: Boolean(params?.id),
  });
};

