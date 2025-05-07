import { postContractUpload } from '@/features/analyze/api/AnalyzeApi';
import {
  UploadResponse,
  UploadContractParams,
} from '@/features/analyze/model/types';

export const uploadContract = async ({
  title,
  categoryId,
  file,
}: UploadContractParams): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('categoryId', categoryId.toString());
  formData.append('files', file);

  const response = await postContractUpload(formData);
  return response.data;
};
