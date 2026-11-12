import React, { useState } from 'react';
import { MapPin, Navigation, ShieldCheck, ArrowRight, Loader2, Check, CloudUpload } from 'lucide-react';
import { useStore } from '../state/store';
import { Avatar } from '../components/ui';
import { POPUP } from '../data/places';
import AuthForm from '../components/AuthForm';
import { cloudEnabled } from '../lib/cloud';

const COLORS = ['#18407f', '#18407f', '#0F2926', '#2c5aa8', '#5fbfa6', '#115E59'];

export default function Onboarding() {
  const { state, dispatch, account } = useStore();
  // étapes : 0 bienvenue · 1 compte · 2 localisation · 3 profil
  const [step, setStep] = useState(() => (state.onboarded ? 2 : 0)); // compte retrouvé sur un nouvel appareil -> localisation
  const steps = cloudEnabled ? [0, 1, 2, 3] : [0, 2, 3];
  const next = (from) => setStep(steps[steps.indexOf(from) + 1]);
  const [geo, setGeo] = useState('idle'); // idle | asking | granted | denied | unsupported
  const [pseudo, setPseudo] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const askGeo = () => {
    if (!('geolocation' in navigator)) {
      setGeo('unsupported');
      return;
    }
    setGeo('asking');
    navigator.geolocation.getCurrentPosition(
      () => {
        setGeo('granted');
        setTimeout(() => afterGeo('granted'), 700);
      },
      (e) => setGeo(e.code === 1 ? 'denied' : 'unsupported'),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // si le profil vient du compte, on s'arrête après la localisation
  const afterGeo = (value) => {
    if (state.onboarded) dispatch({ type: 'geo', value });
    else setStep(3);
  };

  const finish = () =>
    dispatch({
      type: 'onboard',
      geoChoice: geo === 'granted' ? 'granted' : 'skipped',
      profile: { pseudo: pseudo.trim() || 'Maille_' + Math.floor(Math.random() * 900 + 100), color }
    });

  return (
    <div className="onb">
      <div className="onb-dots" aria-hidden="true">
        {steps.map((i) => (
          <span key={i} className={i === step ? 'is-on' : i < step ? 'is-done' : ''} />
        ))}
      </div>

      {step === 0 && (
        <section key="s0" className="onb-step">
          <div className="onb-hero onb-hero--logo">
            <span className="onb-wave" />
            <img src="/brand/vaquita-mascotte.png" alt="" className="onb-mascot" />
          </div>
          <img src="/brand/seconde-maille-logo.png" alt="Seconde Maille" className="h-16 mx-auto mt-2" />
          <p className="text-center text-[#0F2926]/75 font-semibold leading-relaxed mt-5 px-2">
            Dépose tes matières dans les box, gagne des points à chaque pesée et utilise-les au pop-up du <strong className="text-[#0F2926]">20 mars 2027</strong>.
          </p>
          <div className="mt-auto">
            <button onClick={() => next(0)} className="app-btn app-btn-ink w-full">
              C’est parti <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section key="s-acc" className="onb-step">
          <div className="flex flex-col items-center mt-4">
            <span className="w-20 h-20 rounded-[28px] bg-[#0F2926] text-[#a5d2b2] grid place-items-center">
              <CloudUpload className="w-9 h-9" />
            </span>
            <h1 className="font-display uppercase text-[34px] leading-[0.95] text-[#0F2926] text-center mt-5">Ton compte</h1>
            <p className="text-sm text-[#0F2926]/65 text-center mt-2 leading-relaxed">
              Tes points, ta série et tes récompenses sont sauvegardés sur ton compte : tu les retrouves sur n’importe quel téléphone.
            </p>
          </div>
          <div className="mt-6">
            <AuthForm onDone={() => setStep(2)} />
          </div>
          <div className="mt-auto pt-4">
            <button onClick={() => setStep(2)} className="app-btn app-btn-ghost w-full">
              Continuer sans compte
            </button>
            <p className="text-[11px] text-[#0F2926]/50 text-center mt-2">Sans compte, ta progression reste sur cet appareil. Tu pourras en créer un plus tard depuis le Pass.</p>
          </div>
        </section>
      )}

      {step === 2 && (
        <section key="s1" className="onb-step">
          <div className="onb-hero">
            <span className="gps-ring" />
            <span className="gps-ring" style={{ animationDelay: '0.8s' }} />
            <span className="gps-ring" style={{ animationDelay: '1.6s' }} />
            <span className="onb-pin">
              {geo === 'granted' ? <Check className="w-9 h-9" /> : <MapPin className="w-9 h-9" />}
            </span>
          </div>
          <h1 className="font-display uppercase text-[34px] leading-[0.95] text-[#0F2926] text-center mt-2">Active ta localisation</h1>
          <ul className="mt-6 space-y-3">
            {[
              [Navigation, 'Voir la box la plus proche et la distance qui t’en sépare'],
              [MapPin, 'Être guidé·e pas à pas jusqu’à une box ou au pop-up de Lille'],
              [ShieldCheck, 'Ta position reste sur ton téléphone : elle n’est ni partagée ni enregistrée']
            ].map(([Icon, t]) => (
              <li key={t} className="flex gap-3 items-start p-3 rounded-2xl bg-white border border-[#a5d2b2]">
                <span className="w-9 h-9 rounded-xl bg-[#F5FBF9] text-[#18407f] grid place-items-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold text-[#0F2926] leading-snug pt-1">{t}</span>
              </li>
            ))}
          </ul>
          {geo === 'denied' && (
            <p role="alert" className="text-xs text-[#18407f] font-semibold mt-4 text-center leading-relaxed">
              Localisation refusée. Tu peux continuer : les distances seront calculées depuis Lille-Centre. Tu pourras l’activer plus tard dans les réglages.
            </p>
          )}
          {geo === 'unsupported' && <p className="text-xs text-[#18407f] font-semibold mt-4 text-center">La localisation n’est pas disponible sur cet appareil.</p>}
          <div className="mt-auto space-y-2.5 pt-4">
            {geo !== 'denied' && geo !== 'unsupported' ? (
              <button onClick={askGeo} disabled={geo === 'asking' || geo === 'granted'} className="app-btn app-btn-ink w-full">
                {geo === 'asking' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                {geo === 'asking' ? 'En attente de ton accord…' : geo === 'granted' ? 'Localisation activée' : 'Activer la localisation'}
              </button>
            ) : (
              <button onClick={() => afterGeo('skipped')} className="app-btn app-btn-ink w-full">
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {geo === 'idle' && (
              <button onClick={() => afterGeo('skipped')} className="app-btn app-btn-ghost w-full">
                Plus tard
              </button>
            )}
          </div>
        </section>
      )}

      {step === 3 && (
        <section key="s2" className="onb-step">
          <div className="flex flex-col items-center mt-6">
            <Avatar pseudo={pseudo || 'SM'} color={color} size={96} />
            <h1 className="font-display uppercase text-[34px] leading-[0.95] text-[#0F2926] text-center mt-6">Ton profil</h1>
            <p className="text-sm text-[#0F2926]/65 text-center mt-2">C’est le nom que verront les autres membres dans les ligues.</p>
          </div>
          <label className="block mt-7">
            <span className="text-xs font-extrabold text-[#0F2926]">Pseudo</span>
            <input
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value.slice(0, 16))}
              placeholder="ex. Léa_59"
              className="app-input mt-2"
              autoComplete="nickname"
            />
          </label>
          <div className="mt-5">
            <span className="text-xs font-extrabold text-[#0F2926]">Couleur</span>
            <div className="flex gap-3 mt-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Couleur ${c}`}
                  aria-pressed={c === color}
                  className={`w-10 h-10 rounded-full transition-transform ${c === color ? 'ring-4 ring-[#a5d2b2] scale-110' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-[#0F2926]/55 mt-6 leading-relaxed">
            Pop-up : {POPUP.dateLabel}, {POPUP.address}.
          </p>
          <div className="mt-auto pt-4">
            <button onClick={finish} className="app-btn app-btn-ink w-full">
              Entrer dans l’appli <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
