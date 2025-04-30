import { customAxios } from '@/shared/api/client/customAxios';

// api/ContractApi.ts
export const postContractUpload = (formData: FormData) =>
  customAxios.post('/contracts/uploads', formData);

export const getOcrResult = (contractId: number) =>
  customAxios.get(`/ocr/${contractId}`);
