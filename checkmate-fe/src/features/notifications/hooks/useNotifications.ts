//알림 목록 조회 및 상태 변경
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/features/notifications';

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationService.getAll,
  });

  const markAsRead = useMutation({
    mutationFn: NotificationService.markAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllAsRead = useMutation({
    mutationFn: NotificationService.markAllAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return {
    notifications: data?.data ?? [], // ✅ 여기서 .data만 넘기도록 수정
    isLoading,
    error,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
  };
};
