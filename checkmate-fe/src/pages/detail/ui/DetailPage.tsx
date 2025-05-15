import { ContractPdfViewer, 
        ContractDetail } from "@/features/detail";
import { useMobile } from "@/shared";
import { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

const  DetailPage: React.FC = () => {
    const isMobile = useMobile();
    const [isOpen, setIsOpen ] = useState<boolean>(false);

    const toggleOpen = () => setIsOpen(prev => !prev);
    
    if (isMobile) {
        return (
        <div className="flex flex-col min-h-screen">
            {/* 접힘/펼침 버튼 */}
            <button 
            onClick={toggleOpen} 
            className="w-full flex items-center justify-end gap-2 px-4 py-2 hover:bg-gray-300 focus:outline-none"
            >
            계약서 자세히 보기 {isOpen ? <LuChevronUp /> :  <LuChevronDown />}
            </button>

            {/* 펼쳐졌을 때만 보이게 */}
            {isOpen && (
            <div className="px-4 py-2 border-t border-gray-300">
                <ContractDetail />
            </div>
            )}
            <div className="h-px bg-gray-200 " />
            <div className="flex-1 bg-[#F3F4F6] mt-2">
                <ContractPdfViewer />
            </div>
        </div>
        );
    } else {
        return (
        <div className="flex flex-row">
            <div className="w-3/4 bg-[#F3F4F6]">
            <ContractPdfViewer />
            </div>
            <div className="w-1/4 pl-4">
            <ContractDetail />
            </div>
        </div>
        );
    }
}; 
export default DetailPage;