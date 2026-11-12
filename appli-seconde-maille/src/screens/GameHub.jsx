import React, { useMemo } from 'react';
import { Flame, Trophy, Timer, Droplets, Check, CalendarDays, Waves, Gamepad2, Medal } from 'lucide-react';
import { TopBar, Avatar, Pill, Counter } from '../components/ui';
import { useNav } from '../App';
import { useStore } from '../state/store';
import { MEMBERS } from '../data/members';
import { GAME_NAME, COLLAB_START, MAX_GAME_POINTS, STREAK_STEP, STREAK_MAX, collabPhase, dayKey, streakIncluding, dailyBoard } from '../data/game';

const DAY_LETTERS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export default function GameHub() {
  const { push } = useNav();
  const { state } = useStore();
  const phase = collabPhase();
  const today = dayKey();
  const real = state.games.filter((g) => !g.training);
  const todayGame = real.find((g) => g.day === today);
  const streak = streakIncluding(state.games) || streakIncluding(state.games, new Date(Date.now() - 864e5));
  const best = state.games.reduce((m, g) => Math.max(m, g.score), 0);
  const gamePts = real.reduce((a, g) => a + g.points, 0);
  const daysToStart = Math.max(0, Math.ceil((COLLAB_START - Date.now()) / 864e5));

  // 7 derniers jours
  const week = useMemo(() => {
    const played = new Set(real.map((g) => g.day));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const k = dayKey(d);
      return { k, l: DAY_LETTERS[d.getDay()], n: d.getDate(), on: played.has(k), today: k === today };
    });
  }, [state.games]);

  // classement du jour
  const myToday = state.games.filter((g) => g.day === today).reduce((m, g) => Math.max(m, g.score), 0);
  const board = useMemo(() => {
    const list = dailyBoard(MEMBERS);
    const me = { id: 'me', pseudo: state.profile.pseudo, color: state.profile.color, score: myToday, me: true };
    return (myToday ? [...list, me] : list).sort((a, b) => b.score - a.score);
  }, [myToday, state.profile.pseudo]);
  const myRank = board.findIndex((m) => m.me) + 1;
  const shown = board.slice(0, 5);

  const status =
    phase === 'before'
      ? { kicker: `Ouvre dans ${daysToStart} j · 20 janv. 2027`, title: 'Entraîne-toi', text: 'Le jeu rapporte des points pendant la collab, du 20 janvier au 20 mars 2027. D’ici là, les parties sont libres.' }
      : phase === 'after'
      ? { kicker: 'Collab terminée', title: 'Merci d’avoir nagé', text: 'La saison est finie : le jeu reste ouvert en entraînement.' }
      : todayGame
      ? { kicker: 'Partie du jour jouée', title: `+${todayGame.points} pts`, text: 'Reviens demain pour garder ta série. Tu peux continuer en entraînement.' }
      : { kicker: 'Partie du jour disponible', title: 'Elle compte !', text: 'Une partie par jour rapporte des points. Plus tu survis, plus tu gagnes.' };

  return (
    <div className="h-full flex flex-col bg-[#F5FBF9]">
      <TopBar title="Le Jeu" right={<Pill tone="blue" className="whitespace-nowrap"><Flame className="w-3 h-3" /> {streak} j</Pill>} />
      <div className="flex-1 overflow-y-auto pb-28">
        {/* carte du jeu */}
        <section className="mx-4 mt-1 game-hero">
          <div className="game-hero-scene" aria-hidden="true">
            <img src="/game/sky.svg" alt="" className="gh-sky" />
            <img src="/game/city.svg" alt="" className="gh-city" />
            <img src="/game/boat.svg" alt="" className="gh-boat" />
            <div className="gh-water" />
            <img src="/game/net-drift.svg" alt="" className="gh-net" />
            <img src="/game/vaquita.svg" alt="" className="gh-vaquita" />
            <span className="gh-bub" style={{ left: '62%', animationDelay: '0s' }} />
            <span className="gh-bub" style={{ left: '74%', animationDelay: '1.2s' }} />
            <span className="gh-bub" style={{ left: '40%', animationDelay: '2.1s' }} />
          </div>
          <div className="relative p-4 pt-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#bae3d1]">{status.kicker}</p>
            <p className="font-display uppercase text-[40px] leading-[0.88] text-white mt-1">{GAME_NAME}</p>
            <p className="text-[12px] text-white/75 mt-2 max-w-[260px]">{status.text}</p>
            <button onClick={() => push('game')} className="app-btn app-btn-aqua w-full mt-4">
              <Gamepad2 className="w-4 h-4" />
              {phase === 'live' && !todayGame ? 'Jouer la partie du jour' : 'Jouer'}
            </button>
          </div>
        </section>

        {/* série */}
        <section className="mx-4 mt-4 p-4 rounded-3xl bg-white border border-[#bae3d1]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#0F2926] inline-flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#194080]" /> Ma série
            </p>
            <p className="text-[11px] text-slate-500">+{STREAK_STEP} pts / jour d’affilée (max +{STREAK_MAX})</p>
          </div>
          <ol className="streak mt-3">
            {week.map((d) => (
              <li key={d.k} className={`${d.on ? 'is-on' : ''} ${d.today ? 'is-today' : ''}`}>
                <span className="streak-dot">{d.on ? <Check className="w-3.5 h-3.5" /> : d.n}</span>
                <span className="streak-l">{d.l}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* stats */}
        <section className="mx-4 mt-3 grid grid-cols-3 gap-2">
          <div className="game-tile">
            <Trophy className="w-4 h-4 text-[#194080]" />
            <p className="font-display text-2xl leading-none mt-1">{best}</p>
            <p className="text-[10px] text-slate-500">record</p>
          </div>
          <div className="game-tile">
            <Waves className="w-4 h-4 text-[#194080]" />
            <p className="font-display text-2xl leading-none mt-1">
              <Counter value={gamePts} />
            </p>
            <p className="text-[10px] text-slate-500">pts gagnés</p>
          </div>
          <div className="game-tile">
            <CalendarDays className="w-4 h-4 text-[#194080]" />
            <p className="font-display text-2xl leading-none mt-1">
              {real.length}
            </p>
            <p className="text-[10px] text-slate-500">jours joués</p>
          </div>
        </section>

        {/* classement du jour */}
        <section className="mx-4 mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-extrabold text-[#0F2926]">Les meilleurs nageurs du jour</p>
            {myRank > 0 && <Pill tone="aqua">Toi : {myRank}e</Pill>}
          </div>
          <ul className="space-y-1.5">
            {shown.map((m, i) => (
              <li key={m.id} className={`game-row ${m.me ? 'is-me' : ''}`}>
                <span className="w-5 text-center font-display text-lg">{i < 3 ? <Medal className={`w-4 h-4 mx-auto medal-${i}`} /> : i + 1}</span>
                <Avatar pseudo={m.pseudo} color={m.color} size={30} me={m.me} />
                <span className="flex-1 min-w-0 text-sm font-extrabold truncate">{m.me ? 'Toi' : m.pseudo}</span>
                <span className="font-display text-lg">{m.score}</span>
              </li>
            ))}
          </ul>
          {myRank > 5 && (
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Tu es {myRank}e sur {board.length} avec {myToday}.
            </p>
          )}
          {!myToday && <p className="text-[11px] text-slate-500 mt-2 text-center">Joue une partie pour apparaître dans le classement.</p>}
        </section>

        {/* règles */}
        <section className="mx-4 mt-5 p-4 rounded-3xl bg-[#0F2926] text-white">
          <p className="text-xs font-extrabold text-[#bae3d1] mb-2">Comment ça rapporte</p>
          <ul className="space-y-2 text-[12px] text-white/80">
            <li className="flex gap-2">
              <Timer className="w-4 h-4 shrink-0 text-[#bae3d1]" /> 1 pt toutes les 2 secondes de survie
            </li>
            <li className="flex gap-2">
              <Droplets className="w-4 h-4 shrink-0 text-[#bae3d1]" /> 1 pt par bulle d’air attrapée (max {MAX_GAME_POINTS} pts par partie)
            </li>
            <li className="flex gap-2">
              <Flame className="w-4 h-4 shrink-0 text-[#bae3d1]" /> Bonus de série : +{STREAK_STEP} pts par jour consécutif, jusqu’à +{STREAK_MAX}
            </li>
            <li className="flex gap-2">
              <CalendarDays className="w-4 h-4 shrink-0 text-[#bae3d1]" /> Une partie comptée par jour, jusqu’au 20 mars 2027 (jour du pop-up)
            </li>
          </ul>
          <p className="text-[11px] text-white/50 mt-3">Les points du jeu s’ajoutent à ceux de tes dépôts : même solde, mêmes ligues, même Pass. Pour comparer, 1 kg déposé = 100 pts.</p>
        </section>
      </div>
    </div>
  );
}
