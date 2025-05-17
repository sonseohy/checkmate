import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AnalysisService,
  AnalysisDashboard,
  AnalysisResult,
} from '@/features/analyze';
import Spinner from '@/shared/ui/Spinner';
import uploadImage from '@/assets/images/loading/upload.png';

const AnalyzeResultPage: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = [
    '분석에는 최대 1~2분이 걸릴 수 있어요.',
    '분석이 완료되면 알려드릴게요!',
  ];

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!contractId) return;
    setLoading(true);

    AnalysisService.getResult(contractId)
      .then((analysisResult) => {
        setResult(analysisResult);
      })
      .catch((err) => {
        console.error('분석 결과 불러오기 실패:', err);
      })
      .finally(() => setLoading(false));
  }, [contractId]);

  return (
    <section className="container px-4 py-16 mx-auto space-y-12">
      <h1 className="text-3xl font-bold text-center">근로계약서 분석결과</h1>

      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
          <img
            src={uploadImage}
            alt="분석 로딩"
            className="w-24 h-24 animate-pulse"
          />
          <Spinner />
          <p className="text-lg font-medium text-gray-700 text-center">
            {loadingMessages[currentMessageIndex]}
          </p>
        </div>
      )}

      {!loading && result && <AnalysisDashboard result={result} />}

      {!loading && !result && (
        <p className="text-center text-gray-500">
          분석 결과를 불러오지 못했습니다.
        </p>
      )}
    </section>
  );
};

export default AnalyzeResultPage;
