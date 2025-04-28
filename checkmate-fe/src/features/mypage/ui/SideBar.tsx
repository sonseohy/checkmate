//사이드 바
import { useState } from "react";
import {LuLayoutGrid, 
        LuFolder, 
        LuMap, 
        LuUserCog, 
        LuLogOut, 
        LuChevronRight, 
        LuChevronLeft } from "react-icons/lu";

interface SideBarProps {
  onMenuClick: (label:string) => void;
  selectedMenu: string;
}


export default function SideBar({ onMenuClick, selectedMenu }: SideBarProps ) {
  const [ isOpen, setIsOpen ] = useState<boolean>(false)

  const menu = [
    {icon: LuLayoutGrid, label: "대시보드" },
    {icon: LuFolder, label: "내 계약서" },
    {icon: LuMap, label: "주변 법원" },
    {icon: LuUserCog, label: "회원 정보"},
    {icon: LuLogOut, label: "로그아웃" },
  ]


  return (
    <div
      className={`
        relative flex flex-col h-screen
        bg-white px-6
        transition-all duration-300
        ${isOpen ? "w-full" : "w-25"}
      `}
    >
      <div className="absolute inset-y-0 right-2 w-px bg-gray-200" />
      <button
        onClick={()=> setIsOpen(!isOpen)}
        className="absolute top-100 right-[-5px]"
      >
        {isOpen? <LuChevronRight
                  size={30} 
                  className="rounded-2xl bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.2)]"
                  />: 
                  <LuChevronLeft
                  size={30} 
                  className="rounded-2xl bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.2)]"
        /> }
      </button>
      {/* 로고 */}
        <div className="my-3">
          <img src="/icons/favicon-32x32.png" 
              alt="logo"
              width={40}
              height={40}
              />
        </div>
        {/* 사이드바 메뉴 */}
        <div className="mt-5">
          {menu.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-row items-center gap-5 mb-5"
              onClick={()=> onMenuClick(label)}
            >
              <Icon 
                size={40} 
                color= {selectedMenu === label ? "#60A5FA" : "#202020"}
                style={{ strokeWidth:1.5 }}
              />
              <span
                className={`
                  overflow-hidden whitespace-nowrap
                  text-2xl font-medium
                  transition-[max-width,opacity] duration-300 ease-in-out
                  ${isOpen ? "opacity-100": "opacity-0"}
                  ${selectedMenu === label ? "text-[#60A5FA]" : "text-black"}`} 
              >
                {label}
              </span>
            </button>
          ))}     
        </div>
    </div>
    
  );
};