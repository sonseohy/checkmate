import { customAxios } from '@/shared/api';
import { NotificationResponse } from '@/features/notifications/model/types';

// 모든 알람 확인
export const getAllNotifications = (): Promise<NotificationResponse> =>
  customAxios.get('/api/notifications').then((res) => res.data);

// 안읽은 알람 확인
export const getUnreadNotifications = (): Promise<NotificationResponse> =>
  customAxios.get('/api/notifications/unread').then((res) => res.data);

// 특정 알람 읽음 표시
export const markNotificationAsRead = (id: number): Promise<void> =>
  customAxios.put(`/api/notifications/${id}/read`).then((res) => res.data);

// 전체 알람 읽음 표시
export const markAllNotificationsAsRead = (): Promise<void> =>
  customAxios.put('/api/notifications/read-all').then((res) => res.data);
