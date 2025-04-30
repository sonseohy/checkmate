import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  uploadContract,
  requestOCR,
} from '@/features/analyze/services/UploadService';
import { mockCategories } from '@/shared/constants/mockCategories';
import { Upload } from 'lucide-react'; // ✅ Upload 아이콘 사용

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/x-hwp',
];
const MAX_FILES = 20;

const AnalyzeUploadPage: React.FC = () => {
  const { mainCategoryId, subCategoryId } = useParams<{
    mainCategoryId: string;
    subCategoryId: string;
  }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  if (!mainCategoryId || !subCategoryId) {
    return <div className="py-16 text-center">잘못된 접근입니다.</div>;
  }

  const mainCategoryName =
    mockCategories.find((cat) => cat.id === mainCategoryId)?.name ?? '계약서';

  const realCategoryId = mockCategories
    .flatMap((cat) => cat.midcategories)
    .flatMap((mid) => mid.subcategories)
    .find((sub) => sub.id === subCategoryId)?.categoryId;

  const onNext = async () => {
    if (files.length === 0) return alert('파일을 선택해주세요.');
    if (!realCategoryId) return alert('유효한 카테고리를 찾을 수 없습니다.');

    try {
      for (const file of files) {
        const uploadRes = await uploadContract({
          title: mainCategoryName,
          categoryId: realCategoryId,
          file,
        });
        const contractId = uploadRes.contractId;
        await requestOCR(contractId);
      }

      navigate(`../${subCategoryId}/review`, { state: { ocrLines: [] } });
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
        {`${mainCategoryName} 파일을 업로드 해주세요`}
      </h1>

      <div className="max-w-md mx-auto">
        {/* 업로드 박스 */}
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

          {/* 선택된 파일 목록 */}
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

        {/* 다음 버튼 */}
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
