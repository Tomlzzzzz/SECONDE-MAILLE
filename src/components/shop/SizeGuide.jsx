import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SIZE_GUIDES } from '../../data/shop';

/* Schémas "comment mesurer" */
function TopDiagram() {
  return (
    <svg viewBox="0 0 220 200" className="w-full max-w-[220px]" aria-hidden="true">
      <path d="M70 20 Q110 40 150 20 L200 50 L182 88 L160 78 L160 185 L60 185 L60 78 L38 88 L20 50 Z" fill="#F5FBF9" stroke="#0F2926" strokeWidth="3" strokeLinejoin="round" />
      <path d="M90 22 Q110 34 130 22" fill="none" stroke="#0F2926" strokeWidth="3" />
      {/* A largeur */}
      <path d="M64 98 H156" stroke="#18407f" strokeWidth="3" markerStart="url(#a)" markerEnd="url(#a)" />
      <circle cx="110" cy="98" r="11" fill="#18407f" />
      <text x="110" y="102.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">A</text>
      {/* B longueur */}
      <path d="M176 28 V182" stroke="#18407f" strokeWidth="3" strokeDasharray="5 4" />
      <circle cx="176" cy="108" r="11" fill="#18407f" />
      <text x="176" y="112.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">B</text>
    </svg>
  );
}
function SockDiagram() {
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-[220px]" aria-hidden="true">
      <path d="M40 135 Q30 110 60 102 L150 98 Q190 96 190 120 Q190 140 160 140 L60 142 Q44 142 40 135 Z" fill="#F5FBF9" stroke="#0F2926" strokeWidth="3" />
      <path d="M44 150 H186" stroke="#18407f" strokeWidth="3" />
      <path d="M44 144 V156 M186 144 V156" stroke="#18407f" strokeWidth="3" />
      <text x="115" y="88" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0F2926">talon → orteils</text>
    </svg>
  );
}
function CapDiagram() {
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-[220px]" aria-hidden="true">
      <ellipse cx="110" cy="90" rx="70" ry="58" fill="#F5FBF9" stroke="#0F2926" strokeWidth="3" />
      <ellipse cx="110" cy="98" rx="76" ry="16" fill="none" stroke="#18407f" strokeWidth="3" strokeDasharray="6 4" />
      <text x="110" y="70" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0F2926">au-dessus des oreilles</text>
    </svg>
  );
}

export default function SizeGuide({ open, initial = 'haut', onClose }) {
  const [tab, setTab] = useState(initial);
  useEffect(() => setTab(initial), [initial, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const g = SIZE_GUIDES[tab];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="size-guide-title" className="modal-backdrop fixed inset-0 z-[75] flex items-end sm:items-center justify-center sm:p-4 bg-[#0F2926]/75 backdrop-blur-sm" onClick={onClose}>
      <div className="modal-panel bg-white w-full sm:max-w-3xl rounded-t-[32px] sm:rounded-[36px] p-6 sm:p-9 shadow-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#18407f]">Merch Seconde Maille</p>
            <h3 id="size-guide-title" className="font-display uppercase text-3xl sm:text-4xl leading-none text-[#0F2926] mt-1">
              Guide des tailles
            </h3>
          </div>
          <button onClick={onClose} aria-label="Fermer le guide des tailles" className="w-10 h-10 rounded-full bg-[#F5FBF9] hover:bg-[#0F2926] hover:text-[#a5d2b2] grid place-items-center shrink-0 transition-colors duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div role="tablist" className="flex flex-wrap gap-2 mt-6">
          {Object.entries(SIZE_GUIDES).map(([id, sg]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold border transition-colors duration-300 ${
                tab === id ? 'bg-[#0F2926] text-[#a5d2b2] border-[#0F2926]' : 'border-[#a5d2b2] text-[#0F2926] hover:border-[#0F2926]'
              }`}
            >
              {sg.label}
            </button>
          ))}
        </div>

        <div key={tab} className="tab-panel-enter grid sm:grid-cols-[1fr_200px] gap-6 mt-6 items-start">
          <div className="overflow-x-auto rounded-2xl border border-[#a5d2b2]">
            <table className="w-full text-sm">
              <caption className="sr-only">Mesures {g.label} en centimètres</caption>
              <thead>
                <tr className="bg-[#F5FBF9]">
                  {g.columns.map((c) => (
                    <th key={c} scope="col" className="text-left px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#0F2926] whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r[0]} className="border-t border-[#a5d2b2] hover:bg-[#a5d2b2]/25 transition-colors">
                    {r.map((v, k) =>
                      k === 0 ? (
                        <th key={k} scope="row" className="text-left px-4 py-3 font-display text-lg text-[#18407f]">
                          {v}
                        </th>
                      ) : (
                        <td key={k} className="px-4 py-3 text-[#0F2926] tabular-nums whitespace-nowrap">
                          {v}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            {g.kind === 'top' ? <TopDiagram /> : g.kind === 'sock' ? <SockDiagram /> : <CapDiagram />}
            <p className="text-xs text-slate-600 leading-relaxed">
              {g.kind === 'top'
                ? 'Mesures du vêtement posé à plat, en cm. A : d’une aisselle à l’autre. B : du haut de l’épaule au bas.'
                : g.kind === 'sock'
                ? 'Longueur du pied en cm, du talon au bout du plus grand orteil.'
                : 'Tour de tête en cm, mètre ruban au-dessus des oreilles.'}
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-5">Entre deux tailles ? Prends la plus grande pour un tombé plus ample. Tu pourras aussi essayer sur place au pop-up.</p>
      </div>
    </div>
  );
}
