import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { uploadContract } from '@/features/analyze/services/UploadService';
import UploadForm from '@/features/analyze/components/UploadForm';
import { SubCategory } from '@/features/categories/model/types';
import {
  categoryIdToNameMap,
  categorySlugMap,
} from '@/shared/constants/categorySlugMap';
import { navigateInvalidAccess } from '@/shared/utils/navigation';

const AnalyzeUploadPage: React.FC = () => {
  const { mainCategorySlug } = useParams<{ mainCategorySlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const selectedSub = location.state?.selectedSub as SubCategory | undefined;
  const categoryId = selectedSub?.id;
  const mainCategoryId =
    categorySlugMap[mainCategorySlug as keyof typeof categorySlugMap];
  const mainCategoryName = categoryIdToNameMap[mainCategoryId];

  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!mainCategorySlug || !selectedSub || !categoryId) {
      navigateInvalidAccess(navigate);
    }
  }, [mainCategorySlug, selectedSub, categoryId, navigate]);

  if (!mainCategorySlug || !selectedSub || !categoryId) return null;

  const onNext = async () => {
    if (files.length === 0) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
      for (const file of files) {
        await uploadContract({
          title: mainCategoryName,
          categoryId,
          file,
        });
      }

      navigate(`/analyze/${mainCategorySlug}/review`);
    } catch (error) {
      console.error(error);
      alert('업로드에 실패했습니다.');
    }
  };

  return (
    <section className="container px-2 py-12 mx-auto text-center">
      <h1 className="mb-6 text-2xl font-bold">
        {mainCategoryName} 파일을 업로드 해주세요
      </h1>

      <div className="max-w-md mx-auto">
        <UploadForm files={files} setFiles={setFiles} />

        <button
          onClick={onNext}
          className="w-full px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </section>
  );
};

export default AnalyzeUploadPage;
