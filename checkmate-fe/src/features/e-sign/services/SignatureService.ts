import {
  SignatureRequestPayload,
  sendSignatureRequest,
} from '@/features/e-sign';

export const SignatureService = {
  request: (contractId: number, data: SignatureRequestPayload) =>
    sendSignatureRequest(contractId, data),
};
