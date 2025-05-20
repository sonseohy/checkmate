import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  useNews,
  NewsItem,
  useCarousel,
  SkeletonCard,
  SlideCard,
  PageIndicator,
  NewsModal,
  CarouselNav,
} from '@/features/news';

const slideVariants: Variants = {
  enter: (d: number) => ({ x: d > 0 ? 400 : -400, opacity: 0.8, zIndex: 0 }),
  center: { x: 0, opacity: 1, zIndex: 1 },
  exit: (d: number) => ({ x: d < 0 ? 400 : -400, opacity: 0, zIndex: 0 }),
};

const NewsCarousel: React.FC = () => {
  const { data: items = [], isLoading, error } = useNews('계약서');
  const { slides, index, direction, isAnimating, movePrev, moveNext, jumpTo } =
    useCarousel(items);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-4 lg:px-14">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  if (error) return <p className="text-red-500">{String(error)}</p>;

  return (
    <>
      <div className="relative w-full max-w-6xl mb-6">
        <CarouselNav onPrev={movePrev} onNext={moveNext} />

        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
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
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const swipe =
                  Math.abs(info.offset.x) > 50 ||
                  Math.abs(info.velocity.x) > 300;
                if (!swipe) return;
                info.offset.x < 0 ? moveNext() : movePrev();
              }}
            >
              {slides[index].map((article) => (
                <SlideCard
                  key={article.link}
                  article={article}
                  onClick={() => setSelected(article)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {slides.length > 1 && (
          <PageIndicator
            count={slides.length}
            activeIndex={index}
            onSelect={jumpTo}
            isAnimating={isAnimating}
          />
        )}
      </div>

      <NewsModal article={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default NewsCarousel;
