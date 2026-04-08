'use client'; // Indique que c'est une page interactive

import React from 'react';

// Ce code définit ce qu'un certificat doit contenir
export default function CertificatePage({ params }: { params: { id: string } }) {
  // Ici, on imagine les données de l'œuvre (plus tard, elles viendront de ta base de données)
  const artworkData = {
    id: params.id,
    title: "Masque Sacré du Haut-Nkam",
    origin: "Région de l'Ouest, Cameroun",
    guardian: "Chefferie Traditionnelle",
    dateCertified: "03 Avril 2026",
    authenticityHash: "G-ART-PRO-8829-X92", // C'est la signature blockchain
    description: "Cet objet incarne la sagesse des ancêtres. Il est certifié unique et inaliénable par le protocole GlobalArtPro."
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] p-8 font-sans text-[#2c2c2c]">
      {/* CADRE DU CERTIFICAT */}
      <div className="max-w-3xl mx-auto border-8 border-[#d4af37] bg-white p-12 shadow-2xl relative">
        
        {/* FILIGRANE DE SÉCURITÉ EN ARRIÈRE-PLAN */}
        <div className="absolute inset-0 opacity-5 flex items-center justify-center pointer-events-none text-9xl font-bold rotate-12">
          GLOBALARTPRO
        </div>

        {/* EN-TÊTE */}
        <div className="text-center mb-10">
          <h1 className="text-sm tracking-[0.3em] uppercase text-[#d4af37] font-bold mb-2">Certificat d'Authenticité Numérique</h1>
          <div className="h-1 w-24 bg-[#d4af37] mx-auto"></div>
        </div>

        {/* CORPS DU CERTIFICAT */}
        <div className="space-y-8 relative z-10">
          <div className="flex justify-between items-end border-b border-stone-200 pb-4">
            <div>
              <p className="text-xs uppercase text-stone-400">Nom de l'œuvre</p>
              <h2 className="text-2xl font-serif font-bold">{artworkData.title}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-stone-400">ID Unique</p>
              <p className="font-mono text-sm">#{artworkData.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs uppercase text-stone-400">Provenance Heritage</p>
              <p className="font-medium">{artworkData.origin}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-stone-400">Gardien de l'œuvre</p>
              <p className="font-medium">{artworkData.guardian}</p>
            </div>
          </div>

          <div className="py-6 border-t border-b border-stone-100 italic text-stone-600 leading-relaxed">
            "{artworkData.description}"
          </div>

          <div className="flex justify-between items-center pt-6">
            <div>
              <p className="text-xs uppercase text-stone-400">Date de Certification</p>
              <p className="font-medium">{artworkData.dateCertified}</p>
            </div>
            {/* ICI ON POURRAIT METTRE UN QR CODE PLUS TARD */}
            <div className="w-20 h-20 bg-stone-100 border border-stone-200 flex items-center justify-center text-[8px] text-center p-2 text-stone-400 uppercase">
              QR Code Sécurisé
            </div>
          </div>
        </div>

        {/* BAS DE PAGE - SIGNATURE INVISIBLE */}
        <div className="mt-12 pt-8 border-t-2 border-[#d4af37] flex justify-between items-center">
          <div className="text-[10px] font-mono text-stone-400">
            HASH: {artworkData.authenticityHash}
          </div>
          <div className="text-right italic font-serif text-stone-800">
            L'Architecte Invisible
          </div>
        </div>
      </div>

      {/* BOUTON DE RETOUR */}
      <div className="text-center mt-12">
        <button onClick={() => window.print()} className="text-sm text-stone-400 hover:text-[#d4af37] transition-colors underline decoration-dotted">
          Imprimer une copie physique
        </button>
      </div>
    </div>
  );
}