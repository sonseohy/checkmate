import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { categorySlugMap } from '@/shared/constants/categorySlugMap'; // ✅ 경로 확인

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate(); // ✅ useNavigate는 컴포넌트 안에 있어야 함
  const [writeOpen, setWriteOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 메뉴 클릭 핸들러
  const handleWriteClick = (categoryName: string) => {
    const slug = categorySlugMap[categoryName];
    if (slug) {
      navigate(`/write/${slug}`);
      setWriteOpen(false);
    }
  };

  const handleAnalyzeClick = (categoryName: string) => {
    const slug = categorySlugMap[categoryName];
    if (slug) {
      navigate(`/analyze/${slug}`);
      setAnalyzeOpen(false);
    }
  };

  // 모바일 메뉴 닫힐 때 서브메뉴도 닫기
  useEffect(() => {
    if (!mobileOpen) {
      setWriteOpen(false);
      setAnalyzeOpen(false);
    }
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between w-full h-16 px-6 bg-white shadow ${className}`}
    >
      {/* Logo 클릭 시 메인으로 이동 */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/icons/favicon-96x96.png" alt="logo" className="w-10 h-10" />
      </Link>

      {/* Desktop Menu */}
      <div className="items-center hidden gap-8 text-sm font-semibold text-black md:flex">
        {/* 계약서 쓰기 */}
        <div className="relative">
          <button
            onClick={() => {
              setWriteOpen((w) => !w);
              setAnalyzeOpen(false);
            }}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 쓰기
            <ChevronDown
              size={16}
              className={writeOpen ? 'rotate-180 transition-transform' : ''}
            />
          </button>
          {writeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              {['계약서', '내용증명', '지급명령'].map((name) => (
                <li key={name}>
                  <button
                    onClick={() => handleWriteClick(name)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 계약서 분석 */}
        <div className="relative">
          <button
            onClick={() => {
              setAnalyzeOpen((a) => !a);
              setWriteOpen(false);
            }}
            className="flex items-center gap-1 hover:text-blue-600"
          >
            계약서 분석
            <ChevronDown
              size={16}
              className={analyzeOpen ? 'rotate-180 transition-transform' : ''}
            />
          </button>
          {analyzeOpen && (
            <ul className="absolute left-0 z-10 w-40 mt-2 bg-white border rounded shadow-md top-full">
              {['계약서', '내용증명', '지급명령'].map((name) => (
                <li key={name}>
                  <button
                    onClick={() => handleAnalyzeClick(name)}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 회원가입 / 로그인 */}
        <Link
          to="/auth"
          className="text-sm font-normal text-gray-700 hover:text-black"
        >
          회원가입 / 로그인
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="p-2 md:hidden"
        onClick={() => setMobileOpen((m) => !m)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="absolute left-0 z-40 w-full bg-white border-b shadow-md top-full md:hidden">
          <div className="flex flex-col p-4 space-y-2">
            {/* 계약서 쓰기 모바일 */}
            <div className="relative">
              <button
                onClick={() => {
                  setWriteOpen((w) => !w);
                  setAnalyzeOpen(false);
                }}
                className="flex justify-between w-full py-2 text-left hover:text-blue-600"
              >
                계약서 쓰기
                <ChevronDown
                  size={16}
                  className={writeOpen ? 'rotate-180 transition-transform' : ''}
                />
              </button>
              {writeOpen && (
                <ul className="pl-4">
                  {['계약서', '내용증명', '지급명령'].map((name) => (
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

            {/* 계약서 분석 모바일 */}
            <div className="relative">
              <button
                onClick={() => {
                  setAnalyzeOpen((a) => !a);
                  setWriteOpen(false);
                }}
                className="flex justify-between w-full py-2 text-left hover:text-blue-600"
              >
                계약서 분석
                <ChevronDown
                  size={16}
                  className={
                    analyzeOpen ? 'rotate-180 transition-transform' : ''
                  }
                />
              </button>
              {analyzeOpen && (
                <ul className="pl-4">
                  {['계약서', '내용증명', '지급명령'].map((name) => (
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

            {/* 회원가입 / 로그인 모바일 */}
            <Link
              to="/auth"
              className="pt-4 text-center text-gray-700 border-t cursor-pointer hover:text-black"
              onClick={() => setMobileOpen(false)}
            >
              회원가입 / 로그인
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
