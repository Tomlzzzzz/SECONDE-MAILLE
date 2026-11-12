// Données complètes pour le prototype SECONDE MAILLE (Vakita x La Vie est Belt)

export const INITIAL_COLLECTIVE_GOAL = {
  targetKg: 2500,
  currentKg: 2345,
  targetPoints: 50000,
  currentPoints: 46900,
  donorsCount: 1412,
  bonusEuro: 15000,
  associations: [
    {
      name: "Sea Shepherd / Sauvetage du Vaquita",
      role: "Retrait des filets fantômes & protection marine",
      share: "50%",
      partner: "VAKITA"
    },
    {
      name: "AlterEos & Ateliers Solidaires du 59 (Roubaix)",
      role: "Insertion sociale, formation artisanale & réemploi textile",
      share: "50%",
      partner: "LA VIE EST BELT"
    }
  ]
};

export const DONATION_BOXES = [
  {
    id: "BOX-59-RBX-01",
    name: "La Belterie — Atelier & QG",
    city: "Roubaix (59100)",
    address: "102 Rue de Lannoy, 59100 Roubaix",
    lat: 50.6882,
    lng: 3.1815,
    distanceKm: 0.4,
    walkMinutes: 5,
    bikeMinutes: 2,
    fillPercent: 78,
    status: "DISPONIBLE",
    acceptedItems: ["Pneus vélo & chambres à air", "Jeans & Coton épais", "Vêtements marins & Cordages", "Ceintures & Cuirs usagés"],
    bonusMultiplier: "x1.5 PTS (QG Officiel)",
    lastDeposit: "Il y a 12 min — 2 pneus vélo + 1 veste denim",
    directionSteps: [
      "Prendre la piste cyclable boulevard Gambetta sur 250m",
      "Tourner à droite sur Rue de Lannoy (façade briques du Nord)",
      "La Box Vert d'eau & Pneu se trouve devant le portail de La Belterie"
    ],
    leagueLeader: "Ligue Roubaix Zéro Déchet"
  },
  {
    id: "BOX-59-LIL-02",
    name: "Gare Lille Flandres — Parvis Vélo",
    city: "Lille Centre (59800)",
    address: "Place des Buisses, Parvis Abri-Vélo, 59800 Lille",
    lat: 50.6365,
    lng: 3.0698,
    distanceKm: 1.2,
    walkMinutes: 14,
    bikeMinutes: 4,
    fillPercent: 62,
    status: "DISPONIBLE",
    acceptedItems: ["Vêtements seconde main", "Chambres à air crevées", "Sacs à dos & Toiles", "Bâches & Filets"],
    bonusMultiplier: "x1.2 PTS (Hub Mobilité)",
    lastDeposit: "Il y a 4 min — 3 pulls coton + chambre à air",
    directionSteps: [
      "Rejoindre l'avenue Le Corbusier vers la Gare Lille Flandres",
      "Contourner la sortie principale vers le parking vélos sécurisé",
      "Box Seconde Maille n°02 juste à côté de la station gonflage"
    ],
    leagueLeader: "Ligue Cyclistes Lillois"
  },
  {
    id: "BOX-59-LIL-03",
    name: "Gare Saint-Sauveur — Halle Pop-Up",
    city: "Lille (59000)",
    address: "17 Boulevard Jean-Baptiste Lebas, 59000 Lille",
    lat: 50.6279,
    lng: 3.0706,
    distanceKm: 1.6,
    walkMinutes: 18,
    bikeMinutes: 6,
    fillPercent: 45,
    status: "POP-UP LIVE",
    acceptedItems: ["Tous textiles propres", "Pneus vélo", "Filets & Cordes", "Accessoires usagés"],
    bonusMultiplier: "x2.0 PTS (Boutique Éphémère)",
    lastDeposit: "Il y a 2 min — Lot de 4 t-shirts + corde escalade",
    directionSteps: [
      "Descendre le boulevard Jean-Baptiste Lebas côté parc",
      "Entrer sur le parvis de la Gare Saint-Sauveur (Halle B)",
      "Stand Pop-Up Vakita x La Vie est Belt avec Box Interactive"
    ],
    leagueLeader: "Ligue Étudiants MMI & Icam"
  },
  {
    id: "BOX-59-RBX-04",
    name: "Blanchemaille by EuraTechnologies",
    city: "Roubaix (59100)",
    address: "87 Rue du Fontenoy, 59100 Roubaix",
    lat: 50.6951,
    lng: 3.1684,
    distanceKm: 0.9,
    walkMinutes: 11,
    bikeMinutes: 3,
    fillPercent: 89,
    status: "PRESQUE PLEINE",
    acceptedItems: ["Textiles coton/lin", "Pneus de vélo", "Chutes de tissus"],
    bonusMultiplier: "x1.3 PTS (Berceau Historique)",
    lastDeposit: "Il y a 27 min — 5 chemises en lin",
    directionSteps: [
      "Suivre la rue de l'Alma puis rue du Fontenoy",
      "Entrée principale du campus Blanchemaille",
      "Box située sous la verrière industrielle"
    ],
    leagueLeader: "Ligue Roubaix Zéro Déchet"
  },
  {
    id: "BOX-59-VDN-05",
    name: "Campus Cité Scientifique — Métro 4 Cantons",
    city: "Villeneuve-d'Ascq (59650)",
    address: "Avenue Paul Langevin, 59650 Villeneuve-d'Ascq",
    lat: 50.6067,
    lng: 3.1419,
    distanceKm: 3.4,
    walkMinutes: 38,
    bikeMinutes: 12,
    fillPercent: 34,
    status: "DISPONIBLE",
    acceptedItems: ["Sweats & Jeans étudiants", "Pneus VTT / Ville", "Sacs & Bâches"],
    bonusMultiplier: "x1.5 PTS (Défi Campus)",
    lastDeposit: "Il y a 19 min — 2 jeans + 1 pneu vélo route",
    directionSteps: [
      "Sortie Métro Cité Scientifique Pr. Gabillard",
      "Suivre l'allée piétonne vers Lilliad Learning Center",
      "Box installée devant les arceaux vélos"
    ],
    leagueLeader: "Ligue Étudiants MMI & Icam"
  },
  {
    id: "BOX-75-PAR-06",
    name: "Rédaction VAKITA — Point Collecte Paris",
    city: "Paris 11e (75011)",
    address: "45 Boulevard Voltaire, 75011 Paris",
    lat: 48.8626,
    lng: 2.3712,
    distanceKm: 204,
    walkMinutes: 180,
    bikeMinutes: 60,
    fillPercent: 71,
    status: "DISPONIBLE",
    acceptedItems: ["Filets marins collectés", "Vêtements coton", "Pneus vélos urbains"],
    bonusMultiplier: "x1.5 PTS (Antenne Média)",
    lastDeposit: "Il y a 8 min — Veste de quart + 3 t-shirts",
    directionSteps: [
      "Métro Oberkampf sortie Boulevard Voltaire",
      "Point de collecte dans le hall ouvert au public"
    ],
    leagueLeader: "Ligue Enquêteurs Vakita"
  }
];

export const WEIGHT_POINT_BRACKETS = [
  {
    id: "BRACKET-1",
    rangeLabel: "0.1 — 1.0 kg",
    minKg: 0.1,
    maxKg: 1.0,
    ratePerKg: 100,
    bonusPoints: 0,
    pointsRange: "10 à 100 pts",
    tierName: "Palier Léger",
    examples: "1 t-shirt, 1 chambre à air ou accessoires",
    rewardHint: "Dès 180 pts : Porte-clés Pneu & Filet au Pop-Up"
  },
  {
    id: "BRACKET-2",
    rangeLabel: "1.0 — 2.5 kg",
    minKg: 1.0,
    maxKg: 2.5,
    ratePerKg: 110,
    bonusPoints: 25,
    pointsRange: "135 à 300 pts",
    tierName: "Palier Régulier",
    examples: "2 pneus de vélo ou 1 jean + 1 sweat",
    rewardHint: "+25 pts bonus de pesée • Accès Série Numérotée"
  },
  {
    id: "BRACKET-3",
    rangeLabel: "2.5 — 5.0 kg",
    minKg: 2.5,
    maxKg: 5.0,
    ratePerKg: 120,
    bonusPoints: 60,
    pointsRange: "360 à 660 pts",
    tierName: "Palier Maxi Collecte",
    examples: "Sac complet de vêtements ou lot de filets/pneus",
    rewardHint: "+60 pts bonus • Bon solidaire Ceinture / Banane"
  },
  {
    id: "BRACKET-4",
    rangeLabel: "5.0 kg et +",
    minKg: 5.0,
    maxKg: 12.0,
    ratePerKg: 130,
    bonusPoints: 120,
    pointsRange: "770 à 1 200+ pts",
    tierName: "Palier Super Donateur 59",
    examples: "Grosse collecte triée (asso + atelier upcycling)",
    rewardHint: "+120 pts bonus • Pack Complet Hoodie Pop-Up"
  }
];

export function calculatePointsFromWeight(weightKg) {
  const w = Math.max(0.1, Number(weightKg) || 0.1);
  const bracket =
    WEIGHT_POINT_BRACKETS.find((b) => w >= b.minKg && w <= b.maxKg) ||
    WEIGHT_POINT_BRACKETS[WEIGHT_POINT_BRACKETS.length - 1];
  const basePoints = Math.round(w * bracket.ratePerKg);
  const totalPoints = basePoints + bracket.bonusPoints;
  return {
    weightKg: +w.toFixed(1),
    basePoints,
    bonusPoints: bracket.bonusPoints,
    totalPoints,
    bracket
  };
}

export const DEPOSIT_PRESETS = [
  {
    id: "DEP-PNEU",
    code: "SM-59-PNEU-884",
    title: "2 Pneus de Vélo + 1 Chambre à air",
    category: "Caoutchouc Cycliste (La Vie est Belt)",
    weightKg: 1.8,
    points: 220,
    co2SavedKg: 5.4,
    futureProduct: "2 Ceintures 'L'Échappée du Nord' + 1 Porte-clés",
    badgeUnlocked: "Dompteur de Bitume 59",
    partnerTarget: "Atelier AlterEos — Roubaix"
  },
  {
    id: "DEP-TEXTILE",
    code: "SM-59-MAILLE-419",
    title: "Sac de 3 Jeans & 2 Sweats Coton",
    category: "Textile Seconde Maille (Collab)",
    weightKg: 3.2,
    points: 350,
    co2SavedKg: 14.8,
    futureProduct: "Fil effiloché pour Hoodie 'Seconde Maille'",
    badgeUnlocked: "Maître Filateur Engagé",
    partnerTarget: "Filature & Tissage des Hauts-de-France"
  },
  {
    id: "DEP-FILET",
    code: "SM-59-VAQUITA-902",
    title: "Lot Cordages Marins / Filet de Pêche",
    category: "Nylon Régénéré ECONYL® (Vakita)",
    weightKg: 2.5,
    points: 450,
    co2SavedKg: 11.2,
    futureProduct: "Sac Banane 'L'Investigation' + Sangles",
    badgeUnlocked: "Gardien du Vaquita",
    partnerTarget: "Filière Régénération Marine & La Belterie"
  },
  {
    id: "DEP-MIX",
    code: "SM-59-PACK-777",
    title: "Pack Complet : 1 Pneu + 2 Chemises + 1 Ceinture usée",
    category: "Mix Upcycling Intégral",
    weightKg: 2.1,
    points: 300,
    co2SavedKg: 9.6,
    futureProduct: "Ceinture Tressée Filet & Pneu + Caleçon Upcyclé",
    badgeUnlocked: "Citoyen d'Action 100%",
    partnerTarget: "Pop-Up Gare Saint-Sauveur"
  }
];

export const LEAGUES_DATA = [
  {
    rank: 1,
    name: "Ligue Roubaix Zéro Déchet (59)",
    members: 428,
    totalKg: 842.5,
    points: 18450,
    badge: "Maillot Vert d'eau Vakita",
    trend: "+14% cette semaine",
    isUserLeague: true
  },
  {
    rank: 2,
    name: "Ligue Étudiants MMI & Icam Lille",
    members: 389,
    totalKg: 764.0,
    points: 16200,
    badge: "Pignon Fixe Solidaire",
    trend: "+22% cette semaine",
    isUserLeague: false
  },
  {
    rank: 3,
    name: "Ligue Enquêteurs Vakita (National)",
    members: 355,
    totalKg: 498.2,
    points: 8950,
    badge: "Sentinelles du Vaquita",
    trend: "+9% cette semaine",
    isUserLeague: false
  },
  {
    rank: 4,
    name: "Peloton des Cyclistes Lillois",
    members: 240,
    totalKg: 240.3,
    points: 3300,
    badge: "Garde-Boue d'Or",
    trend: "+6% cette semaine",
    isUserLeague: false
  }
];

export const MERCH_PRODUCTS = [
  {
    id: "PROD-01",
    name: "La Ceinture « Vaquita 59 »",
    subtitle: "Pneu de vélo du Nord × Filet de pêche fantôme tressé",
    category: "Accessoires Pneu & Filet",
    indicativePrice: "65 € (100% reversé au Pop-Up)",
    pointsEquivalent: "600 PTS (Coupon Prioritaire Pop-Up)",
    materials: [
      "65% Pneu de vélo réformé (collecté dans la métropole lilloise)",
      "25% Cordage & filet de pêche marin régénéré",
      "10% Boucle acier inoxydable sans nickel & passants chambre à air"
    ],
    origin: "Façonnée à la main chez AlterEos & La Belterie à Roubaix (59)",
    impact: "1,2 kg de déchets sauvages détournés de l'incinération et des océans",
    description: "L'alliance brute entre l'histoire colombienne & lilloise d'Hubert Motte et les enquêtes océaniques de Vakita. Chaque ceinture porte l'empreinte unique des crampons d'un pneu ayant roulé sur les pavés du Nord, bordée d'une tresse bleu océan issue de filets de pêche récupérés en mer.",
    artisan: {
      name: "Karim & Léa",
      workshop: "Atelier AlterEos (Roubaix)",
      timeSpent: "48 minutes de confection sellier",
      quote: "Chaque pneu a une bande de roulement différente : aucune ceinture Vaquita 59 n'est identique."
    },
    sizes: [
      { label: "T1 (85 cm — Taille 36/38)", stockPopUp: 9, status: "EN STOCK POP-UP" },
      { label: "T2 (95 cm — Taille 40/42)", stockPopUp: 4, status: "STOCK LIMITÉ" },
      { label: "T3 (105 cm — Taille 44/46)", stockPopUp: 11, status: "EN STOCK POP-UP" },
      { label: "Sur-mesure (Découpe sur place)", stockPopUp: 15, status: "ATELIER LIVE" }
    ],
    visualType: "belt",
    accentColor: "#a5d2b2",
    batchNumber: "SÉRIE #01 — 150 EXEMPLAIRES NUMÉROTÉS"
  },
  {
    id: "PROD-02",
    name: "Le Hoodie « Seconde Maille »",
    subtitle: "Coton recyclé des Box de dons × Empiècement filet marin",
    category: "Vestiaire Textile Upcyclé",
    indicativePrice: "89 € (100% reversé aux assos)",
    pointsEquivalent: "900 PTS (Coupon Prioritaire Pop-Up)",
    materials: [
      "70% Fibres de coton effilochées issues des Box de dons Seconde Maille",
      "20% Polyester recyclé de filets marins (poche kangourou & capuche)",
      "10% Patch caoutchouc gravé au laser à partir de chambres à air"
    ],
    origin: "Filé et tricoté en circuit court dans les Hauts-de-France (59)",
    impact: "Économise 4 200 litres d'eau par rapport à un sweat en coton vierge",
    description: "Un sweat lourd (450g/m²), coupe boxy unisexe, pensé comme une armure douce pour les citoyens engagés. Le patch poitrine en chambre à air de vélo reprend le surlignage bleu Vakita et les coordonnées GPS du Pop-Up de Lille/Roubaix.",
    artisan: {
      name: "Atelier Tissage du Nord & La Belterie",
      workshop: "Roubaix & Tourcoing (59)",
      timeSpent: "1h25 d'assemblage et finition",
      quote: "Les vêtements déposés dans vos box renaissent ici sans aucune teinture chimique : c'est la couleur brute du tri textile."
    },
    sizes: [
      { label: "S (Coupe Boxy)", stockPopUp: 7, status: "EN STOCK POP-UP" },
      { label: "M (Coupe Boxy)", stockPopUp: 2, status: "DERNIÈRES PIÈCES" },
      { label: "L (Coupe Boxy)", stockPopUp: 8, status: "EN STOCK POP-UP" },
      { label: "XL (Coupe Boxy)", stockPopUp: 5, status: "EN STOCK POP-UP" }
    ],
    visualType: "hoodie",
    accentColor: "#0284C7",
    batchNumber: "SÉRIE #01 — 100 EXEMPLAIRES NUMÉROTÉS"
  },
  {
    id: "PROD-03",
    name: "Sac Banane « L'Enquêteur »",
    subtitle: "Toile de filet de pêche régénéré × Sangle chambre à air & lance à incendie",
    category: "Bagagerie Terrain",
    indicativePrice: "55 € (100% reversé aux assos)",
    pointsEquivalent: "500 PTS (Coupon Prioritaire Pop-Up)",
    materials: [
      "55% Nylon régénéré ECONYL® issu de filets de pêche fantômes",
      "30% Chambre à air de vélo et tuyau de lance à incendie réformé",
      "15% Doublure en draps de seconde main collectés en Box"
    ],
    origin: "Confectionné à La Belterie (Roubaix - 59)",
    impact: "Imperméable naturellement, conçu pour durer 15 ans sur le terrain",
    description: "Inspiré par les journalistes de terrain de Vakita et les coursiers à vélo de Lille. Sa sangle en chambre à air offre un maintien antidérapant sur l'épaule, tandis que le zip étanche protège carnet d'enquête, micro ou kit de réparation vélo.",
    artisan: {
      name: "Sophie & Mehdi",
      workshop: "La Belterie — Roubaix",
      timeSpent: "1h10 de découpe et piqûre",
      quote: "La doublure intérieure change selon les draps et chemises déposés dans la Box de la Gare Lille Flandres."
    },
    sizes: [
      { label: "Taille Unique (Sangle réglable 75-135cm)", stockPopUp: 14, status: "EN STOCK POP-UP" },
      { label: "Édition Limitée Bandoulière Bleue", stockPopUp: 3, status: "STOCK LIMITÉ" }
    ],
    visualType: "bag",
    accentColor: "#0284C7",
    batchNumber: "SÉRIE #01 — 120 EXEMPLAIRES NUMÉROTÉS"
  },
  {
    id: "PROD-04",
    name: "T-Shirt Manifeste « Sauvez le Vaquita »",
    subtitle: "100% Seconde Maille surteinte écologique × Étiquette Pneu",
    category: "Vestiaire Textile Upcyclé",
    indicativePrice: "39 € (100% reversé aux assos)",
    pointsEquivalent: "350 PTS (Coupon Prioritaire Pop-Up)",
    materials: [
      "85% Jersey de coton revalorisé à partir des collectes du 59",
      "15% Lin local des Flandres",
      "Sérigraphie à l'encre à l'eau bleu Vakita sans solvant"
    ],
    origin: "Sérigraphié et cousu à Roubaix (59)",
    impact: "Zéro culture de coton neuf, 100% issu du gisement de vêtements déposés",
    description: "Au dos, l'infographie complète du marsouin Vaquita (moins de 10 individus restants dans le Golfe de Californie) et le tracé des 15% de pneus aujourd'hui revalorisés. Sur la manche, un empiècement cousu en chambre à air signant la collab.",
    artisan: {
      name: "Collectif Textile 59",
      workshop: "Roubaix (59100)",
      timeSpent: "35 minutes par pièce",
      quote: "Un manifeste qu'on porte sur soi pour déclencher la discussion autour de la seconde main."
    },
    sizes: [
      { label: "XS", stockPopUp: 6, status: "EN STOCK POP-UP" },
      { label: "S", stockPopUp: 12, status: "EN STOCK POP-UP" },
      { label: "M", stockPopUp: 9, status: "EN STOCK POP-UP" },
      { label: "L", stockPopUp: 4, status: "STOCK LIMITÉ" },
      { label: "XL", stockPopUp: 7, status: "EN STOCK POP-UP" }
    ],
    visualType: "tshirt",
    accentColor: "#a5d2b2",
    batchNumber: "SÉRIE #01 — 200 EXEMPLAIRES NUMÉROTÉS"
  },
  {
    id: "PROD-05",
    name: "Porte-Clés & Garde-Boue « Pneu & Filet »",
    subtitle: "Chutes d'atelier Zéro Perte × Mousqueton marin",
    category: "Accessoires Pneu & Filet",
    indicativePrice: "18 € (ou Offert dès 3 dépôts Box)",
    pointsEquivalent: "180 PTS (Récompense Directe Box)",
    materials: [
      "Chutes de découpe des ceintures en pneu de vélo",
      "Drisse de filet de pêche récupéré en mer du Nord",
      "Rivets laiton recyclé"
    ],
    origin: "Atelier Live Pop-Up Gare Saint-Sauveur (Lille)",
    impact: "Valorise 100% des chutes de moins de 15 cm de l'atelier",
    description: "Rien ne se perd à La Belterie : les extrémités des pneus trop courtes pour devenir des ceintures sont transformées en porte-clés indestructibles et garde-boues minimalistes de selle, assemblés en direct devant les visiteurs du Pop-Up.",
    artisan: {
      name: "Fabriqué par vous & nos artisans",
      workshop: "Stand Pop-Up Lille Saint-Sauveur",
      timeSpent: "10 minutes en direct",
      quote: "Venez avec votre vieux pneu au Pop-Up, repartez 10 minutes plus tard avec votre porte-clés gravé."
    },
    sizes: [
      { label: "Modèle Porte-Clés Mousqueton", stockPopUp: 28, status: "EN STOCK POP-UP" },
      { label: "Modèle Garde-Boue Selle Vélo", stockPopUp: 11, status: "EN STOCK POP-UP" }
    ],
    visualType: "keychain",
    accentColor: "#0284C7",
    batchNumber: "ATELIER CONTINU — ZÉRO CHUTE"
  },
  {
    id: "PROD-06",
    name: "Le Bob Réversible « De Bogota à Roubaix »",
    subtitle: "Côté Denim Seconde Main / Côté Toile de Filet Déperlante",
    category: "Accessoires Pneu & Filet",
    indicativePrice: "45 € (100% reversé aux assos)",
    pointsEquivalent: "420 PTS (Coupon Prioritaire Pop-Up)",
    materials: [
      "Face A : Jeans usagés collectés dans les Box étudiantes de Lille",
      "Face B : Nylon de filet de pêche régénéré bleu océan & marine",
      "Visière rigidifiée par une fine bande de chambre à air"
    ],
    origin: "Roubaix (59)",
    impact: "Donne une seconde vie aux jeans troués non réparables en l'état",
    description: "Clin d'œil au voyage fondateur d'Hubert en Colombie où tout a commencé et aux expéditions de Vakita sous la pluie. Réversible selon la météo du Nord : côté jean brut par temps sec, côté filet marin déperlant bleu Vakita sous la drache lilloise.",
    artisan: {
      name: "Nadia",
      workshop: "Atelier Couture Solidaire 59",
      timeSpent: "55 minutes de patronage patchwork",
      quote: "On découpe les jambes de jeans abîmés aux genoux pour créer chaque panneau du bob."
    },
    sizes: [
      { label: "T1 (56-57 cm)", stockPopUp: 8, status: "EN STOCK POP-UP" },
      { label: "T2 (58-60 cm)", stockPopUp: 5, status: "STOCK LIMITÉ" }
    ],
    visualType: "hat",
    accentColor: "#a5d2b2",
    batchNumber: "SÉRIE #01 — 80 EXEMPLAIRES NUMÉROTÉS"
  }
];

export const REPORTAGES_VIDEOS = [
  {
    id: "REP-01",
    tag: "ENQUÊTE & GENÈSE",
    duration: "06:42",
    title: "De Bogota à Roubaix : pourquoi seulement 15% des pneus sont revalorisés ?",
    protagonists: "Avec Hubert Motte (La Vie est Belt) & l'équipe Vakita",
    location: "Bogota (Colombie) → Roubaix (59)",
    summary: "À 23 ans, lors de ses études en Colombie, Hubert est frappé par l'ingéniosité de ceux qui transforment les déchets en objets du quotidien face à la misère. De retour dans le 59, il découvre que seuls 15% des pneus sont véritablement revalorisés en nouveaux objets et se forme auprès d'un artisan cuir.",
    keyStats: [
      { label: "Pneus revalorisés", value: "15%" },
      { label: "Âge au lancement", value: "23 ans" },
      { label: "Ancrage local", value: "Dept. 59" }
    ],
    steps: [
      { time: "00:00", label: "Le choc de Bogota : quand le déchet devient ressource vitale" },
      { time: "02:15", label: "Le scandale des pneus de vélo brûlés ou enfouis en France" },
      { time: "04:10", label: "Apprentissage chez l'artisan sellier et premiers concours gagnés" },
      { time: "05:30", label: "Naissance de La Belterie à Roubaix avec AlterEos" }
    ]
  },
  {
    id: "REP-02",
    tag: "INVESTIGATION OCÉAN",
    duration: "08:15",
    title: "Vaquita & Filets Fantômes : transformer le piège des océans en Seconde Maille",
    protagonists: "Par Hugo Clément & la rédaction VAKITA",
    location: "Mer du Nord & Golfe de Californie",
    summary: "Le Vaquita, plus petit cétacé du monde qui a donné son nom à Vakita, est menacé d'extinction à cause des filets maillants illégaux. Chaque année, 640 000 tonnes de filets fantômes dérivent dans les océans. Voici comment nous les récupérons pour les tisser avec La Vie est Belt.",
    keyStats: [
      { label: "Filets abandonnés/an", value: "640 000 t" },
      { label: "Vaquitas restants", value: "< 10" },
      { label: "Recyclabilité nylon", value: "100%" }
    ],
    steps: [
      { time: "00:00", label: "Pourquoi Vakita porte le nom du marsouin du Pacifique" },
      { time: "02:45", label: "Sur les quais de Boulogne et Dunkerque : récupérer les filets usagés" },
      { time: "05:20", label: "Nettoyage, broyage et régénération en fil haute ténacité" },
      { time: "07:00", label: "Arrivée des bobines à l'atelier de Roubaix" }
    ]
  },
  {
    id: "REP-03",
    tag: "COULISSES ATELIER 59",
    duration: "05:18",
    title: "Dans le secret des Box : du vêtement déposé à la pièce du Pop-Up",
    protagonists: "Avec Karim, Léa et les trieurs d'AlterEos (Roubaix)",
    location: "La Belterie — Roubaix (59100)",
    summary: "Que devient réellement le jean ou le pneu que vous scannez dans une Box Seconde Maille ? Immersion étape par étape dans l'atelier solidaire : tri manuel, sélection des vêtements redonnés aux associations, lavage écologique des pneus et couture sellier.",
    keyStats: [
      { label: "Emplois solidaires", value: "Local 59" },
      { label: "Bénéfices reversés", value: "100%" },
      { label: "Traçabilité QR", value: "Totale" }
    ],
    steps: [
      { time: "00:00", label: "Collecte à vélo cargo des Box de Lille et Roubaix" },
      { time: "01:30", label: "Double tri : 1/ Dons directs aux associations 2/ Gisement d'upcycling" },
      { time: "03:05", label: "Dégraissage et brossage des pneus de vélo sans solvant" },
      { time: "04:20", label: "Numérotation des pièces pour le Pop-Up de la Gare Saint-Sauveur" }
    ]
  }
];

export const PROCESS_STEPS = [
  {
    number: "01",
    verb: "COLLECTER",
    title: "Les Box Intelligentes & Solidaires",
    description: "Vous localisez une Box Seconde Maille via l'appli, déposez vos vêtements usagés, pneus de vélo ou cordages, et scannez le QR code pour créditer vos points et faire grimper la jauge collective.",
    materialTag: "Vêtements + Pneus + Filets"
  },
  {
    number: "02",
    verb: "FABRIQUER",
    title: "Upcycling Artisanal dans le 59",
    description: "À Roubaix, les habits en bon état partent directement aux associations. Les matières abîmées, pneus et filets marins sont transformés à la main par les artisans d'AlterEos et de La Belterie.",
    materialTag: "Atelier Solidaire Roubaix"
  },
  {
    number: "03",
    verb: "VENDRE",
    title: "Le Pop-Up Éphémère (Zéro E-Commerce)",
    description: "Pas d'expédition polluante à l'autre bout du monde : la collection capsule est présentée en ligne (stocks et tailles en direct) mais s'acquiert au Pop-Up physique. 100% des recettes financent les assos.",
    materialTag: "100% Reversé aux Assos"
  },
  {
    number: "04",
    verb: "SE RETROUVER",
    title: "Le QG Citoyen & Atelier Live",
    description: "Lors de l'événement à Lille Saint-Sauveur, donateurs, lecteurs de Vakita et artisans se rencontrent : réparation gratuite, gravure de ceintures en direct et débats écologiques.",
    materialTag: "Gare Saint-Sauveur Lille"
  },
  {
    number: "05",
    verb: "RACONTER",
    title: "L'Enquête par l'Action",
    description: "Chaque produit porte un QR code retraçant l'histoire du pneu, du filet de pêche et de l'artisan qui l'a façonné, accompagné des reportages d'investigation de Vakita.",
    materialTag: "Média d'Action Indépendant"
  }
];

export const POPUP_SCHEDULE = [
  {
    day: "VENDREDI — OUVERTURE",
    hours: "14h00 — 21h00",
    highlight: "Inauguration du Pop-Up & Ouverture du Stock Capsule #01",
    details: "Présentation de la collab avec Hubert Motte (La Vie est Belt) et l'équipe Vakita. Collecte géante de pneus et vêtements à l'entrée."
  },
  {
    day: "SAMEDI — JOURNÉE ACTION",
    hours: "10h00 — 22h00",
    highlight: "Atelier Upcycling Live + Projection Enquête « Sauver le Vaquita »",
    details: "Fabriquez votre propre ceinture ou porte-clés en pneu avec les artisans d'AlterEos. À 18h30 : table ronde écologique et annonce du palier de la cagnotte."
  },
  {
    day: "DIMANCHE — GRAND FINAL",
    hours: "10h00 — 19h00",
    highlight: "Remise du Chèque Collectif aux Associations & Bourse d'Échange",
    details: "Distribution gratuite des vêtements de seconde main collectés avec les associations partenaires et clôture de la jauge solidaire."
  }
];


/* =====================================================================
   DONNÉES DU SITE VITRINE (utilisées par App.jsx)
   Ajoutées pour faire correspondre les imports du site aux données existantes.
   ===================================================================== */

const pickProduct = (visualType) => MERCH_PRODUCTS.find((p) => p.visualType === visualType);

// Les 4 pièces de la collection présentées sur le site (prix alignés sur la charte de transparence)
export const PRODUCTS = [
  { ...pickProduct('belt'), price: 65, badge: 'Pièce phare', stockLille: '39 pièces' },
  { ...pickProduct('hat'), price: 42, badge: 'Réversible', stockLille: '24 pièces' },
  { ...pickProduct('bag'), price: 58, badge: 'Terrain', stockLille: '17 pièces' },
  { ...pickProduct('keychain'), price: 18, badge: 'Gravé en direct', stockLille: '80 pièces' }
];

export const BRAND_PILLARS = {
  vakita: {
    tagline: 'Média d’enquête',
    url: 'https://www.vakita.fr',
    mission:
      'Vakita est un média indépendant qui enquête sur le terrain pour raconter l’état des océans et donner envie d’agir. Son nom vient du vaquita, le plus petit cétacé du monde, menacé par les filets maillants.',
    highlights: [
      'Enquêtes et documentaires exclusifs sur les filets fantômes',
      'Récit de la traçabilité de chaque pièce via le QR code',
      'Mobilisation de sa communauté autour du Pop-Up'
    ]
  },
  belt: {
    tagline: 'Upcycling du Nord',
    url: 'https://www.lavieestbelt.fr',
    mission:
      'La Vie est Belt transforme des matières délaissées — pneus de vélo, chambres à air, filets — en accessoires durables, façonnés à la main dans des ateliers solidaires des Hauts-de-France.',
    highlights: [
      'Conception et façonnage des 4 pièces de la collection',
      'Ateliers d’insertion et emploi solidaire dans le 59',
      'Gravure à chaud et ajustement sur-mesure en Pop-Up'
    ]
  }
};

export const BOX_EXPERIENCE_STEPS = [
  { step: 1, title: 'Ouvrir le coffret', description: 'Votre pièce numérotée et sa carte en papier ensemencé vous attendent dans un carton recyclé.' },
  { step: 2, title: 'Scanner le QR code', description: 'La carte débloque le passeport d’origine : lot de filet, atelier, artisan.' },
  { step: 3, title: 'Prolonger l’histoire', description: 'Accédez aux reportages Vakita et à vos avantages lors des prochains Pop-Up.' }
];

export const POPUP_BOUTIQUES = [
  { id: 'lille', city: 'Lille', venue: 'Gare Saint-Sauveur', address: '17 Bd Jean-Baptiste Lebas, 59800 Lille', dates: '14 — 16 nov. 2026', status: 'Ouvert' },
  { id: 'paris', city: 'Paris', venue: 'Lieu à annoncer', address: 'Adresse communiquée par newsletter', dates: 'Dates à venir', status: 'Bientôt' },
  { id: 'nantes', city: 'Nantes', venue: 'Lieu à annoncer', address: 'Adresse communiquée par newsletter', dates: 'Dates à venir', status: 'Bientôt' }
];

export const VAKITA_REPORTAGES = REPORTAGES_VIDEOS.map((v) => ({
  ...v,
  journalist: v.protagonists,
  impactStat: `${v.keyStats[0].value} — ${v.keyStats[0].label.toLowerCase()}`
}));
