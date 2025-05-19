//질문 리스트
export interface questions {
  contractId: number;
  contractCategoryId: number;
  questionId: number;
  questionDetail: string;
}

export interface questionList {
  question: questions[];
}

export interface ContractSummary {
  contract_id: number; // PK
  title: string; // 제목
  category_id: number; // 카테고리
  updated_at?: string; // (옵션) 수정일
}
