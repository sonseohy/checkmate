import {
  UploadResponse,
  UploadContractParams,
  postContractUpload,
} from '@/features/analyze';

export const uploadContract = async ({
  title,
  categoryId,
  files,
}: UploadContractParams): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('categoryId', categoryId.toString());
  files.forEach((file) => formData.append('files', file)); // ← 'files'가 서버 기대명

  const response = await postContractUpload(formData);
  return response.data;
};
