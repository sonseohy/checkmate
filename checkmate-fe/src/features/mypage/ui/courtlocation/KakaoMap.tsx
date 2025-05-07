import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const [map, setMap] = useState<any>();
  const [marker, setMarker] = useState<any>();

  // 1) 카카오맵 불러오기
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5642135, 127.0016985),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);

      const markerInstance = new window.kakao.maps.Marker();
      setMarker(markerInstance);

      // 지도 로드 시 위치 확인
      getCurrentPosBtn(mapInstance, markerInstance);
    });
  }, []);

  const getCurrentPosBtn = (mapInstance: any, markerInstance: any) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => getPosSuccess(pos, mapInstance, markerInstance),
      () => alert("위치 정보를 가져오는데 실패했습니다."),
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 2700,
      }
    );
  };

  const getPosSuccess = (pos: GeolocationPosition, mapInstance: any, markerInstance: any) => {
    const currentPos = new window.kakao.maps.LatLng(
      pos.coords.latitude, // 위도
      pos.coords.longitude // 경도
    );

    // 지도 이동
    mapInstance.panTo(currentPos);
    // 새로운 마커 삽입
    markerInstance.setMap(null); // 기존 마커 제거
    markerInstance.setPosition(currentPos); // 새로운 위치로 설정
    markerInstance.setMap(mapInstance);
  };

  return (
    <>
      <div
        id="map"
        style={{
          width: "800px",
          height: "400px",
        }}
      ></div>
      <div onClick={() => getCurrentPosBtn(map, marker)}></div>
    </>
  );
}
