import type { GenerateFileResponse } from '@/features/write';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customAxios } from '@/shared/api';

export const useGenerateContractFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: { contractId: number; pdfBlob: Blob; fileName?: string },
    ): Promise<GenerateFileResponse> => {
      const { contractId, pdfBlob, fileName } = params;

      const form = new FormData();
      form.append('file', pdfBlob, fileName ?? 'contract.pdf');
      if (fileName) form.append('fileName', fileName);

      const { data } = await customAxios.post(
        `/api/contract/${contractId}/generate-file`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data.data;
    },
    onSuccess: () => {
      /* 필요하다면 캐시 무효화 */
      queryClient.invalidateQueries();
    },
  });
};