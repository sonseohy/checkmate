import { Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/x-hwp', // 일부 브라우저
  'application/haansoft-hwp', // 일부 확장 프로그램
  'application/octet-stream', // 종종 빈 타입 대신 이 값
  '', // 타입을 아예 주지 않는 경우
] as const;

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'pdf', 'hwp'] as const;
const MAX_FILES = 20;

interface UploadFormProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const UploadForm: React.FC<UploadFormProps> = ({ files, setFiles }) => {
  /* ✅ 파일 허용 여부 판정 함수 */
  const isAllowed = (file: File) => {
    /* 1) MIME 먼저 검사 */
    if (ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
      /* octet-stream 이거나 빈 문자열일 땐 확장자도 체크 */
      if (file.type && file.type !== 'application/octet-stream') return true;
    }
    /* 2) 확장자 검사 (공백·대문자 대비) */
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ALLOWED_EXT.includes(ext as (typeof ALLOWED_EXT)[number]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const filteredFiles = selectedFiles.filter(isAllowed);

    /* ✦ 1) 허용되지 않는 형식 */
    if (filteredFiles.length !== selectedFiles.length) {
      Swal.fire({
        icon: 'warning',
        title: '업로드 오류',
        text: 'jpg, png, pdf, hwp 파일만 업로드할 수 있습니다.',
        confirmButtonText: '확인',
      });
    }

    /* ✦ 2) 개수 초과 */
    if (files.length + filteredFiles.length > MAX_FILES) {
      Swal.fire({
        icon: 'warning',
        title: '업로드 오류',
        text: '최대 20개 파일까지만 업로드할 수 있습니다.',
        confirmButtonText: '확인',
      });
      return;
    }

    setFiles((prev) => [...prev, ...filteredFiles]);
  };

  /* ───────── JSX 그대로 ───────── */
  return (
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
        accept=".jpg,.jpeg,.png,.pdf,.hwp,application/pdf,application/x-hwp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 선택된 파일 목록 UI … (생략, 기존 코드 유지) */}
      {files.length > 0 && (
        <div className="mt-4 text-sm text-left">
          <p className="mb-2 font-semibold">{`선택된 파일 (${files.length}개)`}</p>
          <ul className="space-y-1">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between">
                {file.name}
                <button
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, i) => i !== idx))
                  }
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
  );
};

export default UploadForm;
