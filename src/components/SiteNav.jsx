import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Accessibility, MapPin, Menu, X, ArrowUpRight } from 'lucide-react';
import { CollabBadge } from './BrandLogos';
import { SecondeMailleLogo } from './Brand';
import { SITE_PAGES } from '../data/siteContent';

export default function SiteNav({
  activePage,
  onNavigate,
  a11y: { largeText, setLargeText, dyslexicSpacing, setDyslexicSpacing, reduceMotion, setReduceMotion }
}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  /* Nav qui se cache en descendant et revient en remontant */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > last && y > 320);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  /* Indicateurs glissants (page active + survol) */
  const pillsRef = useRef(null);
  const btnRefs = useRef({});
  const [ind, setInd] = useState({ left: 0, width: 0 });
  const [hov, setHov] = useState({ left: 0, width: 0, show: false });
  const measure = (id) => {
    const b = btnRefs.current[id];
    return b ? { left: b.offsetLeft, width: b.offsetWidth } : { left: 0, width: 0 };
  };
  useLayoutEffect(() => {
    const update = () => setInd(measure(activePage));
    update();
    window.addEventListener('resize', update);
    document.fonts?.ready?.then(update);
    return () => window.removeEventListener('resize', update);
  }, [activePage]);

  const go = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  const a11yActive = largeText || dyslexicSpacing || reduceMotion;

  return (
    <>
      <header role="banner" className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !a11yOpen && !menuOpen ? 'is-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="site-nav-bar">
            <button
              onClick={() => go('accueil')}
              aria-label="Retour à l'accueil Seconde Maille (Vakita x La Vie est Belt)"
              className="shrink-0 flex items-center gap-2.5 min-w-0 pl-1.5 group"
            >
              <SecondeMailleLogo className="h-8 sm:h-9 transition-transform duration-500 group-hover:-rotate-2" alt="" />
              <span className="hidden sm:block 2xl:block xl:hidden">
                <CollabBadge size="sm" />
              </span>
            </button>

            <nav
              ref={pillsRef}
              aria-label="Navigation principale"
              className="nav-pills hidden xl:flex"
              onMouseLeave={() => setHov((h) => ({ ...h, show: false }))}
            >
              <span className="nav-hover" style={{ left: hov.left, width: hov.width, opacity: hov.show ? 1 : 0 }} aria-hidden="true" />
              <span className="nav-indicator" style={{ left: ind.left, width: ind.width }} aria-hidden="true" />
              {SITE_PAGES.map((page) => {
                const isActive = activePage === page.id;
                return (
                  <button
                    key={page.id}
                    ref={(el) => { btnRefs.current[page.id] = el; }}
                    onClick={() => go(page.id)}
                    onMouseEnter={() => setHov({ ...measure(page.id), show: !isActive })}
                    aria-current={isActive ? 'page' : undefined}
                    className={`nav-pill ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="nav-num" aria-hidden="true">{page.num}</span>
                    {page.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setA11yOpen((v) => !v)}
                aria-expanded={a11yOpen}
                aria-controls="a11y-toolbar"
                title="Options d'accessibilité"
                className={`w-10 h-10 rounded-full grid place-items-center border transition-colors duration-300 ${
                  a11yOpen || a11yActive
                    ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]'
                    : 'bg-white/70 text-[#0F2926] border-[#bae3d1] hover:bg-[#bae3d1]'
                }`}
              >
                <Accessibility className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Accessibilité</span>
              </button>

              <span className="hidden md:block">
                <button onClick={() => go('popup-merch')} className="btn btn-ink btn-sm">
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pop-Up · 20.03.27</span>
                </button>
              </span>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="xl:hidden w-10 h-10 rounded-full grid place-items-center bg-[#0F2926] text-[#bae3d1] relative z-[60]"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span className="sr-only">{menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
              </button>
            </div>
          </div>

          {/* Barre d'outils accessibilité */}
          {a11yOpen && (
            <div
              id="a11y-toolbar"
              role="region"
              aria-label="Paramètres de confort visuel et d'accessibilité"
              className="modal-panel mt-2 rounded-3xl bg-white/95 backdrop-blur border border-[#bae3d1] shadow-soft-lg px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            >
              <p className="text-xs font-extrabold text-[#0F2926] flex items-center gap-2">
                <Accessibility className="w-4 h-4" aria-hidden="true" />
                Confort de lecture (RGAA 4.1 / WCAG AA)
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ['Texte agrandi (+12%)', largeText, setLargeText],
                  ['Confort dyslexie / interlignage', dyslexicSpacing, setDyslexicSpacing],
                  ['Réduire les animations', reduceMotion, setReduceMotion]
                ].map(([label, on, set]) => (
                  <button
                    key={label}
                    onClick={() => set((v) => !v)}
                    aria-pressed={on}
                    className={`px-3.5 py-2 rounded-full text-xs font-extrabold border transition-colors duration-300 ${
                      on ? 'bg-[#0F2926] text-[#bae3d1] border-[#0F2926]' : 'bg-white text-[#0F2926] border-slate-300 hover:border-[#0F2926]'
                    }`}
                  >
                    {label} {on ? '✓' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Menu mobile plein écran (révélation circulaire) */}
      <div id="mobile-menu" className={`mobile-menu xl:hidden ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Navigation mobile" className="h-full overflow-y-auto flex flex-col justify-center px-7 py-24 gap-1 max-w-xl">
          {SITE_PAGES.map((page, i) => (
            <button
              key={page.id}
              onClick={() => go(page.id)}
              tabIndex={menuOpen ? 0 : -1}
              aria-current={activePage === page.id ? 'page' : undefined}
              className="mobile-menu-link text-left flex items-baseline gap-4 py-2 group"
              style={{ transitionDelay: menuOpen ? `${250 + i * 70}ms` : '0ms' }}
            >
              <span className="font-display text-sm text-[#bae3d1]/60">{page.num}</span>
              <span className={`font-display text-[clamp(34px,9vw,56px)] leading-none uppercase ${activePage === page.id ? 'text-[#bae3d1]' : 'text-white'}`}>
                {page.label}
              </span>
            </button>
          ))}
          <button
            onClick={() => go('popup-merch')}
            tabIndex={menuOpen ? 0 : -1}
            className="mobile-menu-link btn btn-aqua mt-8 self-start"
            style={{ transitionDelay: menuOpen ? '650ms' : '0ms' }}
          >
            Pop-Up · 20 mars 2027 <ArrowUpRight className="w-4 h-4 btn-arrow" />
          </button>
        </nav>
      </div>
    </>
  );
}
