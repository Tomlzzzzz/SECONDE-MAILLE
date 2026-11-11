import React, { useEffect, useRef } from 'react';
import { HERO_ASSETS as A } from '../config/heroAssets';
import { useReduce } from './Motion';

/**
 * Fond « plongée » : la scène marine de l'ancien header reste fixe derrière le contenu
 * et descend sous la surface au fil du scroll (surface → eaux profondes bleues).
 * --q (0 → 1) = profondeur, calculée à partir de la position de scroll dans la section.
 */
function Drift({ asset, reverse = false }) {
  return (
    <div
      className="hero-drift"
      style={{
        '--tile': `${asset.tile}px`,
        backgroundImage: `url("${asset.src}")`,
        animationDuration: `${asset.speed}s`,
        animationDirection: reverse ? 'reverse' : 'normal'
      }}
    />
  );
}

const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 41) % 100,
  size: 6 + ((i * 13) % 24),
  dur: 10 + ((i * 7) % 12),
  delay: -((i * 3.7) % 16)
}));

export default function OceanDive({ children, className = '' }) {
  const reduce = useReduce();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    let raf = null;
    const update = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
      // on atteint le fond aux ~45 % de la section, avec une courbe douce
      const t = Math.min(1, p / 0.45);
      const q = t * t * (3 - 2 * t);
      el.style.setProperty('--q', q.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={`ocean-dive ${reduce ? 'is-static' : ''} ${className}`} style={{ '--q': 0 }}>
      <div className="ocean-track" aria-hidden="true">
      <div className="ocean-sticky">
        <div className="ocean-world">
          <div className="ow ow-sky">
            <img src={A.sky.src} alt="" className="w-full h-full object-cover" draggable="false" />
          </div>
          <div className="ow ow-clouds">
            <Drift asset={A.clouds} />
          </div>

          <div className="ow ow-sea-back">
            <div className="hero-bob" style={{ '--bob': '4px', animationDuration: '7s' }}>
              <Drift asset={A.seaBack} />
            </div>
          </div>

          <div className="ow ow-boat">
            <div className="hero-boat-anchor">
              <div className="hero-boat-rock">
                <img src={A.boat.src} alt="" className="w-full h-auto block" draggable="false" />
                <div className="hero-net-hauled">
                  <img src={A.netHauled.src} alt="" className="w-full h-auto block" draggable="false" />
                </div>
              </div>
            </div>
          </div>

          <div className="ow ow-sea-mid">
            <div className="hero-bob" style={{ '--bob': '7px', animationDuration: '5.5s', animationDelay: '-1.2s' }}>
              <Drift asset={A.seaMid} reverse />
            </div>
          </div>

          <div className="ow ow-vaquita">
            <div className="hero-vaquita-anchor">
              <div className="hero-vaquita-float">
                <img src={A.vaquita.src} alt="" className="w-full h-auto block" draggable="false" />
              </div>
              <div className="hero-ripples">
                <span className="hero-ripple" />
                <span className="hero-ripple" style={{ animationDelay: '1.4s' }} />
              </div>
            </div>
          </div>

          <div className="ow ow-sea-front">
            <div className="hero-bob" style={{ '--bob': '9px', animationDuration: '4.8s', animationDelay: '-2s' }}>
              <Drift asset={A.seaFront} />
            </div>
          </div>

          {/* eaux profondes */}
          <div className="ow ow-deep" />
          <div className="ow ow-rays">
            <span style={{ left: '12%' }} />
            <span style={{ left: '34%', animationDelay: '-2s' }} />
            <span style={{ left: '58%', animationDelay: '-4s' }} />
            <span style={{ left: '80%', animationDelay: '-1s' }} />
          </div>
          <div className="ow ow-net ow-net--a">
            <img src={A.netDrift.src} alt="" className="w-full h-auto block" draggable="false" />
          </div>
          <div className="ow ow-net ow-net--b">
            <img src={A.netDrift.src} alt="" className="w-full h-auto block" draggable="false" />
          </div>
          <div className="ow ow-diver">
            <img src={A.vaquita.src} alt="" className="w-full h-auto block" draggable="false" />
          </div>
          <div className="ow ow-bubbles bubbles">
            {BUBBLES.map((b, i) => (
              <span key={i} style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
            ))}
          </div>
        </div>
        <div className="ocean-shade" />
      </div>
      </div>

      <div className="ocean-content">{children}</div>
    </div>
  );
}
