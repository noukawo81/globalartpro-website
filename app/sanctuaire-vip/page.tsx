'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { config } from '@/lib/config';

export default function SanctuaireVIPPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simule le chargement du contenu VIP
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gold-400/30 border-t-gold-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900/20 to-black text-white pt-20">
      {/* Header */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-gold-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-purple-400/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <div className="text-8xl mb-6 animate-pulse">👑</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gold-400 to-purple-400 bg-clip-text text-transparent">
            Sanctuaire VIP
          </h1>
          <p className="text-xl text-gold-300 mb-2">
            Bienvenue dans l'espace sacré des initiés
          </p>
          <p className="text-gray-400">
            {user?.email ? `Connecté en tant que: ${user.email}` : 'Membre VIP authentifié'}
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Textes Sacrés */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gold-900/30 to-purple-900/30 p-8 rounded-2xl border border-gold-500/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gold-400 mb-4 flex items-center">
                <span className="mr-3 text-4xl">📖</span>
                Textes Sacrés
              </h2>
              <p className="text-gray-300 mb-6">
                Accès à une collection exclusive de textes anciens et de rituels oubliés, compilés par les plus grands érudits spirituels.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-gold-400 mr-3">✨</span>
                  <span>Philosophies ancestrales des 5 continents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-400 mr-3">✨</span>
                  <span>Rituels spirituels traduits en français</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-400 mr-3">✨</span>
                  <span>Histoires cachées des civilisations perdues</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold-400 mr-3">✨</span>
                  <span>Mantras et méditations guidées</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Publications Divines */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-8 rounded-2xl border border-purple-500/30 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-purple-400 mb-4 flex items-center">
                <span className="mr-3 text-4xl">✍️</span>
                Publications Divines
              </h2>
              <p className="text-gray-300 mb-6">
                Partagez vos révélations spirituelles dans un espace protégé, réservé aux esprits éclairés.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">🔮</span>
                  <span>Forum exclusif de discussion spirituelle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">🔮</span>
                  <span>Publications signées par les Maîtres Experts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">🔮</span>
                  <span>Commentaires et échanges profonds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3">🔮</span>
                  <span>Certifications de sagesse ancestrale</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Payment Confirmation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-gold-900/40 to-purple-900/40 p-8 rounded-2xl border border-gold-500/50 text-center mb-12"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gold-400 mb-2">Paiement Confirmé</h2>
          <p className="text-gray-300 mb-4">
            Votre offrande a été acceptée. Vous avez maintenant accès à tous les contenus exclusifs du Sanctuaire VIP.
          </p>
          <div className="text-sm text-gray-400">
            <p>Montant: {config.formatPrice(0.0005)}</p>
            <p>Transaction enregistrée sur la blockchain Pi Network</p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/culture">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-gold-600 to-purple-600 hover:from-gold-500 hover:to-purple-500 text-white font-semibold rounded-full transition-all"
            >
              ← Retour au Portail Culture
            </motion.button>
          </Link>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full transition-all"
            >
              Tableau de bord →
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Sacred Elements */}
      <section className="py-20 px-6 text-center">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl space-x-8 flex justify-center flex-wrap gap-8"
        >
          <span>🕉️</span>
          <span>☯️</span>
          <span>✡️</span>
          <span>☪️</span>
          <span>✝️</span>
        </motion.div>
      </section>
    </div>
  );
}
