declare module '*.json' {
  import type { Topology, Objects } from 'topojson-specification';
  import type { GeoJsonProperties } from 'geojson';
  const value: Topology<Objects<GeoJsonProperties>>;
  export default value;
}
