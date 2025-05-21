/* 모바일 / 데스크톱 공용 스켈레톤 */
import { useMobile } from '@/shared';

export default function CourtLocatorSkeleton() {
  const isMobile = useMobile();

  /* map 영역 + 리스트 카드 3~4개를 회색 pulse 로 표현 */
  if (isMobile) {
    return (
      <div className="w-full flex flex-col gap-3">
        {/* 지도 자리 */}
        <div className="h-72 rounded-2xl bg-gray-200 animate-pulse" />
        {/* 카드 3개 자리 */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  /* 데스크톱 */
  return (
    <div className="flex w-full">
      {/* 지도 자리 */}
      <div className="w-[600px] h-[600px] rounded-2xl bg-gray-200 animate-pulse m-8" />
      {/* 리스트 카드 */}
      <div className="flex flex-col gap-4 w-[450px] m-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
