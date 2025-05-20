/* src/features/mypage/ui/SideBar.tsx */
import { postLogout } from '@/features/auth';
import { useMobile } from '@/shared';
import {
  LuLayoutGrid,
  LuFolder,
  LuBell,
  LuMap,
  LuUserCog,
  LuLogOut,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

interface SideBarProps {
  selectedMenu: string;
  onMenuClick: (label: string) => void;
}

export default function SideBar({ selectedMenu, onMenuClick }: SideBarProps) {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* 메뉴 정의 */
  const menu = [
    { icon: LuLayoutGrid, label: '대시보드' },
    { icon: LuFolder, label: '내 계약서' },
    { icon: LuBell, label: '알림' },
    { icon: LuMap, label: '주변 법원' },
    { icon: LuUserCog, label: '회원 정보' },
    { icon: LuLogOut, label: '로그아웃' },
  ];

  const handleClick = async (label: string) => {
    if (label === '로그아웃') {
      await postLogout(navigate, dispatch);
      return;
    }
    onMenuClick(label);
  };

  /* ───────── 📱 모바일: 하단 아이콘 바 ───────── */
  if (isMobile) {
    return (
      <nav
        className="
          sticky top-14 left-0 right-0      /* ↑ 헤더 높이(예: 56px=14)만큼 내려서 겹치지 않도록 */
        bg-white 
        flex justify-around
        py-4 z-50
        "
      >
        {menu.map(({ icon: Icon, label }) => {
          const active = selectedMenu === label;
          return (
            <button key={label} onClick={() => handleClick(label)}>
              <Icon
                size={26}
                style={{ strokeWidth: 1.6 }}
                className={`${
                  active ? 'text-blue-500' : 'text-gray-700'
                } mx-auto`}
              />
            </button>
          );
        })}
      </nav>
    );
  }

  /* ───────── 🖥 데스크톱: 호버 확장 사이드바 ───────── */
  return (
    <div
      className="
      group/sidebar
      sticky top-16           /* ← 헤더 바로 아래에 고정 */
      flex flex-col
      h-[calc(100vh-4rem)]    /* 뷰포트 높이 - 헤더 높이(4rem=64px) */
      bg-white shadow-md overflow-hidden
      transition-all duration-300
      w-16 hover:w-48         /* 폭 조금만 넓힘 */
    "
    >
      <div className="mt-10 space-y-7 px-2">
        {menu.map(({ icon: Icon, label }) => {
          const active = selectedMenu === label;
          return (
            <button
              key={label}
              onClick={() => handleClick(label)}
              className="
                grid grid-cols-[40px_1fr] items-center   /* 40px = 아이콘 고정폭 */
                w-full gap-x-3
                transition-colors
              "
            >
              <Icon
                size={26}
                style={{ strokeWidth: 1.4 }}
                className={`${
                  active ? 'text-blue-500' : 'text-gray-800'
                } mx-auto`}
              />

              <span
                className={`
                  whitespace-nowrap text-base font-medium
                  ${active ? 'text-blue-500' : 'text-gray-800'}
                  opacity-0 translate-x-2
                  transition-all duration-200
                  group-hover/sidebar:opacity-100
                  group-hover/sidebar:translate-x-0
                `}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
