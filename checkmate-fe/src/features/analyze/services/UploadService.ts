import { customAxios } from '@/shared/api/client/customAxios';

interface UploadContractParams {
  title: string;
  categoryId: number;
  file: File;
}

export const uploadContract = async (params: UploadContractParams) => {
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('category_id', String(params.categoryId));
  formData.append('file', params.file);

  const res = await customAxios.post('/contracts/uploads', formData);
  return res.data;
};

export const requestOCR = async (contractId: number) => {
  const res = await customAxios.get(`/ocr/${contractId}`);
  return res.data;
};
