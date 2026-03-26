'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const impactItems = [
  { title: 'Aide aux artistes', description: "Micro-subventions, formation, exposition mondiale", icon: '🎨' },
  { title: 'Préservation culturelle', description: "Archivage numérique, restauration et recherche", icon: '🛕' },
  { title: 'Soutien social', description: "Projets éducatifs inclusifs et solidarité", icon: '🤝' },
];

export default function FoundationPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white overflow-x-hidden">
      <section className="relative px-6 py-16 md:px-12 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-blue-300"
          >Fondation GlobalArtpro</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: 0.8 }}
            className="mt-6 text-xl md:text-2xl text-blue-100 font-semibold"
          >
            L’art au service de l’humanité
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: 0.8 }}
            className="mt-6 max-w-3xl mx-auto text-sm md:text-lg text-gray-300"
          >
            Chaque culture mérite d’être protégée. Chaque artiste mérite d’être soutenu. Chaque don construit un avenir meilleur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.7, duration: 0.6 }}
            className="mt-10"
          >
            <Link href="/foundation/donate" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-500 hover:shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-300">
              💙 Faire un don
            </Link>
          </motion.div>

          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),_rgba(10,20,40,0.1)_60%)]" />
            <div className="absolute -top-12 left-1/2 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-100 mb-8">Impact</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {impactItems.map((item) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                className="p-5 rounded-2xl border border-blue-300/30 bg-slate-900/50 shadow-xl shadow-blue-900/20"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-blue-300">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
