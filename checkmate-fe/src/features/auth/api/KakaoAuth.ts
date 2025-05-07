import axios from 'axios';
import { customAxios } from '@/shared/api/client/customAxios';

export async function PostKakaoCallback(code: string) {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', import.meta.env.VITE_REST_API);
  params.append('redirect_uri', import.meta.env.VITE_REDIRECT_URL);
  params.append('code', code);

  let profileRes;  // profileRes를 try 블록 밖에서 정의

  try {
    // 1) 토큰 요청
    const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });

    console.log(tokenRes.data); // 성공 시 데이터 출력

    // 2) 액세스 토큰 추출
    const { access_token } = tokenRes.data;

    // 3) 카카오 유저 프로필 조회
    profileRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log("카카오 프로필 데이터:", profileRes.data);

    const { id, kakao_account } = profileRes.data;
    const { name, email, birthyear = '', birthday = '', phone_number } = kakao_account;

    // 전화번호에서 +82를 0으로 변경하고 공백을 제거
    const phoneNumber = phone_number ? phone_number.replace("+82", "0").replace(/\s+/g, '') : '';
    
    // phone_number가 없거나 id가 없으면 에러 처리
    if (!phoneNumber || !id) {
      throw new Error('Phone number or provider ID is missing');
    }

    // 4) 백엔드 /api/auth/login에 필요한 필드 전달
    const loginResponse = await customAxios.post('/api/auth/login', {
      name,
      email,                   // @NotBlank @Email
      birthyear,               // '' 또는 'YYYY'
      birthday,                // '' 또는 'MMDD'
      phone_number: phoneNumber,  // 백엔드에서 요구하는 전화번호 형식
      provider_id: id.toString()  // provider_id 필드명 수정
    });

    console.log('로그인 응답:', loginResponse.data );

    // 5) 로그인 성공 여부 확인
    if (loginResponse.data.success) {
      console.log("로그인 성공!");
      return loginResponse.data;  // 로그인 성공 시 데이터 반환
    } else {
      console.error("로그인 실패:", loginResponse.data.error.message);
      return null;  // 로그인 실패 시 null 반환
    }

  } catch (error) {
    // 오류 처리 (AxiosError 타입으로 캐스팅)
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);  // 에러 시 상세 응답 출력
    } else {
      console.error('An unknown error occurred:', error);  // AxiosError가 아닌 경우
    }
    return profileRes ? profileRes.data : null;  // profileRes가 없으면 null 반환
  }
}
