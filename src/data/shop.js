/*
  BOUTIQUE - merch & starter pack
  Les quantités en stock ne sont PAS ici : elles sont lues en direct dans
  /public/stock.json (voir src/components/shop/useLiveStock.js).
  Textes de fabrication et mesures : à vérifier / ajuster avec le fournisseur.
*/
const img = (n) => `${import.meta.env?.BASE_URL ?? '/'}products/${n}.webp`;

export const STOCK_URL = `${import.meta.env?.BASE_URL ?? '/'}stock.json`;
export const STOCK_REFRESH_MS = 15000;
export const LOW_STOCK = 5; // en dessous : "Plus que N"

export const MERCH = [
  {
    id: 'tshirt',
    name: 'Le T-shirt',
    tagline: 'Le basique de la collection',
    guide: 'haut',
    description:
      'La mascotte vaquita côté cœur, le logo Seconde Maille en grand dans le dos. Sur la version blanche, un tracé de mailles de filet court en ton sur ton, comme une trace de la mer.',
    fabrication: [
      'Pensé par Vakita et La Vie est Belt pour porter la cause du vaquita au quotidien.',
      'Textile choisi dans la démarche Seconde Maille : matières de seconde main ou écologiques.',
      'Marquage recto (mascotte) et verso (logo) aux couleurs de la collab.'
    ],
    colors: [
      {
        id: 'blanc',
        label: 'Blanc',
        swatch: '#F4F4F1',
        stockKey: 'tshirt-blanc',
        slides: [
          { src: img('tshirt-blanc-1'), label: 'Recto & verso' },
          { src: img('tshirt-blanc-2'), label: 'Face : la mascotte côté cœur' },
          { src: img('tshirt-blanc-3'), label: 'Dos : logo & mailles de filet' }
        ]
      },
      {
        id: 'gris',
        label: 'Gris',
        swatch: '#8E9190',
        stockKey: 'tshirt-gris',
        slides: [
          { src: img('tshirt-gris-1'), label: 'Recto & verso' },
          { src: img('tshirt-gris-2'), label: 'Face : la mascotte côté cœur' },
          { src: img('tshirt-gris-3'), label: 'Dos : le logo Seconde Maille' }
        ]
      }
    ]
  },
  {
    id: 'sweat',
    name: 'Le Sweat à capuche',
    tagline: 'Pour les jours de collecte',
    guide: 'sweat',
    description:
      'Deux versions : le blanc, discret, avec la mascotte côté cœur ; le gris, qui affiche le logo Seconde Maille en grand sur la poitrine. Capuche à cordons et poche kangourou.',
    fabrication: [
      'Un sweat à garder longtemps : c’est le premier geste anti-gaspillage.',
      'Textile choisi dans la démarche Seconde Maille : matières de seconde main ou écologiques.',
      'Marquage aux couleurs de la collab Vakita × La Vie est Belt.'
    ],
    colors: [
      {
        id: 'blanc',
        label: 'Blanc',
        swatch: '#F4F4F1',
        stockKey: 'sweat-blanc',
        slides: [
          { src: img('sweat-blanc-1'), label: 'Vue d’ensemble' },
          { src: img('sweat-blanc-2'), label: 'Détail : la mascotte côté cœur' }
        ]
      },
      {
        id: 'gris',
        label: 'Gris',
        swatch: '#8E9190',
        stockKey: 'sweat-gris',
        slides: [
          { src: img('sweat-gris-1'), label: 'Vue d’ensemble' },
          { src: img('sweat-gris-2'), label: 'Détail : le grand logo' }
        ]
      }
    ]
  },
  {
    id: 'casquette',
    name: 'La Casquette',
    tagline: 'Bleu océan, visière menthe',
    guide: 'casquette',
    description:
      'Calotte bleu océan, visière menthe et le logo Seconde Maille avec la mascotte sur le devant. Les couleurs de la collab, de la tête aux pieds.',
    fabrication: [
      'Couleurs reprises de l’identité Seconde Maille : le bleu de la mer, le vert de la maille.',
      'Logo et mascotte sur l’avant.',
      'Taille unique, réglable à l’arrière.'
    ],
    colors: [
      {
        id: 'bleue',
        label: 'Bleu & menthe',
        swatch: 'linear-gradient(135deg,#1E3A8A 50%,#A9E2CF 50%)',
        stockKey: 'casquette-bleue',
        slides: [
          { src: img('casquette-1'), label: 'Vue de trois-quarts' },
          { src: img('casquette-2'), label: 'Détail : logo & mascotte' }
        ]
      }
    ]
  },
  {
    id: 'chaussettes',
    name: 'Les Chaussettes',
    tagline: 'La petite pièce qui fait parler',
    guide: 'chaussettes',
    description:
      'Côtes hautes, logo Seconde Maille et mascotte sur la tige. En bleu océan ou en vert menthe : le détail qui dépasse du pantalon et lance la conversation.',
    fabrication: [
      'Maille côtelée, pensée pour durer.',
      'Fil choisi dans la démarche Seconde Maille : matières recyclées ou écologiques.',
      'Logo et mascotte sur la tige.'
    ],
    colors: [
      {
        id: 'bleues',
        label: 'Bleu océan',
        swatch: '#1D4AA8',
        stockKey: 'chaussettes-bleues',
        slides: [
          { src: img('chaussettes-bleues-1'), label: 'La paire' },
          { src: img('chaussettes-bleues-2'), label: 'Détail : le logo sur la tige' }
        ]
      },
      {
        id: 'vertes',
        label: 'Vert menthe',
        swatch: '#9FE0C5',
        stockKey: 'chaussettes-vertes',
        slides: [
          { src: img('chaussettes-vertes-1'), label: 'La paire' },
          { src: img('chaussettes-vertes-2'), label: 'Détail : le logo sur la tige' }
        ]
      }
    ]
  }
];

/* Guide des tailles - mesures à plat, en cm (valeurs standard unisexe à confirmer) */
export const SIZE_GUIDES = {
  haut: {
    label: 'T-shirt',
    kind: 'top',
    columns: ['Taille', 'A · Largeur poitrine', 'B · Longueur', 'Correspond à'],
    rows: [
      ['XS', '46', '68', 'tour de poitrine 82 – 88'],
      ['S', '49', '70', '88 – 94'],
      ['M', '52', '72', '94 – 100'],
      ['L', '55', '74', '100 – 106'],
      ['XL', '58', '76', '106 – 112'],
      ['XXL', '61', '78', '112 – 118']
    ]
  },
  sweat: {
    label: 'Sweat',
    kind: 'top',
    columns: ['Taille', 'A · Largeur poitrine', 'B · Longueur', 'Correspond à'],
    rows: [
      ['S', '53', '68', 'tour de poitrine 88 – 94'],
      ['M', '56', '70', '94 – 100'],
      ['L', '59', '72', '100 – 106'],
      ['XL', '62', '74', '106 – 112'],
      ['XXL', '65', '76', '112 – 118']
    ]
  },
  casquette: {
    label: 'Casquette',
    kind: 'cap',
    columns: ['Taille', 'Tour de tête', 'Réglage'],
    rows: [['Unique', '54 – 60', 'Sangle réglable à l’arrière']]
  },
  chaussettes: {
    label: 'Chaussettes',
    kind: 'sock',
    columns: ['Taille', 'Pointure FR', 'Longueur du pied'],
    rows: [
      ['35-38', '35 → 38', '22,5 – 24,5'],
      ['39-42', '39 → 42', '25 – 27'],
      ['43-46', '43 → 46', '27,5 – 29,5']
    ]
  }
};

/* Starter pack - les goodies */
export const STARTER_PACK = {
  title: 'Le Starter Pack',
  pitch: 'Tout ce qu’il faut pour commencer ta seconde maille.',
  intro:
    'Un tote bag pour tout emporter et six objets du quotidien aux couleurs de Seconde Maille : de quoi remplacer le jetable dès le lendemain du pop-up. Chaque pack soutient la démarche et fait voyager la cause du vaquita.',
  priceLabel: 'Prix dévoilé à l’ouverture du pop-up',
  pickup: 'À retirer au pop-up le 20 mars 2027',
  items: [
    {
      id: 'tote',
      name: 'Le tote bag',
      role: 'Le sac qui contient tout le pack',
      text: 'Toile écrue, anses menthe, logo et mascotte imprimés. Pour les courses, les cours… et les dépôts dans les box.',
      variants: [{ label: 'Écru & menthe', src: img('tote-bag'), tall: img('tote-bag-portrait'), swatch: '#EDE8DD' }]
    },
    {
      id: 'gourde',
      name: 'La gourde',
      role: 'Fini les bouteilles jetables',
      text: 'Gourde en métal avec mousqueton, à accrocher au sac. Deux finitions au choix.',
      variants: [
        { label: 'Menthe', src: img('gourde-verte'), swatch: '#8FD3BA' },
        { label: 'Blanc & menthe', src: img('gourde-blanche'), swatch: 'linear-gradient(180deg,#FFFFFF 60%,#8FD3BA 60%)' }
      ]
    },
    {
      id: 'tasse',
      name: 'La tasse',
      role: 'Pour le café du matin',
      text: 'Tasse blanche avec le logo Seconde Maille et la mascotte. À la maison ou au bureau.',
      variants: [{ label: 'Blanc', src: img('tasse'), swatch: '#FFFFFF' }]
    },
    {
      id: 'ecocup',
      name: 'Le gobelet réutilisable',
      role: 'Le café à emporter, sans déchet',
      text: 'Gobelet menthe avec couvercle, mascotte en façade. Ton café du pop-up, puis tous les autres.',
      variants: [{ label: 'Menthe', src: img('ecocup'), swatch: '#a5d2b2' }]
    },
    {
      id: 'stylo',
      name: 'Le stylo',
      role: 'Pour noter tes idées d’upcycling',
      text: 'Stylo rétractable marqué Seconde Maille. En vert ou en bleu.',
      variants: [
        { label: 'Vert', src: img('stylo-vert'), swatch: '#1F6B5A' },
        { label: 'Bleu', src: img('stylo-bleu'), swatch: '#2A3A8C' }
      ]
    },
    {
      id: 'porte-cles',
      name: 'Le porte-clés',
      role: 'La mascotte toujours sur toi',
      text: 'Médaillon effet cuir sur anneau métal : la mascotte sur fond menthe, ou le logo sur fond noir.',
      variants: [
        { label: 'Mascotte', src: img('porte-cles-mascotte'), swatch: '#9FDCC6' },
        { label: 'Logo', src: img('porte-cles-logo'), swatch: '#1A1A1A' }
      ]
    },
    {
      id: 'pass',
      name: 'Le pass',
      role: 'Ton badge pour l’événement',
      text: 'Pass Membre ou Pass Visiteur à ton nom, sur cordon. À porter le jour du pop-up.',
      variants: [{ label: 'Membre / Visiteur', src: img('pass'), swatch: '#FFFFFF' }]
    }
  ]
};
