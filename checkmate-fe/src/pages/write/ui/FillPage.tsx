import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { MidCategory, SubCategory } from '@/features/categories';
import { useChecklist, ChecklistModal } from '@/features/write';

const FillPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const numericCategoryId = Number(categoryId);

  const { state } = useLocation() as {
    state?: {
      selectedMid?: MidCategory;
      selectedSub?: SubCategory;
      isNew?: boolean; 
    };
  };

  const subName = state?.selectedSub?.name ?? '계약서';
  const midCategoryId = state?.selectedMid?.id;

  const { data: checklist = [], isLoading } = useChecklist(midCategoryId);

  // 새로 작성하는 경우에만 모달 자동 표시
  const [showModal, setShowModal] = useState(state?.isNew ?? true);

  return (
    <div className="container py-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{subName} 작성 페이지</h1>

      {/* 체크리스트 모달: 새로 작성 시 자동 표시 */}
      {showModal && (
        <ChecklistModal
          checklist={checklist}
          onClose={() => setShowModal(false)}
        />
      )}

      <p className="text-gray-600">
        여기서 계약서 내용을 입력하고, 저장/내보내기 기능을 넣습니다.
        (categoryId: {numericCategoryId})
      </p>
    </div>
  );
};

export default FillPage;