//법원 위치 찾기
import { KoreaMap ,
        KakaoMap , 
        CourtList,
        CourtWithCoords, 
        searchPlace,
        LatLng } from "@/features/mypage";
import { useQueries } from "@tanstack/react-query";

const data:CourtList[] = [
    {
        "courthouseId": 1,
        "courthouseName": "서울중앙지방법원",
        "courthouseAddress": "서울특별시 서초구 서초대로 101",
        "courthousePhoneNumber": "02-530-1114"
    },
    {
        "courthouseId": 2,
        "courthouseName": "서울동부지방법원",
        "courthouseAddress": "서울특별시 광진구 능동로 123",
        "courthousePhoneNumber": "02-2204-2114"
    },
]

export default function CourtLocation() {

    const geocodeResults = useQueries({
        queries: data.map((court) => ({
            queryKey: ['place', court.courthouseName],
            queryFn: () => searchPlace(court.courthouseName),
            staleTime: Infinity,
            enabled: !!court.courthouseName,
        })),
    });
   
     // 2) 로딩/에러 상태 처리
    const isLoading = geocodeResults.some((r) => r.isLoading);
    const isError = geocodeResults.some((r) => r.isError);

    if (isLoading) return <div>위치 정보 변환 중…</div>;
    if (isError) return <div>위치 변환에 실패했습니다.</div>;

    // 3) 주소→위경도 결과와 원본 데이터를 합쳐서 CourtWithCoords 배열 생성
    const courtsWithCoords: CourtWithCoords[] = data.map(
        (court, idx) => {
        const coord = geocodeResults[idx].data as LatLng;
        return {
            ...court,
            lat: coord.lat,
            lng: coord.lng,
        };
        }
    );
    return (
        <div>
            <div className="text-3xl font-bold">
                관할 법원 위치
            </div>
            <div className="flex flex-col">
                <div className="mb-5">
                    <KoreaMap courtCoords={courtsWithCoords} /> 
                </div>
                <div className="flex flex-row">
                    <div>
                        <KakaoMap />
                    </div>
                    <div className="flex-1 border-2 border-gray-200">
                        
                        {data.map((court) => {
                            return (
                                <div key={court.courthouseId}
                                    className="flex flex-row gap-2 ">
                                    <div className="m-5 flex justify-start items-center">
                                        <span className="text-lg font-semibold">{court.courthouseId}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg">{court.courthouseName}</span>
                                        <span className="text-md">{court.courthouseAddress}</span>
                                        <span className="mb-2 text-sm">{court.courthousePhoneNumber}</span>
                                    </div>
                                </div>  
                            );
                        })}
                    </div>
                </div>
            </div>
            
        </div>
    );
};
