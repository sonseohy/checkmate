import safeJson from '@/assets/images/lottie/safe.json';
import cautionJson from '@/assets/images/lottie/caution.json';
import dangerJson from '@/assets/images/lottie/danger.json';
import { AnalysisResult } from '@/features/analyze';

export const levelLabel = { 1: '안심', 2: '주의', 3: '위험' } as const;
export const levelColor = {
  1: 'text-green-500',
  2: 'text-yellow-400',
  3: 'text-red-600',
} as const;
export const levelLottie = {
  1: safeJson,
  2: cautionJson,
  3: dangerJson,
} as const;

const map = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;

export const getOverallLevel = (r: AnalysisResult) =>
  Math.max(
    r.missingClauses.reduce(
      (m, v) => Math.max(m, map[v.importance as keyof typeof map]),
      1,
    ),
    r.riskClauses.reduce(
      (m, v) => Math.max(m, map[v.riskLevel as keyof typeof map]),
      1,
    ),
  ) as 1 | 2 | 3;
