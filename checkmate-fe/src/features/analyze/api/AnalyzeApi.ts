import { customAxios } from '@/shared/api';

// 업로드 api
export const postContractUpload = (formData: FormData) => {
  return customAxios.post('/api/contract/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
