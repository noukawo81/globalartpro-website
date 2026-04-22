export const config = {
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  pi: {
    appId: process.env.NEXT_PUBLIC_PI_APP_ID || 'globalartpro7927',
    sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === 'true',
    version: '2.0' as const,
    allowedDomains: [
      'localhost:3000',
      'globalartpro7927.pinet.com',
      'globalartpro.vercel.app',
      'globalartpro.com',
      'www.globalartpro.com'
    ],
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
  isDomainAllowed(): boolean {
    if (typeof window === 'undefined') return true;
    const currentDomain = window.location.host;
    return this.pi.allowedDomains.some(domain => 
      currentDomain === domain || currentDomain.endsWith('.' + domain)
    );
  },
};

export default config;
