import { customAxios } from '@/shared/api/client/customAxios';

export const AnalyzeApi = {
  // 중분류(서브카테고리) 가져오기
  getSubCategories: (mainCategoryId: string) =>
    customAxios.get(`/api/categories/${mainCategoryId}/subcategories`),

  // (필요하면) 대분류(카테고리) 가져오기
  getCategories: () => customAxios.get('/api/categories'),
};
