//법원 위치 찾기
import { KoreaMap ,
        getCourthouseList,
        Courthouse} from "@/features/mypage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";


export default function CourtLocation() {
    const [courts, setCourts] = useState<Courthouse[]>([]);
    const location = useSelector((state: RootState) => state.auth.location);

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
        <div className="w-full">
            <div className="m-8 rounded-2xl  bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] ">
                <KoreaMap /> 
            </div>
            <div className="rounded-2xl bg-white h-100 overflow-y-scroll">                    
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
    );
};
