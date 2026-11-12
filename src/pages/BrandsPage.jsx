import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import StreetScene from '../components/street/StreetScene';
import { VakitaLogo, LaVieEstBeltLogo } from '../components/BrandLogos';
import { SecondeMailleLogo, Mascot } from '../components/Brand';
import { Reveal, SplitText, TiltCard, WaveDivider } from '../components/Motion';
import { SectionLabel, PageHeroCopy, PageLead } from '../components/Blocks';
import { BRANDS, SITE_PAGES } from '../data/siteContent';

function BrandPanel({ brand, logo, accent, soft, title, cta, onSecondary, secondaryLabel, direction }) {
  return (
    <Reveal direction={direction} className="h-full">
      <TiltCard max={3} className="h-full rounded-[32px] sm:rounded-[36px] border p-7 sm:p-10 flex flex-col justify-between gap-10 overflow-hidden" style={{ background: soft, borderColor: `${accent}44` }}>
        <div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            {logo}
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white" style={{ background: accent }}>
              {brand.tagline}
            </span>
          </div>
          <h2 className="font-display uppercase text-[clamp(30px,3.2vw,46px)] leading-[0.95] text-[#0F2926] mt-9">{title}</h2>
          <p className="text-base text-slate-700 leading-relaxed mt-5">{brand.mission}</p>
          <dl className="grid sm:grid-cols-3 gap-3 mt-8">
            {[
              ['Apporte', brand.brings],
              ['Gagne', brand.gains],
              ['Sa matière', brand.material]
            ].map(([k, v]) => (
              <div key={k} className="p-4 rounded-2xl bg-white/70 border border-[#0F2926]/10">
                <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: accent }}>
                  {k}
                </dt>
                <dd className="text-sm font-bold text-[#0F2926] mt-1 leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#0F2926]/10">
          <a href={brand.url} target="_blank" rel="noreferrer" className="btn btn-ink btn-sm">
            {cta} <ArrowUpRight className="w-3.5 h-3.5 btn-arrow" />
          </a>
          <button onClick={onSecondary} className="link-line text-xs font-extrabold text-[#0F2926]">
            {secondaryLabel} →
          </button>
        </div>
      </TiltCard>
    </Reveal>
  );
}

const VALUES = ['Engagé', 'Écologie', 'Ancré dans le 59', 'Des déchets aux produits', 'Merch'];

export default function BrandsPage({ onNavigate }) {
  const page = SITE_PAGES[1];
  return (
    <>
      <StreetScene variant="compact" label="Les deux marques de la collaboration">
        <PageHeroCopy page={page} title={['Vakita ×', 'La Vie est Belt']} />
      </StreetScene>

      <PageLead>
        <p>
          <strong>Vakita</strong>, média engagé, informe et sensibilise aux enjeux environnementaux et à la protection animale. <strong>La Vie est Belt</strong>{' '}
          transforme des matériaux destinés à être jetés en accessoires utiles. Ensemble, elles imaginent <span className="marker-aqua font-bold">Seconde Maille</span> : une
          collaboration qui donne une seconde vie aux matières et fait entendre une cause souvent éloignée de notre quotidien.
        </p>
      </PageLead>

      <section className="bg-white pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <BrandPanel
              direction="left"
              brand={BRANDS.vakita}
              logo={<VakitaLogo size="lg" />}
              accent="#18407f"
              soft="#F2FBF7"
              title="Informer et sensibiliser"
              cta="Visiter vakita.fr"
              onSecondary={() => onNavigate('reportages')}
              secondaryLabel="Ce que Vakita raconte"
            />
            <BrandPanel
              direction="right"
              brand={BRANDS.belt}
              logo={<LaVieEstBeltLogo size="lg" />}
              accent="#18407f"
              soft="#F3F6FC"
              title="Transformer ce qui devait être jeté"
              cta="Visiter lavieestbelt.fr"
              onSecondary={() => onNavigate('popup-merch')}
              secondaryLabel="La boutique éphémère"
            />
          </div>
          {/* la mascotte relie les deux marques */}
          <div className="hidden lg:grid absolute left-1/2 top-[38%] -translate-x-1/2 w-24 h-24 rounded-full bg-white place-items-center shadow-soft-lg border-4 border-white z-10 transition-transform duration-700 hover:rotate-12 hover:scale-110" aria-hidden="true">
            <Mascot className="w-16" />
          </div>
        </div>
      </section>

      {/* Complémentarité */}
      <section className="relative bg-gradient-to-b from-[#0F2926] to-[#18407f] text-white overflow-hidden">
        <WaveDivider color="#FFFFFF" flip />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <SectionLabel num="×" light>
              Deux entités complémentaires
            </SectionLabel>
            <SplitText as="h2" text="Une dimension physique pour Vakita, une portée médiatique pour La Vie est Belt." className="font-display uppercase text-[clamp(30px,4vw,60px)] leading-[0.95] mt-6" />
            <Reveal delay={150}>
              <p className="text-white/75 text-lg leading-relaxed mt-8">
                Vakita bénéficie de la notoriété et de l’esprit médiatique, sans lieu attitré. La Vie est Belt est une marque entièrement physique. Seconde Maille les réunit autour
                d’un même événement et d’une même gamme de produits.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-6 space-y-5">
            <Reveal>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5 p-6 sm:p-8 rounded-[28px] bg-white/[0.06] border border-white/10">
                <div className="text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a5d2b2]">Vakita</p>
                  <p className="font-display uppercase text-xl sm:text-3xl mt-2">Filet de pêche</p>
                </div>
                <span className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#a5d2b2] text-[#0F2926] grid place-items-center">
                  <ArrowRight className="w-5 h-5" />
                </span>
                <div className="text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a5d2b2]">La Vie est Belt</p>
                  <p className="font-display uppercase text-xl sm:text-3xl mt-2">Pneu</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="p-6 sm:p-8 rounded-[28px] bg-white text-[#0F2926] flex flex-col sm:flex-row sm:items-center gap-6">
                <SecondeMailleLogo className="h-14 sm:h-16 self-start" />
                <ul className="flex flex-wrap gap-2">
                  {VALUES.map((v) => (
                    <li key={v} className="px-3 py-1.5 rounded-full bg-[#F5FBF9] border border-[#a5d2b2] text-xs font-bold hover:bg-[#18407f] hover:text-white hover:border-[#18407f] transition-colors duration-300">
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
