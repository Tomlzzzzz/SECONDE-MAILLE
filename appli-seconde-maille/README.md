# Seconde Maille — l’appli

Application mobile (web app / PWA) de Seconde Maille : localisation des box et du pop-up, scan des dépôts, ligues et récompenses.
Même DA que le site. **Affichage téléphone uniquement** : sur ordinateur, l’appli s’affiche dans un cadre de téléphone ; sur mobile, elle occupe tout l’écran.

## Lancer comme un logiciel (Windows)

Dans le dossier `lanceur/` :

1. Double-clique **`Creer le raccourci.vbs`** (une seule fois) : une icône **Seconde Maille** apparaît sur le Bureau et dans le menu Démarrer.
2. Double-clique l’icône **Seconde Maille** : l’appli s’ouvre dans sa propre fenêtre, format téléphone, sans barre d’adresse.
   - 1re ouverture : préparation automatique (`npm install` + `npm run build`, 1 à 2 min).
   - Fermer la fenêtre arrête l’appli (le petit serveur local s’arrête tout seul).

Fonctionnement : un serveur local invisible (`lanceur/serve.mjs`, port 5180) + Edge ou Chrome en mode « application ».
Ce mode garde la géolocalisation et la caméra de Windows. Les données (profil, points) sont conservées entre deux lancements.
Prérequis : Node.js. Après une modification du code, supprime le dossier `dist/` (ou lance `npm run build`) pour que le lanceur reprenne la nouvelle version.

## Lancer en mode développement

```bash
cd appli-seconde-maille
npm install
npm run dev
```

- Ordinateur : http://localhost:5174
- Téléphone (même Wi-Fi) : l’adresse « Network » affichée par Vite (ex. http://192.168.1.20:5174).
  ⚠️ La caméra et la géolocalisation exigent **https** sur téléphone : pour tester en vrai, publie l’appli (Netlify, Vercel…) ou utilise un tunnel https.

## Architecture

```
0. Onboarding : bienvenue → activation de la géolocalisation → profil (pseudo, couleur)
Navigation (5 onglets)
├── 1. Carte        src/screens/MapScreen.jsx     box + pop-up, distances en direct, box la plus proche
│   └── Itinéraire  src/screens/RouteScreen.jsx   pas-à-pas à pied / à vélo (OSRM OpenStreetMap)
├── 2. Scan         src/screens/ScanScreen.jsx    caméra + QR, saisie manuelle, mode démo PC
│   └── Reçu        src/screens/ReceiptScreen.jsx reçu de pesée + frise des points + promotion de ligue
├── 3. Jeu          src/screens/GameHub.jsx       série, record, classement du jour, règles
│   └── Partie      src/screens/GamePlay.jsx      « Maille à part » (moteur canvas : src/game/engine.js)
├── 4. Ligues       src/screens/LeaguesScreen.jsx profil, défis de la semaine, classement, autour de toi
└── 5. Pass         src/screens/RewardsScreen.jsx pass membre QR + échange de points contre QR de réduction
```

Données à remplacer : `src/data/` (lieux des box, ligues, récompenses, membres simulés).
État (profil, dépôts, points) : sauvegardé sur l’appareil (`localStorage`) — à brancher plus tard sur un serveur.

## Le jeu « Maille à part »

Le vaquita esquive les filets égarés (dérivants, rideaux tombant de la surface, filets ancrés au fond) et attrape des bulles d’air. 3 vies, la mer accélère avec le temps. Décor repris du header du site (`public/game/` : ciel, nuages, silhouette de Roubaix, bateau, filet, vaquita) — remplace ces SVG par tes visuels en gardant les noms.

- Du 20 janvier au 20 mars 2027 : **1 partie comptée par jour**, les suivantes sont en entraînement.
- Points : 1 pt toutes les 3 s + 1 pt par bulle (max 30) + série de jours consécutifs (+5 / jour, max +20). Repère : 1 kg déposé = 100 pts.
- Avant / après la collab : entraînement illimité (« tu aurais gagné X pts »).
- Réglages : `src/data/game.js`. Commandes : glisser le doigt / souris, ou flèches ↑ ↓.

## QR code affiché par la box (après pesée)

```
SM|<idBox>|<poids en grammes>|<matière>|<code unique>
ex. SM|GPL|1250|FIL|8F2KQ
```

- `idBox` : GPL, VBO, VXL, EUR, RBX (voir `src/data/places.js`)
- matière : `FIL` filets & tissus (×2), `PNE` pneus (×1,5), `TEX` textiles (×1)
- code unique : 4 à 12 caractères A-Z/0-9, empêche de scanner deux fois le même dépôt
- Points : 1 pt / 10 g × bonus matière × bonus de ligue (×1 à ×1,5)

Sur PC sans caméra : bouton 🧪 « Mode démo » dans l’onglet Scan.

## Exporter vers une vraie appli plus tard

Le projet est déjà une PWA (manifest, icônes, plein écran). Pour publier sur les stores : `npm run build`, puis l’envelopper avec **Capacitor** (`npx cap add android` / `ios`).
