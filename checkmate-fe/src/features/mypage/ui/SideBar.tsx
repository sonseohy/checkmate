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
import { Dropdown } from '@/features/mypage';

interface SideBarProps {
  selectedMenu: string;
  onMenuClick: (label: string) => void;
}

export default function SideBar({ selectedMenu, onMenuClick }: SideBarProps) {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* 메뉴 정의 ──────────────────────────────── */
  const menu = [
    { icon: LuLayoutGrid, label: '대시보드' },
    { icon: LuFolder, label: '내 계약서' },
    { icon: LuBell, label: '알림' },
    { icon: LuMap, label: '주변 법원' },
    { icon: LuUserCog, label: '회원 정보' },
    { icon: LuLogOut, label: '로그아웃' },
  ];

  /* 공통 클릭 핸들러 ───────────────────────── */
  const handleClick = async (label: string) => {
    if (label === '로그아웃') {
      await postLogout(navigate, dispatch);
      return;
    }
    onMenuClick(label);
  };

  /* 모바일용 드롭다운 옵션 ─────────────────── */
  const dropdownOptions = menu.map((m) => ({
    value: m.label,
    label: m.label,
  }));

  /* ────────────────────────────────────────── */
  return (
    <div>
      {/* ────────── ✅ 모바일 ────────── */}
      {isMobile ? (
        <div className="flex w-full">
          <Dropdown
            options={dropdownOptions}
            value={{ value: selectedMenu, label: selectedMenu }}
            onChange={(opt) => handleClick(opt.value)}
          />
        </div>
      ) : (
        /* ────────── ✅ 데스크탑 ────────── */
        <div className="relative flex flex-col h-screen bg-white mr-5 ml-10">
          <div className="mt-5">
            {menu.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => handleClick(label)}
                className="flex items-center gap-5 mb-6 group"
              >
                <Icon
                  size={36}
                  style={{ strokeWidth: 1.5 }}
                  color={selectedMenu === label ? '#60A5FA' : '#202020'}
                />
                <span
                  className={`text-2xl font-medium transition-colors ${
                    selectedMenu === label ? 'text-[#60A5FA]' : 'text-black'
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
