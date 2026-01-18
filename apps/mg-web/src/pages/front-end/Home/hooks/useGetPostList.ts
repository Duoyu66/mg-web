import { useInfiniteQuery, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import requestClient from '@/utils/requestClient';

const API_URL = '/api/post/getAll';
type VipType = 'free' | 'vip' | 'svip';
export interface Post {
  id: string;
  content: string;
  userId: string;
  nickname: string;
  avatar: string;
  school?: string;
   title?: string;
  signature?: string;
  view: number;
  likeCount: number;
  commentCount: number;
  createTime: string;
  updateTime?: string;
  ipAddress?: string;
  tags?: string[];
  hasThumb?: boolean;
  hasFavour?: boolean;
  vipType?: VipType;
}

export interface PostListParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  search?: string;
  [key: string]: any;
}

export interface PostListResponse {
  list: Post[];
  total: number;
  page: number | null;
  pageSize: number | null;
  hasNext: boolean | null;
  totalPage: number | null;
}

const fetchPostList = async (params?: PostListParams): Promise<PostListResponse> => {
  try {
    // requestClient interceptor returns res.data (the body)
    const res: any = await requestClient.get(API_URL, { params });
    if (res.code === 200) {
      return res.data;
    }
    throw new Error(res.message || '请求失败');
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
};

export const useGetPostList = (
  params?: PostListParams,
  options?: Omit<UseInfiniteQueryOptions<PostListResponse, Error, InfiniteData<PostListResponse>, any, any>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
  return useInfiniteQuery({
    queryKey: [API_URL, params],
    queryFn: ({ pageParam }) => fetchPostList({ ...params, page: pageParam as number, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If backend returns standard pagination info
      if (lastPage.hasNext) {
        return (lastPage.page || 0) + 1;
      }
      // If backend returns null for hasNext/page (as in user sample), use list length check
      if (lastPage.list && lastPage.list.length > 0) {
        // Assume next page is current page count + 1
        return allPages.length + 1;
      }
      return undefined;
    },
    // staleTime: 1000 * 60 * 5,
    retry: 2,
    // retryDelay: 1000,
    ...options,
  });
};
