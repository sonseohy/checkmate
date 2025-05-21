import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavProps {
  onPrev: () => void;
  onNext: () => void;
}

const CarouselNav: React.FC<NavProps> = ({ onPrev, onNext }) => (
  <>
    {/* mobile에서는 -left-4로 1 rem만큼 바깥으로, sm↑에서는 다시 0 */}
    <button
      onClick={onPrev}
      className="absolute -left-4 sm:left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-white"
      aria-label="이전 슬라이드"
    >
      <ChevronLeft size={20} />
    </button>

    {/* 오른쪽도 동일하게 처리 */}
    <button
      onClick={onNext}
      className="absolute -right-4 sm:right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full hover:bg-white"
      aria-label="다음 슬라이드"
    >
      <ChevronRight size={20} />
    </button>
  </>
);

export default CarouselNav;
