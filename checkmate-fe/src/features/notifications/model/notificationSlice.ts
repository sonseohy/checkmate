import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from './types';

// 알림 1개에 대한 타입
// 전체 상태 구조
export interface NotificationState {
  list: Notification[];
  hasNew: boolean;
}

// 초기 상태
const initialState: NotificationState = {
  list: [],
  hasNew: false,
};

// 슬라이스 생성
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // 알림 추가
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.unshift(action.payload);
      state.hasNew = true;
    },
    // 알림 전체 삭제
    clearNotifications: (state) => {
      state.list = [];
      state.hasNew = false;
    },
    // 새 알림 표시 제거 (읽음 처리)
    markAsRead: (state) => {
      state.hasNew = false;
    },
  },
});

// 액션과 리듀서 export
export const { addNotification, clearNotifications, markAsRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
