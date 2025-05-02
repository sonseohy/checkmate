import { useEffect} from "react";

declare global {
    interface Window {
      kakao: any; 
    }
  }
  
export default function KakaoMap() {
    useEffect(() => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map')!;
          new window.kakao.maps.Map(container, {
            center: new window.kakao.maps.LatLng(37.413294, 127.0016985),
            level: 10,
          });
        });
      }, []);
    
      return (
        <>
          <div
            id="map"
            style={{
              width: '800px',
              height: '400px',
            }}
          ></div>
        </>
      );
    };