// kakao.d.ts
declare global {
  interface Window {
    kakao: typeof kakao;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace kakao {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      getLat(): number;
      getLng(): number;
    }
    interface MapOptions {
      center: LatLng;
      level: number;
    }
    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      panTo(latlng: LatLng): void;
    }
    class Marker {
      constructor(options?: { position?: LatLng; map?: Map });
      setMap(map: Map | null): void;
      setPosition(position: LatLng): void;
    }
  }
}

export {};
