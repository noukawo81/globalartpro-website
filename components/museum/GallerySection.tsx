'use client';

import { motion } from 'framer-motion';
import { GallerySection as GallerySectionType } from '@/types/museum';
import ArtworkCard from './ArtworkCard';

interface GallerySectionProps {
  section: GallerySectionType;
  index: number;
}

export default function GallerySection({ section, index }: GallerySectionProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative py-20 sm:py-32 border-b border-gray-800/30 scroll-mt-20"
      id={`gallery-${section.region.toLowerCase()}`}
    >
      {/* Subtle background gradient per section */}
      <div
        className={`absolute inset-0 pointer-events-none opacity-20 ${
          index === 0
            ? 'bg-gradient-to-b from-yellow-500/10 to-transparent'
            : index === 1
              ? 'bg-gradient-to-b from-amber-500/5 to-transparent'
              : index === 2
                ? 'bg-gradient-to-b from-orange-500/5 to-transparent'
                : 'bg-gradient-to-b from-yellow-500/5 to-transparent'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center ${
            isEven ? 'lg:grid-cols-2' : 'lg:grid-cols-2'
          }`}
        >
          {/* Text content */}
          <div
            className={isEven ? 'order-1' : 'lg:order-2'}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block text-5xl"
              >
                {section.icon}
              </motion.div>

              <h2 className="text-4xl sm:text-5xl font-bold text-white">
                {section.title}
              </h2>

              <p className="text-lg text-gray-400 leading-relaxed">
                {section.description}
              </p>

              {section.ambiance && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-4 border-l-2 border-yellow-500 pl-4"
                >
                  <p className="text-yellow-300/80 italic text-sm">
                    "{section.ambiance}"
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg shadow-yellow-500/30"
              >
                Parcourir {section.region}
              </motion.button>
            </div>
          </div>

          {/* Featured artwork */}
          <div
            className={isEven ? 'order-2' : 'lg:order-1'}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-yellow-500/30 bg-gradient-to-br from-gray-900 to-black">
                <ArtworkCard artwork={section.artworks[0]} />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 border border-yellow-500/10 rounded-2xl pointer-events-none"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Artworks Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Œuvres en exhibition
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.artworks.map((artwork, idx) => (
              <ArtworkCard key={artwork.id} artwork={artwork} index={idx} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
