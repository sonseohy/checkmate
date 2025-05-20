export interface UploadResponse {
  success: boolean;
  data: {
    contract_id: number;
    title: string;
    created_at: string;
  };
  error: string | null;
  timestamp: string;
}

export interface UploadContractParams {
  title: string;
  categoryId: number;
  files: File[];
}

// 분석 결과 타입
export interface AnalysisResult {
  contractId: number;
  categoryName: string;
  summaries: {
    summaryReportId: string;
    aiAnalysisReportId: string;
    description: string;
  }[];
  riskClauses: {
    riskClauseReportId: string;
    aiAnalysisReportId: string;
    riskLevel: string;
    originalText: string;
    description: string;
  }[];
  improvements: {
    improvementReportId: string;
    aiAnalysisReportId: string;
    description: string;
  }[];
  missingClauses: {
    missingClauseReportId: string;
    aiAnalysisReportId: string;
    importance: string;
    description: string;
  }[];
  createdAt: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult | null;
  error: any;
  timestamp: string;
}
