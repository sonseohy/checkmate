import { ContractPdfViewer, 
        ContractDetail } from "@/features/detail";

const  DetailPage: React.FC = () => {
    
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
}; 
export default DetailPage;