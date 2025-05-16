import {
  getAllNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api/notificationApi'; // 👈 정확한 경로로 api 폴더 참조

export const NotificationService = {
  getAll: getAllNotifications,
  getUnread: getUnreadNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
};
