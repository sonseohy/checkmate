/* widgets/common/CarouselNav.tsx */
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  onPrev(): void;
  onNext(): void;
}

const CarouselNav = ({ onPrev, onNext }: Props) => (
  <>
    {/* 이전 버튼 */}
    <button
      onClick={onPrev}
      className="absolute left-0 z-10 p-2 -translate-y-1/2 rounded-full hover:bg-white top-1/2"
      aria-label="이전 슬라이드"
    >
      <ChevronLeft size={20} />
    </button>

    {/* 다음 버튼 */}
    <button
      onClick={onNext}
      className="absolute right-0 z-10 p-2 -translate-y-1/2 rounded-full hover:bg-white top-1/2"
      aria-label="다음 슬라이드"
    >
      <ChevronRight size={20} />
    </button>
  </>
);

export default CarouselNav;
