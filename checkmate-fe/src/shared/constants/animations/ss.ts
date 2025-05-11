import type { Variants } from 'framer-motion';

/** 캐러셀용 슬라이드 애니메이션 공통 정의 */
export const slideVariants: Variants = {
  /* 새 슬라이드가 들어올 때 */
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400, // 오른쪽→왼쪽 / 왼쪽→오른쪽
    opacity: 0.8,
    zIndex: 0,
  }),
  /* 화면 중앙에 머무를 때 */
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  /* 기존 슬라이드가 나갈 때 */
  exit: (direction: number) => ({
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    zIndex: 0,
  }),
};
