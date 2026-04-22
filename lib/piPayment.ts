export type PiPayment = {
  amount: number;
  memo: string;
  metadata: object;
};

export const initiatePiPayment = () => {
  console.log('Pi payment will be handled in App Studio environment');
};

// Fonction améliorée pour détecter le Pi Browser de manière asynchrone
export const isPiBrowserAsync = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Vérification immédiate
  if (window.Pi) {
    return true;
  }

  // Attendre jusqu'à 10 secondes maximum avec vérifications toutes les 500ms
  const maxWaitTime = 10000;
  const checkInterval = 500;
  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkSDK = () => {
      if (window.Pi) {
        console.log('[PI BROWSER] ✅ SDK Pi détecté');
        resolve(true);
        return;
      }

      if (Date.now() - startTime > maxWaitTime) {
        console.warn('[PI BROWSER] ⏰ Timeout: SDK Pi non détecté après 10 secondes');
        resolve(false);
        return;
      }

      // Relancer la vérification dans 500ms
      setTimeout(checkSDK, checkInterval);
    };

    // Démarrer la vérification
    checkSDK();
  });
};

export const isPiBrowser = () => {
  return typeof window !== 'undefined' && (window as any).Pi !== undefined;
};

// TODO:
// Intégrer Pi SDK ici uniquement en App Studio
// window.Pi.init()
// window.Pi.authenticate()
// window.Pi.createPayment()
