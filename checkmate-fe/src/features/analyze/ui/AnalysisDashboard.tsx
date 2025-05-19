/* src/features/analyze/ui/AnalysisDashboard.tsx */
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { AnalysisResult } from '@/features/analyze';
import { parseSummary } from '@/shared/utils/parseSummary';

/* 위험·중요도 한국어 라벨 & 색상 */
export const korRiskLabel: Record<'HIGH' | 'MEDIUM' | 'LOW', string> = {
  HIGH: '🚨위험해요!',
  MEDIUM: '⚠️주의해요!',
  LOW: '✅안심해요!',
};
const importanceColor = {
  HIGH: 'text-red-600',
  MEDIUM: 'text-yellow-500',
  LOW: 'text-green-600',
} as const;

/* ────────── Modal ────────── */
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) =>
  !open ? null : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90vw] max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );

/* ────────── Expandable ────────── */
const Expandable: React.FC<{
  preview: React.ReactNode;
  full: React.ReactNode;
  isLong: boolean;
}> = ({ preview, full, isLong }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {preview}
      {isLong && (
        <button
          className="mt-2 text-sm text-blue-600 hover:underline"
          onClick={() => setOpen(true)}
        >
          더보기
        </button>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        {full}
      </Modal>
    </>
  );
};

/* ────────── Dashboard ────────── */
interface Props {
  result: AnalysisResult;
  userName: string;
  contractTitle: string;
  cardVar?: Variants; // 부모가 넘겨주는 애니메이션 variants
}

const AnalysisDashboard: React.FC<Props> = ({ result, cardVar }) => {
  /* 요약 파싱 */
  const summarySecs = parseSummary(result.summaries[0]?.description ?? '');

  /* util – 리스트를 미리보기·전체보기 세트로 변환 */
  const makeListPreviewFull = <T,>(
    arr: T[],
    render: (v: T) => React.ReactNode,
    slice = 5,
  ) => ({
    preview: <ul className="space-y-1">{arr.slice(0, slice).map(render)}</ul>,
    full: <ul className="space-y-1">{arr.map(render)}</ul>,
    isLong: arr.length > slice,
  });

  /* ───── 누락된 조항 ───── */
  const missing = makeListPreviewFull(result.missingClauses, (m) => (
    <li key={m.missingClauseReportId} className="leading-relaxed">
      <span
        className={`${
          importanceColor[m.importance as keyof typeof importanceColor]
        } font-semibold mr-2`}
      >
        {korRiskLabel[m.importance as keyof typeof korRiskLabel]}
      </span>
      {m.description}
    </li>
  ));

  /* ───── 위험 요소 ───── */
  const risk = makeListPreviewFull(
    result.riskClauses,
    (r) => (
      <li key={r.riskClauseReportId} className="mb-4 last:mb-0 leading-relaxed">
        <span
          className={`${
            importanceColor[
              r.riskLevel as keyof typeof importanceColor // ← 캐스팅
            ]
          } font-semibold mr-2`}
        >
          {
            korRiskLabel[
              r.riskLevel as keyof typeof korRiskLabel // ← 캐스팅
            ]
          }
        </span>

        <span className="block">
          <strong>원문:</strong> {r.originalText}
        </span>
        <span className="block mt-1">{r.description}</span>
      </li>
    ),
    3,
  );

  /* ───── 개선 제안 ───── */
  const improve = makeListPreviewFull(result.improvements, (i) => (
    <li key={i.improvementReportId} className="mb-4 last:mb-0">
      {i.description}
    </li>
  ));

  /* ────────── UI ────────── */
  return (
    <>
      {/* 요약 카드 */}
      <motion.div
        variants={cardVar}
        layout
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">계약 요약</h2>
        {summarySecs.length ? (
          <Expandable
            preview={
              <div
                className="space-y-4 line-clamp-[var(--clamp)]"
                style={{ ['--clamp' as any]: 8 }}
              >
                {summarySecs.map((s) => (
                  <div key={s.title}>
                    <h3 className="font-semibold">{s.title}</h3>
                    <ul className="list-disc list-inside text-sm space-y-0.5">
                      {s.items.slice(0, 3).map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            }
            full={
              <div className="space-y-6">
                {summarySecs.map((s) => (
                  <div key={s.title}>
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {s.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            }
            isLong={true}
          />
        ) : (
          <p className="text-gray-400">요약 정보가 없습니다.</p>
        )}
      </motion.div>

      {/* 누락된 조항 카드 */}
      <motion.div
        variants={cardVar}
        layout
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">누락된 조항</h2>
        <Expandable {...missing} />
      </motion.div>

      {/* 위험 요소 카드 */}
      <motion.div
        variants={cardVar}
        layout
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">위험 요소</h2>
        <Expandable {...risk} />
      </motion.div>

      {/* 개선 제안 카드 */}
      <motion.div
        variants={cardVar}
        layout
        className="p-6 bg-white rounded-lg shadow"
      >
        <h2 className="mb-4 text-xl font-semibold">개선 제안</h2>
        <Expandable {...improve} />
      </motion.div>
    </>
  );
};

export default AnalysisDashboard;
