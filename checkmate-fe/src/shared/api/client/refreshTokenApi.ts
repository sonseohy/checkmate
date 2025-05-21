import { customAxios } from '@/shared/api';
import { getRefreshToken } from '@/entities/user';

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  try {
    const response = await customAxios.post('/api/auth/reissue-token', {
      refresh_token: refreshToken,
    });

    if (response.data.success) {
      const [access_token, refresh_token] = response.data.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      return access_token;
    }
  } catch {
    // console.error('Error while refreshing token:', error);
  }
};
