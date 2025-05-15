export interface UploadResponse {
  contractId: number;
  title: string;
  createdAt: string;
}

export interface UploadContractParams {
  title: string;
  categoryId: number;
  files: File[];
}

// 분석 결과 타입
export interface AnalysisResult {
  contractId: string;
  summary: string;
  riskFactors: string[];
  suggestions: string[];
  score: number;
  // 필요한 추가 필드
}
