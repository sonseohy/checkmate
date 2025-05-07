// 데스크탑 전용 애니메이션 벡터들
export const desktopCardVariants = {
  initial: { opacity: 0, scale: 0.5, x: 0, rotate: 0 },
  animate: (i: number) => {
    const transforms = [
      { x: -360, rotate: -10 },
      { x: -120, rotate: -3 },
      { x: 120, rotate: 3 },
      { x: 360, rotate: 10 },
    ];
    const { x, rotate } = transforms[i] ?? { x: 0, rotate: 0 };

    return {
      opacity: 1,
      scale: 1,
      x,
      rotate,
      transition: { duration: 0.8, delay: i * 0.2 },
    };
  },
};

// 모바일 전용 애니메이션 벡터
export const mobileCardVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.2 },
  }),
};
