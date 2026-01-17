import { useMutation } from '@tanstack/react-query';
import requestClient from '@/utils/requestClient';
import { message } from 'antd';

interface SendPostParams {
  content: string;
  [key: string]: any;
}

export const useSendPost = () => {
  return useMutation({
    mutationFn: async (data: SendPostParams) => {
      const res: any = await requestClient.post('/api/post/sendPost', data);
      if (res.code === 200) {
        return res.data;
      }
      throw new Error(res.message || '发布失败');
    },
    onError: (error: any) => {
      message.error(error.message || '发布失败');
    }
  });
};
