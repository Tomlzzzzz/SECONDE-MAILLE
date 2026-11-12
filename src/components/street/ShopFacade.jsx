import React from 'react';

/*
  Façade de la boutique éphémère (inspirée d'un bâtiment brique + verrière à structure bois).
  Dessin en SVG intégré pour profiter des polices du site. Le logo est posé en HTML par-dessus
  (voir StreetScene) pour rester net et facilement remplaçable.
*/
const INK = '#0F2926';
const BRICK = '#985B57';

export default function ShopFacade({ className = '' }) {
  const mullions = Array.from({ length: 8 }, (_, i) => 500 + i * 50);
  return (
    <svg viewBox="0 0 900 640" className={className} aria-hidden="true">
      <defs>
        <pattern id="brick" width="44" height="28" patternUnits="userSpaceOnUse">
          <rect width="44" height="28" fill={BRICK} />
          <path d="M0 13.5 H44 M0 27.5 H44 M22 0 V13.5 M0 14 V28 M44 14 V28" stroke="#B9807A" strokeWidth="2" />
          <rect x="2" y="2" width="18" height="10" fill="#8C514E" opacity=".35" />
          <rect x="24" y="16" width="18" height="10" fill="#A6655F" opacity=".4" />
        </pattern>
        <linearGradient id="glassIn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9F6F0" />
          <stop offset=".55" stopColor="#FFF6DD" />
          <stop offset="1" stopColor="#F7E6BE" />
        </linearGradient>
        <clipPath id="glassClip">
          <rect x="500" y="62" width="390" height="578" />
        </clipPath>
      </defs>

      {/* bloc brique */}
      <rect x="0" y="128" width="502" height="512" fill="url(#brick)" stroke={INK} strokeWidth="7" />
      {/* couvertine blanche légèrement inclinée */}
      <path d="M-14 132 L516 108 L516 128 L-14 152 Z" fill="#F5FBF9" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M0 154 L502 131" stroke={INK} strokeOpacity=".18" strokeWidth="10" />
      {/* projecteurs */}
      {[70, 300].map((x) => (
        <g key={x}>
          <rect x={x} y="160" width="26" height="16" rx="3" fill={INK} />
          <rect x={x + 10} y="176" width="6" height="10" fill={INK} />
        </g>
      ))}
      {/* main courante */}
      <path d="M260 600 L400 548 L420 548" fill="none" stroke="#C7DAD3" strokeWidth="7" strokeLinecap="round" />
      <path d="M262 600 v-14 M398 548 v14" stroke="#C7DAD3" strokeWidth="6" strokeLinecap="round" />

      {/* verrière */}
      <rect x="500" y="62" width="390" height="578" fill="url(#glassIn)" />
      <g clipPath="url(#glassClip)">
        {/* lumière intérieure (animée) */}
        <rect className="shop-glow" x="500" y="62" width="390" height="578" fill="#FFF1C2" />
        {/* structure bois en croix */}
        <g stroke="#D7B98C" strokeWidth="14" strokeLinecap="round" fill="none">
          <path d="M520 90 L700 300 L880 90 M520 300 L700 520 L880 300 M520 300 L700 90 M700 300 L880 520" />
        </g>
        <g stroke="#C4A06E" strokeWidth="5" fill="none">
          <path d="M520 90 L700 300 L880 90 M520 300 L700 520 L880 300" />
        </g>
        {/* portants et vêtements */}
        {[[520, 0], [770, 1]].map(([x, k]) => (
          <g key={x}>
            <path d={`M${x} 452 H${x + 110}`} stroke={INK} strokeWidth="5" />
            <path d={`M${x + 6} 452 V560 M${x + 104} 452 V560`} stroke={INK} strokeWidth="4" />
            {['#18407f', '#a5d2b2', '#0F2926', '#a5d2b2', '#18407f'].slice(k, k + 4).map((c, i) => (
              <g key={i} className="shop-garment" style={{ animationDelay: `${i * 0.4 + k}s` }}>
                <path d={`M${x + 16 + i * 24} 452 v8`} stroke={INK} strokeWidth="2" />
                <path d={`M${x + 6 + i * 24} 462 h20 l4 14 h-4 v46 h-20 v-46 h-4 Z`} fill={c} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
              </g>
            ))}
          </g>
        ))}
        {/* reflets qui glissent sur le verre (animés) */}
        <g className="shop-shine">
          <path d="M430 640 L620 62 L660 62 L470 640 Z" fill="#FFFFFF" opacity=".35" />
          <path d="M490 640 L680 62 L696 62 L506 640 Z" fill="#FFFFFF" opacity=".3" />
        </g>
      </g>
      {/* menuiseries */}
      <g stroke={INK}>
        {mullions.map((x) => (
          <line key={x} x1={x} y1="62" x2={x} y2="640" strokeWidth={x === 500 ? 7 : 5} />
        ))}
        {[180, 320, 450].map((y) => (
          <line key={y} x1="500" y1={y} x2="890" y2={y} strokeWidth="5" />
        ))}
      </g>
      <rect x="500" y="62" width="390" height="578" fill="none" stroke={INK} strokeWidth="7" />
      <rect x="492" y="44" width="408" height="22" fill="#F5FBF9" stroke={INK} strokeWidth="6" />

      {/* vitrophanie POP-UP */}
      <g>
        <rect x="562" y="198" width="266" height="96" rx="16" fill="#FFFFFF" stroke={INK} strokeWidth="5" />
        <text x="695" y="240" textAnchor="middle" fontFamily="'Apparat Semi Condensed','Barlow Semi Condensed','Arial Narrow',sans-serif" fontWeight="800" fontSize="38" fill={INK}>
          POP-UP STORE
        </text>
        <text x="695" y="278" textAnchor="middle" fontFamily="'Apparat Semi Condensed','Barlow Semi Condensed','Arial Narrow',sans-serif" fontWeight="800" fontSize="30" fill="#18407f">
          20.03.2027
        </text>
      </g>

      {/* porte */}
      <rect x="640" y="500" width="120" height="140" fill="#FFF8E6" fillOpacity=".55" stroke={INK} strokeWidth="6" />
      <line x1="700" y1="500" x2="700" y2="640" stroke={INK} strokeWidth="5" />
      <rect x="686" y="556" width="6" height="34" rx="3" fill={INK} />
      <rect x="708" y="556" width="6" height="34" rx="3" fill={INK} />

      {/* marches */}
      <rect x="420" y="612" width="480" height="14" fill="#DCE8E3" stroke={INK} strokeWidth="4" />
      <rect x="400" y="626" width="500" height="14" fill="#C9DAD3" stroke={INK} strokeWidth="4" />
    </svg>
  );
}
