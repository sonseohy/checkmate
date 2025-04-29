// 임시로 mock 데이터 리턴하는 서비스
import { mockMajorCategories } from './model/mockCategories';

export const CategoriesService = {
  async getMajorCategories() {
    // 실제로는 API 요청할 예정이지만, 지금은 mock 리턴
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockMajorCategories });
      }, 300); // 0.3초 지연
    });
  },
};
