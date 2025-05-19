import {
  AnalysisResult,
  AnalysisResponse,
  fetchAnalysisResult,
} from '@/features/analyze';

export const AnalysisService = {
  getResult: async (contractId: string): Promise<AnalysisResult> => {
    const res: AnalysisResponse = await fetchAnalysisResult(contractId);

    if (!res.success || !res.data) {
      throw new Error('분석 결과를 찾을 수 없습니다.');
    }

    return res.data;
  },
};
