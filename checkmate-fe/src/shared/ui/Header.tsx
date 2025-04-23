import React, { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

export const Header = () => {
  const [writeOpen, setWriteOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);

  return (
    <header className="flex items-center justify-between w-full h-16 px-6 bg-white shadow">
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <img src="/icons/favicon-96x96.png" alt="logo" className="w-6 h-6" />
      </div>

      {/* Right - 메뉴 및 로그인 */}
      <div className="flex items-center gap-8 text-sm font-semibold text-black">
        {/* 계약서 쓰기 */}
        <div className="relative">
          <button
            onClick={() => setWriteOpen(prev => !prev)}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 쓰기 <ChevronDown size={16} />
          </button>
          {writeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">부동산매매 계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">근로계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">임대차 계약서</li>
            </ul>
          )}
        </div>

        {/* 계약서 분석 */}
        <div className="relative">
          <button
            onClick={() => setAnalyzeOpen(prev => !prev)}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 분석 <ChevronDown size={16} />
          </button>
          {analyzeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">부동산매매 계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">근로계약서</li>
              <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">임대차 계약서</li>
            </ul>
          )}
        </div>

        {/* 로그인/회원가입 */}
        <div className="text-sm font-normal text-gray-700 cursor-pointer hover:text-black">
          회원가입 / 로그인
        </div>
      </div>
    </header>
  );
};
