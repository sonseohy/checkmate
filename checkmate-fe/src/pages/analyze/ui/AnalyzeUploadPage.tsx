import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { uploadContract, UploadForm } from '@/features/analyze';
import { SubCategory } from '@/features/categories';
import {
  categoryIdToNameMap,
  categorySlugMap,
} from '@/shared/constants/categorySlugMap';
import { navigateInvalidAccess } from '@/shared/utils/navigation';
import Swal from 'sweetalert2';
import { Spinner } from '@/shared/ui/Spinner';
import { useUserInfo } from '@/features/auth';
import { KakaoLoginModal } from '@/features/main';
import uploadImage from '@/assets/images/loading/upload.png';

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
  const [isLoading, setIsLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const user = useUserInfo();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!mainCategorySlug || !selectedSub || !categoryId) {
      navigateInvalidAccess(navigate);
    }
  }, [mainCategorySlug, selectedSub, categoryId, navigate]);

  if (!mainCategorySlug || !selectedSub || !categoryId) return null;

  const onNext = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'info',
        title: '로그인이 필요합니다',
        text: '계속하려면 로그인 해주세요.',
        confirmButtonText: '확인',
      }).then(() => {
        setLoginModalOpen(true);
      });
      return;
    }

    if (files.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '업로드 오류',
        text: '파일을 선택해주세요.',
        confirmButtonText: '확인',
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await uploadContract({
        title: mainCategoryName,
        categoryId,
        files,
      });

      const contractId = response?.data?.contract_id;
      if (!contractId) {
        throw new Error('분석 결과로 이동할 contract_id가 없습니다.');
      }

      await Swal.fire({
        icon: 'success',
        title: '업로드가 성공했습니다',
        text: '분석에는 최대 1~2분이 걸립니다. 분석 완료 시 알려드릴게요!',
        confirmButtonText: '확인',
      });

      navigate('/');
    } catch (error) {
      // console.error(error);
      Swal.fire({
        icon: 'error',
        title: '업로드 실패',
        text: '업로드에 실패했습니다. 다시 시도해주세요.',
        confirmButtonText: '확인',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ 업로드 로딩 오버레이 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50">
          <img
            src={uploadImage}
            alt="업로드 로딩"
            className="w-24 h-24 mx-auto mb-4"
          />
          <p className="text-white text-lg font-semibold mb-1 flex items-center justify-center">
            업로드 파일을 검사하고 있어요
            <span className="dot dot1">.</span>
            <span className="dot dot2">.</span>
            <span className="dot dot3">.</span>
          </p>
        </div>
      )}

      {/* ✅ 로그인 모달 */}
      {loginModalOpen && (
        <KakaoLoginModal onClose={() => setLoginModalOpen(false)} />
      )}

      {/* ✅ 업로드 UI */}
      <section className="container px-2 py-12 mx-auto text-center">
        <h1 className="mb-6 text-2xl font-bold">
          {mainCategoryName} 파일을 업로드 해주세요
        </h1>

        <div className="max-w-md mx-auto">
          <UploadForm files={files} setFiles={setFiles} />

          <button
            onClick={onNext}
            disabled={isLoading}
            className="w-full px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {isLoading ? <Spinner /> : '다음'}
          </button>
        </div>
      </section>
    </>
  );
};

export default AnalyzeUploadPage;
