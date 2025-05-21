interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 남기고
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
        maxLength={3}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className="w-full p-2 pr-12 rounded-md border bg-white border-gray-400 text-right"
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-md text-gray-500 pointer-events-none">
        시간
      </span>
    </div>
  );
};

export default TimeInput;