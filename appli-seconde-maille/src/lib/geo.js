import { useEffect, useRef, useState } from 'react';
import { DEFAULT_POSITION } from '../data/places';

export function distanceM(a, b) {
  const R = 6371000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export function bearing(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const y = Math.sin(rad(b.lng - a.lng)) * Math.cos(rad(b.lat));
  const x = Math.cos(rad(a.lat)) * Math.sin(rad(b.lat)) - Math.sin(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.cos(rad(b.lng - a.lng));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
export const fmtDist = (m) =>
  m == null ? '—' : m < 1000 ? `${Math.max(10, Math.round(m / 10) * 10)} m` : `${(m / 1000).toFixed(m < 10000 ? 1 : 0).replace('.', ',')} km`;
export const fmtDur = (s) => {
  const min = Math.max(1, Math.round(s / 60));
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;
};
// estimation à pied (~4,8 km/h) quand on n'a pas encore l'itinéraire
export const walkMin = (m) => Math.max(1, Math.round(m / 80));

/**
 * Position de l'utilisateur.
 * status : idle | asking | granted | denied | unavailable | unsupported
 * Tant que la permission n'est pas accordée, on utilise une position par défaut (Lille-Centre).
 */
export function useGeolocation(enabled) {
  const [pos, setPos] = useState(DEFAULT_POSITION);
  const [status, setStatus] = useState('idle');
  const watchId = useRef(null);

  const start = () =>
    new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setStatus('unsupported');
        return resolve('unsupported');
      }
      setStatus('asking');
      navigator.geolocation.getCurrentPosition(
        (p) => {
          setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy, heading: p.coords.heading });
          setStatus('granted');
          watchId.current = navigator.geolocation.watchPosition(
            (q) => setPos({ lat: q.coords.latitude, lng: q.coords.longitude, accuracy: q.coords.accuracy, heading: q.coords.heading }),
            () => {},
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
          );
          resolve('granted');
        },
        (err) => {
          const s = err.code === 1 ? 'denied' : 'unavailable';
          setStatus(s);
          resolve(s);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    });

  useEffect(() => {
    if (enabled) start();
    return () => watchId.current != null && navigator.geolocation?.clearWatch(watchId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { pos, status, start, live: status === 'granted' };
}
