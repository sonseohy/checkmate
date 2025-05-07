import { CategoryApi, Category } from '@/features/categories';

export const CategoryService = {
  // 대분류 조회
  async getMajorCategories(): Promise<Category[]> {
    const res = await CategoryApi.getCategories();
    return res.data.data;
  },
  // 중,소분류 조회
  async getSubCategories(parentId: number): Promise<Category[]> {
    const res = await CategoryApi.getSubCategories(parentId);
    return res.data.data;
  },
};
