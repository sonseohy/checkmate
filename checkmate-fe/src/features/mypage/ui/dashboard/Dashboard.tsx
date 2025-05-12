// 대시 보드
import { PieDonutChart, 
        ContractListData,
        contractList, 
        ContractCarousel } from "@/features/mypage";
import useDeviceType from "@/shared/hooks/useMobile";
import { useQuery } from "@tanstack/react-query";


export default function Dashboard() {
    const isMobile = useDeviceType();
    
    const { data, isLoading, isError, error } = useQuery<ContractListData, Error>({
        queryKey: ['contractList'],
        queryFn: contractList,
      });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
    }

    return (
        <div> 
            {/* 활동에 대한 그래프 */}
            <div className={`flex mt-10 ${isMobile ? 'flex-col justify-center' : 'flex-row gap-10 ml-10 h-120 '} items-center `}>
                <div className={` rounded-2xl bg-white shadow-[0_0px_15px_rgba(0,0,0,0.2)] ${isMobile ? 'w-full mb-5' : 'w-1/4'}`}>
                    <div className="mt-5 text-2xl ml-5 font-semibold">
                        계약 활동
                    </div>
                    <PieDonutChart contractList={data?.contracts ?? []} />
                </div>
                <div className={` w-3/4 h-[450px] rounded-2xl bg-white shadow-[0_0px_10px_rgba(0,0,0,0.2)] `}>
                    <div className="mt-5 text-2xl ml-5 font-semibold">
                        최근 계약서
                    </div>
                    <div className=" justify-center">
                        <ContractCarousel contractList={data?.contracts ?? []} />
                    </div>
                </div>
            </div>
        </div>
    );
};
