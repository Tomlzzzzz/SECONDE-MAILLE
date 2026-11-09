import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  QrCode,
  Trophy,
  User,
  CheckCircle2,
  Compass,
  Bike,
  Footprints,
  Flame,
  Gift,
  Camera,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';
import { VakitaLogo, LaVieEstBeltLogo } from './BrandLogos';
import {
  DONATION_BOXES,
  DEPOSIT_PRESETS,
  LEAGUES_DATA,
  WEIGHT_POINT_BRACKETS,
  calculatePointsFromWeight
} from '../data/mockData';

export default function MobileAppSimulator({
  userProfile,
  collectiveGoal,
  onCompleteDeposit,
  selectedBoxId,
  setSelectedBoxId,
  isFullscreenMobile = false
}) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'scan' | 'leagues' | 'profile'
  const [geoStatus, setGeoStatus] = useState('prompt'); // 'prompt' | 'locating' | 'granted'
  const [userCoords, setUserCoords] = useState({
    lat: 50.6845,
    lng: 3.1740,
    label: "Métropole Lilloise — Roubaix (59)"
  });
  const [showRouteDrawer, setShowRouteDrawer] = useState(true);
  const [transportMode, setTransportMode] = useState('bike'); // 'bike' | 'walk'

  // États du dépôt & pesée par la Box avant le scan du QR Code
  const [depositWeightKg, setDepositWeightKg] = useState(1.8);
  const [depositContentLabel, setDepositContentLabel] = useState("2 Pneus de vélo + Vêtements coton");
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'success'
  const [lastReward, setLastReward] = useState(null);

  const selectedBox = DONATION_BOXES.find((b) => b.id === selectedBoxId) || DONATION_BOXES[0];

  // Calcul dynamique des points proportionnels au poids mesuré par la Box
  const weightCalculation = calculatePointsFromWeight(depositWeightKg);

  // Code QR dynamique généré par l'écran de la Box (contient ID Box + Poids mesuré)
  const generatedBoxQrPayload = `${selectedBox.id}|W:${weightCalculation.weightKg}KG|PTS:${weightCalculation.totalPoints}`;

  const handleRequestGeolocation = () => {
    setGeoStatus('locating');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: "Position GPS Active (Précision 6m)"
          });
          setGeoStatus('granted');
        },
        () => {
          setTimeout(() => {
            setUserCoords({
              lat: 50.6845,
              lng: 3.1740,
              label: "Lille / Roubaix (59) — GPS Actif"
            });
            setGeoStatus('granted');
          }, 500);
        },
        { timeout: 2200 }
      );
    } else {
      setTimeout(() => {
        setGeoStatus('granted');
      }, 500);
    }
  };

  const handleTriggerScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      const calc = calculatePointsFromWeight(depositWeightKg);
      const rewardData = {
        code: generatedBoxQrPayload,
        title: `${depositContentLabel} (${calc.weightKg} kg pesés)`,
        category: calc.bracket.tierName,
        weightKg: calc.weightKg,
        points: calc.totalPoints,
        basePoints: calc.basePoints,
        bonusPoints: calc.bonusPoints,
        bracketLabel: calc.bracket.rangeLabel,
        co2SavedKg: +(calc.weightKg * 3.8).toFixed(1),
        futureProduct:
          calc.weightKg >= 2.5
            ? "Hoodie 'Seconde Maille' + Ceinture Vaquita 59"
            : calc.weightKg >= 1.0
            ? "Ceinture 'Vaquita 59' & Bob Réversible"
            : "Porte-clés Pneu & Filet Zéro Chute",
        boxName: selectedBox.name,
        boxId: selectedBox.id,
        boxAddress: selectedBox.address,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setLastReward(rewardData);
      setScanState('success');
      onCompleteDeposit(rewardData);
    }, 1300);
  };

  const progressPercentage = Math.min(
    100,
    Math.round((collectiveGoal.currentKg / collectiveGoal.targetKg) * 100)
  );
  const isGoalReached = collectiveGoal.currentKg >= collectiveGoal.targetKg;

  // Position du curseur sur la frise (de 0 à 6 kg max sur la jauge visuelle)
  const timelineCursorPercent = Math.min(98, Math.max(4, Math.round((weightCalculation.weightKg / 6.0) * 100)));

  return (
    <div
      className={`flex flex-col bg-white text-[#111111] rounded-[42px] overflow-hidden shadow-phone border-[8px] border-[#111111] transition-all duration-300 ${
        isFullscreenMobile
          ? 'w-full max-w-[430px] mx-auto h-[860px]'
          : 'w-full max-w-[410px] mx-auto h-[810px]'
      }`}
    >
      {/* En-tête Smartphone épuré sur fond blanc */}
      <div className="bg-white px-5 pt-3 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 mb-2.5">
          <span>12:42</span>
          <div className="w-24 h-5 bg-[#111111] rounded-full flex items-center justify-center gap-1.5 px-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFEA00] animate-ping" />
            <span className="text-[9px] font-bold text-white tracking-wider">59 LIVE</span>
          </div>
          <span className="text-[#111111] font-bold">{userProfile.points} pts</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <VakitaLogo size="sm" yellowBox={true} />
            <span className="text-zinc-400 text-xs font-bold">×</span>
            <LaVieEstBeltLogo size="sm" variant="yellow" />
          </div>

          <button
            onClick={() => setActiveTab('leagues')}
            className="flex items-center gap-1 bg-zinc-100 hover:bg-[#FFEA00] text-[#111111] px-2.5 py-1 rounded-full text-[11px] font-bold transition"
          >
            <Flame className="w-3.5 h-3.5 text-[#E85D3F]" />
            <span>{progressPercentage}% Cagnotte</span>
          </button>
        </div>
      </div>

      {/* Mini Jauge Collective Solidaire */}
      <div className="bg-[#F8F9FA] px-4 py-2 border-b border-zinc-200/80 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-bold text-zinc-600">
            <span>Objectif 2 500 kg → 15 000 € Assos</span>
            <span className="text-[#111111]">{collectiveGoal.currentKg.toFixed(1)} kg</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-[#FFEA00] transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <span className="bg-[#FFEA00] text-[#111111] text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
          {isGoalReached ? 'DÉBLOQUÉ' : '+15 000 €'}
        </span>
      </div>

      {/* Contenu Principal de l'Application */}
      <div className="flex-1 overflow-y-auto bg-white flex flex-col">
        {/* ONGLET 1 : CARTE & LOCALISATION DES BOX */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col">
            {geoStatus !== 'granted' && (
              <div className="m-3 p-3.5 rounded-2xl bg-[#F8F9FA] border border-zinc-200/90 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFEA00] flex items-center justify-center shrink-0">
                    <Compass
                      className={`w-5 h-5 text-[#111111] ${geoStatus === 'locating' ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                      Géolocalisation Box 59
                    </span>
                    <h4 className="font-bold text-xs text-[#111111] mt-0.5">
                      Autoriser la localisation pour trouver la Box la plus proche
                    </h4>
                    <button
                      onClick={handleRequestGeolocation}
                      className="mt-2 w-full bg-[#111111] hover:bg-[#12354A] text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FFEA00]" />
                      {geoStatus === 'locating'
                        ? 'Recherche des Box autour de vous...'
                        : 'Activer ma position GPS'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Carte Interactive Claire */}
            <div className="relative h-56 bg-[#F1F3F5] border-b border-zinc-200 overflow-hidden select-none">
              <svg viewBox="0 0 400 230" className="w-full h-full object-cover">
                <path d="M 0 0 L 120 0 L 90 85 L 0 60 Z" fill="#E6F4EA" />
                <path d="M 270 140 L 400 120 L 400 230 L 250 230 Z" fill="#E6F4EA" />
                <path
                  d="M 0 175 Q 140 145 255 105 T 400 40"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path d="M 30 230 L 180 115 L 345 55" fill="none" stroke="#FFFFFF" strokeWidth="8" />
                <path d="M 10 65 L 205 125 L 385 195" fill="none" stroke="#FFFFFF" strokeWidth="7" />
                <path d="M 120 0 L 165 230" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                <path d="M 280 0 L 245 230" fill="none" stroke="#FFFFFF" strokeWidth="5" />

                <path
                  d={
                    selectedBox.id === 'BOX-59-RBX-01'
                      ? 'M 200 115 Q 230 95 255 78'
                      : selectedBox.id === 'BOX-59-LIL-02'
                      ? 'M 200 115 Q 160 125 118 140'
                      : selectedBox.id === 'BOX-59-LIL-03'
                      ? 'M 200 115 Q 170 150 145 175'
                      : 'M 200 115 Q 250 135 295 152'
                  }
                  fill="none"
                  stroke="#111111"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                <path
                  d={
                    selectedBox.id === 'BOX-59-RBX-01'
                      ? 'M 200 115 Q 230 95 255 78'
                      : selectedBox.id === 'BOX-59-LIL-02'
                      ? 'M 200 115 Q 160 125 118 140'
                      : selectedBox.id === 'BOX-59-LIL-03'
                      ? 'M 200 115 Q 170 150 145 175'
                      : 'M 200 115 Q 250 135 295 152'
                  }
                  fill="none"
                  stroke="#FFEA00"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                />

                <text x="235" y="42" fill="#71717A" fontSize="8.5" fontWeight="700" letterSpacing="0.06em">
                  ROUBAIX (59)
                </text>
                <text x="28" y="122" fill="#71717A" fontSize="8.5" fontWeight="700" letterSpacing="0.06em">
                  LILLE FLANDRES
                </text>
                <text x="58" y="208" fill="#71717A" fontSize="8.5" fontWeight="700" letterSpacing="0.06em">
                  GARE ST-SAUVEUR
                </text>
                <text x="275" y="182" fill="#71717A" fontSize="8.5" fontWeight="700" letterSpacing="0.06em">
                  CAMPUS 4 CANTONS
                </text>
              </svg>

              <div
                className="absolute left-[50%] top-[49%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
                title="Votre position"
              >
                <div className="relative w-4 h-4 rounded-full bg-[#12354A] border-2 border-white shadow-md gps-ring" />
                <span className="bg-[#111111] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 shadow-xs">
                  Vous
                </span>
              </div>

              {[
                { box: DONATION_BOXES[0], left: '64%', top: '33%' },
                { box: DONATION_BOXES[1], left: '29%', top: '59%' },
                { box: DONATION_BOXES[2], left: '36%', top: '75%' },
                { box: DONATION_BOXES[4], left: '74%', top: '65%' }
              ].map(({ box, left, top }) => {
                const isSelected = selectedBox.id === box.id;
                return (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBoxId(box.id)}
                    style={{ left, top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-md transition ${
                        isSelected
                          ? 'bg-[#FFEA00] text-[#111111] ring-2 ring-[#111111]'
                          : box.status === 'POP-UP LIVE'
                          ? 'bg-[#111111] text-[#FFEA00]'
                          : 'bg-white text-[#111111] border border-zinc-200'
                      }`}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{box.distanceKm} km</span>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-2.5 left-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-zinc-200/80 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-zinc-700 truncate">{userCoords.label}</span>
                <span className="font-extrabold text-[#12354A] shrink-0 ml-2">
                  {DONATION_BOXES.length} Box proches
                </span>
              </div>
            </div>

            {/* Détails de la Box sélectionnée */}
            <div className="p-4 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#FFEA00] text-[#111111] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {selectedBox.bonusMultiplier}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-400">
                      {selectedBox.id}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111] mt-1">
                    {selectedBox.name}
                  </h3>
                  <p className="text-xs text-zinc-500">{selectedBox.address}</p>
                </div>

                <div className="text-right bg-[#F8F9FA] border border-zinc-200 rounded-2xl px-3 py-1.5 shrink-0">
                  <div className="font-extrabold text-sm text-[#111111]">
                    {selectedBox.distanceKm} km
                  </div>
                  <div className="text-[10px] font-semibold text-[#12354A]">
                    {transportMode === 'bike'
                      ? `${selectedBox.bikeMinutes} min à vélo`
                      : `${selectedBox.walkMinutes} min à pied`}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="inline-flex bg-zinc-100 p-1 rounded-xl">
                  <button
                    onClick={() => setTransportMode('bike')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                      transportMode === 'bike'
                        ? 'bg-white text-[#111111] shadow-2xs'
                        : 'text-zinc-500'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    Vélo ({selectedBox.bikeMinutes}m)
                  </button>
                  <button
                    onClick={() => setTransportMode('walk')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                      transportMode === 'walk'
                        ? 'bg-white text-[#111111] shadow-2xs'
                        : 'text-zinc-500'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    Piéton ({selectedBox.walkMinutes}m)
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-zinc-500 block">
                    Disponibilité Box : {100 - selectedBox.fillPercent}% libre
                  </span>
                  <div className="w-24 h-1.5 bg-zinc-100 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-[#1F7A54] rounded-full"
                      style={{ width: `${selectedBox.fillPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 bg-[#F8F9FA] rounded-2xl p-3 border border-zinc-200/70">
                <button
                  onClick={() => setShowRouteDrawer(!showRouteDrawer)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#111111]"
                >
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#12354A]" />
                    Itinéraire conseillé ({selectedBox.distanceKm} km)
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {showRouteDrawer ? 'Masquer' : 'Afficher'}
                  </span>
                </button>

                {showRouteDrawer && (
                  <ol className="mt-2.5 space-y-1.5 border-t border-zinc-200/80 pt-2 text-[11px] text-zinc-700">
                    {selectedBox.directionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#FFEA00] text-[#111111] font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <button
                onClick={() => {
                  setScanState('idle');
                  setActiveTab('scan');
                }}
                className="mt-3.5 w-full bg-[#FFEA00] hover:bg-[#f5e000] text-[#111111] font-extrabold text-xs py-3 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <QrCode className="w-4 h-4" />
                J'ai déposé mes articles → Scanner le QR Box
              </button>
            </div>
          </div>
        )}

        {/* ONGLET 2 : DÉPÔT PESÉ PAR LA BOX + SCAN QR + FRISE DES FOURCHETTES DE POIDS */}
        {activeTab === 'scan' && (
          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              {/* Étape 1 : Ce qui se passe sur la Box après le dépôt */}
              <div className="bg-[#F8F9FA] border border-zinc-200 rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <span className="bg-[#111111] text-[#FFEA00] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                    1. Balance connectée de la Box
                  </span>
                  <span className="text-[10px] font-bold text-[#12354A]">{selectedBox.id}</span>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1 leading-snug">
                  Après fermeture de la trappe, la Box pèse votre dépôt et génère un <strong>QR Code unique</strong> contenant l'identité de la Box et le poids exact :
                </p>

                {/* Curseur pour tester différents poids de dépôt dans la Box */}
                <div className="mt-2.5 bg-white rounded-xl p-2.5 border border-zinc-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-700 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#12354A]" />
                      Poids pesé dans la Box :
                    </span>
                    <span className="bg-[#FFEA00] text-[#111111] font-extrabold px-2.5 py-0.5 rounded-full text-xs">
                      {weightCalculation.weightKg.toFixed(1)} kg → +{weightCalculation.totalPoints} pts
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.2"
                    max="6.0"
                    step="0.1"
                    value={depositWeightKg}
                    onChange={(e) => {
                      setDepositWeightKg(parseFloat(e.target.value));
                      setScanState('idle');
                    }}
                    className="w-full mt-2 accent-[#111111] cursor-pointer h-1.5 bg-zinc-200 rounded-lg"
                  />

                  {/* Boutons de poids rapides */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {[
                      { w: 0.6, label: "0.6 kg (T-shirt / Chambre à air)" },
                      { w: 1.8, label: "1.8 kg (2 Pneus + Jean)" },
                      { w: 3.4, label: "3.4 kg (Sac de vêtements)" },
                      { w: 5.2, label: "5.2 kg (Maxi lot Filets & Habits)" }
                    ].map((preset) => (
                      <button
                        key={preset.w}
                        onClick={() => {
                          setDepositWeightKg(preset.w);
                          setDepositContentLabel(preset.label.split('(')[1].replace(')', ''));
                          setScanState('idle');
                        }}
                        className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border transition ${
                          Math.abs(depositWeightKg - preset.w) < 0.05
                            ? 'bg-[#111111] text-[#FFEA00] border-[#111111]'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        {preset.w} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* FRISE VISUELLE DES POINTS SELON LES FOURCHETTES DE POIDS */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-3 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#E85D3F]" />
                    Frise des Points selon les fourchettes de poids
                  </span>
                  <span className="text-[10px] font-bold text-[#12354A]">
                    100 à 130 pts/kg + Bonus
                  </span>
                </div>

                {/* Barre de la Frise graduée avec curseur dynamique */}
                <div className="relative pt-1 pb-2">
                  <div className="grid grid-cols-4 gap-1 h-2.5 rounded-full overflow-hidden bg-zinc-100 p-0.5">
                    {WEIGHT_POINT_BRACKETS.map((b) => {
                      const active = weightCalculation.bracket.id === b.id;
                      return (
                        <div
                          key={b.id}
                          className={`h-full rounded-full transition-colors ${
                            active ? 'bg-[#FFEA00]' : 'bg-zinc-300/70'
                          }`}
                        />
                      );
                    })}
                  </div>
                  {/* Marqueur du poids actuel sur la frise */}
                  <div
                    className="absolute top-0 -translate-x-1/2 transition-all duration-200"
                    style={{ left: `${timelineCursorPercent}%` }}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-[#111111] border-2 border-[#FFEA00] shadow-xs" />
                  </div>
                </div>

                {/* Les 4 Fourchettes de Poids de la Frise */}
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {WEIGHT_POINT_BRACKETS.map((bracket) => {
                    const isCurrent = weightCalculation.bracket.id === bracket.id;
                    return (
                      <button
                        key={bracket.id}
                        onClick={() => {
                          const midWeight = +((bracket.minKg + Math.min(bracket.maxKg, 6.0)) / 2).toFixed(1);
                          setDepositWeightKg(midWeight);
                          setScanState('idle');
                        }}
                        className={`text-left p-2 rounded-xl border transition ${
                          isCurrent
                            ? 'bg-[#FFEA00]/30 border-[#111111] ring-1 ring-[#111111]'
                            : 'bg-[#F8F9FA] border-zinc-200/80 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#111111]">
                            {bracket.rangeLabel}
                          </span>
                          {bracket.bonusPoints > 0 && (
                            <span className="bg-[#111111] text-[#FFEA00] text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full">
                              +{bracket.bonusPoints} bonus
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-extrabold text-[#12354A] mt-0.5">
                          {bracket.pointsRange}
                        </div>
                        <div className="text-[9.5px] text-zinc-500 leading-tight mt-0.5 truncate">
                          {bracket.examples}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Étape 2 : Viseur Caméra qui scanne le QR Code de la Box et décode Box + Poids */}
              <div className="relative h-44 bg-[#111111] rounded-3xl overflow-hidden flex flex-col items-center justify-center text-white shadow-inner p-3">
                {scanState !== 'success' ? (
                  <>
                    <div className="scanner-beam" />
                    <div className="w-24 h-24 rounded-2xl border-2 border-[#FFEA00]/90 relative flex items-center justify-center bg-white/5 backdrop-blur-xs">
                      <QrCode
                        className={`w-14 h-14 text-[#FFEA00] transition-transform ${
                          scanState === 'scanning' ? 'scale-90 opacity-60 animate-pulse' : ''
                        }`}
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-[10px] font-extrabold text-[#FFEA00] block tracking-wider">
                        {scanState === 'scanning'
                          ? 'Décodage des infos de la Box & du poids...'
                          : `QR Box : ${generatedBoxQrPayload}`}
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Box : {selectedBox.name} • Poids transmis : {weightCalculation.weightKg} kg
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center w-full h-full flex flex-col items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-[#FFEA00] text-[#111111] flex items-center justify-center mb-1.5">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-0.5 rounded-full">
                      +{lastReward.points} POINTS RÉCUPÉRÉS !
                    </span>
                    <div className="text-[11px] font-bold text-white mt-1.5">
                      Box : {lastReward.boxName} ({lastReward.boxId})
                    </div>
                    <div className="text-[10px] text-zinc-300 mt-0.5">
                      Poids mesuré : <strong>{lastReward.weightKg} kg</strong> ({lastReward.bracketLabel}) → {lastReward.basePoints} pts + {lastReward.bonusPoints} pts bonus
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={scanState === 'scanning'}
              className="w-full bg-[#111111] hover:bg-[#12354A] text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition shrink-0"
            >
              <Camera className="w-4 h-4 text-[#FFEA00]" />
              {scanState === 'scanning'
                ? 'Lecture du QR Box & Poids...'
                : scanState === 'success'
                ? 'Scanner un nouveau dépôt pesé'
                : `Scanner le QR de la Box (${weightCalculation.weightKg} kg = +${weightCalculation.totalPoints} pts)`}
            </button>
          </div>
        )}

        {/* ONGLET 3 : LIGUES SOLIDAIRES & CAGNOTTE */}
        {activeTab === 'leagues' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#111111] text-white p-4 rounded-3xl">
              <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Cagnotte Solidaire Vakita × La Vie est Belt
              </span>
              <h3 className="font-extrabold text-base mt-2 text-white">
                Objectif 2 500 kg = <span className="text-[#FFEA00]">15 000 € reversés</span> par les 2 marques
              </h3>
              <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                Dès que le compteur collectif atteint 2 500 kg, Vakita et La Vie est Belt versent 15 000 € supplémentaires aux associations Sea Shepherd et AlterEos (59).
              </p>

              <div className="mt-3 bg-white/10 p-3 rounded-2xl">
                <div className="flex justify-between text-xs font-bold text-[#FFEA00]">
                  <span>Progression collective</span>
                  <span>
                    {collectiveGoal.currentKg.toFixed(1)} / {collectiveGoal.targetKg} kg
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#FFEA00] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-2.5">
                Classement des Ligues Donateurs (59)
              </h4>
              <div className="space-y-2">
                {LEAGUES_DATA.map((league) => (
                  <div
                    key={league.rank}
                    className={`p-3 rounded-2xl border ${
                      league.isUserLeague
                        ? 'bg-[#FFEA00]/25 border-[#111111]'
                        : 'bg-white border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-[#111111] text-[#FFEA00] font-extrabold text-xs flex items-center justify-center">
                          {league.rank}
                        </span>
                        <div>
                          <div className="font-bold text-xs text-[#111111]">{league.name}</div>
                          <div className="text-[10px] text-zinc-500">
                            {league.members} donateurs • {league.totalKg} kg collectés
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-xs text-[#111111]">
                          {league.points} pts
                        </div>
                        <div className="text-[10px] font-semibold text-[#1F7A54]">
                          {league.trend}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 4 : PROFIL DONATEUR */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <div className="bg-[#F8F9FA] border border-zinc-200 rounded-3xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFEA00] text-[#111111] flex items-center justify-center font-extrabold text-base">
                    CA
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#12354A] block">
                      {userProfile.level}
                    </span>
                    <h4 className="font-extrabold text-base text-[#111111]">{userProfile.name}</h4>
                    <p className="text-[11px] text-zinc-500">{userProfile.league}</p>
                  </div>
                </div>
                <div className="text-right bg-white border border-zinc-200 px-3 py-1.5 rounded-2xl">
                  <span className="font-extrabold text-base text-[#111111] block leading-none">
                    {userProfile.points}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase">Points</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-zinc-200/80 text-center">
                <div className="bg-white p-2 rounded-xl border border-zinc-100">
                  <span className="text-xs font-extrabold text-[#111111] block">
                    {userProfile.totalKg.toFixed(1)} kg
                  </span>
                  <span className="text-[9px] text-zinc-500">Collectés</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-zinc-100">
                  <span className="text-xs font-extrabold text-[#111111] block">
                    {userProfile.co2Saved.toFixed(1)} kg
                  </span>
                  <span className="text-[9px] text-zinc-500">CO₂ évité</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-zinc-100">
                  <span className="text-xs font-extrabold text-[#111111] block">
                    {userProfile.history.length}
                  </span>
                  <span className="text-[9px] text-zinc-500">Dépôts QR</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFEA00] rounded-3xl p-4 text-[#111111]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#111111] text-white px-2.5 py-0.5 rounded-full">
                  Pass Avantages Pop-Up Lille
                </span>
                <Gift className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold mt-2">
                Présentez ce QR Pass à la Boutique Éphémère (Gare Saint-Sauveur) :
              </p>
              <ul className="text-[11px] space-y-1 mt-1.5 font-medium">
                <li>• <strong>180 pts</strong> : Porte-clés Pneu & Filet gravé en direct</li>
                <li>• <strong>350 pts</strong> : Accès prioritaire aux séries limitées</li>
                <li>• <strong>600 pts</strong> : Bon solidaire Pop-Up (100% reversé aux assos)</li>
              </ul>
            </div>

            <div>
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-2">
                Derniers dépôts scannés (Box + Poids)
              </h5>
              <div className="space-y-2">
                {userProfile.history.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-zinc-200 rounded-2xl p-3 text-xs"
                  >
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold">
                      <span>{item.boxName}</span>
                      <span className="bg-[#FFEA00] text-[#111111] font-extrabold px-2 py-0.5 rounded-full">
                        +{item.points} pts
                      </span>
                    </div>
                    <div className="font-bold text-[#111111] mt-1">{item.title}</div>
                    <div className="text-[11px] text-[#12354A] font-medium mt-0.5">
                      Transformé en : {item.futureProduct}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barre de Navigation Mobile */}
      <div className="bg-white border-t border-zinc-100 grid grid-cols-4 py-2 px-3">
        {[
          { id: 'map', label: 'Box GPS', icon: MapPin },
          { id: 'scan', label: 'Scan & Poids', icon: QrCode },
          { id: 'leagues', label: 'Ligues', icon: Trophy },
          { id: 'profile', label: 'Profil', icon: User }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-2xl transition ${
                active
                  ? 'bg-[#FFEA00] text-[#111111] font-extrabold'
                  : 'text-zinc-400 hover:text-[#111111]'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
