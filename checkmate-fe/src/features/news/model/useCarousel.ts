import { useState, useCallback } from 'react';
import { chunk4, NewsItem } from '@features/news';

export const useCarousel = (items: NewsItem[]) => {
  // 1) 슬라이드 배열
  const slides = chunk4(items);

  // 2) 상태 선언
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // 3) 이전으로
  const movePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, slides.length]);

  // 4) 다음으로
  const moveNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setIndex((i) => (i === slides.length - 1 ? 0 : i + 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, slides.length]);

  // 5) 특정 페이지로 점프
  const jumpTo = useCallback(
    (i: number) => {
      if (isAnimating || i === index) return;
      setDirection(i > index ? 1 : -1);
      setIndex(i);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating, index],
  );

  return { slides, index, direction, isAnimating, movePrev, moveNext, jumpTo };
};
