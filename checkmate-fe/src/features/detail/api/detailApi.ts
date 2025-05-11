import { customAxios } from "@/shared/api"

//계약서 상세조회
export const getContractDetail = async (contractId: number): Promise<Blob> => {
  try {
    const response = await customAxios.get(`/api/contract/${contractId}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  } catch (error) {
    console.error('계약서 상세조회 불러오기 실패:', error);
    throw error;  
  }
};