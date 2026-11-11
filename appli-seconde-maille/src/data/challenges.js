/* Défis de la semaine : des bonus pour monter de ligue plus vite */
import { MATERIALS } from './places';

export function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-S${Math.ceil(((t - y) / 864e5 + 1) / 7)}`;
}

export function weekEnd(d = new Date()) {
  const e = new Date(d);
  const day = e.getDay() || 7;
  e.setDate(e.getDate() + (7 - day));
  e.setHours(23, 59, 59, 0);
  return e;
}

export const CHALLENGES = [
  {
    id: 'two-deposits',
    title: '2 dépôts cette semaine',
    reward: 40,
    goal: 2,
    progress: (deps) => deps.length,
    unit: 'dépôts'
  },
  {
    id: 'nets-1kg',
    title: '1 kg de filets ou tissus',
    reward: 60,
    goal: 1000,
    progress: (deps) => deps.filter((d) => d.material === 'FIL').reduce((a, d) => a + d.grams, 0),
    unit: 'g',
    hint: MATERIALS.FIL.hint
  },
  {
    id: 'two-boxes',
    title: 'Déposer dans 2 box différentes',
    reward: 50,
    goal: 2,
    progress: (deps) => new Set(deps.map((d) => d.boxId)).size,
    unit: 'box'
  }
];
