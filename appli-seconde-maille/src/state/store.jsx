import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { leagueFor } from '../data/leagues';
import { useGeolocation } from '../lib/geo';

/* =====================================================================
   ÉTAT DE L'APPLI — sauvegardé sur l'appareil (localStorage).
   Plus tard : remplacer la persistance par l'API du serveur Seconde Maille.
   ===================================================================== */
const KEY = 'seconde-maille-app-v1';

const initial = {
  onboarded: false,
  geoChoice: null, // 'granted' | 'skipped'
  profile: { pseudo: '', color: '#194080' },
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

  const value = useMemo(() => ({ state, dispatch, geo, ...derived }), [state, geo, derived]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
