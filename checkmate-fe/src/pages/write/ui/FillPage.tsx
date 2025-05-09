import { useParams, useLocation } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';

const FillPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const numericCategoryId = Number(categoryId);

  const { state } = useLocation() as {
    state?: {
      selectedMid?: MidCategory;
      selectedSub?: SubCategory;
    };
  };

  const subName = state?.selectedSub?.name ?? '계약서';

  return (
    <div className="container py-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{subName} 작성 페이지</h1>

      <p className="text-gray-600">
        여기서 계약서 내용을 입력하고, 저장/내보내기 기능을 넣습니다.
        (categoryId: {numericCategoryId})
      </p>
    </div>
  );
};

export default FillPage;