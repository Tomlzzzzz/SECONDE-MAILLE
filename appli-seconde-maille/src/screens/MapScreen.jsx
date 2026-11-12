import React, { useCallback, useMemo, useRef, useState } from 'react';
import { LocateFixed, Navigation, ScanLine, ChevronUp, MapPin, Store, Package, CalendarDays } from 'lucide-react';
import MapView from '../components/MapView';
import { Avatar, Pill, timeAgo } from '../components/ui';
import { useStore } from '../state/store';
import { useNav } from '../App';
import { ALL_PLACES, BOX_OPENING, BOX_CLOSING, MATERIALS, POPUP } from '../data/places';
import { MEMBERS } from '../data/members';
import { distanceM, fmtDist, walkMin } from '../lib/geo';

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'box', label: 'Box' },
  { id: 'popup', label: 'Pop-up' }
];

function FillGauge({ fill }) {
  const tone = fill > 0.85 ? '#b45309' : fill > 0.6 ? '#18407f' : '#18407f';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-[#e3f1eb] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${fill * 100}%`, background: tone }} />
      </div>
      <span className="text-[11px] font-bold text-slate-500 tabular-nums">{Math.round(fill * 100)} %</span>
    </div>
  );
}

function PlaceDetail({ p, d, onRoute, onScan }) {
  const isPop = p.type === 'popup';
  const recent = MEMBERS.filter((m) => m.lastBox === p.id).sort((a, b) => a.lastAgoMin - b.lastAgoMin).slice(0, 4);
  const days = Math.max(0, Math.ceil((POPUP.date - Date.now()) / 864e5));
  const notOpen = !isPop && Date.now() < BOX_OPENING.getTime();
  const closed = !isPop && Date.now() > BOX_CLOSING.getTime();
  return (
    <div className="sheet-detail">
      <div className="flex items-start gap-3">
        <span className={`w-12 h-12 rounded-2xl grid place-items-center shrink-0 ${isPop ? 'bg-[#a5d2b2]' : 'bg-[#0F2926] text-[#a5d2b2]'}`}>
          {isPop ? <img src="/brand/vaquita-mascotte.png" alt="" className="w-9" /> : <Package className="w-5 h-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display uppercase text-[22px] leading-none text-[#0F2926]">{p.name}</p>
          <p className="text-xs text-slate-500 mt-1 truncate">{p.address}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-2xl leading-none text-[#18407f]">{fmtDist(d)}</p>
          <p className="text-[11px] font-bold text-slate-500 mt-1">~{walkMin(d)} min à pied</p>
        </div>
      </div>

      {isPop ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-[#F5FBF9] border border-[#a5d2b2]">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#18407f] flex items-center gap-1">
              <CalendarDays className="w-3 h-3" /> Ouverture
            </p>
            <p className="font-display text-xl text-[#0F2926] mt-1">20.03.2027</p>
          </div>
          <div className="p-3 rounded-2xl bg-[#18407f] text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#a5d2b2]">Compte à rebours</p>
            <p className="font-display text-xl mt-1">J-{days}</p>
          </div>
          <p className="col-span-2 text-xs text-slate-600">
            Ouvert de 9h à 17h jusqu’au 20 juin. Sur place : le hub d’accueil, le café vegan (un café offert dès 100 pts), la boutique, l’atelier tote bag avec La Vie est Belt et la salle de masterclass Vakita.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[11px] font-extrabold text-[#0F2926] mb-1.5">Remplissage</p>
            <FillGauge fill={p.fill} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {p.accepts.map((m) => (
              <Pill key={m} tone="white">
                <span className="w-2 h-2 rounded-full" style={{ background: MATERIALS[m].color }} /> {MATERIALS[m].label}
              </Pill>
            ))}
            {notOpen && <Pill tone="blue">Ouvre le 20.01.27</Pill>}
            {closed && <Pill tone="blue">Collecte terminée le 20.03.27</Pill>}
          </div>
          {recent.length > 0 && (
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {recent.map((m) => (
                  <Avatar key={m.id} pseudo={m.pseudo} color={m.color} size={28} ring />
                ))}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                <strong className="text-[#0F2926]">{recent[0].pseudo}</strong> a déposé ici {timeAgo(Date.now() - recent[0].lastAgoMin * 60000)}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button onClick={onRoute} className="app-btn app-btn-ink flex-1">
          <Navigation className="w-4 h-4" /> Itinéraire
        </button>
        {!isPop && (
          <button onClick={onScan} className="app-btn app-btn-aqua flex-1">
            <ScanLine className="w-4 h-4" /> Scanner
          </button>
        )}
      </div>
    </div>
  );
}

export default function MapScreen() {
  const { geo, state, balance, league } = useStore();
  const { push, goTab } = useNav();
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState(null);
  const [open, setOpen] = useState(false);
  const [recenter, setRecenter] = useState(0);
  const drag = useRef(null);

  const me = geo.live ? geo.pos : { ...geo.pos, approximate: true };
  const list = useMemo(
    () =>
      ALL_PLACES.filter((p) => filter === 'all' || p.type === filter)
        .map((p) => ({ p, d: distanceM(me, p) }))
        .sort((a, b) => a.d - b.d),
    [filter, me.lat, me.lng]
  );
  const nearestBox = useMemo(() => ALL_PLACES.filter((p) => p.type === 'box').map((p) => ({ p, d: distanceM(me, p) })).sort((a, b) => a.d - b.d)[0], [me.lat, me.lng]);
  const selected = sel ? list.find((x) => x.p.id === sel) || { p: ALL_PLACES.find((x) => x.id === sel), d: distanceM(me, ALL_PLACES.find((x) => x.id === sel)) } : null;

  const onSelect = useCallback((id) => {
    setSel(id);
    setOpen(true);
  }, []);

  // glisser la poignée du panneau
  const onDown = (e) => (drag.current = e.clientY);
  const onUp = (e) => {
    if (drag.current == null) return;
    const dy = e.clientY - drag.current;
    drag.current = null;
    if (dy < -30) setOpen(true);
    else if (dy > 30) {
      setOpen(false);
      setSel(null);
    } else setOpen((o) => !o);
  };

  return (
    <div className="relative h-full">
      <MapView
        places={ALL_PLACES.filter((p) => filter === 'all' || p.type === filter)}
        me={me}
        selectedId={sel}
        onSelect={onSelect}
        fit={sel ? 'focus' : 'places'}
        focusKey={sel || recenter}
        className="absolute inset-0"
      />

      {/* en-tête flottant */}
      <div className="absolute top-0 left-0 right-0 p-3 pt-[max(12px,env(safe-area-inset-top))] pointer-events-none z-[500]">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="glass flex-1 flex items-center gap-2.5 px-2.5 py-2 rounded-2xl min-w-0">
            <Avatar pseudo={state.profile.pseudo} color={state.profile.color} size={34} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-500 leading-none">Salut</p>
              <p className="font-extrabold text-[#0F2926] text-sm truncate">{state.profile.pseudo}</p>
            </div>
            <button onClick={() => goTab('rewards')} className="px-2.5 py-1.5 rounded-xl bg-[#0F2926] text-[#a5d2b2] text-xs font-extrabold tabular-nums">
              {balance} pts
            </button>
            <button onClick={() => goTab('leagues')} className="px-2.5 py-1.5 rounded-xl text-xs font-extrabold text-white" style={{ background: league.color === '#a5d2b2' ? '#18407f' : league.color }}>
              {league.name}
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 mt-2 pointer-events-auto">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`chip ${filter === f.id ? 'is-on' : ''}`} aria-pressed={filter === f.id}>
              {f.label}
            </button>
          ))}
          {!geo.live && (
            <button onClick={() => geo.start()} className="chip chip-warn ml-auto">
              <MapPin className="w-3 h-3" /> {geo.status === 'asking' ? '…' : 'Position approx.'}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => {
          setSel(null);
          setRecenter((r) => r + 1);
        }}
        className={`map-fab z-[500] ${open ? 'is-hidden' : ''}`}
        aria-label="Recentrer la carte"
      >
        <LocateFixed className="w-5 h-5" />
      </button>

      {/* panneau du bas */}
      <section className={`sheet z-[600] ${open ? 'is-open' : ''}`} aria-label="Box et pop-up à proximité">
        <button className="sheet-handle" onPointerDown={onDown} onPointerUp={onUp} aria-label={open ? 'Réduire' : 'Agrandir'}>
          <span />
        </button>
        {selected && open ? (
          <div className="px-4 pb-4">
            <button onClick={() => setSel(null)} className="text-xs font-extrabold text-[#18407f] mb-3">
              ← Toutes les box
            </button>
            <PlaceDetail p={selected.p} d={selected.d} onRoute={() => push('route', { placeId: selected.p.id })} onScan={() => goTab('scan')} />
          </div>
        ) : (
          <div className="px-4 pb-4">
            {nearestBox && (
              <button onClick={() => onSelect(nearestBox.p.id)} className="w-full text-left flex items-center gap-3 p-3 rounded-2xl bg-[#0F2926] text-white">
                <span className="w-10 h-10 rounded-xl bg-[#a5d2b2] text-[#0F2926] grid place-items-center">
                  <Navigation className="w-5 h-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[11px] text-[#a5d2b2] font-bold">Box la plus proche</span>
                  <span className="block font-extrabold truncate">{nearestBox.p.name}</span>
                </span>
                <span className="font-display text-2xl">{fmtDist(nearestBox.d)}</span>
              </button>
            )}
            <div className="flex items-center justify-between mt-4 mb-2">
              <p className="text-xs font-extrabold text-[#0F2926]">{list.length} lieux</p>
              <button onClick={() => setOpen((o) => !o)} className="text-xs font-bold text-slate-500 flex items-center gap-1">
                {open ? 'Réduire' : 'Voir la liste'} <ChevronUp className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <ul className="space-y-1.5">
              {list.map(({ p, d }) => (
                <li key={p.id}>
                  <button onClick={() => onSelect(p.id)} className="place-row">
                    <span className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 ${p.type === 'popup' ? 'bg-[#a5d2b2]' : 'bg-[#F5FBF9] text-[#0F2926]'}`}>
                      {p.type === 'popup' ? <Store className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                    </span>
                    <span className="flex-1 min-w-0 text-left">
                      <span className="block font-extrabold text-sm text-[#0F2926] truncate">{p.name}</span>
                      <span className="block text-[11px] text-slate-500 truncate">{p.type === 'popup' ? '20 mars 2027 · Lille' : `${p.area} · rempli à ${Math.round(p.fill * 100)} %`}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-extrabold text-sm text-[#18407f] tabular-nums">{fmtDist(d)}</span>
                      <span className="block text-[10px] text-slate-400">{walkMin(d)} min</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
