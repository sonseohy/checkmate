import { useState, useRef, useEffect } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { LuX } from 'react-icons/lu';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const AddressInput: React.FC<AddressInputProps> = ({ value, onChange, onBlur }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleComplete = (data: any) => {
    const fullAddress = data.address;
    onChange(fullAddress);
    setOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={value}
        onClick={() => setOpen(true)}
        onChange={() => {}}
        onBlur={onBlur}
        placeholder="주소를 검색하세요"
        readOnly
        className="w-full p-2 rounded-md border bg-white border-gray-400 cursor-pointer"
      />
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md shadow-lg border border-gray-300 bg-white">
          <div className="flex justify-end p-2">
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black">
              <LuX className="w-5 h-5" />
            </button>
          </div>
          <DaumPostcodeEmbed onComplete={handleComplete} autoClose={false} />
        </div>
      )}
    </div>
  );
};

export default AddressInput;