import axios from 'axios';
import { getAuthSession } from './auth-utils';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api-connect"

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(async (config) => {
  const session =  await getAuthSession();
  console.log('session ===> ', session)
  
  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 세션 갱신
      const session = await getAuthSession();
      if (session?.user?.accessToken) {
        originalRequest.headers.Authorization = `Bearer ${session.user.accessToken}`;
        return api(originalRequest);
      }
    }   
    
    return Promise.reject(error);
  }
);


export default api;
