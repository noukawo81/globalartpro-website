"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import WorldCultureCarousel from "@/components/home/WorldCultureCarousel";

const features = [
  { icon: "🎨", label: "Créer et transformer vos œuvres en NFT" },
  { icon: "🌍", label: "Valoriser les cultures du monde" },
  { icon: "🏛️", label: "Exposer dans un musée digital 3D" },
  { icon: "💰", label: "Générer des revenus grâce à votre art" },
];

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map(() => ({
        // eslint-disable-next-line react-hooks/purity
        left: Math.random() * 100,
        // eslint-disable-next-line react-hooks/purity
        top: Math.random() * 100,
        // eslint-disable-next-line react-hooks/purity
        size: 1 + Math.random() * 2,
        // eslint-disable-next-line react-hooks/purity
        delay: Math.random() * 6,
        // eslint-disable-next-line react-hooks/purity
        opacity: 0.25 + Math.random() * 0.5,
      })),
    []
  );

  const sharedHeroAnimation = shouldReduceMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1 } };

  const buttonHover = shouldReduceMotion ? undefined : { scale: 1.025 };
  const createButtonAnimation = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: [0.88, 1, 0.88] };

  return (
    <>
      <section className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(30,60,120,0.65),transparent_45%),linear-gradient(to_bottom,#05070f,#02020a,#120228)] text-white">
        <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-black via-blue-950 to-violet-950" />

        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-amber-300 blur-[1px] animate-[glowParticle_4s_ease-in-out_infinite]"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                opacity: particle.opacity,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.08),transparent_55%)]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-8 text-center">
          <div className="w-full max-w-4xl">
            <motion.h1
              {...sharedHeroAnimation}
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,215,0,0.55)]"
              style={{ textShadow: "0 0 18px rgba(255,214,81,0.85), 0 0 30px rgba(252,211,77,0.65)" }}
            >
              GlobalArtpro
            </motion.h1>

            <motion.p
              {...sharedHeroAnimation}
              transition={{ ...sharedHeroAnimation.transition, delay: shouldReduceMotion ? 0 : 0.25 }}
              className="mt-5 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-200/95"
            >
              L’avenir de l’art et des cultures du monde
            </motion.p>

            <motion.div
              {...sharedHeroAnimation}
              transition={{ ...sharedHeroAnimation.transition, delay: shouldReduceMotion ? 0 : 0.5 }}
              className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Link href="/explorer">
                <motion.button
                  whileHover={buttonHover}
                  className="w-full rounded-xl px-6 py-3 font-semibold uppercase tracking-wide bg-white/15 text-white border border-white/30 transition duration-300 hover:bg-white/30 shadow-[0_0_16px_rgba(235,203,98,0.35)] sm:w-auto"
                  style={{ boxShadow: "0 0 20px rgba(255,255,255,0.15)" }}
                >
                  Explorer
                </motion.button>
              </Link>

              <Link href="/create">
                <motion.button
                  whileHover={buttonHover}
                  animate={createButtonAnimation}
                  transition={shouldReduceMotion ? undefined : { repeat: Infinity, duration: 2.7, ease: "easeInOut" }}
                  className="w-full rounded-xl px-6 py-3 font-semibold uppercase tracking-wide bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black shadow-[0_0_25px_rgba(252,211,77,0.45)] border border-amber-200 sm:w-auto"
                >
                  Créer une œuvre
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-20 py-16 px-4 sm:px-8 md:px-16 lg:px-20 bg-[#070914]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
            Une nouvelle ère pour les créateurs et les cultures
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
            Une plateforme premium où la créativité globale rencontre l’innovation blockchain, l’exposition immersive et un marché équitable.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <motion.article
                key={item.label}
                whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="group rounded-2xl border border-white/15 bg-white/10 p-5 sm:p-6 text-left backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.32)] hover:border-amber-200/70 hover:bg-white/20"
              >
                <div className="text-3xl sm:text-4xl leading-none">{item.icon}</div>
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-white">{item.label}</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-200/85">
                  Accédez à un univers d’expositions, IA et tokenisation pour amplifier votre visibilité.
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <WorldCultureCarousel />

      <section className="relative z-10 py-20 bg-[#040814]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center tracking-tight">
            Pourquoi GlobalArtpro ?
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              "Certification NFT sécurisée",
              "Transparence",
              "Communauté mondiale",
              "Technologie innovante",
            ].map((item) => (
              <li key={item} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-white transition hover:-translate-y-1 hover:bg-white/10">
                <p className="text-lg font-semibold">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <style jsx>{`
        @keyframes glowParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-10px) scale(1.4); opacity: 0.8; }
        }

        .animate-[glowParticle_4s_ease-in-out_infinite] {
          animation: glowParticle 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-[glowParticle_4s_ease-in-out_infinite] {
            animation: none !important;
          }

          * {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </>
  );
}
