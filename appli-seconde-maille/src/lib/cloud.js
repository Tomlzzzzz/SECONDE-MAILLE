/*
  COMPTES & SAUVEGARDE EN LIGNE - Supabase (gratuit), sans dépendance :
  on parle directement à son API (auth + base de données) avec fetch.
  Config : fichier .env.local à la racine de l'appli (voir .env.example).
  Sans config, l'appli reste 100 % locale (comme avant).
*/
const URL_ = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SESSION_KEY = 'seconde-maille-session';

export const cloudEnabled = Boolean(URL_ && KEY);

/* session */
export function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}
function writeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* stockage indisponible */
  }
  window.dispatchEvent(new Event('sm-session'));
}
const toSession = (d) =>
  d?.access_token
    ? {
        access_token: d.access_token,
        refresh_token: d.refresh_token,
        expires_at: d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600),
        user: { id: d.user.id, email: d.user.email }
      }
    : null;

/* erreurs en français */
function frError(body, status) {
  const m = `${body?.error_code || ''} ${body?.msg || body?.message || body?.error_description || body?.error || ''}`.toLowerCase();
  if (m.includes('invalid login') || m.includes('invalid_credentials')) return 'E-mail ou mot de passe incorrect.';
  if (m.includes('already registered') || m.includes('user_already_exists')) return 'Un compte existe déjà avec cet e-mail : connecte-toi.';
  if (m.includes('not confirmed') || m.includes('email_not_confirmed')) return 'Confirme d’abord ton adresse grâce à l’e-mail reçu.';
  if (m.includes('password') && (m.includes('6') || m.includes('weak') || m.includes('short'))) return 'Mot de passe trop court (6 caractères minimum).';
  if (m.includes('email') && (m.includes('invalid') || m.includes('valid'))) return 'Adresse e-mail invalide.';
  if (m.includes('rate') || status === 429) return 'Trop de tentatives, réessaie dans quelques minutes.';
  if (status >= 500) return 'Le serveur ne répond pas, réessaie plus tard.';
  return 'Une erreur est survenue, réessaie.';
}

async function call(path, { method = 'GET', body, token, headers = {} } = {}) {
  let res;
  try {
    res = await fetch(`${URL_}${path}`, {
      method,
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${token || KEY}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    const e = new Error('Pas de connexion internet.');
    e.offline = true;
    throw e;
  }
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const e = new Error(frError(data, res.status));
    e.status = res.status;
    throw e;
  }
  return data;
}

/* authentification */
export async function signUp(email, password, meta = {}) {
  const d = await call('/auth/v1/signup', { method: 'POST', body: { email, password, data: meta } });
  const s = toSession(d);
  if (s) writeSession(s);
  return { session: s, needsConfirm: !s };
}

export async function signIn(email, password) {
  const d = await call('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
  const s = toSession(d);
  writeSession(s);
  return s;
}

export async function resetPassword(email) {
  await call('/auth/v1/recover', { method: 'POST', body: { email } });
}

export async function signOut() {
  const s = readSession();
  writeSession(null);
  if (s) call('/auth/v1/logout', { method: 'POST', token: s.access_token }).catch(() => {});
}

/* Session valide (rafraîchie si elle expire bientôt) */
let refreshing = null;
export async function validSession() {
  const s = readSession();
  if (!s) return null;
  if (s.expires_at * 1000 - Date.now() > 60_000) return s;
  refreshing =
    refreshing ||
    call('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh_token } })
      .then((d) => {
        const n = toSession(d);
        writeSession(n);
        return n;
      })
      .catch((e) => {
        if (!e.offline) writeSession(null); // jeton révoqué : on déconnecte
        throw e;
      })
      .finally(() => (refreshing = null));
  return refreshing;
}

/* sauvegarde */
export async function pullSave() {
  const s = await validSession();
  if (!s) return null;
  const rows = await call(`/rest/v1/saves?user_id=eq.${s.user.id}&select=data,updated_at`, { token: s.access_token });
  return rows?.[0]?.data || null;
}

export async function pushSave(data, summary) {
  const s = await validSession();
  if (!s) return;
  const now = new Date().toISOString();
  const opts = { method: 'POST', token: s.access_token, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' } };
  await call('/rest/v1/saves?on_conflict=user_id', { ...opts, body: { user_id: s.user.id, data, updated_at: now } });
  // profil public (pour de vrais classements plus tard)
  await call('/rest/v1/profiles?on_conflict=user_id', { ...opts, body: { user_id: s.user.id, ...summary, updated_at: now } }).catch(() => {});
}
