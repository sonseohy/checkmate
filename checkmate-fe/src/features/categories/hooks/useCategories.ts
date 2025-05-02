import { useQuery } from '@tanstack/react-query';
import {
  fetchMainCategories,
  fetchSubcategories,
} from '../services/CategoryService';
import { CategoryItem } from '../model/types';

// 대분류 카테고리 조회
// 리액트 쿼리로 자동 캐싱 + 로딩 + 에러처리
export const useMainCategories = () => {
  return useQuery({
    queryKey: ['mainCategories'],
    queryFn: fetchMainCategories,
  });
};

// 중분류 카테고리 조회 (대분류 카테고리가 선택되었을때만 작동하는 훅)
export const useMidCategories = (mainId?: number) => {
  return useQuery<CategoryItem[]>({
    queryKey: ['midCategories', mainId],
    queryFn: async () => {
      const res = await fetchSubcategories(mainId!);
      return res.map((item) => ({
        id: item.category_id,
        name: item.name,
      }));
    },
    enabled: !!mainId,
  });
};
// 소분류 카테고리 조회 (중분류 카테고리가 선택되었을때만 작동하는 훅)
export const useSubCategories = (midId?: number) => {
  return useQuery<CategoryItem[]>({
    queryKey: ['subCategories', midId],
    queryFn: async () => {
      const res = await fetchSubcategories(midId!);
      return res.map((item) => ({
        id: item.category_id,
        name: item.name,
      }));
    },
    enabled: !!midId,
  });
};
