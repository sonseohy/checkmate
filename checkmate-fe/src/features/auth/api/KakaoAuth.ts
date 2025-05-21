import axios from 'axios';
import { customAxios } from '@/shared/api/client/customAxios';
import Swal from 'sweetalert2';
import { NavigateFunction } from 'react-router-dom';
import { logout, loginSuccess } from '@/features/auth/slices/authSlice';
import { AppDispatch } from '@/app/redux/store';
import { UserInfo } from '@/features/auth';
import { chatService } from '@/features/chat';

//카카오 로그인
export async function PostKakaoCallback(code: string, dispatch: AppDispatch) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', import.meta.env.VITE_REST_API);
  params.append('redirect_uri', import.meta.env.VITE_REDIRECT_URL);
  params.append('code', code);

  let profileRes; // profileRes를 try 블록 밖에서 정의

  try {
    // 1) 토큰 요청
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
      },
    );

    // 2) 토큰 추출
    const { access_token } = tokenRes.data;

    // 3) 카카오 유저 프로필 조회
    profileRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, kakao_account } = profileRes.data;
    const {
      name,
      email,
      birthyear = '',
      birthday = '',
      phone_number,
    } = kakao_account;

    // 전화번호에서 +82를 0으로 변경하고 공백을 제거
    const phoneNumber = phone_number
      ? phone_number.replace('+82', '0').replace(/\s+/g, '')
      : '';

    // phone_number가 없거나 id가 없으면 에러 처리
    if (!phoneNumber || !id) {
      throw new Error('Phone number or provider ID is missing');
    }

    // 4) 백엔드 /api/auth/login에 필요한 필드 전달
    const loginResponse = await customAxios.post('/api/auth/login', {
      name,
      email,
      birthyear,
      birthday,
      phone_number: phoneNumber,
      provider_id: id.toString(),
    });

    if (loginResponse.data.success) {
      // 로컬 스토리지에 토큰 저장하는 코드
      localStorage.setItem(
        'access_token',
        loginResponse.data.data.access_token,
      );
      localStorage.setItem(
        'refresh_token',
        loginResponse.data.data.refresh_token,
      );

      const userInfo: UserInfo = {
        user_id: id,
        name,
        birth: `${birthyear}-${birthday}`,
        email,
        phone: phoneNumber,
      };

      dispatch(loginSuccess(userInfo));

      // 챗봇용 사용자 정보 설정
      chatService.setUser(userInfo.user_id.toString());

      return loginResponse.data;
    } else {
      return null;
    }
  } catch {
    return profileRes ? profileRes.data : null; // profileRes가 없으면 null 반환
  }
}

// 로그아웃
export const postLogout = async (
  navigate: NavigateFunction,
  dispatch: AppDispatch,
) => {
  try {
    const response = await customAxios.post('/api/auth/logout');

    //로그아웃 시 리덕스 상태 초기화
    dispatch(logout());

    // 4. 채팅 이력 삭제 처리
    chatService.clearUserData();

    // 사용자 정보 null로 설정 (이미 clearUserData에서 처리되었지만 명시적으로 호출)
    chatService.setUser(null);

    // 로컬 토큰 완전 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    Swal.fire({
      title: '로그아웃',
      text: '로그아웃이 완료되었습니다.',
      icon: 'success',
      confirmButtonText: '확인',
    });

    navigate('/');

    return response.data;
  } catch {
    // console.error('로그아웃 실패:', error);
  }
};
