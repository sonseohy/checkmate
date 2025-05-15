import { AnalysisResult, fetchAnalysisResult } from '@/features/analyze';

export const AnalysisService = {
  getResult: async (contractId: string): Promise<AnalysisResult> => {
    const res = await fetchAnalysisResult(contractId);

    // 기본값 보정
    return {
      contractId: res.contractId ?? '',
      summary: res.summary ?? '',
      riskFactors: res.riskFactors ?? [],
      suggestions: res.suggestions ?? [],
      score: res.score ?? 0,
    };
  },
};
