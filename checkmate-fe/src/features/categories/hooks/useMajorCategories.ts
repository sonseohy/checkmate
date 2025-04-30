// src/features/categories/services/index.ts
import { CategoriesResponse } from '../model/types';
import { customAxios } from '@/shared/api/client/customAxios';

export const CategoriesService = {
  getMajorCategories: async (): Promise<CategoriesResponse> => {
    const res = await customAxios.get<CategoriesResponse>('/categories/major');
    return res.data;
  },
};
