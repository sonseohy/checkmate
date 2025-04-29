// src/features/analyze/services/AnalyzeService.ts
import { customAxios } from '@/shared/api/client/customAxios';

interface UploadContractParams {
  title: string;
  categoryId: number;
  file: File;
}

export const uploadContract = async ({
  title,
  categoryId,
  file,
}: UploadContractParams) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category_id', categoryId.toString());
  formData.append('file', file);

  const res = await customAxios.post('/contracts/uploads', formData);
  return res.data; // { contractId: number }
};

export const requestOCR = async (contractId: number) => {
  const res = await customAxios.get(`/ocr/${contractId}`);
  return res.data; // { lines: OCRLine[] }
};
