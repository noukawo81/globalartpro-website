'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-transparent opacity-40" />

        <div className="relative z-10 max-w-4xl text-center">
          <motion.h1
            {...fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            GlobalArtpro
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
            className="text-xl sm:text-2xl text-gray-300 mb-4"
          >
            La plateforme mondiale de l'art et des cultures
          </motion.p>

          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Créez, valorisez et vendez vos œuvres en NFT. Exposez dans un musée 3D. Générez des revenus grâce à votre talent artistique.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/30"
              >
                Commencer Maintenant
              </motion.button>
            </Link>

            <Link href="/explorer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-blue-500/50 text-white font-bold rounded-lg hover:bg-blue-500/10 transition-all"
              >
                Explorer la Plateforme
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Pourquoi GlobalArtpro ?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Créer en NFT',
                description: 'Transformez vos œuvres en NFT et vendez-les directement',
              },
              {
                icon: '🌍',
                title: 'Valoriser les Cultures',
                description: 'Mettez en avant le patrimoine artistique du monde entier',
              },
              {
                icon: '🏛️',
                title: 'Musée Digital 3D',
                description: 'Exposez vos œuvres dans un musée virtuel immersif',
              },
              {
                icon: '💰',
                title: 'Générer des Revenus',
                description: 'Monétisez votre talent et supportez d\'autres artistes',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Rejoignez la Communauté Artistique Mondiale
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-400 mb-8"
          >
            Des milliers d'artistes du monde utilisent GlobalArtpro pour partager, vendre et soutenir les talents émergents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link href="/auth/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/30"
              >
                S'inscrire Gratuitement
              </motion.button>
            </Link>

            <Link href="/explorer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-blue-500/50 text-white font-bold rounded-lg hover:bg-blue-500/10 transition-all"
              >
                Découvrir les Œuvres
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">GlobalArtpro</h3>
              <p className="text-gray-400 text-sm">La plateforme pour artistes du monde</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/explorer" className="hover:text-white transition">Explorer</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition">Connexion</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition">Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition">Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Communauté</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 GlobalArtpro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
