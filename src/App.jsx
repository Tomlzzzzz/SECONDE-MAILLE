import React, { useEffect, useRef, useState } from 'react';
import SiteNav from './components/SiteNav';
import SiteFooter, { LegalModal } from './components/SiteFooter';
import { NextBand } from './components/Blocks';
import { MotionContext, usePrefersReducedMotion, ScrollProgress, CursorBubble } from './components/Motion';
import HomePage from './pages/HomePage';
import BrandsPage from './pages/BrandsPage';
import BoxPage from './pages/BoxPage';
import PopupPage from './pages/PopupPage';
import ReportagesPage from './pages/ReportagesPage';
import { SITE_PAGES } from './data/siteContent';
import { SecondeMailleLogo, Mascot } from './components/Brand';

/* Rideau-vague affiché pendant le changement de page */
function PageCurtain({ phase, label }) {
  const wave = (fill) => (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,90 L0,45 C240,0 480,0 720,45 C960,90 1200,90 1440,45 L1440,90 Z" fill={fill} />
    </svg>
  );
  const waveBottom = (fill) => (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,0 L0,45 C240,90 480,90 720,45 C960,0 1200,0 1440,45 L1440,0 Z" fill={fill} />
    </svg>
  );
  return (
    <div className={`page-curtain ${phase ? `is-active is-${phase}` : ''}`} aria-hidden="true">
      <div className="curtain-layer curtain-layer--aqua">
        {wave('#bae3d1')}
        <div className="curtain-body bg-[#bae3d1]" />
        {waveBottom('#bae3d1')}
      </div>
      <div className="curtain-layer curtain-layer--ink">
        {wave('#194080')}
        <div className="curtain-body bg-[#194080]" />
        {waveBottom('#194080')}
        {label && (
          <div className="curtain-label">
            <div className="text-center flex flex-col items-center px-6">
              <Mascot className="w-20 sm:w-24 mb-5 curtain-mascot" />
              <p className="font-display text-xl text-[#bae3d1]/60">{label.num}</p>
              <p className="font-display uppercase text-[clamp(40px,8vw,120px)] leading-none">{label.label}</p>
              <SecondeMailleLogo light className="h-8 sm:h-10 mt-6 opacity-90" alt="" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* La mascotte sort de l'eau pour remonter en haut de page */
function BackToSurface({ reduce }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.2);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
      className={`mascot-top ${show ? 'is-visible' : ''}`}
      aria-label="Remonter en haut de la page"
      tabIndex={show ? 0 : -1}
    >
      <span className="mascot-tip px-3 py-1.5 rounded-full bg-[#0F2926] text-[#bae3d1] text-xs font-bold">Remonter à la surface</span>
      <Mascot alt="" />
    </button>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('accueil');
  const [legalModal, setLegalModal] = useState(null);

  // Accessibilité RGAA
  const [largeText, setLargeText] = useState(false);
  const [dyslexicSpacing, setDyslexicSpacing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const reduce = reduceMotion || prefersReduced;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('a11y-large-text', largeText);
    root.classList.toggle('a11y-dyslexic-spacing', dyslexicSpacing);
    root.classList.toggle('a11y-reduce-motion', reduceMotion);
  }, [largeText, dyslexicSpacing, reduceMotion]);

  // Transition entre pages
  // Intro au lancement : la vague recouvre l'écran puis se retire (une fois par session)
  const firstVisit = (() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      return !sessionStorage.getItem('sm-intro');
    } catch {
      return false;
    }
  })();
  const [curtain, setCurtain] = useState(firstVisit ? 'hold' : null); // null | 'hold' | 'in' | 'out'
  const [curtainLabel, setCurtainLabel] = useState(firstVisit ? { num: '20.03.2027 · Roubaix', label: 'Seconde Maille' } : null);
  const busy = useRef(firstVisit);
  useEffect(() => {
    if (!firstVisit) return;
    try {
      sessionStorage.setItem('sm-intro', '1');
    } catch {
      /* stockage indisponible */
    }
    const t1 = setTimeout(() => setCurtain('out'), 1300);
    const t2 = setTimeout(() => {
      setCurtain(null);
      busy.current = false;
    }, 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const navigateToPage = (pageId) => {
    if (busy.current) return;
    if (pageId === activePage) {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    if (reduce) {
      setActivePage(pageId);
      window.scrollTo(0, 0);
      return;
    }
    busy.current = true;
    setCurtainLabel(SITE_PAGES.find((p) => p.id === pageId));
    setCurtain('in');
    setTimeout(() => {
      setActivePage(pageId);
      window.scrollTo(0, 0);
      setCurtain('out');
      setTimeout(() => {
        setCurtain(null);
        busy.current = false;
      }, 800);
    }, 950);
  };

  const pages = {
    accueil: <HomePage onNavigate={navigateToPage} />,
    marques: <BrandsPage onNavigate={navigateToPage} />,
    'appli-box': <BoxPage />,
    'popup-merch': <PopupPage />,
    reportages: <ReportagesPage />
  };

  return (
    <MotionContext.Provider value={{ reduce }}>
      <div className="min-h-screen bg-white text-[#0F2926] flex flex-col">
        <a href="#main-content" className="skip-link">
          Aller directement au contenu principal
        </a>

        <ScrollProgress />
        <BackToSurface reduce={reduce} />
        <CursorBubble />

        <SiteNav
          activePage={activePage}
          onNavigate={navigateToPage}
          a11y={{ largeText, setLargeText, dyslexicSpacing, setDyslexicSpacing, reduceMotion, setReduceMotion }}
        />

        <main id="main-content" role="main" key={activePage} className="flex-1">
          {pages[activePage]}
          <NextBand activePage={activePage} onNavigate={navigateToPage} />
        </main>

        <SiteFooter onNavigate={navigateToPage} onLegal={setLegalModal} />

        <LegalModal id={legalModal} onClose={() => setLegalModal(null)} />
        <PageCurtain phase={curtain} label={curtainLabel} />
      </div>
    </MotionContext.Provider>
  );
}
