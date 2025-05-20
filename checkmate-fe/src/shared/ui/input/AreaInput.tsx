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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyDigits = raw.replace(/\D/g, '');
    onChange(onlyDigits);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={10}
        value={value}
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