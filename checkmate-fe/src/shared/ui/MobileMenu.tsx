// shared/ui/header/MobileMenu.tsx
import { ChevronDown } from 'lucide-react';

interface MobileMenuProps {
  writeOpen: boolean;
  analyzeOpen: boolean;
  toggleWrite: () => void;
  toggleAnalyze: () => void;
  handleWriteClick: (name: string) => void;
  handleAnalyzeClick: (name: string) => void;
  closeMobile: () => void;
  showModal: () => void;
}

const items = ['계약서', '내용증명', '지급명령'];

const MobileMenu = ({
  writeOpen,
  analyzeOpen,
  toggleWrite,
  toggleAnalyze,
  handleWriteClick,
  handleAnalyzeClick,
  closeMobile,
  showModal,
}: MobileMenuProps) => (
  <div className="absolute left-0 z-40 w-full bg-white border-b shadow-md top-full md:hidden">
    <div className="flex flex-col p-4 space-y-2">
      {/* 작성 메뉴 */}
      <div>
        <button
          onClick={toggleWrite}
          className="flex justify-between w-full py-2 text-left hover:text-blue-600"
        >
          계약서 작성
          <ChevronDown
            size={16}
            className={writeOpen ? 'rotate-180 transition-transform' : ''}
          />
        </button>
        {writeOpen && (
          <ul className="pl-4">
            {items.map((name) => (
              <li key={name}>
                <button
                  onClick={() => handleWriteClick(name)}
                  className="block py-1 text-left hover:bg-gray-100"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 분석 메뉴 */}
      <div>
        <button
          onClick={toggleAnalyze}
          className="flex justify-between w-full py-2 text-left hover:text-blue-600"
        >
          계약서 분석
          <ChevronDown
            size={16}
            className={analyzeOpen ? 'rotate-180 transition-transform' : ''}
          />
        </button>
        {analyzeOpen && (
          <ul className="pl-4">
            {items.map((name) => (
              <li key={name}>
                <button
                  onClick={() => handleAnalyzeClick(name)}
                  className="block py-1 text-left hover:bg-gray-100"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 회원가입 / 로그인 */}
      <button
        onClick={() => {
          showModal(); // ✅ 모달 열기
          closeMobile(); // ✅ 모바일 메뉴 닫기
        }}
        className="pt-4 text-center text-gray-700 border-t cursor-pointer hover:text-black"
      >
        회원가입 / 로그인
      </button>
    </div>
  </div>
);

export default MobileMenu;
