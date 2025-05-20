import { customAxios } from '@/shared/api';
import Swal from 'sweetalert2';

//로컬 스토리지에서 accessToken 가져오기
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

//로컬 스토리지에서 refresh_token 가져오기
export const getRepreshAccessToken = () => {
  return localStorage.getItem('refresh_token');
};

//사용자 정보 가져오기
export const getUserInfo = async () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return null;
  }
  try {
    const response = await customAxios.get('api/users');
    return response.data.data;
  } catch (error) {
    console.error('회원 정보 가져오기 실패: ', error);
    return null;
  }
};

//사용자 정보 수정
export const updateUserInfo = async (params: {
  birth: string;
  phone: string;
}) => {
  try {
    const response = await customAxios.put('api/users', params);
    return response.data;
  } catch (error) {
    // console.log('회원 정보 수정 실패:', error)
  }
};

// 회원 탈퇴

export const deleteUserInfo = async () => {
  try {
    const response = await customAxios.delete('api/users');
    if (response.data !== null) {
      Swal.fire({
        title: '회원 탈퇴 성공',
        text: 'checkmate를 이용해 주셔서 감사합니다.',
        icon: 'success',
        confirmButtonText: '확인',
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // console.log('회원 탈퇴 실패:', error);
    return false;
  }
};
