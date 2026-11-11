import React from 'react';
import { Play } from 'lucide-react';
import StreetScene from '../components/street/StreetScene';
import { Reveal, SplitText, TiltCard } from '../components/Motion';
import { SectionLabel, PageHeroCopy, PageLead, ExternalPill } from '../components/Blocks';
import { VakitaLogo } from '../components/BrandLogos';
import { Mascot } from '../components/Brand';
import { SITE_PAGES, STORIES } from '../data/siteContent';

function Screen({ big = false, label }) {
  return (
    <div className={`relative w-full ${big ? 'h-[260px] sm:h-[400px]' : 'h-52 sm:h-56'} rounded-[24px] bg-[#0F2926] overflow-hidden group`} aria-hidden="true">
      <div className="absolute inset-0 scan-lines" />
      <svg className="absolute bottom-0 left-0 w-[200%] h-1/2 wave-divider-anim opacity-70 transition-transform duration-1000 translate-y-1/3 group-hover:translate-y-0" viewBox="0 0 2400 200" preserveAspectRatio="none">
        <path d="M0,80 C200,30 400,30 600,80 C800,130 1000,130 1200,80 C1400,30 1600,30 1800,80 C2000,130 2200,130 2400,80 L2400,200 L0,200 Z" fill="#194080" />
        <path d="M0,120 C200,80 400,80 600,120 C800,160 1000,160 1200,120 C1400,80 1600,80 1800,120 C2000,160 2200,160 2400,120 L2400,200 L0,200 Z" fill="#0D9488" opacity=".6" />
      </svg>
      <span className="absolute top-4 left-4 sm:top-5 sm:left-5 text-[11px] font-mono uppercase tracking-wider text-[#bae3d1]">Vakita × Seconde Maille</span>
      <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${big ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14'} rounded-full bg-[#bae3d1] text-[#0F2926] grid place-items-center transition-transform duration-500 group-hover:scale-110`}>
        <span className="play-ring" />
        <span className="play-ring" style={{ animationDelay: '1.2s' }} />
        <Play className={`${big ? 'w-8 h-8' : 'w-5 h-5'} fill-current ml-1`} />
      </span>
      <span className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-extrabold uppercase tracking-wider text-[#0F2926]">{label}</span>
    </div>
  );
}

export default function ReportagesPage() {
  const page = SITE_PAGES[4];
  const [first, ...rest] = STORIES;

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

      <section className="bg-white pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-6">
          <Reveal direction="clip">
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center p-4 sm:p-6 rounded-[32px] sm:rounded-[36px] bg-[#F5FBF9] border border-[#bae3d1]">
              <div className="lg:col-span-7">
                <Screen big label="Contenu à venir" />
              </div>
              <div className="lg:col-span-5 lg:pr-4 pb-2 px-1">
                <SectionLabel num="★">{first.tag}</SectionLabel>
                <div className="flex items-center gap-4 mt-5">
                  <h2 className="font-display uppercase text-[clamp(34px,4vw,56px)] leading-[0.95] text-[#0F2926]">{first.title}</h2>
                  <Mascot className="w-14 sm:w-16 shrink-0 hover:rotate-12 transition-transform duration-500" />
                </div>
                <p className="text-slate-600 leading-relaxed mt-4">{first.text}</p>
              </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {rest.map((v, i) => (
              <Reveal key={v.title} delay={i * 120}>
                <TiltCard max={3} className="h-full p-4 sm:p-6 rounded-[32px] bg-white border border-[#bae3d1] hover:border-[#194080] flex flex-col gap-6">
                  <Screen label="Contenu à venir" />
                  <div className="px-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#194080]">{v.tag}</span>
                    <h2 className="font-display uppercase text-3xl leading-[0.95] text-[#0F2926] mt-2">{v.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-3">{v.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI VAKITA */}
      <section className="bg-[#194080] text-white overflow-hidden">
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
