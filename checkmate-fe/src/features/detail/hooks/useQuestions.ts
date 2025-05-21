// features/detail/hooks/useQuestions.ts
import { useQuery } from '@tanstack/react-query';
import { getContractQuestions } from '@/features/detail/api/detailApi';

export const useQuestions = (contractId: number) =>
  useQuery({
    queryKey: ['questions', contractId],
    queryFn: () => getContractQuestions(contractId),
    enabled: !!contractId, // id 있을 때만 실행
    retry: false,
  });
