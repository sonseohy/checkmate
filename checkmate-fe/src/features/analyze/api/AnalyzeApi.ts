import { customAxios } from '@/shared/api';
import { AnalysisResponse } from '@/features/analyze';

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
): Promise<AnalysisResponse> => {
  const response = await customAxios.get<AnalysisResponse>(
    `/api/analysis/${contractId}`,
  );
  return response.data;
};
