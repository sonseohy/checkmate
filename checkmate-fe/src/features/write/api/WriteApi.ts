import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customAxios } from '@/shared/api';
import { ChecklistItem, SaveContractInputsRequest, SaveContractInputsResponse, CreateContractRequest, CreateContractResponse } from '@/features/write';

// Checklist 조회 API
export const useChecklist = (categoryId?: number) => {
    return useQuery<ChecklistItem[]>({
      queryKey: ['checklist', categoryId],
      queryFn: async () => {
        const { data } = await customAxios.get(`/api/check-list/${categoryId}`);
        return data.data;
      },
      enabled: !!categoryId,
    });
  };

// 계약서 생성 및 조회 API
export const useCreateContractTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId, userId }: CreateContractRequest): Promise<CreateContractResponse> => {
      const response = await customAxios.post(`/api/templates/${categoryId}/create-contract`, {
        userId,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// 계약서 작성 값 저장 API
export const saveContractInputs = async ({
  contractId,
  inputs,
}: SaveContractInputsRequest): Promise<SaveContractInputsResponse[]> => {
  const response = await customAxios.post(`/api/contract/${contractId}/inputs`, { sections: inputs });
  return response.data.data;
};

// 작성중인 계약서 조회
export const fetchExistingContract = async (contractId: number) => {
  const { data } = await customAxios.get(`/api/contract/${contractId}/edit`);
  return data.data;
};