import { Category } from '@/features/categories/model/types';

export const fetchMainCategories = async (): Promise<Category[]> => {
  // 대분류는 parent_id가 null
  return Promise.resolve([
    { category_id: 1, parent_id: null, name: '계약서', level: 'MAJOR' },
    { category_id: 2, parent_id: null, name: '내용증명', level: 'MAJOR' },
    { category_id: 3, parent_id: null, name: '지급명령', level: 'MAJOR' },
  ]);
};

// ⚠️ 실제 API 나오기 전까지 사용하는 mock 함수
export const fetchSubcategories = async (
  parentId: number,
): Promise<Category[]> => {
  // parentId에 따라 다른 중분류 or 소분류 목록 반환
  const mockData: Record<number, Category[]> = {
    1: [
      // 계약서 → 중분류
      { category_id: 11, parent_id: 1, name: '매매계약', level: 'MIDDLE' },
      { category_id: 12, parent_id: 1, name: '임대차계약', level: 'MIDDLE' },
    ],
    11: [
      // 매매계약 → 소분류
      { category_id: 111, parent_id: 11, name: '아파트 매매', level: 'MINOR' },
      { category_id: 112, parent_id: 11, name: '토지 매매', level: 'MINOR' },
    ],
    12: [
      // 임대차계약 → 소분류
      { category_id: 121, parent_id: 12, name: '주택 임대차', level: 'MINOR' },
      { category_id: 122, parent_id: 12, name: '상가 임대차', level: 'MINOR' },
    ],
  };

  return Promise.resolve(mockData[parentId] || []);
};
