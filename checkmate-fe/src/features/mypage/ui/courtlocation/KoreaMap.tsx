// features/mypage/ui/courtlocation/KoreaMap.tsx
import { useEffect, useMemo, useState } from 'react';
import * as d3 from 'd3';
import koreaJson from '@assets/images/map/koreamap.simple.json';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import RegionMapModal from './RegionMapModal';
import { getRegionName } from '../../api/MyPageApi';
import { useSelector } from 'react-redux';
import { RootState } from "@/app/redux/store";


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

// Vite 전용: glob으로 모든 region topojson 미리 불러오기
const regionModules = import.meta.glob<{ default: Topology<Objects<GeoJsonProperties>> }>(
  '/src/assets/images/map/*.json',
  { eager: true }
);
const regionMap: Record<string, Topology<Objects<GeoJsonProperties>>> = {};
for (const path in regionModules) {
  const m = path.match(/\/([\w-]+)\.json$/);
  if (m) regionMap[m[1]] = regionModules[path].default;
}

// 대한민국 전체 지도 데이터
const topology = koreaJson as unknown as Topology<Objects<GeoJsonProperties>>;
const mapGeo = feature(topology, topology.objects['koreamap']) as FeatureCollection<Geometry, GeoJsonProperties>;

const width = 700;
const height = 600;

export default function KoreaMap() {
  const location = useSelector((state: RootState) => state.auth.location);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionTopo, setRegionTopo] = useState<Topology<Objects<GeoJsonProperties>> | null>(null);

  // projection & path (전체 지도)
  const projection = useMemo(
    () => d3.geoIdentity().reflectY(true).fitSize([width, height], mapGeo),
    []
  );
  const pathGen = useMemo(() => d3.geoPath().projection(projection), [projection]);

  // 지도 path만 useMemo로 생성
  const paths = useMemo(() => {
  return mapGeo.features.map((feat, i) => {
    const korName = (feat.properties as any).CTP_KOR_NM as string;
    const fileBase = regionFileMap[korName];
    const isActive = fileBase && selectedRegion === fileBase;
    return (
      <path
        key={i}
        d={pathGen(feat)!}
        fill={isActive ? "#60A5FA" : "transparent"}
        stroke="#666"
        strokeWidth={0.5}
        style={{ cursor: fileBase ? "pointer" : "default" }}
        onMouseOver={e => {
          if (!isActive) e.currentTarget.style.fill = "#60A5FA";
        }}
        onMouseOut={e => {
          if (!isActive) e.currentTarget.style.fill = "transparent";
        }}
        onClick={() => {
          if (!fileBase) return;
          setSelectedRegion(fileBase);
        }}
      />
    );
  });
}, [pathGen, selectedRegion]);

  // 선택된 region에 따라 regionTopo 세팅
  useMemo(() => {
    if (!selectedRegion) return;
    const topo = regionMap[selectedRegion];
    if (topo) setRegionTopo(topo);
    else setRegionTopo(null);
  }, [selectedRegion]);
  
  // 사용자 위도/경도 -> 지역으로 바꾸기
  useEffect(() => {
    if (!location) return;
      (async () => {
        const regionName = await getRegionName(location.lat, location.lng);
        console.log('regionName:', regionName)
        const fileBase = regionFileMap[regionName];
        console.log('fileBase:', fileBase)
        if (fileBase) setSelectedRegion(fileBase);
      })();
  }, [location]);

  return (
    <div>
      <div>
        선택 드롭다운 영역 
      </div>
      <div className='flex flex-row justify-center gap-10'>
        <div className="py-5">
          <svg width={width} height={height}>
            <g className="boundary">{paths}</g>
          </svg>
        </div>
        <div className='flex items-center'>
          {selectedRegion && regionTopo && (
          <RegionMapModal
            isOpen={true}
            topo={regionTopo}
            onClose={() => {
              setSelectedRegion(null);
              setRegionTopo(null);
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
}