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

export const getOverallLevel = (r: AnalysisResult) => {
  const scores = [
    /* 누락 조항 importance → 1 · 2 · 3 */
    ...r.missingClauses.map((c) => map[c.importance as keyof typeof map]),
    /* 위험 조항 riskLevel → 1 · 2 · 3 */
    ...r.riskClauses.map((c) => map[c.riskLevel as keyof typeof map]),
  ];

  /* 조항이 전혀 없으면 기본값 1(안심) */
  if (scores.length === 0) return 1 as 1 | 2 | 3;

  const avg = scores.reduce((a, b) => a + b, 0) / scores.length; // 평균
  return Math.round(avg) as 1 | 2 | 3; // 1.4→1, 1.5→2 …
};

export const korRiskLabel: Record<'HIGH' | 'MEDIUM' | 'LOW', string> = {
  HIGH: '위험해요!',
  MEDIUM: '주의해요!',
  LOW: '안심해요!',
};
