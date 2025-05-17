import { useState, ReactNode } from 'react';
import { ModalContent } from '@/shared/ui/ModalContent';

interface Props {
  raw: string;
  lineClamp?: number;
  children?: ReactNode; // 파싱한 JSX (옵션)
}

export const ExpandableText: React.FC<Props> = ({
  raw,
  lineClamp = 5,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const isLong = raw.split('\n').length > lineClamp;
  const preview = raw.split('\n').slice(0, lineClamp).join('\n');

  return (
    <>
      {/* ── 프리뷰 영역 ─────────────────────── */}
      {children ? (
        <div
          className="line-clamp-[var(--clamp)]"
          style={{ ['--clamp' as any]: lineClamp }}
        >
          {children}
        </div>
      ) : (
        <pre className="whitespace-pre-wrap leading-relaxed">{preview}</pre>
      )}

      {/* ── “더보기” 버튼 ─────────────────── */}
      {isLong && (
        <button
          className="mt-2 text-sm text-blue-600 hover:underline"
          onClick={() => setOpen(true)}
        >
          …더보기
        </button>
      )}

      {/* ── 모달 ─────────────────────────── */}
      <ModalContent isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="mb-4 text-lg font-semibold">전체 내용</h2>
        <div className="max-h-[70vh] overflow-y-auto pr-4">
          {children ? (
            children // 파싱된 JSX
          ) : (
            <pre className="whitespace-pre-wrap leading-relaxed">{raw}</pre>
          )}
        </div>
      </ModalContent>
    </>
  );
};
