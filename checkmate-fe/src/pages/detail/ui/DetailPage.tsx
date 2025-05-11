import { ContractPdfViewer } from "@/features/detail";

const DetailPage = () => {
    return (
        <div className="flex flex-row ">
            <div className="w-3/4 bg-[#F3F4F6]">
                <ContractPdfViewer />
            </div>
            <div className="w-1/4">
                계획서 상세 정보의 다른 정보
            </div>
        </div>
    );
}; 
export default DetailPage;