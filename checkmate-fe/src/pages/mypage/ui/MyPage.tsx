import { SideBar, 
         Dashboard, 
         UserInfo, 
         CourtLocator, 
         MyContracts } from "@/features/mypage";
import { useMobile } from "@/shared";
import { useState } from "react";

export default function MyPage() {
    const isMobile = useMobile();
    const [selectedMenu, setSelectedMenu] = useState<string>("대시 보드");

    const handleMenuClick = (label: string) => {
        setSelectedMenu(label);
    };

    let displayComponent;
    switch (selectedMenu) {
        case "대시 보드":
            displayComponent = <Dashboard />;
            break;
        case "내 계약서":
            displayComponent =<MyContracts />;
            break;
        case "주변 법원":
            displayComponent = <CourtLocator />;
            break;
        case "회원 정보":
            displayComponent = <UserInfo />;
            break;
        default:
            displayComponent =  <Dashboard />;
    }

    return (
        <div>
            {isMobile ? (
                <div className="flex flex-col">
                {/* 사이드바 */}
                <div className="flex-shrink-0  z-4">
                    <SideBar onMenuClick={handleMenuClick} selectedMenu={selectedMenu}/>
                </div>
                <div className="flex-1 bg-[#F3F4F6]">

                    <div className="h-px bg-gray-200 " />
                    {/* 컴포넌트 */}
                    <div className="m-3">
                        { displayComponent }
                    </div>
                </div>
            </div>
            ):(
                <div className="flex flex-row h-screen">
                {/* 사이드바 */}
                <div className="flex-shrink-0">
                    <SideBar onMenuClick={handleMenuClick} selectedMenu={selectedMenu}/>
                </div>
                <div className="flex-1 bg-[#F3F4F6]">

                    <div className="h-px bg-gray-200 " />
                    {/* 컴포넌트 */}
                    <div className="m-3">
                        { displayComponent }
                    </div>
                </div>
            </div>
            )}
        </div>      
    );
};