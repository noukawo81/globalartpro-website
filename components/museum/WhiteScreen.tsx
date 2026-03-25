'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import PremiumGlobe from './PremiumGlobe';

interface WhiteScreenProps {
  onCultureSelect: (region: string) => void;
}

export default function WhiteScreen({ onCultureSelect }: WhiteScreenProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen bg-gradient-to-b from-white via-amber-50/50 to-white flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Subtle light effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large light circles */}
        <motion.div
          animate={
            !shouldReduceMotion
              ? {
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-yellow-200 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={
            !shouldReduceMotion
              ? {
                  opacity: [0.2, 0.4, 0.2],
                  scale: [1, 1.2, 1],
                }
              : {}
          }
          transition={{ duration: 10, delay: 1, repeat: Infinity }}
          className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-amber-100 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center space-y-8 max-w-4xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-black">
            Musée Digital
          </h1>
          <h2 className="text-2xl sm:text-3xl font-light text-gray-800">
            GlobalArtpro
          </h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="h-1 w-16 bg-gradient-to-r from-yellow-300 via-yellow-200 to-transparent mx-auto"
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-light"
        >
          Explorez les cultures du monde à travers une expérience artistique
          interactive et immersive.
        </motion.p>
      </motion.div>

      {/* Globe */}
      <div className="relative z-10 my-12 sm:my-16">
        <PremiumGlobe
          onCultureSelect={onCultureSelect}
          shouldReduceMotion={shouldReduceMotion || false}
        />
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center space-y-4"
      >
        <p className="text-sm sm:text-base text-gray-700 font-light">
          Cliquez sur une région pour explorer ses œuvres
        </p>

        {/* Scroll indicator */}
        {shouldReduceMotion ? (
          <div className="text-gray-500 text-sm">Naviguez vers le bas</div>
        ) : (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl text-yellow-400 opacity-60"
          >
            ↓
          </motion.div>
        )}
      </motion.div>

      {/* Decorative line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </motion.section>
  );
}
