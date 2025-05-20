interface AreaInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

/**
 * 숫자만 입력받고, m² 단위 표시가 붙는 입력 필드
 */
const AreaInput: React.FC<AreaInputProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  // 화면에 보여줄 포맷된 값: 1500 -> "1,500"
  const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 중에는 콤마·비숫자 모두 제거하고 순수 숫자만 부모로 전달
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9,]*"
        maxLength={15}
        value={formattedValue}
        onChange={handleChange}
        onBlur={onBlur}
        className="w-full p-2 pr-10 rounded-md border bg-white border-gray-400 text-right"
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
        m²
      </span>
    </div>
  );
};

export default AreaInput;