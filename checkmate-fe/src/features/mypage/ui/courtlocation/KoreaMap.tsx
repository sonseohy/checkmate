// features/mypage/ui/courtlocation/KoreaMap.tsx
import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import koreaJson from '@assets/images/map/koreamap.simple.json';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { Courthouse } from '@/features/mypage';
import RegionMapModal from './RegionMapModal';  // 모달 컴포넌트 import

//정적 임포트

interface KoreaMapProps {
  courtCoords: Courthouse[];
}

const regionFileMap: Record<string,string> = {
  '서울특별시':   'seoul',
  '부산광역시':   'Busan',
  '대구광역시':   'Daegu',
  '인천광역시':   'Incheon',
  '광주광역시':   'Gwanju',
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

const topology = koreaJson as unknown as Topology<Objects<GeoJsonProperties>>;
const mapGeo = feature(topology, topology.objects['koreamap']) as FeatureCollection<
  Geometry,
  GeoJsonProperties
>;

const width = 800;
const height = 600;

export default function KoreaMap({ courtCoords }: KoreaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1) 클릭된 시·도와 로드된 topojson 상태
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionTopo, setRegionTopo] = useState<Topology<Objects<GeoJsonProperties>> | null>(null);

  // 2) selectedRegion이 바뀔 때 동적 import
  useEffect(() => {
  if (!selectedRegion) return;
  
  const filePath = `/src/assets/images/map/${selectedRegion}.simple.json`; // 절대 경로로 수정
  
  import(filePath) // 절대 경로로 처리
    .then(mod => setRegionTopo(mod.default))
    .catch(console.error);
}, [selectedRegion]);

  // 3) 메인 projection & path
  const projection = useMemo(
    () =>
      d3
        .geoIdentity()
        .reflectY(true)
        .fitSize([width, height], mapGeo),
    []
  );
  const pathGen = useMemo(() => d3.geoPath().projection(projection), [projection]);
  const geoProj = useMemo(
    () => d3.geoMercator().fitSize([width, height], mapGeo),
    []
  );

  // 4) D3 그리기 (경계선에 click 추가)
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
        console.log('clicked props:', feat.properties);
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
      <div className="p-5" ref={containerRef} />

      {/* 5) 모달 컴포넌트 */}
      <RegionMapModal
        isOpen={!!selectedRegion && !!regionTopo}
        topo={regionTopo}
        onClose={() => {
          setSelectedRegion(null);
          setRegionTopo(null);
        }}
        width={width}
        height={height}
      />
    </>
  );
}
