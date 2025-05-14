import { useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import * as d3 from 'd3';
import { feature } from 'topojson-client'; // topojson-client에서 feature 가져오기
import type { Topology, Objects } from 'topojson-specification';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface Props {
  isOpen: boolean;
  topo: Topology<Objects<GeoJsonProperties>> | null;
  onClose: () => void;
  width?: number;
  height?: number;
}

export default function RegionMapModal({
  isOpen,
  topo,
  onClose,
  width = 800,
  height = 600,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  console.log('Loaded topo1:', topo);
  console.log('object keys:', Object.keys(topo?.objects || {}));

  useEffect(() => {
    
      if (!isOpen || !topo || !containerRef.current) return;
    console.log('Loaded topo2:', topo);
    console.log('실제 그리기 이펙트가 한 번만 실행됩니다');

    // topojson → geojson
    const key = Object.keys(topo.objects)[0];
    const geo = feature(topo, topo.objects[key]) as FeatureCollection<Geometry, GeoJsonProperties>;
      console.log(geo); 
      
    // projection & path
    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([width, height], geo);
    const pathGen = d3.geoPath().projection(projection);

    // D3로 SVG 그리기
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
      .selectAll('path')
      .data(geo.features)
      .join('path')
      .attr('d', pathGen)
      .attr('fill', '#60A5FA')
      .attr('fill-opacity', 0.6)
      .attr('stroke', '#666')
      .attr('stroke-width', 0.5);
  }, [isOpen, topo, width, height]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg w-full max-w-[80vw] max-h-[80vh] overflow-auto">
          <div ref={containerRef} className="w-[800px] h-[600px]"/>
          <button
            className="text-sm text-gray-500 mb-2"
            onClick={onClose}
          >
            닫기
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
