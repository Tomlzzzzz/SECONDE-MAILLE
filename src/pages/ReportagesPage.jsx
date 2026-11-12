import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import StreetScene from '../components/street/StreetScene';
import { Reveal, SplitText } from '../components/Motion';
import { SectionLabel, PageHeroCopy, PageLead, ExternalPill } from '../components/Blocks';
import { VakitaLogo } from '../components/BrandLogos';
import { Mascot } from '../components/Brand';
import { SITE_PAGES, STORIES } from '../data/siteContent';

// vidéo YouTube chargée seulement au clic (pas de cookies avant)
function YouTubeScreen({ id, title, big = true }) {
  const [on, setOn] = useState(false);
  if (on)
    return (
      <div className="relative w-full aspect-video rounded-[24px] overflow-hidden bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  return (
    <button type="button" onClick={() => setOn(true)} className="block w-full text-left" aria-label={`Lire la vidéo : ${title}`} data-cursor="Lire">
      <Screen big={big} label="Vidéo YouTube" title={title} image={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} fallback={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} />
    </button>
  );
}

function Screen({ big = false, label, title, image, fallback }) {
  return (
    <div className={`relative w-full ${image ? 'aspect-video' : big ? 'h-[260px] sm:h-[400px]' : 'h-52 sm:h-56'} rounded-[24px] bg-[#0F2926] overflow-hidden group`} aria-hidden="true">
      {image && (
        <>
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={(e) => {
              if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </>
      )}
      {!image && <div className="absolute inset-0 scan-lines" />}
      {!image && (
      <svg className="absolute bottom-0 left-0 w-[200%] h-1/2 wave-divider-anim opacity-70 transition-transform duration-1000 translate-y-1/3 group-hover:translate-y-0" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d="M0,80 C200,30 400,30 600,80 C800,130 1000,130 1200,80 C1400,30 1600,30 1800,80 C2000,130 2200,130 2400,80 L2400,200 L0,200 Z" fill="#18407f" />
        <path d="M0,120 C200,80 400,80 600,120 C800,160 1000,160 1200,120 C1400,80 1600,80 1800,120 C2000,160 2200,160 2400,120 L2400,200 L0,200 Z" fill="#18407f" opacity=".6" />
      </svg>
      )}
      {!image && <span className="absolute top-4 left-4 sm:top-5 sm:left-5 text-[11px] font-mono uppercase tracking-wider text-[#a5d2b2]">Vakita × Seconde Maille</span>}
      <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${big ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14'} rounded-full bg-[#a5d2b2] text-[#0F2926] grid place-items-center transition-transform duration-500 group-hover:scale-110`}>
        <span className="play-ring" />
        <span className="play-ring" style={{ animationDelay: '1.2s' }} />
        <Play className={`${big ? 'w-8 h-8' : 'w-5 h-5'} fill-current ml-1`} />
      </span>
      {title && !image && (
        <span className="absolute top-12 left-4 right-4 sm:top-14 sm:left-5 sm:right-24 font-display uppercase text-white text-xl sm:text-3xl leading-[0.95]">{title}</span>
      )}
      <span className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-extrabold uppercase tracking-wider text-[#0F2926]">{label}</span>
    </div>
  );
}

export default function ReportagesPage() {
  const page = SITE_PAGES[4];

  return (
    <>
      <StreetScene variant="compact" label="Raconter la cause du vaquita">
        <PageHeroCopy page={page} title={['Raconter', 'la cause']} />
      </StreetScene>

      <PageLead aside={<ExternalPill href="https://www.vakita.fr">Les contenus sur vakita.fr</ExternalPill>}>
        <p>
          Les contenus de Vakita expliquent le lien entre <span className="marker-aqua font-bold">les déchets abandonnés</span> et les menaces qui pèsent sur les animaux marins.
          Raconter, c’est la dernière étape de Seconde Maille : faire entendre une cause souvent éloignée de notre quotidien.
        </p>
      </PageLead>

      {/* les deux vidéos, en vis-à-vis */}
      <section className="bg-white pb-20 lg:pb-28 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
          {/* fil qui relie les deux vidéos */}
          <svg className="hidden lg:block absolute left-1/2 top-24 -translate-x-1/2 w-40 h-24 text-[#a5d2b2]" viewBox="0 0 160 96" aria-hidden="true">
            <path d="M4 10 C50 10 40 86 80 86 S110 30 156 60" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
          </svg>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {STORIES.map((v, i) => {
              const dark = i % 2 === 1;
              return (
                <Reveal key={v.title} delay={i * 140} className={dark ? 'lg:mt-28' : ''}>
                  <article
                    className={`story-tv group/tv p-5 sm:p-7 rounded-[36px] ${
                      dark ? 'bg-[#18407f] text-white' : 'bg-[#F5FBF9] border border-[#a5d2b2] text-[#0F2926]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-5">
                      <span
                        className="font-display text-[56px] sm:text-[72px] leading-none text-transparent"
                        style={{ WebkitTextStroke: `1.5px ${dark ? '#a5d2b2' : '#18407f'}` }}
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] ${
                          dark ? 'bg-[#a5d2b2] text-[#0F2926]' : 'bg-[#18407f] text-white'
                        }`}
                      >
                        {v.tag}
                      </span>
                    </div>
                    <div className={`story-tv-screen rounded-[28px] p-1.5 ${dark ? 'bg-white/10' : 'bg-white'} ${i % 2 ? 'rotate-[1deg]' : 'rotate-[-1deg]'}`}>
                      <YouTubeScreen id={v.video.youtube} title={v.video.title} big={false} />
                    </div>
                    <div className="flex items-center gap-3 mt-7">
                      <h2 className="font-display uppercase text-[clamp(32px,3.6vw,52px)] leading-[0.95]">{v.title}</h2>
                      {!dark && <Mascot className="w-12 shrink-0 hover:rotate-12 transition-transform duration-500" />}
                    </div>
                    <p className={`leading-relaxed mt-4 ${dark ? 'text-white/80' : 'text-slate-600'}`}>{v.text}</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${v.video.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 mt-5 text-sm font-extrabold underline decoration-2 underline-offset-4 ${
                        dark ? 'text-white decoration-[#a5d2b2]' : 'text-[#18407f] decoration-[#a5d2b2]'
                      }`}
                    >
                      Voir sur YouTube <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pourquoi Vakita */}
      <section className="bg-[#18407f] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <SectionLabel num="?" light>
              Pourquoi « Vakita » ?
            </SectionLabel>
            <SplitText as="h2" text="Un nom qui porte la cause." className="font-display uppercase text-[clamp(32px,4.5vw,64px)] leading-[0.95] mt-6" />
            <Reveal delay={150}>
              <p className="text-white/80 text-lg leading-relaxed mt-6 max-w-2xl">
                Le nom du média fait référence au vaquita, un mammifère marin parmi les espèces les plus en danger d’extinction, notamment à cause des filets de pêche jetés lors de la
                pêche illégale au Mexique. Seconde Maille fait directement le lien : les filets deviennent la matière d’une nouvelle gamme.
              </p>
            </Reveal>
          </div>
          <Reveal direction="scale" className="md:col-span-5 flex flex-col items-center gap-6">
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-white grid place-items-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <Mascot className="w-32 sm:w-40 hover:scale-110 hover:-rotate-6 transition-transform duration-500" />
            </div>
            <VakitaLogo size="lg" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
