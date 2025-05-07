import React from 'react';
import { Upload } from 'lucide-react';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/x-hwp',
];
const MAX_FILES = 20;

interface UploadFormProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const UploadForm: React.FC<UploadFormProps> = ({ files, setFiles }) => {
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
  );
};

export default UploadForm;
