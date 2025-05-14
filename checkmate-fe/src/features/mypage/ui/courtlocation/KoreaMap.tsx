// features/mypage/ui/courtlocation/KoreaMap.tsx
import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import koreaJson from '@assets/images/map/koreamap.simple.json';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { Courthouse } from '@/features/mypage';
import RegionMapModal from './RegionMapModal';

interface KoreaMapProps {
  courtCoords: Courthouse[];
}

// 시·도별 JSON 파일 이름 매핑
const regionFileMap: Record<string,string> = {
  '서울특별시':   'seoul',
  '부산광역시':   'Busan',
  '대구광역시':   'Daegu',
  '인천광역시':   'Incheon',
  '광주광역시':   'Gwangju',
  '대전광역시':   'Daejeon',
  '울산광역시':   'Ulsan',
  '세종특별자치시': 'sejong',
  '경기도':      'Gyeonggido',
  '강원':      'Gangwon',
  '충청북도':     'Chungbug',
  '충청남도':     'Chungnam',
  '전라북도':     'Jeonbuk',
  '전라남도':     'Jellanam-do',
  '경상북도':     'Gyeongsangbukdo',
  '경상남도':     'gyeongsangnamdo',
  '제주특별자치도':'jeju',
};

// Vite 전용: glob으로 한 번에 모든 region topojson 불러오기
const regionModules = import.meta.glob<{ default: Topology<Objects<GeoJsonProperties>> }>(
  '/src/assets/images/map/*.simple.json',
  { eager: true }
);
const regionMap: Record<string, Topology<Objects<GeoJsonProperties>>> = {};
for (const path in regionModules) {
  const m = path.match(/\/([\w-]+)\.simple\.json$/);
  if (m) regionMap[m[1]] = regionModules[path].default;
}

// 대한민국 전체 지도
const topology = koreaJson as unknown as Topology<Objects<GeoJsonProperties>>;
const mapGeo = feature(topology, topology.objects['koreamap']) as FeatureCollection<Geometry, GeoJsonProperties>;

const width = 800;
const height = 600;

export default function KoreaMap({ courtCoords }: KoreaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 선택된 시·도 키와 로드된 topojson
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionTopo, setRegionTopo] = useState<Topology<Objects<GeoJsonProperties>> | null>(null);

  // selectedRegion 변경 시 미리 로드한 regionMap에서 꺼내서 state 세팅
  useEffect(() => {
    if (!selectedRegion) return;
    const topo = regionMap[selectedRegion];
    if (topo) {
      setRegionTopo(topo);
    } else {
      console.warn(`${selectedRegion}에 해당하는 topojson이 없습니다.`);
    }
  }, [selectedRegion]);

  // 메인 projection & path (전체 지도)
  const projection = useMemo(
    () => d3.geoIdentity().reflectY(true).fitSize([width, height], mapGeo),
    []
  );
  const pathGen = useMemo(() => d3.geoPath().projection(projection), [projection]);
  const geoProj = useMemo(() => d3.geoMercator().fitSize([width, height], mapGeo), []);

  // D3로 전체 지도와 마커 렌더링
  useEffect(() => {
    if (!containerRef.current) return;
    const svg = d3
      .select(containerRef.current)
      .selectAll<SVGSVGElement, unknown>('svg')
      .data([null])
      .join('svg')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    svg
      .append('g')
      .attr('class', 'boundary')
      .selectAll('path')
      .data(mapGeo.features)
      .join('path')
      .attr('d', pathGen)
      .attr('fill', 'transparent')
      .style('pointer-events', 'all')
      .attr('stroke', '#666')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).attr('fill', '#60A5FA');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', 'transparent');
      })
      .on('click', (_, feat) => {
        const korName = (feat.properties as any).CTP_KOR_NM as string;
        const fileBase = regionFileMap[korName];
        if (!fileBase) {
          console.warn(`${korName}에 대한 JSON 파일 매핑이 없습니다.`);
          return;
        }
        setSelectedRegion(fileBase);
      });

    svg
      .append('g')
      .attr('class', 'markers')
      .selectAll('circle')
      .data(courtCoords)
      .join('circle')
      .attr('cx', d => geoProj([d.longitude, d.latitude])![0])
      .attr('cy', d => geoProj([d.longitude, d.latitude])![1])
      .attr('r', 4)
      .attr('fill', 'red');
  }, [courtCoords, pathGen, geoProj]);

  return (
    <>
      <div ref={containerRef} className="p-5 w-[800px] h-[600px]" />
      {selectedRegion && regionTopo && (
        <RegionMapModal
          isOpen={true}                         // 이미 조건부로 렌더링 중이므로 항상 true
          topo={regionTopo}
          onClose={() => {
            setSelectedRegion(null);
            setRegionTopo(null);
          }}
          width={width}
          height={height}
        />
     )}
    </>
  );
}
