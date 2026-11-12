import { BOXES } from './places';
/* =====================================================================
   MEMBRES — données simulées pour l'aspect social (prototype).
   À remplacer par le serveur : ce n'est PAS du temps réel, comme Waze
   on affiche des positions relatives et des activités récentes.
   ===================================================================== */
const NAMES = [
  'Léa', 'Hugo', 'Inès', 'Malo', 'Chloé', 'Yanis', 'Jade', 'Nolan', 'Manon', 'Sacha', 'Lina', 'Théo', 'Zoé', 'Adam', 'Romane', 'Noé',
  'Camille', 'Rayan', 'Louise', 'Gabin', 'Anaïs', 'Ilyes', 'Margaux', 'Tom', 'Sarah', 'Liam', 'Elsa', 'Maël', 'Nina', 'Axel', 'Lou', 'Eden'
];
const AREAS = ['Lille-Centre', 'Vieux-Lille', 'Euralille', 'Roubaix', 'Wazemmes', 'Fives', 'Tourcoing', 'Villeneuve-d’Ascq'];
const COLORS = ['#18407f', '#18407f', '#0F2926', '#5fbfa6', '#2c5aa8', '#a5d2b2', '#115E59', '#7fb6e0'];

function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}
const r = rng(20270320);

export const MEMBERS = NAMES.map((n, i) => {
  const total = Math.round(40 + r() * 2600);
  return {
    id: `m${i}`,
    pseudo: `${n}${r() > 0.5 ? '' : '_' + Math.round(r() * 90 + 10)}`,
    color: COLORS[i % COLORS.length],
    area: AREAS[Math.floor(r() * AREAS.length)],
    total,
    week: Math.round(r() * 320),
    kg: Math.round((total / 160) * 10) / 10,
    lastBox: BOXES[Math.floor(r() * BOXES.length)].id,
    lastAgoMin: Math.round(5 + r() * 60 * 30)
  };
});

export const initials = (p) => p.replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 2).toUpperCase();
