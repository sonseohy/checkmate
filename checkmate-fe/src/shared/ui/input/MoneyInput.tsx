interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

/**
 * 숫자를 1000단위로 콤마(,) 찍기
 * 예: "750000" → "750,000"
 */
const formatMoney = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * MoneyInput 컴포넌트
 * - 숫자만 입력 가능
 * - 자동 쉼표 삽입
 * - inputMode="numeric"으로 모바일 숫자 키패드 유도
 */
const MoneyInput: React.FC<MoneyInputProps> = ({ value, onChange, onBlur }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyDigits = raw.replace(/\D/g, '');
    onChange(onlyDigits); // onChange에 콤마 없는 값 전달
  };

  const handleBlur = () => {
    onBlur?.(); // 필요 시 추가 로직 삽입 가능
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9,]*"
        maxLength={15}
        value={formatMoney(value)} // UI에만 포맷
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full p-2 pr-8 rounded-md border bg-white border-gray-400 text-right"
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-md text-gray-500 pointer-events-none">원</span>
    </div>
  );
};

export default MoneyInput;