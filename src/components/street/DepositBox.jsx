import React from 'react';

/*
  Box de dépôt Seconde Maille (inspirée du visuel de la borne en bois).
  Deux trappes : pneus usés / vieux tissus & filets, QR code "Scan me" sur le côté.
  Petite animation : des matériaux tombent régulièrement dans les trappes.
*/
const INK = '#0F2926';
const WOOD = '#E8CFA6';
const FONT = "'Apparat Semi Condensed','Barlow Semi Condensed','Arial Narrow',sans-serif";

function Leaves({ x, y, flip = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip} 1)`} className="box-plant">
      {[
        [-26, -30, -40],
        [-6, -44, -10],
        [16, -34, 25],
        [30, -16, 55],
        [-34, -8, -70]
      ].map(([lx, ly, r], i) => (
        <ellipse key={i} cx={lx} cy={ly} rx="9" ry="18" transform={`rotate(${r} ${lx} ${ly})`} fill={i % 2 ? '#2E8B6E' : '#55A985'} stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
}

function Pot({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Leaves x={0} y={-2} />
      <path d="M-26 -6 H26 L20 34 H-20 Z" fill="#7E9A92" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

export default function DepositBox({ className = '' }) {
  const qr = [];
  const cells = [
    '1110111', '1010101', '1110111', '0001000', '1101011', '0110110', '1011101'
  ];
  cells.forEach((row, r) => row.split('').forEach((v, c) => v === '1' && qr.push(<rect key={`${r}-${c}`} x={462 + c * 8} y={232 + r * 8} width="8" height="8" fill={INK} />)));

  return (
    <svg viewBox="0 0 560 470" className={className} aria-hidden="true">
      <defs>
        <clipPath id="dropClip">
          <rect x="0" y="0" width="560" height="228" />
        </clipPath>
      </defs>
      {/* ombre au sol */}
      <ellipse cx="290" cy="452" rx="270" ry="14" fill={INK} opacity=".18" />

      {/* panneau latéral sombre */}
      <path d="M440 148 L520 122 L520 418 L440 444 Z" fill={INK} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M440 148 L520 122 L520 170 Q480 150 440 190 Z" fill="#a5d2b2" />
      <path d="M440 410 Q480 380 520 392 L520 418 L440 444 Z" fill="#18407f" />
      <rect x="456" y="226" width="68" height="68" rx="8" fill="#FFFFFF" transform="skewY(-18) translate(0 150)" />
      <g transform="skewY(-18) translate(0 150)">{qr}</g>
      <g transform="skewY(-18) translate(0 150)">
        <rect x="458" y="306" width="62" height="20" rx="10" fill="#FFFFFF" />
        <text x="489" y="321" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="13" fill={INK}>
          SCAN ME
        </text>
        <text x="489" y="346" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="9.5" fill="#FFFFFF">
          PARTICIPER AU PROJET
        </text>
      </g>

      {/* façade bois */}
      <rect x="40" y="148" width="400" height="296" fill={WOOD} stroke={INK} strokeWidth="8" />
      <g stroke="#D4B587" strokeWidth="2" opacity=".7">
        <path d="M60 190 q60 -6 120 0 t120 0 M70 260 q80 6 160 0 t150 4 M58 340 q70 -6 140 0 t160 0 M80 410 q60 4 120 0 t140 -2" fill="none" />
      </g>
      {/* bandeau */}
      <rect x="62" y="160" width="356" height="30" rx="15" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
      <text x="240" y="181" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="16" fill={INK}>
        DONNER UNE SECONDE VIE À VOS MATIÈRES !
      </text>
      {/* séparation */}
      <line x1="240" y1="200" x2="240" y2="430" stroke={INK} strokeWidth="3" />

      {/* trappes */}
      {[70, 262].map((x, i) => (
        <g key={x}>
          <rect x={x} y="206" width="150" height="42" rx="21" fill="#3A2A20" stroke={INK} strokeWidth="5" />
          {/* objet qui tombe dans la trappe */}
          <g clipPath="url(#dropClip)">
          <g className={`box-drop box-drop--${i}`}>
            {i === 0 ? (
              <g transform={`translate(${x + 75} 150)`}>
                <circle r="20" fill={INK} />
                <circle r="9" fill={WOOD} />
              </g>
            ) : (
              <g transform={`translate(${x + 75} 150)`}>
                <path d="M-22 -10 h44 l-6 24 h-32 Z" fill="#18407f" stroke={INK} strokeWidth="3" />
                <path d="M-14 -10 l8 24 M0 -10 v24 M14 -10 l-8 24" stroke="#a5d2b2" strokeWidth="2" />
              </g>
            )}
          </g>
          </g>
        </g>
      ))}

      {/* textes */}
      <text x="145" y="278" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="17" fill={INK}>
        DÉPOSEZ VOS
      </text>
      <text x="145" y="298" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="17" fill={INK}>
        PNEUS USÉS
      </text>
      <text x="337" y="278" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="17" fill={INK}>
        DÉPOSEZ VOS VIEUX
      </text>
      <text x="337" y="298" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="17" fill={INK}>
        TISSUS ET FILETS
      </text>

      {/* pictos */}
      <g transform="translate(145 360)">
        <ellipse rx="34" ry="40" fill="none" stroke={INK} strokeWidth="7" />
        <ellipse rx="16" ry="22" fill="none" stroke={INK} strokeWidth="5" />
        <path d="M-30 -18 h-8 M-34 0 h-8 M-30 18 h-8 M30 -18 h8 M34 0 h8 M30 18 h8" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <ellipse rx="34" ry="40" fill="none" stroke="#a5d2b2" strokeWidth="2" />
      </g>
      <g transform="translate(337 360)">
        <circle cx="-14" cy="-10" r="24" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
        <path d="M-34 -22 L6 4 M-30 2 L2 -30 M-38 -6 L-4 16 M-20 -32 L8 -8" stroke={INK} strokeWidth="2" />
        <path d="M-16 8 Q10 -6 34 6 L30 30 Q4 38 -20 30 Z" fill={INK} />
        <path d="M-10 16 Q10 8 28 16" stroke="#3E5552" strokeWidth="3" fill="none" />
      </g>
      <text x="145" y="424" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="16" fill={INK}>
        PNEUS USÉS
      </text>
      <text x="337" y="424" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="16" fill={INK}>
        VIEUX TISSUS & FILETS
      </text>

      {/* enseigne */}
      <rect x="84" y="16" width="340" height="120" fill={INK} />
      <rect x="84" y="16" width="340" height="56" fill="#F5FBF9" stroke={INK} strokeWidth="6" />
      <rect x="110" y="25" width="288" height="38" fill="#a5d2b2" />
      <text x="254" y="56" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="32" fill={INK}>
        SECONDE MAILLE
      </text>
      <text x="254" y="112" textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="25" fill="#FFFFFF">
        VAKITA × LA VIE EST BELT
      </text>
      <rect x="84" y="136" width="356" height="12" fill={INK} />
      <rect x="40" y="140" width="400" height="10" fill="#C9A776" stroke={INK} strokeWidth="4" />

      {/* plantes */}
      <Leaves x={70} y={146} />
      <Leaves x={410} y={146} flip={-1} />
      <Pot x={20} y={420} s={0.9} />
      <Pot x={540} y={418} s={1} />
    </svg>
  );
}
