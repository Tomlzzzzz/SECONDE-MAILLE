import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Reveal, SplitText, useInView, WaveDivider } from './Motion';
import { SITE_PAGES } from '../data/siteContent';

/* Étiquette de section numérotée avec un trait de corde qui se dessine */
export function SectionLabel({ num, children, light = false, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.6 });
  return (
    <div ref={ref} className={`flex items-center gap-3 ${className}`}>
      <span className={`font-display text-sm ${light ? 'text-[#a5d2b2]' : 'text-[#18407f]'}`}>{num}</span>
      <svg className={`rope-line ${inView ? 'is-in' : ''} w-14 h-2 shrink-0`} viewBox="0 0 56 8" aria-hidden="true">
        <path d="M1 4 Q8 0 14 4 T28 4 T42 4 T55 4" pathLength="1" fill="none" stroke={light ? '#a5d2b2' : '#0F2926'} strokeWidth="1.6" />
      </svg>
      <span className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${light ? 'text-white/80' : 'text-[#0F2926]/70'}`}>
        {children}
      </span>
    </div>
  );
}

/* Contenu texte dans le ciel du hero compact des pages internes */
export function PageHeroCopy({ page, title, onBack }) {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
      <div>
        <div className="hero-intro" style={{ animationDelay: '150ms' }}>
          <SectionLabel num={page.num}>{page.label}</SectionLabel>
        </div>
        <h1 className="font-display uppercase text-[#0F2926] leading-[0.9] mt-4 text-[clamp(40px,min(6.4vw,11vh),96px)] md:max-w-[62%] lg:max-w-[60%]">
          {title.map((line, i) => (
            <React.Fragment key={i}>
            {i > 0 && ' '}
            <span className="split-mask" style={{ display: 'block', whiteSpace: 'normal' }}>
              <span className="hero-line" style={{ display: 'block', animationDelay: `${250 + i * 110}ms` }}>
                {line}
              </span>
            </span>
            </React.Fragment>
          ))}
        </h1>
      </div>
    </div>
  );
}

/* Paragraphe d'introduction sous le hero */
export function PageLead({ children, aside }) {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 lg:py-24 grid lg:grid-cols-12 gap-8 lg:gap-10 items-end">
        <Reveal className="lg:col-span-8">
          <div className="text-lg sm:text-2xl lg:text-[26px] leading-[1.5] text-[#0F2926] font-medium">{children}</div>
        </Reveal>
        {aside && (
          <Reveal direction="right" delay={150} className="lg:col-span-4 lg:justify-self-end">
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* Grand bandeau "page suivante" en bas de chaque page */
export function NextBand({ activePage, onNavigate }) {
  const idx = SITE_PAGES.findIndex((p) => p.id === activePage);
  const next = SITE_PAGES[(idx + 1) % SITE_PAGES.length];
  const isLoop = idx === SITE_PAGES.length - 1;
  return (
    <section className="bg-[#18407f]">
      <button
        onClick={() => onNavigate(next.id)}
        className="next-band w-full text-left block"
        data-cursor={isLoop ? 'Retour' : 'Suivant'}
      >
        <div className="next-band-fill" aria-hidden="true">
          <svg viewBox="0 0 1200 50" preserveAspectRatio="none">
            <path d="M0,50 L0,25 C200,0 400,0 600,25 C800,50 1000,50 1200,25 L1200,50 Z" fill="#a5d2b2" />
          </svg>
          <div />
        </div>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 pb-10 lg:pt-24 lg:pb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="next-sub text-xs font-extrabold uppercase tracking-[0.2em] text-[#a5d2b2] transition-colors duration-500">
              {isLoop ? 'Retour au début' : 'Page suivante'} — {next.num}
            </p>
            <p className="next-title font-display uppercase text-white text-[clamp(44px,8.5vw,128px)] leading-[0.9] mt-3">
              {next.label}
            </p>
          </div>
          <span className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full border-2 border-current text-[#a5d2b2] grid place-items-center shrink-0 next-sub transition-colors duration-500">
            <ArrowRight className="w-8 h-8" />
          </span>
        </div>
        {/* vague de transition vers le footer : posée AU-DESSUS du remplissage → raccord propre au survol */}
        <WaveDivider color="#F5FBF9" className="next-band-wave" />
      </button>
    </section>
  );
}

/* Petite carte statistique */
export function StatTile({ value, label, light = false }) {
  return (
    <div className={`p-6 rounded-[28px] ${light ? 'bg-white/[0.06] border border-white/10' : 'bg-[#F5FBF9] border border-[#a5d2b2]'}`}>
      <div className={`font-display text-5xl lg:text-6xl leading-none ${light ? 'text-[#a5d2b2]' : 'text-[#0F2926]'}`}>{value}</div>
      <p className={`text-sm mt-3 leading-snug ${light ? 'text-white/70' : 'text-slate-600'}`}>{label}</p>
    </div>
  );
}

export function ExternalPill({ href, children, dark = false }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`btn btn-sm ${dark ? 'btn-ink' : 'btn-ghost'}`}>
      {children}
      <ArrowUpRight className="w-3.5 h-3.5 btn-arrow" />
    </a>
  );
}
