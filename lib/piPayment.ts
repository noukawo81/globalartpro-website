export type PiPayment = {
  amount: number;
  memo: string;
  metadata: object;
};

export const initiatePiPayment = () => {
  console.log('Pi payment will be handled in App Studio environment');
};

export const isPiBrowser = () => {
  return typeof window !== 'undefined' && (window as any).Pi !== undefined;
};

// TODO:
// Intégrer Pi SDK ici uniquement en App Studio
// window.Pi.init()
// window.Pi.authenticate()
// window.Pi.createPayment()
