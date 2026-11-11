import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Keyboard, FlaskConical, Scale, QrCode, Sparkles, ChevronRight, X } from 'lucide-react';
import { TopBar, Empty, timeAgo } from '../components/ui';
import { useStore } from '../state/store';
import { useNav, useToast } from '../App';
import { BOXES, MATERIALS, placeById } from '../data/places';
import { parseBoxQR, computePoints, fmtKg, randomNonce } from '../lib/points';
import { startScanner } from '../lib/scanner';

export default function ScanScreen({ active }) {
  const { state, dispatch, league } = useStore();
  const { push } = useNav();
  const toast = useToast();
  const video = useRef(null);
  const stopRef = useRef(null);
  const busy = useRef(false);
  const [cam, setCam] = useState('off'); // off | starting | on | denied | error
  const [panel, setPanel] = useState(null); // null | 'code' | 'demo'
  const [code, setCode] = useState('');
  const [demo, setDemo] = useState({ box: BOXES[0].id, mat: 'FIL', grams: 1200 });

  const stopCam = () => {
    stopRef.current?.();
    stopRef.current = null;
    setCam('off');
  };
  useEffect(() => () => stopRef.current?.(), []);
  useEffect(() => {
    if (!active) stopCam();
  }, [active]);

  const handle = (text) => {
    if (busy.current) return;
    const r = parseBoxQR(text);
    if (!r.ok) {
      busy.current = true;
      toast(r.error);
      setTimeout(() => (busy.current = false), 2200);
      return;
    }
    if (state.deposits.some((d) => d.nonce === r.nonce)) {
      busy.current = true;
      toast('Ce dépôt a déjà été scanné.');
      setTimeout(() => (busy.current = false), 2200);
      return;
    }
    busy.current = true;
    if (navigator.vibrate) navigator.vibrate(60);
    const pts = computePoints(r.grams, r.material, league.mult);
    const deposit = {
      id: `d${Date.now()}`,
      boxId: r.box.id,
      grams: r.grams,
      material: r.material,
      nonce: r.nonce,
      points: pts.total,
      calc: pts,
      leagueBefore: league.id,
      date: new Date().toISOString()
    };
    dispatch({ type: 'deposit', deposit });
    stopCam();
    setPanel(null);
    setCode('');
    push('receipt', { depositId: deposit.id, fresh: true });
    setTimeout(() => (busy.current = false), 800);
  };

  const handleRef = useRef(handle);
  handleRef.current = handle;

  const startCam = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCam('error');
      return;
    }
    setCam('starting');
    try {
      stopRef.current = await startScanner(video.current, (t) => handleRef.current(t));
      setCam('on');
    } catch (e) {
      setCam(e?.name === 'NotAllowedError' ? 'denied' : 'error');
    }
  };

  const demoQR = `SM|${demo.box}|${demo.grams}|${demo.mat}|${'DEMO' + randomNonce(4)}`;
  const preview = computePoints(demo.grams, demo.mat, league.mult);
  const demoBox = placeById(demo.box);

  return (
    <div className="h-full flex flex-col bg-[#0F2926]">
      <TopBar title="Scan & Poids" dark />
      <div className="flex-1 overflow-y-auto pb-28">
        {/* viseur */}
        <div className="px-4">
          <div className="viewfinder">
            <video ref={video} className={`absolute inset-0 w-full h-full object-cover ${cam === 'on' ? 'opacity-100' : 'opacity-0'}`} muted playsInline />
            <span className="vf-corner tl" />
            <span className="vf-corner tr" />
            <span className="vf-corner bl" />
            <span className="vf-corner br" />
            {cam === 'on' && <span className="vf-line" />}
            {cam !== 'on' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-3">
                {cam === 'denied' || cam === 'error' ? <CameraOff className="w-9 h-9 text-[#bae3d1]" /> : <QrCode className="w-10 h-10 text-[#bae3d1]" />}
                <p className="text-white font-extrabold">
                  {cam === 'denied' ? 'Accès à la caméra refusé' : cam === 'error' ? 'Caméra indisponible' : 'Scanne le QR code de la box'}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {cam === 'denied'
                    ? 'Autorise la caméra dans les réglages du navigateur, ou saisis le code affiché.'
                    : cam === 'error'
                    ? 'Aucune caméra détectée. Saisis le code affiché par la box.'
                    : 'Après la pesée, l’écran de la box affiche un QR code avec le poids de ton dépôt.'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto_auto] gap-2 mt-3">
            {cam === 'on' ? (
              <button onClick={stopCam} className="app-btn app-btn-ghost-dark">
                <CameraOff className="w-4 h-4" /> Arrêter
              </button>
            ) : (
              <button onClick={startCam} disabled={cam === 'starting'} className="app-btn app-btn-aqua">
                <Camera className="w-4 h-4" /> {cam === 'starting' ? 'Ouverture…' : 'Ouvrir la caméra'}
              </button>
            )}
            <button onClick={() => setPanel(panel === 'code' ? null : 'code')} className={`icon-btn-dark ${panel === 'code' ? 'is-on' : ''}`} aria-label="Saisir le code">
              <Keyboard className="w-5 h-5" />
            </button>
            <button onClick={() => setPanel(panel === 'demo' ? null : 'demo')} className={`icon-btn-dark ${panel === 'demo' ? 'is-on' : ''}`} aria-label="Mode démo">
              <FlaskConical className="w-5 h-5" />
            </button>
          </div>

          {panel === 'code' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handle(code);
              }}
              className="panel-dark mt-3 pop-in"
            >
              <p className="text-xs font-extrabold text-white">Code affiché sous le QR</p>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SM|GPL|1250|FIL|8F2KQ" className="app-input app-input-dark mt-2 font-mono" />
              <button type="submit" className="app-btn app-btn-aqua w-full mt-2">
                Valider le dépôt
              </button>
            </form>
          )}

          {panel === 'demo' && (
            <div className="panel-dark mt-3 pop-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-[#bae3d1]" /> Mode démo — simuler une pesée
                </p>
                <button onClick={() => setPanel(null)} aria-label="Fermer" className="text-white/60">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <label className="block mt-3 text-[11px] font-bold text-white/70">
                Box
                <select value={demo.box} onChange={(e) => setDemo({ ...demo, box: e.target.value })} className="app-input app-input-dark mt-1">
                  {BOXES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-3">
                <p className="text-[11px] font-bold text-white/70">Trappe</p>
                <div className="grid grid-cols-3 gap-1.5 mt-1">
                  {demoBox.accepts.map((m) => (
                    <button key={m} onClick={() => setDemo({ ...demo, mat: m })} className={`seg-dark ${demo.mat === m ? 'is-on' : ''}`}>
                      {MATERIALS[m].short}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block mt-3 text-[11px] font-bold text-white/70">
                Poids affiché par la balance : <span className="text-white">{fmtKg(demo.grams)}</span>
                <input type="range" min="100" max="5000" step="50" value={demo.grams} onChange={(e) => setDemo({ ...demo, grams: +e.target.value })} className="range mt-2 w-full" />
              </label>
              <p className="text-xs text-[#bae3d1] mt-2">≈ {preview.total} points</p>
              <button onClick={() => handle(demoQR)} className="app-btn app-btn-aqua w-full mt-3">
                <Scale className="w-4 h-4" /> Simuler le scan
              </button>
            </div>
          )}
        </div>

        {/* comment ça marche */}
        <div className="px-4 mt-6">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#bae3d1]">Comment ça marche</p>
          <ol className="grid grid-cols-3 gap-2 mt-2">
            {[
              ['01', 'Dépose', 'dans la bonne trappe'],
              ['02', 'La box pèse', 'et affiche un QR'],
              ['03', 'Scanne', 'tes points arrivent']
            ].map(([n, t, s]) => (
              <li key={n} className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                <span className="font-display text-xl text-[#bae3d1]">{n}</span>
                <p className="text-xs font-extrabold text-white mt-1">{t}</p>
                <p className="text-[10px] text-white/55 leading-tight">{s}</p>
              </li>
            ))}
          </ol>
          <div className="mt-2 p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-[11px] text-white/70 flex gap-2">
            <Sparkles className="w-4 h-4 text-[#bae3d1] shrink-0" />
            <span>
              1 pt / 10 g · filets ×2 · pneus ×1,5 · ligue <strong className="text-white">{league.name}</strong> ×{String(league.mult).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* historique */}
        <div className="mt-6 mx-4 rounded-3xl bg-white overflow-hidden">
          <p className="px-4 pt-4 text-xs font-extrabold text-[#0F2926]">Mes dépôts</p>
          {state.deposits.length === 0 ? (
            <Empty icon={Scale} title="Aucun dépôt pour l’instant" text="Ton premier scan apparaîtra ici avec son reçu de pesée." />
          ) : (
            <ul className="p-2">
              {state.deposits.slice(0, 8).map((d) => (
                <li key={d.id}>
                  <button onClick={() => push('receipt', { depositId: d.id })} className="place-row">
                    <span className="w-9 h-9 rounded-xl grid place-items-center text-white shrink-0" style={{ background: MATERIALS[d.material].color }}>
                      <Scale className="w-4 h-4" />
                    </span>
                    <span className="flex-1 min-w-0 text-left">
                      <span className="block text-sm font-extrabold text-[#0F2926] truncate">{placeById(d.boxId)?.name}</span>
                      <span className="block text-[11px] text-slate-500">
                        {fmtKg(d.grams)} · {MATERIALS[d.material].short} · {timeAgo(d.date)}
                      </span>
                    </span>
                    <span className="font-extrabold text-[#194080] text-sm">+{d.points}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
