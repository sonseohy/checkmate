// 저장 요청용 타입
export interface ContractInputSection {
  sectionId: number;
  fieldValues: {
    fieldId: number;
    value: string;
  }[];
}

export interface SaveContractInputsRequest {
  contractId: number;
  inputs: ContractInputSection[]; // 여러 섹션을 한 번에 저장
}

// 저장 응답 타입
export interface SaveContractInputsResponse {
  contractId: number;
  sectionId: number;
  legalClauses: {
    clauseId: string;
    titleText: string;
    introText: string;
    content: string[];
    order: number;
  }[];
  message: string;
}

// 에러 응답
export interface ContractInputError {
  code: 'CONTRACT-001' | 'SECTION-001' | 'FIELD-001' | 'FIELD-002' | 'FIELD-003';
  message: string;
}