import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '@/features/theme/model/themeSlice';
import authReducer from '@/features/auth/slices/authSlice'; 

export const store = configureStore({
  reducer: {
    theme: themeReducer, //테마 관리
    auth: authReducer, //로그인 상태 관리
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
