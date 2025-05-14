// src/types/topojson.d.ts
declare module '*.simple.json' {
  import type { Topology, Objects } from 'topojson-specification';
  import type { GeoJsonProperties } from 'geojson';
  const value: Topology<Objects<GeoJsonProperties>>;
  export default value;
}
