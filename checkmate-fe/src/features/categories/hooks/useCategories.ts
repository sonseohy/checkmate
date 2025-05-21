// CategoryService 호출해서 CategoryItem(types) 형태로 가공해서 컴포넌트에 쉽게 사용하도록 함
//리액트쿼리가 로딩, 에러, 캐시 자동처리해줌

import { useQuery } from '@tanstack/react-query';
import { CategoryService, Category, CategoryItem } from '@/features/categories';

// 대분류 카테고리 조회
export const useMainCategories = () => {
  return useQuery({
    queryKey: ['mainCategories'],
    queryFn: async (): Promise<CategoryItem[]> => {
      const res: Category[] = await CategoryService.getMajorCategories();
      return res.map((item: Category) => ({
        id: item.category_id,
        name: item.name,
      }));
    },
  });
};

// 중분류 카테고리 조회
export const useMidCategories = (mainId?: number) => {
  return useQuery<CategoryItem[]>({
    queryKey: ['midCategories', mainId],
    queryFn: async () => {
      const res: Category[] = await CategoryService.getSubCategories(mainId!);
      return res.map((item: Category) => ({
        id: item.category_id,
        name: item.name,
      }));
    },
    enabled: !!mainId,
  });
};

// 소분류 카테고리 조회
export const useSubCategories = (midId?: number) => {
  return useQuery<CategoryItem[]>({
    queryKey: ['subCategories', midId],
    queryFn: async () => {
      const res: Category[] = await CategoryService.getSubCategories(midId!);
      return res.map((item: Category) => ({
        id: item.category_id,
        name: item.name,
      }));
    },
    enabled: !!midId,
  });
};
