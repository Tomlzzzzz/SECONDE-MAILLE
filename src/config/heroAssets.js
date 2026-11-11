/**
 * CALQUES DU HEADER — à remplacer par tes propres réalisations.
 *
 * Chaque calque est une image séparée posée dans /public/hero/.
 * Pour remplacer : dépose ton fichier (PNG transparent ou SVG) dans /public/hero/
 * puis change simplement le chemin ci-dessous. Rien d'autre à toucher.
 *
 * Vagues (seaBack / seaMid / seaFront) et nuages :
 *   - doivent être "tuilables" horizontalement (le bord droit raccorde le bord gauche),
 *   - `tile` = largeur en px d'une répétition à l'écran (garde à peu près le ratio de ton image),
 *   - `speed` = durée en secondes d'un cycle de défilement (plus grand = plus lent).
 */
// BASE_URL : fonctionne aussi si le site est publié dans un sous-dossier
const base = `${import.meta.env?.BASE_URL ?? '/'}hero/`;

export const HERO_ASSETS = {
  sky: { src: `${base}sky.svg` },
  clouds: { src: `${base}clouds.svg`, tile: 2400, speed: 140 },
  seaBack: { src: `${base}sea-back.svg`, tile: 1600, speed: 70 },
  seaMid: { src: `${base}sea-mid.svg`, tile: 1600, speed: 38 },
  seaFront: { src: `${base}sea-front.svg`, tile: 1600, speed: 22 },
  boat: { src: `${base}boat.svg`, alt: 'Bateau de pêche remontant un filet' },
  netHauled: { src: `${base}net-hauled.svg`, alt: '' },
  netDrift: { src: `${base}net-drift.svg`, alt: '' },
  vaquita: { src: `${base}vaquita.svg`, alt: 'Un vaquita flotte à la surface' } // image temporaire
};

/**
 * CALQUES DU HEADER « RUE DE ROUBAIX » (page d'accueil + en-têtes des pages).
 * Même principe : remplace le fichier dans /public/street/ ou change le chemin.
 * `shop` et `box` : laisser à null pour garder les dessins intégrés (SVG dans
 * src/components/street/), ou indiquer le chemin d'une image pour les remplacer.
 */
const street = `${import.meta.env?.BASE_URL ?? '/'}street/`;

export const STREET_ASSETS = {
  sky: `${street}sky.svg`,
  city: `${street}city.svg`, // silhouettes : usine, cheminée, beffroi, église
  houses: `${street}houses.svg`, // maisons en briques
  street: `${street}street.svg`, // trottoir + rue pavée
  lamp: `${street}lamp.svg`,
  shop: null, // ex. `${street}boutique.png`
  box: null // ex. `${street}box.png`
};
