'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ARTCWalletCard() {
  const { user } = useAuth();

  const artcBalance = user?.artcBalance || 0;
  const artcFromReferrals = user?.artcFromReferrals || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-yellow-600/20 via-amber-600/10 to-orange-600/5 border border-yellow-500/30 rounded-2xl p-8"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-yellow-300 flex items-center gap-2">
              🎨 Mon Portefeuille ARTC
            </h2>
            <p className="text-gray-400">Gérez votre solde de tokens</p>
          </div>
          <div className="text-5xl">💳</div>
        </div>

        {/* Main Balance */}
        <div className="bg-slate-900/50 rounded-xl p-6 border border-yellow-500/20">
          <p className="text-gray-400 text-sm mb-2">Solde Total</p>
          <div className="text-5xl font-bold text-yellow-300 mb-2">{artcBalance} ARTC</div>
          <div className="flex gap-2 text-xs text-gray-400">
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">+{artcFromReferrals} par parrainage</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/30 rounded-lg p-4 border border-yellow-500/10">
            <p className="text-gray-400 text-sm mb-2">Bonus Inscription</p>
            <p className="text-2xl font-bold text-yellow-300">+2 ARTC</p>
            <p className="text-xs text-gray-500 mt-1">Reçu à l'inscription</p>
          </div>
          <div className="bg-slate-900/30 rounded-lg p-4 border border-green-500/10">
            <p className="text-gray-400 text-sm mb-2">Gagnés par Parrainage</p>
            <p className="text-2xl font-bold text-green-300">+{artcFromReferrals} ARTC</p>
            <p className="text-xs text-gray-500 mt-1">À chaque ami inscrit</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 pt-4 border-t border-yellow-500/20">
          <h3 className="font-semibold text-gray-300">Actions Rapides</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <Link href="/referrals">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold transition-all border border-blue-500/30"
              >
                👥 Inviter
              </motion.button>
            </Link>
            <Link href="/checkout">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold transition-all border border-purple-500/30"
              >
                🎁 Dépenser
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-4 py-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-300 font-semibold transition-all border border-green-500/30"
            >
              📤 Retirer
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
          <p className="font-semibold mb-1">💡 Conseil:</p>
          <p>Partage ton lien de parrainage et gagne +10 ARTC pour chaque ami qui s'inscrit!</p>
        </div>
      </div>
    </motion.div>
  );
}
