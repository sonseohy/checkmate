interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder = '010-0000-0000',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = input.replace(/\D/g, '').slice(0, 11); // 최대 11자리 제한
    onChange(digits);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={13}
      value={formatPhoneNumber(value)}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full p-2 rounded-md border bg-white border-gray-400"
    />
  );
};

export default PhoneNumberInput;