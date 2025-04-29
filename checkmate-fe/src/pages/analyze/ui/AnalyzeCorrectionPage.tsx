import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

interface OCRLine {
  id: number;
  text: string;
}

const AnalyzeCorrectionPage: React.FC = () => {
  const { subtype } = useParams<{ subtype: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { ocrLines } = location.state as { ocrLines: OCRLine[] };

  const [lines, setLines] = useState<OCRLine[]>(ocrLines || []);

  const onNext = () => navigate(`../${subtype}/result`);

  return (
    <section className="min-h-screen p-8 bg-gray-100">
      <div className="container p-6 mx-auto bg-white rounded-lg">
        <h1 className="mb-4 text-3xl font-bold">
          업로드된 계약서를 확인해주세요
        </h1>
        <p className="mb-6 text-gray-600">잘못된 내용이 있다면 수정해주세요</p>
        <div className="space-y-2">
          {lines.map((line) => (
            <textarea
              key={line.id}
              value={line.text}
              onChange={(e) => {
                const newLines = lines.map((l) =>
                  l.id === line.id ? { ...l, text: e.target.value } : l,
                );
                setLines(newLines);
              }}
              className="w-full px-2 py-1 border rounded"
              rows={1}
            />
          ))}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onNext}
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            분석하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default AnalyzeCorrectionPage;
