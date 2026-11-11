import React, { useEffect, useMemo, useState } from 'react';
import { Footprints, Bike, ArrowUp, CornerUpLeft, CornerUpRight, ArrowUpLeft, ArrowUpRight, RotateCcw, Flag, CircleDot, RefreshCw, Loader2, ExternalLink, ScanLine, Play, Square } from 'lucide-react';
import MapView from '../components/MapView';
import { TopBar } from '../components/ui';
import { useStore } from '../state/store';
import { useNav } from '../App';
import { placeById } from '../data/places';
import { fetchRoute } from '../lib/route';
import { distanceM, fmtDist, fmtDur, bearing } from '../lib/geo';

function StepIcon({ type, modifier }) {
  const c = 'w-5 h-5';
  if (type === 'arrive') return <Flag className={c} />;
  if (type === 'depart') return <CircleDot className={c} />;
  if (type === 'roundabout' || type === 'rotary') return <RefreshCw className={c} />;
  switch (modifier) {
    case 'left':
    case 'sharp left':
      return <CornerUpLeft className={c} />;
    case 'right':
    case 'sharp right':
      return <CornerUpRight className={c} />;
    case 'slight left':
      return <ArrowUpLeft className={c} />;
    case 'slight right':
      return <ArrowUpRight className={c} />;
    case 'uturn':
      return <RotateCcw className={c} />;
    default:
      return <ArrowUp className={c} />;
  }
}

export default function RouteScreen({ placeId }) {
  const { geo } = useStore();
  const { pop, goTab } = useNav();
  const place = placeById(placeId);
  const [mode, setMode] = useState('foot');
  const [route, setRoute] = useState(null);
  const [state, setState] = useState('loading'); // loading | ok | error
  const [guiding, setGuiding] = useState(false);
  const me = geo.live ? geo.pos : { ...geo.pos, approximate: true };
  const [origin] = useState(me); // on calcule depuis la position au moment de l'ouverture

  useEffect(() => {
    let alive = true;
    setState('loading');
    fetchRoute(origin, place, mode)
      .then((r) => alive && (setRoute({ ...r, mode }), setState('ok')))
      .catch(() => alive && setState('error'));
    return () => {
      alive = false;
    };
  }, [mode, placeId]);

  // étape en cours = la prochaine manœuvre la plus proche devant nous
  const cur = useMemo(() => {
    if (!route) return 0;
    let best = 0;
    let bestD = Infinity;
    route.steps.forEach((s, i) => {
      const d = distanceM(me, s.location);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    // si on est sur la manœuvre (< 20 m), on passe à la suivante
    return bestD < 20 ? Math.min(best + 1, route.steps.length - 1) : best;
  }, [route, me.lat, me.lng]);

  const left = distanceM(me, place);
  const arrived = geo.live && left < 30;
  const nextStep = route?.steps[cur];
  const eta = route ? new Date(Date.now() + route.duration * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : null;
  const gmaps = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${place.lat},${place.lng}&travelmode=${mode === 'bike' ? 'bicycling' : 'walking'}`;

  return (
    <div className="h-full flex flex-col bg-white">
      <TopBar title="Itinéraire" onBack={pop} />

      <div className="relative h-[42%] shrink-0">
        <MapView places={[place]} me={me} selectedId={place.id} route={route} fit={route ? 'route' : 'focus'} focusKey={place.id} className="absolute inset-0" />
        {guiding && nextStep && (
          <div className="absolute left-3 right-3 top-3 z-[500] rounded-2xl bg-[#0F2926] text-white p-3.5 flex items-center gap-3 shadow-lg guide-card">
            <span className="w-11 h-11 rounded-xl bg-[#bae3d1] text-[#0F2926] grid place-items-center shrink-0">
              <StepIcon type={nextStep.type} modifier={nextStep.modifier} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl leading-none">{fmtDist(distanceM(me, nextStep.location))}</p>
              <p className="text-sm font-semibold leading-snug mt-0.5">{nextStep.text}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-[#e3f1eb]">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#194080]">Destination</p>
          <p className="font-display uppercase text-2xl leading-none text-[#0F2926] mt-1">{place.name}</p>
          <p className="text-xs text-slate-500 mt-1">{place.address}</p>

          <div className="grid grid-cols-2 gap-2 mt-4" role="tablist" aria-label="Mode de déplacement">
            {[
              ['foot', 'À pied', Footprints],
              ['bike', 'À vélo', Bike]
            ].map(([id, label, Icon]) => (
              <button key={id} role="tab" aria-selected={mode === id} onClick={() => setMode(id)} className={`seg ${mode === id ? 'is-on' : ''}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {state === 'loading' && (
            <p className="flex items-center gap-2 text-sm text-slate-500 mt-4">
              <Loader2 className="w-4 h-4 animate-spin" /> Calcul de l’itinéraire…
            </p>
          )}
          {state === 'ok' && (
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="font-display text-4xl leading-none text-[#0F2926]">{fmtDur(route.duration)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {fmtDist(route.distance)} · arrivée vers {eta}
                </p>
              </div>
              <button onClick={() => setGuiding((g) => !g)} className={`app-btn ${guiding ? 'app-btn-ghost' : 'app-btn-ink'} !px-4`}>
                {guiding ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />} {guiding ? 'Arrêter' : 'Démarrer'}
              </button>
            </div>
          )}
          {state === 'error' && (
            <div className="mt-4 p-3 rounded-2xl bg-[#F5FBF9] border border-[#bae3d1]">
              <p className="text-sm font-semibold text-[#0F2926]">Itinéraire indisponible pour le moment.</p>
              <p className="text-xs text-slate-500 mt-1">
                À vol d’oiseau : {fmtDist(left)}, direction {Math.round(bearing(me, place))}°.
              </p>
            </div>
          )}
          {me.approximate && (
            <p className="text-[11px] text-[#194080] font-semibold mt-3">Position approximative (Lille-Centre) : active la localisation pour un guidage précis.</p>
          )}
        </div>

        {arrived && (
          <div className="m-4 p-4 rounded-2xl bg-[#bae3d1] flex items-center gap-3 pop-in">
            <img src="/brand/vaquita-mascotte.png" alt="" className="w-12" />
            <div className="flex-1">
              <p className="font-extrabold text-[#0F2926]">Tu es arrivé·e !</p>
              <p className="text-xs text-[#0F2926]/70">Dépose tes matières puis scanne le QR code affiché par la box.</p>
            </div>
            {place.type === 'box' && (
              <button onClick={() => goTab('scan')} className="app-btn app-btn-ink !px-3">
                <ScanLine className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {state === 'ok' && (
          <ol className="p-4 space-y-1">
            {route.steps.map((s, i) => (
              <li key={i} className={`route-step ${guiding && i === cur ? 'is-cur' : ''} ${guiding && i < cur ? 'is-done' : ''}`}>
                <span className="route-step-ic">
                  <StepIcon type={s.type} modifier={s.modifier} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-[#0F2926] leading-snug">{s.text}</span>
                  {s.distance > 0 && <span className="block text-[11px] text-slate-500 mt-0.5">puis {fmtDist(s.distance)}</span>}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="px-4 pb-8">
          <a href={gmaps} target="_blank" rel="noreferrer" className="app-btn app-btn-ghost w-full">
            <ExternalLink className="w-4 h-4" /> Ouvrir dans Google Maps
          </a>
          <p className="text-[10px] text-slate-400 text-center mt-3">Itinéraire © OpenStreetMap (routing.openstreetmap.de)</p>
        </div>
      </div>
    </div>
  );
}
