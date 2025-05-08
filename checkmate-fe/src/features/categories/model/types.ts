export interface Category {
  category_id: number;
  parent_id: number | null;
  name: string;
  level: 'MAJOR' | 'MIDDLE' | 'MINOR';
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  error: string | null;
}

export interface CategoryItem {
  id: number;
  name: string;
}

export type MidCategory = CategoryItem;
export type SubCategory = CategoryItem;
