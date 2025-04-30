export interface Category {
  category_id: number;
  parent_id: number | null;
  name: string;
  level: 'MAJOR' | 'MINOR';
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  error: string | null;
}
