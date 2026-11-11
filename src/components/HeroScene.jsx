import React, { useEffect, useRef, useState } from 'react';
import { HERO_ASSETS as A } from '../config/heroAssets';
import { useReduce } from './Motion';

/**
 * Scène marine animée en calques :
 * ciel → nuages → (titre) → mer lointaine → bateau + filet → mer médiane → vaquita → mer avant → filets dérivants
 *
 * Chaque calque bouge à sa propre profondeur :
 *  - souris : décalage proportionnel à `d` (profondeur)
 *  - scroll : le calque "traîne" de `k` × le défilement → effet de plongée sous la surface
 */
function Layer({ className = '', d = 0, k = 0, children, style, ...rest }) {
  return (
    <div className={`hero-layer ${className}`} style={{ '--d': d, '--k': k, ...style }} {...rest}>
      {children}
    </div>
  );
}

function Sea({ asset, className, d, k, bob = 7, bobDur = 6, bobDelay = 0, reverse = false }) {
  return (
    <Layer className={className} d={d} k={k} aria-hidden="true">
      <div className="hero-bob" style={{ '--bob': `${bob}px`, animationDuration: `${bobDur}s`, animationDelay: `${bobDelay}s` }}>
        <div
          className="hero-drift"
          style={{
            '--tile': `${asset.tile}px`,
            backgroundImage: `url("${asset.src}")`,
            animationDuration: `${asset.speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal'
          }}
        />
      </div>
    </Layer>
  );
}

export default function HeroScene({ variant = 'full', bigTitle, children, onScrollCue, label, titleAs: TitleTag = 'h1', id }) {
  const reduce = useReduce();
  const root = useRef(null);
  const [jump, setJump] = useState(false);
  const [ripples, setRipples] = useState([]);

  /* Boucle de parallaxe (souris lissée + scroll) — active seulement quand la scène est visible */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (reduce) {
      el.style.setProperty('--mx', 0);
      el.style.setProperty('--my', 0);
      el.style.setProperty('--sy', 0);
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
      const h = el.offsetHeight;
      const sy = Math.min(h, Math.max(0, window.scrollY - el.offsetTop));
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

  /* Le vaquita saute au clic et laisse des ronds dans l'eau */
  const poke = () => {
    if (jump) return;
    setJump(true);
    const id = Date.now();
    setRipples((r) => [...r, id]);
    setTimeout(() => setJump(false), 1100);
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 1800);
  };

  const isFull = variant === 'full';

  return (
    <section
      ref={root}
      id={id}
      className={`hero ${isFull ? 'hero--full' : 'hero--compact'}`}
      aria-label={label || 'Scène marine : un vaquita flotte pendant qu’un bateau remonte des filets de pêche'}
    >
      {/* CIEL */}
      <Layer className="hero-sky" d={4} k={0.6} aria-hidden="true">
        <img src={A.sky.src} alt="" className="w-full h-full object-cover" draggable="false" />
      </Layer>

      {/* NUAGES */}
      <Layer className="hero-clouds" d={10} k={0.55} aria-hidden="true">
        <div
          className="hero-drift"
          style={{ '--tile': `${A.clouds.tile}px`, backgroundImage: `url("${A.clouds.src}")`, animationDuration: `${A.clouds.speed}s` }}
        />
      </Layer>

      {/* GRAND TITRE posé sur l'horizon (la mer passe devant sa base) */}
      {isFull && bigTitle && (
        <Layer className="hero-title-layer" d={14} k={0.42}>
          <TitleTag className="hero-title" aria-label={bigTitle}>
            {bigTitle.split(' ').map((word, wi) => (
              <span className="hero-title-word" key={wi} aria-hidden="true">
                {word.split('').map((ch, ci) => (
                  <span className="hero-letter" key={ci} style={{ animationDelay: `${300 + (wi * 7 + ci) * 55}ms` }}>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </TitleTag>
        </Layer>
      )}

      {/* MER LOINTAINE */}
      <Sea asset={A.seaBack} className="hero-sea-back" d={8} k={0.32} bob={4} bobDur={7} />

      {/* BATEAU + FILET REMONTÉ */}
      <Layer className="hero-boat" d={12} k={0.3}>
        <div className="hero-boat-anchor">
          <div className="hero-boat-rock">
            <img src={A.boat.src} alt={A.boat.alt} className="w-full h-auto block" draggable="false" />
            <div className="hero-net-hauled" aria-hidden="true">
              <img src={A.netHauled.src} alt="" className="w-full h-auto block" draggable="false" />
            </div>
          </div>
        </div>
      </Layer>

      {/* MER MÉDIANE */}
      <Sea asset={A.seaMid} className="hero-sea-mid" d={18} k={0.16} bob={7} bobDur={5.5} bobDelay={-1.2} reverse />

      {/* VAQUITA (image temporaire) */}
      <Layer className="hero-vaquita" d={26} k={0.08}>
        <div className="hero-vaquita-anchor">
          <div
            className={`hero-vaquita-float ${jump ? 'is-jumping' : ''}`}
            onClick={poke}
            data-cursor="Coucou !"
            role="presentation"
          >
            <img src={A.vaquita.src} alt={A.vaquita.alt} className="w-full h-auto block" draggable="false" />
          </div>
          <div className="hero-ripples" aria-hidden="true">
            <span className="hero-ripple" />
            <span className="hero-ripple" style={{ animationDelay: '1.4s' }} />
            {ripples.map((id) => (
              <span key={id} className="hero-ripple hero-ripple--splash" />
            ))}
          </div>
        </div>
      </Layer>

      {/* MER AVANT */}
      <Sea asset={A.seaFront} className="hero-sea-front" d={34} k={0} bob={9} bobDur={4.8} bobDelay={-2} />

      {/* FILETS QUI DÉRIVENT */}
      <Layer className="hero-net-drift hero-net-drift--a" d={40} k={-0.05} aria-hidden="true">
        <img src={A.netDrift.src} alt="" className="w-full h-auto block" draggable="false" />
      </Layer>
      <Layer className="hero-net-drift hero-net-drift--b" d={46} k={-0.08} aria-hidden="true">
        <img src={A.netDrift.src} alt="" className="w-full h-auto block" draggable="false" />
      </Layer>

      {/* CONTENU TEXTE dans le ciel */}
      <div className="hero-copy">{children}</div>

      {isFull && (
        <button type="button" onClick={onScrollCue} className="hero-cue" data-cursor="Plonger">
          <span>Plonger</span>
          <span className="hero-cue-line" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
