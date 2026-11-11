import { Compass, HeartHandshake, Package, Store, Tv } from 'lucide-react';

/* =====================================================================
   CONTENUS DU SITE — issus du brief Seconde Maille
   ===================================================================== */

export const SITE_PAGES = [
  { id: 'accueil', num: '01', label: 'Le Concept', short: 'Accueil', icon: Compass },
  { id: 'marques', num: '02', label: 'Les 2 Marques', short: 'Marques', icon: HeartHandshake },
  { id: 'appli-box', num: '03', label: 'Box & Appli', short: 'Box & App', icon: Package },
  { id: 'popup-merch', num: '04', label: 'Le Pop-Up', short: 'Pop-Up', icon: Store },
  { id: 'reportages', num: '05', label: 'Raconter', short: 'Vakita', icon: Tv }
];

/* ---------- Événement ---------- */
export const EVENT = {
  name: 'Inauguration du Pop-Up Store Seconde Maille',
  dateLabel: 'Samedi 20 mars 2027',
  dateShort: '20.03.2027',
  date: new Date('2027-03-20T00:00:00+01:00'),
  boxDateLabel: '20 janvier 2027',
  boxDate: new Date('2027-01-20T00:00:00+01:00'),
  street: '82 Rue Louis Braille',
  city: '59100 Roubaix',
  address: '82 Rue Louis Braille, 59100 Roubaix',
  // Coordonnées du n°82 rue Louis Braille (Roubaix)
  lat: 50.676251,
  lng: 3.194141,
  hours: 'Horaires communiqués prochainement'
};

export const TICKER_ITEMS = [
  { badge: 'Collab', text: 'VAKITA × LA VIE EST BELT — SECONDE MAILLE' },
  { badge: 'Pop-Up', text: 'SAMEDI 20 MARS 2027 · 82 RUE LOUIS BRAILLE, ROUBAIX' },
  { badge: 'Box', text: 'BOX DE DÉPÔT DISPONIBLES DÈS LE 20 JANVIER 2027' },
  { badge: 'Entrée', text: 'VOTRE BILLET D’ENTRÉE : UN MATÉRIAU DÉPOSÉ' }
];

/* ---------- Storytelling ---------- */
export const STORY_INTRO = [
  'Tout commence par un filet de pêche abandonné. Dans la mer, il devient un piège pour les animaux qui y vivent. Parmi eux, le vaquita, un petit mammifère marin aujourd’hui gravement menacé. Ce filet, conçu pour attraper, peut continuer à faire des victimes longtemps après avoir été perdu ou jeté.',
  'À Lille, deux marques décident de lui donner une autre histoire. Vakita, média engagé, informe et sensibilise aux enjeux environnementaux et à la protection animale. La Vie est Belt transforme des matériaux destinés à être jetés en accessoires utiles. Ensemble, elles imaginent Seconde Maille : une collaboration qui donne une seconde vie aux matières et fait entendre une cause souvent éloignée de notre quotidien.',
  'Avec Seconde Maille, les filets récupérés deviennent le point de départ de nouveaux vêtements et accessoires. Le projet se prolonge dans la ville à travers des collectes, des ateliers et une boutique éphémère où chacun peut découvrir la démarche et y prendre part. Déposer, fabriquer, transmettre : chaque étape relie un geste local à un enjeu plus vaste.',
  'Seconde Maille, c’est l’idée qu’une matière peut changer de destin. Une maille qui autrefois menaçait la vie marine peut, une fois revalorisée, devenir le symbole d’un engagement collectif.'
];

export const STORY_CHAPTERS = [
  {
    num: '01',
    title: 'Situation initiale',
    text: 'Au large, des filets de pêche abandonnés dérivent dans la mer. Ils continuent de piéger des animaux, dont le vaquita, un petit mammifère marin gravement menacé. À Lille, Vakita informe le public sur les causes environnementales et animales, tandis que La Vie est Belt transforme des matériaux destinés à être jetés en accessoires.'
  },
  {
    num: '02',
    title: 'Élément perturbateur',
    text: 'Un filet perdu ne disparaît pas lorsqu’il est abandonné : il peut continuer à menacer la vie marine. Cette pollution révèle aussi une contradiction : des matières encore utilisables deviennent des déchets, alors qu’elles pourraient être transformées. Face à ce constat, les deux marques souhaitent agir et sensibiliser le public.'
  },
  {
    num: '03',
    title: 'Péripéties',
    text: 'Vakita et La Vie est Belt s’associent autour de Seconde Maille. Le projet consiste à collecter des matériaux, notamment des filets de pêche, puis à les revaloriser pour créer des vêtements et des accessoires. À Lille, des points de collecte, des ateliers de création et une boutique éphémère invitent le public à découvrir les étapes du projet et à y participer.'
  },
  {
    num: '04',
    title: 'Résolution',
    text: 'Les matières récupérées trouvent une nouvelle utilité grâce à l’upcycling, tandis que les contenus de Vakita expliquent le lien entre les déchets abandonnés et les menaces qui pèsent sur les animaux marins. La collaboration associe ainsi création et sensibilisation : les matériaux sont transformés et le public est encouragé à s’engager à son échelle.'
  },
  {
    num: '05',
    title: 'Situation finale',
    text: 'Avec Seconde Maille, un filet autrefois associé à un danger devient la matière d’un projet collectif. À Lille, chaque collecte et chaque atelier contribuent à donner une seconde vie aux matériaux et à faire connaître la cause du vaquita. Le projet rappelle qu’un objet destiné à être jeté peut devenir le point de départ d’une nouvelle histoire.'
  }
];

/* ---------- Le nom ---------- */
export const NAME_ORIGIN = [
  { word: 'Seconde', meanings: ['Seconde vie', 'Seconde main'] },
  { word: 'Maille', meanings: ['La maille du textile, la texture des vêtements', 'La maille du filet de pêche'] }
];

/* ---------- Les 5 temps ---------- */
export const STEPS = [
  {
    number: '01',
    verb: 'Collecter',
    title: 'Des box de dépôt',
    description: 'Dès le 20 janvier 2027, des box accueillent les matériaux destinés à être jetés : filets de pêche, pneus et textiles. Chaque dépôt compte.',
    tag: 'Dès le 20 janvier'
  },
  {
    number: '02',
    verb: 'Fabriquer',
    title: 'L’upcycling',
    description: 'La Vie est Belt revalorise les matières collectées pour créer de nouveaux vêtements et accessoires.',
    tag: 'La Vie est Belt'
  },
  {
    number: '03',
    verb: 'Vendre',
    title: 'Une boutique éphémère',
    description: 'La collection se découvre dans le pop-up store, avec un espace merch Seconde Maille.',
    tag: 'Boutique merch'
  },
  {
    number: '04',
    verb: 'Se retrouver',
    title: 'Un événement participatif',
    description: 'Le 20 mars 2027, l’inauguration du pop-up réunit le public. Le billet d’entrée : un matériau déposé. Au programme : ateliers de création.',
    tag: '20 mars 2027'
  },
  {
    number: '05',
    verb: 'Raconter',
    title: 'Sensibiliser',
    description: 'Vakita explique le lien entre les déchets abandonnés et les menaces qui pèsent sur les animaux marins, comme le vaquita.',
    tag: 'Vakita'
  }
];

export const OBJECTIVES = [
  'Informer sur l’écologie, l’environnement et la cause animale',
  'Inciter à la seconde main',
  'Donner envie de s’engager'
];

export const AUDIENCES = [
  { title: 'Jeunes Lillois·es', detail: '18 – 30 ans' },
  { title: 'Familles', detail: 'avec enfants, sensibles à l’écologie' }
];

/* ---------- Le pop-up ---------- */
export const PROGRAMME = [
  { title: 'Inauguration du pop-up store', text: 'Découvrez la démarche Seconde Maille et la nouvelle gamme upcyclée.' },
  { title: 'Entrée = un matériau déposé', text: 'Apportez un matériau destiné à être jeté : c’est votre billet d’entrée.' },
  { title: 'Ateliers de création', text: 'Création de sacs à partir de matières récupérées.' },
  { title: 'Points & récompenses', text: 'Vos dépôts rapportent des points : un café, des goodies…' },
  { title: 'Boutique merch', text: 'Vêtements, accessoires et merch Seconde Maille.' }
];

export const COLLECTION = [
  { title: 'Accessoires', text: 'Pneus et filets de pêche revalorisés par La Vie est Belt.', material: 'Pneu × Filet' },
  { title: 'Vêtements', text: 'Textiles de seconde main et matières écologiques.', material: 'Seconde main' },
  { title: 'Sacs', text: 'À découvrir — et à fabriquer soi-même en atelier.', material: 'Atelier' },
  { title: 'Merch', text: 'Les pièces aux couleurs de Seconde Maille.', material: 'Boutique' }
];

/* ---------- Les marques ---------- */
export const BRANDS = {
  vakita: {
    tagline: 'Média engagé',
    url: 'https://www.vakita.fr',
    mission: 'Vakita informe et sensibilise aux enjeux environnementaux et à la protection animale. Son nom fait référence au vaquita, l’une des espèces les plus menacées d’extinction, notamment à cause des filets de pêche jetés lors de la pêche illégale au Mexique.',
    brings: 'La notoriété et l’esprit médiatique',
    gains: 'Une dimension physique',
    material: 'Le filet de pêche'
  },
  belt: {
    tagline: 'Upcycling · 59',
    url: 'https://www.lavieestbelt.fr',
    mission: 'La Vie est Belt transforme des matériaux destinés à être jetés en accessoires utiles. Une marque ancrée dans le Nord, présente physiquement auprès du public.',
    brings: 'Un ancrage 100% physique',
    gains: 'Une portée médiatique',
    material: 'Le pneu'
  }
};

/* ---------- Raconter (Vakita) ---------- */
export const STORIES = [
  {
    tag: 'Espèce menacée',
    title: 'Le vaquita',
    text: 'Un petit mammifère marin gravement menacé, notamment par les filets de pêche jetés lors de la pêche illégale au Mexique. C’est lui qui a donné son nom à Vakita.'
  },
  {
    tag: 'Pollution',
    title: 'Les filets abandonnés',
    text: 'Conçu pour attraper, un filet perdu continue de piéger des animaux longtemps après avoir été jeté.'
  },
  {
    tag: 'Seconde vie',
    title: 'De la mer à l’atelier',
    text: 'Comment des matières destinées à être jetées deviennent des vêtements et des accessoires grâce à l’upcycling.'
  }
];
