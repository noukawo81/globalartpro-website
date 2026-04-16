import { config } from '@/lib/config';
import Link from 'next/link';

export default function TestnetBanner() {
  if (!config.currency.isTest) return null;

  return (
    <div className="testnet-banner">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="test-badge">TESTNET</div>
          <p className="text-sm font-medium">
            Cette plateforme utilise <strong>{config.currency.name}</strong> - Pi de test gratuit
          </p>
        </div>
        <Link
          href="/aide/test-pi"
          className="text-sm underline hover:no-underline font-semibold"
        >
          Comment obtenir des Test Pi ?
        </Link>
      </div>
    </div>
  );
}
