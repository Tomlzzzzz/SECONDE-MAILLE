import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

/*
  Contexte "mouvement réduit"
  (option RGAA du header + préférence système prefers-reduced-motion)
*/
export const MotionContext = createContext({ reduce: false });
export const useReduce = () => useContext(MotionContext).reduce;

export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setPrefers(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return prefers;
}

/* Observe l'entrée d'un élément dans le viewport (une seule fois) */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: options.threshold ?? 0.15, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/*
  Révélation au scroll
  direction : up | left | right | scale | clip
*/
export function Reveal({ children, direction = 'up', delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal reveal-${direction} ${inView ? 'is-in' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Titre découpé mot par mot, chaque mot remonte depuis un masque */
export function SplitText({ text, as: Tag = 'h2', className = '', delay = 0, stagger = 55 }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const words = String(text).split(' ');
  return (
    <Tag ref={ref} className={`split ${inView ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="split-mask" aria-hidden="true">
          <span className="split-word" style={{ transitionDelay: `${delay + i * stagger}ms` }}>
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/* Compteur animé à l'apparition */
export function CountUp({ to, duration = 1600, prefix = '', suffix = '', className = '', format = true }) {
  const reduce = useReduce();
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setVal(to);
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  const shown = format ? val.toLocaleString('fr-FR') : val;
  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/* Bouton/élément "magnétique" : suit légèrement la souris au survol */
export function Magnetic({ children, strength = 0.28, className = '' }) {
  const reduce = useReduce();
  const ref = useRef(null);
  const onMove = (e) => {
    if (reduce) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate3d(0,0,0)';
  };
  return (
    <span ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`magnetic inline-block ${className}`}>
      {children}
    </span>
  );
}

/* Carte inclinable 3D + halo lumineux qui suit la souris */
export function TiltCard({ children, className = '', max = 6, ...rest }) {
  const reduce = useReduce();
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--spot-x', `${px * 100}%`);
    el.style.setProperty('--spot-y', `${py * 100}%`);
    if (reduce) return;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-card ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* Séparateur en forme de vague (top = la vague est en haut de la section suivante) */
// en mode sombre, le blanc et le sable deviennent les fonds sombres (variables CSS)
const THEMED = { '#ffffff': 'var(--c-white)', '#fff': 'var(--c-white)', '#f5fbf9': 'var(--c-sand)' };
export const themedFill = (c) => THEMED[String(c).toLowerCase()] || c;

export function WaveDivider({ color = '#FFFFFF', className = '', flip = false, animated = true }) {
  // motif périodique sur 1200 px, dupliqué sur 2400 -> défilement sans couture
  const d =
    'M0,40 C200,10 400,10 600,40 C800,70 1000,70 1200,40 C1400,10 1600,10 1800,40 C2000,70 2200,70 2400,40 L2400,80 L0,80 Z';
  return (
    <div className={`wave-divider ${flip ? 'rotate-180' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 2400 80" preserveAspectRatio="none" className={animated ? 'wave-divider-anim' : ''}>
        <path d={d} style={{ fill: themedFill(color) }} />
      </svg>
    </div>
  );
}

/* Barre de progression de lecture */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
      raf = null;
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
    };
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

/* Curseur "bulle" qui suit la souris (desktop uniquement, curseur natif conservé) */
export function CursorBubble() {
  const reduce = useReduce();
  const ring = useRef(null);
  const label = useRef(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches && !reduce);
  }, [reduce]);
  useEffect(() => {
    if (!enabled) return;
    let x = -100, y = -100, tx = -100, ty = -100, raf;
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target.closest?.('a, button, [data-cursor]');
      const el = ring.current;
      if (!el) return;
      el.classList.toggle('is-hover', !!target);
      const text = target?.getAttribute?.('data-cursor') || '';
      el.classList.toggle('has-label', !!text);
      if (label.current) label.current.textContent = text;
    };
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => ring.current?.classList.add('is-hidden');
    const onEnter = () => ring.current?.classList.remove('is-hidden');
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled]);
  if (!enabled) return null;
  return (
    <div ref={ring} className="cursor-bubble" aria-hidden="true">
      <span ref={label} className="cursor-label" />
    </div>
  );
}

/* Bandeau de texte géant qui défile, accéléré par la vitesse de scroll */
export function VelocityMarquee({ items, className = '', baseSpeed = 0.6, outline = true }) {
  const reduce = useReduce();
  const track = useRef(null);
  useEffect(() => {
    if (reduce) return;
    let x = 0, last = window.scrollY, vel = 0, raf, dir = -1;
    const loop = () => {
      const y = window.scrollY;
      const dy = y - last;
      last = y;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      vel += (Math.abs(dy) * 0.25 - vel) * 0.1;
      x += dir * (baseSpeed + vel);
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce, baseSpeed]);
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className={`marquee-word ${outline && i % 2 ? 'is-outline' : ''}`}>
          {t}
          <span className="marquee-dot" />
        </span>
      ))}
    </>
  );
  return (
    <div className={`overflow-hidden select-none ${className}`} aria-hidden="true">
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}

/* Progression de scroll d'un élément (0 quand son haut touche le bas de l'écran -> 1 quand son bas touche le haut) */
export function useElementProgress(ref, mode = 'pin') {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf;
    const update = () => {
      raf = null;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let v;
      if (mode === 'pin') v = -r.top / Math.max(1, r.height - vh);
      else v = (vh - r.top) / (vh + r.height);
      setP(Math.max(0, Math.min(1, v)));
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
    };
  }, [mode]);
  return p;
}
