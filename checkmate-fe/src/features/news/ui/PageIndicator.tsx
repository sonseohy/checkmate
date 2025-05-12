interface IndicatorProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  isAnimating: boolean;
}

const PageIndicator: React.FC<IndicatorProps> = ({
  count,
  activeIndex,
  onSelect,
  isAnimating,
}) => (
  <div className="flex justify-center mt-3 space-x-2 sm:mt-4">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onSelect(i)}
        disabled={isAnimating || i === activeIndex}
        className={`w-2 h-2 rounded-full transition-colors ${
          i === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
        }`}
        aria-label={`${i + 1}번 슬라이드로 이동`}
      />
    ))}
  </div>
);

export default PageIndicator;
