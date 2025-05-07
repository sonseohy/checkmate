import { customAxios } from '@/shared/api';

// 업로드 api
export const postContractUpload = (formData: FormData) =>
  customAxios.post('api/contract/uploads', formData);
