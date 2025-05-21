import { getAccessToken } from '@/entities/user';
import { refreshAccessToken } from '@/shared/api'
import axios from 'axios';

// 공통 axios 인스턴스 생성
export const customAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  //   withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청(request) 인터셉터: 요청 보내기 전에 토큰 자동 추가
customAxios.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config;
  },
  error => Promise.reject(error),
);

// 응답(response) 인터셉터: 에러 응답 처리
customAxios.interceptors.response.use(
  response => response,  // 성공적인 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;

    // 401 오류(토큰 만료) 발생 시
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새로운 access_token을 요청
        const newAccessToken = await refreshAccessToken();
        
        // 새로운 access_token을 헤더에 설정하고, 원래의 요청을 다시 보냄
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // 원래의 요청을 다시 시도
        return customAxios(originalRequest);
      } catch (err) {
        // 리프레시 토큰 갱신 실패 시 로그인 화면으로 리다이렉트
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // 401 오류가 아니거나, 토큰 갱신 실패 시 원래 에러 반환
    return Promise.reject(error);
  },
);