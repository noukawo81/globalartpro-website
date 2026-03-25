'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GallerySection } from '@/types/museum';
import ArtworkCard from './ArtworkCard';
import { useReducedMotion } from 'framer-motion';

interface CultureGalleryProps {
  section: GallerySection;
  isOpen: boolean;
  onClose: () => void;
  isImmersion: boolean;
}

export default function CultureGallery({
  section,
  isOpen,
  onClose,
  isImmersion,
}: CultureGalleryProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          {!isImmersion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
          )}

          {/* Gallery section */}
          <motion.div
            initial={{
              opacity: 0,
              y: isImmersion ? 0 : 100,
              x: isImmersion ? 100 : 0,
            }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{
              opacity: 0,
              y: isImmersion ? 0 : 100,
              x: isImmersion ? 100 : 0,
            }}
            transition={{ duration: 0.4 }}
            className={`relative z-50 ${
              isImmersion
                ? 'fixed inset-0 bg-black'
                : 'fixed inset-0 sm:inset-4 md:inset-8 lg:inset-12 rounded-2xl bg-gradient-to-b from-gray-900 to-black overflow-y-auto'
            }`}
          >
            {/* Header */}
            {!isImmersion && (
              <div className="sticky top-0 z-50 bg-gradient-to-b from-gray-900 to-gray-900/80 backdrop-blur-md border-b border-gray-800/50 px-6 sm:px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{section.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {section.title}
                    </h2>
                    <p className="text-sm text-gray-400">{section.region}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-white transition-colors"
                >
                  ✕
                </motion.button>
              </div>
            )}

            {/* Content */}
            <div className={isImmersion ? 'h-full' : ''}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Section intro */}
                {!isImmersion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 space-y-4"
                  >
                    <p className="text-lg text-gray-400 leading-relaxed">
                      {section.description}
                    </p>
                    {section.ambiance && (
                      <motion.div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                        <p className="text-yellow-300 italic text-sm">
                          🎭 {section.ambiance}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Artworks grid */}
                <motion.div
                  layout
                  className={`grid gap-6 ${
                    isImmersion
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {section.artworks.map((artwork, idx) => (
                      <motion.div
                        key={artwork.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: shouldReduceMotion ? 0.1 : 0.4,
                          delay: shouldReduceMotion ? 0 : idx * 0.05,
                        }}
                        layout
                      >
                        <ArtworkCard artwork={artwork} index={idx} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* Close button for immersion */}
            {isImmersion && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="fixed top-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg shadow-yellow-500/30"
              >
                ✕ Fermer
              </motion.button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
