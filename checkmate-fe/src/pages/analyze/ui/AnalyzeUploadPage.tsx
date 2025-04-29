import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadContract, requestOCR } from '@/features/analyze/services';
import { mockCategories } from '@/shared/constants/mockCategories'; // ✅ 추가 import

const AnalyzeUploadPage: React.FC = () => {
  const { mainCategoryId, subCategoryId } = useParams<{
    mainCategoryId: string;
    subCategoryId: string;
  }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  // ✅ mainCategoryId로 대분류 이름 찾기
  const mainCategoryName =
    mockCategories.find((cat) => cat.id === mainCategoryId)?.name ?? '계약서'; // 없으면 기본값

  const onNext = async () => {
    if (!file) return alert('파일을 선택해주세요.');

    try {
      const uploadRes = await uploadContract({
        title: mainCategoryName, // ✅ 대분류 이름으로 업로드
        categoryId: 12, // TODO: categoryId 매칭
        file,
      });

      const contractId = uploadRes.contractId;

      const ocrRes = await requestOCR(contractId);

      navigate(`../${subCategoryId}/review`, {
        state: { ocrLines: ocrRes.lines },
      });
    } catch (error) {
      console.error(error);
      alert('업로드에 실패했습니다.');
    }
  };

  if (!mainCategoryId || !subCategoryId) {
    return <div className="py-16 text-center">잘못된 접근입니다.</div>;
  }

  return (
    <section className="container px-4 py-16 mx-auto text-center">
      <h1 className="mb-8 text-3xl font-bold">
        {/* ✅ 대분류 이름 표시 */}
        {`${mainCategoryName} 파일을 업로드 해주세요`}
      </h1>

      <div className="max-w-md mx-auto">
        <div className="p-8 mb-4 border-2 border-dashed rounded-lg">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
          />
          {file && <p className="mt-2 text-sm">선택된 파일: {file.name}</p>}
        </div>

        <button
          onClick={onNext}
          className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </section>
  );
};

export default AnalyzeUploadPage;
