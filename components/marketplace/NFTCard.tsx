'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { NFTItem } from '@/lib/mockNFTs';

const USD_RATES = {
  ARTC: 150, // 1 ARTC = 150 USD
  Pi: 10,   // 1 Pi = 10 USD
};

const OFFERED_PAYMENT_OPTIONS = ['USDT', 'PI', 'ARTC'] as const;

interface NFTCardProps {
  nft: NFTItem;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const router = useRouter();

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/artists`);
  };

  const priceInUSD = nft.priceType === 'ARTC' ? nft.price * USD_RATES.ARTC : nft.price * USD_RATES.Pi;

  const handleBuy = (currency: typeof OFFERED_PAYMENT_OPTIONS[number]) => {
    alert(`Achat de ${nft.title} pour ${nft.price} ${currency} (équivalent USD ≈ ${priceInUSD.toFixed(2)}).`);
  };

  return (
    <Link href={`/explorer/${nft.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, translateY: -8 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer h-full"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 h-full flex flex-col">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 group-hover:from-blue-500/10 group-hover:to-blue-500/5" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl" />
          </div>

          {/* Image container */}
          <div className="relative w-full aspect-square overflow-hidden bg-gray-950">
            <Image
              src={nft.image}
              alt={nft.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-white"
              >
                {nft.category}
              </motion.div>
            </div>

            {/* Certified badge */}
            {nft.certified && (
              <div className="absolute top-3 right-3 z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/50"
                >
                  <span className="text-sm font-bold">✓</span>
                </motion.div>
              </div>
            )}

            {/* View count overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
              <div className="text-xs text-gray-300">
                👁️ {(nft.views / 1000).toFixed(1)}K views
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col justify-between relative z-10">
            {/* Title & Creator */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                {nft.title}
              </h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                par{' '}
                <button
                  onClick={handleArtistClick}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline"
                >
                  {nft.creator}
                </button>
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-800/50 pt-3 flex flex-col gap-3">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Prix</p>
                <p className="text-lg font-bold text-blue-300">
                  {nft.price.toLocaleString('fr-FR', {
                    maximumFractionDigits: nft.priceType === 'Pi' ? 2 : 0,
                  })}{' '}
                  <span className="text-xs text-gray-400">
                    {nft.priceType}
                  </span>
                </p>
                <p className="text-xs text-gray-400">≈ {priceInUSD.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} USD</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {OFFERED_PAYMENT_OPTIONS.map((currency) => (
                  <button
                    key={currency}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBuy(currency);
                    }}
                    className="px-2 py-1 rounded-md bg-blue-700 text-xs text-white hover:bg-blue-600 transition"
                  >
                    Acheter en {currency}
                  </button>
                ))}
              </div>
            </div>

              {/* Certified indicator */}
              {!nft.certified && (
                <div className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-400 font-medium">
                  Non certifié
                </div>
              )}
            </div>

          {/* Hover button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2 rounded-lg pointer-events-auto hover:from-blue-500 hover:to-blue-400"
            >
              Voir détails
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
