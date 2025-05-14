
import { customAxios } from "@/shared/api";
import { ContractListData, Courthouse } from "@/features/mypage";

// 법원리스트  데이터
export const getCourthouseList = async (): Promise<Courthouse[]> => {
  try {
    // 제네릭으로 응답 타입 지정
    const response = await customAxios.get<{ data: Courthouse[] }>("/api/courthouses");
    return response.data.data;
  } catch (error) {
    console.error("법원 리스트 불러오기 실패:", error);
    return [];
  }
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
  