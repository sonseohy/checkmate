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
customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // 또는 sessionStorage, 쿠키 등에서 꺼내오기
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // Bearer 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답(response) 인터셉터: 에러 응답 처리
customAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 인증 실패(401 Unauthorized) 처리 예시
    if (error.response?.status === 401) {
      // 토큰 만료나 인증 오류
      localStorage.removeItem('accessToken'); // 토큰 삭제
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  },
);
