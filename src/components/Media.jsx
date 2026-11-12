import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useReduce } from './Motion';
import { Mascot } from './Brand';

const base = `${import.meta.env?.BASE_URL ?? '/'}media/`;
export const media = (f) => base + f;

const fmt = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

// vrai tant que l'élément est à l'écran (contrairement à useInView qui ne sert qu'une fois)
function useVisible(threshold = 0.35) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// plein écran : contrôles natifs pendant le plein écran, rendu perso sinon
function goFullscreen(el, onEnter) {
  if (!el) return;
  onEnter?.();
  const exit = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      el.controls = false;
      document.removeEventListener('fullscreenchange', exit);
      document.removeEventListener('webkitfullscreenchange', exit);
    }
  };
  el.controls = true;
  if (el.requestFullscreen) {
    el.requestFullscreen().then(() => el.play().catch(() => {})).catch(() => (el.controls = false));
    document.addEventListener('fullscreenchange', exit);
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
    document.addEventListener('webkitfullscreenchange', exit);
  } else if (el.webkitEnterFullscreen) {
    // iPhone : lecteur natif
    el.webkitEnterFullscreen();
    el.play().catch(() => {});
    el.addEventListener('webkitendfullscreen', () => (el.controls = false), { once: true });
  }
}

function FullBtn({ onClick, className = 'bg-white/15' }) {
  return (
    <button type="button" onClick={onClick} className={`w-9 h-9 rounded-full grid place-items-center ${className}`} aria-label="Plein écran" title="Plein écran">
      <Maximize className="w-4 h-4" />
    </button>
  );
}

// lecture / pause / progression d'un élément <video> ou <audio>
function usePlayer() {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    const tick = () => setTime(el.currentTime);
    const meta = () => setDuration(el.duration);
    el.addEventListener('play', on);
    el.addEventListener('pause', off);
    el.addEventListener('ended', off);
    el.addEventListener('timeupdate', tick);
    el.addEventListener('loadedmetadata', meta);
    return () => {
      el.removeEventListener('play', on);
      el.removeEventListener('pause', off);
      el.removeEventListener('ended', off);
      el.removeEventListener('timeupdate', tick);
      el.removeEventListener('loadedmetadata', meta);
    };
  }, []);
  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };
  const seek = (ratio) => {
    const el = ref.current;
    if (el && el.duration) el.currentTime = ratio * el.duration;
  };
  return { ref, playing, time, duration, progress: duration ? time / duration : 0, toggle, seek };
}

function SeekBar({ progress, onSeek, light = true, label }) {
  const click = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };
  const key = (e) => {
    if (e.key === 'ArrowRight') onSeek(Math.min(1, progress + 0.05));
    if (e.key === 'ArrowLeft') onSeek(Math.max(0, progress - 0.05));
  };
  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      onClick={click}
      onKeyDown={key}
      className={`media-seek h-1.5 rounded-full cursor-pointer ${light ? 'bg-white/25' : 'bg-[#0F2926]/15'}`}
    >
      <div className="h-full rounded-full bg-[#a5d2b2]" style={{ width: `${progress * 100}%` }} />
    </div>
  );
}

/* Teaser vertical dans un téléphone */
export function PhoneVideo({ src, poster, title, chapters = [], controlRef, onTime }) {
  const p = usePlayer();
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  // pilotage depuis l'extérieur (les étapes de la visite)
  useEffect(() => {
    if (!controlRef) return;
    controlRef.current = {
      jump: (t) => {
        const el = p.ref.current;
        if (!el) return;
        setStarted(true);
        el.currentTime = t;
        el.play().catch(() => {});
      }
    };
  });
  useEffect(() => {
    onTime?.(p.time);
  }, [p.time]);

  const start = () => {
    setStarted(true);
    p.toggle();
  };

  return (
    <div className="media-phone relative mx-auto w-full max-w-[330px]">
      <div className="rounded-[46px] bg-[#0F2926] p-2.5 shadow-phone">
        <div className="relative rounded-[38px] overflow-hidden bg-black aspect-[9/16]">
          <video
            ref={p.ref}
            src={src}
            poster={poster}
            playsInline
            preload="metadata"
            muted={muted}
            onClick={start}
            className="absolute inset-0 w-full h-full object-cover"
            aria-label={title}
          />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/70" aria-hidden="true" />

          {!p.playing && (
            <button type="button" onClick={start} className="media-cover absolute inset-0 flex flex-col items-center justify-center gap-4 text-white" aria-label={`Lire : ${title}`}>
              <span className="media-play w-20 h-20 rounded-full bg-[#a5d2b2] text-[#0F2926] grid place-items-center">
                <Play className="w-8 h-8 translate-x-0.5" fill="currentColor" />
              </span>
              {!started && <span className="font-display uppercase text-2xl leading-none text-center px-6 drop-shadow">{title}</span>}
            </button>
          )}

          <div className={`absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${started ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="relative">
              <SeekBar progress={p.progress} onSeek={p.seek} label="Avancer dans la vidéo" />
              {p.duration > 0 &&
                chapters.map((c) => (
                  <span key={c.t} className="absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-white/80 pointer-events-none" style={{ left: `${(c.t / p.duration) * 100}%` }} aria-hidden="true" />
                ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-white">
              <button type="button" onClick={p.toggle} className="w-9 h-9 rounded-full bg-white/15 grid place-items-center" aria-label={p.playing ? 'Pause' : 'Lecture'}>
                {p.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-xs font-bold tabular-nums">{fmt(p.time)} / {fmt(p.duration)}</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setMuted((m) => !m)} className="w-9 h-9 rounded-full bg-white/15 grid place-items-center" aria-label={muted ? 'Activer le son' : 'Couper le son'}>
                  {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <FullBtn onClick={() => goFullscreen(p.ref.current, () => setStarted(true))} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Écran mural de la boutique : deux boucles, on zappe comme à la télé */
export function ShopScreen({ channels }) {
  const reduce = useReduce();
  const [wrap, visible] = useVisible(0.3);
  const [ch, setCh] = useState(0);
  const p = usePlayer();
  const current = channels[ch];

  useEffect(() => {
    const el = p.ref.current;
    if (!el) return;
    if (visible && !reduce) el.play().catch(() => {});
    else el.pause();
  }, [visible, reduce, ch]);

  return (
    <div ref={wrap} className="shop-screen">
      {/* fixation murale */}
      <div className="flex justify-center gap-[38%]" aria-hidden="true">
        <span className="w-1 h-8 bg-[#0F2926]/70 rounded-full" />
        <span className="w-1 h-8 bg-[#0F2926]/70 rounded-full" />
      </div>
      <div className="rounded-[22px] bg-[#0F2926] p-2.5 sm:p-3 shadow-[0_30px_60px_-30px_rgba(15,41,38,0.7)]">
        <div className="relative rounded-[14px] overflow-hidden bg-black aspect-video">
          <video
            key={current.src}
            ref={p.ref}
            src={current.src}
            poster={current.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="screen-video absolute inset-0 w-full h-full object-cover"
            aria-label={current.title}
          />
          <span className="screen-flash absolute inset-0 bg-white pointer-events-none" key={`f${ch}`} aria-hidden="true" />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 text-white text-[10px] font-extrabold uppercase tracking-[0.15em] px-2.5 py-1">
            <span className={`w-1.5 h-1.5 rounded-full ${p.playing ? 'bg-[#a5d2b2] animate-pulse' : 'bg-white/50'}`} /> CH {ch + 1} · en boucle
          </span>
          <div className="absolute bottom-3 right-3 flex gap-2 text-white">
            <button
              type="button"
              onClick={p.toggle}
              className="w-9 h-9 rounded-full bg-black/55 grid place-items-center"
              aria-label={p.playing ? 'Mettre en pause' : 'Lancer la boucle'}
            >
              {p.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <FullBtn className="bg-black/55" onClick={() => goFullscreen(p.ref.current)} />
          </div>
        </div>
        <div className="flex items-center justify-between px-2 pt-2.5" aria-hidden="true">
          <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-white/40">Seconde Maille</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#a5d2b2]" />
        </div>
      </div>

      {/* télécommande */}
      <div className="mt-6 flex flex-wrap gap-2.5" role="tablist" aria-label="Écrans de la boutique">
        {channels.map((c, i) => (
          <button
            key={c.src}
            type="button"
            role="tab"
            aria-selected={ch === i}
            onClick={() => setCh(i)}
            className={`channel-btn inline-flex items-center gap-2.5 rounded-full pl-1.5 pr-4 py-1.5 text-sm font-extrabold transition-colors ${
              ch === i ? 'bg-[#18407f] text-white' : 'bg-white text-[#0F2926] border border-[#a5d2b2]'
            }`}
          >
            <span className={`w-7 h-7 rounded-full grid place-items-center font-display text-sm ${ch === i ? 'bg-[#a5d2b2] text-[#0F2926]' : 'bg-[#F5FBF9]'}`}>{i + 1}</span>
            {c.title}
          </button>
        ))}
      </div>
      <p className="mt-4 text-slate-700 leading-relaxed max-w-2xl">{current.text}</p>
      {current.legend && (
        <div className="mt-3 flex flex-wrap gap-2">
          {current.legend.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#0F2926]/10 px-3 py-1 text-xs font-bold text-[#0F2926]">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} /> {l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Format "story" : boucle muette à l'écran, un clic pour le son */
export function StoryVideo({ src, poster, title, caption, step }) {
  const reduce = useReduce();
  const [wrap, visible] = useVisible(0.45);
  const p = usePlayer();
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = p.ref.current;
    if (!el) return;
    if (visible && !reduce) el.play().catch(() => {});
    else el.pause();
  }, [visible, reduce]);

  const sound = () => {
    const el = p.ref.current;
    setMuted((m) => !m);
    if (el && el.paused) el.play().catch(() => {});
  };

  return (
    <figure ref={wrap} className="media-story">
      <div className="relative rounded-[30px] overflow-hidden bg-[#0F2926] aspect-[9/16] shadow-[0_30px_50px_-30px_rgba(15,41,38,0.6)]">
        <video
          ref={p.ref}
          src={src}
          poster={poster}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          aria-label={title}
        />
        {/* en-tête façon story */}
        <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-black/45 to-transparent">
          <div className="h-[3px] rounded-full bg-white/30 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${p.progress * 100}%` }} />
          </div>
          <div className="flex items-center gap-2 mt-2.5 text-white">
            <span className="w-8 h-8 rounded-full bg-white grid place-items-center overflow-hidden ring-2 ring-[#a5d2b2]">
              <Mascot className="w-6" />
            </span>
            <span className="text-xs font-extrabold">seconde.maille</span>
            <span className="text-xs text-white/70">{fmt(p.duration)}</span>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 flex gap-2">
          <FullBtn className="w-10 h-10 bg-black/45 text-white" onClick={() => goFullscreen(p.ref.current, () => setMuted(false))} />
          <button type="button" onClick={p.toggle} className="w-10 h-10 rounded-full bg-black/45 text-white grid place-items-center" aria-label={p.playing ? 'Pause' : 'Lecture'}>
            {p.playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button type="button" onClick={sound} className="w-10 h-10 rounded-full bg-[#a5d2b2] text-[#0F2926] grid place-items-center" aria-label={muted ? 'Activer le son' : 'Couper le son'}>
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <figcaption className="mt-5">
        <span className="font-display text-sm text-[#18407f]">{step}</span>
        <h3 className="font-display uppercase text-2xl text-[#0F2926] leading-none mt-1">{title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mt-2">{caption}</p>
      </figcaption>
    </figure>
  );
}

/* Spot radio : forme d'onde cliquable */
export function RadioSpot({ src, peaks, title, text }) {
  const p = usePlayer();
  const bars = peaks.length;
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const el = p.ref.current;
    if (!el) return;
    el.volume = volume;
    el.muted = muted;
  }, [volume, muted]);
  const level = muted ? 0 : volume;
  return (
    <div className={`radio-spot rounded-[30px] bg-[#0F2926] text-white p-6 sm:p-7 ${p.playing ? 'is-on' : ''}`}>
      <audio ref={p.ref} src={src} preload="metadata" />
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em]">
          <span className="on-air-dot w-2 h-2 rounded-full bg-[#a5d2b2]" /> {p.playing ? 'À l’antenne' : 'Spot radio'}
        </span>
        <span className="text-xs font-bold text-white/60 tabular-nums">{fmt(p.time)} / {fmt(p.duration || 30)}</span>
      </div>
      <p className="font-display uppercase text-[clamp(26px,3vw,36px)] leading-[0.95] mt-5">{title}</p>
      <p className="text-sm text-white/70 leading-relaxed mt-2">{text}</p>

      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          onClick={p.toggle}
          className="media-play shrink-0 w-14 h-14 rounded-full bg-[#a5d2b2] text-[#0F2926] grid place-items-center"
          aria-label={p.playing ? 'Mettre le spot en pause' : 'Écouter le spot radio'}
        >
          {p.playing ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 translate-x-0.5" fill="currentColor" />}
        </button>
        <div
          className="flex-1 h-14 flex items-center gap-[3px] cursor-pointer"
          role="slider"
          tabIndex={0}
          aria-label="Avancer dans le spot"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p.progress * 100)}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            p.seek((e.clientX - r.left) / r.width);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') p.seek(Math.min(1, p.progress + 0.05));
            if (e.key === 'ArrowLeft') p.seek(Math.max(0, p.progress - 0.05));
          }}
        >
          {peaks.map((v, i) => (
            <span
              key={i}
              className="wave-bar flex-1 rounded-full"
              style={{
                height: `${Math.max(10, v * 100)}%`,
                background: i / bars < p.progress ? '#a5d2b2' : 'rgba(255,255,255,0.22)',
                animationDelay: `${(i % 9) * 70}ms`
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="w-9 h-9 rounded-full bg-white/10 grid place-items-center shrink-0"
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
        >
          {level === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={level}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            setMuted(Number(e.target.value) === 0);
          }}
          className="radio-volume w-36 sm:w-44"
          style={{ '--v': `${level * 100}%` }}
          aria-label="Volume du spot radio"
        />
        <span className="text-xs font-bold text-white/60 tabular-nums w-9">{Math.round(level * 100)} %</span>
      </div>
    </div>
  );
}
