//법원 위치 찾기
import { KoreaMap ,
        KakaoMap , 
        getCourthouseList,
        Courthouse} from "@/features/mypage";
import { useEffect, useState } from "react";



export default function CourtLocation() {
        const [courts, setCourts] = useState<Courthouse[]>([]);

    // 법원 목록을 API에서 가져옵니다.
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const data = await getCourthouseList();
                setCourts(data);  
            } catch (err) {
                console.error('법원 리스트 불러오기 실패:', err);
            }
        };

        fetchCourts();
    }, []);

    return (
        <div>
            <div className="flex flex-col">
                <div className="m-10 rounded-2xl bg-white">
                    <KoreaMap courtCoords={courts} /> 
                </div>
                <div className="flex flex-row">
                    <div>
                        <KakaoMap />
                    </div>
                    <div className="flex-1 rounded-2xl bg-white h-100 overflow-y-scroll">
                        
                        {courts.map((court) => {
                            return (
                                <div key={court.courthouseId}
                                    className="flex flex-row gap-2">
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
