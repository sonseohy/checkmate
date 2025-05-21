import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';

import { useUserInfo, postLogout } from '@/features/auth';
import { loginSuccess, logout } from '@/features/auth/slices/authSlice';
import { useMainCategories } from '@/features/categories';
import { categoryNameToSlugMap } from '@/shared/constants/categorySlugMap';
import { RootState } from '@/app/redux/store';
import { getColorFromString } from '@/shared/utils/getColorFromString';

import HeaderDropdown from './HeaderDropdown';
import MobileMenu from './MobileMenu';
import { KakaoLoginModal } from '@/features/main';
import {
  NotificationButton,
  useNotificationSocket,
} from '@/features/notifications';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useUserInfo();

  const [writeOpen, setWriteOpen] = useState(false);
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLogIn = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data: mainCategories } = useMainCategories();
  const categoryNames = mainCategories?.map((cat) => cat.name) ?? [];

  const closeAllDropdowns = () => {
    setWriteOpen(false);
    setAnalyzeOpen(false);
    setDropdownOpen(false);
    setNotificationOpen(false);
  };

  // ✅ WebSocket 알림 연결
  useNotificationSocket(isLogIn);

  // 로그인 상태 감지
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken && user) {
      dispatch(loginSuccess(user));
    } else {
      dispatch(logout());
    }
  }, [dispatch, user]);

  // 모바일 메뉴 열릴 때 드롭다운 초기화
  useEffect(() => {
    if (!mobileOpen) closeAllDropdowns();
  }, [mobileOpen]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleLogout = async () => {
    await postLogout(navigate, dispatch);
  };

  const showModal = () => setModalIsOpen(!modalIsOpen);

  const userName = user?.name ?? 'Guest';
  const trimmedName = userName.slice(0, -2);
  const userColor = getColorFromString(userName);

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between w-full h-16 px-6 ${className}`}
    >
      {/* 로고 */}
      <Link to="/" className="flex items-center gap-2">
        <img src="/icons/favicon-96x96.png" alt="logo" className="w-10 h-10" />
      </Link>

      {/* 데스크탑 메뉴 */}
      <div className="items-center hidden gap-8 text-sm font-semibold text-black md:flex">
        <button
          onClick={() => navigate('/intro/write')}
          className="text-sm font-normal text-gray-700 hover:text-black"
        >
          계약서 작성 가이드
        </button>

        <HeaderDropdown
          open={writeOpen}
          title="계약서 작성"
          onToggle={() => {
            const next = !writeOpen;
            closeAllDropdowns();
            setWriteOpen(next);
          }}
          onItemClick={handleWriteClick}
          categoryNames={categoryNames}
        />

        <HeaderDropdown
          open={analyzeOpen}
          title="계약서 분석"
          onToggle={() => {
            const next = !analyzeOpen;
            closeAllDropdowns();
            setAnalyzeOpen(next);
          }}
          onItemClick={handleAnalyzeClick}
          categoryNames={categoryNames}
        />

        {isLogIn && user ? (
          <>
            {/* 알림 버튼 */}
            <NotificationButton
              open={notificationOpen}
              onClick={() => {
                const next = !notificationOpen;
                closeAllDropdowns();
                setNotificationOpen(next);
              }}
              onItemClick={() => {
                /* ✅ 알림 클릭 → 팝업 닫기 */
                setNotificationOpen(false);
              }}
            />

            {/* 유저 아바타 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  const next = !dropdownOpen;
                  closeAllDropdowns();
                  setDropdownOpen(next);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: userColor }}
                title={user.name}
              >
                {trimmedName}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-10">
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      navigate('/mypage');
                      setDropdownOpen(false);
                    }}
                  >
                    마이페이지
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={showModal}
            className="text-sm font-normal text-gray-700 hover:text-black"
          >
            회원가입 / 로그인
          </button>
        )}
      </div>

      {/* 모바일 알림 + 햄버거 버튼 */}
      <div className="flex items-center gap-2 md:hidden">
        {isLogIn && (
          <NotificationButton
            open={notificationOpen}
            onClick={() => {
              const next = !notificationOpen;
              closeAllDropdowns();
              setNotificationOpen(next);
            }}
            onItemClick={() => {
              /* ✅ 동일하게 전달 */
              setNotificationOpen(false);
            }}
          />
        )}
        <button className="p-2" onClick={() => setMobileOpen((m) => !m)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <MobileMenu
          writeOpen={writeOpen}
          analyzeOpen={analyzeOpen}
          toggleWrite={() => {
            const next = !writeOpen;
            closeAllDropdowns();
            setWriteOpen(next);
          }}
          toggleAnalyze={() => {
            const next = !analyzeOpen;
            closeAllDropdowns();
            setAnalyzeOpen(next);
          }}
          handleWriteClick={handleWriteClick}
          handleAnalyzeClick={handleAnalyzeClick}
          closeMobile={() => setMobileOpen(false)}
          showModal={showModal}
          categoryNames={categoryNames}
          isLogIn={isLogIn}
          isLogOut={handleLogout}
          showGuide={() => {
            setMobileOpen(false);
            navigate('/intro/write');
          }}
        />
      )}

      {/* 로그인 모달 */}
      {modalIsOpen && <KakaoLoginModal onClose={showModal} />}
    </header>
  );
};
