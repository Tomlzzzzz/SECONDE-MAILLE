import { useEffect, useRef, useState } from 'react';
import { STOCK_URL, STOCK_REFRESH_MS } from '../../data/shop';

/*
  Stock en direct : relit /stock.json toutes les 15 s (et au retour sur l'onglet).
  Pour brancher une vraie source plus tard (Google Sheet publié, API...),
  il suffit de changer STOCK_URL dans src/data/shop.js : même format JSON.
*/
export default function useLiveStock() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | live | offline
  const [checkedAt, setCheckedAt] = useState(null);
  const [changed, setChanged] = useState({}); // clés modifiées au dernier relevé (pour l'animation)
  const prev = useRef(null);

  useEffect(() => {
    let alive = true;
    let timer;
    const load = async () => {
      try {
        const res = await fetch(`${STOCK_URL}?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('stock');
        const json = await res.json();
        if (!alive) return;
        if (prev.current) {
          const diff = {};
          Object.entries(json.merch || {}).forEach(([k, sizes]) =>
            Object.entries(sizes).forEach(([s, q]) => {
              if (prev.current.merch?.[k]?.[s] !== q) diff[`${k}:${s}`] = true;
            })
          );
          if (json.starterPack?.remaining !== prev.current.starterPack?.remaining) diff.starterPack = true;
          setChanged(diff);
        }
        prev.current = json;
        setData(json);
        setStatus('live');
        setCheckedAt(Date.now());
      } catch {
        if (alive) setStatus((s) => (s === 'loading' ? 'offline' : s === 'live' ? 'offline' : s));
      }
    };
    load();
    timer = setInterval(load, STOCK_REFRESH_MS);
    const onVis = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return { data, status, checkedAt, changed };
}

/* "il y a 12 s" qui se met à jour tout seul */
export function useAgo(ts) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);
  if (!ts) return '';
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 5) return 'à l’instant';
  if (s < 60) return `il y a ${s} s`;
  return `il y a ${Math.round(s / 60)} min`;
}
