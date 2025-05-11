import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useNews, type NewsItem } from '@/features/news';
import NewsModal from '@/features/news/ui/NewsModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ------------------------------------------------------------------
   유틸 – 4개씩 자르기
------------------------------------------------------------------- */
const chunk4 = (items: NewsItem[]) => {
  const out: NewsItem[][] = [];
  for (let i = 0; i < items.length; i += 4) out.push(items.slice(i, i + 4));
  return out;
};

/* ------------------------------------------------------------------
   스켈레톤 카드 컴포넌트
------------------------------------------------------------------- */
const SkeletonCard = () => (
  <div className="flex flex-col w-full h-40 p-3 my-2 bg-white rounded-lg shadow animate-pulse sm:h-auto sm:p-4">
    <div className="w-3/4 h-5 mb-2 bg-gray-300 rounded" />
    <div className="w-1/2 h-5 mb-3 bg-gray-300 rounded" />
    <div className="flex-1 space-y-1.5">
      <div className="w-full h-3.5 bg-gray-200 rounded" />
      <div className="w-5/6 h-3.5 bg-gray-200 rounded" />
      <div className="w-2/3 h-3.5 bg-gray-200 rounded" />
    </div>
    <div className="w-20 h-3.5 mt-3 bg-gray-200 rounded" />
  </div>
);

/* ------------------------------------------------------------------
   메인 섹션 컴포넌트
------------------------------------------------------------------- */
const Section6 = () => {
  /* 1) 데이터 로딩 -------------------------------------------------- */
  const { data: items = [], isLoading, error } = useNews('계약서');
  const slides = useMemo(() => chunk4(items), [items]);

  /* 2) 상태 -------------------------------------------------------- */
  const [index, setIndex] = useState(0); // 현재 슬라이드
  const [selected, setSelected] = useState<NewsItem | null>(null); // 모달 표시 기사
  const [direction, setDirection] = useState(0); // -1(prev), 1(next)
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 중 플래그

  /* 3) 내비게이션 핸들러 ------------------------------------------ */
  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [slides.length, isAnimating]);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [slides.length, isAnimating]);

  /* 4) 애니메이션 Variants ----------------------------------------- */
  const slideVariants: Variants = {
    enter: (d: number) => ({ x: d > 0 ? 400 : -400, opacity: 0.8, zIndex: 0 }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (d: number) => ({ x: d < 0 ? 400 : -400, opacity: 0, zIndex: 0 }),
  };

  /* 5) 스와이프 기준값 ------------------------------------------- */
  const swipeConfidence = 50; // 이동거리(px)
  const swipeVelocity = 300; // 속도(px/s)

  /* ----------------------------------------------------------------
     JSX
  ----------------------------------------------------------------- */
  return (
    <section
      id="related-news"
      className="flex flex-col items-center justify-start w-full h-auto min-h-screen px-4 py-4 text-center bg-white snap-start sm:justify-center sm:h-screen sm:py-0"
    >
      <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">관련 뉴스</h2>

      {error && <p className="text-red-500">{String(error)}</p>}

      <div className="relative w-full max-w-6xl mb-6">
        {/* ---------------- 로딩 중 ---------------- */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-4 lg:px-14">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          /* --------------- 데이터 표시 -------------- */
          slides.length > 0 && (
            <>
              {/* 좌우 화살표 */}
              <button
                onClick={prev}
                className="absolute left-0 z-10 p-2 -translate-y-1/2 rounded-full hover:bg-white top-1/2"
                aria-label="이전 슬라이드"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-0 z-10 p-2 -translate-y-1/2 rounded-full hover:bg-white top-1/2"
                aria-label="다음 슬라이드"
              >
                <ChevronRight size={20} />
              </button>

              {/* 캐러셀 */}
              <div className="relative overflow-hidden">
                <AnimatePresence
                  initial={false}
                  custom={direction}
                  mode="popLayout"
                >
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.3,
                      },
                      opacity: { duration: 0.15 },
                    }}
                    className="relative grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-4 lg:px-14"
                    /* 스와이프 */
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const { offset, velocity } = info;
                      const swipe =
                        Math.abs(offset.x) > swipeConfidence ||
                        Math.abs(velocity.x) > swipeVelocity;
                      if (!swipe) return;
                      offset.x < 0 ? next() : prev();
                    }}
                  >
                    {slides[index].map((article) => (
                      <button
                        key={article.link}
                        onClick={() => setSelected(article)}
                        className="flex flex-col w-full h-40 p-3 my-2 text-left transition-shadow bg-white rounded-lg shadow hover:shadow-md sm:h-auto sm:p-4"
                      >
                        <h3
                          className="mb-2 text-sm font-medium text-gray-800 line-clamp-2 sm:font-semibold sm:text-base"
                          dangerouslySetInnerHTML={{ __html: article.title }}
                        />
                        <p
                          className="flex-1 text-xs text-gray-600 line-clamp-3 sm:text-sm sm:line-clamp-4"
                          dangerouslySetInnerHTML={{
                            __html: article.description,
                          }}
                        />
                        <p className="mt-2 text-[11px] text-gray-400 sm:mt-3 sm:text-xs">
                          {new Date(article.pubDate).toLocaleDateString(
                            'ko-KR',
                          )}
                        </p>
                      </button>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 페이지 인디케이터 */}
              {slides.length > 1 && (
                <div className="flex justify-center mt-3 space-x-2 sm:mt-4">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (isAnimating) return;
                        setIsAnimating(true);
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                        setTimeout(() => setIsAnimating(false), 400);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === index ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      aria-label={`${i + 1}번 슬라이드로 이동`}
                    />
                  ))}
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* 기사 전문 모달 */}
      <NewsModal article={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default Section6;
