'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { generateRewardHistory } from '@/lib/rewardEngine';
import { usePi } from '@/context/PiContext';
import { config } from '@/lib/config';
import ARTCWalletCard from '@/components/wallet/ARTCWalletCard';

// Types
interface Transaction {
  id: string;
  type: 'gain' | 'achat' | 'soutien' | 'conversion';
  amount: number;
  currency: 'ARTC' | 'Pi';
  date: string;
  details: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'gain',
    amount: 500,
    currency: 'ARTC',
    date: '2024-01-15',
    details: 'Récompense minage artistique'
  },
  {
    id: '2',
    type: 'soutien',
    amount: 200,
    currency: 'ARTC',
    date: '2024-01-14',
    details: 'Soutien reçu de la communauté'
  },
  {
    id: '3',
    type: 'conversion',
    amount: 1,
    currency: config.currency.name as 'ARTC' | 'Pi',
    date: '2024-01-13',
    details: `Conversion ${config.currency.name} → ARTC (1000 ARTC)`
  },
  {
    id: '4',
    type: 'achat',
    amount: 150,
    currency: 'ARTC',
    date: '2024-01-12',
    details: 'Achat NFT "Digital Dreams"'
  },
  {
    id: '5',
    type: 'gain',
    amount: 300,
    currency: 'ARTC',
    date: '2024-01-11',
    details: 'Vente NFT "Cyber Heritage"'
  }
];

export default function WalletPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { user: piUser, createPayment } = usePi();
  const [conversionAmount, setConversionAmount] = useState('');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [artcBalance] = useState(2500);
  const [piBalance] = useState(2.5);
  const [transactions] = useState(mockTransactions);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const rewardHistory = generateRewardHistory(8);
  const rewardTotal = rewardHistory.reduce((sum, r) => sum + r.amount, 0);

  const certificationHistory = [
    { id: 'c1', nftTitle: 'Digital Dreams', status: 'validé', date: '2024-01-14' },
    { id: 'c2', nftTitle: 'Sacred Geometry', status: 'validé', date: '2024-01-12' },
    { id: 'c3', nftTitle: 'Cathédrale Vivante', status: 'en attente', date: '2024-01-20' },
  ];

  const certifiedRevenue = transactions
    .filter((tx) => tx.type === 'gain' || tx.type === 'soutien')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const conversionRate = 1000; // 1 Test Pi = 1000 ARTC

  const handleConvert = () => {
    const amount = parseFloat(conversionAmount);
    if (amount > 0 && amount <= piBalance) {
      // Here you would integrate with actual conversion logic
      alert(`Conversion de ${amount} ${config.currency.name} vers ${amount * conversionRate} ARTC effectuée !`);
      setShowConvertModal(false);
      setConversionAmount('');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'gain': return '📈';
      case 'achat': return '🛒';
      case 'soutien': return '🎨';
      case 'conversion': return '🔄';
      default: return '💰';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'gain': return 'text-green-400';
      case 'achat': return 'text-red-400';
      case 'soutien': return 'text-blue-400';
      case 'conversion': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 px-4 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-slate-900/10 to-cyan-500/10 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-white bg-clip-text text-transparent mb-4">
            Art Wallet
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Gérez vos actifs artistiques et vos récompenses
          </p>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* ARTC Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ARTCWalletCard />
        </motion.div>

        {/* Balances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* ARTC Balance */}
          <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                  <Image
                    src="/logos/artc.svg"
                    alt="ARTC Token"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-amber-300">ARTC Token</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="text-amber-200 font-medium">ARTC</span> récompense votre activité et vous connecte à l'écosystème GlobalArtpro.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Gagnez des ARTC en invitant des utilisateurs et en participant à la plateforme.
                  </p>
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {artcBalance.toLocaleString()}
            </div>
          </div>

          {/* Pi Balance */}
          <div className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center border border-orange-500/20">
                  <span className="text-2xl">π</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-orange-300">{config.currency.name}</h3>
                  <p className="text-sm text-gray-400">Cryptomonnaie de test</p>
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">
              {piBalance.toFixed(2)}
            </div>
          </div>
        </motion.div>

        {/* Pi Network Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-orange-400">Connexion {config.currency.name} Network</h3>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Connecté</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-300 text-sm font-medium">Non connecté</span>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">{config.currency.symbol}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{user?.username}</p>
                  <p className="text-gray-400 text-sm">Utilisateur {config.currency.name}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createPayment(1, `Test payment ${config.currency.name}`)}
                  className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-400 transition-all"
                >
                  Tester Paiement (1 {config.currency.symbol})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConvertModal(true)}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-medium rounded-lg hover:bg-amber-300 transition-all"
                >
                  Convertir Pi → ARTC
                </motion.button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300">
              Connectez-vous avec votre compte Pi Network pour accéder aux paiements et conversions.
            </p>
          )}
        </motion.div>

        {/* Revenus Certifiés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/80 shadow-2xl mb-12"
        >
          <h3 className="text-xl font-bold text-amber-300 mb-2">Revenus certifiés (NFT GlobalArtpro)</h3>
          <p className="text-gray-300 text-sm mb-4">
            Seuls les revenus issus d'œuvres certifiées apparaissent ici. Les œuvres non certifiées ont un accès limité.
          </p>
          <div className="text-3xl font-bold text-white">{certifiedRevenue.toLocaleString()} ARTC</div>
        </motion.div>

        {/* Revenus des récompenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/80 shadow-2xl mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⭐</span>
            <div>
              <h3 className="text-xl font-bold text-amber-300">Revenus - Système de Récompenses</h3>
              <p className="text-sm text-gray-300">ARTC gagnés via engagement et contributions</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total missions</p>
              <p className="text-3xl font-bold text-amber-300">{rewardTotal.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">ARTC (8 derniers jours)</p>
            </div>
            <div className="text-right">
              <Link
                href="/rewards"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-amber-500/20 rounded-lg text-amber-300 hover:bg-slate-800 transition-all"
              >
                Voir détails
                <span>→</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/80 shadow-2xl hover:bg-slate-800/90 transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📤</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Envoyer</h3>
              <p className="text-gray-400 text-sm">Transférer des fonds</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/80 shadow-2xl hover:bg-slate-800/90 transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">📥</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Recevoir</h3>
              <p className="text-gray-400 text-sm">Recevoir des paiements</p>
            </div>
          </motion.button>

        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/80 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-amber-300 mb-6">Historique des Transactions</h2>

          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                  <div>
                    <p className="font-semibold text-white">{transaction.details}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'achat' || transaction.type === 'conversion' ? '-' : '+'}
                    {transaction.amount} {transaction.currency}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Historique de certification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="bg-slate-900/90 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/80 shadow-2xl mt-8"
        >
          <h2 className="text-2xl font-bold text-amber-300 mb-6">Historique de Certification</h2>
          <div className="space-y-3">
            {certificationHistory.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/10">
                <div>
                  <p className="font-semibold text-white">{record.nftTitle}</p>
                  <p className="text-sm text-gray-400">{record.date}</p>
                </div>
                <span className={`text-sm font-semibold ${
                  record.status === 'validé'
                    ? 'text-green-400'
                    : record.status === 'en attente'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
                >
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Modal */}
      {showConvertModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowConvertModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900/95 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/80 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-amber-300 mb-4 text-center">Confirmer la Conversion</h3>
            <div className="text-center mb-6">
              <p className="text-gray-300 mb-2">Vous allez convertir :</p>
              <p className="text-xl font-semibold text-orange-300">
                {conversionAmount} Pi
              </p>
              <p className="text-gray-400">→</p>
              <p className="text-xl font-semibold text-amber-300">
                {(parseFloat(conversionAmount) || 0) * conversionRate} ARTC
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConvertModal(false)}
                className="flex-1 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConvert}
                className="flex-1 px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-lg hover:bg-amber-300 transition-all"
              >
                Confirmer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}