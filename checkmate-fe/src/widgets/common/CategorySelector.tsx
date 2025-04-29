import { useParams, Link } from 'react-router-dom';
import { mockCategories } from '@/shared/constants/mockCategories'; // 대분류 + 중분류 + 소분류 mock 데이터

interface CategorySelectorProps {
  mode: 'write' | 'analyze';
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ mode }) => {
  const { mainCategoryId, midCategoryId } = useParams<{
    mainCategoryId: string;
    midCategoryId?: string;
  }>();

  if (!mainCategoryId) {
    return <div className="py-16 text-center">잘못된 접근입니다.</div>;
  }

  // 대분류 찾기
  const mainCategory = mockCategories.find(
    (category) => category.id === mainCategoryId,
  );

  if (!mainCategory) {
    return (
      <div className="py-16 text-center">카테고리를 찾을 수 없습니다.</div>
    );
  }

  // 만약 midCategoryId가 없으면 중분류 선택 페이지
  if (!midCategoryId) {
    return (
      <section className="container py-16 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">
          어떤 {mainCategory.name}을 {mode === 'write' ? '작성' : '분석'}
          하시겠습니까?
        </h1>
        <ul className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
          {mainCategory.midcategories.map((mid) => (
            <li key={mid.id}>
              <Link
                to={`/${mode}/${mainCategoryId}/${mid.id}`}
                className="block p-6 text-center bg-white border rounded-lg hover:shadow-md"
              >
                {mid.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // midCategoryId가 있으면 소분류 선택 페이지
  const midCategory = mainCategory.midcategories.find(
    (mid) => mid.id === midCategoryId,
  );

  if (!midCategory) {
    return <div className="py-16 text-center">소분류를 찾을 수 없습니다.</div>;
  }

  return (
    <section className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">
        어떤 {midCategory.name}을 {mode === 'write' ? '작성' : '분석'}
        하시겠습니까?
      </h1>
      <ul className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
        {midCategory.subcategories.map((sub) => {
          const toPath =
            mode === 'write'
              ? `/write/${mainCategoryId}/${midCategory.id}/${sub.id}`
              : `/analyze/${mainCategoryId}/${midCategory.id}/${sub.id}/upload`;

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
    </section>
  );
};

export default CategorySelector;
