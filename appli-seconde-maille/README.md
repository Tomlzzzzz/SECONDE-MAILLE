# Seconde Maille — l’appli

Application mobile (web app / PWA) de Seconde Maille : localisation des box et du pop-up, scan des dépôts, ligues et récompenses.
Même DA que le site. **Affichage téléphone uniquement** : sur ordinateur, l’appli s’affiche dans un cadre de téléphone ; sur mobile, elle occupe tout l’écran.

## Lancer comme un logiciel (Windows)

Dans le dossier `lanceur/` :

1. Double-clique **`Creer le raccourci.vbs`** (une seule fois) : une icône **Seconde Maille** apparaît sur le Bureau et dans le menu Démarrer.
2. Double-clique l’icône **Seconde Maille** : l’appli s’ouvre dans sa propre fenêtre, format téléphone, sans barre d’adresse.
   - **Mise à jour automatique à chaque lancement** (`lanceur/update.mjs`) : si un fichier de l’appli a changé depuis la dernière fois (`src/`, `public/`, `.env.local`, `package.json`…), l’appli est recompilée avant de s’ouvrir (petite fenêtre noire ~10 s). Si `package.json` a changé, `npm install` est relancé. Si rien n’a changé, l’appli s’ouvre tout de suite.
   - Si la mise à jour échoue, l’appli s’ouvre dans sa version précédente avec un message.
   - Fermer la fenêtre arrête l’appli (le petit serveur local s’arrête tout seul).

Fonctionnement : un serveur local invisible (`lanceur/serve.mjs`, port 5180) + Edge ou Chrome en mode « application ».
Ce mode garde la géolocalisation et la caméra de Windows. Les données (profil, points) sont conservées entre deux lancements.
Prérequis : Node.js.

## Lancer en mode développement

```bash
cd appli-seconde-maille
npm install
npm run dev
```

- Ordinateur : http://localhost:5174
- Téléphone (même Wi-Fi) : l’adresse « Network » affichée par Vite (ex. http://192.168.1.20:5174).
  ⚠️ La caméra et la géolocalisation exigent **https** sur téléphone : pour tester en vrai, publie l’appli (Netlify, Vercel…) ou utilise un tunnel https.

## Comptes & sauvegarde en ligne (Supabase, gratuit)

Chaque membre crée un compte (e-mail + mot de passe). Points, dépôts, parties, série, bons de réduction et profil sont sauvegardés sur son compte et retrouvés sur n’importe quel appareil. L’appli garde aussi une copie sur le téléphone : elle marche hors ligne et envoie tout au retour du réseau. Si quelqu’un joue sans compte puis en crée un, sa progression est ajoutée au compte.

Mise en place (une seule fois, ~10 min) :
1. Crée un compte sur supabase.com → **New project** (région Europe, mot de passe de base au choix).
2. **SQL Editor → New query** : colle le contenu de `supabase/schema.sql` → **Run**.
3. **Project Settings → API** : copie *Project URL* et la clé *anon / publishable*.
4. À la racine de l’appli, copie `.env.example` en **`.env.local`** et colle ces deux valeurs.
5. **Authentication → Sign In / Providers → Email** :
   - pour les tests, désactive *Confirm email* (connexion immédiate après inscription) ;
   - sinon, mets l’adresse de ton site en ligne dans **Authentication → URL Configuration → Site URL** (le lien de confirmation y renvoie).
6. Relance `npm run build` (ou `npm run app`) puis redéploie `dist` : les clés sont intégrées au build.

Sans `.env.local`, l’appli reste 100 % locale comme avant (pas d’écran de compte).
Données visibles dans Supabase → **Table Editor** : `saves` (sauvegarde complète) et `profiles` (pseudo + points, prêts pour de vrais classements).
⚠️ Les points sont calculés dans l’appli : pour l’événement réel, la validation des pesées devra se faire côté serveur (QR signés par les box).

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
État : `src/state/store.jsx` (copie locale) + `src/lib/cloud.js` (comptes, sauvegarde) + `src/state/merge.js` (fusion appareil ↔ compte).

## Le jeu « Maille à part »

Le vaquita esquive les filets égarés (dérivants, rideaux tombant de la surface, filets ancrés au fond) et attrape des bulles d’air. 3 vies, la mer accélère avec le temps. Décor repris du header du site (`public/game/` : ciel, nuages, silhouette de Roubaix, bateau, filet, vaquita) — remplace ces SVG par tes visuels en gardant les noms.

- Jusqu’au 20 mars 2027 : **1 partie comptée par jour**, les suivantes sont en entraînement. Pendant la phase de test, les points comptent dès maintenant (`SCORE_BEFORE_START` dans `src/data/game.js` ; mets `false` pour n’ouvrir le jeu qu’au 20 janvier).
- Points : 1 pt toutes les 2 s + 1 pt par bulle (max 30) + série de jours consécutifs (+5 / jour, max +20). Repère : 1 kg déposé = 100 pts.
- Avant / après la collab : entraînement illimité (« tu aurais gagné X pts »).
- Réglages : `src/data/game.js`. Commandes : glisser le doigt / souris, ou flèches ↑ ↓.

## QR code affiché par la box (après pesée)

```
SM|<idBox>|<poids en grammes>|<matière>|<code unique>
ex. SM|GPL|1250|FIL|8F2KQ
```

- `idBox` : Lille PUP (devant le pop-up), GPL, VBO, VXL, EUR, LFL (gare Lille-Flandres), PBA (République), WAZ (Wazemmes), MOU (Moulins) · Roubaix RGP (Grand-Place), RGA (gare), RPI (La Piscine), RCP (Condition Publique), RMA (La Manufacture), RBA (parc Barbieux), RVE (vélodrome) (voir `src/data/places.js`)
- matière : `FIL` filets & tissus (×2), `PNE` pneus (×1,5), `TEX` textiles (×1)
- code unique : 4 à 12 caractères A-Z/0-9, empêche de scanner deux fois le même dépôt
- Points : 1 pt / 10 g × bonus matière × bonus de ligue (×1 à ×1,5)

Sur PC sans caméra : bouton 🧪 « Mode démo » dans l’onglet Scan.

## Exporter vers une vraie appli plus tard

Le projet est déjà une PWA (manifest, icônes, plein écran). Pour publier sur les stores : `npm run build`, puis l’envelopper avec **Capacitor** (`npx cap add android` / `ios`).
