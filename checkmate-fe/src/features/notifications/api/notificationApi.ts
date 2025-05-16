import { customAxios } from '@/shared/api';

// 모든 알람 확인
export const getAllNotifications = () => customAxios.get('/api/notifications');

// 안읽은 알람 확인
export const getUnreadNotifications = () =>
  customAxios.get('/api/notifications/unread');

// 특정 알람 읽음 표시
export const markNotificationAsRead = (id: number) =>
  customAxios.put(`/api/notifications/${id}/read`);

// 전체 알람 읽음 표시
export const markAllNotificationsAsRead = () =>
  customAxios.put('/api/notifications/read-all');
