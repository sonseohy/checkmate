import { customAxios } from '@/shared/api';
import { SignatureRequestPayload } from '@/features/e-sign';

export const sendSignatureRequest = async (data: SignatureRequestPayload) => {
  const response = await customAxios.post('/api/signature/request', data);
  return response.data;
};
