'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const paymentMethods = [
  {
    id: 'pi',
    name: 'Pi Network',
    icon: 'π',
    description: 'Cryptomonnaie décentralisée',
    color: 'from-blue-600/20 to-blue-600/5',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'usdt',
    name: 'USDT (Tether)',
    icon: '💳',
    description: 'Stablecoin USD',
    color: 'from-green-600/20 to-green-600/5',
    borderColor: 'border-green-500/30',
  },
  {
    id: 'usd',
    name: 'USD',
    icon: '💵',
    description: 'Monnaie fiduciaire',
    color: 'from-yellow-600/20 to-yellow-600/5',
    borderColor: 'border-yellow-500/30',
  },
  {
    id: 'artc',
    name: 'ARTC Token',
    icon: null,
    logo: '/logos/artc.svg',
    description: 'Token GlobalArtpro',
    color: 'from-purple-600/20 to-purple-600/5',
    borderColor: 'border-purple-500/30',
  },
];

export default function FoundationDonatePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <section className="relative px-6 py-16 md:px-12 md:py-24 border-b border-blue-500/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Link
              href="/foundation"
              className="px-4 py-2 rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-all"
            >
              ← Retour
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-blue-300"
          >
            Bienvenue à la Fondation GlobalArtpro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
          >
            Votre contribution soutient l'art, la culture et les initiatives humaines à travers le monde.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Chaque don compte. Que vous contribution 1 $ ou 1000 $, vous participez à la préservation des cultures,
            au soutien des artistes et à la création d'un avenir meilleur pour tous.
          </motion.p>

          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-transparent mx-auto mt-6"></div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="px-6 py-20 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-blue-300 mb-12 text-center"
          >
            Choisissez Votre Méthode de Paiement
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group rounded-2xl border ${method.borderColor} bg-gradient-to-br ${method.color} p-6 hover:border-opacity-100 transition-all cursor-pointer hover:scale-105`}
              >
                {method.logo ? (
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={method.logo}
                      alt={method.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-5xl mb-4">{method.icon}</div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{method.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{method.description}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/checkout')}
                  className="w-full px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-md"
                >
                  Donner avec {method.name.split(' ')[0]}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-2xl p-8 text-center space-y-4"
          >
            <h3 className="text-2xl font-bold text-blue-300">🔒 Vos Dons Sont Sécurisés</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Tous les paiements sont traités de manière sécurisée et confidentielle.
              Les ARTC gagnés vous seront crédités instantanément sur votre wallet.
            </p>
            <div className="flex justify-center gap-8 pt-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>✓ Sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓ Rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓ Confidentiel</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="px-6 py-20 md:px-12 border-t border-blue-500/10 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-blue-300 mb-12 text-center"
          >
            Où Va Votre Don?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                title: 'Soutien aux Artistes',
                description: 'Subventions, formations et exposition mondiale pour les créateurs émergents.',
              },
              {
                icon: '🛕',
                title: 'Préservation Culturelle',
                description: 'Archivage numérique, restauration et recherche des patrimoines culturels.',
              },
              {
                icon: '🤝',
                title: 'Initiatives Sociales',
                description: 'Projets éducatifs inclusifs et solidarité pour les communautés.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-blue-300/30 bg-slate-900/50 p-6 space-y-3"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="text-xl font-bold text-blue-300">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-blue-300">Prêt à Faire la Différence?</h2>
          <p className="text-gray-400">Chaque contribution, grande ou petite, compte vraiment.</p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/checkout')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-md"
            >
              Faire un Don Maintenant
            </motion.button>
            <Link
              href="/foundation"
              className="px-8 py-3 border border-blue-500/30 hover:bg-blue-500/10 text-blue-300 font-semibold rounded-lg transition-all"
            >
              En Savoir Plus
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
