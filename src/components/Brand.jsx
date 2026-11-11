import React from 'react';

const base = `${import.meta.env?.BASE_URL ?? '/'}brand/`;

/* Logo de la collaboration « SECONDE MAILLE » (variante claire pour les fonds sombres) */
export function SecondeMailleLogo({ light = false, className = 'h-10', alt = 'Seconde Maille' }) {
  return (
    <img
      src={`${base}${light ? 'seconde-maille-logo-light.png' : 'seconde-maille-logo.png'}`}
      alt={alt}
      className={`w-auto select-none ${className}`}
      draggable="false"
    />
  );
}

/* La mascotte vaquita */
export function Mascot({ className = 'w-16', alt = '' }) {
  return <img src={`${base}vaquita-mascotte.png`} alt={alt} className={`h-auto select-none ${className}`} draggable="false" />;
}
