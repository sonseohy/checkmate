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

// **eager: true 제거**
const regionModules = import.meta.glob<{ default: Topology<Objects<GeoJsonProperties>> }>(
  '/src/assets/images/map/*.json'
);

// 대한민국 전체 지도 데이터
const topology = koreaJson as unknown as Topology<Objects<GeoJsonProperties>>;
const mapGeo = feature(topology, topology.objects['koreamap']) as FeatureCollection<Geometry, GeoJsonProperties>;

const width = 700;
const height = 550;

interface KoreaMapProps {
  onRegionSelect: (regionName: string | null) => void;
  selectedRegion: string | null;
}

export default function KoreaMap({
  onRegionSelect,
  selectedRegion,
}: KoreaMapProps) {
  const location = useSelector((state: RootState) => state.auth.location);
  const [regionTopo, setRegionTopo] = useState<Topology<Objects<GeoJsonProperties>> | null>(null);

  // projection & path (전체 지도)
  const projection = useMemo(
    () => d3.geoIdentity().reflectY(true).fitSize([width, height], mapGeo),
    []
  );
  const pathGen = useMemo(() => d3.geoPath().projection(projection), [projection]);

  // 지도 path 생성
  const paths = useMemo(() => {
    return mapGeo.features.map((feat, i) => {
      const korName = (feat.properties as any).CTP_KOR_NM as string;
      const fileBase = regionFileMap[korName];
      const isActive = korName === selectedRegion;

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
            onRegionSelect(korName);
          }}
        />
      );
    });
  }, [pathGen, selectedRegion, onRegionSelect]);

  // 선택된 region에 따라 regionTopo 비동기 import로 세팅
  useEffect(() => {
    if (!selectedRegion) {
      setRegionTopo(null);
      return;
    }
    const fileBase = regionFileMap[selectedRegion];
    const importer = regionModules[`/src/assets/images/map/${fileBase}.json`];
    if (importer) {
      importer().then(m => setRegionTopo(m.default));
    } else {
      setRegionTopo(null);
    }
  }, [selectedRegion]);

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
    <div>
      <div>
        선택 드롭다운 영역
      </div>
      <div className='flex flex-row justify-start '>
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
                onRegionSelect(null);
                setRegionTopo(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
