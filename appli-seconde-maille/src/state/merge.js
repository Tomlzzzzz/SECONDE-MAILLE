/*
  Fusion de deux sauvegardes (appareil + compte) sans rien perdre :
  on additionne les listes (dépôts, parties, bons...) en dédoublonnant par id.
*/
const byId = (a = [], b = []) => {
  const m = new Map();
  [...a, ...b].forEach((x) => x && x.id && m.set(x.id, { ...m.get(x.id), ...x }));
  return [...m.values()].sort((x, y) => new Date(y.date) - new Date(x.date));
};

// Ce qui part sur le compte (la localisation reste propre à chaque appareil)
export const SYNCED = ['onboarded', 'profile', 'deposits', 'spent', 'vouchers', 'bonuses', 'games', 'memberId'];
export const toCloud = (s) => Object.fromEntries(SYNCED.map((k) => [k, s[k]]));

export function mergeStates(local, remote) {
  if (!remote) return local;
  const vouchers = byId(local.vouchers, remote.vouchers);
  const spentFromVouchers = vouchers.reduce((a, v) => a + (v.cost || 0), 0);
  return {
    ...local,
    onboarded: Boolean(local.onboarded || remote.onboarded),
    profile: remote.profile?.pseudo ? { ...local.profile, ...remote.profile } : local.profile,
    memberId: remote.memberId || local.memberId,
    deposits: byId(local.deposits, remote.deposits),
    bonuses: byId(local.bonuses, remote.bonuses),
    games: byId(local.games, remote.games),
    vouchers,
    spent: Math.max(local.spent || 0, remote.spent || 0, spentFromVouchers)
  };
}

// comparaison stable (la base peut réordonner les clés)
const stable = (v) =>
  Array.isArray(v) ? `[${v.map(stable).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).sort().map((k) => `${k}:${stable(v[k])}`).join(',')}}` : JSON.stringify(v ?? null);
export const sameData = (a, b) => stable(toCloud(a)) === stable(toCloud(b || {}));
