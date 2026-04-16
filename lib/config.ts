export const config = {
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  pi: {
    appId: process.env.NEXT_PUBLIC_PI_APP_ID || 'globalartproadac3428',
    sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === 'true',
    version: '2.0' as const,
  },
  currency: {
    name: process.env.NEXT_PUBLIC_CURRENCY_NAME || 'Test Pi',
    symbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'π (test)',
    isTest: true,
  },
  urls: {
    api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    website: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000',
  },
  formatPrice(amount: number): string {
    return `${amount} ${this.currency.symbol}`;
  },
  getDisclaimer(): string {
    return this.currency.isTest
      ? '🧪 Mode testnet - Utilisez Test Pi gratuit pour les tests'
      : '';
  },
};

export default config;
