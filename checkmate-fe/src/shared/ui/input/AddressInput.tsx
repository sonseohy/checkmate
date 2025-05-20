// src/components/AddressInput.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DaumPostcodeEmbed from 'react-daum-postcode';
import { LuX } from 'react-icons/lu';

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const [open, setOpen] = useState(false);

  // 모달이 열려있는 동안 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleComplete = (data: any) => {
    onChange(data.address);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onClick={() => setOpen(true)}
        onBlur={onBlur}
        readOnly
        placeholder="주소를 검색하세요"
        className="w-full p-2 rounded-md border bg-white border-gray-300 cursor-pointer"
      />

      {open &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50"
            aria-modal="true"
          >
            <div className="relative w-full max-w-lg bg-white rounded-lg overflow-hidden shadow-lg">
              {/* ── 헤더 (닫기 버튼) ── */}
              <div className="flex justify-end p-2 border-b border-gray-200 bg-white z-10">
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {/* ── 주소 검색 영역 ── */}
              <div className="h-full overflow-y-auto">
                <DaumPostcodeEmbed
                  onComplete={handleComplete}
                  autoClose={false}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AddressInput;