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
          fixed bottom-0 left-0 right-0
          bg-white shadow
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
                className={active ? 'text-blue-500' : 'text-gray-700'}
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
        group/sidebar relative flex flex-col
        h-full bg-white shadow-md
        overflow-hidden transition-all duration-300
        w-16 hover:w-64
      "
    >
      <div className="mt-10 space-y-6">
        {menu.map(({ icon: Icon, label }) => {
          const active = selectedMenu === label;
          return (
            <button
              key={label}
              onClick={() => handleClick(label)}
              className="flex items-center gap-4 w-full px-4"
            >
              <Icon
                size={26}
                style={{ strokeWidth: 1.5 }}
                className={active ? 'text-blue-500' : 'text-gray-800'}
              />

              {/* 라벨: 사이드바 호버 시에만 노출 */}
              <span
                className={`
                  hidden group-hover/sidebar:inline-block
                  whitespace-nowrap text-lg font-medium
                  ${active ? 'text-blue-500' : 'text-gray-800'}
                  transition-opacity duration-300
                  opacity-0 group-hover/sidebar:opacity-100
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
