'use client';

import { useState } from 'react';
import { usePi } from '@/context/PiContext';
import { config } from '@/lib/config';

export function usePiPayment() {
  const { pi, isInitialized, isAuthenticated } = usePi();
  const [isProcessing, setIsProcessing] = useState(false);

  const createPayment = async (amount: number, memo: string, metadata: any = {}) => {
    if (!pi || !isInitialized) {
      throw new Error('SDK Pi non initialisé');
    }

    if (!isAuthenticated) {
      throw new Error('Utilisateur non authentifié avec Pi');
    }

    if (!config.pi.sandbox) {
      console.warn('⚠️ Attention : Pi SDK configuré hors testnet');
    }

    setIsProcessing(true);

    try {
      return await pi.createPayment({
        amount,
        memo: `${memo} (${config.currency.name})`,
        metadata: {
          ...metadata,
          testnet: config.pi.sandbox,
          currency: config.currency.name,
          timestamp: new Date().toISOString(),
        },
      });
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
