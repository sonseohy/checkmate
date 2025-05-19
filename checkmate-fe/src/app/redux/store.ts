import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import { notificationReducer } from '@/features/notifications';

export const store = configureStore({
  reducer: {
    auth: authReducer, //로그인 상태 관리
    notifications: notificationReducer, // 알림 상태관리
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
