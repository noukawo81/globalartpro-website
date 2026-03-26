'use client';

import { useState, useCallback } from 'react';

// Types pour le système de paiement
export interface PaymentData {
  amount: number;
  currency: 'ARTC' | 'Pi' | 'USD' | 'USDT';
  method: 'card' | 'mobile' | 'artc' | 'pi';
  itemId: string;
  itemTitle: string;
  userId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

// Hook pour gérer les paiements
export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<PaymentResult | null>(null);

  const processPayment = useCallback(async (data: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);

    try {
      // Validation côté client
      if (!data.amount || data.amount <= 0) {
        throw new Error('Montant invalide');
      }

      if (!data.itemId || !data.itemTitle) {
        throw new Error('Informations de l\'article manquantes');
      }

      // Simulation de traitement selon la méthode
      let result: PaymentResult;

      switch (data.method) {
        case 'card':
          result = await processCardPayment(data);
          break;
        case 'mobile':
          result = await processMobilePayment(data);
          break;
        case 'artc':
          result = await processArtcPayment(data);
          break;
        case 'pi':
          result = await processPiPayment(data);
          break;
        default:
          throw new Error('Méthode de paiement non supportée');
      }

      setLastTransaction(result);
      return result;

    } catch (error) {
      const errorResult: PaymentResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };

      setLastTransaction(errorResult);
      return errorResult;

    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processPayment,
    isProcessing,
    lastTransaction,
  };
}

// Fonctions de traitement par méthode
async function processCardPayment(data: PaymentData): Promise<PaymentResult> {
  // TODO: intégrer Stripe API
  // Simulation de paiement Stripe
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulation de succès/échec aléatoire (90% succès)
  const success = Math.random() > 0.1;

  if (success) {
    return {
      success: true,
      transactionId: `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      redirectUrl: `/checkout/success?method=card&amount=${data.amount}`,
    };
  } else {
    throw new Error('Paiement refusé par la banque');
  }
}

async function processMobilePayment(data: PaymentData): Promise<PaymentResult> {
  // TODO: intégrer API Mobile Money (Orange, MTN, Wave)
  // Simulation de paiement mobile
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Validation basique du numéro (simulation)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(data.userId || '')) {
    throw new Error('Numéro de téléphone invalide');
  }

  return {
    success: true,
    transactionId: `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    redirectUrl: `/checkout/success?method=mobile&amount=${data.amount}`,
  };
}

async function processArtcPayment(data: PaymentData): Promise<PaymentResult> {
  // Simulation de vérification du solde ARTC
  const artcBalance = 2500; // En production, récupérer du wallet utilisateur

  if (artcBalance < data.amount) {
    throw new Error('Solde ARTC insuffisant');
  }

  // Simulation de débit du wallet
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    success: true,
    transactionId: `artc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    redirectUrl: `/checkout/success?method=artc&amount=${data.amount}`,
  };
}

async function processPiPayment(data: PaymentData): Promise<PaymentResult> {
  // TODO: connecter Pi SDK version App Studio
  // Simulation de paiement Pi
  const piBalance = 2.5; // En production, récupérer du contexte Pi
  const requiredPi = data.amount / 1000; // Conversion ARTC -> Pi

  if (piBalance < requiredPi) {
    throw new Error('Solde Pi insuffisant');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    success: true,
    transactionId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    redirectUrl: `/checkout/success?method=pi&amount=${data.amount}`,
  };
}

// Hook pour valider les données de paiement
export function usePaymentValidation() {
  const validateCardDetails = useCallback((details: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  }) => {
    const errors: string[] = [];

    // Validation basique du numéro de carte
    const cardNumber = details.number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNumber)) {
      errors.push('Numéro de carte invalide');
    }

    // Validation de la date d'expiration
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiry)) {
      errors.push('Date d\'expiration invalide');
    }

    // Validation du CVC
    if (!/^\d{3,4}$/.test(details.cvc)) {
      errors.push('CVC invalide');
    }

    // Validation du nom
    if (!details.name.trim() || details.name.length < 2) {
      errors.push('Nom du titulaire requis');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  const validateMobileNumber = useCallback((number: string) => {
    // Validation basique internationale
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const isValid = phoneRegex.test(number) && number.length >= 8;

    return {
      isValid,
      error: isValid ? null : 'Numéro de téléphone invalide',
    };
  }, []);

  return {
    validateCardDetails,
    validateMobileNumber,
  };
}

// Hook pour gérer l'historique des paiements
export function usePaymentHistory() {
  const [history, setHistory] = useState<PaymentResult[]>([]);

  const addToHistory = useCallback((payment: PaymentResult) => {
    setHistory(prev => [payment, ...prev.slice(0, 9)]); // Garder les 10 derniers
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
}