export interface UploadResponse {
  contractId: number;
  title: string;
  createdAt: string;
}

export interface UploadContractParams {
  title: string;
  categoryId: number;
  files: File[];
}
