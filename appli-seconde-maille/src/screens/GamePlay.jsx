import React, { useEffect, useRef, useState } from 'react';
import { X, Pause, Play, Heart, Timer, Droplets, Flame, RotateCcw, Hand } from 'lucide-react';
import { useNav } from '../App';
import { useStore } from '../state/store';
import { loadAssets, createGame } from '../game/engine';
import { LIVES, GAME_NAME, collabPhase, dayKey, pointsFor, scoreFor, streakIncluding } from '../data/game';

export default function GamePlay() {
  const { pop } = useNav();
  const { state, dispatch } = useStore();
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState('ready');
  const [hud, setHud] = useState({ seconds: 0, bubbles: 0, lives: LIVES });
  const [result, setResult] = useState(null);
  const [run, setRun] = useState(0); // relance une partie d'entraînement

  // la partie compte-t-elle ? (pendant la collab, 1 par jour)
  const today = dayKey();
  const live = collabPhase() === 'live';
  const playedToday = state.games.some((g) => !g.training && g.day === today);
  const counts = live && !playedToday;
  const countsRef = useRef(counts);
  countsRef.current = counts;
  const gamesRef = useRef(state.games);
  gamesRef.current = state.games;

  useEffect(() => {
    let game;
    let cancelled = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    loadAssets().then((assets) => {
      if (cancelled || !canvasRef.current) return;
      game = createGame(canvasRef.current, assets, {
        lives: LIVES,
        reducedMotion: reduced,
        onHud: (h) => setHud(h),
        onOver: ({ seconds, bubbles }) => {
          const training = !countsRef.current;
          const prevStreak = streakIncluding(gamesRef.current, new Date(Date.now() - 864e5));
          const streak = training ? prevStreak : prevStreak + 1;
          const pts = pointsFor(seconds, bubbles, streak);
          const prevBest = gamesRef.current.reduce((m, g) => Math.max(m, g.score), 0);
          const score = scoreFor(seconds, bubbles);
          const rec = {
            id: `g${Date.now()}`,
            day: dayKey(),
            date: new Date().toISOString(),
            seconds: Math.round(seconds * 10) / 10,
            bubbles,
            score,
            points: training ? 0 : pts.total,
            training
          };
          dispatch({ type: 'game', game: rec });
          setResult({ ...rec, pts, streak, best: score > prevBest });
          setPhase('over');
        }
      });
      gameRef.current = game;
      setReady(true);
    });
    const onVis = () => {
      if (document.hidden && gameRef.current?.phase === 'playing') {
        gameRef.current.pause();
        setPhase('paused');
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVis);
      game?.destroy();
      gameRef.current = null;
    };
  }, [run]);

  const start = () => {
    gameRef.current?.start();
    setPhase('playing');
  };
  const togglePause = () => {
    const g = gameRef.current;
    if (!g) return;
    if (phase === 'playing') {
      g.pause();
      setPhase('paused');
    } else if (phase === 'paused') {
      g.resume();
      setPhase('playing');
    }
  };
  const again = () => {
    setResult(null);
    setHud({ seconds: 0, bubbles: 0, lives: LIVES });
    setPhase('ready');
    setReady(false);
    setRun((r) => r + 1);
  };

  return (
    <div className="game">
      <canvas key={run} ref={canvasRef} className="game-canvas" aria-label="Jeu : guide le vaquita entre les filets" />

      {/* HUD */}
      <div className="game-hud">
        <button onClick={pop} className="game-ic" aria-label="Quitter le jeu">
          <X className="w-5 h-5" />
        </button>
        <div className="game-stats">
          <span className="game-stat">
            <Timer className="w-3.5 h-3.5" /> {hud.seconds.toFixed(1)} s
          </span>
          <span className="game-stat">
            <Droplets className="w-3.5 h-3.5" /> {hud.bubbles}
          </span>
          <span className="game-stat game-lives" aria-label={`${hud.lives} vies`}>
            {Array.from({ length: LIVES }).map((_, i) => (
              <Heart key={i} className={`w-3.5 h-3.5 ${i < hud.lives ? 'is-on' : ''}`} />
            ))}
          </span>
        </div>
        <button onClick={togglePause} className="game-ic" aria-label={phase === 'paused' ? 'Reprendre' : 'Pause'} disabled={phase !== 'playing' && phase !== 'paused'}>
          {phase === 'paused' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
      </div>

      {/* départ */}
      {phase === 'ready' && (
        <div className="game-overlay" onClick={() => ready && start()}>
          <div className="game-card pop-in" onClick={(e) => e.stopPropagation()}>
            <p className="game-kicker">{counts ? 'Partie du jour · elle compte !' : 'Mode entraînement'}</p>
            <p className="font-display uppercase text-[34px] leading-[0.9] text-[#0F2926] mt-1">{GAME_NAME}</p>
            <p className="text-sm text-slate-600 mt-2">Guide le vaquita entre les filets égarés. Attrape les bulles d’air pour gagner plus.</p>
            <ul className="game-howto">
              <li>
                <Hand className="w-4 h-4" /> Glisse le doigt (ou flèches ↑ ↓)
              </li>
              <li>
                <Heart className="w-4 h-4" /> {LIVES} vies, la mer accélère
              </li>
            </ul>
            {!counts && (
              <p className="text-[11px] text-slate-500 mt-3">
                {live ? 'Ta partie du jour est jouée : celle-ci ne rapporte pas de points. Reviens demain !' : 'Les parties rapportent des points du 20 janvier au 20 mars 2027. Entraîne-toi d’ici là !'}
              </p>
            )}
            <button onClick={start} disabled={!ready} className="app-btn app-btn-ink w-full mt-4">
              {ready ? 'Plonger' : 'Chargement…'}
            </button>
          </div>
        </div>
      )}

      {phase === 'paused' && (
        <div className="game-overlay" onClick={togglePause}>
          <div className="game-card pop-in text-center">
            <p className="font-display uppercase text-3xl text-[#0F2926]">Pause</p>
            <button onClick={togglePause} className="app-btn app-btn-ink w-full mt-4">
              <Play className="w-4 h-4" /> Reprendre
            </button>
          </div>
        </div>
      )}

      {/* résultat */}
      {phase === 'over' && result && (
        <div className="game-overlay">
          <div className="game-card pop-in">
            <p className="game-kicker">{result.best ? 'Nouveau record !' : 'Pris dans les mailles'}</p>
            <div className="flex items-end justify-between mt-1">
              <p className="font-display text-[56px] leading-none text-[#0F2926]">{result.score}</p>
              <img src="/brand/vaquita-mascotte.png" alt="" className="w-16 wiggle" />
            </div>
            <div className="game-res">
              <span>
                <Timer className="w-4 h-4" /> {result.seconds.toFixed(1)} s
              </span>
              <span>
                <Droplets className="w-4 h-4" /> {result.bubbles} bulle{result.bubbles > 1 ? 's' : ''}
              </span>
            </div>
            {result.training ? (
              <div className="game-pts is-training">
                <p className="text-xs font-extrabold">Entraînement</p>
                <p className="text-[12px]">
                  En partie du jour, tu aurais gagné <b>{result.pts.base} pts</b>.
                </p>
              </div>
            ) : (
              <div className="game-pts">
                <p className="font-display text-3xl leading-none">+{result.pts.total} pts</p>
                <p className="text-[11px] mt-1">
                  {result.pts.base} pts de survie
                  {result.pts.streakBonus > 0 && ` + ${result.pts.streakBonus} pts de série`}
                </p>
                <p className="text-[11px] mt-1 inline-flex items-center gap-1 font-extrabold">
                  <Flame className="w-3.5 h-3.5" /> Série : {result.streak} jour{result.streak > 1 ? 's' : ''}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button onClick={pop} className="app-btn app-btn-ghost">
                Terminer
              </button>
              <button onClick={again} className="app-btn app-btn-ink">
                <RotateCcw className="w-4 h-4" /> Rejouer
              </button>
            </div>
            {!result.training && <p className="text-[10px] text-slate-500 text-center mt-2">Les prochaines parties d’aujourd’hui sont en entraînement.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
