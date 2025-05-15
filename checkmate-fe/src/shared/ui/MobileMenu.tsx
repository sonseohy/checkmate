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
  categoryNames: string[];
  isLogIn: boolean;
  isLogOut: () => void;
  showGuide: () => void;
}

const MobileMenu = ({
  writeOpen,
  analyzeOpen,
  toggleWrite,
  toggleAnalyze,
  handleWriteClick,
  handleAnalyzeClick,
  closeMobile,
  showModal,
  categoryNames,
  isLogIn,
  isLogOut,
  showGuide,
}: MobileMenuProps) => (
  <div className="absolute left-0 z-40 w-full bg-white shadow-md top-full md:hidden">
    <div className="flex flex-col p-4 space-y-2">
      {/* 계약서 작성 가이드 */}
      <button
        onClick={showGuide}
        className="flex justify-between w-full py-2 text-left hover:text-black"
      >
        계약서 작성 가이드
      </button>

      {/* 작성 메뉴 */}
      <div>
        <button
          onClick={toggleWrite}
          className="flex justify-between w-full py-2 text-left hover:text-black"
        >
          계약서 작성
          <ChevronDown
            size={16}
            className={writeOpen ? 'rotate-180 transition-transform' : ''}
          />
        </button>
        {writeOpen && (
          <ul className="pl-4">
            {categoryNames.map((name) => (
              <li key={name}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWriteClick(name);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 hover:text-black"
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
          className="flex justify-between w-full py-2 text-left hover:text-black"
        >
          계약서 분석
          <ChevronDown
            size={16}
            className={analyzeOpen ? 'rotate-180 transition-transform' : ''}
          />
        </button>
        {analyzeOpen && (
          <ul className="pl-4">
            {categoryNames.map((name) => (
              <li key={name}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnalyzeClick(name);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 hover:text-black"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 로그인 상태에 따라 버튼 변경 */}
      {isLogIn ? (
        <div className="flex flex-col justify-center items-center gap-3">
          <button
            onClick={() => {
              closeMobile();
              window.location.href = '/mypage'; // 마이페이지로 리다이렉트
            }}
            className="pt-4 w-full text-left text-gray-700 border-t border-gray-300 cursor-pointer hover:text-black"
          >
            마이페이지
          </button>
          <button
            onClick={isLogOut}
            className=" w-full pt-4 text-left text-gray-700 cursor-pointer hover:text-black"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            showModal();
            closeMobile();
          }}
          className="pt-4 text-left text-gray-700 border-t border-gray-300 cursor-pointer hover:text-black"
        >
          회원가입 / 로그인
        </button>
      )}
    </div>
  </div>
);

export default MobileMenu;
