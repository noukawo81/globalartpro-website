'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MuseumHeroProps {
  onImmersionClick?: () => void;
}

export default function MuseumHero({ onImmersionClick }: MuseumHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Animated background gradient */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-br from-black via-yellow-950/20 to-black pointer-events-none"
      />

      {/* Floating light orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 100, 0],
              y: [0, 100, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 2,
            }}
            className={`absolute w-96 rounded-full blur-3xl ${
              i === 0
                ? 'bg-yellow-600/20'
                : i === 1
                  ? 'bg-yellow-500/10'
                  : 'bg-yellow-400/5'
            }`}
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="text-4xl"
            >
              🏛️
            </motion.div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 bg-clip-text text-transparent">
              Musée Digital
            </h1>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/90">
            GlobalArtpro
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-yellow-200/80 max-w-2xl mx-auto"
          >
            Voyagez à travers les cultures et les œuvres du monde entier.
            <br />
            Une expérience immersive qui transcende les frontières.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onImmersionClick}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-bold rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg shadow-yellow-500/30"
          >
            🎪 Entrer en mode immersion
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-yellow-400 text-yellow-300 font-bold rounded-lg hover:bg-yellow-400/10 transition-all"
          >
            ↓ Explorer les galeries
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-yellow-300 text-3xl opacity-50">⬇</div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-yellow-500/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-yellow-400/5 rounded-full"
        />
      </div>
    </section>
  );
}
