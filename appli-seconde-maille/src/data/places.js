/*
  LIEUX - box de dépôt & pop-up
  Pop-up : 17 bd Jean-Baptiste Lebas, Lille (Gare Saint-Sauveur).
  Lille : lieux du brief (Grande Place, vieux-Lille, euralille, marché aux
  livres) + gares, marchés, lieux culturels et quartiers étudiants.
  Métropole : Villeneuve-d'Ascq, Mons, Marcq, Wasquehal, Croix, Hem, Roubaix.
*/
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
  endDate: new Date('2027-06-20T17:00:00+02:00'),
  hours: '9h - 17h, du 20 mars au 20 juin 2027'
};

export const BOX_OPENING = new Date('2027-01-20T00:00:00+01:00');
export const BOX_CLOSING = new Date('2027-03-20T23:59:59+01:00');

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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
  },
  // entre Lille et Roubaix
  {
    id: 'VAH',
    type: 'box',
    name: 'Box Hôtel de Ville',
    area: 'Villeneuve-d’Ascq',
    address: 'Place Salvador-Allende, 59650 Villeneuve-d’Ascq',
    lat: 50.64030,
    lng: 3.14100,
    fill: 0.33,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'VLM',
    type: 'box',
    name: 'Box LaM',
    area: 'Villeneuve-d’Ascq',
    address: '1 allée du Musée, 59650 Villeneuve-d’Ascq',
    lat: 50.65040,
    lng: 3.14870,
    fill: 0.12,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'VPB',
    type: 'box',
    name: 'Box Pont de Bois',
    area: 'Villeneuve-d’Ascq',
    address: 'Métro Pont de Bois, 59650 Villeneuve-d’Ascq',
    lat: 50.63060,
    lng: 3.12720,
    fill: 0.47,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'VCS',
    type: 'box',
    name: 'Box Cité scientifique',
    area: 'Villeneuve-d’Ascq',
    address: 'Avenue Paul-Langevin, 59650 Villeneuve-d’Ascq',
    lat: 50.60930,
    lng: 3.14050,
    fill: 0.58,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'MON',
    type: 'box',
    name: 'Box Fort de Mons',
    area: 'Mons-en-Barœul',
    address: 'Métro Fort de Mons, 59370 Mons-en-Barœul',
    lat: 50.64150,
    lng: 3.10400,
    fill: 0.26,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'MAR',
    type: 'box',
    name: 'Box Marcq-Centre',
    area: 'Marcq-en-Barœul',
    address: 'Rue Nationale, 59700 Marcq-en-Barœul',
    lat: 50.67160,
    lng: 3.09680,
    fill: 0.39,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'WAS',
    type: 'box',
    name: 'Box Wasquehal',
    area: 'Wasquehal',
    address: 'Place de la République, 59290 Wasquehal',
    lat: 50.67050,
    lng: 3.13100,
    fill: 0.21,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'CRX',
    type: 'box',
    name: 'Box Croix-Centre',
    area: 'Croix',
    address: 'Place des Martyrs-de-la-Résistance, 59170 Croix',
    lat: 50.67850,
    lng: 3.15150,
    fill: 0.44,
    accepts: ['PNE', 'FIL']
  },
  {
    id: 'HEM',
    type: 'box',
    name: 'Box Hem',
    area: 'Hem',
    address: 'Place de la République, 59510 Hem',
    lat: 50.65530,
    lng: 3.18800,
    fill: 0.17,
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
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
    accepts: ['PNE', 'FIL']
  }
];

export const ALL_PLACES = [...BOXES, POPUP];

const LEGACY = { RBX: 'PUP' };
export const placeById = (id) => ALL_PLACES.find((p) => p.id === (LEGACY[id] || id));

// position par défaut si l'utilisateur refuse la géolocalisation : Lille-Centre
export const DEFAULT_POSITION = { lat: 50.6365, lng: 3.0635, approximate: true };

export const MATERIALS = {
  PNE: { label: 'Pneus usés', short: 'Pneus', mult: 1.5, color: '#0F2926', hint: 'Pneus et chambres à air' },
  FIL: { label: 'Vieux tissus & filets', short: 'Tissus & filets', mult: 2, color: '#18407f', hint: 'Filets de pêche, cordages, vieux tissus' },
  // anciens dépôts enregistrés avant la fusion des deux entrées
  TEX: { label: 'Vieux tissus & filets', short: 'Tissus & filets', mult: 1, color: '#18407f', hint: 'Vieux tissus', legacy: true }
};
