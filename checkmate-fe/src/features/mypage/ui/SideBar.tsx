import { postLogout } from "@/features/auth";
import { useMobile } from "@/shared";
import { useState } from "react";
import { LuLayoutGrid, LuFolder, LuMap, LuUserCog, LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@/features/mypage"; 

interface SideBarProps {
  onMenuClick: (label: string) => void;
  selectedMenu: string;
}

export default function SideBar({ onMenuClick }: SideBarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMobile();
  const [currentLabel, setCurrentLabel] = useState<string>("대시보드"); // 기본 값은 "대시보드"

  const menu = [
    { icon: LuLayoutGrid, label: "대시보드" },
    { icon: LuFolder, label: "내 계약서" },
    { icon: LuMap, label: "주변 법원" },
    { icon: LuUserCog, label: "회원 정보" },
    { icon: LuLogOut, label: "로그아웃" },
  ];

  const handleLogout = async () => {
    await postLogout(navigate, dispatch);
  };

  const handleMenuClick = (label: string) => {
    if (label === "로그아웃") {
      handleLogout();
    } else {
      setCurrentLabel(label); // 클릭된 메뉴로 현재 선택된 메뉴 변경
      onMenuClick(label); // 컴포넌트 변경
    }
  };



  // 드롭다운에 사용할 옵션들
  const dropdownOptions = menu.map((item) => ({
    value: item.label,
    label: item.label,
  }));

  return (
    <div>
      {isMobile ? (
        <div className={`flex w-full transition-width duration-300`}>
          <div className="flex flex-col items-center w-full">
            <div className="space-y-5 w-full">
              {/* 드롭다운 컴포넌트 */}
              <Dropdown
                options={dropdownOptions}
                value={{ value: currentLabel, label: currentLabel }}
                onChange={(opt) => handleMenuClick(opt.value)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col h-screen bg-white mr-5 ml-10">
          <div className="absolute inset-y-0 right-2 w-px" />
          <div className="mt-5">
            {menu.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-row items-center gap-5 mb-5"
                onClick={() => handleMenuClick(label)}
              >
                <Icon
                  size={40}
                  color={currentLabel === label ? "#60A5FA" : "#202020"}
                  style={{ strokeWidth: 1.5 }}
                />
                <span
                  className={`overflow-hidden whitespace-nowrap text-2xl font-medium transition-all duration-300 ${
                    currentLabel === label ? "text-[#60A5FA]" : "text-black"
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
