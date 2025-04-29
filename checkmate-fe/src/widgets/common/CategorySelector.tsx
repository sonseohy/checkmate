import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CategoryApi } from '@/features/analyze/api/CategoriesApi';

interface SubCategory {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  mode: 'write' | 'analyze';
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ mode }) => {
  const { mainCategoryId } = useParams<{ mainCategoryId: string }>();

  const {
    data: subcategories,
    isLoading,
    error,
  } = useQuery<SubCategory[]>({
    queryKey: ['subcategories', mainCategoryId],
    queryFn: async () => {
      const res = await CategoryApi.getSubCategories(mainCategoryId!);
      return res.data;
    },
    enabled: !!mainCategoryId,
  });

  if (isLoading) return <div className="py-16 text-center">로딩 중...</div>;
  if (error || !subcategories)
    return <div className="py-16 text-center">에러가 발생했습니다.</div>;

  return (
    <div className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">
        어떤 {mainCategoryId}을{' '}
        {mode === 'write' ? '작성하시겠습니까?' : '분석하시겠습니까?'}
      </h1>

      <ul className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
        {subcategories.map((sub) => {
          const toPath =
            mode === 'write'
              ? `/${mode}/${mainCategoryId}/${sub.id}`
              : `/${mode}/${mainCategoryId}/${sub.id}/upload`;

          return (
            <li key={sub.id}>
              <Link
                to={toPath}
                className="block p-6 text-center bg-white border rounded-lg hover:shadow-md"
              >
                {sub.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategorySelector;
