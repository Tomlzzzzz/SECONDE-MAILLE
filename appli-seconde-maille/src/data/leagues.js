/* =====================================================================
   LIGUES — plus ta ligue est haute, plus chaque kilo rapporte de points.
   La ligue dépend des points GAGNÉS au total (dépenser ses points ne fait pas descendre).
   ===================================================================== */
export const LEAGUES = [
  { id: 'plancton', name: 'Plancton', min: 0, mult: 1, color: '#a5d2b2', emoji: '·' },
  { id: 'crevette', name: 'Crevette', min: 150, mult: 1.1, color: '#9fd8c4', emoji: '◦' },
  { id: 'hippocampe', name: 'Hippocampe', min: 400, mult: 1.2, color: '#5fbfa6', emoji: '∿' },
  { id: 'tortue', name: 'Tortue', min: 800, mult: 1.3, color: '#18407f', emoji: '◍' },
  { id: 'dauphin', name: 'Dauphin', min: 1500, mult: 1.4, color: '#2c5aa8', emoji: '≋' },
  { id: 'vaquita', name: 'Vaquita', min: 3000, mult: 1.5, color: '#18407f', emoji: '★' }
];

export function leagueFor(totalEarned) {
  let cur = LEAGUES[0];
  for (const l of LEAGUES) if (totalEarned >= l.min) cur = l;
  const idx = LEAGUES.indexOf(cur);
  const next = LEAGUES[idx + 1] || null;
  const progress = next ? (totalEarned - cur.min) / (next.min - cur.min) : 1;
  return { ...cur, index: idx, next, progress: Math.max(0, Math.min(1, progress)), toNext: next ? next.min - totalEarned : 0 };
}

/* Bonus de fin de semaine dans ton groupe */
export const WEEKLY_REWARDS = [
  { rank: 1, bonus: 120 },
  { rank: 2, bonus: 80 },
  { rank: 3, bonus: 50 }
];
export const PROMOTION_ZONE = 5; // top 5 du groupe
