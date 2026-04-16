'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { config } from '@/lib/config';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const method = searchParams.get('method') || 'card';
  const amount = searchParams.get('amount') || '0';

  const methodNames = {
    artc: 'ARTC Wallet',
    pi: config.currency.name,
  };

  const methodIcons = {
    artc: '🎨',
    pi: config.currency.symbol,
  };

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/wallet');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            className="text-4xl"
          >
            ✅
          </motion.span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent mb-2"
        >
          Paiement réussi !
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          Votre achat a été traité avec succès
        </motion.p>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">{methodIcons[method as keyof typeof methodIcons]}</span>
            <div>
              <div className="font-semibold text-lg">{methodNames[method as keyof typeof methodNames]}</div>
              <div className="text-sm text-gray-400">Méthode de paiement</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {amount} ARTC
            </div>
            <div className="text-sm text-gray-400">Montant payé</div>
          </div>
        </motion.div>

        {/* Transaction Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 mb-8"
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID</span>
              <span className="font-mono text-xs">GAP-{Date.now().toString().slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Date</span>
              <span>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Statut</span>
              <span className="text-green-400 font-medium">Confirmé</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <div className="flex gap-3">
            <Link href="/wallet" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-yellow-200 transition-all shadow-lg shadow-yellow-500/20"
              >
                Voir mon wallet
              </motion.button>
            </Link>
            <Link href="/explorer" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
              >
                Continuer shopping
              </motion.button>
            </Link>
          </div>

          {/* Auto redirect notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <p className="text-sm text-gray-400">
              Redirection automatique vers votre wallet dans {countdown} secondes...
            </p>
            <button
              onClick={() => router.push('/wallet')}
              className="text-yellow-400 hover:text-yellow-300 text-sm underline mt-1"
            >
              Aller maintenant
            </button>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-2">
              <span>📧</span>
              <span className="font-medium">Confirmation envoyée</span>
            </div>
            <p className="text-sm text-gray-300">
              Un email de confirmation avec les détails de votre achat vous a été envoyé.
            </p>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            Besoin d'aide ? Contactez notre{' '}
            <Link href="/support" className="text-yellow-400 hover:text-yellow-300 underline">
              support 24/7
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}