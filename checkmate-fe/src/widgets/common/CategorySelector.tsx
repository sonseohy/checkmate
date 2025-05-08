import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useMidCategories,
  useSubCategories,
  MidCategory,
  SubCategory,
} from '@/features/categories';
import {
  categoryIdToNameMap,
  categoryIdToSlugMap,
} from '@/shared';

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
  const userSelectedSub = useRef(false);

  const { data: midCategories } = useMidCategories(mainCategoryId);
  const { data: subCategories } = useSubCategories(selectedMid?.id);

  const categoryName = categoryIdToNameMap[mainCategoryId] || '카테고리';
  const slug = categoryIdToSlugMap[mainCategoryId];

  /* 🔍 소분류 검색 상태 */
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubCategorySelect = (sub: SubCategory) => {
    userSelectedSub.current = true;
    onSelectSub(sub);
  };

  /* 소분류 선택 후 다음 페이지로 */
  useEffect(() => {
    if (selectedSub && userSelectedSub.current) {
      const path =
        mode === 'write' ? `/write/${slug}/${selectedSub.id}` : `/analyze/${slug}/upload`;

      navigate(path, { state: { selectedMid, selectedSub } });
      userSelectedSub.current = false;
    }
  }, [selectedSub, navigate, mode, slug, selectedMid]);

  /* ---------------- 중분류 화면 ---------------- */
  if (!selectedMid) {
    return (
      <section className="container py-16 mx-auto">
        <h1 className="mb-8 text-3xl font-bold leading-relaxed text-center">
          어떤 {categoryName} 카테고리를 <br className="sm:hidden" />
          {mode === 'write' ? '작성' : '분석'}하시겠습니까?
        </h1>

        <ul className="grid max-w-3xl grid-cols-1 gap-6 px-6 mx-auto sm:px-8 sm:grid-cols-2 md:grid-cols-3">
          {midCategories?.map((mid) => (
            <li key={mid.id}>
              <button
                onClick={() => onSelectMid(mid)}
                className="flex items-center justify-center w-full h-24 px-4 font-semibold text-center text-gray-800 bg-gray-100 break-keep rounded-3xl hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 line-clamp-2"
              >
                {mid.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  /* ---------------- 소분류 화면 ---------------- */
  const filteredSubs = subCategories?.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="container py-16 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">
        어떤 {selectedMid.name}을 <br className="sm:hidden" />
        {mode === 'write' ? '작성' : '분석'} 하시겠습니까?
      </h1>

      {/* 🔍 검색 입력창 */}
      <div className="max-w-xs mx-auto mb-8">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="소분류 검색..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <ul className="grid max-w-3xl grid-cols-1 gap-6 px-6 mx-auto sm:px-8 sm:grid-cols-2 md:grid-cols-3">
        {filteredSubs?.map((sub) => (
          <li key={sub.id}>
            <button
              onClick={() => handleSubCategorySelect(sub)}
              className="flex items-center justify-center w-full h-24 px-4 font-semibold text-center text-gray-800 bg-gray-100 break-keep rounded-3xl hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 line-clamp-2"
            >
              {sub.name}
            </button>
          </li>
        ))}

        {filteredSubs && filteredSubs.length === 0 && (
          <li className="mt-4 text-center text-gray-500 col-span-full">
            검색 결과가 없습니다
          </li>
        )}
      </ul>
    </section>
  );
};

export default CategorySelector;
