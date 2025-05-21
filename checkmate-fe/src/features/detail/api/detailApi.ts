import { customAxios } from '@/shared/api';
import { questionList, questions } from '@/features/detail';

//계약서 상세조회
export const getContractDetail = async (contractId: number): Promise<Blob> => {
  try {
    const response = await customAxios.get(`/api/contract/${contractId}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  } catch(error) {
    console.error('계약서 상세조회 불러오기 실패:', error);
    throw error; 
  }
};

// 계약서 다운로드
export const getContractownload = async (
  contractId: number,
  fileName: string,
) => {
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
  } catch {
    // console.error('계약서 다운로드 실패:', error);
  }
};

// 계약서 삭제
export const deleteContractDetail = async (contractId: number) => {
  try {
    const response = await customAxios.delete(`/api/contract/${contractId}`);
    return response;
  } catch {
    // console.error('계약서 삭제 실패:', error);
  }
};

//질문 리스트
export const getContractQuestions = async (
  contractId: number,
): Promise<questionList> => {
  try {
    const { data: res } = await customAxios.get(`/api/questions/${contractId}`);

    /** ①  서버가 내려줄 수 있는 모든 위치를 차례대로 검사 */
    const arr: any =
      /* case-A ▸ { data: { questions: [...] } } ← ❗ 새 구조 */
      Array.isArray(res?.data?.questions)
        ? res.data.questions
        : /* case-B ▸ { data: [...] } */
        Array.isArray(res?.data)
        ? res.data
        : /* case-C ▸ { questions: [...] } | { question: [...] } */
          res?.questions ??
          res?.question ??
          /* case-D ▸ 바로 배열 */
          (Array.isArray(res) ? res : []);

    /** ②  타입 맞춰서 전처리 */
    const cleaned = (arr as questions[]).map((q) => ({
      ...q,
      questionDetail: q.questionDetail?.replace(/^"|"$/g, ''), // 따옴표 제거
    }));

    return { question: cleaned };
  } catch {
    return { question: [] };
  }
};

export const fetchQuestions = (contractId: number) =>
  getContractQuestions(contractId);
