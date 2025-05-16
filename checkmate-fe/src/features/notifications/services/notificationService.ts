import {
  getAllNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/features/notifications';

export const NotificationService = {
  getAll: getAllNotifications,
  getUnread: getUnreadNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
};
