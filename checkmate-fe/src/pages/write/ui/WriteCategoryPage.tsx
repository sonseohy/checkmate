import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CategorySelector from '@/widgets/common/CategorySelector';
import { MidCategory, SubCategory } from '@/features/categories';
import { categorySlugMap } from '@/shared/constants/categorySlugMap';
import { navigateInvalidAccess } from '@/shared/utils/navigation';

const WriteCategoryPage: React.FC = () => {
  const { mainCategorySlug } = useParams<{ mainCategorySlug: string }>();
  const navigate = useNavigate();

  const [selectedMid, setSelectedMid] = useState<MidCategory | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);

  const mainCategoryId =
    categorySlugMap[mainCategorySlug as keyof typeof categorySlugMap];

  /* 🔽 slug 가 바뀌면 단계 선택값을 리셋 */
  useEffect(() => {
    setSelectedMid(null);
    setSelectedSub(null);
  }, [mainCategoryId]);

  useEffect(() => {
    if (!mainCategoryId) {
      navigateInvalidAccess(navigate);
    }
  }, [mainCategoryId, navigate]);

  if (!mainCategoryId) return null;

  return (
    <CategorySelector
      mode="write"
      mainCategoryId={mainCategoryId}
      selectedMid={selectedMid}
      selectedSub={selectedSub}
      onSelectMid={setSelectedMid}
      onSelectSub={setSelectedSub}
    />
  );
};

export default WriteCategoryPage;
