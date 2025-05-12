import { useQuery } from '@tanstack/react-query';
import { customAxios } from '@/shared/api';
import { ChecklistItem, TemplateResponse, SaveContractInputsRequest, SaveContractInputsResponse } from '@/features/write';

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

export const useTemplate = (templateId: number) => {
  return useQuery<TemplateResponse>({
    queryKey: ['template', templateId],
    queryFn: async () => {
      const res = await customAxios.get(`/api/templates/${templateId}`);
      return res.data.data;
    },
    enabled: !!templateId, // undefined일 경우 호출 방지
  });
};

export const saveContractInputs = async ({
  contractId,
  inputs,
}: SaveContractInputsRequest): Promise<SaveContractInputsResponse> => {
  const response = await customAxios.post(`/api/contract/${contractId}/inputs`, inputs);
  return response.data.data;
};