import {
  UploadResponse,
  UploadContractParams,
  postContractUpload,
} from '@/features/analyze';

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
