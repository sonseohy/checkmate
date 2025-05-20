import { useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import koreaJson from '@assets/images/map/koreamap.simple.json';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useSelector } from 'react-redux';
import { RootState } from "@/app/redux/store";
import { Dropdown, getRegionName } from '@/features/mypage';
import { useMobile } from '@/shared';


// 시·도별 JSON 파일 이름 매핑
const regionFileMap: Record<string, string> = {
  '서울특별시': 'seoul',
  '부산광역시': 'Busan',
  '대구광역시': 'Daegu',
  '인천광역시': 'Incheon',
  '광주광역시': 'Gwangju',
  '대전광역시': 'Daejeon',
  '울산광역시': 'Ulsan',
  '세종특별자치시': 'sejong',
  '경기도': 'Gyeonggido',
  '강원특별자치도': 'Gangwondo',
  '충청북도': 'Chungbug',
  '충청남도': 'Chungnam',
  '전라북도': 'Jeonbuk',
  '전라남도': 'Jeonnam',
  '경상북도': 'Gyeongbuk',
  '경상남도': 'Gyeongnam',
  '제주특별자치도': 'Jeju',
};

// 대한민국 전체 지도 데이터
const topology = koreaJson as unknown as Topology<Objects<GeoJsonProperties>>;
const mapGeo = feature(topology, topology.objects['koreamap']) as FeatureCollection<Geometry, GeoJsonProperties>;

interface KoreaMapProps {
  onRegionSelect: (regionName: string | null) => void;
  selectedRegion: string | null;
}

export default function KoreaMap({
  onRegionSelect,
  selectedRegion,
}: KoreaMapProps) {
  const isMobile = useMobile();
  const location = useSelector((state: RootState) => state.auth.location);

  
  const width = isMobile ? 350 : 760;
  const height = isMobile ? 400 : 660;

  // 드롭다운 옵션
  const options = useMemo(() =>
    Object.keys(regionFileMap).map(region => ({
      value: region,
      label: region,
    })), []);

  const filterOption = selectedRegion
    ? { value: selectedRegion, label: selectedRegion }
    : null;

  // projection & path (전체 지도)
  const projection = useMemo(
    () => d3.geoIdentity().reflectY(true).fitSize([width, height], mapGeo),
    [width, height]
  );
  const pathGen = useMemo(() => d3.geoPath().projection(projection), [projection]);

  // 지도 path 생성 (hover, active 모두 state 기반으로)
  const paths = useMemo(() => {
    return mapGeo.features.map((feat, i) => {
      const korName = (feat.properties as any).CTP_KOR_NM as string;
      const fileBase = regionFileMap[korName];
      const isActive = korName === selectedRegion;

      let fill = "#F0F0F0";
      if (isActive) fill = "#B4C7FF"; // 선택된 지역

      return (
        <path
          key={i}
          d={pathGen(feat)!}
          fill={fill}
          stroke="#666"
          strokeWidth={0.5}
          style={{ cursor: fileBase ? "pointer" : "default" }}
          onClick={() => {
            if (!fileBase) return;
            onRegionSelect(korName);
          }}
        />
      );
    });
  }, [pathGen, selectedRegion, onRegionSelect]);


  // 사용자 위도/경도 → 지역으로 바꾸기 (자동 선택)
  useEffect(() => {
    if (!location) return;
    (async () => {
      const regionName = await getRegionName(location.lat, location.lng);
      if (regionName) onRegionSelect(regionName);
    })();
    // eslint-disable-next-line
  }, [location]);

  return (
    <div className='p-5'>
      <div className={isMobile ? 'w-35' : 'w-50'}>
        <Dropdown
          options={options}
          value={filterOption}
          onChange={opt => onRegionSelect(opt.value)}
        />
      </div>
      <div className='flex flex-row'>
        <div className="py-5">
          <svg width={width} height={height}>
            <g className="boundary">{paths}</g>
          </svg>
        </div>
      </div>
    </div>
  );
}
