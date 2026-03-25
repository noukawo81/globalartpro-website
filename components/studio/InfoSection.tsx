'use client';

import { motion } from 'framer-motion';

export default function InfoSection() {
  const infoCards = [
    {
      icon: '🎁',
      title: '2 NFTs gratuits/jour',
      description:
        'Créez 2 NFTs non certifiés chaque jour sans frais. Parfait pour tester la plateforme.',
    },
    {
      icon: '✅',
      title: 'Certification GlobalArtpro',
      description:
        'Nos experts certifient vos œuvres. Accédez aux récompenses et générez des revenus.',
    },
    {
      icon: '💰',
      title: 'Génération de revenus',
      description:
        'Seuls les NFTs certifiés peuvent générer des revenus. Chaque vente vous rapporte.',
    },
    {
      icon: '🌍',
      title: 'Communauté mondiale',
      description:
        'Partagez vos créations avec une communauté d\'artistes et collectionneurs internationaux.',
    },
  ];

  return (
    <section className="mb-12 bg-gradient-to-br from-gray-900/50 to-black border border-gray-800/50 rounded-2xl p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Comment ça marche ?
          </h2>
          <p className="text-gray-400">
            Comprendre le système de création et certification
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-yellow-500/30 transition-all group cursor-default"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-400">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Processus simplifié</h3>
          <div className="space-y-3">
            {[
              { step: 1, title: 'Importez votre œuvre', desc: 'Image en haute qualité' },
              { step: 2, title: 'Remplissez les infos', desc: 'Titre, description, prix' },
              { step: 3, title: 'Confirmez', desc: 'Vérifiez et créez votre NFT' },
              { step: 4, title: 'Publiez', desc: 'Partagez avec la communauté' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
        >
          <p className="text-sm text-yellow-200">
            <span className="font-semibold">💡 Pro Tip :</span> Commencez par créer un NFT
            non certifié pour explorer la plateforme, puis certifiez vos meilleures
            créations.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
