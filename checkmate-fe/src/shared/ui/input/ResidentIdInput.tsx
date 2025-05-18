import { useRef } from 'react';

interface ResidentIdInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  placeholderFront?: string;
  placeholderBack?: string;
}

const ResidentIdInput: React.FC<ResidentIdInputProps> = ({
  value,
  onChange,
  onComplete,
  placeholderFront = '앞 6자리',
  placeholderBack = '1',
}) => {
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const onlyDigits = (input: string) => input.replace(/\D/g, '');

  const front = value.slice(0, 6);
  const back1 = value.slice(6, 7);

  const handleChange = (part: 'front' | 'back1', raw: string) => {
    const val = onlyDigits(raw);
    let newFront = front;
    let newBack1 = back1;

    if (part === 'front') {
      newFront = val.slice(0, 6);
      if (newFront.length === 6) {
        backRef.current?.focus();
      }
    } else {
      newBack1 = val.slice(0, 1);
    }

    const combined = newFront + newBack1;
    onChange(combined);

    if (combined.length === 7 && onComplete) {
      onComplete(combined);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        ref={frontRef}
        inputMode="numeric"
        pattern="\d{6}"
        maxLength={6}
        className="w-[100px] p-2 rounded-md border bg-white border-gray-400 text-center"
        placeholder={placeholderFront}
        value={front}
        onChange={(e) => handleChange('front', e.target.value)}
      />
      <span>-</span>
      <input
        type="text"
        ref={backRef}
        inputMode="numeric"
        pattern="\d{1}"
        maxLength={1}
        className="w-[30px] p-2 rounded-md border bg-white border-gray-400 text-center"
        placeholder={placeholderBack}
        value={back1}
        onChange={(e) => handleChange('back1', e.target.value)}
      />
      <span className="ml-1 text-gray-500 tracking-widest">●●●●●●</span>
    </div>
  );
};

export default ResidentIdInput;
