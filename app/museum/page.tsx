'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import WhiteScreen from '@/components/museum/WhiteScreen';
import CultureGallery from '@/components/museum/CultureGallery';
import { gallerySections } from '@/lib/museumData';
import { GallerySection as GallerySectionType } from '@/types/museum';

export default function MuseumPage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isImmersion, setIsImmersion] = useState(false);

  const selectedSection = gallerySections.find(
    (s) => s.region === selectedRegion
  );

  const handleCultureSelect = useCallback((region: string) => {
    setSelectedRegion(region);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setSelectedRegion(null);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* White screen entry */}
      <WhiteScreen onCultureSelect={handleCultureSelect} />

      {/* Culture Gallery Modal */}
      {selectedSection && (
        <CultureGallery
          section={selectedSection}
          isOpen={selectedRegion !== null}
          onClose={handleCloseGallery}
          isImmersion={isImmersion}
        />
      )}

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative py-20 border-t border-gray-800/30 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: '🎨',
                title: '500+',
                desc: 'Œuvres d\'art numérique',
              },
              {
                icon: '🌍',
                title: '5 continents',
                desc: 'Traditions culturelles',
              },
              {
                icon: '👥',
                title: '1000+',
                desc: 'Créateurs et artistes',
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg bg-gradient-to-br from-gray-900/50 to-black border border-gray-800/50"
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <p className="text-3xl font-bold text-yellow-300 mb-2">
                  {stat.title}
                </p>
                <p className="text-gray-400">{stat.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="p-8 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              ✨ Rejoignez la révolution artistique
            </h3>
            <p className="text-gray-400 mb-6">
              Exposez vos créations dans notre musée digital et connectez-vous
              avec des collectionneurs du monde entier.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg shadow-yellow-500/30"
            >
              Exposer une œuvre
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
