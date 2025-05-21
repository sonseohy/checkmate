import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '@/features/auth';
import { getUserInfo } from '@/entities/user';

export function useUserInfo(): UserInfo | null {
  const { data } = useQuery<UserInfo | null, Error>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false, // 에러 발생 시 재시도하지 않음
  });

  return data ?? null;
}
