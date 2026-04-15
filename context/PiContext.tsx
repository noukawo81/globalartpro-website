'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types pour Pi Network
interface PiUser {
  uid: string;
  username: string;
}

interface PiAuthResult {
  accessToken: string;
  user: PiUser;
}

interface PiContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email?: string) => Promise<void>;
  logout: () => void;
  rewardPiUser: (email: string, piUsername: string) => Promise<void>;
  createPayment: (amount: number, memo: string, metadata?: any) => Promise<any>;
}

const PiContext = createContext<PiContextType | undefined>(undefined);

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    Pi: any;
  }
}

export function PiProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser Pi SDK
  useEffect(() => {
    const initPi = async () => {
      if (typeof window === 'undefined') {
        console.log('[PI CONTEXT] ℹ️ Server-side rendering detected, skipping SDK init');
        return;
      }

      // Attendre que le SDK soit chargé (il est inclus via le script dans layout.tsx)
      const maxWaitTime = 10000; // 10 secondes max
      const startTime = Date.now();

      const waitForSDK = () => {
        return new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (window.Pi) {
              clearInterval(checkInterval);
              resolve();
            }
            if (Date.now() - startTime > maxWaitTime) {
              clearInterval(checkInterval);
              console.warn('[PI CONTEXT] ⏰ SDK loading timeout - continuing without Pi');
              resolve();
            }
          }, 100);
        });
      };

      try {
        console.log('[PI CONTEXT] ⏳ Waiting for Pi SDK to load...');
        await waitForSDK();

        if (window.Pi) {
          console.log('[PI CONTEXT] 🎯 Pi SDK detected, initializing...');
          const result = await window.Pi.init({ version: '2.0', sandbox: false });
          console.log('[PI CONTEXT] ✅ Pi SDK initialized successfully:', result);
        } else {
          console.warn('[PI CONTEXT] ⚠️ Pi SDK not available (mock mode or loading error)');
        }
      } catch (error) {
        console.error('[PI CONTEXT] ❌ Failed to initialize Pi SDK:', error);
        // Ne pas throw - laisser l'app continuer même sans Pi
      }
    };

    initPi();
  }, []);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('pi_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved Pi user:', error);
        localStorage.removeItem('pi_user');
      }
    }
  }, []);

  const login = async (email?: string) => {
    if (!window.Pi) {
      throw new Error('Pi SDK not loaded');
    }

    setIsLoading(true);

    try {
      const scopes = ['username', 'payments'];
      const auth: PiAuthResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);

      // Sauvegarder l'utilisateur
      const piUser: PiUser = {
        uid: auth.user.uid,
        username: auth.user.username,
      };

      setUser(piUser);
      localStorage.setItem('pi_user', JSON.stringify(piUser));
      localStorage.setItem('pi_access_token', auth.accessToken);

      // Récompenser si email fourni
      if (email) {
        await rewardPiUser(email, piUser.username);
      }

      console.log('Pi authentication successful:', piUser);
    } catch (error) {
      console.error('Pi authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const rewardPiUser = async (email: string, piUsername: string) => {
    try {
      const response = await fetch('/api/pi/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, piUsername }),
      });

      if (!response.ok) {
        console.error('Failed to reward Pi user');
      } else {
        console.log('Pi user rewarded');
      }
    } catch (error) {
      console.error('Error rewarding Pi user:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pi_user');
    localStorage.removeItem('pi_access_token');
  };

  const createPayment = async (amount: number, memo: string, metadata: any = {}) => {
    if (!window.Pi) {
      throw new Error('Pi SDK not loaded');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    const paymentData = {
      amount,
      memo,
      metadata: {
        ...metadata,
        user_uid: user.uid,
        timestamp: Date.now(),
      },
    };

    const callbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        console.log('[PI PAYMENT] 🔔 Ready for server approval:', paymentId);

        // **CRITICAL STEP 1**: Envoyer au serveur pour obtenir la signature
        try {
          const response = await fetch('/api/pi/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'approve',
              paymentId,
              amount,
              memo,
              user_uid: user.uid,
            }),
          });

          if (!response.ok) {
            console.error('[PI PAYMENT] ❌ Server returned error:', response.status);
            throw new Error(`Server approval failed: ${response.status}`);
          }

          const result = await response.json();
          console.log('[PI PAYMENT] ✅ Server approval response:', result);

          // **CRITICAL STEP 2**: Appeler completeServerApproval avec la signature
          // CECI EST ESSENTIAL - Sans cela, le paiement expire!
          if (result.signature && window.Pi && window.Pi.completeServerApproval) {
            console.log('[PI PAYMENT] 📝 Sending completion signature to SDK...');
            window.Pi.completeServerApproval(paymentId, result.signature);
            console.log('[PI PAYMENT] ✅ Signature sent to Pi SDK');
          } else {
            console.error('[PI PAYMENT] ❌ Missing signature or completeServerApproval not available');
            console.error('Signature:', result.signature ? 'present' : 'missing');
            console.error('Pi SDK:', window.Pi ? 'loaded' : 'not loaded');
          }
        } catch (error) {
          console.error('[PI PAYMENT] ❌ Server approval failed:', error);
          // Laisser le SDK gérer l'erreur (timeout ou cancel)
        }
      },

      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        console.log('[PI PAYMENT] ✨ Ready for server completion:', paymentId, txid);

        // **CRITICAL STEP 3**: Confirmer la complétion avec le serveur
        try {
          const response = await fetch('/api/pi/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'complete',
              paymentId,
              txid,
              amount,
              memo,
              user_uid: user.uid,
            }),
          });

          if (!response.ok) {
            console.error('[PI PAYMENT] ❌ Server completion returned error:', response.status);
            throw new Error(`Server completion failed: ${response.status}`);
          }

          const result = await response.json();
          console.log('[PI PAYMENT] ✅ Payment completed successfully!', result);

          // Déclencher les actions de succès (créditer ARTC, notifications, etc.)
          // TODO: Émettre un événement pour notifier les autres composants
        } catch (error) {
          console.error('[PI PAYMENT] ❌ Server completion failed:', error);
          // Le paiement est déjà sur la blockchain, mais pas enregistré dans notre DB
          // Il faudrait implementing une retry mechanism
        }
      },

      onCancel: (paymentId: string) => {
        console.log('[PI PAYMENT] ⚠️ Payment cancelled by user:', paymentId);
      },

      onError: (error: any, payment?: any) => {
        console.error('[PI PAYMENT] ❌ Payment error:', error);
        console.error('Payment details:', payment);
      },
    };

    return await window.Pi.createPayment(paymentData, callbacks);
  };

  // Callback pour paiements incomplets (retry des paiements échoués)
  const onIncompletePaymentFound = (payment: any) => {
    console.log('[PI PAYMENT] 🔄 Incomplete payment found:', payment);
    // Gérer les paiements incomplets (paiements qui ont échoué à mi-chemin)
    return {
      shouldHandle: true,
      callbacks: {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log('[PI PAYMENT] 🔄 Incomplete payment ready for approval:', paymentId);
          try {
            const response = await fetch('/api/pi/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'approve',
                paymentId,
                amount: payment?.amount,
                memo: payment?.memo,
              }),
            });
            if (response.ok) {
              const result = await response.json();
              if (result.signature && window.Pi?.completeServerApproval) {
                window.Pi.completeServerApproval(paymentId, result.signature);
              }
            }
          } catch (error) {
            console.error('[PI PAYMENT] Error handling incomplete payment approval:', error);
          }
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log('[PI PAYMENT] 🔄 Incomplete payment ready for completion:', paymentId, txid);
          try {
            await fetch('/api/pi/payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'complete',
                paymentId,
                txid,
                amount: payment?.amount,
                memo: payment?.memo,
              }),
            });
          } catch (error) {
            console.error('[PI PAYMENT] Error handling incomplete payment completion:', error);
          }
        },
        onCancel: (paymentId: string) => {
          console.log('[PI PAYMENT] 🔄 Incomplete payment cancelled:', paymentId);
        },
        onError: (error: any) => {
          console.error('[PI PAYMENT] 🔄 Incomplete payment error:', error);
        },
      },
    };
  };

  const value: PiContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    rewardPiUser,
    createPayment,
  };

  return (
    <PiContext.Provider value={value}>
      {children}
    </PiContext.Provider>
  );
}

export function usePi() {
  const context = useContext(PiContext);
  if (context === undefined) {
    throw new Error('usePi must be used within a PiProvider');
  }
  return context;
}