import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { HERO_ASSETS, STREET_ASSETS as S } from '../../config/heroAssets';
import { useReduce, WaveDivider } from '../Motion';
import { SecondeMailleLogo } from '../Brand';
import ShopFacade from './ShopFacade';
import DepositBox from './DepositBox';

/* Calque avec profondeur (souris d) et traînée au scroll (k) — même système que la scène marine */
function Layer({ className = '', d = 0, k = 0, children, ...rest }) {
  return (
    <div className={`hero-layer ${className}`} style={{ '--d': d, '--k': k }} {...rest}>
      {children}
    </div>
  );
}

function Bird({ style, size = 1 }) {
  return (
    <div className="street-bird" style={style} aria-hidden="true">
      <svg viewBox="0 0 40 20" width={34 * size} height={17 * size}>
        <g className="street-bird-wings">
          <path d="M2 10 Q11 0 20 10 Q29 0 38 10" fill="none" stroke="#0F2926" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

const BIRDS = [
  { top: '14%', dur: 26, delay: -3, size: 1 },
  { top: '19%', dur: 31, delay: -12, size: 0.75 },
  { top: '10%', dur: 38, delay: -20, size: 0.6 },
  { top: '24%', dur: 23, delay: -8, size: 0.85 }
];

export default function StreetScene({ bigTitle, variant = 'full', showBox = variant === 'full', onBoxClick, children, label, waveColor = variant === 'compact' ? '#FFFFFF' : undefined }) {
  const reduce = useReduce();
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduce) {
      ['--mx', '--my', '--sy'].forEach((v) => el.style.setProperty(v, 0));
      return;
    }
    let tx = 0, ty = 0, mx = 0, my = 0, raf = null, visible = true;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      const sy = Math.min(el.offsetHeight, Math.max(0, window.scrollY - el.offsetTop));
      el.style.setProperty('--mx', mx.toFixed(4));
      el.style.setProperty('--my', my.toFixed(4));
      el.style.setProperty('--sy', sy.toFixed(1));
      raf = visible ? requestAnimationFrame(loop) : null;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(el);
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      io.disconnect();
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  /* le grand titre est mis à l'échelle pour tenir exactement dans la largeur de la boutique */
  const titleBox = useRef(null);
  const titleEl = useRef(null);
  useLayoutEffect(() => {
    if (!bigTitle) return;
    const fit = () => {
      const box = titleBox.current;
      const t = titleEl.current;
      if (!box || !t) return;
      t.style.setProperty('--fit', 1);
      const ratio = box.clientWidth / Math.max(1, t.scrollWidth);
      t.style.setProperty('--fit', Math.min(1.25, ratio).toFixed(3));
      // hauteur : centré sur le bloc d'infos de gauche (repère data-title-anchor)
      const scene = root.current;
      const anchor = scene?.querySelector('[data-title-anchor]');
      if (scene && anchor) {
        const a = anchor.getBoundingClientRect();
        const r = scene.getBoundingClientRect();
        let y = a.top + a.height / 2 - r.top;
        // jamais caché par la boutique : on remonte si l'écran est trop bas
        const shop = scene.querySelector('.street-shop');
        if (shop) {
          const shopTop = shop.getBoundingClientRect().top - r.top;
          y = Math.min(y, shopTop - t.offsetHeight * 0.55 - 8);
        }
        scene.style.setProperty('--title-y', `${y.toFixed(1)}px`);
      }
    };
    fit();
    document.fonts?.ready?.then(fit);
    const ro = new ResizeObserver(fit);
    if (titleBox.current) ro.observe(titleBox.current);
    if (root.current) ro.observe(root.current);
    return () => ro.disconnect();
  }, [bigTitle]);

  const full = variant === 'full';

  return (
    <section
      ref={root}
      className={`hero street ${full ? 'street--full' : 'street--compact'}`}
      aria-label={label || 'Illustration : la boutique éphémère Seconde Maille dans la rue, avec une box de dépôt devant'}
    >
      <Layer className="street-sky" d={3} k={0.5} aria-hidden="true">
        <img src={S.sky} alt="" className="w-full h-full object-cover" draggable="false" />
      </Layer>

      <Layer className="street-clouds" d={8} k={0.45} aria-hidden="true">
        <div className="hero-drift" style={{ '--tile': `${HERO_ASSETS.clouds.tile}px`, backgroundImage: `url("${HERO_ASSETS.clouds.src}")`, animationDuration: `${HERO_ASSETS.clouds.speed}s` }} />
      </Layer>

      <div className="street-birds" aria-hidden="true">
        {BIRDS.map((b, i) => (
          <Bird key={i} size={b.size} style={{ top: b.top, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
        ))}
      </div>

      {/* grand titre posé derrière les bâtiments */}
      {bigTitle && (
        <Layer className="street-title-layer" d={10} k={0.36} aria-hidden="true">
          <div ref={titleBox} className="street-title-box">
          <div ref={titleEl} className="street-title hero-title">
            {bigTitle.split(' ').map((word, wi) => (
              <span className="hero-title-word" key={wi}>
                {word.split('').map((ch, ci) => (
                  <span className="hero-letter" key={ci} style={{ animationDelay: `${400 + (wi * 7 + ci) * 55}ms` }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </div>
          </div>
        </Layer>
      )}

      {/* motifs répétés en largeur, jamais recadrés en hauteur → toits toujours entiers */}
      <Layer className="street-city" d={6} k={0.3} aria-hidden="true">
        <div className="street-tile" style={{ backgroundImage: `url("${S.city}")` }} />
      </Layer>

      <Layer className="street-houses" d={12} k={0.18} aria-hidden="true">
        <div className="street-tile" style={{ backgroundImage: `url("${S.houses}")` }} />
      </Layer>

      {/* lampadaires */}
      {['a', 'b', 'c'].map((id) => (
        <Layer key={id} className={`street-lamp street-lamp--${id}`} d={20} k={0.06} aria-hidden="true">
          <span className="street-lamp-glow" />
          <img src={S.lamp} alt="" className="h-full w-auto block" draggable="false" />
        </Layer>
      ))}

      {/* la boutique */}
      <Layer className="street-shop" d={18} k={0.08}>
        <div className="relative">
          {S.shop ? <img src={S.shop} alt="La boutique éphémère Seconde Maille" className="w-full h-auto block" /> : <ShopFacade className="w-full h-auto block" />}
          {/* le logo remplace l'enseigne du bâtiment */}
          <div className="street-shop-logo">
            <SecondeMailleLogo light className="w-full h-auto" alt="Seconde Maille" />
          </div>
        </div>
      </Layer>

      {/* rue pavée */}
      <Layer className="street-road" d={0} k={0} aria-hidden="true">
        <img src={S.street} alt="" className="w-full h-full block" draggable="false" />
      </Layer>

      {/* la box de dépôt, au premier plan */}
      {showBox && (
        <Layer className="street-box" d={30} k={-0.04}>
          <button type="button" onClick={onBoxClick} className="street-box-btn" data-cursor="Déposer" aria-label="Découvrir les box de dépôt">
            {S.box ? <img src={S.box} alt="" className="w-full h-auto block" /> : <DepositBox className="w-full h-auto block" />}
          </button>
        </Layer>
      )}

      <div className="hero-copy">{children}</div>

      {waveColor && (
        <div className="street-wave" aria-hidden="true">
          <WaveDivider color={waveColor} />
        </div>
      )}
    </section>
  );
}
