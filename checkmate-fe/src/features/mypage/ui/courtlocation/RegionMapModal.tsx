import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface Props {
  isOpen: boolean;
  topo: Topology<Objects<GeoJsonProperties>> | null;
  onClose: () => void;
  width?: number;
  height?: number;
}
const width = 600;
const height = 400;

export default function RegionMapModal({
  isOpen,
  topo,
}: Props) {
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
  if (!isOpen || !topo) return;
  const t = setTimeout(() => {
    if (!containerRef.current) return;

    const key = Object.keys(topo.objects)[0];
    const geo = feature(topo, topo.objects[key]) as FeatureCollection<Geometry, GeoJsonProperties>;

    const leftMargin = 0; // 또는 원하는 만큼
const topMargin = 0;  // 필요하면
const projection = d3
  .geoIdentity()
  .reflectY(true)
  .fitExtent(
    [
      [leftMargin, topMargin],
      [width, height],
    ],
    geo
  );
    const pathGen = d3.geoPath().projection(projection);

    const svg = d3.select(containerRef.current);
    svg.selectAll('*').remove();

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#fff');

    // Draw regions
    svg
      .append('g')
      .selectAll('path')
      .data(geo.features)
      .join('path')
      .attr('d', pathGen)
      .attr('fill', '#fff')
      .attr('fill-opacity', 0.6)
      .attr('stroke', '#666')
      .attr('stroke-width', 0.5);

    // Draw labels (구/군 이름)
    svg
      .append('g')
      .selectAll('text')
      .data(geo.features)
      .join('text')
      .attr('x', d => pathGen.centroid(d)[0])
      .attr('y', d => pathGen.centroid(d)[1])
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('font-size', 10)
      .attr('font-weight', 400)
      .attr('fill', '#202020')
      .attr('pointer-events', 'none')
      .text(d => (d.properties?.SIG_KOR_NM || d.properties?.name || '')); // GeoJSON 속성에 맞게!
  }, 0);
  return () => clearTimeout(t);
}, [isOpen, topo]);

  return (
    <div className="py-4">
      <svg ref={containerRef} width={width} height={height} />
    </div>
  );
}
