// 대시 보드
import { PieDonutChart, 
    ContractListData } from "@/features/mypage";
import useDeviceType from "@/shared/hooks/useMobile";


export default function Dashboard() {
    const isMobile = useDeviceType();
    // 하드코딩 데이터 (삭제 예정)
    const data:ContractListData = {
        contracts: [
          {
            "contract_id": 1,
            "category_id": 2,
            "title": "부동산 매매계약서",
            "source_type": "USER_UPLOAD",
            "page_no": 5,
            "created_at": "2025-04-15T14:22:10.123456"
          },
          {
            "contract_id": 2,
            "category_id": 3,
            "title": "임대차 계약서",
            "source_type": "SERVICE_GENERATED",
            "page_no": 3,
            "created_at": "2025-04-10T09:15:30.123456"
          }
        ]
      }
      
    return (
        <div>
            <div className="text-3xl font-bold">
                대시보드
            </div>
            
            {/* 활동에 대한 그래프 */}
            <div className={`flex ${isMobile ? 'flex-col justify-center' : 'flex-row gap-10 ml-10'} items-center `}>
                <div className={` rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)  ${isMobile ? 'w-full mb-5' : 'w-100'}`}>
                    <PieDonutChart />
                </div>
                {/* 계약서 리스트=> 캐러셀 구현 예정 */}
            <div className="flex flex-row gap-5 mt-5">
                {data.contracts.map((contract) => (
                    <div key={contract.contract_id} 
                        className="flex flex-col w-80 h-50 p-3 bg-white border-1 border-gray-200 rounded-2xl"
                    >
                    <span className={`w-15 inline rounded-md px-3 py-2 text-xl font-medium text-white ${
                        contract.source_type === 'USER_UPLOAD'
                        ? "bg-[#B4C7FF]"
                    : "bg-[#FFB4B5]"}`}>{contract.source_type === "USER_UPLOAD" ? "분석" : "작성"}</span>
                    <p className="my-5 text-2xl font-bold">{contract.title}</p>
                    {/* created_at 데이터 변형 필요 */}
                    <p>{contract.created_at}</p> 
                    </div>
                )) }
            </div>
            </div>
        </div>
    );
};
