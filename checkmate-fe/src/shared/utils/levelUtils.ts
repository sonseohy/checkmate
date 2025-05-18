import safeImg from '@/assets/images/level/safe.png';
import cautionImg from '@/assets/images/level/caution.png';
import dangerImg from '@/assets/images/level/danger.png';
import { AnalysisResult } from '@/features/analyze';

export const levelLabel = { 1: '안심', 2: '주의', 3: '위험' } as const;
export const levelColor = {
  1: 'bg-green-500',
  2: 'bg-yellow-400',
  3: 'bg-red-600',
} as const;
export const levelImage = { 1: safeImg, 2: cautionImg, 3: dangerImg } as const;

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
