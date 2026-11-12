import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { leagueFor } from '../data/leagues';
import { useGeolocation } from '../lib/geo';
import { cloudEnabled, readSession, pullSave, pushSave, signOut as cloudSignOut } from '../lib/cloud';
import { mergeStates, sameData, toCloud } from './merge';

/*
  ÉTAT DE L'APPLI - copie sur l'appareil (localStorage, marche hors ligne)
  + synchronisation avec le compte de la personne (lib/cloud.js) :
  à la connexion on fusionne, puis chaque changement est envoyé.
*/
const KEY = 'seconde-maille-app-v1';

const initial = {
  onboarded: false,
  geoChoice: null, // 'granted' | 'skipped'
  profile: { pseudo: '', color: '#18407f' },
  deposits: [], // { id, boxId, grams, material, points, date, nonce }
  spent: 0,
  vouchers: [], // { id, rewardId, title, cost, code, date }
  bonuses: [], // { id, challengeId, week, points, date }
  games: [], // { id, day, date, seconds, bubbles, score, points, training }
  memberId: null
};

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    return s ? { ...initial, ...s } : initial;
  } catch {
    return initial;
  }
}

function reducer(s, a) {
  switch (a.type) {
    case 'onboard':
      return { ...s, onboarded: true, geoChoice: a.geoChoice, profile: a.profile, memberId: s.memberId || `SM-${Math.random().toString(36).slice(2, 8).toUpperCase()}` };
    case 'geo':
      return { ...s, geoChoice: a.value };
    case 'deposit':
      return { ...s, deposits: [a.deposit, ...s.deposits] };
    case 'bonus':
      return { ...s, bonuses: [a.bonus, ...s.bonuses] };
    case 'game':
      return { ...s, games: [a.game, ...s.games] };
    case 'redeem':
      return { ...s, spent: s.spent + a.voucher.cost, vouchers: [a.voucher, ...s.vouchers] };
    case 'profile':
      return { ...s, profile: { ...s.profile, ...a.profile } };
    case 'hydrate': // fusion avec la sauvegarde du compte
      return a.state;
    case 'reset':
      return { ...initial };
    default:
      return s;
  }
}

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* stockage plein / privé */
    }
  }, [state]);

  const geo = useGeolocation(state.onboarded && state.geoChoice === 'granted');

  /* compte & synchronisation */
  const [session, setSession] = useState(() => (cloudEnabled ? readSession() : null));
  const [sync, setSync] = useState({ status: cloudEnabled && readSession() ? 'syncing' : 'off', at: null });
  const stateRef = useRef(state);
  stateRef.current = state;
  const busy = useRef(false);
  const again = useRef(false);

  useEffect(() => {
    const on = () => setSession(readSession());
    window.addEventListener('sm-session', on);
    return () => window.removeEventListener('sm-session', on);
  }, []);

  // récupère le compte, fusionne avec l'appareil, renvoie le résultat
  const syncNow = useCallback(async () => {
    if (!cloudEnabled || !readSession()) return;
    if (busy.current) {
      again.current = true;
      return;
    }
    busy.current = true;
    setSync((x) => ({ ...x, status: 'syncing' }));
    try {
      const remote = await pullSave();
      const local = stateRef.current;
      const merged = mergeStates(local, remote);
      if (!sameData(merged, local)) dispatch({ type: 'hydrate', state: merged });
      if (merged.onboarded && !sameData(merged, remote)) {
        const earned =
          merged.deposits.reduce((a, d) => a + d.points, 0) +
          merged.bonuses.reduce((a, b) => a + b.points, 0) +
          merged.games.reduce((a, g) => a + (g.points || 0), 0);
        await pushSave(toCloud(merged), {
          pseudo: merged.profile.pseudo,
          color: merged.profile.color,
          member_id: merged.memberId,
          points: earned,
          grams: merged.deposits.reduce((a, d) => a + d.grams, 0)
        });
      }
      setSync({ status: 'saved', at: Date.now() });
    } catch (e) {
      setSync((x) => ({ ...x, status: e.offline ? 'offline' : readSession() ? 'error' : 'off', message: e.message }));
    } finally {
      busy.current = false;
      if (again.current) {
        again.current = false;
        setTimeout(syncNow, 300);
      }
    }
  }, []);

  // à la connexion / au démarrage
  useEffect(() => {
    if (session) syncNow();
    else setSync({ status: 'off', at: null });
  }, [session?.user?.id]);

  // à chaque changement de progression (petit délai pour regrouper)
  const cloudJson = JSON.stringify(toCloud(state));
  useEffect(() => {
    if (!session || !state.onboarded) return;
    const t = setTimeout(syncNow, 1200);
    return () => clearTimeout(t);
  }, [cloudJson, session?.user?.id]);

  // retour sur l'appli / retour du réseau : on récupère ce qui a été fait ailleurs
  useEffect(() => {
    const on = () => document.visibilityState === 'visible' && session && syncNow();
    document.addEventListener('visibilitychange', on);
    window.addEventListener('online', on);
    return () => {
      document.removeEventListener('visibilitychange', on);
      window.removeEventListener('online', on);
    };
  }, [session?.user?.id]);

  const logout = useCallback(async () => {
    await syncNow().catch(() => {});
    await cloudSignOut();
    dispatch({ type: 'reset' }); // l'appareil est vidé, tout reste sur le compte
  }, [syncNow]);

  const derived = useMemo(() => {
    const bonus = state.bonuses.reduce((a, b) => a + b.points, 0) + state.games.reduce((a, g) => a + (g.points || 0), 0);
    const earned = state.deposits.reduce((a, d) => a + d.points, 0) + bonus;
    const grams = state.deposits.reduce((a, d) => a + d.grams, 0);
    const now = Date.now();
    const weekAgo = now - 7 * 864e5;
    const week =
      state.deposits.filter((d) => new Date(d.date).getTime() > weekAgo).reduce((a, d) => a + d.points, 0) +
      state.bonuses.filter((b) => new Date(b.date).getTime() > weekAgo).reduce((a, b) => a + b.points, 0) +
      state.games.filter((g) => new Date(g.date).getTime() > weekAgo).reduce((a, g) => a + (g.points || 0), 0);
    return { earned, balance: earned - state.spent, grams, week, league: leagueFor(earned) };
  }, [state.deposits, state.bonuses, state.games, state.spent]);

  const account = useMemo(() => ({ enabled: cloudEnabled, user: session?.user || null, sync, syncNow, logout }), [session, sync, syncNow, logout]);
  const value = useMemo(() => ({ state, dispatch, geo, account, ...derived }), [state, geo, account, derived]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
