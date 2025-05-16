import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserInfo } from '@/features/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  location: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserInfo>) {
      state.isAuthenticated = true;
      state.user = action.payload; //로그인한 사용자 정보
    },
    logout(state) {
      state.isAuthenticated = false; //로그아웃 시 사용자 정보 초기화
      state.user = null;
      state.location = null;
    },
    setLocation(state, action: PayloadAction<{ lat: number; lng: number } | null>) {
      state.location = action.payload;
    },
  },
});

export const { loginSuccess, logout, setLocation } = authSlice.actions;

export default authSlice.reducer;
