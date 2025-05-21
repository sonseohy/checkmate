import { KoreaMap, getCourthouseList, Courthouse } from '@/features/mypage';
import { useMobile } from '@/shared';
import { useEffect, useState } from 'react';
import CourtLocatorSkeleton from './CourtLocatorSkeleton';

const regionKeywords: Record<string, string[]> = {
  서울특별시: ['서울', '서울특별시', '서울시'],
  부산광역시: ['부산광역시', '부산'],
  대구광역시: ['대구광역시', '대구'],
  인천광역시: ['인천광역시'],
  광주광역시: ['광주광역시', '광주'],
  대전광역시: ['대전광역시', '대전'],
  울산광역시: ['울산광역시', '울산'],
  세종특별자치시: ['세종특별자치시', '대전광역시', '대전'],
  경기도: ['경기도'],
  강원특별자치도: ['강원특별자치도'],
  충청북도: ['충청북도', '충북'],
  충청남도: ['충청남도', '충남'],
  전라북도: ['전라북도', '전북특별자치도', '전북'],
  전라남도: ['전라남도', '전남'],
  경상북도: ['경상북도', '경북'],
  경상남도: ['경상남도', '경남'],
  제주특별자치도: ['제주특별자치도', '제주'],
};

export default function CourtLocation() {
  const isMobile = useMobile();
  const [courts, setCourts] = useState<Courthouse[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // 법원 목록 불러오기
  useEffect(() => {
    (async () => {
      try {
        const data = await getCourthouseList();
        setCourts(data);
      } catch {
        // console.error('법원 리스트 불러오기 실패:', err);
      } finally {
        setLoading(false); // 성공/실패 상관없이 로딩 종료
      }
    })();
  }, []);

  const filteredCourts = selectedRegion
    ? courts.filter((court) => {
        const keywords = regionKeywords[selectedRegion] || [selectedRegion];
        return keywords.some((keyword) =>
          court.courthouseAddress.includes(keyword),
        );
      })
    : courts;

  // 로딩중이면 스켈레톤 컴포넌트 표시
  if (loading) return <CourtLocatorSkeleton />;

  return (
    <>
      {isMobile ? (
        <div className="w-full flex flex-col gap-3">
          <div className="rounded-2xl bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)]">
            <KoreaMap
              onRegionSelect={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </div>
          <div className="flex-1 rounded-2xl p-2 bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] max-h-[300px] overflow-y-auto">
            <div className="font-semibold">주변 법원 목록</div>
            <div className="h-px bg-gray-200" />
            <div className="mt-2 divide-y divide-gray-200">
              {filteredCourts.length === 0 && (
                <div className="p-5 text-gray-400">
                  해당 지역의 법원이 없습니다.
                </div>
              )}
              {filteredCourts.map((court, idx) => (
                <div key={court.courthouseId} className="flex flex-row gap-2">
                  <div className="m-3 flex justify-start items-center">
                    <span className="text-lg font-semibold">{idx + 1}</span>
                  </div>
                  <div className="flex flex-col gap-1 my-2">
                    <span className="font-medium text-xl">
                      {court.courthouseName}
                    </span>
                    <span className="text-md">{court.courthouseAddress}</span>
                    <span className="text-sm">
                      {court.courthousePhoneNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-row">
          <div className="rounded-2xl bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] m-8">
            <KoreaMap
              onRegionSelect={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </div>
          <div className="flex-1 rounded-2xl p-2 bg-white shadow-[0_0px_10px_rgba(0,0,0,0.1)] max-h-[1018px] max-w-[450px] my-8 mx-2 overflow-y-auto">
            <div className="font-semibold m-3 text-2xl">주변 법원 목록</div>
            <div className="h-px bg-gray-200" />
            <div className="mt-2 divide-y divide-gray-200">
              {filteredCourts.length === 0 && (
                <div className="p-5 text-gray-400">
                  해당 지역의 법원이 없습니다.
                </div>
              )}
              {filteredCourts.map((court, idx) => (
                <div key={court.courthouseId} className="flex flex-row gap-2">
                  <div className="m-5 flex justify-start items-center">
                    <span className="text-xl font-semibold">{idx + 1}</span>
                  </div>
                  <div className="flex flex-col gap-1 my-2">
                    <span className="font-medium text-xl">
                      {court.courthouseName}
                    </span>
                    <span className="text-md">{court.courthouseAddress}</span>
                    <span className="text-md">
                      {court.courthousePhoneNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
