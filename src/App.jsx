import React, { useState } from 'react';
import {
  MapPin,
  QrCode,
  Play,
  Recycle,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Smartphone,
  Monitor,
  Flame,
  HeartHandshake,
  Layers,
  Bike,
  Anchor,
  Store,
  Sparkles,
  Scale
} from 'lucide-react';
import { VakitaLogo, LaVieEstBeltLogo, CollabBadge } from './components/BrandLogos';
import MobileAppSimulator from './components/MobileAppSimulator';
import ProductVisual from './components/ProductVisual';
import ProductDetailModal from './components/ProductDetailModal';
import {
  INITIAL_COLLECTIVE_GOAL,
  DONATION_BOXES,
  MERCH_PRODUCTS,
  REPORTAGES_VIDEOS,
  PROCESS_STEPS,
  POPUP_SCHEDULE,
  WEIGHT_POINT_BRACKETS
} from './data/mockData';

const REPORTAGE_THUMBNAILS = {
  'REP-01': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  'REP-02': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80',
  'REP-03': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80'
};

export default function App() {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'web' | 'app'
  const [collectiveGoal, setCollectiveGoal] = useState(INITIAL_COLLECTIVE_GOAL);
  const [selectedBoxId, setSelectedBoxId] = useState(DONATION_BOXES[0].id);

  const [userProfile, setUserProfile] = useState({
    name: "Camille — Lille 59",
    level: "Ambassadeur Seconde Maille • Niv. 4",
    league: "Ligue Roubaix Zéro Déchet (59)",
    points: 640,
    totalKg: 6.4,
    co2Saved: 21.5,
    history: [
      {
        boxName: "La Belterie — Atelier & QG (Roubaix)",
        title: "2 Pneus de Vélo + 1 Chambre à air",
        points: 220,
        futureProduct: "Ceinture 'Vaquita 59'"
      },
      {
        boxName: "Gare Lille Flandres — Parvis Vélo",
        title: "Sac de 3 Jeans & 2 Sweats Coton",
        points: 420,
        futureProduct: "Hoodie 'Seconde Maille'"
      }
    ]
  });

  const [selectedCategory, setSelectedCategory] = useState('TOUT');
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [activeReportage, setActiveReportage] = useState(REPORTAGES_VIDEOS[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const handleCompleteDeposit = (rewardData) => {
    setCollectiveGoal((prev) => ({
      ...prev,
      currentKg: +(prev.currentKg + rewardData.weightKg).toFixed(1),
      currentPoints: prev.currentPoints + rewardData.points,
      donorsCount: prev.donorsCount + 1
    }));

    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + rewardData.points,
      totalKg: +(prev.totalKg + rewardData.weightKg).toFixed(1),
      co2Saved: +(prev.co2Saved + rewardData.co2SavedKg).toFixed(1),
      history: [
        {
          boxName: rewardData.boxName,
          title: rewardData.title,
          points: rewardData.points,
          futureProduct: rewardData.futureProduct
        },
        ...prev.history
      ]
    }));

    setToastNotification(rewardData);
    setTimeout(() => setToastNotification(null), 5500);
  };

  const handleSimulateCollectiveMilestone = () => {
    setCollectiveGoal((prev) => ({
      ...prev,
      currentKg: prev.targetKg,
      currentPoints: prev.targetPoints,
      donorsCount: prev.donorsCount + 48
    }));
    setToastNotification({
      title: "Objectif collectif 2 500 kg atteint !",
      points: 1000,
      boxName: "Réseau des Box du 59",
      futureProduct: "15 000 € débloqués par Vakita & La Vie est Belt !"
    });
    setTimeout(() => setToastNotification(null), 6000);
  };

  const filteredProducts =
    selectedCategory === 'TOUT'
      ? MERCH_PRODUCTS
      : MERCH_PRODUCTS.filter((p) => p.category === selectedCategory);

  const progressPercentage = Math.min(
    100,
    Math.round((collectiveGoal.currentKg / collectiveGoal.targetKg) * 100)
  );
  const isGoalReached = collectiveGoal.currentKg >= collectiveGoal.targetKg;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">
      {/* BANDEAU FIN SUPÉRIEUR STYLE LA VIE EST BELT / VAKITA */}
      <div className="bg-[#111111] text-white overflow-hidden py-2 border-b border-zinc-800">
        <div className="animate-ticker flex items-center gap-10 text-xs font-semibold tracking-wide">
          <span className="flex items-center gap-2">
            <span className="bg-[#FFEA00] text-[#111111] font-extrabold px-2 py-0.5 rounded-xs text-[10px]">
              SECONDE MAILLE
            </span>
            <span>Collaboration engagée Vakita × La Vie est Belt (Roubaix - 59)</span>
          </span>
          <span className="text-zinc-500">•</span>
          <span>
            Filet de pêche marin (<strong className="text-[#FFEA00]">Vakita</strong>) × Pneu de vélo (<strong className="text-[#FFEA00]">La Vie est Belt</strong>)
          </span>
          <span className="text-zinc-500">•</span>
          <span>
            Pas de vente en ligne : suivi des stocks en direct & rendez-vous au Pop-Up Gare Saint-Sauveur (Lille)
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-[#FFEA00] font-bold">
            Cagnotte Box : {collectiveGoal.currentKg.toFixed(1)} / {collectiveGoal.targetKg} kg = 15 000 € offerts aux associations
          </span>
          <span className="text-zinc-500">•</span>
          <span>Collecter • Fabriquer • Vendre • Se retrouver • Raconter</span>
        </div>
      </div>

      {/* NAVBAR BLANCHE ÉPURÉE & FLOTTANTE */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100 px-4 lg:px-10 py-3.5">
        <div className="max-w-[1560px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3">
            <CollabBadge size="sm" />
          </a>

          <nav className="hidden xl:flex items-center gap-7 text-xs font-bold text-zinc-600">
            <a href="#concept" className="hover:text-[#111111] transition">
              Le Concept & Histoire
            </a>
            <a href="#cagnotte" className="hover:text-[#111111] transition">
              Box & Cagnotte 15 000 €
            </a>
            <a href="#merch" className="hover:text-[#111111] transition flex items-center gap-1.5">
              <span>Vestiaire & Stocks Pop-Up</span>
              <span className="bg-[#FFEA00] text-[#111111] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                Live
              </span>
            </a>
            <a href="#reportages" className="hover:text-[#111111] transition">
              Enquêtes & Coulisses 59
            </a>
            <a href="#popup" className="hover:text-[#111111] transition">
              Pop-Up Lille
            </a>
          </nav>

          {/* Sélecteur de vue moderne en pilule */}
          <div className="bg-zinc-100 p-1 rounded-full flex items-center gap-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'split'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-zinc-500 hover:text-[#111111]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Site + Appli</span>
            </button>
            <button
              onClick={() => setViewMode('web')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'web'
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-zinc-500 hover:text-[#111111]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Site Plein Écran</span>
            </button>
            <button
              onClick={() => setViewMode('app')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'app'
                  ? 'bg-[#FFEA00] text-[#111111] shadow-xs'
                  : 'text-zinc-600 hover:text-[#111111]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Appli Mobile ({userProfile.points} pts)</span>
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATION TOAST ÉLÉGANTE */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#111111] text-white rounded-3xl p-4 shadow-soft-lg border border-zinc-800 animate-float">
          <div className="flex items-start gap-3.5">
            <div className="bg-[#FFEA00] text-[#111111] px-3 py-1.5 rounded-2xl font-extrabold text-xs shrink-0">
              +{toastNotification.points} pts
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFEA00] block">
                Synchronisé avec le réseau Box 59
              </span>
              <h4 className="font-bold text-sm mt-0.5 text-white">
                {toastNotification.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {toastNotification.boxName} → {toastNotification.futureProduct}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VUE FOCUS APPLI SEULE */}
      {viewMode === 'app' ? (
        <main className="flex-1 py-10 px-4 bg-[#F8F9FA]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-1 rounded-full inline-block">
                Application Mobile Seconde Maille
              </span>
              <h1 className="font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight text-[#111111]">
                Localisez une Box, déposez vos vêtements & pneus, <span className="marker-yellow">scannez le QR Code.</span>
              </h1>
              <p className="text-sm text-zinc-600 leading-relaxed">
                L'application mobile prolonge l'expérience sur le terrain dans le 59 :
              </p>
              <div className="space-y-3 bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-soft text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A54] shrink-0" />
                  <span><strong>Géolocalisation</strong> & calcul d'itinéraire vélo/piéton vers les Box</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A54] shrink-0" />
                  <span><strong>Scan QR Code</strong> de ce que vous déposez avec points immédiats</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A54] shrink-0" />
                  <span><strong>Ligues de donateurs</strong> & déblocage des 15 000 € par les deux marques</span>
                </div>
              </div>
              <button
                onClick={() => setViewMode('split')}
                className="bg-[#111111] text-white font-bold text-xs px-5 py-3 rounded-full hover:bg-[#12354A] transition"
              >
                ← Afficher le Site et l'Appli côte à côte
              </button>
            </div>

            <div className="lg:col-span-7">
              <MobileAppSimulator
                userProfile={userProfile}
                collectiveGoal={collectiveGoal}
                onCompleteDeposit={handleCompleteDeposit}
                selectedBoxId={selectedBoxId}
                setSelectedBoxId={setSelectedBoxId}
                isFullscreenMobile
              />
            </div>
          </div>
        </main>
      ) : (
        /* VUE PRINCIPALE : SITE FOND BLANC LUMINEUX + APPLI MOBILE */
        <main id="top" className="flex-1 bg-white">
          <div className="max-w-[1560px] mx-auto px-4 lg:px-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* COLONNE SITE WEB */}
              <div
                className={
                  viewMode === 'split'
                    ? 'lg:col-span-7 xl:col-span-8 space-y-16'
                    : 'lg:col-span-12 space-y-24'
                }
              >
                {/* HERO ÉDITORIAL LUMINEUX SUR FOND BLANC */}
                <section className="relative bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 lg:p-12 shadow-soft overflow-hidden">
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-1 rounded-full">
                      COLLABORATION ÉVÉNEMENT • LILLE & ROUBAIX (59)
                    </span>
                    <span className="bg-zinc-100 text-zinc-700 font-semibold text-xs px-3 py-1 rounded-full">
                      Box de dons connectées & Boutique Éphémère
                    </span>
                  </div>

                  <h1 className="font-extrabold text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-[1.06] text-[#111111]">
                    Donnez une <span className="marker-yellow-box">Seconde Maille</span> à vos vêtements, pneus et filets marins.
                  </h1>

                  <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed">
                    Quand le média d'enquête indépendant <strong className="marker-yellow text-[#111111]">VAKITA</strong> (fondé par Hugo Clément) rencontre l'atelier d'upcycling lillois <strong className="text-[#12354A] belt-underline">La Vie est Belt</strong> (créé par Hubert Motte) : déposez vos textiles et pneus usagés dans nos Box géolocalisées, cumulez des points en scannant votre QR code et retrouvez la collection capsule au Pop-Up solidaire.
                  </p>

                  {/* 5 verbes d'action épurés */}
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {PROCESS_STEPS.map((step) => (
                      <div
                        key={step.number}
                        className="bg-[#F8F9FA] hover:bg-[#FFEA00]/25 border border-zinc-200/80 rounded-2xl p-3.5 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-zinc-400 group-hover:text-[#111111]">
                            {step.number}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-[#111111] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <div className="font-extrabold text-sm text-[#111111] mt-1">
                          {step.verb}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                          {step.materialTag}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 3 Cartes Matières : Filet de pêche x Pneu x Seconde main */}
                  <div className="mt-8 pt-8 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-zinc-200/70 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#FFEA00] text-[#111111] flex items-center justify-center shrink-0">
                        <Anchor className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                          ADN Vakita • Océans
                        </span>
                        <h3 className="font-extrabold text-sm text-[#111111] mt-0.5">
                          Filets de pêche & Vaquita
                        </h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          Retrait des filets fantômes qui menacent le marsouin <em>Vaquita</em> pour les régénérer en fil technique.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-zinc-200/70 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#12354A] text-white flex items-center justify-center shrink-0">
                        <Bike className="w-5 h-5 text-[#FFEA00]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                          ADN La Vie est Belt • 59
                        </span>
                        <h3 className="font-extrabold text-sm text-[#111111] mt-0.5">
                          Pneus de vélo revalorisés
                        </h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          Seuls 15% des pneus sont revalorisés : nos artisans à Roubaix les transforment en accessoires durables.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-zinc-200/70 flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-[#FFEA00] flex items-center justify-center shrink-0">
                        <Recycle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                          Double impact solidaire
                        </span>
                        <h3 className="font-extrabold text-sm text-[#111111] mt-0.5">
                          Seconde main & Associations
                        </h3>
                        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                          Les habits en bon état vont aux assos ; les fibres abîmées deviennent le merch du Pop-Up.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION JAUGE COLLECTIVE & BOOST DES 2 MARQUES */}
                <section
                  id="cagnotte"
                  className="bg-[#F8F9FA] rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-1 rounded-full">
                        DÉFI COLLECTIF DES BOX • LIGUES DONATEURS
                      </span>
                      <h2 className="font-extrabold text-2xl sm:text-3xl text-[#111111] mt-2.5 tracking-tight">
                        Objectif 2 500 kg collectés = <span className="marker-yellow">15 000 € reversés</span> par Vakita & La Vie est Belt
                      </h2>
                    </div>
                    <button
                      onClick={handleSimulateCollectiveMilestone}
                      className="bg-[#111111] hover:bg-[#12354A] text-white font-bold text-xs px-4 py-2.5 rounded-full transition flex items-center gap-2 shrink-0 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FFEA00]" />
                      Simuler l'objectif atteint (2 500 kg)
                    </button>
                  </div>

                  {/* Barre de progression moderne sur fond blanc */}
                  <div className="mt-6 bg-white rounded-2xl p-5 border border-zinc-200/80">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-extrabold text-3xl text-[#111111]">
                          {collectiveGoal.currentKg.toFixed(1)} kg
                        </span>
                        <span className="text-sm text-zinc-500 ml-2 font-medium">
                          collectés sur {collectiveGoal.targetKg} kg ({progressPercentage}%)
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#12354A]">
                        {collectiveGoal.donorsCount} citoyens participants • {collectiveGoal.currentPoints.toLocaleString('fr-FR')} pts distribués
                      </div>
                    </div>

                    <div className="w-full h-4 bg-zinc-100 rounded-full mt-3.5 overflow-hidden p-0.5 border border-zinc-200">
                      <div
                        className="h-full bg-[#FFEA00] rounded-full transition-all duration-700"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    {isGoalReached ? (
                      <div className="mt-4 bg-[#FFEA00] text-[#111111] px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-between">
                        <span>
                          🎉 Objectif collectif atteint ! Vakita et La Vie est Belt débloquent le don de 15 000 € pour les associations !
                        </span>
                        <span className="bg-[#111111] text-white px-2.5 py-0.5 rounded-full text-[10px]">
                          15 000 € DÉBLOQUÉS
                        </span>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-zinc-500">
                        Plus que <strong className="text-[#111111]">{(collectiveGoal.targetKg - collectiveGoal.currentKg).toFixed(1)} kg</strong> à déposer en Box pour déclencher la donation bonus des deux marques. Scannez un dépôt dans l'application à droite pour faire grimper la jauge !
                      </p>
                    )}
                  </div>

                  {/* Les 2 associations bénéficiaires */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collectiveGoal.associations.map((asso, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-2xl p-4 border border-zinc-200/80 flex items-center justify-between gap-4"
                      >
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#12354A] bg-zinc-100 px-2.5 py-0.5 rounded-full">
                            Dotation {asso.partner} ({asso.share})
                          </span>
                          <h4 className="font-extrabold text-sm text-[#111111] mt-2">
                            {asso.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-0.5">{asso.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-[#FFEA00]/30 flex items-center justify-center shrink-0">
                          <HeartHandshake className="w-5 h-5 text-[#111111]" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FRISE DES POINTS SELON LES FOURCHETTES DE POIDS (PESÉE BOX + QR CODE) */}
                  <div className="mt-6 bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#FFEA00] text-[#111111] flex items-center justify-center">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-[#111111]">
                            Frise d'attribution des Points selon le Poids pesé en Box
                          </h3>
                          <p className="text-xs text-zinc-500">
                            Une fois vos vêtements ou pneus déposés, la Box pèse votre don et génère un QR Code qui crédite vos points en proportion :
                          </p>
                        </div>
                      </div>
                      <span className="bg-zinc-100 text-[#12354A] font-extrabold text-[11px] px-3 py-1 rounded-full">
                        QR Code = Infos Box + Poids en kg
                      </span>
                    </div>

                    {/* Frise visuelle horizontale des 4 fourchettes de poids */}
                    <div className="relative">
                      <div className="hidden md:block absolute top-6 left-8 right-8 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-zinc-300 via-[#FFEA00] to-[#12354A]" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                        {WEIGHT_POINT_BRACKETS.map((bracket, index) => (
                          <div
                            key={bracket.id}
                            className="bg-[#F8F9FA] hover:bg-[#FFEA00]/20 border border-zinc-200/90 rounded-2xl p-4 transition flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#FFEA00] font-extrabold text-xs flex items-center justify-center">
                                  {index + 1}
                                </span>
                                {bracket.bonusPoints > 0 ? (
                                  <span className="bg-[#FFEA00] text-[#111111] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                    +{bracket.bonusPoints} pts bonus
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold text-zinc-400">
                                    Base 100 pts/kg
                                  </span>
                                )}
                              </div>

                              <div className="mt-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                                  {bracket.tierName}
                                </span>
                                <h4 className="font-extrabold text-base text-[#111111] mt-0.5">
                                  {bracket.rangeLabel}
                                </h4>
                                <div className="inline-block mt-1 bg-white border border-zinc-200 px-2.5 py-0.5 rounded-lg font-extrabold text-xs text-[#12354A]">
                                  {bracket.pointsRange}
                                </div>
                              </div>

                              <p className="text-xs text-zinc-600 mt-2.5 leading-snug">
                                <strong>Ex :</strong> {bracket.examples}
                              </p>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-zinc-200/70 text-[11px] font-bold text-[#111111]">
                              🎁 {bracket.rewardHint}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION HISTOIRE CROISÉE DES 2 MARQUES */}
                <section id="concept" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* La Vie est Belt */}
                  <div className="bg-white rounded-3xl border border-zinc-200/90 p-7 shadow-soft flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <LaVieEstBeltLogo />
                        <span className="text-[11px] font-bold bg-[#12354A] text-white px-3 py-1 rounded-full">
                          Né à Roubaix (59)
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-[#111111] tracking-tight">
                        De la Colombie au Nord : le déclic d'Hubert Motte
                      </h3>
                      <p className="text-sm text-zinc-600 mt-2.5 leading-relaxed">
                        L'histoire commence en <strong>Colombie</strong> où <strong>Hubert</strong>, jeune entrepreneur lillois de 23 ans, réalise ses études. Frappé par la misère mais admiratif de ceux qui réutilisent les déchets pour les transformer en objets du quotidien, il rentre dans le 59 pour lancer un projet écologique et social.
                      </p>
                      <div className="mt-4 bg-[#F8F9FA] rounded-2xl p-4 border border-zinc-200/70 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#111111]">
                          <span>Pneus revalorisés aujourd'hui :</span>
                          <span className="bg-[#FFEA00] px-2 py-0.5 rounded-md font-extrabold">
                            Seulement 15%
                          </span>
                        </div>
                        <p className="text-zinc-600 leading-relaxed">
                          Il se forme auprès d'un <strong>artisan cuir</strong>, remporte plusieurs concours pour financer ses machines et crée <strong>La Vie est Belt</strong> : des ceintures et accessoires en pneus de vélo confectionnés avec des ateliers solidaires du Nord.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#12354A]">
                      <span>Matière : Pneu de vélo & Chambre à air</span>
                      <span>Atelier La Belterie • 59</span>
                    </div>
                  </div>

                  {/* Vakita */}
                  <div className="bg-white rounded-3xl border border-zinc-200/90 p-7 shadow-soft flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <VakitaLogo />
                        <span className="text-[11px] font-extrabold bg-[#FFEA00] text-[#111111] px-3 py-1 rounded-full">
                          Média 100% Indépendant
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-[#111111] tracking-tight">
                        Vakita : enquêter, alerter et passer à l'action
                      </h3>
                      <p className="text-sm text-zinc-600 mt-2.5 leading-relaxed">
                        Fondé par <strong>Hugo Clément</strong>, le média tire son nom du <em>Vaquita</em>, le plus petit cétacé du monde décimé par les filets de pêche illégaux. L'objectif de Vakita : informer sur l'écologie et la cause animale tout en créant de l'entraide concrète.
                      </p>
                      <div className="mt-4 bg-[#111111] text-white rounded-2xl p-4 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#FFEA00]">
                          <span>Pourquoi « Seconde Maille » ?</span>
                          <span>Investigation + Terrain</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                          Transformer les filets de pêche récupérés et les vêtements déposés par les lecteurs en pièces engagées, tout en documentant en vidéo chaque étape de préparation à Roubaix.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#111111]">
                      <span className="marker-yellow">Matière : Filet de pêche marin</span>
                      <span>Cause Animale & Écologie</span>
                    </div>
                  </div>
                </section>

                {/* SECTION CATALOGUE MERCH & SUIVI DES STOCKS POP-UP (ZÉRO COMMANDE EN LIGNE) */}
                <section id="merch" className="space-y-6">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-[#FFEA00] text-[#111111] px-3 py-1 rounded-full text-xs font-extrabold mb-2">
                        <Store className="w-3.5 h-3.5" />
                        <span>VITRINE DU POP-UP • PAS DE COMMANDE EN LIGNE</span>
                      </div>
                      <h2 className="font-extrabold text-3xl sm:text-4xl text-[#111111] tracking-tight">
                        Les Pièces <span className="marker-yellow">« Seconde Maille »</span> & Stocks en Direct
                      </h2>
                      <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
                        Explorez les produits issus de vos dons, vérifiez les tailles disponibles en temps réel au Pop-Up de Lille et découvrez l'artisan qui a préparé chaque série. <strong>100% des recettes sont reversées aux associations.</strong>
                      </p>
                    </div>

                    {/* Filtres épurés */}
                    <div className="flex flex-wrap gap-1.5 bg-zinc-100 p-1.5 rounded-full">
                      {[
                        'TOUT',
                        'Accessoires Pneu & Filet',
                        'Vestiaire Textile Upcyclé',
                        'Bagagerie Terrain'
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                            selectedCategory === cat
                              ? 'bg-[#111111] text-[#FFEA00] shadow-xs'
                              : 'text-zinc-600 hover:text-[#111111]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grille Produits Style E-commerce DNVB Moderne sur fond blanc */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => {
                      const totalStock = product.sizes.reduce((sum, s) => sum + s.stockPopUp, 0);
                      return (
                        <div
                          key={product.id}
                          onClick={() => setActiveProductModal(product)}
                          className="cursor-pointer bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            <div className="relative">
                              <ProductVisual type={product.visualType} className="w-full h-56" />
                              <span className="absolute top-3 right-3 bg-[#111111]/90 backdrop-blur-md text-[#FFEA00] font-extrabold text-[11px] px-3 py-1 rounded-full">
                                {totalStock} en stock Pop-Up
                              </span>
                            </div>

                            <div className="p-5">
                              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                                <span>{product.category}</span>
                                <span className="text-[#12354A]">{product.pointsEquivalent.split(' ')[0]} pts Box</span>
                              </div>
                              <h3 className="font-extrabold text-lg text-[#111111] mt-1 group-hover:text-[#12354A] transition">
                                {product.name}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                                {product.subtitle}
                              </p>

                              {/* Pastilles Tailles & Stocks */}
                              <div className="mt-4 pt-3 border-t border-zinc-100">
                                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                  <span>Suivi des tailles au Pop-Up</span>
                                  <span className="text-[#1F7A54]">● En direct</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {product.sizes.map((sz, i) => (
                                    <span
                                      key={i}
                                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                        sz.stockPopUp <= 4
                                          ? 'bg-[#FFEA00]/30 border-[#FFEA00] text-[#111111]'
                                          : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                                      }`}
                                    >
                                      {sz.label.split(' ')[0]} · {sz.stockPopUp} dispo
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="px-5 pb-5 pt-1 flex items-center justify-between">
                            <span className="text-xs font-extrabold text-[#111111]">
                              {product.indicativePrice.split('(')[0]}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-zinc-100 group-hover:bg-[#FFEA00] text-[#111111] px-3.5 py-2 rounded-full transition">
                              <Eye className="w-3.5 h-3.5" />
                              Détails & Tailles
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* SECTION REPORTAGES VIDÉO VAKITA & PRÉPARATION DES VÊTEMENTS */}
                <section
                  id="reportages"
                  className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 shadow-soft-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-1 rounded-full">
                        FORMAT VAKITA • REPORTAGES & PRÉPARATION ATELIER
                      </span>
                      <h2 className="font-extrabold text-2xl sm:text-3xl mt-2.5 tracking-tight">
                        Du déchet déposé en Box jusqu'au vêtement du Pop-Up
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-[#FFEA00] bg-white/10 px-3.5 py-1.5 rounded-full">
                      3 immersions vidéo
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Lecteur principal avec vraie miniature photo */}
                    <div className="xl:col-span-7 bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between">
                      <div className="relative h-64 sm:h-72 overflow-hidden flex flex-col justify-between p-5">
                        <img
                          src={REPORTAGE_THUMBNAILS[activeReportage.id]}
                          alt={activeReportage.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-55 transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                        <div className="relative z-10 flex items-center justify-between">
                          <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-2.5 py-1 rounded-full">
                            {activeReportage.tag}
                          </span>
                          <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {activeReportage.duration} • {activeReportage.location}
                          </span>
                        </div>

                        <div className="relative z-10 my-auto flex flex-col items-center">
                          <button
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="w-16 h-16 rounded-full bg-[#FFEA00] text-[#111111] flex items-center justify-center shadow-lg hover:scale-105 transition"
                          >
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </button>
                          <span className="mt-2 text-xs font-bold text-[#FFEA00]">
                            {isPlayingVideo ? 'Lecture en cours...' : 'Regarder le reportage'}
                          </span>
                        </div>

                        <div className="relative z-10">
                          <h3 className="font-extrabold text-lg sm:text-xl text-white leading-snug">
                            {activeReportage.title}
                          </h3>
                          <p className="text-xs text-[#FFEA00] font-semibold mt-1">
                            {activeReportage.protagonists}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {activeReportage.summary}
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                          {activeReportage.keyStats.map((st, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                              <span className="font-extrabold text-lg text-[#FFEA00] block">
                                {st.value}
                              </span>
                              <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                                {st.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {activeReportage.steps.map((ch, idx) => (
                            <div
                              key={idx}
                              onClick={() => setIsPlayingVideo(true)}
                              className="flex items-center gap-3 text-xs bg-white/5 hover:bg-white/10 p-2.5 rounded-xl cursor-pointer transition"
                            >
                              <span className="font-bold text-[#FFEA00] shrink-0">{ch.time}</span>
                              <span className="text-zinc-200">{ch.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sélection des reportages + Double Circuit Solidaire */}
                    <div className="xl:col-span-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        {REPORTAGES_VIDEOS.map((rep) => {
                          const isSelected = rep.id === activeReportage.id;
                          return (
                            <button
                              key={rep.id}
                              onClick={() => {
                                setActiveReportage(rep);
                                setIsPlayingVideo(false);
                              }}
                              className={`w-full text-left p-4 rounded-2xl border transition ${
                                isSelected
                                  ? 'bg-[#FFEA00] text-[#111111] border-[#FFEA00]'
                                  : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] font-extrabold uppercase">
                                <span>{rep.tag}</span>
                                <span>{rep.duration}</span>
                              </div>
                              <h4 className="font-extrabold text-sm mt-1 leading-snug">
                                {rep.title}
                              </h4>
                              <p
                                className={`text-xs mt-1 ${
                                  isSelected ? 'text-zinc-800 font-medium' : 'text-zinc-400'
                                }`}
                              >
                                {rep.protagonists}
                              </p>
                            </button>
                          );
                        })}
                      </div>

                      <div className="bg-[#12354A] rounded-2xl p-5 text-white border border-white/10">
                        <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                          Circuit 100% Solidaire
                        </span>
                        <h4 className="font-extrabold text-base mt-2">
                          Que deviennent les vêtements déposés en Box ?
                        </h4>
                        <ul className="mt-2.5 space-y-2 text-xs text-zinc-200 leading-relaxed">
                          <li>
                            <strong className="text-[#FFEA00]">1. Dons directs :</strong> Les vêtements en bon état sont remis aux associations lilloises pour être redistribués gratuitement.
                          </li>
                          <li>
                            <strong className="text-[#FFEA00]">2. Upcycling & Merch :</strong> Les textiles usés, pneus et filets deviennent les pièces du Pop-Up, dont 100% des recettes financent ces mêmes associations.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION POP-UP ÉPHÉMÈRE LILLE SAINT-SAUVEUR */}
                <section
                  id="popup"
                  className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-soft"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-100">
                    <div>
                      <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-1 rounded-full">
                        SE RETROUVER • BOUTIQUE ÉPHÉMÈRE DANS LE 59
                      </span>
                      <h2 className="font-extrabold text-2xl sm:text-3xl text-[#111111] mt-2 tracking-tight">
                        Programme du Pop-Up « Seconde Maille »
                      </h2>
                    </div>
                    <div className="bg-[#F8F9FA] border border-zinc-200 px-4 py-2 rounded-full text-xs font-bold text-[#12354A]">
                      📍 Gare Saint-Sauveur — Halle B, Lille (59)
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {POPUP_SCHEDULE.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F8F9FA] rounded-2xl p-5 border border-zinc-200/70 flex flex-col justify-between hover:border-[#111111] transition"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="bg-[#FFEA00] text-[#111111] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                              {item.day}
                            </span>
                            <span className="text-zinc-500">{item.hours}</span>
                          </div>
                          <h3 className="font-extrabold text-base text-[#111111] mt-3">
                            {item.highlight}
                          </h3>
                          <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                            {item.details}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-zinc-200/80 text-[11px] font-bold text-[#12354A]">
                          Entrée libre • Collecte & Atelier Upcycling en direct
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* COLONNE DROITE STICKY : APPLICATION MOBILE INTERACTIVE */}
              {viewMode === 'split' && (
                <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                  <div className="mb-3 flex items-center justify-between bg-[#F8F9FA] border border-zinc-200/90 px-4 py-2.5 rounded-full">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#1F7A54] animate-ping" />
                      <span className="font-extrabold text-xs text-[#111111]">
                        Appli Mobile Seconde Maille
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-500">
                      Interactive • Testez GPS & QR
                    </span>
                  </div>

                  <MobileAppSimulator
                    userProfile={userProfile}
                    collectiveGoal={collectiveGoal}
                    onCompleteDeposit={handleCompleteDeposit}
                    selectedBoxId={selectedBoxId}
                    setSelectedBoxId={setSelectedBoxId}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* MODAL PRODUIT DÉTAILLÉ */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
      />

      {/* FOOTER ÉPURÉ SUR FOND BLANC */}
      <footer className="bg-[#F8F9FA] border-t border-zinc-200/80 mt-20 py-12 px-4 lg:px-10 text-[#111111]">
        <div className="max-w-[1560px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <CollabBadge size="sm" />
            <p className="text-xs text-zinc-500 leading-relaxed pt-1">
              Projet collaboratif « SECONDE MAILLE » unissant le média indépendant Vakita (Hugo Clément) et la marque d'accessoires upcyclés La Vie est Belt (Hubert Motte — Roubaix 59).
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-3">
              Les 5 Piliers
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-zinc-600">
              <li>Collecter — Box connectées GPS & QR</li>
              <li>Fabriquer — Atelier solidaire dans le 59</li>
              <li>Vendre — Pop-Up éphémère 100% associatif</li>
              <li>Se retrouver — Gare Saint-Sauveur Lille</li>
              <li>Raconter — Reportages & transparence</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-3">
              Matières Revalorisées
            </h4>
            <ul className="space-y-1.5 text-xs font-medium text-zinc-600">
              <li>• Filets de pêche fantômes (Vaquita / Vakita)</li>
              <li>• Pneus de vélo & chambres à air (La Vie est Belt)</li>
              <li>• Vêtements de seconde main collectés en Box</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80">
            <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase">
              Zéro commande en ligne
            </span>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Ce site présente les pièces, leur traçabilité et les stocks par taille en direct, sans expédition e-commerce.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
