import React, { useEffect, useMemo, useState } from 'react';
import { Ticket, Trophy, Map as MapIcon, Gift } from 'lucide-react';
import { TopBar, Counter, ProgressBar } from '../components/ui';
import { useStore } from '../state/store';
import { useNav } from '../App';
import { placeById, MATERIALS } from '../data/places';
import { LEAGUES, leagueFor } from '../data/leagues';
import { REWARDS } from '../data/rewards';
import { fmtKg } from '../lib/points';

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        dur: 1.4 + Math.random() * 1.1,
        rot: Math.random() * 360,
        c: ['#a5d2b2', '#18407f', '#18407f', '#a5d2b2', '#0F2926'][i % 5]
      })),
    []
  );
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ left: `${b.left}%`, background: b.c, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`, transform: `rotate(${b.rot}deg)` }} />
      ))}
    </div>
  );
}

/* Frise des points : solde avant → après, jalons des récompenses */
function PointsFrieze({ before, after }) {
  const max = Math.max(REWARDS[REWARDS.length - 1].cost, after) * 1.05;
  const [shown, setShown] = useState(before);
  useEffect(() => {
    const t = setTimeout(() => setShown(after), 350);
    return () => clearTimeout(t);
  }, [after]);
  const pct = (v) => `${Math.min(100, (v / max) * 100)}%`;
  const next = REWARDS.find((r) => r.cost > after);
  return (
    <div className="frieze">
      <div className="frieze-track">
        <span className="frieze-before" style={{ width: pct(before) }} />
        <span className="frieze-fill" style={{ width: pct(shown) }} />
        {REWARDS.map((r) => (
          <span key={r.id} className={`frieze-mark ${after >= r.cost ? 'is-reached' : ''}`} style={{ left: pct(r.cost) }}>
            <span className="frieze-dot" />
            <span className="frieze-label">{r.cost}</span>
          </span>
        ))}
        <span className="frieze-me" style={{ left: pct(shown) }}>
          <img src="/brand/vaquita-mascotte.png" alt="" />
        </span>
      </div>
      <p className="text-xs text-slate-600 mt-9">
        {next ? (
          <>
            Plus que <strong className="text-[#0F2926]">{next.cost - after} pts</strong> pour : {next.title.toLowerCase()}.
          </>
        ) : (
          <>Tu peux t’offrir toutes les récompenses du pop-up !</>
        )}
      </p>
    </div>
  );
}

export default function ReceiptScreen({ depositId, fresh }) {
  const { state, spent, balance, earned } = useStore();
  const { pop, goTab } = useNav();
  const d = state.deposits.find((x) => x.id === depositId);
  if (!d) return null;
  const box = placeById(d.boxId);
  const mat = MATERIALS[d.material];
  const c = d.calc;
  const idx = state.deposits.findIndex((x) => x.id === depositId);
  // solde au moment du dépôt (approximation : on enlève les dépôts plus récents)
  const newer = state.deposits.slice(0, idx).reduce((a, x) => a + x.points, 0);
  const earnedAfter = earned - newer;
  const earnedBefore = earnedAfter - d.points;
  const balAfter = balance - newer;
  const balBefore = balAfter - d.points;
  const lBefore = leagueFor(earnedBefore);
  const lAfter = leagueFor(earnedAfter);
  const promoted = lAfter.index > lBefore.index;
  const date = new Date(d.date);

  return (
    <div className="h-full flex flex-col bg-[#F5FBF9] relative">
      {fresh && <Confetti />}
      <TopBar title="Reçu de pesée" onBack={pop} />
      <div className="flex-1 overflow-y-auto px-4 pb-10">
        <div className={`receipt ${fresh ? 'is-fresh' : ''}`}>
          <div className="flex items-center justify-between">
            <img src="/brand/seconde-maille-logo.png" alt="Seconde Maille" className="h-9" />
            <span className="text-[10px] font-mono text-slate-400">#{d.nonce}</span>
          </div>
          <div className="text-center mt-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#18407f]">Points gagnés</p>
            <p className="font-display text-[64px] leading-none text-[#0F2926] mt-1">
              +{fresh ? <Counter value={d.points} duration={1200} /> : d.points}
            </p>
          </div>
          <dl className="receipt-lines">
            <div>
              <dt>Box</dt>
              <dd>{box?.name}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>
                {date.toLocaleDateString('fr-FR')} · {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </dd>
            </div>
            <div>
              <dt>Trappe</dt>
              <dd>{mat.label}</dd>
            </div>
            <div>
              <dt>Poids pesé</dt>
              <dd className="font-display text-lg">{fmtKg(d.grams)}</dd>
            </div>
          </dl>
          <div className="receipt-sep" />
          <dl className="receipt-lines">
            <div>
              <dt>Base · 1 pt / 10 g</dt>
              <dd>{c.base}</dd>
            </div>
            <div>
              <dt>Bonus matière ×{String(c.matMult).replace('.', ',')}</dt>
              <dd>+{c.matBonus}</dd>
            </div>
            <div>
              <dt>Bonus ligue ×{String(c.leagueMult).replace('.', ',')}</dt>
              <dd>+{c.leagueBonus}</dd>
            </div>
            <div className="is-total">
              <dt>Total</dt>
              <dd>{d.points} pts</dd>
            </div>
          </dl>
          <p className="text-center text-[11px] text-slate-400 mt-4">Merci : cette matière va connaître une seconde vie.</p>
        </div>

        {promoted && (
          <div className="mt-4 p-4 rounded-3xl bg-[#18407f] text-white flex items-center gap-3 pop-in">
            <Trophy className="w-8 h-8 text-[#a5d2b2]" />
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#a5d2b2]">Promotion !</p>
              <p className="font-display uppercase text-2xl leading-none">Ligue {lAfter.name}</p>
              <p className="text-xs text-white/70 mt-1">Tes prochains dépôts rapportent ×{String(lAfter.mult).replace('.', ',')}.</p>
            </div>
          </div>
        )}

        <section className="mt-4 p-4 rounded-3xl bg-white border border-[#a5d2b2]">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-extrabold text-[#0F2926]">Frise des points</p>
            <p className="text-xs text-slate-500">
              solde <strong className="text-[#0F2926]">{balAfter} pts</strong>
            </p>
          </div>
          <PointsFrieze before={Math.max(0, balBefore)} after={Math.max(0, balAfter)} />
        </section>

        <section className="mt-4 p-4 rounded-3xl bg-white border border-[#a5d2b2]">
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#0F2926]">Ligue {lAfter.name}</p>
            <p className="text-[11px] text-slate-500">{lAfter.next ? `${lAfter.toNext} pts avant ${lAfter.next.name}` : 'Ligue maximale'}</p>
          </div>
          <div className="mt-2">
            <ProgressBar value={lAfter.progress} />
          </div>
          <div className="flex justify-between mt-2">
            {LEAGUES.map((l) => (
              <span key={l.id} className={`text-[9px] font-bold ${LEAGUES.indexOf(l) <= lAfter.index ? 'text-[#18407f]' : 'text-slate-300'}`}>
                {l.name}
              </span>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button onClick={() => goTab('rewards')} className="mini-action">
            <Gift className="w-5 h-5" /> Utiliser
          </button>
          <button onClick={() => goTab('leagues')} className="mini-action">
            <Trophy className="w-5 h-5" /> Classement
          </button>
          <button onClick={() => goTab('map')} className="mini-action">
            <MapIcon className="w-5 h-5" /> Box
          </button>
        </div>
        {spent > 0 && <p className="text-[10px] text-slate-400 text-center mt-3">Solde = points gagnés − points utilisés ({spent} pts).</p>}
        <span className="sr-only">
          <Ticket />
        </span>
      </div>
    </div>
  );
}
