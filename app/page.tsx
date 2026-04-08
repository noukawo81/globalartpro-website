"use client"; // Obligatoire pour l'interactivité dans Next.js

import React, { useState } from 'react';
import { AlertCircle, Heart, Lock } from 'lucide-react';

const GlobalArtProLanding = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [piBalance, setPiBalance] = useState(3.1415);
  const [artcRewards, setArtcRewards] = useState(12);
  const [assetName, setAssetName] = useState("");
  const [culturalOrigin, setCulturalOrigin] = useState("");
  const [generatedImage, setGeneratedImage] = useState("https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000");

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    // Simulation du temps de calcul de l'IA (3 secondes)
    setTimeout(() => {
      setGeneratedImage("/masque-africain.jpg"); 
      setIsGenerating(false);
    }, 3000);
  };

  const handleMintClick = () => {
    if (!assetName || !culturalOrigin) {
      alert("Veuillez remplir le nom de l'asset et l'origine culturelle");
      return;
    }
    if (piBalance < 1.0) {
      alert("Solde Pi insuffisant. Vous avez besoin de 1.00 Pi minimum");
      return;
    }
    setShowMintModal(true);
  };

  const handleMintConfirm = async () => {
    setIsMinting(true);
    
    // Simulation de la transaction de mint (2 secondes)
    setTimeout(() => {
      // Déduire le frais de mint du solde Pi
      setPiBalance(prev => Math.round((prev - 1.0) * 10000) / 10000);
      // Augmenter les récompenses ARTC
      setArtcRewards(prev => prev + 12);
      
      setShowMintModal(false);
      setIsMinting(false);
      setAssetName("");
      setCulturalOrigin("");
      alert("NFT minté avec succès ! Vous avez gagné +12 ARTC");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-yellow-500/30">
      
      {/* 1. BANNIÈRE D'INFORMATION (TRANSPARENCE DEV) */}
      <div className="bg-yellow-600/10 border-b border-yellow-600/20 py-2 px-4 flex items-center justify-center gap-2 text-sm text-yellow-500">
        <AlertCircle size={16} />
        <span>🚀 <strong>Beta Phase:</strong> Our AI Engine is currently deploying. Watch the demo below!</span>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* 2. SECTION VIDÉO DÉMO (L'ÉLÉMENT PHARE) */}
        <section className="space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              See GapStudio AI in Action
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience how GlobalArtPro digitizes and secures world heritage on the Pi Blockchain.
            </p>
          </div>

          <div className="relative group max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(234,179,8,0.15)] transition-all hover:border-yellow-600/50">
            {/* Lecteur Vidéo Responsive */}
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/AtZYiasRfrQ"
                title="GlobalArtPro Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* BOUTON DE VOTE BRAINSTORM */}
          <div className="pt-4">
            <a 
              href="https://brainstorm.pinet.com/project/69d556585f9728e503bd6ed4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-600/20"
            >
              <Heart size={20} />
              Vote for us on Pi Brainstorm
            </a>
          </div>
        </section>

        <hr className="border-white/5 w-1/2 mx-auto" />

        {/* 3. APERÇU DE L'INTERFACE GAPSTUDIO (MODE INTERACTIF) */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Côté Prompt */}
            <div className="flex-1 space-y-4">
               <h3 className="text-xl font-bold text-yellow-500">GapStudio AI Engine v1.0</h3>
               <textarea 
                 disabled={isGenerating}
                 className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white resize-none disabled:text-gray-500"
                 placeholder="Golden Akan Royal Mask with 24k gold finish..."
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
               />
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating || !prompt}
                 className={`w-full py-4 font-bold rounded-xl transition-all transform active:scale-95 ${
                   isGenerating || !prompt
                     ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                     : 'bg-yellow-600 text-black hover:bg-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]'
                 }`}
               >
                 {isGenerating ? 'GENERATING...' : 'GENERATE ART'}
               </button>
            </div>

            {/* Côté Preview */}
            <div className="flex-1 aspect-square bg-black/50 border border-dashed border-white/20 rounded-2xl flex items-center justify-center p-4 relative">
               {isGenerating && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-2xl">
                   <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-yellow-500 font-medium mt-4 text-sm animate-pulse">GENERATING...</p>
                 </div>
               )}
               <img 
                 src={generatedImage} 
                 alt="Preview" 
                 className="max-h-full object-contain rounded-lg shadow-xl"
               />
            </div>
          </div>

          {/* Section Mint Asset */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold text-yellow-500 mb-4">Mint as NFT</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                type="text" 
                className="bg-black/50 border border-white/10 p-4 rounded-xl text-white placeholder:text-gray-500 focus:border-yellow-500 outline-none transition" 
                placeholder="Asset Name (e.g. Benin Bronze Head)"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
              />
              <select 
                className="bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none appearance-none cursor-pointer"
                value={culturalOrigin}
                onChange={(e) => setCulturalOrigin(e.target.value)}
              >
                <option value="">Select Cultural Origin</option>
                <option value="west-africa">West Africa (Akan/Benin)</option>
                <option value="oceania">Oceania (Maori)</option>
                <option value="pre-columbian">Pre-Columbian (Inca/Maya)</option>
              </select>
            </div>
            
            <div className="flex gap-4 mt-4">
              <div className="flex-1 bg-yellow-600/10 border border-yellow-600/20 p-3 rounded-lg">
                <p className="text-xs text-yellow-500/70 font-bold mb-1">MINTING FEE</p>
                <p className="text-lg font-bold text-yellow-500">1.00 Pi</p>
              </div>
              <div className="flex-1 bg-emerald-600/10 border border-emerald-600/20 p-3 rounded-lg">
                <p className="text-xs text-emerald-400/70 font-bold mb-1">CURRENT BALANCE</p>
                <p className="text-lg font-bold text-emerald-400">{piBalance.toFixed(4)} Pi</p>
              </div>
              <div className="flex-1 bg-purple-600/10 border border-purple-600/20 p-3 rounded-lg">
                <p className="text-xs text-purple-400/70 font-bold mb-1">YOU EARN</p>
                <p className="text-lg font-bold text-purple-400">+12 ARTC</p>
              </div>
            </div>

            <button 
              onClick={handleMintClick}
              disabled={isMinting || !assetName || !culturalOrigin || piBalance < 1.0}
              className={`w-full mt-4 py-3 rounded-xl font-bold transition-all transform active:scale-95 ${
                isMinting || !assetName || !culturalOrigin || piBalance < 1.0
                  ? 'bg-purple-900 text-purple-300 cursor-not-allowed opacity-50'
                  : 'bg-purple-600 text-white hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]'
              }`}
            >
              {isMinting ? "MINTING..." : "Mint on Pi Blockchain"}
            </button>
          </div>
        </section>

      </main>

      {/* MODALE DE CONFIRMATION MINT */}
      {showMintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1a1a1e] border border-white/10 rounded-3xl p-8 max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Confirm Mint</h3>
              <button 
                onClick={() => setShowMintModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Asset Name</p>
                <p className="text-white font-semibold">{assetName || "N/A"}</p>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Cultural Origin</p>
                <p className="text-white font-semibold">{culturalOrigin || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-purple-600/10 p-4 rounded-2xl border border-purple-600/20">
                  <p className="text-xs text-purple-300 uppercase font-bold mb-2">Minting Fee</p>
                  <p className="text-lg font-bold text-purple-400">1.00 Pi</p>
                </div>
                <div className="bg-yellow-600/10 p-4 rounded-2xl border border-yellow-600/20">
                  <p className="text-xs text-yellow-300 uppercase font-bold mb-2">You Earn</p>
                  <p className="text-lg font-bold text-yellow-400">+12 ARTC</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-600/10 p-3 rounded-lg border border-emerald-600/20">
                  <p className="text-xs text-emerald-300 uppercase font-bold mb-1">Current Balance</p>
                  <p className="text-sm font-bold text-emerald-400">{piBalance.toFixed(4)} Pi</p>
                </div>
                <div className="bg-emerald-600/10 p-3 rounded-lg border border-emerald-600/20">
                  <p className="text-xs text-emerald-300 uppercase font-bold mb-1">After Mint</p>
                  <p className="text-sm font-bold text-emerald-400">{(piBalance - 1.0).toFixed(4)} Pi</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowMintModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleMintConfirm}
                disabled={isMinting || piBalance < 1.0}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900 text-white rounded-xl font-bold transition disabled:opacity-50"
              >
                {isMinting ? "PROCESSING..." : "CONFIRM MINT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalArtProLanding;