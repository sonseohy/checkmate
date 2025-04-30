import { useState } from 'react';

// 파일 확장자명 제한
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/x-hwp',
];
// 최대 업로드 파일갯수 20개
const MAX_FILES = 20;

interface UploadFilesProps {
  onFilesChange: (files: File[]) => void;
}

export const UploadFiles: React.FC<UploadFilesProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    const filteredFiles = selectedFiles.filter((file) =>
      ALLOWED_TYPES.includes(file.type),
    );

    if (filteredFiles.length !== selectedFiles.length) {
      alert('jpg, png, pdf, hwp 파일만 업로드 가능합니다.');
    }

    if (filteredFiles.length + files.length > MAX_FILES) {
      alert('최대 20개 파일까지만 업로드할 수 있습니다.');
      return;
    }

    const updatedFiles = [...files, ...filteredFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="p-8 mb-4 border-2 border-dashed rounded-lg">
      <input
        type="file"
        multiple
        accept=".jpg,.png,.pdf,.hwp"
        onChange={handleFileChange}
      />
      {files.length > 0 && (
        <ul className="mt-4 text-left list-disc list-inside">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between">
              {file.name}
              <button
                className="ml-2 text-sm text-red-500 hover:underline"
                onClick={() => removeFile(index)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
