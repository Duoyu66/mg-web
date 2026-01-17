// src/hooks/useLogin.ts
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import requestClient from '@/utils/requestClient';
import { LoginCredentials, LoginResponse, User } from '../types/auth';

interface UseLoginProps {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: any) => void;
}

const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const res: any = await requestClient.post('/api/auth/login', credentials);
  if (res.code === 200) {
    return res.data;
  }
  throw new Error(res.message || 'Login failed');
};

export const useLogin = (props?: UseLoginProps): UseMutationResult<LoginResponse, Error, LoginCredentials> => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("登录的data是",data);
      
      // 保存 token 到 localStorage
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 调用成功回调
      props?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      props?.onError?.(error);
    },
  });
};