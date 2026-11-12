/* =====================================================================
   LIEUX — box de dépôt & pop-up
   Pop-up : 17 bd Jean-Baptiste Lebas, Lille (Gare Saint-Sauveur).
   Lille : lieux du brief (Grande Place, Vieux-Lille, Euralille, Marché aux
   livres) + gares, marchés, lieux culturels et quartiers étudiants.
   Roubaix, ville du textile : Grand-Place, gare, La Piscine, Condition
   Publique, La Manufacture, parc Barbieux, vélodrome.
   ⚠️ Emplacements exacts et taux de remplissage à remplacer par les vrais.
   ===================================================================== */
export const POPUP = {
  id: 'POP',
  type: 'popup',
  name: 'Pop-Up Store Seconde Maille',
  short: 'Pop-Up Lille',
  address: '17 boulevard Jean-Baptiste Lebas, 59000 Lille',
  lat: 50.62639,
  lng: 3.07417,
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
    id: 'PUP',
    type: 'box',
    name: 'Box du Pop-Up',
    area: 'Saint-Sauveur',
    address: '17 boulevard Jean-Baptiste Lebas, 59000 Lille',
    lat: 50.62668,
    lng: 3.07368,
    fill: 0.09,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'LFL',
    type: 'box',
    name: 'Box Gare Lille-Flandres',
    area: 'Gares',
    address: 'Place des Buisses, 59800 Lille',
    lat: 50.6366,
    lng: 3.0712,
    fill: 0.48,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'PBA',
    type: 'box',
    name: 'Box République',
    area: 'République · Beaux-Arts',
    address: 'Place de la République (Palais des Beaux-Arts), 59000 Lille',
    lat: 50.63035,
    lng: 3.06291,
    fill: 0.27,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'WAZ',
    type: 'box',
    name: 'Box Marché de Wazemmes',
    area: 'Wazemmes',
    address: 'Place de la Nouvelle Aventure, 59000 Lille',
    lat: 50.62607,
    lng: 3.04974,
    fill: 0.83,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'MOU',
    type: 'box',
    name: 'Box Maison Folie Moulins',
    area: 'Moulins',
    address: '47 rue d’Arras, 59000 Lille',
    lat: 50.62296,
    lng: 3.06806,
    fill: 0.21,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'RGP',
    type: 'box',
    name: 'Box Grand-Place Roubaix',
    area: 'Roubaix-Centre',
    address: 'Grand-Place (face à l’Hôtel de Ville), 59100 Roubaix',
    lat: 50.69045,
    lng: 3.17485,
    fill: 0.36,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'RGA',
    type: 'box',
    name: 'Box Gare de Roubaix',
    area: 'Gare',
    address: 'Place de la Gare, 59100 Roubaix',
    lat: 50.69585,
    lng: 3.16345,
    fill: 0.24,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'RPI',
    type: 'box',
    name: 'Box La Piscine',
    area: 'Musée La Piscine',
    address: '23 rue de l’Espérance, 59100 Roubaix',
    lat: 50.69229,
    lng: 3.16782,
    fill: 0.52,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'RCP',
    type: 'box',
    name: 'Box Condition Publique',
    area: 'Le Pile',
    address: '14 place du Général Faidherbe, 59100 Roubaix',
    lat: 50.69074,
    lng: 3.18949,
    fill: 0.61,
    accepts: ['FIL', 'PNE', 'TEX']
  },
  {
    id: 'RMA',
    type: 'box',
    name: 'Box La Manufacture',
    area: 'Fraternité',
    address: '29 avenue Julien Lagache, 59100 Roubaix',
    lat: 50.6828,
    lng: 3.196,
    fill: 0.15,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'RBA',
    type: 'box',
    name: 'Box Parc Barbieux',
    area: 'Barbieux',
    address: 'Avenue Le Nôtre (parc Barbieux), 59100 Roubaix',
    lat: 50.67594,
    lng: 3.1615,
    fill: 0.12,
    accepts: ['FIL', 'TEX']
  },
  {
    id: 'RVE',
    type: 'box',
    name: 'Box Vélodrome',
    area: 'Parc des Sports',
    address: 'Vélodrome André-Pétrieux, avenue Alexander-Fleming, 59100 Roubaix',
    lat: 50.6781,
    lng: 3.2052,
    fill: 0.38,
    accepts: ['FIL', 'PNE', 'TEX']
  }
];

export const ALL_PLACES = [...BOXES, POPUP];
// anciens identifiants (la box du pop-up était à Roubaix, code RBX)
const LEGACY = { RBX: 'PUP' };
export const placeById = (id) => ALL_PLACES.find((p) => p.id === (LEGACY[id] || id));

// position par défaut si l'utilisateur refuse la géolocalisation : Lille-Centre
export const DEFAULT_POSITION = { lat: 50.6365, lng: 3.0635, approximate: true };

export const MATERIALS = {
  FIL: { label: 'Filets & tissus', short: 'Filets', mult: 2, color: '#18407f', hint: 'Filets de pêche, cordages, vieux tissus' },
  PNE: { label: 'Pneus & chambres à air', short: 'Pneus', mult: 1.5, color: '#0F2926', hint: 'Pneus de vélo, chambres à air' },
  TEX: { label: 'Textiles', short: 'Textiles', mult: 1, color: '#18407f', hint: 'Vêtements, linge, chutes de tissu' }
};
