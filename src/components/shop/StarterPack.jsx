import React, { useState } from 'react';
import { MapPin, Bell, Sparkles, Package } from 'lucide-react';
import { STARTER_PACK as P } from '../../data/shop';
import useLiveStock from './useLiveStock';
import { LiveBadge } from './MerchShowcase';
import { Reveal, SplitText, TiltCard } from '../Motion';
import { SectionLabel } from '../Blocks';
import { Mascot } from '../Brand';

/* place de chaque objet dans la grille "flat lay" */
const LAYOUT = {
  tote: 'col-span-2 row-span-2',
  gourde: 'row-span-2',
  tasse: '',
  ecocup: '',
  stylo: 'col-span-2',
  'porte-cles': '',
  pass: ''
};

// cadrage des photos
const FOCUS = { ecocup: '50% 30%', stylo: '50% 22%', tasse: '50% 55%' };

function PackTile({ item, index }) {
  const [v, setV] = useState(0);
  const variant = item.variants[v];
  const big = item.id === 'tote';
  const src = big && variant.tall ? variant.tall : variant.src;
  return (
    <Reveal delay={index * 70} direction="scale" className={`${LAYOUT[item.id]} min-h-0`}>
      <TiltCard max={4} className="pack-tile group h-full rounded-[26px] overflow-hidden bg-white relative flex flex-col">
        <div className="pack-media relative flex-1 min-h-0 overflow-hidden">
        {item.variants.map((vv, k) => (
          <img
            key={vv.src}
            src={big && vv.tall ? vv.tall : vv.src}
            alt={k === v ? `${item.name} — ${vv.label}` : ''}
            aria-hidden={k !== v}
            className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.06] ${k === v ? 'opacity-100' : 'opacity-0'}`}
            style={{ objectPosition: big ? '50% 78%' : FOCUS[item.id] || '50% 50%' }}
            loading="lazy"
            draggable="false"
          />
        ))}
        </div>
        <span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-[#0F2926] text-[#a5d2b2] grid place-items-center font-display text-sm z-10">0{index + 1}</span>

        {item.variants.length > 1 && (
          <div className="pack-swatches absolute top-3 right-3 z-10 flex gap-1.5 p-1.5 rounded-full bg-white">
            {item.variants.map((vv, k) => (
              <button
                key={vv.label}
                onClick={() => setV(k)}
                aria-label={`${item.name} : ${vv.label}`}
                aria-pressed={k === v}
                className={`w-6 h-6 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${k === v ? 'border-[#0F2926]' : 'border-[#0F2926]/20'}`}
                style={{ background: vv.swatch }}
              />
            ))}
          </div>
        )}

        {/* nom + description au survol */}
        <div className="pack-info relative z-10 shrink-0 bg-white px-4 py-3 sm:px-5 sm:py-3.5">
          <p className="font-display uppercase text-lg sm:text-xl leading-none text-[#0F2926]">{item.name}</p>
          <p className="text-[11px] font-extrabold text-[#18407f] mt-1">{item.role}</p>
          <div className="pack-more">
            <p className="text-xs text-slate-700 leading-relaxed pt-2">{item.text}</p>
            {item.variants.length > 1 && <p className="text-[11px] font-bold text-slate-500 pt-1.5">{item.variants.map((x) => x.label).join(' · ')}</p>}
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
}

export default function StarterPack() {
  const { data, status, checkedAt, changed } = useLiveStock();
  const sp = data?.starterPack;
  const left = sp?.remaining;
  const pct = sp ? Math.max(0, Math.min(100, (sp.remaining / Math.max(1, sp.total)) * 100)) : 100;
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section id="starter-pack" className="relative bg-[#18407f] text-white overflow-hidden">
      {/* maille de filet en filigrane */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#a5d2b2 0 1.5px,transparent 1.5px 28px),repeating-linear-gradient(-45deg,#a5d2b2 0 1.5px,transparent 1.5px 28px)' }}
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
          <div className="lg:col-span-7">
            <SectionLabel num="E" light>
              Les goodies
            </SectionLabel>
            <div className="relative mt-6 inline-block">
              <SplitText as="h2" text={P.title} className="font-display uppercase text-[clamp(46px,8vw,124px)] leading-[0.86]" />
              <span className="pack-sticker absolute -right-4 -top-6 sm:-right-14 sm:-top-8" aria-hidden="true">
                <span>7</span> objets
              </span>
            </div>
            <Reveal delay={150}>
              <p className="text-xl sm:text-2xl font-extrabold text-[#a5d2b2] mt-5">{P.pitch}</p>
              <p className="text-white/75 leading-relaxed mt-4 max-w-2xl">{P.intro}</p>
            </Reveal>
          </div>

          <Reveal direction="right" delay={150} className="lg:col-span-5">
            <div className="rounded-[28px] bg-white/[0.07] border border-white/15 p-6 sm:p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span className="px-3 py-1.5 rounded-full bg-[#a5d2b2] text-[#0F2926] text-[11px] font-extrabold uppercase tracking-wider">Édition limitée</span>
                <LiveBadge status={status} checkedAt={checkedAt} dark />
              </div>
              <p className={`font-display text-5xl sm:text-6xl leading-none mt-5 tabular-nums ${changed.starterPack ? 'stock-flash' : ''}`}>
                {left != null ? left : '—'}
                <span className="text-xl sm:text-2xl text-white/70"> {sp ? `/ ${sp.total} packs restants` : 'packs'}</span>
              </p>
              <div className="h-2.5 rounded-full bg-white/15 overflow-hidden mt-4" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Packs restants">
                <div className="h-full rounded-full bg-gradient-to-r from-[#a5d2b2] to-[#5fd0aa] transition-[width] duration-1000" style={{ width: `${pct}%` }} />
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> {P.pickup}
                </li>
                <li className="flex gap-2.5">
                  <Package className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> {P.priceLabel}
                </li>
                <li className="flex gap-2.5">
                  <Sparkles className="w-4 h-4 mt-0.5 text-[#a5d2b2] shrink-0" /> Tes dépôts dans les box te rapportent des points : un café offert dès 100 points, des goodies…
                </li>
              </ul>
              <div className="flex flex-wrap gap-2.5 mt-6">
                <button onClick={() => scrollTo('venir')} className="btn btn-aqua btn-sm">
                  <MapPin className="w-3.5 h-3.5" /> Venir le chercher
                </button>
                <button onClick={() => scrollTo('footer-newsletter')} className="btn btn-sm border border-white/30 text-white hover:bg-white/10">
                  <Bell className="w-3.5 h-3.5" /> Être prévenu·e
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* le contenu du pack, façon "flat lay" */}
        <div className="pack-grid">
          {P.items.map((item, i) => (
            <PackTile key={item.id} item={item} index={i} />
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/75">
            <Mascot className="w-10" />
            {P.items.map((it, i) => (
              <span key={it.id} className="inline-flex items-center gap-2">
                <span className="font-display text-[#a5d2b2]">0{i + 1}</span> {it.name.replace(/^(Le|La|L’) ?/, '')}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
