import { customAxios } from '@/shared/api';
import { AnalysisResult } from '@/features/analyze';

// 업로드 api
export const postContractUpload = (formData: FormData) => {
  return customAxios.post('/api/contract/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 분석 결과 조회 api
export const fetchAnalysisResult = async (
  contractId: string,
): Promise<AnalysisResult> => {
  const response = await customAxios.get(`/api/analysis/${contractId}`);
  return response.data;
};
