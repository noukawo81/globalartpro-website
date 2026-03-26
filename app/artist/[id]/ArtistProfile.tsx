'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { mockNFTs } from '@/lib/mockNFTs';

interface ArtistProfile {
  id: string;
  name: string;
  verified: boolean;
  followers: number;
  artworks: typeof mockNFTs;
  description: string;
  country: string;
  culture: string;
}

interface Props {
  artist: ArtistProfile;
}

export function ArtistProfileContent({ artist }: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-blue-500/10 py-12 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8"
          >
            {/* Avatar */}
            <motion.div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 border-2 border-blue-500/30 flex items-center justify-center text-4xl">
              🎨
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl sm:text-5xl font-bold">{artist.name}</h1>
                {artist.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
              <p className="text-gray-400 mb-4">{artist.description}</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-bold text-blue-300">{artist.followers}</span>
                  <span className="text-gray-400"> Abonnés</span>
                </div>
                <div>
                  <span className="font-bold text-blue-300">{artist.artworks.length}</span>
                  <span className="text-gray-400"> Œuvres</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
              >
                Suivre
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 sm:flex-none px-6 py-2 border border-blue-500/50 text-blue-300 hover:bg-blue-500/10 font-bold rounded-lg transition-all"
              >
                Supporter
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Artworks */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            Galerie de {artist.name}
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artist.artworks.map((nft, idx) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link href={`/explorer/${nft.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/20 to-blue-900/5 border border-blue-500/20 hover:border-blue-500/50 transition-all"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-950 relative">
                      <img
                        src={nft.image}
                        alt={nft.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <div>
                          <h3 className="font-bold text-white line-clamp-2 mb-1">{nft.title}</h3>
                          <p className="text-blue-300 text-sm font-semibold">
                            {nft.price} {nft.priceType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Back button */}
      <section className="py-8 px-4 sm:px-6 text-center">
        <Link href="/explorer">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Retour à Explorer
          </motion.button>
        </Link>
      </section>
    </main>
  );
}

export function ArtistNotFound({ artistName }: { artistName: string }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-5xl mb-4">🎨</div>
          <h1 className="text-2xl font-bold mb-2">Artiste non trouvé</h1>
          <p className="text-gray-400 mb-6">L'artiste "{artistName}" n'existe pas</p>
          <Link href="/explorer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
            >
              Retour à Explorer
            </motion.button>
          </Link>
        </div>
      </div>
    </main>
  );
}
