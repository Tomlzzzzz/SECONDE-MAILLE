/* =====================================================================
   LIEUX — box de dépôt & pop-up
   Les box reprennent les lieux du brief (Grande Place, Vieux-Lille, Euralille,
   Marché aux livres) + une box devant le pop-up de Roubaix.
   ⚠️ Emplacements exacts et taux de remplissage à remplacer par les vrais.
   ===================================================================== */
export const POPUP = {
  id: 'POP',
  type: 'popup',
  name: 'Pop-Up Store Seconde Maille',
  short: 'Pop-Up Roubaix',
  address: '82 Rue Louis Braille, 59100 Roubaix',
  lat: 50.676251,
  lng: 3.194141,
  date: new Date('2027-03-20T00:00:00+01:00'),
  dateLabel: 'Samedi 20 mars 2027',
  hours: 'Horaires communiqués prochainement'
};

export const BOX_OPENING = new Date('2027-01-20T00:00:00+01:00');

export const BOXES = [
  {
    id: 'GPL',
    type: 'box',
    name: 'Box Grande Place',
    area: 'Lille-Centre',
    address: 'Place du Général-de-Gaulle, 59800 Lille',
    lat: 50.63662,
    lng: 3.06352,
    fill: 0.42,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'VBO',
    type: 'box',
    name: 'Box Marché aux livres',
    area: 'Vieille Bourse',
    address: 'Cour de la Vieille Bourse, 59800 Lille',
    lat: 50.63703,
    lng: 3.06468,
    fill: 0.18,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'VXL',
    type: 'box',
    name: 'Box Vieux-Lille',
    area: 'Vieux-Lille',
    address: 'Place Louise-de-Bettignies, 59800 Lille',
    lat: 50.64128,
    lng: 3.06238,
    fill: 0.71,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'EUR',
    type: 'box',
    name: 'Box Euralille',
    area: 'Euralille',
    address: 'Centre commercial Euralille, 59777 Lille',
    lat: 50.63655,
    lng: 3.07585,
    fill: 0.33,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'RBX',
    type: 'box',
    name: 'Box du Pop-Up',
    area: 'Roubaix',
    address: '82 Rue Louis Braille, 59100 Roubaix',
    lat: 50.67618,
    lng: 3.19398,
    fill: 0.09,
    accepts: ['FIL', 'PNE', 'TEX']
  }
];

export const ALL_PLACES = [...BOXES, POPUP];
export const placeById = (id) => ALL_PLACES.find((p) => p.id === id);

// position par défaut si l'utilisateur refuse la géolocalisation : Lille-Centre
export const DEFAULT_POSITION = { lat: 50.6365, lng: 3.0635, approximate: true };

export const MATERIALS = {
  FIL: { label: 'Filets & tissus', short: 'Filets', mult: 2, color: '#194080', hint: 'Filets de pêche, cordages, vieux tissus' },
  PNE: { label: 'Pneus & chambres à air', short: 'Pneus', mult: 1.5, color: '#0F2926', hint: 'Pneus de vélo, chambres à air' },
  TEX: { label: 'Textiles', short: 'Textiles', mult: 1, color: '#0D9488', hint: 'Vêtements, linge, chutes de tissu' }
};
