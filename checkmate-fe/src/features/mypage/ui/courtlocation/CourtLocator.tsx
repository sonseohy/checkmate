//법원 위치 찾기
import { KoreaMap ,
        getCourthouseList,
        Courthouse} from "@/features/mypage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

const regionKeywords: Record<string, string[]> = {
  '서울특별시': ['서울', '서울특별시', '서울시'],
  '부산광역시': ['부산광역시','부산'],
  '대구광역시': ['대구광역시', '대구'],
  '인천광역시': ['인천광역시'],
  '광주광역시': ['광주광역시', '광주'],
  '대전광역시': ['대전광역시', '대전'],
  '울산광역시': ['울산광역시','울산'],
  '세종특별자치시': ['세종특별자치시','대전광역시','대전'],
  '경기도': ['경기도'],
  '강원특별자치도': ['강원특별자치도'],
  '충청북도': ['충청북도', '충북'],
  '충청남도': ['충청남도', '충남'],
  '전라북도': ['전라북도', '전북특별자치도', '전북'],
  '전라남도': ['전라남도', '전남'],
  '경상북도': ['경상북도', '경북'],
  '경상남도': ['경상남도','경남'],
  '제주특별자치도': ['제주특별자치도', '제주'],
};

export default function CourtLocation() {
    const [courts, setCourts] = useState<Courthouse[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
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

    const filteredCourts = selectedRegion
      ? courts.filter(court => {
          const keywords = regionKeywords[selectedRegion] || [selectedRegion];
          return keywords.some(keyword => court.courthouseAddress.includes(keyword));
        })
      : courts;

    return (
        <div className="w-full">
            <div className="m-8 rounded-2xl  bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] ">
                <KoreaMap 
                  onRegionSelect={setSelectedRegion}  // ★ 지도에서 지역 선택되면 상태 업데이트
                  selectedRegion={selectedRegion}  
                /> 
            </div>
            <div className="rounded-2xl m-8 p-2 w-300 bg-white  overflow-y-scroll">
                {filteredCourts.map((court, idx) => (
                    <div key={court.courthouseId} className="flex flex-row gap-2">
                        <div className="m-5 flex justify-start items-center">
                            <span className="text-lg font-semibold">{idx+1}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg">{court.courthouseName}</span>
                            <span className="text-md">{court.courthouseAddress}</span>
                            <span className="mb-2 text-sm">{court.courthousePhoneNumber}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
