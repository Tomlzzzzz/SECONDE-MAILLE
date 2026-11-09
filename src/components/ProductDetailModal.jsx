import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Ruler,
  Hammer,
  Recycle,
  Store
} from 'lucide-react';
import ProductVisual from './ProductVisual';

export default function ProductDetailModal({ product, onClose }) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  if (!product) return null;

  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const totalPopUpStock = product.sizes.reduce((acc, s) => acc + s.stockPopUp, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-soft-lg border border-zinc-200 max-w-4xl w-full overflow-hidden my-8 animate-in fade-in duration-200">
        {/* Barre supérieure épurée */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-2.5 py-1 rounded-full">
              Traçabilité • {product.id}
            </span>
            <span className="text-xs font-semibold text-zinc-400 hidden sm:inline">
              {product.batchNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-[#FFEA00] text-[#111111] flex items-center justify-center transition"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu en 2 colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Colonne Gauche : Photo + Profil Artisan + Impact */}
          <div className="md:col-span-5 bg-[#F8F9FA] border-b md:border-b-0 md:border-r border-zinc-100 flex flex-col justify-between">
            <div>
              <ProductVisual type={product.visualType} className="w-full h-72" />

              {/* Profil Artisan de La Belterie / AlterEos */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#12354A]">
                  <Hammer className="w-4 h-4" />
                  <span>Profil Artisan & Préparation (59)</span>
                </div>
                <h4 className="font-extrabold text-base text-[#111111] mt-1">
                  Façonné par {product.artisan.name}
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {product.artisan.workshop} • {product.artisan.timeSpent}
                </p>
                <blockquote className="mt-3 text-xs italic bg-white p-3.5 rounded-2xl border border-zinc-200/80 text-zinc-700">
                  « {product.artisan.quote} »
                </blockquote>
              </div>
            </div>

            {/* Impact Écologique */}
            <div className="p-6 bg-[#111111] text-white">
              <div className="flex items-center gap-2 text-[#FFEA00] text-xs font-extrabold uppercase tracking-wider">
                <Recycle className="w-4 h-4" />
                <span>Impact Matière Revalorisée</span>
              </div>
              <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                {product.impact}
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 text-[11px] font-semibold text-[#FFEA00]">
                Origine : {product.origin}
              </div>
            </div>
          </div>

          {/* Colonne Droite : Fiche détaillée, Tailles & Stocks Pop-Up */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-zinc-100 text-[#12354A] font-bold text-xs px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="bg-[#FFEA00] text-[#111111] font-extrabold text-xs px-3 py-1 rounded-full">
                  {totalPopUpStock} exemplaires dispo au Pop-Up
                </span>
              </div>

              <h2 className="font-extrabold text-2xl sm:text-3xl text-[#111111] mt-3 tracking-tight">
                {product.name}
              </h2>
              <p className="text-sm font-medium text-zinc-500 mt-1">
                {product.subtitle}
              </p>

              {/* Prix indicatif solidaire & Équivalent Points */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-zinc-200/80">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Don Solidaire Pop-Up
                  </span>
                  <span className="font-extrabold text-lg text-[#111111]">
                    {product.indicativePrice}
                  </span>
                </div>
                <div className="sm:border-l border-zinc-200 sm:pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Avantage Donateur Box QR
                  </span>
                  <span className="font-extrabold text-sm text-[#12354A]">
                    {product.pointsEquivalent}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              {/* Sélecteur de Tailles & Suivi de Stock Temps Réel */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-extrabold text-xs uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
                    <Ruler className="w-4 h-4 text-[#12354A]" />
                    <span>Tailles & Suivi de Stock en Direct (Pop-Up Lille)</span>
                  </label>
                  <span className="text-[11px] font-bold text-[#1F7A54] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1F7A54] animate-ping" />
                    Temps réel
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.sizes.map((sizeObj, idx) => {
                    const isSelected = idx === selectedSizeIndex;
                    return (
                      <button
                        key={sizeObj.label}
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FFEA00]/25 border-[#111111] ring-1 ring-[#111111]'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-extrabold text-[#111111]">
                            {sizeObj.label}
                          </div>
                          <div className="text-[10px] font-semibold text-zinc-500">
                            {sizeObj.status}
                          </div>
                        </div>
                        <span className="bg-[#111111] text-[#FFEA00] font-extrabold text-xs px-2.5 py-1 rounded-full">
                          {sizeObj.stockPopUp} dispo
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Composition */}
              <div className="mt-6">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Matières revalorisées dans cette pièce :
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-700">
                  {product.materials.map((mat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1F7A54] shrink-0" />
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Encart Zéro Commande en Ligne */}
            <div className="bg-[#FFEA00] rounded-2xl p-4 text-[#111111]">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#FFEA00] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-extrabold text-xs uppercase tracking-wide">
                    Pas de commande en ligne — Exclusivité Boutique Éphémère
                  </div>
                  <p className="text-xs text-zinc-900 mt-1 leading-relaxed">
                    Cette fiche vous permet de vérifier la disponibilité en direct ({currentSize.label} : <strong>{currentSize.stockPopUp} pièces en stock</strong>) avant votre venue au <strong>Pop-Up Gare Saint-Sauveur (Lille - 59)</strong>. L'intégralité des recettes est reversée aux associations partenaires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
