import React, { useEffect, useRef, useState } from 'react';
import { Navigation, MapPin, Footprints, Bike, Car, TrainFront, Bus, ParkingCircle, Copy, Check, ArrowUpRight, LocateFixed, Loader2 } from 'lucide-react';
import { EVENT } from '../data/siteContent';

/*
  Plan de localisation réel
  - Carte : Leaflet + OpenStreetMap (chargés à la demande depuis unpkg)
  - Position : API Geolocation du navigateur -> demande l'autorisation
  - Itinéraires : serveur de routage OSRM d'OpenStreetMap (FOSSGIS)
*/

const DEST = { lat: EVENT.lat, lng: EVENT.lng };
const BRAND_BLUE = '#18407f';
const LEAFLET_VERSION = '1.9.4';
const MASCOT = `${import.meta.env?.BASE_URL ?? '/'}brand/vaquita-mascotte.png`;

let leafletPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    js.async = true;
    const timer = setTimeout(() => reject(new Error('timeout')), 10000);
    js.onload = () => {
      clearTimeout(timer);
      window.L ? resolve(window.L) : reject(new Error('leaflet'));
    };
    js.onerror = () => {
      clearTimeout(timer);
      leafletPromise = null;
      reject(new Error('leaflet'));
    };
    document.head.appendChild(js);
  });
  return leafletPromise;
}

/* Distance à vol d'oiseau (m) */
function haversine(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const fmtDist = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(m < 10000 ? 1 : 0).replace('.', ',')} km`);
const fmtDur = (s) => {
  const min = Math.max(1, Math.round(s / 60));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h} h ${String(min % 60).padStart(2, '0')}`;
};

const MODES = [
  { id: 'foot', label: 'À pied', icon: Footprints, gmaps: 'walking' },
  { id: 'bike', label: 'À vélo', icon: Bike, gmaps: 'bicycling' },
  { id: 'car', label: 'En voiture', icon: Car, gmaps: 'driving' }
];

async function fetchRoute(profile, from) {
  const url = `https://routing.openstreetmap.de/routed-${profile}/route/v1/driving/${from.lng},${from.lat};${DEST.lng},${DEST.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('route');
  const data = await res.json();
  const r = data.routes?.[0];
  if (!r) throw new Error('route');
  return { distance: r.distance, duration: r.duration, geometry: r.geometry };
}

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
async function fetchNearby() {
  const { lat, lng } = DEST;
  const q = `[out:json][timeout:20];(
    node(around:900,${lat},${lng})[railway~"^(station|halt|tram_stop)$"];
    node(around:900,${lat},${lng})[station=subway];
    node(around:450,${lat},${lng})[highway=bus_stop];
    node(around:900,${lat},${lng})[amenity=bicycle_rental];
    node(around:600,${lat},${lng})[amenity=parking];
    way(around:600,${lat},${lng})[amenity=parking];
  );out center tags;`;
  let lastErr;
  for (const ep of OVERPASS) {
    try {
      const res = await fetch(ep, { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      if (!res.ok) throw new Error('overpass');
      const data = await res.json();
      const groups = { transit: [], bus: [], bike: [], parking: [] };
      const seen = new Set();
      for (const el of data.elements || []) {
        const t = el.tags || {};
        const pos = { lat: el.lat ?? el.center?.lat, lng: el.lon ?? el.center?.lon };
        if (pos.lat == null) continue;
        let cat = null;
        if (t.amenity === 'bicycle_rental') cat = 'bike';
        else if (t.amenity === 'parking') cat = 'parking';
        else if (t.highway === 'bus_stop') cat = 'bus';
        else cat = 'transit';
        const name =
          t.name ||
          (cat === 'parking' ? 'Parking' : cat === 'bike' ? 'Station vélos' : cat === 'bus' ? 'Arrêt de bus' : 'Station');
        const key = `${cat}:${name}`;
        if (seen.has(key)) continue;
        seen.add(key);
        let detail = '';
        if (cat === 'transit') detail = t.station === 'subway' || t.subway === 'yes' ? 'Métro' : t.railway === 'tram_stop' || t.tram === 'yes' ? 'Tram' : 'Gare';
        if (cat === 'bus') detail = t.route_ref ? `Lignes ${t.route_ref.replace(/;/g, ', ')}` : 'Bus';
        if (cat === 'bike') detail = t.network || t.operator || 'Vélos en libre-service';
        if (cat === 'parking') detail = [t.access === 'private' ? 'Privé' : null, t.fee === 'yes' ? 'Payant' : t.fee === 'no' ? 'Gratuit' : null, t.capacity ? `${t.capacity} places` : null].filter(Boolean).join(' · ') || 'Parking';
        if (cat === 'parking' && t.access === 'private') continue;
        groups[cat].push({ name, detail, ...pos, dist: haversine(DEST, pos) });
      }
      Object.keys(groups).forEach((k) => groups[k].sort((a, b) => a.dist - b.dist).splice(3));
      return groups;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export default function LocationMap() {
  const mapEl = useRef(null);
  const map = useRef(null);
  const layers = useRef({});
  const [mapState, setMapState] = useState('loading'); // loading | ready | fallback
  const [geo, setGeo] = useState('idle'); // idle | locating | ok | denied | unavailable | timeout | unsupported | insecure
  const [me, setMe] = useState(null);
  const [routes, setRoutes] = useState({});
  const [routeErr, setRouteErr] = useState(false);
  const [mode, setMode] = useState('foot');
  const [nearby, setNearby] = useState(null);
  const [nearbyState, setNearbyState] = useState('loading');
  const [copied, setCopied] = useState(false);

  /* Carte */
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapEl.current || map.current) return;
        const m = L.map(mapEl.current, { scrollWheelZoom: false, zoomControl: true }).setView([DEST.lat, DEST.lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(m);
        const icon = L.divIcon({ className: '', html: `<div class="sm-pin"><img src="${MASCOT}" alt=""></div>`, iconSize: [58, 58], iconAnchor: [29, 50] });
        L.marker([DEST.lat, DEST.lng], { icon, title: 'Pop-Up Seconde Maille', keyboard: true })
          .addTo(m)
          .bindPopup(`<strong>Pop-Up Seconde Maille</strong><br>${EVENT.address}<br>${EVENT.dateLabel}`);
        // réactive le zoom molette au clic (évite de "piéger" le scroll de la page)
        m.on('click', () => m.scrollWheelZoom.enable());
        m.on('mouseout', () => m.scrollWheelZoom.disable());
        map.current = m;
        setMapState('ready');
      })
      .catch(() => !cancelled && setMapState('fallback'));
    return () => {
      cancelled = true;
      map.current?.remove();
      map.current = null;
    };
  }, []);

  /* À proximité (données OSM réelles) */
  useEffect(() => {
    let cancelled = false;
    fetchNearby()
      .then((g) => {
        if (cancelled) return;
        setNearby(g);
        setNearbyState('ready');
      })
      .catch(() => !cancelled && setNearbyState('error'));
    return () => {
      cancelled = true;
    };
  }, []);

  /* Points de proximité sur la carte */
  useEffect(() => {
    const L = window.L;
    if (!L || !map.current || !nearby) return;
    layers.current.nearby?.remove();
    const g = L.layerGroup();
    const colors = { transit: BRAND_BLUE, bus: '#18407f', bike: '#115E59', parking: '#0F2926' };
    Object.entries(nearby).forEach(([cat, items]) =>
      items.forEach((it) =>
        L.circleMarker([it.lat, it.lng], { radius: 7, color: '#fff', weight: 2, fillColor: colors[cat], fillOpacity: 1 })
          .bindTooltip(`${it.name} — ${it.detail}`)
          .addTo(g)
      )
    );
    g.addTo(map.current);
    layers.current.nearby = g;
  }, [nearby, mapState]);

  /* Tracé de l'itinéraire choisi */
  useEffect(() => {
    const L = window.L;
    if (!L || !map.current) return;
    layers.current.route?.remove();
    layers.current.me?.remove();
    if (!me) return;
    layers.current.me = L.marker([me.lat, me.lng], {
      icon: L.divIcon({ className: '', html: '<div class="me-pin"></div>', iconSize: [20, 20], iconAnchor: [10, 10] }),
      title: 'Votre position'
    }).addTo(map.current);
    const r = routes[mode];
    if (r?.geometry) {
      layers.current.route = L.geoJSON(r.geometry, { style: { color: BRAND_BLUE, weight: 5, opacity: 0.85, dashArray: mode === 'foot' ? '2 9' : null, lineCap: 'round' } }).addTo(map.current);
      map.current.fitBounds(layers.current.route.getBounds(), { padding: [40, 40] });
    } else {
      map.current.fitBounds(L.latLngBounds([me.lat, me.lng], [DEST.lat, DEST.lng]), { padding: [50, 50] });
    }
  }, [me, routes, mode, mapState]);

  const locate = () => {
    if (!('geolocation' in navigator)) return setGeo('unsupported');
    if (!window.isSecureContext) return setGeo('insecure');
    setGeo('locating');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setMe(p);
        setGeo('ok');
        setRouteErr(false);
        const entries = await Promise.allSettled(MODES.map((m) => fetchRoute(m.id, p)));
        const next = {};
        entries.forEach((e, i) => e.status === 'fulfilled' && (next[MODES[i].id] = e.value));
        if (!Object.keys(next).length) setRouteErr(true);
        setRoutes(next);
      },
      (err) => setGeo(err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EVENT.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const destParam = encodeURIComponent(EVENT.address);
  const origin = me ? `&origin=${me.lat},${me.lng}` : '';
  const gmaps = (travelmode) => `https://www.google.com/maps/dir/?api=1&destination=${destParam}${origin}&travelmode=${travelmode}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${DEST.lat}&mlon=${DEST.lng}#map=17/${DEST.lat}/${DEST.lng}`;
  const crow = me ? haversine(me, DEST) : null;

  const geoMessage = {
    denied: 'Accès à la position refusé. Vous pouvez l’autoriser dans les réglages du navigateur (icône à gauche de l’adresse du site), puis réessayer.',
    unavailable: 'Position introuvable pour le moment. Vérifiez que la localisation de l’appareil est activée.',
    timeout: 'La localisation a pris trop de temps. Réessayez, de préférence à l’extérieur ou en Wi-Fi.',
    unsupported: 'Votre navigateur ne permet pas la géolocalisation.',
    insecure: 'La géolocalisation nécessite une connexion sécurisée (https).'
  }[geo];

  const NEARBY_GROUPS = [
    { id: 'transit', label: 'Métro · tram · gare', icon: TrainFront },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'bike', label: 'Vélos en libre-service', icon: Bike },
    { id: 'parking', label: 'Parkings', icon: ParkingCircle }
  ];

  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
      {/* Carte */}
      <div className="lg:col-span-7">
        <div className="map-shell h-[320px] sm:h-[420px] lg:h-full lg:min-h-[520px] rounded-[28px] overflow-hidden border border-white/10 bg-[#e3f5ec]">
          {mapState !== 'fallback' ? (
            <div ref={mapEl} className="w-full h-full" role="region" aria-label={`Carte interactive : ${EVENT.address}`} />
          ) : (
            <iframe
              title={`Carte : ${EVENT.address}`}
              className="w-full h-full border-0"
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${DEST.lng - 0.008},${DEST.lat - 0.004},${DEST.lng + 0.008},${DEST.lat + 0.004}&layer=mapnik&marker=${DEST.lat},${DEST.lng}`}
            />
          )}
          {mapState === 'loading' && (
            <div className="absolute inset-0 grid place-items-center text-[#0F2926] text-sm font-bold pointer-events-none">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Chargement de la carte…
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Panneau */}
      <div className="lg:col-span-5 space-y-5 min-w-0">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#a5d2b2]">Adresse</p>
          <p className="font-display uppercase text-[clamp(26px,3vw,38px)] leading-[0.95] mt-2">{EVENT.street}</p>
          <p className="text-white/70 font-semibold">{EVENT.city}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={copy} className="px-3.5 py-2 rounded-full border border-white/25 text-xs font-bold hover:bg-white hover:text-[#0F2926] transition-colors inline-flex items-center gap-1.5">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Adresse copiée' : 'Copier l’adresse'}
            </button>
            <a href={osmLink} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-full border border-white/25 text-xs font-bold hover:bg-white hover:text-[#0F2926] transition-colors inline-flex items-center gap-1.5">
              OpenStreetMap <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Itinéraire depuis ma position */}
        <div className="p-5 rounded-[24px] bg-white/[0.06] border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-extrabold">Itinéraire depuis votre position</p>
            {geo !== 'ok' && (
              <button onClick={locate} disabled={geo === 'locating'} className="btn btn-aqua btn-sm disabled:opacity-70">
                {geo === 'locating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                {geo === 'locating' ? 'Localisation…' : 'Me localiser'}
              </button>
            )}
          </div>

          {geo === 'idle' && (
            <p className="text-xs text-white/60 leading-relaxed mt-3">
              Votre navigateur vous demandera l’autorisation. Votre position n’est pas enregistrée : elle sert uniquement à calculer le trajet avec le service
              d’itinéraire d’OpenStreetMap.
            </p>
          )}
          {geoMessage && (
            <p role="alert" className="text-xs text-[#a5d2b2] leading-relaxed mt-3">
              {geoMessage}
            </p>
          )}

          {geo === 'ok' && (
            <div className="mt-4 space-y-4" aria-live="polite">
              <p className="text-xs text-white/60">
                Vous êtes à <strong className="text-white">{fmtDist(crow)}</strong> à vol d’oiseau
                {me.accuracy > 200 ? ` (précision ± ${fmtDist(me.accuracy)})` : ''}.
              </p>
              <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Mode de déplacement">
                {MODES.map((m) => {
                  const Icon = m.icon;
                  const r = routes[m.id];
                  const on = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      role="tab"
                      aria-selected={on}
                      onClick={() => setMode(m.id)}
                      className={`p-3 rounded-2xl text-left border transition-all duration-300 min-w-0 ${on ? 'bg-[#a5d2b2] text-[#0F2926] border-[#a5d2b2]' : 'border-white/15 hover:border-white/40'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="block text-[11px] font-bold mt-1.5 opacity-80">{m.label}</span>
                      <span className="block font-display text-xl leading-tight truncate">{r ? fmtDur(r.duration) : '—'}</span>
                      <span className="block text-[11px] opacity-70 truncate">{r ? fmtDist(r.distance) : routeErr ? 'indisponible' : '…'}</span>
                    </button>
                  );
                })}
              </div>
              {routeErr && <p className="text-xs text-[#a5d2b2]">Le calcul d’itinéraire est momentanément indisponible ; utilisez les liens ci-dessous.</p>}
              <div className="flex flex-wrap gap-2">
                <a href={gmaps(MODES.find((m) => m.id === mode).gmaps)} target="_blank" rel="noreferrer" className="btn btn-aqua btn-sm">
                  <Navigation className="w-3.5 h-3.5" /> Lancer le guidage
                </a>
                <a href={gmaps('transit')} target="_blank" rel="noreferrer" className="btn btn-sm border border-white/25 text-white hover:bg-white/10">
                  <TrainFront className="w-3.5 h-3.5" /> En transports
                </a>
              </div>
            </div>
          )}
          {geo !== 'ok' && (
            <div className="flex flex-wrap gap-2 mt-4">
              <a href={gmaps('transit')} target="_blank" rel="noreferrer" className="text-xs font-bold text-white/80 link-line inline-flex items-center gap-1">
                Itinéraire en transports <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* À proximité */}
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#a5d2b2] flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> À proximité du lieu
          </p>
          {nearbyState === 'loading' && <p className="text-xs text-white/60 mt-3">Recherche des arrêts et stations autour…</p>}
          {nearbyState === 'error' && <p className="text-xs text-white/60 mt-3">Informations de proximité indisponibles pour le moment.</p>}
          {nearbyState === 'ready' && (
            <ul className="mt-3 divide-y divide-white/10">
              {NEARBY_GROUPS.filter((g) => nearby[g.id]?.length).map((g) => {
                const Icon = g.icon;
                return (
                  <li key={g.id} className="py-3 flex gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 grid place-items-center shrink-0">
                      <Icon className="w-4 h-4 text-[#a5d2b2]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">{g.label}</p>
                      {nearby[g.id].map((it) => (
                        <p key={it.name + it.lat} className="text-sm flex justify-between gap-3">
                          <span className="truncate">
                            <strong>{it.name}</strong> <span className="text-white/55">· {it.detail}</span>
                          </span>
                          <span className="text-white/60 shrink-0 tabular-nums">{fmtDist(it.dist)}</span>
                        </p>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="text-[10px] text-white/40 mt-2">Données © contributeurs OpenStreetMap, distances à vol d’oiseau depuis le lieu.</p>
        </div>
      </div>
    </div>
  );
}
