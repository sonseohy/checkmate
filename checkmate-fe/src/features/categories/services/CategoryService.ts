import { CategoryApi } from '@/features/categories/api/CategoriesApi';

export const CategoryService = {
  // 대분류 카테고리 조회
  async getMajorCategories() {
    const response = await CategoryApi.getCategories();
    return response.data;
  },

  // 중분류 및 소분류 조회
  async getSubCategories(parentId: number) {
    const response = await CategoryApi.getSubCategories(parentId);
    return response.data;
  },
};
