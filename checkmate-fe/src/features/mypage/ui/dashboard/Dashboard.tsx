// 대시 보드
import { PieDonutChart, 
        ContractListData,
        contractList, 
        ContractCarousel } from "@/features/mypage";
import useMobile from "@/shared/hooks/useMobile";
import { useQuery } from "@tanstack/react-query";


export default function Dashboard() {
    const isMobile = useMobile();
    
    const { data, isLoading, isError, error } = useQuery<ContractListData, Error>({
        queryKey: ['contractList'],
        queryFn: contractList,
      });

    if (isLoading) {
        return <div>Loading..</div>;
    };

    if (isError) {
        return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
    };

    return (
        <div> 
            <div className={`flex flex-col  h-screen ${isMobile ? ' justify-center items-center': 'ml-10 h-120 mt-10 '}`}>
                <div className={` ${isMobile ? 'w-full': 'w-full rounded-2xl'}`}>
                    <div className={` text-[#202020] font-semibold ${isMobile ? 'my-3 text-xl': 'mt-5 text-2xl ml-5'}`}>
                        최근 활동
                    </div>
                    <div>
                        <ContractCarousel contractList={data?.contracts ?? []} />
                    </div>
                </div>
                {isMobile 
                ? <div className=" rounded-2xl bg-white w-full mb-5 ">
                    <PieDonutChart contractList={data?.contracts ?? []} />
                  </div>
                : <div className="rounded-2xl bg-white shadow-[0_0px_15px_rgba(0,0,0,0.2)] w-1/4">
                    <div className="mt-5 ml-5 text-black text-2xl font-semibold">
                        계약 활동
                    </div>
                    <PieDonutChart contractList={data?.contracts ?? []} />
                  </div>
                }
            </div>
        </div>
    );
};
