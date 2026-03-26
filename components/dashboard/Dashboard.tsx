'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { usePi } from '@/context/PiContext';
import ReferralCard from '@/components/referral/ReferralCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { user: piUser } = usePi();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <section className="border-b border-blue-500/10 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              Bienvenue, {user?.username || 'Artiste'} 🎨
            </h1>
            <p className="text-gray-400">Accédez à votre espace de création et de monétisation</p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Œuvres Créées', value: '0', icon: '🎨' },
              { label: 'NFTs Possédés', value: '0', icon: '✨' },
              { label: 'Soutiens Reçus', value: user?.isSupporter ? '✓' : '0', icon: '💙' },
              { label: 'Revenus (ARTC)', value: '0', icon: '💰' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/20 rounded-lg p-6"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Actions */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...fadeInUp}
            className="text-2xl font-bold mb-8"
          >
            Actions Principales
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Créer une Œuvre',
                description: 'Transformez votre création en NFT',
                icon: '🎭',
                href: '/create',
                color: 'blue',
              },
              {
                title: 'Mon Wallet',
                description: 'Gérez votre portefeuille ARTC et vos revenus',
                icon: '💳',
                href: '/wallet',
                color: 'blue',
              },
              {
                title: 'Mes NFTs',
                description: 'Consultez vos NFTs créés et possédés',
                icon: '✨',
                href: '/nft',
                color: 'purple',
              },
              {
                title: 'Communauté',
                description: 'Partagez avec d\'autres artistes',
                icon: '👥',
                href: '/community',
                color: 'blue',
              },
              {
                title: 'Musée 3D',
                description: 'Exposez vos œuvres dans le musée digital',
                icon: '🏛️',
                href: '/museum',
                color: 'indigo',
              },
              {
                title: 'Fondation',
                description: 'Soutenir les artistes et préserver les cultures',
                icon: '🤝',
                href: '/foundation',
                color: 'blue',
              },
              {
                title: 'Faire un Don',
                description: 'Contribuer à l\'impact global de GlobalArtpro',
                icon: '💙',
                href: '/checkout',
                color: 'blue',
              },
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={action.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-6 rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-600/15 to-blue-600/5 text-left hover:border-blue-500/50 hover:bg-blue-600/20 transition-all group"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                    <h3 className="font-bold mb-2 text-lg">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral / Parrainage Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <ReferralCard />
        </div>
      </section>

      {/* Info Pi Network */}
      <section className="py-12 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeInUp}
            className="bg-gradient-to-r from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-lg p-8"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl">π</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Pi Network</h3>
                <p className="text-gray-400 mb-4">
                  Utilisez Pi Network pour des paiements sécurisés et des revenus en crypto-monnaie.
                </p>
                <a
                  href="https://globalartproadac3428.pinet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-all"
                >
                  Accéder à Pi Network
                  <span>→</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
