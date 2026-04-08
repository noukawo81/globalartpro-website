'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WhiteScreen from '@/components/museum/WhiteScreen';
import CultureGallery from '@/components/museum/CultureGallery';
import { gallerySections } from '@/lib/museumData';

export default function MuseumPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isImmersion, setIsImmersion] = useState(false);

  // Empêcher le scroll quand une galerie est ouverte
  useEffect(() => {
    if (selectedRegion) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedRegion]);

  const selectedSection = gallerySections.find(
    (s) => s.region === selectedRegion
  );

  const handleCultureSelect = useCallback((region: string) => {
    setSelectedRegion(region);
    setIsImmersion(true);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setSelectedRegion(null);
    setIsImmersion(false);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-gold-500/30">
      
      {/* 1. Entrée du Musée (L'écran blanc spirituel) */}
      <section className="relative h-screen">
        <WhiteScreen onCultureSelect={handleCultureSelect} />
      </section>

      {/* 2. Modal de la Galerie avec Animation de Présence */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <CultureGallery
              section={selectedSection}
              isOpen={selectedRegion !== null}
              onClose={handleCloseGallery}
              isImmersion={isImmersion}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Section Statistiques & Prestige */}
      <section className="relative py-32 px-6 border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-20">
            <h2 className="text-gold-500 text-xs font-bold uppercase tracking-[0.4em] mb-4">
              L'Échelle du Projet
            </h2>
            <p className="text-4xl md:text-5xl font-serif italic text-white/90">
              Une collection sans frontières
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            {[
              { icon: '🎨', title: '500+', desc: "Trésors numérisés en haute définition" },
              { icon: '🌍', title: 'Global', desc: "L'héritage des 5 continents préservé" },
              { icon: '💎', title: 'Exclusif', desc: "Accès aux signatures sacrées via Pi" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold-500/30 transition-all duration-700"
              >
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent mb-2">
                  {stat.title}
                </p>
                <p className="text-gray-500 font-light leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 4. Carte d'Appel à l'Action (CTA) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative overflow-hidden p-12 rounded-[3rem] bg-gradient-to-br from-gold-600/10 via-transparent to-transparent border border-gold-500/20 text-center"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Devenez un Gardien du Patrimoine
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto font-light">
                Exposez vos créations dans notre musée digital et connectez-vous
                avec des collectionneurs du monde entier via le réseau Pi.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gold-500 hover:text-white transition-all duration-500 shadow-2xl shadow-gold-500/10"
              >
                Soumettre une Œuvre
              </motion.button>
            </div>
            
            {/* Effet de lueur en arrière-plan */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-gold-500/10 blur-[100px]" />
          </motion.div>
        </div>
      </section>

      {/* Footer minimaliste */}
      <footer className="py-12 text-center text-gray-700 text-[10px] uppercase tracking-[0.5em]">
        GlobalArtPro Museum • Sanctuary of History
      </footer>
    </main>
  );
}