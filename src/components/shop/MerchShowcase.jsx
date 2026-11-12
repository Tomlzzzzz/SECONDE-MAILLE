import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Ruler, ChevronDown, Store, Info } from 'lucide-react';
import { MERCH, LOW_STOCK } from '../../data/shop';
import useLiveStock, { useAgo } from './useLiveStock';
import SizeGuide from './SizeGuide';
import { Reveal, SplitText } from '../Motion';
import { SectionLabel } from '../Blocks';

/* Pastille "stock en direct" */
export function LiveBadge({ status, checkedAt, dark = false }) {
  const ago = useAgo(checkedAt);
  const live = status === 'live';
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-extrabold ${
        dark ? 'bg-white/10 text-white' : 'bg-white border border-[#a5d2b2] text-[#0F2926]'
      }`}
      aria-live="polite"
    >
      <span className="relative flex w-2 h-2">
        {live && <span className="absolute inset-0 rounded-full bg-[#22c55e] animate-ping" />}
        <span className={`relative w-2 h-2 rounded-full ${live ? 'bg-[#22c55e]' : status === 'loading' ? 'bg-slate-400' : 'bg-[#f59e0b]'}`} />
      </span>
      {live ? `Stock en direct · ${ago}` : status === 'loading' ? 'Connexion au stock…' : 'Stock momentanément indisponible'}
    </span>
  );
}

const stockState = (q) => (q == null ? 'unknown' : q <= 0 ? 'out' : q <= LOW_STOCK ? 'low' : 'ok');
const STATE_LABEL = { ok: 'En stock', low: 'Plus que', out: 'Épuisé', unknown: '—' };

/* Diaporama avec glisser au doigt / à la souris, flèches, vignettes */
function Gallery({ slides, productName }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const start = useRef(null);
  useEffect(() => setI(0), [slides]);
  const go = (n) => {
    setDir(n > i ? 1 : -1);
    setI((n + slides.length) % slides.length);
  };
  const onDown = (e) => (start.current = e.clientX);
  const onUp = (e) => {
    if (start.current == null) return;
    const dx = e.clientX - start.current;
    start.current = null;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  };
  const s = slides[i];
  return (
    <div className="select-none">
      <div
        className="relative aspect-[4/3] rounded-[28px] overflow-hidden bg-[#F5FBF9] border border-[#a5d2b2] touch-pan-y"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (start.current = null)}
        data-cursor="Glisser"
        role="group"
        aria-roledescription="carrousel"
        aria-label={`${productName} — photo ${i + 1} sur ${slides.length}`}
      >
        <img
          key={s.src}
          src={s.src}
          alt={`${productName} — ${s.label}`}
          className={`absolute inset-0 w-full h-full object-cover merch-slide ${dir > 0 ? 'from-right' : 'from-left'}`}
          draggable="false"
        />
        <span className="absolute left-4 bottom-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-extrabold text-[#0F2926]">{s.label}</span>
        <span className="absolute right-4 top-4 px-2.5 py-1 rounded-full bg-[#0F2926]/80 text-white text-[11px] font-bold tabular-nums">
          {i + 1}/{slides.length}
        </span>
        {slides.length > 1 && (
          <>
            <button onClick={() => go(i - 1)} aria-label="Photo précédente" className="merch-arrow left-3">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => go(i + 1)} aria-label="Photo suivante" className="merch-arrow right-3">
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="flex gap-2.5 mt-3">
          {slides.map((sl, k) => (
            <button
              key={sl.src}
              onClick={() => go(k)}
              aria-label={`Voir : ${sl.label}`}
              aria-current={k === i}
              className={`relative w-20 sm:w-24 aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                k === i ? 'border-[#0F2926]' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={sl.src} alt="" className="w-full h-full object-cover" draggable="false" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MerchShowcase() {
  const { data, status, checkedAt, changed } = useLiveStock();
  const [pid, setPid] = useState(MERCH[0].id);
  const product = MERCH.find((p) => p.id === pid);
  const [cid, setCid] = useState(product.colors[0].id);
  const color = product.colors.find((c) => c.id === cid) || product.colors[0];
  const [size, setSize] = useState(null);
  const [guide, setGuide] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const pickProduct = (id) => {
    const p = MERCH.find((x) => x.id === id);
    setPid(id);
    setCid(p.colors[0].id);
    setSize(null);
  };

  const sizes = data?.merch?.[color.stockKey] || null;
  const total = sizes ? Object.values(sizes).reduce((a, b) => a + b, 0) : null;
  const sel = size && sizes ? sizes[size] : null;

  /* pastille glissante des onglets produits */
  const tabsRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const update = () => {
      const b = tabsRef.current?.querySelector(`[data-pid="${pid}"]`);
      if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
    };
    update();
    window.addEventListener('resize', update);
    document.fonts?.ready?.then(update);
    return () => window.removeEventListener('resize', update);
  }, [pid]);

  return (
    <section id="merch" className="scroll-mt-4 bg-[#F5FBF9] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel num="D">Le merch</SectionLabel>
            <SplitText as="h2" text="Porter la cause, à sa taille." className="font-display uppercase text-[clamp(34px,5vw,72px)] leading-[0.95] text-[#0F2926] mt-6" />
          </div>
          <Reveal direction="right" className="flex flex-col items-start md:items-end gap-3">
            <LiveBadge status={status} checkedAt={checkedAt} />
            <p className="text-sm text-slate-600 max-w-sm md:text-right">
              Pas de commande en ligne : les pièces sont en vente <strong>au pop-up</strong>. Ici, vérifie les tailles encore disponibles, en temps réel.
            </p>
          </Reveal>
        </div>

        {/* onglets produits */}
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 mb-8 scrollbar-none">
          <div ref={tabsRef} role="tablist" aria-label="Pièces du merch" className="relative inline-flex gap-1 p-1.5 rounded-full bg-white border border-[#a5d2b2]">
            <span className="absolute top-1.5 bottom-1.5 rounded-full bg-[#0F2926] transition-all duration-500" style={{ left: pill.left, width: pill.width, transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }} aria-hidden="true" />
            {MERCH.map((p) => (
              <button
                key={p.id}
                data-pid={p.id}
                role="tab"
                aria-selected={p.id === pid}
                onClick={() => pickProduct(p.id)}
                className={`relative z-10 px-4 sm:px-5 py-2.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-colors duration-300 ${
                  p.id === pid ? 'text-[#a5d2b2]' : 'text-[#0F2926]/70 hover:text-[#0F2926]'
                }`}
              >
                {p.name.replace(/^(Le|La|Les) /, '')}
              </button>
            ))}
          </div>
        </div>

        <div key={pid} className="grid lg:grid-cols-12 gap-8 lg:gap-12 tab-panel-enter">
          <div className="lg:col-span-7">
            <Gallery slides={color.slides} productName={`${product.name} ${color.label}`} />
          </div>

          <div className="lg:col-span-5 min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#18407f]">{product.tagline}</p>
            <h3 className="font-display uppercase text-[clamp(36px,4vw,56px)] leading-[0.92] text-[#0F2926] mt-2">{product.name}</h3>
            <p className="text-slate-700 leading-relaxed mt-4">{product.description}</p>

            {/* coloris */}
            <div className="mt-6">
              <p className="text-xs font-extrabold text-[#0F2926]">
                Coloris : <span className="font-semibold text-slate-600">{color.label}</span>
              </p>
              <div className="flex gap-2.5 mt-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCid(c.id);
                      setSize(null);
                    }}
                    aria-label={`Coloris ${c.label}`}
                    aria-pressed={c.id === color.id}
                    className={`w-10 h-10 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${c.id === color.id ? 'border-[#0F2926] ring-4 ring-[#a5d2b2]' : 'border-[#0F2926]/20'}`}
                    style={{ background: c.swatch }}
                  />
                ))}
              </div>
            </div>

            {/* tailles + stock */}
            <div className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-extrabold text-[#0F2926]">
                  Tailles disponibles{total != null && <span className="font-semibold text-slate-500"> · {total} pièces au total</span>}
                </p>
                <button onClick={() => setGuide(true)} className="text-xs font-extrabold text-[#18407f] inline-flex items-center gap-1.5 link-line">
                  <Ruler className="w-3.5 h-3.5" /> Guide des tailles
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6 gap-2 mt-3">
                {(sizes ? Object.entries(sizes) : []).map(([s, q]) => {
                  const st = stockState(q);
                  const on = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(on ? null : s)}
                      aria-pressed={on}
                      aria-label={`Taille ${s} : ${st === 'out' ? 'épuisé' : `${q} pièces`}`}
                      className={`size-chip ${st} ${on ? 'is-on' : ''} ${changed[`${color.stockKey}:${s}`] ? 'is-changed' : ''}`}
                    >
                      <span className="font-extrabold text-sm">{s}</span>
                      <span className="text-[10px] font-bold opacity-80 tabular-nums">{st === 'out' ? 'Épuisé' : `${q} dispo`}</span>
                    </button>
                  );
                })}
                {!sizes &&
                  [0, 1, 2, 3].map((k) => <span key={k} className="h-[54px] rounded-2xl bg-white border border-[#a5d2b2] animate-pulse" />)}
              </div>
              <div className="min-h-[52px] mt-3" aria-live="polite">
                {size && sel != null && (
                  <p key={size} className="tab-panel-enter text-sm text-[#0F2926] flex items-start gap-2 p-3 rounded-2xl bg-white border border-[#a5d2b2]">
                    <Store className="w-4 h-4 mt-0.5 shrink-0 text-[#18407f]" />
                    {sel <= 0 ? (
                      <span>
                        Taille <strong>{size}</strong> épuisée pour le moment — le stock peut être réassorti, reviens vérifier ici.
                      </span>
                    ) : (
                      <span>
                        Taille <strong>{size}</strong> : {stockState(sel) === 'low' ? <strong className="text-[#b45309]">plus que {sel} pièce{sel > 1 ? 's' : ''}</strong> : <strong>{sel} pièces</strong>} disponibles au pop-up.
                      </span>
                    )}
                  </p>
                )}
                {!size && sizes && <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-2"><Info className="w-3.5 h-3.5" /> Choisis une taille pour voir le détail.</p>}
              </div>
            </div>

            {/* fabrication */}
            <div className="mt-4 rounded-[22px] bg-white border border-[#a5d2b2] overflow-hidden">
              <button onClick={() => setFabOpen((v) => !v)} aria-expanded={fabOpen} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
                <span className="font-extrabold text-[#0F2926]">Comment c’est fait</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${fabOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: fabOpen ? '1fr' : '0fr' }}>
                <ol className="overflow-hidden px-5">
                  {product.fabrication.map((f, k) => (
                    <li key={k} className="flex gap-3 pb-4 text-sm text-slate-700 leading-relaxed">
                      <span className="font-display text-lg text-[#18407f] leading-none mt-0.5">0{k + 1}</span>
                      {f}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuide open={guide} initial={product.guide} onClose={() => setGuide(false)} />
    </section>
  );
}
