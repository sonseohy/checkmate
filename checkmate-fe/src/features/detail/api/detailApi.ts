import { customAxios } from '@/shared/api';
import { questionList, questions } from '@/features/detail';

//계약서 상세조회
export const getContractDetail = async (contractId: number): Promise<Blob> => {
  try {
    const response = await customAxios.get(`/api/contract/${contractId}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  } catch (error) {
    console.error('계약서 상세조회 불러오기 실패:', error);
    throw error;
  }
};

// 계약서 다운로드
export const getContractownload = async (contractId: number, fileName: string ) => {

  try {
    const response = await customAxios.get(
      `/api/files/${contractId}/download`,
      {
        responseType: 'blob',
      },
    );
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = downloadUrl;
     link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('계약서 다운로드 실패:', error);
  }
};

// 계약서 삭제
export const deleteContractDetail = async (contractId: number) => {
  try {
    const response = await customAxios.delete(`/api/contract/${contractId}`);
    return response;
  } catch (error) {
    console.error('계약서 삭제 실패:', error);
  }
};

//질문 리스트
export const getContractQuestions = async (
  contractId: number,
): Promise<questionList> => {
  try {
    const response = await customAxios.get(`/api/questions/${contractId}`);
    console.log('API Response:', response.data);
    const data: questions[] = response.data.data;
    // questionDetail에서 따옴표를 제거한 후 반환
    const cleanedQuestions = data.map((question) => ({
      ...question,
      questionDetail: question.questionDetail.replace(/"/g, ''), // 따옴표 제거
    }));

    return { question: cleanedQuestions }; // 수정된 데이터를 반환
  } catch (error) {
    console.error('질문 리스트 불러오기 실패:', error);
    return { question: [] }; // 실패 시 기본값 반환
  }
};
