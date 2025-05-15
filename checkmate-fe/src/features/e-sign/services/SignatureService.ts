import {
  SignatureRequestPayload,
  sendSignatureRequest,
} from '@/features/e-sign';

export const SignatureService = {
  request: (data: SignatureRequestPayload) => sendSignatureRequest(data),
};
