import { useMutation } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useAddLvExp = () => {
  return useMutation({
    mutationKey: ["/api/lv/addUserExp"],
    mutationFn: (payload: any) =>
      requestClient.request({
        url: "/api/lv/addUserExp",
        method: "post",
        headers: { "content-type": "application/json" },
        data: payload,
      }),
  });
};

