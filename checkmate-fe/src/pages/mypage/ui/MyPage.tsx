import { SideBar, 
         Dashboard, 
         UserInfo, 
         CourtLocator, 
         MyContracts } from "@/features/mypage";
import { useState } from "react";

export default function MyPage() {
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
        <div className="flex flex-row h-screen">
            {/* 사이드바 */}
            <div className="flex-shrink-0">
                <SideBar onMenuClick={handleMenuClick} selectedMenu={selectedMenu}/>
            </div>
            <div className="flex-1">
                <div className="text-2xl my-3 ml-3">
                    안녕하세요 김싸피님
                </div>
                <div className="h-px bg-gray-200 " />
                {/* 컴포넌트 */}
                <div className="m-3">
                    { displayComponent }
                </div>
            </div>
        </div>
    );
}