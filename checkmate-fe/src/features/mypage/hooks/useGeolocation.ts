import { setLocation } from '@/features/auth/slices/authSlice';
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CACHE_KEY = "geo_cache";
const CACHE_EXPIRE = 1000 * 60 * 60; // 1시간(원하면 24*60*60*1000)

//사용자 위치 훅
export function useGeolocation() {
  const dispatch = useDispatch();

  useEffect(() => {
    const cacheStr = localStorage.getItem(CACHE_KEY);
    if (cacheStr) {
      const cache = JSON.parse(cacheStr);
      if (Date.now() - cache.timestamp < CACHE_EXPIRE) {
        dispatch(setLocation({ lat: cache.latitude, lng: cache.longitude }));
        return;
      }
    }

    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        dispatch(setLocation({ lat, lng }));
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            latitude: lat,
            longitude: lng,
            timestamp: Date.now(),
          })
        );
      },
      () => {
        dispatch(setLocation(null));
      },
      { enableHighAccuracy: true }
    );
  }, [dispatch]);
}
