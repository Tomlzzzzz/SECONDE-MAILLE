import React from 'react';

const base = `${import.meta.env?.BASE_URL ?? '/'}brand/`;

/* Logo de la collaboration "SECONDE MAILLE" (variante claire pour les fonds sombres) */
export function SecondeMailleLogo({ light = false, className = 'h-10', alt = 'Seconde Maille' }) {
  if (light)
    return <img src={`${base}seconde-maille-logo-light.png`} alt={alt} className={`w-auto select-none ${className}`} draggable="false" />;
  // version foncée en mode clair, version claire en mode sombre
  return (
    <>
      <img src={`${base}seconde-maille-logo.png`} alt={alt} className={`logo-on-light w-auto select-none ${className}`} draggable="false" />
      <img src={`${base}seconde-maille-logo-light.png`} alt="" aria-hidden="true" className={`logo-on-dark w-auto select-none ${className}`} draggable="false" />
    </>
  );
}

/* La mascotte vaquita */
export function Mascot({ className = 'w-16', alt = '' }) {
  return <img src={`${base}vaquita-mascotte.png`} alt={alt} className={`h-auto select-none ${className}`} draggable="false" />;
}
