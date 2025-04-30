import { useParams } from 'react-router-dom';
import { useState } from 'react';
import CategorySelector from '@/widgets/common/CategorySelector';
import { MidCategory, SubCategory } from '@/features/categories/model/types';
import { categorySlugMap } from '@/shared/constants/categorySlugMap';

const WriteCategoryPage: React.FC = () => {
  const { mainCategorySlug } = useParams<{ mainCategorySlug: string }>();
  const [selectedMid, setSelectedMid] = useState<MidCategory | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubCategory | null>(null);

  const mainCategoryId =
    categorySlugMap[mainCategorySlug as keyof typeof categorySlugMap];

  if (!mainCategoryId) {
    return <div className="py-16 text-center">잘못된 접근입니다.</div>;
  }

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
