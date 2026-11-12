import React, { useRef } from 'react';
import { Waves, CircleDot, QrCode, MapPin, Award, Coffee, Ticket, Megaphone, ArrowUpRight } from 'lucide-react';
import { StoryVideo } from '../components/Media';
import { BOX_STORIES } from '../data/media';
import StreetScene from '../components/street/StreetScene';
import { Reveal, SplitText, TiltCard, CountUp, useElementProgress } from '../components/Motion';
import { SectionLabel, PageHeroCopy, PageLead } from '../components/Blocks';
import { Mascot, SecondeMailleLogo } from '../components/Brand';
import { SITE_PAGES, EVENT, APP_URL } from '../data/siteContent';

// les deux entrées de chaque box
const MATERIALS = [
  { icon: CircleDot, title: 'Pneus usés', text: 'Pneus et chambres à air : la matière fétiche de La Vie est Belt.' },
  { icon: Waves, title: 'Vieux tissus & filets', text: 'Filets de pêche, cordages, vêtements et chutes de tissu.' }
];

const TIMELINE = [
  { date: EVENT.boxDateLabel, icon: MapPin, title: 'Les box arrivent', text: 'Deux mois avant l’événement, les box de dépôt sont disponibles. Flyers et affiches annoncent le rendez-vous.' },
  { date: '20 janvier → 20 mars', icon: Coffee, title: 'Déposer, cumuler', text: 'Chaque dépôt rapporte des points : un café offert dès 100 points au café vegan du pop-up, des goodies, du merch.' },
  { date: EVENT.dateLabel, icon: Ticket, title: 'Ouverture du pop-up', text: 'Le pop-up ouvre ses portes : hub, café vegan, boutique, atelier tote bag et masterclass. De 9h à 17h jusqu’au 20 juin.' }
];

const daysUntil = (d) => Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));

function TimelineRope() {
  const ref = useRef(null);
  const p = useElementProgress(ref, 'through');
  const fill = Math.max(0, Math.min(1, (p - 0.2) / 0.45));
  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[27px] top-4 bottom-4 w-[3px] rounded-full bg-[#a5d2b2]/60" aria-hidden="true">
        <div className="w-full bg-gradient-to-b from-[#18407f] to-[#18407f] rounded-full origin-top" style={{ height: '100%', transform: `scaleY(${fill})` }} />
      </div>
      <ol className="space-y-6">
        {TIMELINE.map((s, i) => {
          const Icon = s.icon;
          const active = fill >= i / (TIMELINE.length - 1) - 0.01;
          return (
            <li key={s.title} className="relative pl-[76px]">
              <span
                className={`absolute left-0 top-1 w-14 h-14 rounded-full grid place-items-center border-[3px] transition-all duration-500 ${
                  active ? 'bg-[#18407f] text-white border-[#18407f]' : 'bg-white text-[#0F2926] border-[#a5d2b2] scale-90'
                }`}
              >
                <Icon className="w-5 h-5" />
              </span>
              <Reveal direction="left" delay={i * 80}>
                <div className="p-5 sm:p-6 rounded-[24px] bg-white border border-[#a5d2b2] hover:border-[#18407f] transition-colors duration-500">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#18407f]">{s.date}</p>
                  <h3 className="text-lg font-extrabold text-[#0F2926] mt-1">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1.5">{s.text}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function BoxPage() {
  const page = SITE_PAGES[2];
  return (
    <>
      <StreetScene variant="compact" showBox label="Les box de dépôt de matériaux">
        <PageHeroCopy page={page} title={['Les box', 'de dépôt']} />
      </StreetScene>

      <PageLead
        aside={
          <div className="p-6 rounded-[28px] bg-[#18407f] text-white min-w-[230px]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#a5d2b2]">Disponibles dès le</p>
            <p className="font-display text-5xl leading-none mt-2">20.01.27</p>
            <p className="text-sm text-white/70 mt-2">
              dans <CountUp to={daysUntil(EVENT.boxDate)} /> jours
            </p>
          </div>
        }
      >
        <p>
          Du <span className="marker-aqua font-bold">20 janvier au 20 mars 2027</span>, des box de dépôt sont installées dans la région lilloise, à côté de commerces partenaires ou en centre-ville. Chaque box a deux entrées : une pour les pneus usés, une pour les vieux tissus et les filets.
          Déposer, c’est faire le premier geste de Seconde Maille : la matière collectée devient le point de départ de nouveaux vêtements et accessoires.
        </p>
      </PageLead>

      {/* Quoi déposer */}
      <section className="bg-white pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionLabel num="A">Ce que vous pouvez déposer</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mt-8">
            {MATERIALS.map((m, i) => {
              const Icon = m.icon;
              return (
                <Reveal key={m.title} delay={i * 90}>
                  <TiltCard className="h-full p-6 sm:p-7 rounded-[28px] bg-[#F5FBF9] border border-[#a5d2b2] group">
                    <span className="w-12 h-12 rounded-2xl bg-[#0F2926] text-[#a5d2b2] grid place-items-center transition-all duration-500 group-hover:bg-[#18407f] group-hover:rotate-6">
                      <Icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-display uppercase text-2xl text-[#0F2926] mt-6">{m.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">{m.text}</p>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* la box en vidéo */}
      <section className="bg-[#18407f] text-white py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <SectionLabel num="★" light>En vidéo</SectionLabel>
            <SplitText as="h2" text="De la box à la boutique." className="font-display uppercase text-[clamp(34px,5vw,72px)] leading-[0.95] mt-5" />
            <Reveal>
              <p className="text-white/80 leading-relaxed mt-6 max-w-md">
                Deux formats courts, pensés pour Instagram et TikTok : comment déposer et gagner des points, puis ce que devient ce que vous déposez.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6 [&_h3]:!text-white [&_p]:!text-white/75 [&_figcaption_span]:!text-[#a5d2b2]">
            {BOX_STORIES.map((s, i) => (
              <Reveal key={s.src} delay={i * 140} className={i === 1 ? 'mt-14' : ''}>
                <StoryVideo {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Calendrier + appli */}
      <section className="bg-[#F5FBF9] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-7">
            <SectionLabel num="B">Du dépôt à l’inauguration</SectionLabel>
            <SplitText as="h2" text="Déposer, cumuler, se retrouver." className="font-display uppercase text-[clamp(34px,5vw,72px)] leading-[0.95] text-[#0F2926] mt-6 mb-10" />
            <TimelineRope />
            <Reveal delay={150}>
              <div className="mt-8 p-5 sm:p-6 rounded-[24px] bg-white border border-dashed border-[#18407f]/40 flex gap-4 items-start">
                <Megaphone className="w-5 h-5 text-[#18407f] shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  <strong className="text-[#0F2926]">Où trouver les box ?</strong> Dans la région lilloise, à côté de commerces partenaires ou en centre-ville. Toutes les adresses sont sur la carte de l’appli.
                </p>
              </div>
            </Reveal>
          </div>

          {/* l'appli */}
          <Reveal direction="right" delay={150} className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="mx-auto w-full max-w-[300px] aspect-[1/2] max-h-[600px] rounded-[48px] bg-[#0F2926] p-3 shadow-phone relative">
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/60" aria-hidden="true" />
              <div className="w-full h-full rounded-[38px] bg-gradient-to-b from-[#a5d2b2] to-[#F5FBF9] flex flex-col items-center justify-center text-center px-5 gap-3 overflow-hidden">
                <Mascot className="w-16" />
                <SecondeMailleLogo className="h-8" alt="" />
                <p className="font-display uppercase text-2xl text-[#0F2926] leading-none mt-1">L’appli est là</p>
                <p className="text-sm text-[#0F2926]/70 leading-snug">Ta carte des box, ton scan et tes points, dans la poche.</p>
                <div className="flex flex-col gap-2 w-full mt-1">
                  {[
                    [QrCode, 'Scanner un dépôt'],
                    [MapPin, 'Trouver une box'],
                    [Award, 'Suivre ses points']
                  ].map(([Icon, label]) => (
                    <a
                      key={label}
                      href={APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-row flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/70 text-xs font-extrabold text-[#0F2926] hover:bg-white"
                    >
                      <Icon className="w-4 h-4 text-[#18407f]" /> {label}
                      <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                    </a>
                  ))}
                </div>
                <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ink btn-sm w-full justify-center mt-1" data-cursor="Ouvrir">
                  Ouvrir l’appli <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* sur ordinateur : QR code pour l'ouvrir sur son téléphone */}
            <div className="hidden lg:flex items-center gap-4 mx-auto max-w-[300px] mt-6 p-3 pr-4 rounded-[22px] bg-white border border-[#a5d2b2]">
              <img src={`${import.meta.env?.BASE_URL ?? '/'}media/qr-appli.svg`} alt="QR code vers l’appli Seconde Maille" className="w-28 h-28 shrink-0" />
              <p className="text-xs text-slate-600 leading-snug">
                <strong className="block text-sm text-[#0F2926]">Sur ton téléphone</strong>
                Scanne ce code pour ouvrir l’appli.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
