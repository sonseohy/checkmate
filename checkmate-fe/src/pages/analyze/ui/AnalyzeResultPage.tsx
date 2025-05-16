import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AnalysisService,
  AnalysisResult,
  AnalysisDashboard,
} from '@/features/analyze';

// 스켈레톤 UI
const SkeletonBox = () => (
  <div className="p-6 space-y-4 bg-white rounded-lg shadow animate-pulse">
    <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
    <div className="space-y-2">
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
      <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

//스켈레톤 여러 개 묶은 대시보드 형태
const DashboardSkeleton = () => (
  <div className="grid gap-8 md:grid-cols-2">
    <SkeletonBox />
    <SkeletonBox />
    <SkeletonBox />
    <SkeletonBox />
  </div>
);

//분석 결과 페이지 컴포넌트
const AnalyzeResultPage: React.FC = () => {
  const { contractId } = useParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contractId) return;

    AnalysisService.getResult(contractId)
      .then((res) => {
        const safeResult: AnalysisResult = {
          contractId: res.contractId ?? '',
          summary: res.summary ?? '',
          riskFactors: res.riskFactors ?? [],
          suggestions: res.suggestions ?? [],
          score: res.score ?? 0,
        };
        setResult(safeResult);
      })
      .catch((err) => {
        console.error('분석 결과 불러오기 실패:', err);
      })
      .finally(() => setLoading(false));
  }, [contractId]);

  return (
    <section className="container px-4 py-16 mx-auto space-y-12">
      <h1 className="text-3xl font-bold">근로계약서 분석결과</h1>

      {loading && <DashboardSkeleton />}
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
