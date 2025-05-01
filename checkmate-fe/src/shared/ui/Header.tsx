// shared/ui/header/Header.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { categoryNameToSlugMap } from '@/shared/constants/categorySlugMap';
import MobileMenu from './MobileMenu';
import HeaderDropdown from './HeaderDropdown';

export const Header = () => {
  const navigate = useNavigate();
  const [writeOpen, setWriteOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleWriteClick = (name: string) => {
    const slug = categoryNameToSlugMap[name];
    if (slug) {
      navigate(`/write/${slug}`);
      setWriteOpen(false);
      setMobileOpen(false);
    }
  };

  const handleAnalyzeClick = (name: string) => {
    const slug = categoryNameToSlugMap[name];
    if (slug) {
      navigate(`/analyze/${slug}`);
      setAnalyzeOpen(false);
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    if (!mobileOpen) {
      setWriteOpen(false);
      setAnalyzeOpen(false);
    }
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-6 bg-white shadow">
      <Link to="/" className="flex items-center gap-2">
        <img src="/icons/favicon-96x96.png" alt="logo" className="w-10 h-10" />
      </Link>

      <div className="items-center hidden gap-8 text-sm font-semibold text-black md:flex">
        <HeaderDropdown
          open={writeOpen}
          title="계약서 작성"
          onToggle={() => {
            setWriteOpen((prev) => !prev);
            setAnalyzeOpen(false);
          }}
          onItemClick={handleWriteClick}
        />
        <HeaderDropdown
          open={analyzeOpen}
          title="계약서 분석"
          onToggle={() => {
            setAnalyzeOpen((prev) => !prev);
            setWriteOpen(false);
          }}
          onItemClick={handleAnalyzeClick}
        />
        <Link
          to="/auth"
          className="text-sm font-normal text-gray-700 hover:text-black"
        >
          회원가입 / 로그인
        </Link>
      </div>

      <button
        className="p-2 md:hidden"
        onClick={() => setMobileOpen((m) => !m)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <MobileMenu
          writeOpen={writeOpen}
          analyzeOpen={analyzeOpen}
          toggleWrite={() => {
            setWriteOpen((w) => !w);
            setAnalyzeOpen(false);
          }}
          toggleAnalyze={() => {
            setAnalyzeOpen((a) => !a);
            setWriteOpen(false);
          }}
          handleWriteClick={handleWriteClick}
          handleAnalyzeClick={handleAnalyzeClick}
          closeMobile={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
