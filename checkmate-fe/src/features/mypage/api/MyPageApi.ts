import { customAxios } from '@/shared/api';
import { ContractListData, Courthouse } from '@/features/mypage';
import axios from 'axios';

// 법원리스트  데이터
export const getCourthouseList = async (): Promise<Courthouse[]> => {
  try {
    // 제네릭으로 응답 타입 지정
    const response = await customAxios.get<{ data: Courthouse[] }>(
      '/api/courthouses',
    );
    return response.data.data;
  } catch {
    return [];
  }
};

//내 계약서 리스트
export const contractList = async (): Promise<ContractListData> => {
  try {
    const response = await customAxios.get('/api/contract');
    return { contracts: response.data.data };
  } catch {
    return { contracts: [] };
  }
};

// 사용자 위치 -> 시•도 명으로 바꾸기

export const getRegionName = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(
      'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
      {
        params: {
          x: lng, // 경도
          y: lat, // 위도
        },
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_REST_API}`,
        },
      },
    );
    // 1depth_name: 시/도
    return response.data.documents?.[0]?.region_1depth_name || null;
  } catch {
    return null;
  }
};
