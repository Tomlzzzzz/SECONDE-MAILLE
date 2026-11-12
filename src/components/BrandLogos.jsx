import React from 'react';
import vakitaBlackLogo from '../../img/91ea9831ac5f7cca556e19f8070dfd19.png';
import vakitaWhiteLogo from '../../img/banner-a-propos.png';
import lvebAquaPastilleLogo from '../../img/lveb-logo-v3-pastille-jaune.svg';
import lvebBlackLogo from '../../img/lveb-logo-v3-ligne-noir.svg';

export function VakitaLogo({ size = "md", dark = false, blueBox = true }) {
  const heightClass = size === "sm" ? "h-6" : size === "lg" ? "h-10" : "h-7";
  return (
    <div
      className={`inline-flex items-center select-none transition-transform duration-300 hover:-rotate-1 ${
        blueBox ? 'bg-[#bae3d1] px-2.5 py-1 rounded-sm' : ''
      }`}
    >
      <img
        src={dark && !blueBox ? vakitaWhiteLogo : vakitaBlackLogo}
        alt="Logo officiel Vakita"
        className={`${heightClass} w-auto object-contain`}
      />
    </div>
  );
}

export function LaVieEstBeltLogo({ size = "md", variant = "aqua" }) {
  const heightClass = size === "sm" ? "h-7" : size === "lg" ? "h-11" : "h-8";
  return (
    <div className="inline-flex items-center select-none transition-transform duration-300 hover:scale-[1.02]">
      <img
        src={variant === "black" ? lvebBlackLogo : lvebAquaPastilleLogo}
        alt="Logo officiel La Vie est Belt"
        className={`${heightClass} w-auto object-contain`}
      />
    </div>
  );
}

export function CollabBadge({ size = "md" }) {
  return (
    <div data-keep-light className="inline-flex items-center gap-3 sm:gap-4 bg-white border border-teal-200/90 rounded-full px-3.5 py-1.5 shadow-soft hover:border-[#bae3d1] transition">
      <VakitaLogo size={size} blueBox={true} />
      <span className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] font-extrabold text-xs flex items-center justify-center">
        ×
      </span>
      <LaVieEstBeltLogo size={size} variant="aqua" />
    </div>
  );
}
