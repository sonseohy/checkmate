// features/mypage/ui/courtlocation/KoreaMap.tsx
import * as d3 from 'd3';
import koreaJson from '@assets/images/map/koreamap.simple.json';
import { feature } from 'topojson-client';
import { useEffect, useRef, useMemo } from 'react';
import { CourtWithCoords } from '@/features/mypage';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface KoreaMapProps {
  courtCoords: CourtWithCoords[];
}

const topology = koreaJson as unknown as Topology<Objects<GeoJsonProperties>>;
const mapGeo = feature(topology, topology.objects['koreamap']) as FeatureCollection<
  Geometry,
  GeoJsonProperties
>;

const width = 800;
const height = 600;

export default function KoreaMap({ courtCoords }: KoreaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  console.log('위도/경도:', courtCoords)
  
  // 1) projection & path 메모이제이션
  //    geoIdentity 로 planar 좌표계 → 화면 맞춤 transform 계산
  const projection = useMemo(() => 
    d3.geoIdentity()
      .reflectY(true)
      .fitSize([width, height], mapGeo),
    []
  );
  const path = useMemo(() => d3.geoPath().projection(projection), [projection]);

  const geoProj = useMemo(() =>
      d3
        .geoMercator()
        .fitSize([width, height], mapGeo),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const svg = d3
      .select(containerRef.current)
      .selectAll<SVGSVGElement, unknown>('svg')
      .data([null])
      .join('svg')
      .attr('width', width)
      .attr('height', height);

    // 기존 내용 초기화
    svg.selectAll('*').remove();

    //지형 경계선
    svg
      .append('g')
      .attr('class', 'boundary')
      .selectAll('path')
      .data(mapGeo.features)
      .join('path')
      .attr('d', path)
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
      });
  
      // 마커 그리기
    svg
    .append('g')
    .attr('class', 'markers')
    .selectAll('circle')
    .data(courtCoords)
    .join('circle')
    .attr('cx', d => geoProj([d.lng, d.lat])![0])
    .attr('cy', d => geoProj([d.lng, d.lat])![1])
    .attr('r', 4)
    .attr('fill', 'red');
}, [courtCoords, path, geoProj]);
  

  return <div ref={containerRef} />;
}
