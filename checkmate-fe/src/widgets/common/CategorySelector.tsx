import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMidCategories,
  useSubCategories,
} from '@/features/categories/hooks/useCategories';
import { MidCategory, SubCategory } from '@/features/categories/model/types';
import {
  categoryIdToNameMap,
  categoryIdToSlugMap,
} from '@/shared/constants/categorySlugMap';

interface Props {
  mode: 'write' | 'analyze';
  mainCategoryId: number;
  selectedMid: MidCategory | null;
  selectedSub: SubCategory | null;
  onSelectMid: (mid: MidCategory) => void;
  onSelectSub: (sub: SubCategory) => void;
}

const CategorySelector: React.FC<Props> = ({
  mode,
  mainCategoryId,
  selectedMid,
  selectedSub,
  onSelectMid,
  onSelectSub,
}) => {
  const navigate = useNavigate();

  const { data: midCategories } = useMidCategories(mainCategoryId);
  const { data: subCategories } = useSubCategories(selectedMid?.id);
  const categoryName = categoryIdToNameMap[mainCategoryId] || '카테고리';
  const slug = categoryIdToSlugMap[mainCategoryId];

  // 소분류 선택시 다음페이지(업로드 or 소개)로 이동
  useEffect(() => {
    if (selectedSub) {
      const path =
        mode === 'write' ? `/write/${slug}/intro` : `/analyze/${slug}/upload`;

      navigate(path, {
        state: {
          selectedMid,
          selectedSub,
        },
      });
    }
  }, [selectedSub]);

  // ✅ 중분류 선택 화면
  if (!selectedMid) {
    return (
      <section className="container py-16 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">
          어떤 {categoryName} 카테고리를 {mode === 'write' ? '작성' : '분석'}
          하시겠습니까?
        </h1>
        <ul className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
          {midCategories?.map((mid) => (
            <li key={mid.id}>
              <button
                onClick={() => onSelectMid(mid)}
                className="block w-full p-6 font-bold text-center text-white bg-blue-500 border rounded-lg hover:shadow-md"
              >
                {mid.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // ✅ 소분류 선택 화면
  return (
    <section className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">
        어떤 {selectedMid.name}을 {mode === 'write' ? '작성' : '분석'}
        하시겠습니까?
      </h1>
      <ul className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3">
        {subCategories?.map((sub) => (
          <li key={sub.id}>
            <button
              onClick={() => onSelectSub(sub)}
              className="block w-full p-6 font-bold text-center text-white bg-blue-500 border rounded-lg hover:shadow-md"
            >
              {sub.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategorySelector;
