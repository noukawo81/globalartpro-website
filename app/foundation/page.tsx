'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MinimalMuseum from './MinimalMuseum';

const impactItems = [
  { 
    title: 'Renaissance Artistique', 
    description: "Nous transformons le talent brut en signatures mondiales via l'IA et le support financier.", 
    icon: '✨' 
  },
  { 
    title: 'Archives Éternelles', 
    description: "Numérisation 3D du patrimoine sacré pour qu'il ne disparaisse jamais de la mémoire humaine.", 
    icon: '🏺' 
  },
  { 
    title: 'Unité Humanitaire', 
    description: "Chaque interaction sur GlobalArtPro nourrit directement nos projets de solidarité en Afrique.", 
    icon: '🌍' 
  },
];

export default function FoundationPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const transitionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const transitionScroll = useScroll({
    target: transitionRef,
    offset: ["start end", "end start"]
  });

  // Effet de parallaxe pour le titre
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Transition vers la 3D
  const museumOpacity = useTransform(transitionScroll.scrollYProgress, [0.3, 1], [0, 1]);
  const textOpacity = useTransform(transitionScroll.scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-gold-500/30">
      
      {/* SECTION HERO : LA VISION */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ y: yTitle, opacity: opacityHero }} className="z-10 text-center">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-gold-500 text-xs font-bold uppercase tracking-[0.5em] mb-4 block"
          >
            Le Cœur de GlobalArtPro
          </motion.span>
          
          <motion.h1 
            className="text-5xl md:text-8xl font-serif italic mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent"
          >
            Fondation GlobalArtPro
          </motion.h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed">
            "La gratitude d'être vivant se traduit par l'art. Nous ne créons pas seulement des images, nous préservons l'âme d'une civilisation."
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => router.push('/foundation/donate')}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gold-400 transition-colors duration-500"
            >
              Soutenir la Mission
            </button>

          </div>
        </motion.div>

        {/* DÉCORATION D'ARRIÈRE-PLAN (LUMIÈRE SACRÉE) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-600/5 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* SECTION IMPACT : CARTES DE LUXE */}
      <section className="px-6 py-24 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-3xl font-light text-gray-400 uppercase tracking-widest">Notre Impact</h2>
              <div className="h-1 w-20 bg-gold-500 mt-4" />
            </div>
            <p className="text-gray-500 max-w-sm text-sm">
              Chaque contribution est tracée sur la blockchain pour garantir une transparence totale.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {impactItems.map((item, index) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-[2rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 hover:border-gold-500/50 transition-all duration-700"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl mb-6 group-hover:bg-gold-500 transition-colors duration-500">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-gold-400 transition-colors">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION TRANSITION : SCROLL-TO-EXPERIENCE */}
      <section ref={transitionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Texte de transition */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="z-10 text-center px-6"
        >
          <h2 className="text-4xl md:text-6xl font-serif italic mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
            L'Expérience Spirituelle
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-8">
            "Continuez à explorer... Laissez-vous transporter dans un espace où l'art transcende le temps et l'espace."
          </p>
          <div className="text-gold-500 text-sm uppercase tracking-widest">
            ↓ Faites défiler pour entrer dans le sanctuaire
          </div>
        </motion.div>

        {/* Musée 3D qui apparaît en fondu */}
        <motion.div
          style={{ opacity: museumOpacity }}
          className="absolute inset-0"
        >
          <MinimalMuseum />
        </motion.div>

        {/* Overlay subtil pour la transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] pointer-events-none" />
      </section>

      {/* FOOTER SPIRITUEL */}
      <footer className="py-20 text-center border-t border-white/5">
        <p className="text-xs tracking-[0.3em] text-gray-600 uppercase">
          GlobalArtPro © 2026 — Côte d'Ivoire & International
        </p>
      </footer>
    </main>
  );
}