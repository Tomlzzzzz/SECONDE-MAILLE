import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MASCOT = '/brand/vaquita-mascotte.png';

const boxIcon = (selected, fill) =>
  L.divIcon({
    className: '',
    html: `<div class="pin-box ${selected ? 'is-sel' : ''}"><span class="pin-fill" style="--f:${Math.round(fill * 100)}%"></span><svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 9h16v11H4zM3 5h18v4H3zM9 13h6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg></div>`,
    iconSize: [40, 48],
    iconAnchor: [20, 46]
  });
const popupIcon = (selected) =>
  L.divIcon({
    className: '',
    html: `<div class="pin-popup ${selected ? 'is-sel' : ''}"><img src="${MASCOT}" alt=""></div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 50]
  });
const meIcon = (approx) =>
  L.divIcon({ className: '', html: `<div class="pin-me ${approx ? 'is-approx' : ''}"></div>`, iconSize: [22, 22], iconAnchor: [11, 11] });

/**
 * Carte Leaflet (fond OpenStreetMap) — places, position de l'utilisateur, tracé d'itinéraire.
 * fit : 'places' | 'route' | 'me'
 */
export default function MapView({ places = [], me, selectedId, onSelect, route, fit = 'places', className = '', focusKey }) {
  const el = useRef(null);
  const map = useRef(null);
  const layers = useRef({});
  const fitted = useRef(null);

  useEffect(() => {
    const m = L.map(el.current, { zoomControl: false, attributionControl: true }).setView([50.645, 3.1], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(m);
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      m.remove();
    };
  }, []);

  // lieux
  useEffect(() => {
    const m = map.current;
    layers.current.places?.remove();
    const g = L.layerGroup();
    places.forEach((p) => {
      const mk = L.marker([p.lat, p.lng], {
        icon: p.type === 'popup' ? popupIcon(p.id === selectedId) : boxIcon(p.id === selectedId, p.fill ?? 0),
        zIndexOffset: p.id === selectedId ? 1000 : p.type === 'popup' ? 500 : 0,
        keyboard: true,
        title: p.name
      });
      if (onSelect) mk.on('click', () => onSelect(p.id));
      mk.addTo(g);
    });
    g.addTo(m);
    layers.current.places = g;
  }, [places, selectedId, onSelect]);

  // moi
  useEffect(() => {
    const m = map.current;
    if (!me) return;
    if (!layers.current.me) layers.current.me = L.marker([me.lat, me.lng], { icon: meIcon(me.approximate), interactive: false, zIndexOffset: 2000 }).addTo(m);
    else {
      layers.current.me.setLatLng([me.lat, me.lng]);
      layers.current.me.setIcon(meIcon(me.approximate));
    }
  }, [me?.lat, me?.lng, me?.approximate]);

  // itinéraire
  useEffect(() => {
    const m = map.current;
    layers.current.route?.remove();
    if (!route?.coords?.length) return;
    const g = L.layerGroup([
      L.polyline(route.coords, { color: '#ffffff', weight: 9, opacity: 0.9, lineCap: 'round' }),
      L.polyline(route.coords, { color: '#194080', weight: 5, opacity: 1, lineCap: 'round', dashArray: route.mode === 'foot' ? '1 10' : null })
    ]).addTo(m);
    layers.current.route = g;
  }, [route]);

  // cadrage
  useEffect(() => {
    const m = map.current;
    const key = `${fit}|${focusKey ?? ''}|${route ? route.coords.length : 0}`;
    if (fitted.current === key) return;
    let b;
    if (fit === 'route' && route?.coords?.length) b = L.latLngBounds(route.coords);
    else if (fit === 'focus' && focusKey) {
      const p = places.find((x) => x.id === focusKey);
      if (p) {
        m.flyTo([p.lat - 0.0012, p.lng], 16, { duration: 0.8 });
        fitted.current = key;
        return;
      }
    } else {
      const pts = places.filter((p) => p.type === 'box' && p.area !== 'Roubaix').map((p) => [p.lat, p.lng]);
      if (me && !me.approximate) pts.push([me.lat, me.lng]);
      if (pts.length) b = L.latLngBounds(pts);
    }
    if (b) {
      m.fitBounds(b, { padding: [50, 50], maxZoom: 16 });
      fitted.current = key;
    }
  }, [fit, route, focusKey, places, me]);

  return <div ref={el} className={`map ${className}`} role="region" aria-label="Carte" />;
}
