import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown, MapPin, Package, CalendarDays, Clock, Ticket, Navigation } from 'lucide-react';
import OceanDive from '../components/OceanDive';
import StreetScene from '../components/street/StreetScene';
import { Reveal, SplitText, CountUp, Magnetic, TiltCard, WaveDivider, VelocityMarquee, useElementProgress, useReduce } from '../components/Motion';
import { SectionLabel } from '../components/Blocks';
import { SecondeMailleLogo, Mascot } from '../components/Brand';
import { SITE_PAGES, TICKER_ITEMS, STORY_INTRO, STORY_CHAPTERS, NAME_ORIGIN, STEPS, OBJECTIVES, EVENT } from '../data/siteContent';

const PAGE_BLURBS = {
  marques: 'Un média engagé et une marque d’upcycling : pourquoi elles se complètent.',
  'appli-box': 'Les box de dépôt de matériaux, disponibles dès le 20 janvier 2027.',
  'popup-merch': 'L’inauguration du 20 mars 2027 à Roubaix, le plan et le programme.',
  reportages: 'Le vaquita, les filets abandonnés et la seconde vie des matières.'
};



const daysUntil = (d) => Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [query]);
  return match;
}

/* ---------- Ticker incliné ---------- */
function TickerBand() {
  return (
    <div className="relative -mx-[3%] -rotate-2 bg-[#bae3d1] text-[#0F2926] py-3 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]" role="region" aria-label="Annonces Seconde Maille">
      <div className="overflow-hidden">
        <div className="animate-ticker">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1 ? 'true' : undefined}>
              {TICKER_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-6 whitespace-nowrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#194080] text-white font-extrabold text-[10px] tracking-wider uppercase">{item.badge}</span>
                  <span className="text-xs font-bold tracking-wide">{item.text}</span>
                  <span className="text-[#0F2926]/40" aria-hidden="true">✺</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Le récit en 5 temps : la mascotte nage le long du fil ---------- */
function StoryLine() {
  const ref = useRef(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf;
    const update = () => {
      raf = null;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const v = (window.innerHeight * 0.55 - r.top) / r.height;
      setP(Math.max(0, Math.min(1, v)));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* fil (à gauche sur mobile, au centre sur grand écran) */}
      <div className="absolute top-0 bottom-0 left-[27px] md:left-1/2 w-[3px] -ml-[1.5px] rounded-full bg-white/10" aria-hidden="true">
        <div className="w-full rounded-full bg-gradient-to-b from-[#bae3d1] to-[#5b7fc4] origin-top" style={{ height: '100%', transform: `scaleY(${p})` }} />
      </div>
      <div className="story-swimmer hidden md:block" style={{ top: `calc(${p * 100}% - 28px)` }} aria-hidden="true">
        <Mascot />
      </div>
      <div className="story-swimmer md:hidden" style={{ top: `calc(${p * 100}% - 22px)`, left: 28, width: 44, marginLeft: -22 }} aria-hidden="true">
        <Mascot />
      </div>

      <ol className="space-y-10 md:space-y-16">
        {STORY_CHAPTERS.map((c, i) => {
          const left = i % 2 === 0;
          return (
            <li key={c.num} className="relative grid md:grid-cols-2 md:gap-16 pl-16 md:pl-0">
              <span
                className={`absolute left-[27px] md:left-1/2 top-6 w-4 h-4 -ml-2 rounded-full border-[3px] transition-colors duration-500 ${
                  p > (i + 0.3) / STORY_CHAPTERS.length ? 'bg-[#bae3d1] border-[#bae3d1]' : 'bg-[#0F2926] border-white/30'
                }`}
                aria-hidden="true"
              />
              <Reveal direction={left ? 'left' : 'right'} className={left ? 'md:col-start-1' : 'md:col-start-2'}>
                <div className="story-card p-6 sm:p-8 rounded-[28px]">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-4xl sm:text-5xl text-[#bae3d1]">{c.num}</span>
                    <h3 className="font-display uppercase text-xl min-[380px]:text-2xl sm:text-3xl text-white">{c.title}</h3>
                  </div>
                  <p className="text-white/75 leading-relaxed mt-4">{c.text}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Les 5 temps : défilement horizontal piloté par le scroll ---------- */
function StepCard({ step }) {
  return (
    <TiltCard className="w-[78vw] max-w-[360px] sm:w-[380px] sm:max-w-none lg:w-[400px] h-full rounded-[32px] bg-white border border-[#bae3d1] p-7 sm:p-8 flex flex-col justify-between overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="font-display text-[clamp(64px,8vh,96px)] leading-[0.8] text-transparent" style={{ WebkitTextStroke: '1.5px #194080' }} aria-hidden="true">
            {step.number}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#F5FBF9] border border-[#bae3d1] text-[10px] font-extrabold uppercase tracking-wider text-[#194080] text-right">
            {step.tag}
          </span>
        </div>
        <p className="font-display uppercase text-4xl text-[#0F2926] mt-5">{step.verb}</p>
        <h3 className="text-lg font-extrabold text-[#0D9488] mt-1">{step.title}</h3>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed mt-5">{step.description}</p>
    </TiltCard>
  );
}

function StepsRiver() {
  const reduce = useReduce();
  const canPin = useMedia('(min-width: 1024px) and (min-height: 680px)');
  const pinned = canPin && !reduce;
  const outer = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const p = useElementProgress(outer, 'pin');

  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const t = track.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 48));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  const header = (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <SectionLabel num="04">Les 5 temps du projet</SectionLabel>
        <SplitText as="h2" text="Collecter, fabriquer, vendre, se retrouver, raconter." className="font-display uppercase text-[clamp(30px,3.4vw,52px)] leading-[0.95] text-[#0F2926] mt-5 max-w-4xl" />
      </div>
      {pinned && (
        <div className="flex items-center gap-3 text-xs font-extrabold text-[#0F2926]/60 shrink-0" aria-hidden="true">
          <span>Faites défiler</span>
          <div className="w-32 h-[3px] rounded-full bg-[#bae3d1] overflow-hidden">
            <div className="h-full bg-[#194080] origin-left" style={{ transform: `scaleX(${p})` }} />
          </div>
        </div>
      )}
    </div>
  );

  if (!pinned) {
    return (
      <section className="bg-[#F5FBF9] py-20">
        {header}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 mt-10">
          <div className="slider -mx-5 px-5 sm:mx-0 sm:px-1">
            {STEPS.map((s) => (
              <div key={s.number} className="h-[400px]">
                <StepCard step={s} />
              </div>
            ))}
          </div>
          <p className="text-xs text-[#0F2926]/50 mt-1 sm:hidden">← Glissez pour voir les 5 temps →</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={outer} className="bg-[#F5FBF9] relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center gap-8 pt-16">
        {header}
        <div className="relative">
          <svg className="absolute left-0 top-1/2 -translate-y-1/2 h-24 pointer-events-none" style={{ width: dist + window.innerWidth }} viewBox="0 0 2000 100" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 50 C 100 10, 200 90, 300 50 S 500 10, 600 50 S 800 90, 900 50 S 1100 10, 1200 50 S 1400 90, 1500 50 S 1700 10, 1800 50 S 1950 80, 2000 50"
              fill="none"
              stroke="#194080"
              strokeWidth="2"
              strokeDasharray="1"
              pathLength="1"
              strokeDashoffset={1 - p}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div
            ref={track}
            className="relative flex gap-7 pl-[max(32px,calc((100vw-80rem)/2+32px))] pr-8 h-[min(430px,52vh)] will-change-transform"
            style={{ transform: `translate3d(${-p * dist}px,0,0)` }}
          >
            {STEPS.map((s, i) => (
              <div key={s.number} className="h-full shrink-0" style={{ transform: `translateY(${Math.sin(p * 6 + i) * 10}px)` }}>
                <StepCard step={s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({ onNavigate }) {
  const [first, ...restIntro] = STORY_INTRO;
  const parts = first.split('. ');
  const firstSentences = parts.slice(1, 3).join('. ') + '.';
  const firstRest = parts.slice(3).join('. ');

  return (
    <>
      {/* ==================== HEADER : LA BOUTIQUE À ROUBAIX ==================== */}
      <StreetScene variant="full" bigTitle="Seconde Maille" onBoxClick={() => onNavigate('appli-box')} waveColor="#CFEDE0">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="w-fit max-w-full">
            <h1 className="font-display uppercase text-[#0F2926] leading-[0.9] text-[clamp(34px,min(4.3vw,7.2vh),70px)]">
              <span className="split-mask" style={{ display: 'block', whiteSpace: 'normal' }}>
                <span className="hero-line" style={{ display: 'block', whiteSpace: 'nowrap', animationDelay: '200ms' }}>Le Pop-Up Store</span>
              </span>
              <span className="sr-only"> Seconde Maille</span>
            </h1>
            <ul data-title-anchor className="hero-intro mt-4 sm:mt-5 space-y-1.5 sm:space-y-2 text-[15px] sm:text-base text-[#0F2926]" style={{ animationDelay: '450ms' }}>
              <li className="flex items-start gap-2.5">
                <CalendarDays className="w-4 h-4 mt-1 shrink-0 text-[#194080]" />
                <span>
                  <strong>{EVENT.dateLabel}</strong> <span className="text-[#194080] font-bold">· J-{daysUntil(EVENT.date)}</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-1 shrink-0 text-[#194080]" />
                <span>{EVENT.street}, <span className="whitespace-nowrap">{EVENT.city}</span></span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-1 shrink-0 text-[#194080]" />
                <span>{EVENT.hours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Ticket className="w-4 h-4 mt-1 shrink-0 text-[#194080]" />
                <span>Entrée : <strong>un matériau déposé</strong></span>
              </li>
            </ul>
            <div className="hero-intro flex flex-wrap gap-2.5 mt-5 sm:mt-6" style={{ animationDelay: '600ms' }}>
              <Magnetic>
                <button onClick={() => onNavigate('popup-merch')} className="btn btn-ink btn-sm sm:!py-3.5 sm:!px-5">
                  <Navigation className="w-3.5 h-3.5" /> Plan & itinéraire
                </button>
              </Magnetic>
              <Magnetic>
                <button onClick={() => onNavigate('appli-box')} className="btn btn-ghost btn-sm sm:!py-3.5 sm:!px-5">
                  Box dès le 20.01 <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </StreetScene>

      {/* ==================== LA PLONGÉE : récit + sous la surface, sur la scène marine ==================== */}
      <OceanDive>
        {/* LE RÉCIT — commence à la surface */}
        <section id="histoire" className="relative">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-[16vh] pb-24 lg:pb-32">
            <div className="text-center max-w-4xl mx-auto mb-[34vh] md:mb-[38vh]">
              <SectionLabel num="01" className="justify-center">
                Le récit
              </SectionLabel>
              <SplitText as="h2" text="Tout commence par un filet de pêche abandonné." className="font-display uppercase text-[#0F2926] text-[clamp(34px,5.4vw,80px)] leading-[0.92] mt-6" />
              <Reveal delay={200}>
                <p className="text-[#0F2926]/75 font-bold mt-5 text-base sm:text-lg">L’histoire d’une maille, en 5 temps — descendez pour plonger.</p>
              </Reveal>
            </div>
            <StoryLine />
          </div>
        </section>

        {/* SOUS LA SURFACE — au fond, dans le bleu */}
        <section id="plongee" className="relative text-white">
        <div className="pt-6">
          <TickerBand />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-20 pb-20 lg:pt-28 lg:pb-28">
          <SectionLabel num="02" light>
            Sous la surface
          </SectionLabel>
          <SplitText as="h2" text={firstSentences} className="text-[clamp(28px,4.4vw,62px)] leading-[1.08] font-extrabold tracking-tight mt-8 max-w-5xl" stagger={26} />
          <div className="grid md:grid-cols-2 gap-6 md:gap-12 mt-10 lg:mt-14 text-white/75 text-base sm:text-lg leading-relaxed">
            <Reveal>
              <p>{firstRest}</p>
              <p className="mt-5">{restIntro[0]}</p>
            </Reveal>
            <Reveal delay={150}>
              <p>{restIntro[1]}</p>
              <p className="mt-5 text-white font-bold">{restIntro[2]}</p>
            </Reveal>
          </div>

          {/* repères clés */}
          <div className="grid sm:grid-cols-3 gap-4 mt-14 lg:mt-20">
            {[
              { icon: Package, top: 'Box de dépôt', value: '20.01.2027', sub: <>dans <CountUp to={daysUntil(EVENT.boxDate)} /> jours</> },
              { icon: CalendarDays, top: 'Inauguration du pop-up', value: EVENT.dateShort, sub: <>dans <CountUp to={daysUntil(EVENT.date)} /> jours</> },
              { icon: MapPin, top: 'Lieu', value: 'Roubaix', sub: EVENT.street }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={i} delay={i * 110}>
                  <div className="h-full p-6 sm:p-7 rounded-[28px] bg-white/[0.06] border border-white/10 hover:border-[#bae3d1]/40 transition-colors duration-500">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#bae3d1] flex items-center gap-2">
                      <Icon className="w-4 h-4" /> {s.top}
                    </p>
                    <p className="font-display text-[clamp(36px,4vw,56px)] leading-none mt-4">{s.value}</p>
                    <p className="text-sm text-white/65 mt-2">{s.sub}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
        </section>
        <WaveDivider color="#FFFFFF" />
      </OceanDive>

      {/* ==================== LE NOM ==================== */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <SectionLabel num="03">Pourquoi « Seconde Maille » ?</SectionLabel>
            <Reveal direction="scale" className="mt-8">
              <div className="relative inline-block">
                <SecondeMailleLogo className="h-auto w-[min(100%,420px)]" />
                <Mascot className="absolute right-0 bottom-0 w-[17%] min-w-[52px] translate-x-1/4 rotate-12 hover:rotate-0 hover:scale-110 transition-transform duration-500" />
              </div>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-slate-600 leading-relaxed mt-8 max-w-md">
                L’idée : rassembler Vakita et La Vie est Belt autour d’un même événement, d’un même produit, chargés de sens.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {NAME_ORIGIN.map((n, i) => (
              <Reveal key={n.word} delay={i * 140}>
                <TiltCard max={4} className={`h-full p-7 sm:p-8 rounded-[32px] border ${i === 1 ? 'bg-[#a4d2b3]/35 border-[#a4d2b3]' : 'bg-[#F5FBF9] border-[#bae3d1]'}`}>
                  <p className="font-display uppercase text-[clamp(36px,3.6vw,56px)] leading-none text-[#0F2926]">{n.word}</p>
                  <ul className="mt-6 space-y-3">
                    {n.meanings.map((m) => (
                      <li key={m} className="flex items-start gap-3 text-[#0F2926] font-bold">
                        <span className="mt-2 w-2 h-2 rounded-full bg-[#194080] shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </Reveal>
            ))}
            <Reveal delay={260} className="sm:col-span-2">
              <div className="p-6 sm:p-7 rounded-[28px] bg-[#194080] text-white">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#bae3d1]">Nos objectifs</p>
                <ul className="grid sm:grid-cols-3 gap-4 mt-4">
                  {OBJECTIVES.map((o, i) => (
                    <li key={o} className="flex gap-3">
                      <span className="font-display text-2xl text-[#bae3d1] leading-none">0{i + 1}</span>
                      <span className="text-sm font-semibold leading-snug">{o}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==================== LA BOUTIQUE (aperçu) ==================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 lg:pb-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <SectionLabel num="★">À la boutique éphémère</SectionLabel>
              <SplitText as="h2" text="Le merch et le starter pack." className="font-display uppercase text-[clamp(34px,5vw,72px)] leading-[0.95] text-[#0F2926] mt-5" />
            </div>
            <Reveal direction="right">
              <p className="text-slate-600 max-w-sm">En vente au pop-up le 20 mars 2027. Les tailles disponibles sont visibles en direct sur le site.</p>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { k: 'merch', title: 'Le merch', sub: 'T-shirt, sweat, casquette, chaussettes', img: `${import.meta.env?.BASE_URL ?? '/'}products/tshirt-blanc-1.webp`, tone: 'bg-[#F5FBF9] text-[#0F2926]' },
              { k: 'starter-pack', title: 'Le starter pack', sub: '7 objets pour remplacer le jetable', img: `${import.meta.env?.BASE_URL ?? '/'}products/tote-bag.webp`, tone: 'bg-[#194080] text-white' }
            ].map((c, i) => (
              <Reveal key={c.k} delay={i * 120} className="h-full">
                <button onClick={() => onNavigate('popup-merch', c.k)} className={`group w-full h-full text-left rounded-[32px] overflow-hidden grid grid-cols-5 ${c.tone}`} data-cursor="Voir">
                  <div className="col-span-3 p-6 sm:p-8 flex flex-col justify-between gap-8">
                    <div>
                      <p className="font-display uppercase text-[clamp(30px,3.4vw,48px)] leading-[0.9]">{c.title}</p>
                      <p className="text-sm font-bold opacity-75 mt-3">{c.sub}</p>
                    </div>
                    <span className="index-arrow w-12 h-12 rounded-full border-2 border-current grid place-items-center transition-transform duration-500 group-hover:translate-x-2">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="col-span-2 relative min-h-[220px] overflow-hidden">
                    <img src={c.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LES 5 TEMPS ==================== */}
      <StepsRiver />

      {/* ==================== BANDEAU GÉANT ==================== */}
      <section className="bg-white py-14 lg:py-20 border-y border-[#bae3d1]/60">
        <VelocityMarquee items={['Déposer', 'Fabriquer', 'Transmettre', 'Seconde Maille']} />
      </section>

      {/* ==================== EXPLORER ==================== */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-12">
            <div>
              <SectionLabel num="05">Explorer</SectionLabel>
              <SplitText as="h2" text="Quatre escales pour tout comprendre." className="font-display uppercase text-[clamp(34px,5vw,72px)] leading-[0.95] text-[#0F2926] mt-5" />
            </div>
          </div>

          <div className="border-b border-[#0F2926]/15">
            {SITE_PAGES.slice(1).map((page, i) => (
              <Reveal key={page.id} delay={i * 90}>
                <button
                  onClick={() => onNavigate(page.id)}
                  className="index-row w-full text-left border-t border-[#0F2926]/15 px-2 sm:px-4 py-6 lg:py-8 grid grid-cols-12 items-center gap-3 sm:gap-4"
                >
                  <span className="col-span-2 sm:col-span-1 font-display text-lg text-[#194080]">{page.num}</span>
                  <span className="index-title col-span-10 sm:col-span-5 font-display uppercase text-[clamp(28px,4vw,52px)] leading-none text-[#0F2926]">{page.label}</span>
                  <span className="col-span-10 col-start-3 sm:col-start-auto sm:col-span-5 text-sm text-slate-600 leading-relaxed">{PAGE_BLURBS[page.id]}</span>
                  <span className="hidden sm:flex col-span-1 justify-end">
                    <span className="index-arrow w-12 h-12 rounded-full border-2 border-[#0F2926] grid place-items-center text-[#0F2926]">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
