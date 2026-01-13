import { useMutation } from "@tanstack/react-query";
import requestClient from "@/utils/requestClient";

export const useGetExamList = () => {
  return useMutation({
    mutationKey: ["/api/question/getQuestionExam"],
    mutationFn: (payload: any) =>
      requestClient.request({
        url: "/api/question/getQuestionExam",
        method: "post",
        headers: { "content-type": "application/json" },
        data: payload,
      }),
  });
};

