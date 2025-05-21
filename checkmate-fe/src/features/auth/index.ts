export { default as Auth } from './ui/Auth';
//api
export { PostKakaoCallback } from './api/KakaoAuth';
export { postLogout } from './api/KakaoAuth';

//hook
export { useUserInfo } from './hooks/useUserInfo';

//types
export type { UserInfo, AuthState } from './model/types';

export { default as authReducer } from './slices/authSlice';
export * from './slices/authSlice'; // loginSuccess, logout, setLocation
