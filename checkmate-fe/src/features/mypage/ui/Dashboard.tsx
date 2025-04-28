// 대시 보드
import { PieDonutChart } from "./PieDonutChart";
import { ContractListData } from "../model/types";
import { useMobile } from "@/shared";


export default function Dashboard() {
    const isMobile = useMobile();
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
                최근 활동
                <span className="ml-1 text-[#60A5FA]"> 2 </span>
            </div>
            
            {/* 활동에 대한 그래프 */}
            <div className={`flex ${isMobile ? 'flex-col justify-center' : 'flex-row gap-10 ml-30'} items-center `}>
                <div className={`${isMobile ? 'w-full mb-5' : 'w-150'}`}>
                    <PieDonutChart />
                </div>
                <div className={`flex-1 p-5 font-semibold text-2xl rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${isMobile ? 'w-full' : 'max-w-150 min-h-100'}`}>
                    '김싸피'님의 계약서 현황입니다
                    <br />
                    분석: 5개
                    <br />
                    작성: 4개
                </div>
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
    );
};
