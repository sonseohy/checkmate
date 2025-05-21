import { customAxios } from '@/shared/api';

export const CategoryApi = {
  // 중분류(서브카테고리) 가져오기
  getSubCategories: (mainCategoryId: number) =>
    customAxios.get(`/api/categories/${mainCategoryId}/subcategories`),

  // 대분류(카테고리) 가져오기
  getCategories: () => customAxios.get('/api/categories'),
};
