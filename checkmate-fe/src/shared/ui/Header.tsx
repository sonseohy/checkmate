// shared/ui/header/Header.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryNameToSlugMap } from '@/shared/constants/categorySlugMap';
import MobileMenu from './MobileMenu';
import HeaderDropdown from './HeaderDropdown';
import { KakaoLoginModal } from '@/features/main';
import { Menu, X } from 'lucide-react';
import { useMainCategories } from '@/features/categories/hooks/useCategories';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [writeOpen, setWriteOpen] = useState<boolean>(false);
  const [analyzeOpen, setAnalyzeOpen] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  // ✅ 대분류 카테고리 목록 가져오기
  const { data: mainCategories } = useMainCategories();
  const categoryNames = mainCategories?.map((cat) => cat.name) ?? [];

  //리덕스에서 상태 가져오기
  const isLogIn = useSelector((state: RootState) => state.auth.isAuthenticated);

  //로그인 여부 확인
  // const [isLogIn, setIsLogIn] = useState<boolean>(false);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('access_token');
  //   setIsLogIn(!!accessToken);
  // },[]);

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

  const showModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  useEffect(() => {
    if (!mobileOpen) {
      setWriteOpen(false);
      setAnalyzeOpen(false);
    }
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between w-full h-16 px-6 ${className}`}
    >
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
          categoryNames={categoryNames} // ✅ 추가
        />
        <HeaderDropdown
          open={analyzeOpen}
          title="계약서 분석"
          onToggle={() => {
            setAnalyzeOpen((prev) => !prev);
            setWriteOpen(false);
          }}
          onItemClick={handleAnalyzeClick}
          categoryNames={categoryNames} // ✅ 추가
        />
        {isLogIn ? (
          <button
          onClick={() => navigate('/mypage')}
          className="text-sm font-normal text-gray-700 hover:text-black"
        >
          마이페이지
        </button>
        ): (
          <button
          onClick={showModal}
          className="text-sm font-normal text-gray-700 hover:text-black"
        >
          회원가입 / 로그인
        </button>
        )}
        
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
          showModal={showModal}
          categoryNames={categoryNames} // ✅ 모바일 메뉴도 전달
          isLogIn={isLogIn} //로그인 상태 전달
        />
      )}

      {modalIsOpen && <KakaoLoginModal onClose={showModal} />}
    </header>
  );
};
