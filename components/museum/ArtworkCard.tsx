'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MuseumArtwork } from '@/types/museum';

interface ArtworkCardProps {
  artwork: MuseumArtwork;
  index?: number;
}

export default function ArtworkCard({ artwork, index = 0 }: ArtworkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group cursor-pointer h-full"
    >
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:border-yellow-500/50 h-full flex flex-col">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/10 group-hover:from-yellow-500/15 group-hover:to-yellow-500/5" />
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl" />
        </div>

        {/* Image container */}
        <div className="relative w-full aspect-square overflow-hidden bg-gray-950">
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Overlay info on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p className="text-yellow-300 text-sm font-semibold">
              {artwork.medium && `${artwork.medium}`}
            </p>
            {artwork.year && (
              <p className="text-gray-400 text-xs">Année : {artwork.year}</p>
            )}
          </div>

          {/* Cultural origin badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-yellow-400/50 rounded-full text-xs font-semibold text-yellow-300 z-10"
          >
            {artwork.culturalOrigin}
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between relative z-10 space-y-3">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white group-hover:text-yellow-300 transition-colors line-clamp-2">
              {artwork.title}
            </h3>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
              par <span className="text-gray-300 font-medium">{artwork.artist}</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-3 group-hover:text-gray-400 transition-colors">
            {artwork.description}
          </p>

          {/* Footer - empty for spacing */}
          <div className="border-t border-gray-800/50 pt-2">
            <p className="text-xs text-yellow-400/70 font-medium">En exposition</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
