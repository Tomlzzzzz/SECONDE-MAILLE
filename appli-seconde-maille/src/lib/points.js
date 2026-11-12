import { MATERIALS, placeById } from '../data/places';

/*
  FORMAT DU QR CODE AFFICHÉ PAR L'ÉCRAN DE LA BOX (après pesée)
  SM|<idBox>|<poids en grammes>|<matière>|<code unique>
  ex. SM|GPL|1250|FIL|8F2KQ  ->  Box Grande Place, 1,25 kg de filets
  Le code unique empêche de scanner deux fois le même dépôt.
*/
export const QR_PREFIX = 'SM';
export const MAX_GRAMS = 10000; // 10 kg max par dépôt

export function parseBoxQR(text) {
  const raw = String(text || '').trim();
  const parts = raw.split('|');
  if (parts.length !== 5 || parts[0] !== QR_PREFIX) return { ok: false, error: 'Ce QR code n’est pas celui d’une box Seconde Maille.' };
  const [, boxId, g, mat, nonce] = parts;
  const box = placeById(boxId);
  if (!box || box.type !== 'box') return { ok: false, error: `Box « ${boxId} » inconnue.` };
  const grams = parseInt(g, 10);
  if (!Number.isFinite(grams) || grams <= 0) return { ok: false, error: 'Poids illisible sur le QR code.' };
  if (grams > MAX_GRAMS) return { ok: false, error: 'Poids supérieur à 10 kg : adresse-toi à l’équipe Seconde Maille.' };
  if (!MATERIALS[mat]) return { ok: false, error: 'Matière inconnue.' };
  if (!/^[A-Z0-9]{4,12}$/.test(nonce)) return { ok: false, error: 'Code de dépôt invalide.' };
  return { ok: true, box, grams, material: mat, nonce, raw };
}

/* 1 point par tranche de 10 g, × bonus matière, × bonus de ligue */
export function computePoints(grams, material, leagueMult = 1) {
  const base = Math.round(grams / 10);
  const matMult = MATERIALS[material]?.mult ?? 1;
  const afterMat = Math.round(base * matMult);
  const total = Math.round(afterMat * leagueMult);
  return { base, matMult, matBonus: afterMat - base, leagueMult, leagueBonus: total - afterMat, total };
}

export const fmtKg = (g) => `${(g / 1000).toFixed(g < 1000 ? 2 : 1).replace('.', ',')} kg`;

export function randomNonce(n = 6) {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join('');
}
