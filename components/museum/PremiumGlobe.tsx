'use client';

import { useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CulturePoint {
  region: string;
  icon: string;
  angle: number;
  distance: number;
}

const culturePoints: CulturePoint[] = [
  { region: 'Afrique', icon: '🌍', angle: 0, distance: 120 },
  { region: 'Asie', icon: '🏯', angle: 72, distance: 120 },
  { region: 'Europe', icon: '⚜️', angle: 144, distance: 120 },
  { region: 'Amérique', icon: '🗽', angle: 216, distance: 120 },
  { region: 'Océanie', icon: '🏝️', angle: 288, distance: 120 },
];

interface PremiumGlobeProps {
  onCultureSelect: (region: string) => void;
  shouldReduceMotion: boolean;
}

export default function PremiumGlobe({
  onCultureSelect,
  shouldReduceMotion,
}: PremiumGlobeProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto"
    >
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/30 via-yellow-300/10 to-transparent blur-3xl" />

      {/* Glass sphere container */}
      <motion.div
        animate={!shouldReduceMotion ? { rotateZ: 360 } : {}}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm border-2 border-white/30 shadow-2xl flex items-center justify-center"
      >
        {/* Inner core light */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-yellow-200/40 to-transparent" />

        {/* Central glow point */}
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-100 blur-2xl opacity-60" />
        <div className="absolute w-6 h-6 rounded-full bg-yellow-200" />
      </motion.div>

      {/* Culture points orbiting */}
      {culturePoints.map((point, idx) => {
        const x = Math.cos((point.angle * Math.PI) / 180) * point.distance;
        const y = Math.sin((point.angle * Math.PI) / 180) * point.distance;

        return (
          <motion.div
            key={point.region}
            animate={!shouldReduceMotion ? { rotateZ: -360 } : {}}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: '50%',
              top: '50%',
              x,
              y,
            }}
            className="absolute"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.3 }}
              onHoverStart={() => setHoveredRegion(point.region)}
              onHoverEnd={() => setHoveredRegion(null)}
              onClick={() => onCultureSelect(point.region)}
              className="w-16 h-16 sm:w-20 sm:h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-yellow-300/40 to-yellow-200/20 backdrop-blur-md border border-yellow-300/50 flex items-center justify-center text-3xl sm:text-4xl hover:from-yellow-300/60 hover:to-yellow-200/40 transition-all duration-300 cursor-pointer shadow-xl shadow-yellow-400/20"
            >
              <motion.span
                animate={
                  hoveredRegion === point.region && !shouldReduceMotion
                    ? { scale: 1.2, rotate: 10 }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.3 }}
              >
                {point.icon}
              </motion.span>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  hoveredRegion === point.region
                    ? { opacity: 1, y: -60 }
                    : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.2 }}
                className="absolute bottom-full whitespace-nowrap px-3 py-2 rounded-lg bg-black/80 text-yellow-300 text-xs font-semibold backdrop-blur-sm border border-yellow-300/30 pointer-events-none"
              >
                {point.region}
              </motion.div>

              {/* Glow on hover */}
              {hoveredRegion === point.region && (
                <motion.div
                  layoutId={`glow-${point.region}`}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/40 to-transparent blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
          </motion.div>
        );
      })}

      {/* Orbital rings */}
      {!shouldReduceMotion && (
        <>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            <circle
              cx="200"
              cy="200"
              r="120"
              fill="none"
              stroke="url(#orbitGradient)"
              strokeWidth="1"
              opacity="0.3"
            />
            <circle
              cx="200"
              cy="200"
              r="90"
              fill="none"
              stroke="url(#orbitGradient)"
              strokeWidth="0.5"
              opacity="0.2"
            />
            <defs>
              <linearGradient
                id="orbitGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}
    </motion.div>
  );
}
