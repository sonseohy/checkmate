
// 데스크탑 전용 애니메이션 벡터들 
export const desktopCardVariants = {
    initial:  { opacity: 0, scale: 0.5, x: 0,    rotate: 0 },
    animate: (i: number) => ({
      opacity: 1,
      scale:   1,
      x:       i === 0 ? -240 : i === 1 ? 0 : 240,
      rotate:  i === 0 ? -6   : i === 1 ? 0 : 6,
      transition: { duration: 0.8, delay: i * 0.3 },
    }),
  }
  
  // 모바일 전용 애니메이션 벡터 
  export const mobileCardVariants = {
    initial:  { opacity: 0, scale: 0.5 },
    animate:  (i: number) => ({
      opacity: 1,
      scale:   1,
      transition: { duration: 0.8, delay: i * 0.2 },
    }),
  }
  