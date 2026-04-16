'use client';

import { config } from '@/lib/config';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  showDisclaimer?: boolean;
}

export default function PriceDisplay({
  amount,
  className = '',
  showDisclaimer = true,
}: PriceDisplayProps) {
  return (
    <div className={`price-display ${className}`}>
      <div className="flex items-center gap-2">
        <span className="price-amount text-2xl font-bold text-white">
          {config.formatPrice(amount)}
        </span>
        {config.currency.isTest && (
          <span className="test-indicator text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
            TEST
          </span>
        )}
      </div>

      {showDisclaimer && config.currency.isTest && (
        <p className="price-disclaimer text-sm text-gray-300 mt-2">
          {config.getDisclaimer()}
        </p>
      )}
    </div>
  );
}
