import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();

  useEffect(() => {
    // 1) 이미 kakao 객체가 있으면 바로 init
    if (window.kakao && window.kakao.maps) {
      initMap();
      return;
    }

    // 2) kakao 스크립트가 없으면 동적 삽입
    const script = document.createElement("script");
    script.src = `
      https://dapi.kakao.com/v2/maps/sdk.js
      ?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}
      &libraries=services
      &autoload=false
    `.replace(/\s+/g, "");
    script.async = true;
    document.head.appendChild(script);

    // 3) 스크립트 로드가 끝나면 initMap 실행
    script.onload = () => {
      window.kakao.maps.load(initMap);
    };

    // cleanup: 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initMap = () => {
    const container = document.getElementById("map")!;
    const options = {
      center: new window.kakao.maps.LatLng(37.5642135, 127.0016985),
      level: 3,
    };

    const mapInstance = new window.kakao.maps.Map(container, options);
    setMap(mapInstance);

    const markerInstance = new window.kakao.maps.Marker();
    setMarker(markerInstance);

    // 로드 즉시 내 위치 찍기
    getCurrentPosBtn(mapInstance, markerInstance);
  };

  const getCurrentPosBtn = (mapInstance: any, markerInstance: any) => {
    if (!mapInstance || !markerInstance) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => getPosSuccess(pos, mapInstance, markerInstance),
      () => alert("위치 정보를 가져오는데 실패했습니다."),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 2700 }
    );
  };

  const getPosSuccess = (
    pos: GeolocationPosition,
    mapInstance: any,
    markerInstance: any
  ) => {
    const currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude,
      pos.coords.longitude
    );
    mapInstance.panTo(currentPos);

    markerInstance.setMap(null);
    markerInstance.setPosition(currentPos);
    markerInstance.setMap(mapInstance);
  };

  return (
    <>
      <div
        id="map"
        style={{ width: "800px", height: "400px" }}
      ></div>
      <button onClick={() => getCurrentPosBtn(map, marker)}>
        내 위치 보기
      </button>
    </>
  );
}
