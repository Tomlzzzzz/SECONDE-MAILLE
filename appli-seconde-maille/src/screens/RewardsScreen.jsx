import React, { useState } from 'react';
import { Coffee, Gift, Percent, Package, Sparkles, X, QrCode, MapPin, CalendarDays, Lock, RotateCcw, CloudUpload, LogOut, RefreshCw } from 'lucide-react';
import { TopBar, Counter, ProgressBar, Pill, Avatar } from '../components/ui';
import QrImage from '../components/QrImage';
import Portal from '../components/Portal';
import { useStore } from '../state/store';
import { REWARDS } from '../data/rewards';
import { POPUP } from '../data/places';
import { randomNonce } from '../lib/points';
import AuthForm from '../components/AuthForm';
import { timeAgo } from '../components/ui';

const ICONS = { cafe: Coffee, goodie: Gift, merch10: Percent, pack15: Package, all20: Sparkles };

function QrModal({ title, sub, code, onClose }) {
  return (
    <Portal>
    <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="modal-card pop-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 icon-btn" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#194080]">À présenter en caisse</p>
        <p className="font-display uppercase text-2xl leading-none text-[#0F2926] mt-1 pr-10">{title}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        <div className="flex justify-center mt-5">
          <QrImage text={code} size={210} className="border-2 border-[#0F2926]" />
        </div>
        <p className="text-center font-mono text-sm font-bold text-[#0F2926] mt-3 tracking-wider">{code}</p>
        <p className="text-center text-[11px] text-slate-500 mt-3">Monte la luminosité de ton écran pour faciliter le scan.</p>
      </div>
    </div>
    </Portal>
  );
}

const SYNC_LABEL = {
  syncing: 'Synchronisation…',
  saved: 'Progression sauvegardée',
  offline: 'Hors ligne : envoi au retour du réseau',
  error: 'Échec de la sauvegarde',
  off: 'Non connecté'
};

function AccountCard({ onAuth }) {
  const { account, balance } = useStore();
  if (!account.enabled) return null;
  const { user, sync } = account;
  if (!user)
    return (
      <section className="mx-4 mt-5 p-4 rounded-3xl bg-[#0F2926] text-white">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-2xl bg-[#bae3d1] text-[#0F2926] grid place-items-center shrink-0">
            <CloudUpload className="w-5 h-5" />
          </span>
          <div>
            <p className="text-sm font-extrabold">Ta progression n’est que sur ce téléphone</p>
            <p className="text-[12px] text-white/70 mt-1">Crée un compte pour sauvegarder tes {balance} pts, ta série et tes récompenses, et les retrouver partout.</p>
          </div>
        </div>
        <button onClick={onAuth} className="app-btn app-btn-aqua w-full mt-4">
          Créer un compte / Se connecter
        </button>
      </section>
    );
  return (
    <section className="mx-4 mt-5 p-4 rounded-3xl bg-white border border-[#bae3d1]">
      <p className="text-xs font-extrabold text-[#0F2926]">Mon compte</p>
      <p className="text-sm text-[#0F2926] mt-1 truncate">{user.email}</p>
      <div className="flex items-center gap-2 mt-2 text-[12px] text-slate-600">
        <span className={`sync-dot is-${sync.status}`} />
        <span className="flex-1 min-w-0 truncate">
          {SYNC_LABEL[sync.status]}
          {sync.status === 'saved' && sync.at ? ` · ${timeAgo(new Date(sync.at))}` : ''}
          {sync.status === 'error' && sync.message ? ` · ${sync.message}` : ''}
        </span>
        <button onClick={account.syncNow} className="icon-btn !w-8 !h-8" aria-label="Synchroniser maintenant">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        onClick={() => window.confirm('Te déconnecter ? Ta progression reste sur ton compte et cet appareil est vidé.') && account.logout()}
        className="app-btn app-btn-ghost w-full mt-3"
      >
        <LogOut className="w-4 h-4" /> Me déconnecter
      </button>
    </section>
  );
}

export default function RewardsScreen() {
  const { state, dispatch, balance, account } = useStore();
  const [confirm, setConfirm] = useState(null);
  const [auth, setAuth] = useState(false);
  const [show, setShow] = useState(null); // { title, sub, code }
  const passCode = `SM-PASS|${state.memberId}|${state.profile.pseudo}`;
  const days = Math.max(0, Math.ceil((POPUP.date - Date.now()) / 864e5));

  const redeem = (r) => {
    const code = `SM-${r.id.toUpperCase()}-${randomNonce(6)}`;
    const v = { id: `v${Date.now()}`, rewardId: r.id, title: r.title, cost: r.cost, code, date: new Date().toISOString() };
    dispatch({ type: 'redeem', voucher: v });
    setConfirm(null);
    setShow({ title: r.title, sub: `Valable au pop-up · ${POPUP.dateLabel}`, code });
  };

  return (
    <div className="h-full flex flex-col bg-[#F5FBF9]">
      <TopBar title="Pass Pop-Up" />
      <div className="flex-1 overflow-y-auto pb-28">
        {/* pass */}
        <section className="mx-4 mt-1">
          <button onClick={() => setShow({ title: 'Pass Membre', sub: `${state.profile.pseudo} · ${state.memberId}`, code: passCode })} className="pass-card w-full text-left">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#bae3d1]">Pass Membre</p>
                <img src="/brand/seconde-maille-logo-light.png" alt="Seconde Maille" className="h-10 mt-2" />
              </div>
              <Avatar pseudo={state.profile.pseudo} color={state.profile.color} size={40} ring />
            </div>
            <div className="flex items-end justify-between gap-3 mt-5">
              <div className="space-y-1.5 text-xs min-w-0">
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#bae3d1]" /> {POPUP.dateLabel} · J-{days}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#bae3d1] shrink-0" /> 17 bd Jean-Baptiste Lebas, Lille
                </p>
                <p className="text-white/60">Entrée : un matériau déposé</p>
              </div>
              <span className="pass-qr">
                <QrCode className="w-8 h-8" />
              </span>
            </div>
            <span className="pass-notch pass-notch--l" />
            <span className="pass-notch pass-notch--r" />
          </button>
        </section>

        {/* solde */}
        <section className="mx-4 mt-4 p-4 rounded-3xl bg-white border border-[#bae3d1] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#194080]">Mon solde</p>
            <p className="font-display text-5xl leading-none text-[#0F2926] mt-1">
              <Counter value={balance} /> <span className="text-xl">pts</span>
            </p>
          </div>
          <img src="/brand/vaquita-mascotte.png" alt="" className="w-16 wiggle" />
        </section>

        {/* catalogue */}
        <section className="mx-4 mt-5">
          <p className="text-xs font-extrabold text-[#0F2926] mb-2">Utiliser mes points au pop-up</p>
          <ul className="space-y-2">
            {REWARDS.map((r) => {
              const Icon = ICONS[r.id] || Gift;
              const ok = balance >= r.cost;
              return (
                <li key={r.id} className={`reward ${ok ? 'is-ok' : ''}`}>
                  <span className="reward-ic">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-[#0F2926]">{r.title}</p>
                    <p className="text-[11px] text-slate-500">{r.detail}</p>
                    {!ok && (
                      <div className="mt-1.5">
                        <ProgressBar value={balance / r.cost} height={5} />
                        <p className="text-[10px] text-slate-400 mt-1">encore {r.cost - balance} pts</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => ok && setConfirm(r)} disabled={!ok} className={`reward-btn ${ok ? 'is-ok' : ''}`}>
                    {ok ? null : <Lock className="w-3 h-3" />} {r.cost}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* mes récompenses */}
        <section className="mx-4 mt-5">
          <p className="text-xs font-extrabold text-[#0F2926] mb-2">Mes récompenses</p>
          {state.vouchers.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 rounded-2xl bg-white border border-dashed border-[#bae3d1] text-center">
              Échange tes points : la récompense apparaît ici avec son QR code, à montrer en caisse le jour du pop-up.
            </p>
          ) : (
            <ul className="space-y-2">
              {state.vouchers.map((v) => (
                <li key={v.id}>
                  <button onClick={() => setShow({ title: v.title, sub: `Valable au pop-up · ${POPUP.dateLabel}`, code: v.code })} className="voucher">
                    <QrCode className="w-6 h-6 text-[#194080]" />
                    <span className="flex-1 min-w-0 text-left">
                      <span className="block text-sm font-extrabold text-[#0F2926] truncate">{v.title}</span>
                      <span className="block text-[10px] font-mono text-slate-500">{v.code}</span>
                    </span>
                    <Pill tone="aqua">Afficher</Pill>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <AccountCard onAuth={() => setAuth(true)} />

        {!account.user && (
          <div className="mx-4 mt-5 text-center">
            <button
              onClick={() => {
                if (window.confirm('Réinitialiser l’appli sur cet appareil ? (profil, dépôts et points)')) dispatch({ type: 'reset' });
              }}
              className="text-[11px] font-bold text-slate-400 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Réinitialiser cet appareil
            </button>
          </div>
        )}
      </div>

      {confirm && (
        <Portal>
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setConfirm(null)}>
          <div className="modal-card pop-in" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#194080]">Confirmer l’échange</p>
            <p className="font-display uppercase text-2xl leading-none text-[#0F2926] mt-1">{confirm.title}</p>
            <p className="text-sm text-slate-600 mt-3">
              <strong>{confirm.cost} pts</strong> seront retirés de ton solde ({balance} → {balance - confirm.cost}). Ta ligue ne change pas.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <button onClick={() => setConfirm(null)} className="app-btn app-btn-ghost">
                Annuler
              </button>
              <button onClick={() => redeem(confirm)} className="app-btn app-btn-ink">
                Échanger
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
      {show && <QrModal {...show} onClose={() => setShow(null)} />}
      {auth && (
        <Portal>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Compte" onClick={() => setAuth(false)}>
            <div className="modal-card pop-in" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setAuth(false)} className="absolute right-3 top-3 icon-btn" aria-label="Fermer">
                <X className="w-5 h-5" />
              </button>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#194080]">Sauvegarder ma progression</p>
              <p className="font-display uppercase text-2xl leading-none text-[#0F2926] mt-1 mb-4 pr-10">Mon compte</p>
              <AuthForm pseudo={state.profile.pseudo} onDone={() => setAuth(false)} />
              <p className="text-[11px] text-slate-500 mt-3">Tes points actuels sont ajoutés à ton compte, rien n’est perdu.</p>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
