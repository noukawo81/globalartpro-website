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
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          await window.Pi.init({ version: '2.0', sandbox: true });
          console.log('Pi SDK initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Pi SDK:', error);
        }
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
        console.log('Payment ready for server approval:', paymentId);

        // Envoyer au serveur pour validation
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
            throw new Error('Server approval failed');
          }

          const result = await response.json();
          console.log('Server approval result:', result);
        } catch (error) {
          console.error('Server approval error:', error);
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        console.log('Payment completed:', paymentId, txid);

        // Confirmer avec le serveur
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
            throw new Error('Server completion failed');
          }

          const result = await response.json();
          console.log('Server completion result:', result);

          // Ici, vous pouvez déclencher des actions comme créditer ARTC, notifications, etc.
        } catch (error) {
          console.error('Server completion error:', error);
        }
      },
      onCancel: (paymentId: string) => {
        console.log('Payment cancelled:', paymentId);
      },
      onError: (error: any, payment?: any) => {
        console.error('Payment error:', error, payment);
      },
    };

    return await window.Pi.createPayment(paymentData, callbacks);
  };

  // Callback pour paiements incomplets
  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    // Gérer les paiements incomplets
    return {
      shouldHandle: true,
      callbacks: {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Incomplete payment ready for approval:', paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Incomplete payment completed:', paymentId, txid);
        },
        onCancel: (paymentId: string) => {
          console.log('Incomplete payment cancelled:', paymentId);
        },
        onError: (error: any, payment?: any) => {
          console.error('Incomplete payment error:', error, payment);
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