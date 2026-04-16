'use client';

import { useState } from 'react';
import { usePi } from '@/context/PiContext';
import { config } from '@/lib/config';

export function usePiPayment() {
  const { isAuthenticated, createPayment: piCreatePayment } = usePi();
  const [isProcessing, setIsProcessing] = useState(false);

  const createPayment = async (amount: number, memo: string, metadata: any = {}) => {
    if (!isAuthenticated) {
      throw new Error('Utilisateur non authentifié avec Pi Network');
    }

    if (!isAuthenticated) {
      throw new Error('Utilisateur non authentifié avec Pi');
    }

    if (!config.pi.sandbox) {
      console.warn('⚠️ Attention : Pi SDK configuré hors testnet');
    }

    setIsProcessing(true);

    try {
      return await piCreatePayment(amount, memo, metadata);
    } catch (error) {
      console.error('❌ Erreur paiement Pi:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createPayment,
    isProcessing,
    isTestnet: config.pi.sandbox,
    currency: config.currency,
  };
}
