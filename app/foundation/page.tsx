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
            className="text-4xl md:text-6xl font-black tracking-tight text-yellow-300"
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
            <Link href="/foundation/donate/page" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-bold shadow-lg shadow-yellow-500/30 hover:scale-[1.01] transition transform">
              Faire un don
            </Link>
          </motion.div>

          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,213,0,0.22),_rgba(10,20,40,0.1)_60%)]" />
            <div className="absolute -top-12 left-1/2 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
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
                <h3 className="mt-4 text-xl font-semibold text-yellow-300">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-200">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12">
        <div className="max-w-5xl mx-auto rounded-3xl border border-blue-400/20 p-6 bg-black/25 backdrop-blur-2xl">
          <h2 className="text-2xl font-bold text-blue-100">Une expérience de don unique</h2>
          <p className="mt-3 text-gray-300">Inspirez-vous du distributeur automatique artistique 3D pour transformer chaque généreux don en geste symbolique.</p>
          <Link href="/foundation/donate/page" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-yellow-400 text-black font-semibold shadow-lg hover:opacity-90 transition">
            Explorer le Distributeur 3D
          </Link>
        </div>
      </section>
    </main>
  );
}
