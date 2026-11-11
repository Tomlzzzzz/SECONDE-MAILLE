import React, { useMemo, useState } from 'react';
import { Trophy, Flame, ChevronUp, ChevronDown, Users, Target, Check, Clock, Scale } from 'lucide-react';
import { TopBar, Avatar, ProgressBar, Pill, timeAgo, Counter } from '../components/ui';
import { useStore } from '../state/store';
import { useToast } from '../App';
import { LEAGUES, leagueFor, WEEKLY_REWARDS, PROMOTION_ZONE } from '../data/leagues';
import { MEMBERS } from '../data/members';
import { CHALLENGES, weekKey, weekEnd } from '../data/challenges';
import { placeById } from '../data/places';

const TABS = [
  { id: 'group', label: 'Ma semaine' },
  { id: 'around', label: 'Autour de toi' },
  { id: 'ladder', label: 'Les ligues' }
];

export default function LeaguesScreen() {
  const { state, dispatch, earned, week, grams, league } = useStore();
  const toast = useToast();
  const [tab, setTab] = useState('group');
  const me = { id: 'me', pseudo: state.profile.pseudo, color: state.profile.color, total: earned, week, me: true, area: 'Toi' };

  // groupe hebdo : 19 membres de niveau proche + toi
  const group = useMemo(() => {
    const near = [...MEMBERS].sort((a, b) => Math.abs(leagueFor(a.total).index - league.index) - Math.abs(leagueFor(b.total).index - league.index)).slice(0, 19);
    return [...near, me].sort((a, b) => b.week - a.week);
  }, [league.index, week, state.profile.pseudo]);
  const myRank = group.findIndex((m) => m.me) + 1;

  // position parmi tous les membres (total)
  const all = [...MEMBERS, me].sort((a, b) => b.total - a.total);
  const globalRank = all.findIndex((m) => m.me) + 1;
  const ahead = Math.round(((all.length - globalRank) / (all.length - 1)) * 100);

  const end = weekEnd();
  const hoursLeft = Math.max(0, Math.round((end - Date.now()) / 36e5));
  const wk = weekKey();
  const weekDeps = state.deposits.filter((d) => weekKey(new Date(d.date)) === wk);

  const claim = (c) => {
    dispatch({ type: 'bonus', bonus: { id: `b${Date.now()}`, challengeId: c.id, week: wk, points: c.reward, date: new Date().toISOString() } });
    toast(`+${c.reward} pts : défi réussi !`);
  };

  const feed = [...MEMBERS].sort((a, b) => a.lastAgoMin - b.lastAgoMin).slice(0, 10);

  return (
    <div className="h-full flex flex-col bg-[#F5FBF9]">
      <TopBar title="Ligues" />
      <div className="flex-1 overflow-y-auto pb-28">
        {/* profil */}
        <section className="mx-4 mt-1 p-4 rounded-3xl bg-[#0F2926] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.08] mesh-bg" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <Avatar pseudo={state.profile.pseudo} color={state.profile.color} size={56} ring />
            <div className="min-w-0 flex-1">
              <p className="font-display uppercase text-2xl leading-none truncate">{state.profile.pseudo}</p>
              <div className="flex gap-1.5 mt-1.5">
                <Pill tone="aqua">
                  <Trophy className="w-3 h-3" /> {league.name}
                </Pill>
                <Pill tone="ghost">×{String(league.mult).replace('.', ',')} pts</Pill>
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-2 mt-4">
            {[
              [<Counter value={earned} />, 'pts gagnés'],
              [`${(grams / 1000).toFixed(1).replace('.', ',')} kg`, 'déposés'],
              [`#${globalRank}`, `sur ${all.length} membres`]
            ].map(([v, l], i) => (
              <div key={i} className="p-2.5 rounded-2xl bg-white/[0.07]">
                <p className="font-display text-xl leading-none">{v}</p>
                <p className="text-[10px] text-white/60 mt-1">{l}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="font-bold">{league.name}</span>
              <span className="text-white/60">{league.next ? `${league.toNext} pts → ${league.next.name} (×${String(league.next.mult).replace('.', ',')})` : 'Ligue maximale'}</span>
            </div>
            <ProgressBar value={league.progress} tone="#bae3d1" track="rgba(255,255,255,.12)" />
          </div>
          <p className="relative text-xs text-[#bae3d1] font-semibold mt-3">
            Tu es devant {ahead} % des membres Seconde Maille.
          </p>
        </section>

        {/* défis */}
        <section className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-extrabold text-[#0F2926] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#194080]" /> Défis de la semaine
            </p>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {hoursLeft > 48 ? `${Math.round(hoursLeft / 24)} j` : `${hoursLeft} h`} restants
            </span>
          </div>
          <ul className="space-y-2">
            {CHALLENGES.map((c) => {
              const prog = c.progress(weekDeps);
              const done = prog >= c.goal;
              const claimed = state.bonuses.some((b) => b.challengeId === c.id && b.week === wk);
              return (
                <li key={c.id} className="p-3 rounded-2xl bg-white border border-[#bae3d1] flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-[#0F2926]">{c.title}</p>
                    <div className="mt-1.5">
                      <ProgressBar value={Math.min(1, prog / c.goal)} height={6} tone={done ? '#0D9488' : '#194080'} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 tabular-nums">
                      {Math.min(prog, c.goal).toLocaleString('fr-FR')} / {c.goal.toLocaleString('fr-FR')} {c.unit}
                    </p>
                  </div>
                  {claimed ? (
                    <span className="px-3 py-2 rounded-xl bg-[#F5FBF9] text-[#0D9488] text-xs font-extrabold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Reçu
                    </span>
                  ) : (
                    <button onClick={() => claim(c)} disabled={!done} className={`px-3 py-2 rounded-xl text-xs font-extrabold ${done ? 'bg-[#194080] text-white claim-pulse' : 'bg-[#F5FBF9] text-slate-400'}`}>
                      +{c.reward}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* onglets */}
        <div className="mx-4 mt-5 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-white border border-[#bae3d1] relative" role="tablist">
          <span className="seg-blob" style={{ transform: `translateX(${TABS.findIndex((t) => t.id === tab) * 100}%)` }} aria-hidden="true" />
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`relative z-10 py-2 rounded-xl text-xs font-extrabold transition-colors ${tab === t.id ? 'text-[#bae3d1]' : 'text-[#0F2926]/60'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'group' && (
          <section key="g" className="mx-4 mt-3 tab-in">
            <div className="p-3 rounded-2xl bg-[#194080] text-white flex items-center gap-3">
              <Flame className="w-6 h-6 text-[#bae3d1]" />
              <p className="text-xs leading-snug">
                Tu es <strong>{myRank}e</strong> de ton groupe cette semaine. Top {PROMOTION_ZONE} : bonus de fin de semaine (
                {WEEKLY_REWARDS.map((w) => `+${w.bonus}`).join(' / ')} pour le podium).
              </p>
            </div>
            <ol className="mt-2 rounded-3xl bg-white border border-[#bae3d1] overflow-hidden">
              {group.map((m, i) => {
                const zone = i < PROMOTION_ZONE ? 'up' : i >= group.length - 3 ? 'down' : '';
                return (
                  <li key={m.id} className={`rank-row ${m.me ? 'is-me' : ''} ${zone === 'up' && i === PROMOTION_ZONE - 1 ? 'zone-edge' : ''}`}>
                    <span className={`rank-num ${i < 3 ? 'is-podium' : ''}`}>{i + 1}</span>
                    <Avatar pseudo={m.pseudo} color={m.color} size={34} me={m.me} />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-extrabold text-[#0F2926] truncate">{m.me ? `${m.pseudo} (toi)` : m.pseudo}</span>
                      <span className="block text-[10px] text-slate-500">{m.me ? leagueFor(m.total).name : `${leagueFor(m.total).name} · ${m.area}`}</span>
                    </span>
                    <span className="text-sm font-extrabold tabular-nums text-[#0F2926]">{m.week}</span>
                    {zone === 'up' ? <ChevronUp className="w-4 h-4 text-[#0D9488]" /> : zone === 'down' ? <ChevronDown className="w-4 h-4 text-slate-300" /> : <span className="w-4" />}
                  </li>
                );
              })}
            </ol>
            <p className="text-[10px] text-slate-400 text-center mt-2">Classement actualisé toutes les heures · points gagnés cette semaine</p>
          </section>
        )}

        {tab === 'around' && (
          <section key="a" className="mx-4 mt-3 tab-in">
            <div className="p-3 rounded-2xl bg-white border border-[#bae3d1] flex items-center gap-3">
              <Users className="w-5 h-5 text-[#194080]" />
              <p className="text-xs text-slate-600 leading-snug">
                Ce que font les membres près de chez toi. Comme sur Waze, ce n’est pas du direct : les activités sont regroupées et légèrement décalées.
              </p>
            </div>
            <ul className="mt-2 space-y-2">
              {feed.map((m) => (
                <li key={m.id} className="p-3 rounded-2xl bg-white border border-[#e3f1eb] flex items-center gap-3">
                  <Avatar pseudo={m.pseudo} color={m.color} size={38} />
                  <p className="flex-1 text-xs text-slate-600 leading-snug">
                    <strong className="text-[#0F2926]">{m.pseudo}</strong> a déposé environ <strong className="text-[#0F2926]">{(0.3 + (m.week % 20) / 10).toFixed(1).replace('.', ',')} kg</strong> à{' '}
                    {placeById(m.lastBox)?.name.replace('Box ', '')}
                    <span className="block text-[10px] text-slate-400 mt-0.5">{timeAgo(Date.now() - m.lastAgoMin * 60000)}</span>
                  </p>
                  <Scale className="w-4 h-4 text-slate-300" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === 'ladder' && (
          <section key="l" className="mx-4 mt-3 tab-in">
            <ol className="space-y-2">
              {[...LEAGUES].reverse().map((l) => {
                const idx = LEAGUES.indexOf(l);
                const mine = idx === league.index;
                const reached = idx <= league.index;
                const count = MEMBERS.filter((m) => leagueFor(m.total).id === l.id).length + (mine ? 1 : 0);
                return (
                  <li key={l.id} className={`ladder-row ${mine ? 'is-me' : ''} ${reached ? 'is-reached' : ''}`}>
                    <span className="ladder-badge" style={{ background: l.color }}>
                      {idx + 1}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display uppercase text-xl leading-none">{l.name}</span>
                      <span className="block text-[11px] opacity-70 mt-1">
                        dès {l.min.toLocaleString('fr-FR')} pts · {count} membre{count > 1 ? 's' : ''}
                      </span>
                    </span>
                    <span className="font-display text-xl">×{String(l.mult).replace('.', ',')}</span>
                  </li>
                );
              })}
            </ol>
            <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
              Ta ligue dépend de tous les points que tu as gagnés. Utiliser tes points au pop-up ne te fait jamais redescendre.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
