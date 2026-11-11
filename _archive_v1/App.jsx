import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Package,
  Store,
  Tv,
  HeartHandshake,
  ShieldCheck,
  Award,
  Play,
  Compass,
  Clock,
  Eye,
  Layers,
  Recycle,
  Users,
  Accessibility,
  Calendar,
  Train,
  Bike,
  Car,
  Info,
  Mail,
  FileText,
  Scale,
  Lock,
  X,
  Volume2
} from 'lucide-react';
import {
  CollabBadge,
  VakitaLogo,
  LaVieEstBeltLogo
} from './components/BrandLogos';
import MobileAppSimulator from './components/MobileAppSimulator';
import ProductVisual from './components/ProductVisual';
import ProductDetailModal from './components/ProductDetailModal';
import {
  BRAND_PILLARS,
  PRODUCTS,
  BOX_EXPERIENCE_STEPS,
  POPUP_BOUTIQUES,
  VAKITA_REPORTAGES
} from './data/mockData';

const SITE_PAGES = [
  { id: 'accueil', label: '1. Le Concept', short: 'Accueil', icon: Compass },
  { id: 'marques', label: '2. Les 2 Marques', short: 'Marques', icon: HeartHandshake },
  { id: 'appli-box', label: '3. Box & Appli', short: 'Box & App', icon: Smartphone },
  { id: 'popup-merch', label: '4. Pop-Up & Merch', short: 'Pop-Up & Merch', icon: Store },
  { id: 'reportages', label: '5. Reportages', short: 'Vakita TV', icon: Tv }
];

const LILLE_EVENT_DETAILS = {
  title: 'Pop-Up Store Officiel — Seconde Maille Lille',
  venue: 'Gare Saint-Sauveur — Halle B (Espace Culturel & Solidaire)',
  address: '17 Boulevard Jean-Baptiste Lebas, 59800 Lille',
  gps: '50.6279° N, 3.0706° E',
  dates: 'Vendredi 14, Samedi 15 & Dimanche 16 Novembre 2026',
  entry: 'Entrée libre & gratuite • Accessible PMR (Plain-pied & Boucle magnétique)',
  schedule: [
    {
      day: 'Vendredi 14 Nov.',
      hours: '14h00 – 21h00',
      highlight: 'Ouverture & Inauguration dès 18h30 avec Hugo Clément et Hubert Motte'
    },
    {
      day: 'Samedi 15 Nov.',
      hours: '10h00 – 22h00',
      highlight: 'Atelier gravure à chaud en direct + Projection documentaire Vakita à 17h00'
    },
    {
      day: 'Dimanche 16 Nov.',
      hours: '10h00 – 19h00',
      highlight: 'Rencontre avec les artisans de l’ESAT de Tourcoing & collecte solidaire'
    }
  ],
  transports: [
    {
      id: 'metro',
      mode: 'Métro & Train',
      icon: Train,
      title: 'Ligne 2 — Arrêt Lille Grand Palais ou Mairie de Lille',
      details: 'À 4 minutes à pied de la Gare Saint-Sauveur. Gares Lille Flandres (12 min à pied) et Lille Europe (16 min).'
    },
    {
      id: 'velo',
      mode: 'V’Lille & Vélo',
      icon: Bike,
      title: 'Station V’Lille n°24 (Boulevard Jean-Baptiste Lebas)',
      details: '36 bornes disponibles juste devant l’entrée du parc Jean-Baptiste Lebas + parking vélos cargos sécurisé dans la cour.'
    },
    {
      id: 'acces',
      mode: 'Accès PMR & Voiture',
      icon: Car,
      title: 'Dépose-minute PMR & Parking République / Liberté',
      details: '2 places PMR réservées au 17 Bd J-B Lebas. Rampes d’accès sans seuil, signalétique braille/contraste élevé et comptoir abaissé.'
    }
  ],
  servicesOnSite: [
    'Essayage des 4 pièces de la collection (Ceinture, Bob, Sacoche, Porte-clés)',
    'Ajustement sur-mesure de votre ceinture et gravure à chaud offerte avec le QR code de votre Box',
    'Validation du Pass Impact sur l’application (+200 points crédités sur place)',
    'Point de collecte citoyen : déposez vos pneus de vélo ou chambres à air usagés'
  ]
};

/**
 * Composant ScrollReveal : Anime les blocs lors du défilement de la page
 */
function ScrollReveal({ children, direction = 'up', delay = 0, className = '' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass =
    direction === 'left'
      ? 'reveal-left'
      : direction === 'right'
      ? 'reveal-right'
      : 'reveal-up';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-base ${dirClass} ${isVisible ? 'reveal-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('accueil');
  const [pageSlideDir, setPageSlideDir] = useState('right');
  const prevPageRef = useRef('accueil');

  const [appTab, setAppTab] = useState('accueil');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeTransport, setActiveTransport] = useState('metro');
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  // États Accessibilité RGAA 4.1 / WCAG 2.1 AA
  const [a11yOpen, setA11yOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexicSpacing, setDyslexicSpacing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [legalModal, setLegalModal] = useState(null); // 'mentions' | 'rgaa' | 'confidentialite' | 'charte'
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-large-text', largeText);
    root.classList.toggle('a11y-dyslexic-spacing', dyslexicSpacing);
    root.classList.toggle('a11y-reduce-motion', reduceMotion);
  }, [largeText, dyslexicSpacing, reduceMotion]);

  const navigateToPage = (pageId) => {
    const prevIdx = SITE_PAGES.findIndex((p) => p.id === prevPageRef.current);
    const nextIdx = SITE_PAGES.findIndex((p) => p.id === pageId);
    if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
      setPageSlideDir(nextIdx > prevIdx ? 'right' : 'left');
    }
    prevPageRef.current = pageId;
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  const openAppOnTab = (tabId) => {
    setAppTab(tabId);
    navigateToPage('appli-box');
  };

  const currentPageIndex = SITE_PAGES.findIndex((p) => p.id === activePage);
  const prevPage = currentPageIndex > 0 ? SITE_PAGES[currentPageIndex - 1] : null;
  const nextPage =
    currentPageIndex < SITE_PAGES.length - 1 ? SITE_PAGES[currentPageIndex + 1] : null;

  const tickerItems = [
    { badge: 'COLLABORATION OFFICIELLE', text: 'VAKITA × LA VIE EST BELT — COLLECTION « SECONDE MAILLE »' },
    { badge: '100% SOLIDAIRE', text: '100% DES BÉNÉFICES REVERSÉS AUX ASSOCIATIONS DE DÉPOLLUTION MARINE' },
    { badge: 'POP-UP STORE LILLE', text: 'GARE SAINT-SAUVEUR (HALLE B) • 14 AU 16 NOVEMBRE • ENTRÉE LIBRE' },
    { badge: 'MADE IN HAUTS-DE-FRANCE', text: 'FILETS DE PÊCHE RECYCLÉS À BOULOGNE-SUR-MER & FAÇONNÉS EN ESAT À TOURCOING' }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-white text-[#0F2926] selection:bg-[#bae3d1] selection:text-[#0F2926] flex flex-col">
      {/* ==================== LIEN D'ÉVITEMENT RGAA (SKIP LINK) ==================== */}
      <a href="#main-content" className="skip-link">
        Aller directement au contenu principal
      </a>

      {/* ==================== TOP SOLIDARITY BANNER (PARFAITEMENT ALIGNÉ EN CONTINU) ==================== */}
      <div
        role="region"
        aria-label="Annonces officielles de la collaboration"
        className="bg-[#0F2926] text-white h-10 border-b border-[#1c423d] overflow-hidden flex items-center"
      >
        <div className="animate-ticker flex items-center">
          {[0, 1].map((dupIndex) => (
            <div
              key={dupIndex}
              aria-hidden={dupIndex === 1 ? 'true' : undefined}
              className="flex items-center shrink-0"
            >
              {tickerItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 px-7 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#bae3d1] text-[#0F2926] font-extrabold text-[10px] tracking-wider uppercase shrink-0">
                    {item.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-200 tracking-wide">
                    {item.text}
                  </span>
                  <span className="text-[#bae3d1]/50 text-xs pl-2" aria-hidden="true">
                    •
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ==================== STICKY MULTI-PAGE HEADER ==================== */}
      <header
        role="banner"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <button
            onClick={() => navigateToPage('accueil')}
            aria-label="Retour à l'accueil Seconde Maille (Vakita x La Vie est Belt)"
            className="text-left focus:outline-none group"
          >
            <CollabBadge />
          </button>

          {/* Multi-Page Navigation Pills */}
          <nav
            role="navigation"
            aria-label="Navigation principale (5 pages)"
            className="hidden lg:flex items-center gap-1.5 bg-[#F4FBF8] p-1.5 rounded-full border border-[#bae3d1]/60"
          >
            {SITE_PAGES.map((page) => {
              const Icon = page.icon;
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(page.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0F2926] text-[#bae3d1] shadow-sm scale-[1.02]'
                      : 'text-slate-600 hover:text-[#0F2926] hover:bg-[#bae3d1]/35'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {page.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons + Accessibility Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setA11yOpen((prev) => !prev)}
              aria-expanded={a11yOpen}
              aria-controls="a11y-toolbar"
              title="Options d'accessibilité RGAA (Taille du texte, espacement dyslexie, animations)"
              className={`px-3 py-2.5 rounded-full text-xs font-extrabold border transition flex items-center gap-1.5 ${
                a11yOpen || largeText || dyslexicSpacing || reduceMotion
                  ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                  : 'bg-[#F8FCFA] text-[#0F2926] border-[#bae3d1] hover:bg-[#bae3d1]/40'
              }`}
            >
              <Accessibility className="w-4 h-4" aria-hidden="true" />
              <span className="hidden xl:inline">Accessibilité</span>
            </button>

            <button
              onClick={() => navigateToPage('popup-merch')}
              className="interactive-slide-btn px-4 py-2.5 rounded-full bg-[#bae3d1] text-[#0F2926] font-extrabold text-xs tracking-wide hover:bg-[#a5d8c2] transition flex items-center gap-1.5 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Pop-Up Lille (14-16 Nov)</span>
              <span className="sm:hidden">Pop-Up</span>
            </button>
          </div>
        </div>

        {/* Barre d'outils d'accessibilité RGAA dépliable */}
        {a11yOpen && (
          <div
            id="a11y-toolbar"
            role="region"
            aria-label="Paramètres de confort visuel et d'accessibilité"
            className="bg-[#F2FBF7] border-t border-[#bae3d1] px-4 py-3"
          >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F2926]">
                <Accessibility className="w-4 h-4 text-[#0F2926]" aria-hidden="true" />
                <span>Confort de lecture & Accessibilité (RGAA 4.1 / WCAG AA) :</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setLargeText((v) => !v)}
                  aria-pressed={largeText}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                    largeText
                      ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                      : 'bg-white text-[#0F2926] border-slate-300 hover:border-[#0F2926]'
                  }`}
                >
                  Texte agrandi (+12%) {largeText ? '✓' : ''}
                </button>
                <button
                  onClick={() => setDyslexicSpacing((v) => !v)}
                  aria-pressed={dyslexicSpacing}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                    dyslexicSpacing
                      ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                      : 'bg-white text-[#0F2926] border-slate-300 hover:border-[#0F2926]'
                  }`}
                >
                   confort Dyslexie / Interlignage {dyslexicSpacing ? '✓' : ''}
                </button>
                <button
                  onClick={() => setReduceMotion((v) => !v)}
                  aria-pressed={reduceMotion}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
                    reduceMotion
                      ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                      : 'bg-white text-[#0F2926] border-slate-300 hover:border-[#0F2926]'
                  }`}
                >
                  Réduire les animations {reduceMotion ? '✓' : ''}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Page Switcher Bar */}
        <div className="lg:hidden border-t border-slate-100 bg-[#F8FCFA] px-3 py-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            {SITE_PAGES.map((page) => {
              const Icon = page.icon;
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => navigateToPage(page.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0F2926] text-[#bae3d1]'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {page.short}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ==================== MAIN MULTI-PAGE CONTENT ==================== */}
      <main
        id="main-content"
        role="main"
        key={activePage}
        className={`flex-1 ${
          pageSlideDir === 'right' ? 'tab-slide-right' : 'tab-slide-left'
        }`}
      >
        {/* =====================================================================
            PAGE 1 : ACCUEIL & LE CONCEPT GLOBAL
           ===================================================================== */}
        {activePage === 'accueil' && (
          <section className="py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
              {/* Hero Grid */}
              <div className="grid lg:grid-cols-12 gap-12 items-center">
                <ScrollReveal direction="left" className="lg:col-span-7 space-y-7">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F2FBF7] border border-[#bae3d1]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                      Édition Limitée • Vakita × La Vie est Belt
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-[#0F2926] leading-[1.06]">
                    Transformons les{' '}
                    <span className="marker-aqua-pill">filets fantômes</span> en accessoires qui ont du sens.
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                    Le média indépendant <strong>Vakita</strong> et l’atelier nordiste{' '}
                    <strong className="belt-underline">La Vie est Belt</strong> s’associent pour{' '}
                    <strong>« Seconde Maille »</strong> : 4 pièces façonnées à partir de filets de pêche récupérés en mer, accompagnées d’une box à QR code et d’un Pop-Up Store exclusif.
                  </p>

                  {/* 100% Charity Callout */}
                  <div className="p-6 rounded-3xl bg-[#F4FBF8] border-2 border-[#bae3d1] flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-soft">
                    <div className="w-12 h-12 rounded-2xl bg-[#bae3d1] text-[#0F2926] flex items-center justify-center shrink-0 font-extrabold text-base">
                      100%
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-extrabold text-[#0F2926]">
                        100% des bénéfices reversés à des associations de protection des océans
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Chaque pièce finance directement la récupération des filets perdus en mer et l’emploi solidaire en ESAT dans les Hauts-de-France.
                      </p>
                    </div>
                  </div>

                  {/* Primary Navigation CTAs */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => navigateToPage('marques')}
                      className="interactive-slide-btn px-7 py-4 rounded-2xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-sm tracking-wide hover:bg-[#183f3a] transition shadow-soft flex items-center gap-2.5"
                    >
                      <span>Découvrir les 2 Marques</span>
                      <ArrowRight className="w-4 h-4 slide-arrow" />
                    </button>
                    <button
                      onClick={() => navigateToPage('appli-box')}
                      className="interactive-slide-btn px-6 py-4 rounded-2xl bg-[#bae3d1] text-[#0F2926] font-extrabold text-sm hover:bg-[#a6d9c3] transition flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Tester la Box & l’Appli</span>
                    </button>
                    <button
                      onClick={() => navigateToPage('popup-merch')}
                      className="interactive-slide-btn px-6 py-4 rounded-2xl bg-white text-[#0F2926] border-2 border-slate-200 font-extrabold text-sm hover:border-[#0F2926] transition flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-[#D96B43]" />
                      <span>Voir le Pop-Up & les 4 Pièces</span>
                    </button>
                  </div>
                </ScrollReveal>

                {/* Hero Visual Showcase Card */}
                <ScrollReveal direction="right" delay={120} className="lg:col-span-5">
                  <div className="bg-[#F8FCFA] rounded-[36px] p-6 sm:p-8 border border-[#bae3d1]/80 shadow-soft-lg space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                        Pièce Phare #01
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Fabriqué à Tourcoing (59)
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedProduct(PRODUCTS[0])}
                      className="h-64 rounded-3xl overflow-hidden cursor-pointer border border-slate-200/60 group"
                    >
                      <ProductVisual type="belt" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-extrabold text-[#0F2926]">
                          {PRODUCTS[0].name}
                        </h3>
                        <span className="text-xl font-extrabold text-[#0F2926] bg-[#bae3d1]/60 px-3 py-1 rounded-xl">
                          {PRODUCTS[0].price} €
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {PRODUCTS[0].description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => setSelectedProduct(PRODUCTS[0])}
                        className="py-3 px-4 rounded-xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-[#173d38] transition"
                      >
                        <Eye className="w-4 h-4" />
                        Fiche & Préparation
                      </button>
                      <button
                        onClick={() => navigateToPage('popup-merch')}
                        className="py-3 px-4 rounded-xl bg-white border border-slate-200 text-[#0F2926] font-extrabold text-xs flex items-center justify-center gap-1.5 hover:border-[#0F2926] transition"
                      >
                        Voir les 4 produits
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* 4 Key Pillars of the Project (Quick Hub Cards to the other pages) */}
              <div className="space-y-8">
                <ScrollReveal className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                    Parcours en 5 Espaces
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2926]">
                    Tout comprendre sur la collaboration
                  </h2>
                  <p className="text-base text-slate-600">
                    Naviguez librement entre nos pages dédiées pour découvrir les marques, la box connectée, le Pop-Up Store et les enquêtes Vakita.
                  </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ScrollReveal delay={50}>
                    <div
                      onClick={() => navigateToPage('marques')}
                      className="interactive-card h-full p-6 rounded-3xl bg-[#F8FCFA] border border-[#bae3d1]/70 hover:border-[#0F2926] cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#bae3d1] text-[#0F2926] flex items-center justify-center">
                          <HeartHandshake className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Page 2 • Les Alliés
                        </span>
                        <h3 className="text-lg font-extrabold text-[#0F2926]">
                          Vakita × La Vie est Belt
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Pourquoi un média d’investigation et une marque d’accessoires upcyclés unissent leurs forces pour l’océan.
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F2926] group-hover:translate-x-1 transition">
                        Explorer les 2 marques <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={120}>
                    <div
                      onClick={() => navigateToPage('appli-box')}
                      className="interactive-card h-full p-6 rounded-3xl bg-[#F8FCFA] border border-[#bae3d1]/70 hover:border-[#0F2926] cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#bae3d1] text-[#0F2926] flex items-center justify-center">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Page 3 • Expérience
                        </span>
                        <h3 className="text-lg font-extrabold text-[#0F2926]">
                          La Box QR & l’Application
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Découvrez la carte QR glissée dans chaque boîte et testez en direct l’application mobile compagnon.
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F2926] group-hover:translate-x-1 transition">
                        Tester le simulateur <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={190}>
                    <div
                      onClick={() => navigateToPage('popup-merch')}
                      className="interactive-card h-full p-6 rounded-3xl bg-[#F8FCFA] border border-[#bae3d1]/70 hover:border-[#0F2926] cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#bae3d1] text-[#0F2926] flex items-center justify-center">
                          <Store className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Page 4 • Événement & Produits
                        </span>
                        <h3 className="text-lg font-extrabold text-[#0F2926]">
                          Pop-Up Store & Merch
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Rendez-vous en boutique éphémère à Lille et découvrez comment chaque pièce est préparée et façonnée.
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F2926] group-hover:translate-x-1 transition">
                        Voir le Pop-Up & les 4 pièces <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal delay={260}>
                    <div
                      onClick={() => navigateToPage('reportages')}
                      className="interactive-card h-full p-6 rounded-3xl bg-[#F8FCFA] border border-[#bae3d1]/70 hover:border-[#0F2926] cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#bae3d1] text-[#0F2926] flex items-center justify-center">
                          <Tv className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                          Page 5 • Média
                        </span>
                        <h3 className="text-lg font-extrabold text-[#0F2926]">
                          Reportages Vakita
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Visionnez les documentaires exclusifs sur les filets fantômes et les coulisses de fabrication.
                        </p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F2926] group-hover:translate-x-1 transition">
                        Regarder les enquêtes <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 2 : LES 2 MARQUES & LEUR ENGAGEMENT SOLIDAIRE
           ===================================================================== */}
        {activePage === 'marques' && (
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              {/* Header */}
              <ScrollReveal className="max-w-3xl space-y-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                  Page 2 • L’Alliance des 2 Marques
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2926] tracking-tight leading-tight">
                  Quand le journalisme d’impact rencontre l’artisanat upcyclé.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  <strong>Vakita</strong> alerte et enquête sur la pollution marine.{' '}
                  <strong>La Vie est Belt</strong> transforme les matières délaissées en accessoires durables. Ensemble, ils créent une collection concrète dont <strong>100% des bénéfices sont reversés à des associations</strong>.
                </p>
              </ScrollReveal>

              {/* Two Brand Cards */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* VAKITA */}
                <ScrollReveal direction="left">
                  <div className="h-full rounded-[32px] bg-[#F4FBF8] border-2 border-[#bae3d1] p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-soft">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <VakitaLogo />
                        <span className="px-3.5 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase">
                          {BRAND_PILLARS.vakita.tagline}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2926]">
                        Enquêter sur le terrain et donner envie d’agir
                      </h2>

                      <p className="text-base text-slate-700 leading-relaxed">
                        {BRAND_PILLARS.vakita.mission}
                      </p>

                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                          Le rôle de Vakita dans la collaboration :
                        </p>
                        {BRAND_PILLARS.vakita.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-[#0F2926]">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#bae3d1] flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={BRAND_PILLARS.vakita.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F2926] text-[#bae3d1] text-xs font-extrabold hover:bg-[#183f3a] transition"
                      >
                        <span>Visiter vakita.fr</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => navigateToPage('reportages')}
                        className="text-xs font-extrabold text-[#0F2926] underline decoration-[#0F2926] underline-offset-4"
                      >
                        Voir les reportages dédiés →
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* LA VIE EST BELT */}
                <ScrollReveal direction="right" delay={120}>
                  <div className="h-full rounded-[32px] bg-[#FDFBF7] border-2 border-[#D96B43]/35 p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-soft">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <LaVieEstBeltLogo />
                        <span className="px-3.5 py-1 rounded-full bg-[#D96B43]/15 text-[#D96B43] text-xs font-extrabold uppercase">
                          {BRAND_PILLARS.belt.tagline}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2926]">
                        Transformer les déchets en accessoires solidaires
                      </h2>

                      <p className="text-base text-slate-700 leading-relaxed">
                        {BRAND_PILLARS.belt.mission}
                      </p>

                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                          Le savoir-faire La Vie est Belt :
                        </p>
                        {BRAND_PILLARS.belt.highlights.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-[#0F2926]">
                            <CheckCircle2 className="w-5 h-5 text-[#D96B43] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                      <a
                        href={BRAND_PILLARS.belt.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D96B43] text-white text-xs font-extrabold hover:bg-[#c25b35] transition"
                      >
                        <span>Visiter lavieestbelt.fr</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => navigateToPage('popup-merch')}
                        className="text-xs font-extrabold text-[#0F2926] underline decoration-[#D96B43] underline-offset-4"
                      >
                        Découvrir les 4 pièces façonnées →
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* 100% Charity Breakdown Banner */}
              <ScrollReveal>
                <div className="rounded-[32px] bg-[#0F2926] text-white p-8 sm:p-12">
                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <span className="px-3 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                        Engagement Financier Transparent
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold">
                        Où va l’argent de la collection Seconde Maille ?
                      </h3>
                      <p className="text-slate-300 text-base leading-relaxed">
                        Aucune marge commerciale n’est conservée sur cette édition limitée : une fois la rémunération juste des artisans de l’ESAT de Tourcoing et le recyclage matière payés, <strong>l’intégralité des bénéfices (100%) est reversée aux associations partenaires</strong> qui collectent les filets fantômes et protègent la biodiversité marine.
                      </p>
                    </div>
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-white/10 border border-white/10">
                        <Recycle className="w-6 h-6 text-[#bae3d1] mb-2" />
                        <div className="text-2xl font-extrabold text-[#bae3d1]">100%</div>
                        <p className="text-xs text-slate-300 mt-1">
                          Des bénéfices reversés aux associations océaniques
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white/10 border border-white/10">
                        <Users className="w-6 h-6 text-[#bae3d1] mb-2" />
                        <div className="text-2xl font-extrabold text-[#bae3d1]">ESAT 59</div>
                        <p className="text-xs text-slate-300 mt-1">
                          Confection locale et inclusive à Tourcoing
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 3 : LA BOX QR CODE & L'APPLICATION COMPAGNON
           ===================================================================== */}
        {activePage === 'appli-box' && (
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
              {/* Header */}
              <ScrollReveal className="max-w-3xl space-y-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                  Page 3 • Du Produit Physique au Compagnon Digital
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2926] tracking-tight leading-tight">
                  Dans chaque boîte, un <span className="marker-aqua-pill">QR Code</span> qui prolonge l’expérience.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Lorsque vous achetez une pièce Seconde Maille en Pop-Up Store, vous trouvez à l’intérieur du coffret une <strong>carte en papier ensemencé dotée d’un QR code unique</strong>. Scannez-la avec l’application pour débloquer la traçabilité de votre produit, vos avantages en boutique et les documentaires Vakita.
                </p>
              </ScrollReveal>

              {/* Main Interactive Grid: Left = Box & Steps, Right = Interactive Phone */}
              <div className="grid lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: How the Box + QR works */}
                <ScrollReveal direction="left" className="lg:col-span-7 space-y-8">
                  {/* Visual Illustration of the Box & QR Card */}
                  <div className="rounded-[32px] bg-[#F4FBF8] border-2 border-[#bae3d1] p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                        <Package className="w-4 h-4" /> Ce que contient votre coffret Seconde Maille
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[#0F2926] text-[#bae3d1] text-[11px] font-bold">
                        Zéro Plastique • Carton Recyclé
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                        <span className="text-xs font-extrabold text-[#D96B43] uppercase">
                          1. Votre Accessoire Numéroté
                        </span>
                        <h3 className="text-base font-extrabold text-[#0F2926]">
                          Façonné à la main à Tourcoing
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Ceinture, Bob, Sacoche ou Porte-clés : chaque pièce porte le numéro du lot de filet de pêche dont elle est issue.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-[#0F2926] text-white space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#bae3d1] uppercase">
                            2. La Carte QR Code
                          </span>
                          <QrCode className="w-5 h-5 text-[#bae3d1]" />
                        </div>
                        <h3 className="text-base font-extrabold">
                          Votre clé vers l’application
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Glissée dans la boîte, elle permet de scanner votre pièce pour accéder au passeport d’origine et à vos récompenses.
                        </p>
                      </div>
                    </div>

                    {/* 3 Steps */}
                    <div className="grid sm:grid-cols-3 gap-4 pt-2">
                      {BOX_EXPERIENCE_STEPS.map((item) => (
                        <div
                          key={item.step}
                          className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1.5"
                        >
                          <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#bae3d1] text-[#0F2926] font-extrabold text-xs">
                            Étape {item.step}
                          </span>
                          <h4 className="text-sm font-extrabold text-[#0F2926]">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remote Control Buttons to test the Simulator */}
                  <div className="rounded-[28px] bg-white border border-slate-200 p-6 space-y-4 shadow-soft">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-[#0F2926]">
                        Testez les fonctionnalités de l’application ci-contre 👉
                      </h3>
                      <span className="text-xs font-bold text-emerald-700">
                        Simulateur Interactif
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Cliquez sur l’une des actions ci-dessous ou directement dans l’écran du téléphone pour explorer l’application compagnon :
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2.5">
                      <button
                        onClick={() => setAppTab('scan')}
                        className={`p-3 rounded-xl text-left border transition ${
                          appTab === 'scan'
                            ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                            : 'bg-[#F8FCFA] text-[#0F2926] border-slate-200 hover:border-[#bae3d1]'
                        }`}
                      >
                        <QrCode className="w-4 h-4 mb-1" />
                        <div className="text-xs font-extrabold">1. Scanner le QR</div>
                        <div className="text-[10px] opacity-80">Authentifier la box</div>
                      </button>

                      <button
                        onClick={() => setAppTab('map')}
                        className={`p-3 rounded-xl text-left border transition ${
                          appTab === 'map'
                            ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                            : 'bg-[#F8FCFA] text-[#0F2926] border-slate-200 hover:border-[#bae3d1]'
                        }`}
                      >
                        <MapPin className="w-4 h-4 mb-1" />
                        <div className="text-xs font-extrabold">2. Carte Pop-Up</div>
                        <div className="text-[10px] opacity-80">Lille, Paris & Nantes</div>
                      </button>

                      <button
                        onClick={() => setAppTab('profil')}
                        className={`p-3 rounded-xl text-left border transition ${
                          appTab === 'profil'
                            ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                            : 'bg-[#F8FCFA] text-[#0F2926] border-slate-200 hover:border-[#bae3d1]'
                        }`}
                      >
                        <Award className="w-4 h-4 mb-1" />
                        <div className="text-xs font-extrabold">3. Récompenses</div>
                        <div className="text-[10px] opacity-80">Gravure & Vakita TV</div>
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Right Column: Live Mobile Simulator */}
                <ScrollReveal direction="right" delay={140} className="lg:col-span-5">
                  <MobileAppSimulator
                    activeTab={appTab}
                    setActiveTab={setAppTab}
                    onSelectProduct={(prod) => setSelectedProduct(prod)}
                  />
                </ScrollReveal>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 4 : LE POP-UP STORE (LIEU, MAP, HORAIRES, INFOS) & LES 4 PRODUITS
           ===================================================================== */}
        {activePage === 'popup-merch' && (
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              {/* Header */}
              <ScrollReveal className="max-w-3xl space-y-4">
                <span className="px-3.5 py-1.5 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                  Page 4 • Boutique Éphémère & Collection
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2926] tracking-tight leading-tight">
                  Le Pop-Up Store & les <span className="marker-aqua-pill">4 pièces exclusives</span>.
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Pour privilégier la rencontre avec nos artisans et éviter la surproduction, la collection est présentée dans nos <strong>Pop-Up Stores physiques</strong>. Consultez toutes les informations pratiques de l’événement lillois ainsi que les fiches de fabrication de chaque pièce.
                </p>
              </ScrollReveal>

              {/* ==================== BLOC COMPLET ÉVÉNEMENT POP-UP LILLE ==================== */}
              <ScrollReveal>
                <div className="rounded-[36px] bg-[#F4FBF8] border-2 border-[#bae3d1] p-6 sm:p-10 space-y-8 shadow-soft">
                  {/* Top Event Title & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#bae3d1] pb-6">
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2926] text-[#bae3d1] text-xs font-extrabold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Événement Principal • Ouvert ce week-end
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2926]">
                        {LILLE_EVENT_DETAILS.title}
                      </h2>
                      <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D96B43] shrink-0" />
                        <span>
                          {LILLE_EVENT_DETAILS.venue} — <strong>{LILLE_EVENT_DETAILS.address}</strong>
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-4 py-2 rounded-2xl bg-white border border-[#bae3d1] text-xs font-extrabold text-[#0F2926] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-700" />
                        14, 15 & 16 Novembre 2026
                      </span>
                      <button
                        onClick={() => openAppOnTab('map')}
                        className="interactive-slide-btn px-4 py-2 rounded-2xl bg-[#0F2926] text-[#bae3d1] text-xs font-extrabold flex items-center gap-1.5"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Ouvrir le Pass dans l’Appli</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid: Left = Interactive Localization Map + Transport Access, Right = Opening Hours & Services */}
                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left 7 Cols: Interactive Map & Transport Tabs */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-extrabold text-[#0F2926] flex items-center gap-2">
                          <Compass className="w-5 h-5 text-emerald-700" />
                          Carte de localisation & Accès Gare Saint-Sauveur (Lille)
                        </h3>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          GPS : {LILLE_EVENT_DETAILS.gps}
                        </span>
                      </div>

                      {/* Stylized Interactive Localization Map of Lille */}
                      <div className="relative h-72 sm:h-80 rounded-3xl bg-[#E3F5EC] border-2 border-[#0F2926]/15 overflow-hidden shadow-inner p-5 flex flex-col justify-between">
                        {/* SVG Urban Map Grid of Lille */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 600 320"
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          {/* Park Jean-Baptiste Lebas green zone */}
                          <rect x="110" y="30" width="210" height="95" rx="18" fill="#bae3d1" opacity="0.65" />
                          {/* Main Boulevards */}
                          <path d="M 0 135 L 600 135" stroke="#ffffff" strokeWidth="14" />
                          <path d="M 0 135 L 600 135" stroke="#0F2926" strokeWidth="2" strokeDasharray="8 8" opacity="0.35" />
                          <path d="M 330 0 L 290 320" stroke="#ffffff" strokeWidth="12" />
                          <path d="M 110 0 L 160 320" stroke="#ffffff" strokeWidth="8" />
                          {/* Metro Line 2 Red/Terracotta Track */}
                          <path
                            d="M 40 280 Q 260 210 560 60"
                            stroke="#D96B43"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray="6 4"
                          />
                          <circle cx="195" cy="222" r="6" fill="#D96B43" />
                          <circle cx="435" cy="118" r="6" fill="#D96B43" />
                        </svg>

                        {/* Map Top Landmarks */}
                        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-xl bg-white/95 backdrop-blur text-xs font-extrabold text-[#0F2926] shadow-sm border border-slate-200">
                            🌳 Parc Jean-Baptiste Lebas (Face à l’entrée)
                          </span>
                          <span className="px-3 py-1 rounded-xl bg-[#D96B43] text-white text-xs font-extrabold shadow-sm">
                            🚇 Métro Ligne 2 : Lille Grand Palais (4 min)
                          </span>
                        </div>

                        {/* Center Pin: Gare Saint-Sauveur Halle B */}
                        <div className="relative z-10 my-auto mx-auto flex flex-col items-center">
                          <div className="relative flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-[#0F2926]/25 gps-ring absolute" />
                            <div className="w-12 h-12 rounded-2xl bg-[#0F2926] text-[#bae3d1] flex items-center justify-center shadow-lg border-2 border-white">
                              <MapPin className="w-6 h-6" />
                            </div>
                          </div>
                          <div className="mt-2 px-4 py-1.5 rounded-xl bg-[#0F2926] text-white text-xs font-extrabold shadow-md text-center">
                            POP-UP SECONDE MAILLE • GARE SAINT-SAUVEUR (HALLE B)
                          </div>
                        </div>

                        {/* Map Bottom Bar */}
                        <div className="relative z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-extrabold text-[#0F2926]">
                              17 Boulevard Jean-Baptiste Lebas, 59800 Lille
                            </p>
                            <p className="text-[11px] text-slate-600">
                              Accès plain-pied • Halle B (Entrée principale côté Boulevard)
                            </p>
                          </div>
                          <a
                            href="https://www.openstreetmap.org/?mlat=50.6279&mlon=3.0706#map=16/50.6279/3.0706"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold hover:bg-[#9fd6be] transition inline-flex items-center gap-1.5"
                          >
                            <span>Ouvrir sur OpenStreetMap</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Transport Modes Selector */}
                      <div className="space-y-3">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                          Comment venir au Pop-Up Store ?
                        </p>
                        <div className="grid sm:grid-cols-3 gap-2.5">
                          {LILLE_EVENT_DETAILS.transports.map((tr) => {
                            const Icon = tr.icon;
                            const isSelected = activeTransport === tr.id;
                            return (
                              <button
                                key={tr.id}
                                onClick={() => setActiveTransport(tr.id)}
                                aria-pressed={isSelected}
                                className={`p-3.5 rounded-2xl text-left border transition flex items-center gap-2.5 ${
                                  isSelected
                                    ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926] shadow-sm'
                                    : 'bg-white text-[#0F2926] border-slate-200 hover:border-[#0F2926]'
                                }`}
                              >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-xs font-extrabold">{tr.mode}</span>
                              </button>
                            );
                          })}
                        </div>

                        {LILLE_EVENT_DETAILS.transports
                          .filter((t) => t.id === activeTransport)
                          .map((tr) => (
                            <div
                              key={tr.id}
                              className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-1"
                            >
                              <p className="text-sm font-extrabold text-[#0F2926]">{tr.title}</p>
                              <p className="text-xs text-slate-600 leading-relaxed">{tr.details}</p>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Right 5 Cols: Horaires d'ouverture détaillés & Infos sur place */}
                    <div className="lg:col-span-5 space-y-6">
                      {/* Opening Hours Card */}
                      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-extrabold text-[#0F2926] flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#D96B43]" />
                            Horaires d’ouverture & Temps forts
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                            Entrée Gratuite
                          </span>
                        </div>

                        <div className="space-y-3">
                          {LILLE_EVENT_DETAILS.schedule.map((slot, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-[#F8FCFA] border border-slate-200/70 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-extrabold text-[#0F2926]">
                                  {slot.day}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold">
                                  {slot.hours}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {slot.highlight}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Services & Activités sur place */}
                      <div className="p-6 rounded-3xl bg-[#0F2926] text-white space-y-3.5">
                        <div className="flex items-center gap-2 text-[#bae3d1] text-xs font-extrabold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>Ateliers & Services sur place</span>
                        </div>
                        <ul className="space-y-2.5">
                          {LILLE_EVENT_DETAILS.servicesOnSite.map((srv, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 leading-relaxed">
                              <CheckCircle2 className="w-4 h-4 text-[#bae3d1] shrink-0 mt-0.5" />
                              <span>{srv}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 border-t border-white/15 flex items-center gap-2 text-[11px] text-[#bae3d1] font-semibold">
                          <Accessibility className="w-4 h-4 shrink-0" />
                          <span>{LILLE_EVENT_DETAILS.entry}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other Tour Dates (Paris & Nantes) */}
                  <div className="pt-4 border-t border-[#bae3d1] space-y-3">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                      Toutes les étapes de la tournée Pop-Up Seconde Maille :
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {POPUP_BOUTIQUES.map((boutique, index) => (
                        <div
                          key={boutique.id}
                          onClick={() => setSelectedCityIndex(index)}
                          className={`p-4 rounded-2xl border transition cursor-pointer ${
                            selectedCityIndex === index
                              ? 'bg-white border-2 border-[#0F2926] shadow-sm'
                              : 'bg-white/70 border-slate-200/80 hover:border-[#0F2926]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-extrabold text-[#0F2926]">
                              📍 {boutique.city} — {boutique.venue}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-[#bae3d1] text-[#0F2926] text-[10px] font-extrabold">
                              {boutique.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{boutique.address}</p>
                          <p className="text-xs font-extrabold text-[#D96B43] mt-1">
                            {boutique.dates}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* ==================== LES 4 PRODUITS DU MERCH (SANS COMMANDE EN LIGNE) ==================== */}
              <div className="space-y-8">
                <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                      Collection Capsule • 4 Pièces Upcyclées
                    </span>
                    <h2 className="text-3xl font-extrabold text-[#0F2926] mt-1">
                      Les Produits & leur Préparation Artisanale
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 max-w-md">
                    Cliquez sur un produit pour ouvrir sa <strong>fiche détaillée</strong> : origine des matériaux, étapes de préparation à l’ESAT de Tourcoing et tailles disponibles en Pop-Up.
                  </p>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {PRODUCTS.map((product, idx) => (
                    <ScrollReveal key={product.id} delay={idx * 80}>
                      <div
                        onClick={() => setSelectedProduct(product)}
                        className="interactive-card h-full rounded-[28px] bg-white border border-slate-200/90 hover:border-[#0F2926] transition overflow-hidden flex flex-col justify-between cursor-pointer group shadow-soft"
                      >
                        <div>
                          <div className="h-52 overflow-hidden relative">
                            <ProductVisual type={product.visualType} />
                            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-[#0F2926] text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                              {product.badge}
                            </span>
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500">
                                {product.subtitle}
                              </span>
                              <span className="text-lg font-extrabold text-[#0F2926] bg-[#bae3d1]/60 px-2.5 py-0.5 rounded-lg">
                                {product.price} €
                              </span>
                            </div>

                            <h3 className="text-lg font-extrabold text-[#0F2926] group-hover:underline decoration-[#bae3d1] decoration-2">
                              {product.name}
                            </h3>

                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 pb-5 pt-2 space-y-3">
                          <div className="p-2.5 rounded-xl bg-[#F4FBF8] border border-[#bae3d1]/60 text-[11px] font-bold text-[#0F2926] flex items-center justify-between">
                            <span>Dispo Pop-Up Lille :</span>
                            <span className="text-emerald-800">{product.stockLille}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                            }}
                            className="w-full py-3 rounded-xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-xs flex items-center justify-center gap-1.5 group-hover:bg-[#173d38] transition"
                          >
                            <Layers className="w-4 h-4" />
                            <span>Voir préparation & tailles</span>
                          </button>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================================
            PAGE 5 : LES REPORTAGES VAKITA & DOCUMENTAIRES
           ===================================================================== */}
        {activePage === 'reportages' && (
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* Header */}
              <ScrollReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-3xl space-y-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase tracking-wider">
                    Page 5 • Média & Enquêtes de Terrain
                  </span>
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F2926] tracking-tight leading-tight">
                    Les reportages <span className="marker-aqua-pill">Vakita</span> débloqués par la collab.
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Pourquoi récupérer les filets de pêche est-il vital pour les océans ? Comment sont fabriquées vos pièces à Tourcoing ? Visionnez les reportages exclusifs réalisés par les équipes de Vakita.
                  </p>
                </div>

                <a
                  href="https://www.vakita.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-xs uppercase tracking-wider hover:bg-[#183f3a] transition shrink-0 self-start"
                >
                  <span>Découvrir tous les contenus sur vakita.fr</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </ScrollReveal>

              {/* 3 Reportages Cards */}
              <div className="grid lg:grid-cols-3 gap-8">
                {VAKITA_REPORTAGES.map((video, idx) => (
                  <ScrollReveal key={video.id} delay={idx * 100}>
                    <div className="interactive-card h-full rounded-[32px] bg-[#F8FCFA] border-2 border-[#bae3d1]/80 p-7 flex flex-col justify-between space-y-6 shadow-soft">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase">
                            {video.tag}
                          </span>
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {video.duration}
                          </span>
                        </div>

                        {/* Video Preview Graphic */}
                        <div
                          onClick={() => setActiveVideoModal(video)}
                          className="h-44 rounded-2xl bg-[#0F2926] text-white p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer group"
                        >
                          <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-[#bae3d1]/20 blur-xl group-hover:scale-125 transition" />
                          <span className="text-[11px] font-mono uppercase tracking-wider text-[#bae3d1]">
                            VAKITA ORIGINAL • HD
                          </span>
                          <div className="my-auto mx-auto w-14 h-14 rounded-full bg-[#bae3d1] text-[#0F2926] flex items-center justify-center shadow-md group-hover:scale-110 transition">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                          <span className="text-xs font-semibold text-slate-300">
                            Par {video.journalist}
                          </span>
                        </div>

                        <h2 className="text-xl font-extrabold text-[#0F2926] leading-snug">
                          {video.title}
                        </h2>

                        <p className="text-sm text-slate-600 leading-relaxed">
                          {video.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#bae3d1]/60 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-800">
                          {video.impactStat}
                        </span>
                        <button
                          onClick={() => setActiveVideoModal(video)}
                          className="px-4 py-2 rounded-xl bg-[#0F2926] text-[#bae3d1] text-xs font-extrabold hover:bg-[#173d38] transition"
                        >
                          Lancer l’extrait
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== BOTTOM PAGE-TO-PAGE STEPPER NAVIGATION ==================== */}
        <section className="py-10 border-t border-slate-100 bg-[#F8FCFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevPage ? (
              <button
                onClick={() => navigateToPage(prevPage.id)}
                className="interactive-slide-btn px-5 py-3 rounded-2xl bg-white border border-slate-200 text-[#0F2926] font-extrabold text-xs flex items-center gap-2 hover:border-[#0F2926] transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Page précédente : {prevPage.label}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-1.5" role="tablist" aria-label="Pagination des sections">
              {SITE_PAGES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigateToPage(p.id)}
                  aria-label={`Aller à la page ${p.label}`}
                  className={`h-2.5 rounded-full transition-all ${
                    activePage === p.id ? 'w-8 bg-[#0F2926]' : 'w-2.5 bg-[#bae3d1]'
                  }`}
                />
              ))}
            </div>

            {nextPage ? (
              <button
                onClick={() => navigateToPage(nextPage.id)}
                className="interactive-slide-btn px-6 py-3 rounded-2xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-xs flex items-center gap-2 hover:bg-[#173d38] transition shadow-sm"
              >
                <span>Page suivante : {nextPage.label}</span>
                <ArrowRight className="w-4 h-4 slide-arrow" />
              </button>
            ) : (
              <button
                onClick={() => navigateToPage('accueil')}
                className="interactive-slide-btn px-6 py-3 rounded-2xl bg-[#bae3d1] text-[#0F2926] font-extrabold text-xs flex items-center gap-2"
              >
                <span>Retour à l’Accueil</span>
              </button>
            )}
          </div>
        </section>
      </main>

      {/* ==================== FOOTER COMPLET & CONFORME RGAA ==================== */}
      <footer
        role="contentinfo"
        className="bg-[#F8FCFA] text-[#0F2926] border-t border-[#bae3d1]/60 pt-14 pb-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Col 1 (4 cols): Identité & Charte 100% Solidaire */}
            <div className="lg:col-span-4 space-y-4">
              <CollabBadge />
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Seconde Maille</strong> est une collection capsule co-créée par le média indépendant <strong>Vakita</strong> et l’atelier d’upcycling <strong>La Vie est Belt</strong>. Nos accessoires sont façonnés à partir de filets de pêche réformés et de caoutchouc recyclé à l’ESAT de Tourcoing.
              </p>
              <div className="p-3.5 rounded-2xl bg-[#F2FBF7] border border-[#bae3d1] flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#0F2926] shrink-0" />
                <p className="text-[11px] text-[#0F2926] font-semibold leading-snug">
                  <strong>Engagement certifié :</strong> 100% des bénéfices sont reversés aux associations de dépollution marine (Sea Shepherd & Coopérative maritime des Hauts-de-France).
                </p>
              </div>
            </div>

            {/* Col 2 (2 cols): Plan du site (5 pages) */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                Plan du site
              </h2>
              <ul className="space-y-2 text-xs">
                {SITE_PAGES.map((page) => (
                  <li key={page.id}>
                    <button
                      onClick={() => navigateToPage(page.id)}
                      className="text-slate-600 hover:text-[#0F2926] font-semibold transition flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#bae3d1]" />
                      {page.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 (3 cols): Infos Pratiques Pop-Up Store Lille */}
            <div className="lg:col-span-3 space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                Pop-Up Store Officiel
              </h2>
              <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                <p className="font-extrabold text-[#0F2926]">
                  📍 Gare Saint-Sauveur — Halle B
                </p>
                <p>17 Boulevard Jean-Baptiste Lebas, 59800 Lille</p>
                <p className="text-[#D96B43] font-bold pt-1">
                  Horaires d’ouverture (14 – 16 Nov. 2026) :
                </p>
                <ul className="text-[11px] space-y-0.5 text-slate-600">
                  <li>• Vendredi 14 Nov : 14h00 – 21h00</li>
                  <li>• Samedi 15 Nov : 10h00 – 22h00</li>
                  <li>• Dimanche 16 Nov : 10h00 – 19h00</li>
                </ul>
                <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                  ✓ Entrée libre • Accessible PMR • Métro Ligne 2
                </p>
              </div>
            </div>

            {/* Col 4 (3 cols): Alerte Prochains Pop-Up & Liens Officiels */}
            <div className="lg:col-span-3 space-y-4">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#0F2926]">
                Alerte Tournée & Médias
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recevez un e-mail lors de l’ouverture des prochains Pop-Up Stores (Paris & Nantes) et la sortie des enquêtes Vakita :
              </p>

              {newsletterSent ? (
                <div className="p-3 rounded-xl bg-[#F2FBF7] border border-[#bae3d1] text-xs font-bold text-[#0F2926]">
                  ✓ Merci ! Vous êtes inscrit(e) aux alertes Pop-Up Seconde Maille.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <label htmlFor="footer-email" className="sr-only">
                    Votre adresse e-mail
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      id="footer-email"
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="votre.email@exemple.fr"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-[#0F2926] placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-xs hover:bg-[#173d38] transition shrink-0"
                    >
                      OK
                    </button>
                  </div>
                </form>
              )}

              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-extrabold">
                <a
                  href="https://www.vakita.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[#0F2926] hover:border-[#0F2926] transition inline-flex items-center gap-1"
                >
                  vakita.fr <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.lavieestbelt.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[#0F2926] hover:border-[#0F2926] transition inline-flex items-center gap-1"
                >
                  lavieestbelt.fr <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Legal, RGAA & Eco-conception Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <button
                onClick={() => setLegalModal('rgaa')}
                className="hover:text-[#0F2926] underline underline-offset-4 transition font-semibold"
              >
                Accessibilité : Conforme RGAA 4.1 / WCAG 2.1 AA
              </button>
              <button
                onClick={() => setLegalModal('mentions')}
                className="hover:text-[#0F2926] underline underline-offset-4 transition"
              >
                Mentions légales & Crédits
              </button>
              <button
                onClick={() => setLegalModal('confidentialite')}
                className="hover:text-[#0F2926] underline underline-offset-4 transition"
              >
                Politique de confidentialité (RGPD • 0 traceur publicitaire)
              </button>
              <button
                onClick={() => setLegalModal('charte')}
                className="hover:text-[#0F2926] underline underline-offset-4 transition"
              >
                Charte de transparence 100% Dons
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center lg:text-right">
              © 2026 Vakita × La Vie est Belt — Éco-conçu (illustrations vectorielles légères, sans cookie tiers).
            </p>
          </div>
        </div>
      </footer>

      {/* ==================== MODAL FICHE PRODUIT (SANS ACHAT EN LIGNE) ==================== */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onGoToPopUp={() => navigateToPage('popup-merch')}
      />

      {/* ==================== MODAL LECTURE REPORTAGE VAKITA ==================== */}
      {activeVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2926]/70 backdrop-blur-sm"
        >
          <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#bae3d1]">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase">
                {activeVideoModal.tag} • {activeVideoModal.duration}
              </span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-extrabold text-[#0F2926] hover:bg-slate-200 transition"
              >
                Fermer ✕
              </button>
            </div>
            <h3 id="video-modal-title" className="text-2xl font-extrabold text-[#0F2926]">
              {activeVideoModal.title}
            </h3>
            <div className="p-6 rounded-2xl bg-[#0F2926] text-white space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-[#bae3d1] uppercase">
                   Aperçu Documentaire • Journaliste : {activeVideoModal.journalist}
                </p>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-[#bae3d1] flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Sous-titres FR (Sourds & Malentendants)
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeVideoModal.summary}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-[#bae3d1] font-bold">
                <span>Chiffre clé : {activeVideoModal.impactStat}</span>
                <a
                  href="https://www.vakita.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="underline inline-flex items-center gap-1"
                >
                  Voir en intégralité sur vakita.fr <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODALES LÉGALES & ACCESSIBILITÉ RGAA ==================== */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2926]/70 backdrop-blur-sm"
        >
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#bae3d1] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="px-3 py-1 rounded-full bg-[#bae3d1] text-[#0F2926] text-xs font-extrabold uppercase">
                Informations Réglementaires & Transparence
              </span>
              <button
                onClick={() => setLegalModal(null)}
                aria-label="Fermer la fenêtre d'information"
                className="p-2 rounded-xl bg-slate-100 text-[#0F2926] hover:bg-[#bae3d1] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {legalModal === 'rgaa' && (
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <h3 id="legal-modal-title" className="text-xl font-extrabold text-[#0F2926]">
                  Déclaration d’Accessibilité (RGAA 4.1 / WCAG 2.1 Niveau AA)
                </h3>
                <p>
                  Vakita et La Vie est Belt s’engagent à rendre le site et l’application compagnon <strong>Seconde Maille</strong> accessibles à toutes et tous, conformément à l’article 47 de la loi n°2005-102 du 11 février 2005.
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Navigation au clavier :</strong> Lien d’évitement en début de page (« Aller directement au contenu principal ») et contour de focus haute visibilité sur tous les éléments interactifs.</li>
                  <li><strong>Contrastes & Couleurs :</strong> Ratio de contraste supérieur à 7:1 entre le texte principal (`#0F2926`) et les fonds clairs (`#FFFFFF` / `#bae3d1`).</li>
                  <li><strong>Outils de confort intégrés :</strong> Agrandissement typographique (+12%), espacement adapté à la dyslexie et désactivation des animations en un clic dans l’en-tête.</li>
                  <li><strong>Accessibilité physique du Pop-Up Store :</strong> La Halle B de la Gare Saint-Sauveur à Lille est entièrement accessible de plain-pied (PMR), équipée d’une boucle magnétique et d’un comptoir d’essayage abaissé.</li>
                </ul>
              </div>
            )}

            {legalModal === 'mentions' && (
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <h3 id="legal-modal-title" className="text-xl font-extrabold text-[#0F2926]">
                  Mentions Légales & Crédits
                </h3>
                <p className="text-xs">
                  <strong>Co-éditeurs du projet :</strong> Vakita (Média indépendant d’investigation environnementale, Paris) & La Vie est Belt (Atelier d’accessoires en matières recyclées, Tourcoing — Hauts-de-France).
                </p>
                <p className="text-xs">
                  <strong>Confection & Façonnage :</strong> ESAT de Tourcoing (59200) et partenaires de collecte maritime du port de Boulogne-sur-Mer (62200).
                </p>
                <p className="text-xs">
                  <strong>Absence de vente à distance :</strong> Ce site constitue une vitrine d’information et de traçabilité. Les pièces de la collection capsule « Seconde Maille » sont proposées exclusivement en vente physique lors des Pop-Up Stores annoncés.
                </p>
              </div>
            )}

            {legalModal === 'confidentialite' && (
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <h3 id="legal-modal-title" className="text-xl font-extrabold text-[#0F2926]">
                  Politique de Confidentialité (RGPD)
                </h3>
                <p className="text-xs">
                  <strong>Zéro cookie publicitaire :</strong> Le site et l’application Seconde Maille ne déposent aucun traceur publicitaire ou cookie tiers de profilage.
                </p>
                <p className="text-xs">
                  <strong>Scan QR & Géolocalisation Pop-Up :</strong> La vérification du numéro de lot de votre coffret et l’affichage des Pop-Up Stores à proximité s’effectuent localement sans revente de données personnelles.
                </p>
              </div>
            )}

            {legalModal === 'charte' && (
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <h3 id="legal-modal-title" className="text-xl font-extrabold text-[#0F2926]">
                  Charte de Transparence : 100% des Bénéfices Reversés
                </h3>
                <p className="text-xs">
                  Pour chaque pièce vendue en Pop-Up Store (Ceinture à 65€, Bob à 42€, Sacoche à 58€, Porte-clés à 18€), la répartition financière est auditée et publiée en open-data dans l’application :
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Coûts directs de fabrication inclusive :</strong> Rémunération des travailleurs en situation de handicap à l’ESAT de Tourcoing, lavage et régénération des filets de pêche de Boulogne-sur-Mer.</li>
                  <li><strong>100% du bénéfice net :</strong> Intégralement reversé aux associations de récupération des filets fantômes et de protection de la faune marine.</li>
                </ul>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0F2926] text-[#bae3d1] font-extrabold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
