import { customAxios } from '@/shared/api';
import { SignatureRequestPayload } from '@/features/e-sign';

export const sendSignatureRequest = async (
  contractId: number,
  data: SignatureRequestPayload,
) => {
  const response = await customAxios.post(
    `/api/contract/${contractId}/sign`,
    data,
  );
  return response.data;
};
