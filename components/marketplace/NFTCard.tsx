'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NFTItem } from '@/lib/mockNFTs';

interface NFTCardProps {
  nft: NFTItem;
}

export default function NFTCard({ nft }: NFTCardProps) {
  return (
    <Link href={`/explorer/${nft.id}`}>
      <motion.div
        whileHover={{ scale: 1.05, translateY: -8 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer h-full"
      >
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-yellow-500/50 h-full flex flex-col">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/5 group-hover:from-yellow-500/10 group-hover:to-yellow-500/5" />
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl" />
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
                  className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-500/50"
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
              <h3 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors line-clamp-2">
                {nft.title}
              </h3>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                par <span className="text-gray-300 font-medium">{nft.creator}</span>
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-800/50 pt-3 flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-xs text-gray-400">Prix</p>
                <p className="text-lg font-bold text-yellow-300">
                  {nft.price.toLocaleString('fr-FR', {
                    maximumFractionDigits: nft.priceType === 'Pi' ? 2 : 0,
                  })}{' '}
                  <span className="text-xs text-gray-400">
                    {nft.priceType}
                  </span>
                </p>
              </div>

              {/* Certified indicator */}
              {!nft.certified && (
                <div className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-400 font-medium">
                  Non certifié
                </div>
              )}
            </div>
          </div>

          {/* Hover button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-2 rounded-lg pointer-events-auto"
            >
              Voir détails
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
