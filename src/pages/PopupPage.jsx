import React from 'react';
import { CalendarDays, MapPin, Clock, Ticket, Compass, Scissors, Coffee, ShoppingBag, Mic, Users, Baby } from 'lucide-react';
import StreetScene from '../components/street/StreetScene';
import LocationMap from '../components/LocationMap';
import { Reveal, SplitText, TiltCard, CountUp } from '../components/Motion';
import { SectionLabel, PageHeroCopy, PageLead } from '../components/Blocks';
import { Mascot } from '../components/Brand';
import MerchShowcase from '../components/shop/MerchShowcase';
import StarterPack from '../components/shop/StarterPack';
import { ShopScreen } from '../components/Media';
import { SHOP_SCREENS } from '../data/media';
import { SITE_PAGES, EVENT, PROGRAMME, AUDIENCES } from '../data/siteContent';

const PROGRAMME_ICONS = [Compass, Coffee, ShoppingBag, Scissors, Mic];
const daysUntil = (d) => Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));

export default function PopupPage() {
  const page = SITE_PAGES[3];
  const dEvent = daysUntil(EVENT.date);
  const dBox = daysUntil(EVENT.boxDate);

  return (
    <>
      <StreetScene variant="compact" label="Le pop-up store Seconde Maille">
        <PageHeroCopy page={page} title={['Le 20 mars', 'à Lille']} />
      </StreetScene>

      <PageLead
        aside={
          <div className="flex gap-3">
            <div className="p-5 rounded-[24px] bg-[#0F2926] text-white min-w-[120px]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a5d2b2]">Pop-up</p>
              <p className="font-display text-4xl leading-none mt-2">
                J-<CountUp to={dEvent} />
              </p>
            </div>
            <div className="p-5 rounded-[24px] bg-[#18407f] text-white min-w-[120px]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#a5d2b2]">Box</p>
              <p className="font-display text-4xl leading-none mt-2">
                J-<CountUp to={dBox} />
              </p>
            </div>
          </div>
        }
      >
        <p>
          Le <span className="marker-aqua font-bold">samedi 20 mars 2027</span>, Seconde Maille ouvre son pop-up store au 17 boulevard Jean-Baptiste Lebas, à Lille. Quatre espaces et une salle de masterclass
          pour découvrir la démarche et y prendre part, de 9h à 17h jusqu’au 20 juin.
        </p>
      </PageLead>

      {/* Événement */}
      <section className="bg-white pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal direction="clip">
            <div className="rounded-[32px] sm:rounded-[40px] bg-[#0F2926] text-white overflow-hidden">
              <div className="p-6 sm:p-10 lg:p-12 grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-5">
                  <SectionLabel num="A" light>
                    L’événement
                  </SectionLabel>
                  <p className="font-display text-[clamp(56px,8vw,120px)] leading-[0.85] text-[#a5d2b2] mt-6">20.03</p>
                  <p className="font-display text-[clamp(28px,3.5vw,48px)] leading-none text-white/90">2027</p>
                  <ul className="mt-8 space-y-3 text-sm">
                    <li className="flex items-start gap-3">
                      <CalendarDays className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> <span><strong>{EVENT.dateLabel}</strong> · {EVENT.name}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> <span>{EVENT.address}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> <span>{EVENT.hours}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Ticket className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> <span>Entrée : <strong>un matériau déposé</strong></span>
                    </li>
                  </ul>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#a5d2b2] mb-4">Sur place : 4 espaces + une masterclass</p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {PROGRAMME.map((item, i) => {
                      const Icon = PROGRAMME_ICONS[i];
                      return (
                        <li key={item.title} className={`group p-5 rounded-[22px] bg-white/[0.06] border border-white/10 hover:bg-[#18407f] hover:border-[#18407f] transition-colors duration-500 ${i === 0 ? 'sm:col-span-2' : ''}`}>
                          <div className="flex items-start gap-3">
                            <span className="w-10 h-10 rounded-xl bg-[#a5d2b2] text-[#0F2926] grid place-items-center shrink-0 transition-transform duration-500 group-hover:-rotate-6">
                              <Icon className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="font-extrabold">{item.title}</p>
                              <p className="text-sm text-white/70 leading-relaxed mt-0.5">{item.text}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* écrans de la boutique */}
      <section className="bg-[#F5FBF9] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <SectionLabel num="B">Sur les écrans de la boutique</SectionLabel>
            <SplitText as="h2" text="Ce qui tourne en boucle." className="font-display uppercase text-[clamp(32px,4.4vw,60px)] leading-[0.95] text-[#0F2926] mt-5" />
            <Reveal>
              <p className="text-slate-600 leading-relaxed mt-5">
                Deux écrans accompagnent la visite. Zappez de l’un à l’autre pour voir ce qui sera diffusé dans le pop-up.
              </p>
            </Reveal>
          </div>
          <Reveal direction="right" className="lg:col-span-8">
            <ShopScreen channels={SHOP_SCREENS} />
          </Reveal>
        </div>
      </section>

      {/* VENIR - carte réelle */}
      <section id="venir" className="bg-white pb-16 lg:pb-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#0F2926] to-[#18407f] text-white p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <SectionLabel num="B" light>
                    Venir au pop-up
                  </SectionLabel>
                  <h2 className="font-display uppercase text-[clamp(30px,4vw,56px)] leading-[0.95] mt-4">Plan & itinéraire</h2>
                </div>
                <Mascot className="w-14 sm:w-16 hidden sm:block" />
              </div>
              <LocationMap />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pour qui */}
      <section className="bg-white pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5">
            <SectionLabel num="C">Pour qui ?</SectionLabel>
            <SplitText as="h2" text="Un rendez-vous ouvert à tous." className="font-display uppercase text-[clamp(32px,4vw,56px)] leading-[0.95] text-[#0F2926] mt-5" />
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
            {AUDIENCES.map((a, i) => {
              const Icon = i === 0 ? Users : Baby;
              return (
                <Reveal key={a.title} delay={i * 120}>
                  <TiltCard className="h-full p-6 rounded-[26px] bg-[#F5FBF9] border border-[#a5d2b2]">
                    <Icon className="w-6 h-6 text-[#18407f]" />
                    <p className="font-display uppercase text-2xl text-[#0F2926] mt-4">{a.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{a.detail}</p>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* MERCH - stock en direct */}
      <MerchShowcase />

      {/* GOODIES - le starter pack */}
      <StarterPack />
    </>
  );
}
