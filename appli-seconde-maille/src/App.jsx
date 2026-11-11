import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Map as MapIcon, ScanLine, Trophy, Ticket, Gamepad2 } from 'lucide-react';
import { StoreProvider, useStore } from './state/store';
import Onboarding from './screens/Onboarding';
import MapScreen from './screens/MapScreen';
import RouteScreen from './screens/RouteScreen';
import ScanScreen from './screens/ScanScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import LeaguesScreen from './screens/LeaguesScreen';
import RewardsScreen from './screens/RewardsScreen';
import GameHub from './screens/GameHub';
import GamePlay from './screens/GamePlay';

/* ---------------------------------------------------------------------
   Navigation : 5 onglets + sous-vues empilées (itinéraire, reçu)
   --------------------------------------------------------------------- */
const NavCtx = createContext(null);
export const useNav = () => useContext(NavCtx);

const TABS = [
  { id: 'map', label: 'Carte', icon: MapIcon },
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'game', label: 'Jeu', icon: Gamepad2 },
  { id: 'leagues', label: 'Ligues', icon: Trophy },
  { id: 'rewards', label: 'Pass', icon: Ticket }
];

function TabBar({ tab, onTab }) {
  const idx = TABS.findIndex((t) => t.id === tab);
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      <span className="tabbar-blob" style={{ transform: `translateX(${idx * 100}%)` }} aria-hidden="true" />
      {TABS.map((t) => {
        const Icon = t.icon;
        const on = t.id === tab;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} className={`tabbar-btn ${on ? 'is-on' : ''}`} aria-current={on ? 'page' : undefined}>
            <Icon className="w-[22px] h-[22px]" strokeWidth={on ? 2.4 : 2} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* Petits messages en bas d'écran */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

function Shell() {
  const { state } = useStore();
  const [tab, setTab] = useState('map');
  const [stack, setStack] = useState([]); // [{ view, ...params }]
  const [toast, setToast] = useState(null);

  const push = useCallback((view, params = {}) => setStack((s) => [...s, { view, key: Date.now(), ...params }]), []);
  const pop = useCallback(() => setStack((s) => s.slice(0, -1)), []);
  const goTab = useCallback((t) => {
    setStack([]);
    setTab(t);
  }, []);
  const showToast = useCallback((msg) => {
    setToast({ msg, key: Date.now() });
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  if (!state.onboarded) return <Onboarding />;

  const top = stack[stack.length - 1];
  const screens = { map: MapScreen, scan: ScanScreen, leagues: LeaguesScreen, rewards: RewardsScreen, game: GameHub };
  const Tab = screens[tab];

  return (
    <NavCtx.Provider value={{ tab, goTab, push, pop }}>
      <ToastCtx.Provider value={showToast}>
        <div className="app-body">
          <div key={tab} className="screen screen-tab">
            <Tab active={!top} />
          </div>
          {stack.map((s, i) => (
            <div key={s.key} className="screen screen-push" style={{ zIndex: 20 + i }}>
              {s.view === 'route' && <RouteScreen placeId={s.placeId} />}
              {s.view === 'receipt' && <ReceiptScreen depositId={s.depositId} fresh={s.fresh} />}
              {s.view === 'game' && <GamePlay />}
            </div>
          ))}
        </div>
        {!top && <TabBar tab={tab} onTab={goTab} />}
        {toast && (
          <div key={toast.key} className="toast" role="status">
            {toast.msg}
          </div>
        )}
      </ToastCtx.Provider>
    </NavCtx.Provider>
  );
}

/* ---------------------------------------------------------------------
   Cadre téléphone : sur ordinateur l'appli s'affiche dans un téléphone,
   sur mobile elle occupe tout l'écran.
   --------------------------------------------------------------------- */
function useIsPhone() {
  const q = '(max-width: 560px), (pointer: coarse) and (max-width: 900px)';
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return m;
}

function Clock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 20000);
    return () => clearInterval(id);
  }, []);
  return <>{t.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</>;
}

function DeviceFrame({ children }) {
  const wrap = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 40) / 860, (window.innerWidth - 40) / 410));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="desk">
      <div className="desk-side" aria-hidden="true">
        <img src="/brand/seconde-maille-logo.png" alt="" className="w-56" />
        <p className="font-display uppercase text-5xl leading-[0.9] text-[#0F2926] mt-8">L’appli</p>
        <p className="text-[#0F2926]/70 font-semibold mt-3 max-w-xs leading-relaxed">
          Trouve les box, scanne tes dépôts, joue chaque jour, grimpe dans les ligues et utilise tes points au pop-up du 20 mars 2027.
        </p>
        <p className="text-xs text-[#0F2926]/50 mt-6">Aperçu ordinateur — ouvre cette adresse sur ton téléphone pour l’utiliser en plein écran.</p>
      </div>
      <div ref={wrap} className="phone" style={{ transform: `scale(${scale})` }}>
        <div className="phone-screen">
          <div className="phone-status" aria-hidden="true">
            <span className="font-bold">
              <Clock />
            </span>
            <span className="phone-notch" />
            <span className="flex items-center gap-1">
              <svg width="16" height="11" viewBox="0 0 16 11"><path d="M1 10h2V7H1zM5 10h2V5H5zM9 10h2V3H9zM13 10h2V1h-2z" fill="currentColor" /></svg>
              <svg width="24" height="11" viewBox="0 0 24 11"><rect x=".5" y=".5" width="20" height="10" rx="3" fill="none" stroke="currentColor" /><rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor" /><rect x="21.5" y="3.5" width="1.5" height="4" rx=".7" fill="currentColor" /></svg>
            </span>
          </div>
          <div className="phone-app">{children}</div>
          <span className="phone-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const phone = useIsPhone();
  const app = (
    <StoreProvider>
      <div className="app">
        <Shell />
      </div>
    </StoreProvider>
  );
  return phone ? <div className="app-fullscreen">{app}</div> : <DeviceFrame>{app}</DeviceFrame>;
}
