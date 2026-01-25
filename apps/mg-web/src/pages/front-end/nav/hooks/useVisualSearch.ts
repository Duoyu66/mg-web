import { useQuery } from '@tanstack/react-query';
import requestClient from '@/utils/requestClient';

export interface VisualSearchItem {
  id: string;
  title: string;
  desc: string;
  url: string;
  icon?: string;
  category?: string;
}

export const useVisualSearch = (keyword: string) => {
  return useQuery({
    queryKey: ['/mg/api/visual/search', keyword],
    queryFn: async () => {
        if (!keyword) return [];
        const res: any = await requestClient.get('/mg/api/visual/search', {
            params: { keyword }
        });
        if (res.code === 200) {
            return res.data as VisualSearchItem[];
        }
        return [];
    },
    enabled: !!keyword && keyword.trim().length > 0,
    staleTime: 1000 * 60 * 1, // 1 minute
  });
};
