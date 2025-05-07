import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CategorySelector } from '@/widgets/common';
import { MidCategory, SubCategory } from '@/features/categories/model/types';
import { categorySlugMap } from '@/shared/constants/categorySlugMap';
import { navigateInvalidAccess } from '@/shared/utils/navigation';

const AnalyzeCategoryPage: React.FC = () => {
  const { mainCategorySlug } = useParams<{ mainCategorySlug: string }>();
  const navigate = useNavigate();

  const [selectedMid, setSelectedMid] = useState<MidCategory | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);

  const mainCategoryId =
    categorySlugMap[mainCategorySlug as keyof typeof categorySlugMap];

  // ✅ 유효하지 않은 slug일 경우 에러 페이지로 이동
  useEffect(() => {
    if (!mainCategoryId) {
      navigateInvalidAccess(navigate);
    }
  }, [mainCategoryId, navigate]);

  // ✅ 메인 카테고리가 아직 없으면 아무것도 렌더링하지 않음 (redirect 중)
  if (!mainCategoryId) return null;

  return (
    <CategorySelector
      mode="analyze"
      mainCategoryId={mainCategoryId}
      selectedMid={selectedMid}
      selectedSub={selectedSub}
      onSelectMid={setSelectedMid}
      onSelectSub={setSelectedSub}
    />
  );
};

export default AnalyzeCategoryPage;
