import { motion } from 'framer-motion';

// 분석결과 타입
interface AnalysisResult {
  contractId: string;
  summary: string;
  riskFactors: string[];
  suggestions: string[];
  score: number;
}

interface Props {
  result: AnalysisResult;
}

const AnalysisDashboard = ({ result }: Props) => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">계약 요약</h2>
        <p className="whitespace-pre-line">{result.summary}</p>
      </motion.div>

      {/* 종합 점수 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-lg shadow flex flex-col justify-center items-center"
      >
        <h2 className="mb-2 text-xl font-semibold">계약서 종합 점수</h2>
        <div className="text-5xl font-bold text-green-600">
          {result.score}점
        </div>
      </motion.div>

      {/* 위험 요소 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">위험 요소</h2>
        <ul className="list-disc list-inside space-y-1">
          {result.riskFactors.map((risk, i) => (
            <li key={i}>{risk}</li>
          ))}
        </ul>
      </motion.div>

      {/* 개선 제안 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">개선 제안</h2>
        <ul className="list-disc list-inside space-y-1">
          {result.suggestions.map((sug, i) => (
            <li key={i}>{sug}</li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default AnalysisDashboard;
