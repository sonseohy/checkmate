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
  options: string[] | null;
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

export interface ChecklistItem {
    checkListId: number;
    contractCategoryId: number;
    title: string;
    checkListDetail: string;
  }