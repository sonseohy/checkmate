import { customAxios } from "@/shared/api";

//로컬 스토리지에서 accessToken 가져오기
export const getAccessToken = () => {
    return localStorage.getItem('access_token');
};

//사용자 정보 가져오기
export const getUserInfo = async() => {
    const access_token = getAccessToken();

    if(!access_token) {
        return null;
    } 
    try {
        const response = await customAxios.get('api/users/me', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`
            }
        });
        return response.data;
    } catch(error) {
        console.error('사용자 정보 가져오기 실패: ', error);
        return null;
    }
};

