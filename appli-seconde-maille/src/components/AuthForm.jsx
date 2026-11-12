import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { signIn, signUp, resetPassword } from '../lib/cloud';

/* Formulaire compte : créer un compte / se connecter (e-mail + mot de passe) */
export default function AuthForm({ initialMode = 'signup', onDone, pseudo, dark = false }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setInfo('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Adresse e-mail invalide.');
    if (pwd.length < 6) return setErr('Mot de passe trop court (6 caractères minimum).');
    setBusy(true);
    try {
      if (mode === 'signup') {
        const r = await signUp(email.trim(), pwd, pseudo ? { pseudo } : {});
        if (r.needsConfirm) {
          setMode('login');
          setInfo('Compte créé ! Clique sur le lien reçu par e-mail pour le confirmer, puis connecte-toi ici.');
        } else onDone?.('signup');
      } else {
        await signIn(email.trim(), pwd);
        onDone?.('login');
      }
    } catch (x) {
      setErr(x.message);
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    setErr('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setErr('Entre d’abord ton adresse e-mail.');
    try {
      await resetPassword(email.trim());
      setInfo('Si un compte existe, un e-mail pour changer le mot de passe vient d’être envoyé.');
    } catch (x) {
      setErr(x.message);
    }
  };

  return (
    <form onSubmit={submit} className={`auth ${dark ? 'auth--dark' : ''}`} noValidate>
      <div className="auth-tabs" role="tablist">
        <span className="auth-tabs-blob" style={{ transform: `translateX(${mode === 'login' ? 100 : 0}%)` }} aria-hidden="true" />
        <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'is-on' : ''} onClick={() => setMode('signup')}>
          Créer un compte
        </button>
        <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'is-on' : ''} onClick={() => setMode('login')}>
          J’ai un compte
        </button>
      </div>

      <label className="auth-field">
        <Mail className="w-4 h-4" />
        <input type="email" inputMode="email" autoComplete="email" placeholder="ton@email.fr" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="E-mail" />
      </label>
      <label className="auth-field">
        <Lock className="w-4 h-4" />
        <input
          type={show ? 'text' : 'password'}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          placeholder="Mot de passe (6 caractères min.)"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          aria-label="Mot de passe"
        />
        <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </label>

      {err && (
        <p role="alert" className="auth-msg auth-msg--err">
          {err}
        </p>
      )}
      {info && <p className="auth-msg">{info}</p>}

      <button type="submit" disabled={busy} className="app-btn app-btn-ink w-full mt-1">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {mode === 'signup' ? 'Créer mon compte' : 'Me connecter'}
      </button>
      {mode === 'login' && (
        <button type="button" onClick={forgot} className="auth-link">
          Mot de passe oublié ?
        </button>
      )}
    </form>
  );
}
