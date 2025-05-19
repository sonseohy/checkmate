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
export const getContractownload = async (contractId: number) => {
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
    link.setAttribute('download', '제목을 입력하세요.pdf');
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
    const res = await customAxios.get(`/api/questions/${contractId}`);

    /** ── 어떤 필드에 배열이 있든 안전하게 꺼내기 ── */
    const payload = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
      ? res.data
      : []; // 예상 밖 구조면 빈배열

    const cleaned: questions[] = payload.map((q: any) => ({
      ...q,
      questionDetail: String(q.questionDetail ?? '').replace(/"/g, ''),
    }));

    return { question: cleaned };
  } catch (e) {
    console.error('질문 리스트 불러오기 실패:', e);
    return { question: [] };
  }
};
