import { useEffect, useRef } from 'react';
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
  // 사용자가 직접 선택한 경우만 리다이렉트하기 위한 플래그
  const userSelectedSub = useRef(false);

  const { data: midCategories } = useMidCategories(mainCategoryId);
  const { data: subCategories } = useSubCategories(selectedMid?.id);
  const categoryName = categoryIdToNameMap[mainCategoryId] || '카테고리';
  const slug = categoryIdToSlugMap[mainCategoryId];

  // 사용자가 소분류를 선택했을 때만 리다이렉트하도록 수정
  const handleSubCategorySelect = (sub: SubCategory) => {
    userSelectedSub.current = true;
    onSelectSub(sub);
  };

  // 소분류 선택시 다음페이지(업로드 or 소개)로 이동
  useEffect(() => {
    if (selectedSub && userSelectedSub.current) {
      const path =
        mode === 'write' ? `/write/${slug}/intro` : `/analyze/${slug}/upload`;

      navigate(path, {
        state: {
          selectedMid,
          selectedSub,
        },
      });

      // 리다이렉트 후 플래그 초기화
      userSelectedSub.current = false;
    }
  }, [selectedSub, navigate, mode, slug, selectedMid]);

  // ✅ 중분류 선택 화면
  if (!selectedMid) {
    return (
      <section className="container py-16 mx-auto">
        <h1 className="mb-8 text-3xl font-bold leading-relaxed text-center">
          어떤 {categoryName} 카테고리를 <br className="sm:hidden" />
          {mode === 'write' ? '작성' : '분석'}하시겠습니까?
        </h1>
        <ul className="flex flex-wrap justify-center gap-6 px-4">
          {midCategories?.map((mid) => (
            <li key={mid.id}>
              <button
                onClick={() => onSelectMid(mid)}
                className="w-72 p-6 font-bold text-center text-white bg-[#3B82F6] border rounded-4xl hover:shadow-md"
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
        어떤 {selectedMid.name}을 <br className="sm:hidden" />
        {mode === 'write' ? '작성' : '분석'} 하시겠습니까?
      </h1>
      <ul className="flex flex-wrap justify-center gap-6 px-4">
        {subCategories?.map((sub) => (
          <li key={sub.id}>
            <button
              onClick={() => handleSubCategorySelect(sub)}
              className="w-72 p-6 font-bold text-center text-white bg-[#3B82F6] border rounded-4xl hover:shadow-md"
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
