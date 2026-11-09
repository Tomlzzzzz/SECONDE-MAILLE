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
    <div className={`relative overflow-hidden bg-[#F4F4F6] group select-none ${className}`}>
      {/* Photo produit éditoriale avec zoom fluide au survol */}
      <img
        src={media.photo}
        alt={media.tag}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Dégradé subtil en bas pour la lisibilité des badges */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Badge origine en haut à gauche */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className="bg-white/95 backdrop-blur-md text-[#111111] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
          {media.originBadge}
        </span>
      </div>

      {/* Signature matière surlignée en jaune Vakita en bas à gauche */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="bg-[#FFEA00] text-[#111111] text-[11px] font-extrabold px-2.5 py-1 rounded-sm tracking-tight shadow-xs">
          {media.tag}
        </span>
        <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded">
          59 × VAKITA
        </span>
      </div>
    </div>
  );
}
