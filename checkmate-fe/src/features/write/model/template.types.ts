// 템플릿 조회 관련 types
export type InputType =
  | 'TEXT'
  | 'NUMBER'
  | 'DATE'
  | 'RADIO'
  | 'CHECKBOX';

export interface Template {
  id: number;
  name: string;
  version: number;
  categoryId: number;
}

export interface TemplateField {
  id: number;
  fieldKey: string;
  label: string;
  inputType: InputType;
  required: boolean;
  sequenceNo: number;
  options: string[] | string | null;
  dependsOn: string | null;
  description: string | null;
}

export interface TemplateSection {
  id: number;
  name: string;
  description: string;
  required: boolean;
  sequenceNo: number;
  fields: TemplateField[];
}

export interface TemplateResponse {
  template: Template;
  sections: TemplateSection[];
}

export interface CreateContractTemplateResponse extends TemplateResponse {
  contract: {
    id: number;
  };
}

// 계약서 생성 관련 types
export interface CreateContractRequest {
  categoryId: number;
  userId: string;
}

export interface CreateContractResponse {
  contract: {
    id: number;
  };
  template: Template;
  sections: TemplateSection[];
  values?: Record<string, any>;
}

// 체크리스트 관련 types
export interface ChecklistItem {
    checkListId: number;
    contractCategoryId: number;
    title: string;
    checkListDetail: string;
  }