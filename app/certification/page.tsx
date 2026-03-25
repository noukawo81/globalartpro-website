'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CertificationPage() {
  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-yellow-300/20 bg-gradient-to-br from-gray-900/70 to-black/60 p-8 shadow-2xl shadow-yellow-600/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg shadow-yellow-400/30">
              <span className="text-xl">🔒</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gradient bg-gradient-to-r from-yellow-300 via-yellow-200 to-white bg-clip-text text-transparent">
              Certification NFT
            </h1>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Obtenez le label officiel "Certifié GlobalArtpro" pour vos œuvres numériques.
            Ce badge est un sceau d'authenticité, de qualité artistique et de conformité anti-fraude.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Sécurité maximale', detail: 'validation automatique + simulation IA + signature numérique' },
              { title: 'Anti-fraude', detail: 'contrôle d’intégrité + validation de contenu' },
              { title: 'Confiance utilisateur', detail: 'revenus exclusifs & soutiens privilégiés' },
            ].map((card) => (
              <div key={card.title} className="p-4 bg-black/40 border border-yellow-300/20 rounded-2xl">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">{card.title}</h3>
                <p className="text-gray-300 text-sm">{card.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/create" className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold hover:from-yellow-400 hover:to-yellow-200 transition-all">
              Demander certification
            </Link>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-gray-900/70 p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Processus de certification</h2>
          <ol className="space-y-4 text-gray-300 list-decimal list-inside">
            <li>
              Soumission de l'œuvre avec métadonnées et visuel.
            </li>
            <li>
              Vérification automatique des champs, contenu et format.
            </li>
            <li>
              Évaluation IA/admin (simulation) et harmonisation avec la charte.
            </li>
            <li>
              Attribution du badge <strong>Certifié GlobalArtpro</strong> et génération d'une signature numérique horodatée.
            </li>
          </ol>

          <div className="mt-6 p-4 rounded-xl border border-yellow-300/20 bg-black/40">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">Règles critiques</h3>
            <ul className="text-gray-300 list-disc list-inside space-y-2">
              <li>Seuls les NFT certifiés peuvent recevoir revenus, soutiens et accès récompenses ARTC.</li>
              <li>Les NFT non certifiés ont visibilité limitée et 2 créations gratuites/jour.</li>
              <li>Statut tracé : en attente / validé / refusé.</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </main>
  );
}