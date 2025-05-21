/* src/pages/detail/ui/DetailPage.tsx */
import { useState, useRef } from 'react';
import { ContractPdfViewer, ContractDetail } from '@/features/detail';
import { useMobile } from '@/shared';
import { LuChevronDown } from 'react-icons/lu';

/* ──────────── 모바일 레이아웃 컴포넌트 ──────────── */
const MobileDetail: React.FC = () => {
  const [open, setOpen] = useState(false);

  /* 드로어 드래그용 refs */
  const panelRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const translateYRef = useRef(0);

  /* 드래그 시작 */
  const onStart = (e: React.TouchEvent | React.MouseEvent) => {
    startYRef.current =
      'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
  };

  // 드래그 중
  const onMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startYRef.current === null) return;
    const currentY =
      'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const delta = currentY - startYRef.current;
    if (delta > 0) {
      translateYRef.current = delta;
      if (panelRef.current) {
        panelRef.current.style.transform = `translateY(${delta}px)`;
      }
    }
  };

  // 드래그 끝
  const onEnd = () => {
    if (translateYRef.current > 100) {
      /* 100 px 이상 끌어내리면 닫기 */
      setOpen(false);
    } else if (panelRef.current) {
      panelRef.current.style.transition = 'transform 0.2s ease-out';
      panelRef.current.style.transform = 'translateY(0)';
      setTimeout(() => {
        if (panelRef.current) panelRef.current.style.transition = '';
      }, 200);
    }
    startYRef.current = null;
    translateYRef.current = 0;
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* PDF 뷰어 */}
      <div className="flex-1 bg-[#F3F4F6]">
        <ContractPdfViewer />
      </div>

      {/* ▸ 플로팅 “질문 보기” 버튼 (닫힌 상태에서만) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                     flex items-center gap-1 px-5 py-2 rounded-full shadow-lg
                     bg-blue-600 text-white text-sm font-medium"
        >
          질문 보기 <LuChevronDown size={18} />
        </button>
      )}

      {/* ▸ 드로어 */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col pointer-events-none">
          {/* 투명 오버레이 – 탭/클릭 시 닫기 */}
          <div
            className="flex-1 bg-transparent"
            onClick={() => setOpen(false)}
            style={{ pointerEvents: 'auto' }}
          />

          {/* 패널 */}
          <div
            ref={panelRef}
            className="bg-white max-h-[45vh] w-full rounded-t-2xl
                       shadow-lg overflow-y-auto no-scrollbar
                       animate-slide-up pointer-events-auto touch-none"
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
          >
            {/* 드래그 핸들 */}
            <div className="w-full flex justify-center py-3 cursor-grab">
              <span className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="px-4">
              <ContractDetail />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────── 데스크톱 레이아웃 컴포넌트 ──────────── */
const DesktopDetail: React.FC = () => (
  <div className="flex h-[calc(100vh-64px)]">
    {/* PDF 컬럼 */}
    <div className="flex-1 bg-[#F3F4F6] overflow-y-auto">
      <ContractPdfViewer />
    </div>
    {/* 질문 리스트 컬럼 */}
    <aside className="w-1/4 pl-4 flex flex-col overflow-hidden">
      <ContractDetail />
    </aside>
  </div>
);

/* ──────────── 메인 페이지 (모바일/데스크톱 스위치) ──────────── */
const DetailPage: React.FC = () => {
  return useMobile() ? <MobileDetail /> : <DesktopDetail />;
};

export default DetailPage;
