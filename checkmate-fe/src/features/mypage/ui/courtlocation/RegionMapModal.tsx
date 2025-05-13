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

  useEffect(() => {
    if (!topo || !containerRef.current) return;
      console.log('Loaded topo:', topo);
    // topojson → geojson
    const key = Object.keys(topo.objects)[0];
     if (!key) {
    console.warn('No key found in topo.objects');
    return;
  }
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
      .attr('fill', '#ddd')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5);
  }, [topo, width, height]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg w-full max-w-[80vw] max-h-[80vh] overflow-auto">
          <button
            className="text-sm text-gray-500 mb-2"
            onClick={onClose}
          >
            닫기
          </button>
          <div ref={containerRef} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
