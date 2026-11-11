import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { CollabBadge } from './BrandLogos';
import { SecondeMailleLogo, Mascot } from './Brand';
import { SITE_PAGES, EVENT } from '../data/siteContent';

const LEGAL = {
  rgaa: {
    title: 'Déclaration d’accessibilité (RGAA 4.1 / WCAG 2.1 AA)',
    body: (
      <>
        <p>
          Vakita et La Vie est Belt souhaitent rendre le site <strong>Seconde Maille</strong> accessible à toutes et tous.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs">
          <li><strong>Navigation au clavier :</strong> lien d’évitement en début de page et contour de focus visible sur tous les éléments interactifs.</li>
          <li><strong>Contrastes :</strong> texte principal #0F2926 sur fonds clairs.</li>
          <li><strong>Outils de confort :</strong> agrandissement du texte (+12%), espacement dyslexie et désactivation des animations depuis l’en-tête. La préférence système « réduire les animations » est aussi respectée.</li>
        </ul>
      </>
    )
  },
  mentions: {
    title: 'Mentions légales & crédits',
    body: (
      <>
        <p className="text-xs"><strong>Co-éditeurs :</strong> Vakita (média engagé) & La Vie est Belt (accessoires upcyclés).</p>
        <p className="text-xs"><strong>Cartographie :</strong> fonds de carte, itinéraires et données de proximité © contributeurs OpenStreetMap (licence ODbL) ; affichage avec Leaflet.</p>
      </>
    )
  },
  confidentialite: {
    title: 'Confidentialité',
    body: (
      <>
        <p className="text-xs"><strong>Aucun cookie publicitaire</strong> n’est déposé par le site.</p>
        <p className="text-xs">
          <strong>Géolocalisation :</strong> votre position n’est demandée que si vous cliquez sur « Me localiser ». Elle n’est pas enregistrée : elle est uniquement envoyée au
          service d’itinéraire d’OpenStreetMap (routing.openstreetmap.de) pour calculer le trajet, et vers Google Maps si vous choisissez d’y ouvrir le guidage.
        </p>
        <p className="text-xs"><strong>Newsletter :</strong> l’adresse e-mail saisie sert uniquement à vous prévenir des actualités Seconde Maille.</p>
      </>
    )
  }
};

export function LegalModal({ id, onClose }) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [id, onClose]);
  if (!id) return null;
  const c = LEGAL[id];
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" className="modal-backdrop fixed inset-0 z-[75] flex items-center justify-center p-4 bg-[#0F2926]/75 backdrop-blur-sm" onClick={onClose}>
      <div className="modal-panel bg-white rounded-[36px] max-w-2xl w-full p-7 sm:p-9 shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h3 id="legal-modal-title" className="font-display uppercase text-3xl leading-[0.95] text-[#0F2926]">{c.title}</h3>
          <button onClick={onClose} aria-label="Fermer la fenêtre d'information" className="w-10 h-10 rounded-full bg-[#F5FBF9] hover:bg-[#0F2926] hover:text-[#bae3d1] grid place-items-center shrink-0 transition-colors duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-slate-700 leading-relaxed mt-6">{c.body}</div>
      </div>
    </div>
  );
}

export default function SiteFooter({ onNavigate, onLegal }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail('');
  };

  return (
    <footer role="contentinfo" className="bg-[#F5FBF9] text-[#0F2926] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-end gap-4">
              <SecondeMailleLogo className="h-14 sm:h-16" />
              <Mascot className="w-14 sm:w-16 -mb-1 transition-transform duration-500 hover:-rotate-12 hover:scale-110" />
            </div>
            <CollabBadge />
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong className="text-[#0F2926]">Seconde Maille</strong> réunit <strong className="text-[#0F2926]">Vakita</strong> et{' '}
              <strong className="text-[#0F2926]">La Vie est Belt</strong> pour donner une seconde vie aux matières — à commencer par les filets de pêche — et faire entendre la cause du vaquita.
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0F2926]/60 mb-4">Plan du site</h2>
            <ul className="space-y-2.5">
              {SITE_PAGES.map((p) => (
                <li key={p.id}>
                  <button onClick={() => onNavigate(p.id)} className="group flex items-center gap-2 text-sm font-bold">
                    <span className="font-display text-xs text-[#0D9488]">{p.num}</span>
                    <span className="link-line">{p.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0F2926]/60 mb-4">Pop-Up Store</h2>
            <p className="font-extrabold">{EVENT.dateLabel}</p>
            <p className="text-sm text-slate-600">{EVENT.address}</p>
            <p className="text-sm text-slate-600 mt-3">
              <span className="font-bold text-[#0F2926]">Box de dépôt</span> dès le {EVENT.boxDateLabel}
            </p>
            <p className="text-xs text-[#194080] font-bold mt-3">Entrée : un matériau déposé</p>
          </div>

          <div className="lg:col-span-3">
            <h2 id="footer-newsletter" className="scroll-mt-28 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0F2926]/60 mb-4">Restez informé·e</h2>
            <p className="text-sm text-slate-600 leading-relaxed">Un e-mail pour l’ouverture des box, l’inauguration du pop-up et les contenus Vakita.</p>
            {sent ? (
              <p className="modal-panel mt-4 p-3.5 rounded-2xl bg-[#bae3d1] text-sm font-bold">✓ Merci, vous êtes inscrit·e !</p>
            ) : (
              <form onSubmit={submit} className="mt-4">
                <label htmlFor="footer-email" className="sr-only">Votre adresse e-mail</label>
                <div className="email-field flex items-center gap-1 p-1.5 pl-2 rounded-full bg-white border-2 border-[#bae3d1] transition-[border-color,box-shadow] duration-300">
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.fr"
                    className="email-input flex-1 min-w-0 h-10 bg-transparent px-3 text-sm text-[#0F2926] placeholder:text-slate-400"
                  />
                  <button type="submit" aria-label="S'inscrire" className="w-10 h-10 rounded-full bg-[#0F2926] text-[#bae3d1] grid place-items-center hover:bg-[#0D9488] transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                ['vakita.fr', 'https://www.vakita.fr'],
                ['lavieestbelt.fr', 'https://www.lavieestbelt.fr']
              ].map(([l, h]) => (
                <a key={h} href={h} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-[#0F2926]/20 text-xs font-bold hover:bg-[#0F2926] hover:text-[#bae3d1] transition-colors inline-flex items-center gap-1">
                  {l} <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mot-signature géant — en SVG pour toujours tenir dans la largeur de l'écran */}
      <div className="px-3 sm:px-6 select-none" aria-hidden="true">
        <svg viewBox="0 0 1000 120" className="footer-wordmark w-full h-auto block">
          <text x="500" y="104" textAnchor="middle" textLength="990" lengthAdjust="spacingAndGlyphs">
            SECONDE MAILLE
          </text>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6 lg:pr-24 border-t border-[#0F2926]/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <button onClick={() => onLegal('rgaa')} className="link-line font-semibold hover:text-[#0F2926]">Accessibilité : RGAA 4.1 / WCAG 2.1 AA</button>
          <button onClick={() => onLegal('mentions')} className="link-line hover:text-[#0F2926]">Mentions légales</button>
          <button onClick={() => onLegal('confidentialite')} className="link-line hover:text-[#0F2926]">Confidentialité</button>
        </div>
        <p>© 2027 Seconde Maille — Vakita × La Vie est Belt</p>
      </div>
    </footer>
  );
}
