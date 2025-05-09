import { useQuery } from '@tanstack/react-query';
import { customAxios } from '@/shared/api';
import { ChecklistItem } from '@/features/write';

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