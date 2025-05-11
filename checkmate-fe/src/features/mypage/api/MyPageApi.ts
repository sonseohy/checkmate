import { customAxios } from "@/shared/api";
import axios from "axios";
import { ContractListData, LatLng } from "@/features/mypage";

// 법원 데이터

//카카오맵에서 위도/경도 불러오기
export async function searchPlace(keyword: string): Promise<LatLng> {
  const res = await axios.get(
    'https://dapi.kakao.com/v2/local/search/keyword.json',
    {
      params: {
        query: keyword,
        size: 1,           // 최대 1개만
      },
      headers: { Authorization: `KakaoAK ${import.meta.env.VITE_REST_API}` },
    }
  );
  const doc = res.data.documents[0];
  return { lat: parseFloat(doc.y), lng: parseFloat(doc.x) };
};

//내 계약서 리스트
export const contractList = async():Promise<ContractListData> => {
  try {
    const response = await customAxios.get('/api/contract');
    return { contracts: response.data.data };
  } catch(error) {
    console.error("계약서 리스트 불러오기 실패:", error);
    return { contracts: [] }; 
  }
};
  