'use client';

import { useEffect } from 'react';

export function PiMockProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mock Pi SDK for localhost development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.warn('🔧 Pi SDK mock enabled for localhost development');

      (window as any).Pi = {
        init: async (config?: any) => {
          console.log('🎭 Mock Pi.init called with config:', config);
          return { version: '2.0' };
        },
        authenticate: async (scopes: string[]) => {
          console.log('🎭 Mock Pi.authenticate called with scopes:', scopes);
          return {
            user: {
              username: 'test_user_localhost',
              uid: 'test_uid_localhost_' + Date.now()
            },
            accessToken: 'mock_token_' + Date.now()
          };
        },
        createPayment: async (paymentData: any, callbacks: any) => {
          console.log('🎭 Mock payment created:', paymentData);

          // Simulate async payment flow
          setTimeout(() => {
            console.log('🎭 Mock payment: onReadyForServerApproval');
            if (callbacks.onReadyForServerApproval) {
              callbacks.onReadyForServerApproval('mock_payment_' + Date.now());
            }

            setTimeout(() => {
              console.log('🎭 Mock payment: onReadyForServerCompletion');
              if (callbacks.onReadyForServerCompletion) {
                callbacks.onReadyForServerCompletion('mock_payment_' + Date.now(), 'mock_txid_' + Date.now());
              }
            }, 2000);
          }, 1000);

          return { id: 'mock_payment_' + Date.now() };
        }
      };

      console.log('✅ Pi SDK mock initialized');
    }
  }, []);

  return <>{children}</>;
}