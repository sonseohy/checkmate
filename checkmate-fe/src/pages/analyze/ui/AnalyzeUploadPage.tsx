import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import {
  uploadContract,
  requestOCR,
} from '@/features/analyze/services/UploadService';
import { SubCategory } from '@/features/categories/model/types';
import {
  categoryIdToNameMap,
  categorySlugMap,
} from '@/shared/constants/categorySlugMap';
import { navigateInvalidAccess } from '@/shared/utils/navigation';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/x-hwp',
];
const MAX_FILES = 20;

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

  // 잘못된 접근 시 에러 페이지로 이동
  useEffect(() => {
    if (!mainCategorySlug || !selectedSub || !categoryId) {
      navigateInvalidAccess(navigate);
    }
  }, [mainCategorySlug, selectedSub, categoryId, navigate]);

  // 유효성 검사 중이면 렌더링하지 않음
  if (!mainCategorySlug || !selectedSub || !categoryId) return null;

  const onNext = async () => {
    if (files.length === 0) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
      for (const file of files) {
        const uploadRes = await uploadContract({
          title: mainCategoryName,
          categoryId,
          file,
        });
        const contractId = uploadRes.contractId;
        await requestOCR(contractId);
      }

      navigate(`/analyze/${mainCategorySlug}/review`, {
        state: { ocrLines: [] },
      });
    } catch (error) {
      console.error(error);
      alert('업로드에 실패했습니다.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const filteredFiles = selectedFiles.filter((file) =>
      ALLOWED_TYPES.includes(file.type),
    );

    if (filteredFiles.length !== selectedFiles.length) {
      alert('jpg, png, pdf, hwp 파일만 업로드 가능합니다.');
    }

    if (files.length + filteredFiles.length > MAX_FILES) {
      alert('최대 20개 파일까지만 업로드할 수 있습니다.');
      return;
    }

    setFiles((prev) => [...prev, ...filteredFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="container px-2 py-12 mx-auto text-center">
      <h1 className="mb-6 text-2xl font-bold">
        {mainCategoryName} 파일을 업로드 해주세요
      </h1>

      <div className="max-w-md mx-auto">
        <div className="p-6 mb-6 border-2 border-dashed rounded-lg">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-40 cursor-pointer hover:opacity-80"
          >
            <Upload size={48} />
            <span className="mt-2 text-gray-600">파일 선택 (최대 20개)</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".jpg,.png,.pdf,.hwp"
            className="hidden"
            onChange={handleFileChange}
          />

          {files.length > 0 && (
            <div className="mt-4 text-sm text-left">
              <p className="mb-2 font-semibold">{`선택된 파일 (${files.length}개)`}</p>
              <ul className="space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {file.name}
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-xs text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
