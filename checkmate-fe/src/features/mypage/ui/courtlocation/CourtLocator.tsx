//법원 위치 찾기
import KakaoMap from "./KakaoMap";
import { CourtList } from "@/features/mypage";

export default function CourtLocation() {

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

    return (
        <div>
            <div className="text-3xl font-bold">
                관할 법원 위치
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
    );
};
