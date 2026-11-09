import React from 'react';

const PRODUCT_MEDIA = {
  belt: {
    photo: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    tag: "Pneu de vélo × Filet marin",
    originBadge: "Atelier Roubaix (59)"
  },
  hoodie: {
    photo: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    tag: "Coton Seconde Maille 450g",
    originBadge: "Tissé dans le Nord"
  },
  bag: {
    photo: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80",
    tag: "Filet ECONYL® & Chambre à air",
    originBadge: "La Belterie 59"
  },
  tshirt: {
    photo: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    tag: "Fibres recyclées des Box",
    originBadge: "Sérigraphie sans solvant"
  },
  keychain: {
    photo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    tag: "Zéro chute d'atelier",
    originBadge: "Gravé en direct au Pop-Up"
  },
  hat: {
    photo: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=900&q=80",
    tag: "Denim Box × Toile de filet",
    originBadge: "Réversible Pluie / Soleil"
  }
};

export default function ProductVisual({ type, className = "w-full h-64" }) {
  const media = PRODUCT_MEDIA[type] || PRODUCT_MEDIA.belt;

  return (
    <div className={`relative overflow-hidden bg-slate-100 group select-none ${className}`}>
      <img
        src={media.photo}
        alt={media.tag}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className="bg-white/95 backdrop-blur-md text-[#0F172A] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
          {media.originBadge}
        </span>
      </div>

      {/* Signature matière surlignée en bleu Vakita × La Vie est Belt */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="bg-[#38BDF8] text-[#0F172A] text-[11px] font-extrabold px-2.5 py-1 rounded-sm tracking-tight shadow-xs">
          {media.tag}
        </span>
        <span className="bg-[#0F172A]/85 backdrop-blur-xs text-[#38BDF8] text-[10px] font-bold px-2 py-1 rounded">
          59 × VAKITA
        </span>
      </div>
    </div>
  );
}
