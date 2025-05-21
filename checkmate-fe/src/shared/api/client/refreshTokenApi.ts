import { customAxios } from '@/shared/api';
import { getRepreshAccessToken } from '@/entities/user';

export const refreshAccessToken = async () => {
  const refreshToken = getRepreshAccessToken();

  try {
    const response = await customAxios.post('/api/auth/reissue-token', {
      refresh_token: refreshToken,
    });

    // console.log('API Response:', response); // API 응답 로그 출력

    if (response.data.success) {
      const [access_token, refresh_token] = response.data.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      return access_token;
    } else {
      //   console.error('Token reissue 실패:', response.data.error.message);
    }
  } catch (error) {
    // console.error('Error while refreshing token:', error);
  }
};
