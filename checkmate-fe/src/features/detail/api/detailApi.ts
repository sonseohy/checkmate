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

// 계약서 다운로드 
export const getContractownload = async (contractId:number) => {
  try {
    const response = await customAxios.get(`/api/files/${contractId}/download`, {
      responseType: 'blob'
    });
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', '제목을 입력하세요.pdf');
    document.body.appendChild(link);
    link.click();

  } catch(error) {
    console.error('계약서 다운로드 실패:', error);
  }
};