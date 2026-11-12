// productions multimédia (fichiers dans public/media)
import { media } from '../components/Media';

export const TEASER = {
  src: media('teaser.mp4'),
  poster: media('teaser.jpg'),
  title: 'La visite du pop-up',
  text: 'Avant le 20 mars, deux minutes pour tout comprendre : comment marchent les box et les points, puis ce qui vous attend sur place. Notre présentateur traverse les cinq espaces, du hub à la boutique, face caméra, comme sur les comptes Instagram et TikTok de Vakita.',
  // moments où le présentateur entre dans chaque espace (en secondes)
  chapters: [
    { label: 'Le hub', t: 22 },
    { label: 'Le café vegan', t: 48 },
    { label: 'L’atelier', t: 61 },
    { label: 'La masterclass', t: 76 },
    { label: 'La boutique', t: 82 }
  ]
};

export const RADIO = {
  src: media('spot-radio.mp3'),
  title: 'Seconde Maille sur les ondes',
  text: 'Le spot radio de la campagne : 30 secondes pour donner rendez-vous au pop-up.',
  peaks: [0.38, 0.39, 0.9, 0.92, 0.67, 0.95, 0.77, 0.9, 0.81, 0.6, 0.9, 1.0, 0.88, 0.89, 0.62, 0.72, 0.38, 0.67, 0.86, 0.94, 0.7, 0.57, 0.65, 0.78, 0.76, 0.86, 0.82, 0.67, 0.41, 0.63, 0.83, 0.66, 0.79, 0.69, 0.57, 0.82, 0.6, 0.45, 0.51, 0.5, 0.88, 0.86, 0.79, 0.69, 0.91, 0.81, 0.67, 0.84, 0.64, 0.74, 0.7, 0.81, 0.73, 0.56, 0.35, 0.73, 0.93, 0.87, 0.69, 0.75, 0.82, 0.5, 0.71, 0.55, 0.67, 0.21, 0.12, 0.08, 0.08, 0.08, 0.08, 0.08]
};

export const SHOP_SCREENS = [
  {
    src: media('popup-ecran.mp4'),
    poster: media('popup-ecran.jpg'),
    title: 'L’écran infos',
    text: 'Diffusé en boucle sur les écrans de la boutique : la chute du nombre de vaquitas, le classement des personnes qui ont participé à la collecte, une présentation de Vakita et de La Vie est Belt, et le parcours des déchets jusqu’à la boutique.'
  },
  {
    src: media('planning.mp4'),
    poster: media('planning.jpg'),
    title: 'Le planning de la semaine',
    text: 'Le programme de la semaine d’ouverture, jour par jour. Les couleurs et les places restantes permettent de repérer les activités d’un coup d’œil et de s’inscrire à l’accueil.',
    legend: [
      { label: 'Ateliers', color: '#a5d2b2' },
      { label: 'Conférences', color: '#18407f' }
    ]
  }
];

export const BOX_STORIES = [
  {
    step: '01',
    src: media('motion-box.mp4'),
    poster: media('motion-box.jpg'),
    title: 'Comment marche la box',
    caption: 'Du 20 janvier au 20 mars, près de chez toi : tu déposes, la box pèse, tu scannes ton QR code et tu gagnes des points.'
  },
  {
    step: '02',
    src: media('parcours-dechet.mp4'),
    poster: media('parcours-dechet.jpg'),
    title: 'Le parcours d’un déchet',
    caption: 'De la box au tri, puis à l’atelier où il devient une ceinture vendue dans le pop-up à Lille. Un déchet, une seconde vie.'
  }
];
