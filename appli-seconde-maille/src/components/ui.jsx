import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { initials } from '../data/members';

export function Avatar({ pseudo = '?', color = '#18407f', size = 40, ring = false, me = false }) {
  return (
    <span
      className={`inline-grid place-items-center rounded-full font-extrabold text-white shrink-0 ${ring ? 'ring-[3px] ring-white' : ''} ${me ? 'outline outline-2 outline-offset-2 outline-[#18407f]' : ''}`}
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials(pseudo) || '?'}
    </span>
  );
}

export function TopBar({ title, onBack, right, dark = false, transparent = false }) {
  return (
    <header className={`app-topbar ${dark ? 'is-dark' : ''} ${transparent ? 'is-transparent' : ''}`}>
      {onBack ? (
        <button onClick={onBack} className="icon-btn" aria-label="Retour">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : (
        <span className="w-10" />
      )}
      <h1 className="font-display uppercase text-lg tracking-wide truncate">{title}</h1>
      <span className="w-10 flex justify-end">{right}</span>
    </header>
  );
}

export function Pill({ children, tone = 'aqua', className = '' }) {
  const tones = {
    aqua: 'bg-[#a5d2b2] text-[#0F2926]',
    ink: 'bg-[#0F2926] text-[#a5d2b2]',
    blue: 'bg-[#18407f] text-white',
    white: 'bg-white text-[#0F2926] border border-[#a5d2b2]',
    ghost: 'bg-white/10 text-white'
  };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${tones[tone]} ${className}`}>{children}</span>;
}

export function ProgressBar({ value, tone = '#18407f', track = '#e3f1eb', height = 10, animate = true }) {
  const [w, setW] = useState(animate ? 0 : value);
  useEffect(() => {
    const t = requestAnimationFrame(() => setW(value));
    return () => cancelAnimationFrame(t);
  }, [value]);
  return (
    <div className="rounded-full overflow-hidden" style={{ background: track, height }} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${Math.max(0, Math.min(1, w)) * 100}%`, background: tone }} />
    </div>
  );
}

/* Compteur qui défile */
export function Counter({ value, duration = 900 }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const from = v;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{v.toLocaleString('fr-FR')}</>;
}

export function Empty({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center px-8 py-10 gap-3">
      {Icon && (
        <span className="w-14 h-14 rounded-2xl bg-[#F5FBF9] border border-[#a5d2b2] grid place-items-center text-[#18407f]">
          <Icon className="w-6 h-6" />
        </span>
      )}
      <p className="font-extrabold text-[#0F2926]">{title}</p>
      {text && <p className="text-sm text-slate-500 leading-relaxed">{text}</p>}
      {action}
    </div>
  );
}

export const timeAgo = (date) => {
  const s = Math.round((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'à l’instant';
  const m = Math.round(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
};
