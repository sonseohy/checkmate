import {
  postContractUpload,
  getOcrResult,
} from '@/features/analyze/api/AnalyzeApi';
import { UploadContractParams } from '@/features/analyze/model/types';

export const uploadContract = async (params: UploadContractParams) => {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('category_id', String(params.categoryId));
  formData.append('file', params.file);

  const res = await postContractUpload(formData);
  return res.data;
};

export const requestOCR = async (contractId: number) => {
  const res = await getOcrResult(contractId);
  return res.data;
};
