/*
  LE JEU - "Maille à part" : le vaquita esquive les filets égarés.
  Une partie qui rapporte des points par jour, pendant la collab.
  Avant / après la collab : mode entraînement illimité, sans points.
*/
export const GAME_NAME = 'Maille à part';

// Période de la collab : de l'ouverture des box à l'inauguration du pop-up
export const COLLAB_START = new Date('2027-01-20T00:00:00+01:00');
export const COLLAB_END = new Date('2027-03-20T23:59:59+01:00');

export const LIVES = 3;
export const MAX_GAME_POINTS = 30; // plafond par partie (hors bonus de série)
export const STREAK_STEP = 5; // +5 pts par jour consécutif
export const STREAK_MAX = 20; // bonus de série plafonné
// pour comparer : 1 kg déposé = 100 pts

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// mode test : points actifs avant le 20 janvier
// mettre à false pour la vraie saison
export const SCORE_BEFORE_START = true;

export function collabPhase(now = new Date()) {
  if (now < COLLAB_START) return SCORE_BEFORE_START ? 'live' : 'before';
  if (now > COLLAB_END) return 'after';
  return 'live';
}

/* Score de partie : 10 par seconde survécue + 25 par bulle */
export const scoreFor = (seconds, bubbles) => Math.floor(seconds * 10) + bubbles * 25;

/* Points pour l'appli : 1 pt toutes les 2 s + 1 par bulle (plafonné) + bonus de série */
export function pointsFor(seconds, bubbles, streak) {
  const base = Math.min(MAX_GAME_POINTS, Math.floor(seconds / 2) + bubbles);
  const streakBonus = Math.min(STREAK_MAX, Math.max(0, streak - 1) * STREAK_STEP);
  return { base, streakBonus, total: base + streakBonus };
}

/* Série : nombre de jours consécutifs avec une vraie partie, en comptant aujourd'hui */
export function streakIncluding(games, today = new Date()) {
  const days = new Set(games.filter((g) => !g.training).map((g) => g.day));
  let n = 0;
  const d = new Date(today);
  while (days.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/* Scores simulés des membres pour le classement du jour (stables sur la journée) */
function seeded(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return ((h >>> 0) % 10000) / 10000;
}
export function dailyBoard(members, day = dayKey()) {
  return members
    .map((m) => {
      const r = seeded(m.id + day);
      const seconds = 5 + Math.pow(r, 2) * 45;
      const bubbles = Math.floor(seconds / 6 * seeded(day + m.id));
      return { ...m, seconds, bubbles, score: scoreFor(seconds, bubbles), played: seeded('p' + m.id + day) > 0.25 };
    })
    .filter((m) => m.played)
    .sort((a, b) => b.score - a.score);
}
